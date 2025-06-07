// backend/routes/mealPlan.js

import express from 'express';
import Questionnaire from '../models/Questionnaire.js';

const router = express.Router();

// GET /api/meal-plan/:userId
// Fetch the saved meal plan for a user
router.get('/:userId', async (req, res) => {
  try {
    const user = await Questionnaire.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const mealPlan = user.mealPlan || { days: [] };
    // If mealPlan is stored as rawText, try to parse it
    if (mealPlan.rawText) {
      try {
        let cleanedText = mealPlan.rawText.replace(/```json|```/g, '').trim();
        cleanedText = cleanedText
          .replace(/"\s*}\s*"/g, '", "')
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
          .replace(/,(\s*[}\]])/g, '$1')
          .replace(/"(\s*)\](\s*)"/g, '", "')
          .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1')
          .replace(/(\d+)(g|k?cal|cal)/g, '$1');
        const parsed = JSON.parse(cleanedText);
        const days = parsed.days || parsed.mealPlan?.days || [];
        return res.json({ mealPlan: { days } });
      } catch (e) {
        console.error('Failed to parse stored mealPlan:', e);
        return res.json({ mealPlan: { days: [] } });
      }
    }

    if (!Array.isArray(mealPlan.days)) {
      return res.json({ mealPlan: { days: [] } });
    }

    res.json({ mealPlan });
  } catch (err) {
    console.error('Error fetching meal plan:', err);
    res.status(500).json({ error: 'Failed to fetch meal plan.' });
  }
});

export default router;
