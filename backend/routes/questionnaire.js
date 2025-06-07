// routes/questionnaire.js

import express from 'express';
import Questionnaire from '../models/Questionnaire.js';

const router = express.Router();

// POST /api/questionnaire
router.post('/questionnaire', async (req, res) => {
  const {
    userId,
    name,
    age,
    gender,
    weight,
    height,
    goal,
    mealFrequency,
    cookingTimeWeekday,
    cookingTimeWeekend,
    restrictions,
    eatingStyle,
    proteinPreference,
    rotiRicePreference,
    oilFatPreference,
    healthIssues,
    exerciseFrequency,
    energyLevel,
    budgetPriority,
    eatingOutFrequency,
  } = req.body;

  const requiredFields = [
    'userId',
    'name',
    'age',
    'gender',
    'weight',
    'height',
    'goal',
    'mealFrequency',
    'cookingTimeWeekday',
    'cookingTimeWeekend',
    'restrictions',
    'eatingStyle',
    'proteinPreference',
    'rotiRicePreference',
    'oilFatPreference',
    'healthIssues',
    'exerciseFrequency',
    'energyLevel',
    'budgetPriority',
    'eatingOutFrequency',
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    return res.status(400).json({
      error: `Missing fields: ${missingFields.join(', ')}`,
    });
  }

  try {
    const existingUser = await Questionnaire.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: 'Questionnaire already submitted.' });
    }

    const questionnaire = new Questionnaire({
      userId,
      name,
      age,
      gender,
      weight,
      height,
      goal,
      mealFrequency,
      cookingTimeWeekday,
      cookingTimeWeekend,
      restrictions,
      eatingStyle,
      proteinPreference,
      rotiRicePreference,
      oilFatPreference,
      healthIssues,
      exerciseFrequency,
      energyLevel,
      budgetPriority,
      eatingOutFrequency,
    });

    await questionnaire.save();

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = new User({ clerkId: userId });
      await user.save();
    }

    return res.json({ success: true, message: 'Questionnaire saved.' });
  } catch (err) {
    console.error('Error saving questionnaire:', err);
    return res.status(500).json({ error: 'Error saving questionnaire.', details: err.message });
  }
});

export default router;  // Ensure you are using export default
