// backend/routes/processMeal.js

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import User from '../models/User.js';
import Questionnaire from '../models/Questionnaire.js';

const router = express.Router();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Simple “X-User-Id” header auth ───────────────────────────────
function userAuthMiddleware(req, res, next) {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return res
      .status(401)
      .json({ error: 'Not authenticated. Missing X-User-Id header.' });
  }
  req.userId = userId;
  next();
}

// ─── POST /api/process-meal ───────────────────────────────────────
router.post('/', userAuthMiddleware, async (req, res) => {
  try {
    const { macros, prompt } = req.body;
    const userId = req.userId;

    // ── STEP 1: Load the user’s saved 7-day plan from Questionnaire ──
    let mealPlanJSON = null;
    try {
      const mealPlanDoc = await Questionnaire.findOne({ userId });
      console.log('➤ Loaded mealPlanDoc:', mealPlanDoc);

      if (
        mealPlanDoc &&
        mealPlanDoc.mealPlan &&
        Array.isArray(mealPlanDoc.mealPlan.days)
      ) {
        mealPlanJSON = mealPlanDoc.mealPlan;
        console.log('➤ Parsed mealPlanJSON:', JSON.stringify(mealPlanJSON));
      } else {
        console.log('➤ No valid mealPlan found for user:', userId);
      }
    } catch (dbErr) {
      console.error('⚠️ Error fetching meal plan:', dbErr);
    }

    // Convert the plan to a compact JSON string (no extra whitespace)
    let planString = '';
    if (mealPlanJSON) {
      planString = JSON.stringify(mealPlanJSON);
    }

    // ── STEP 2: Build a very concise Gemini prompt with HTML <strong> ──
    const lines = [];

    // 2A) Always include plan context (or a “no plan” note)
    if (planString) {
      lines.push(`Here is the user’s saved 7-day meal plan (JSON):\n${planString}`);
    } else {
      lines.push(`No saved meal plan found for user ${userId}.`);
    }

    if (macros) {
      // CASE A: Macros exist (user uploaded an image)
      const percent = Math.round((macros.calories / 2000) * 100);
      lines.push(`
The user’s most recent meal macros are:
• <strong>Calories:</strong> ${macros.calories} kcal  
• <strong>Protein:</strong> ${macros.protein} g  
• <strong>Fat:</strong> ${macros.fat} g  
• <strong>Carbs:</strong> ${macros.carbs} g  

User note: "${prompt || ''}"

Please answer in no more than FOUR lines total, using HTML <strong> for bold labels. Include:
1) All four macros in one line (e.g. “<strong>Calories:</strong> 972 kcal; <strong>Protein:</strong> 36 g; …”).  
2) “<strong>Today’s calories:</strong> [sum] kcal / 2000 kcal ([percent]% of goal)”.  
3) “Next meal: [one meal from the saved plan]”.  
4) A one-sentence tip.  

**Output format (use `<br>` for each line break):**  
<strong>Calories:</strong> ___ kcal; <strong>Protein:</strong> __ g; <strong>Fat:</strong> __ g; <strong>Carbs:</strong> __ g.<br>  
<strong>Today’s calories:</strong> __ kcal / 2000 kcal (__% of goal).
Next meal: [one meal from plan].
Tip: [one-sentence].
      `.trim());
    } else {
      // CASE B: No macros (user only typed text)
      lines.push(`
User wrote: "${prompt || ''}"

As a nutrition coach, and using the plan above if it exists, respond in **no more than TWO lines** (use `<br>`):
1) Acknowledge their question in context of the plan.
2) Give a quick suggestion referencing the plan.  

If there’s no plan, simply give a two-line friendly tip.
      `.trim());
    }

    // Combine lines into a single prompt string
    const geminiPrompt = lines.join('\n\n');
    console.log('➤ Final Gemini prompt:\n', geminiPrompt);

    // ── STEP 3: Call Gemini (Google GenAI) ───────────────────────────
    const chatRes = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: geminiPrompt }],
        },
      ],
    });
    const geminiText =
      chatRes?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('➤ Gemini responded:\n', geminiText);

    // ── STEP 4: If macros exist, record this meal in User and update totals ──
    let updatedTotals = null;
    if (macros) {
      let userDoc = await User.findById(userId);
      if (!userDoc) {
        userDoc = new User({ _id: userId });
      }
      userDoc.meals.push({
        description: macros.food,
        calories: macros.calories,
        protein: macros.protein,
        fat: macros.fat,
        carbs: macros.carbs,
      });

      // Recompute today's total
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayCalories = userDoc.meals
        .filter((m) => m.timestamp >= startOfDay)
        .reduce((sum, m) => sum + m.calories, 0);

      userDoc.dailyCalories = todayCalories;
      await userDoc.save();

      updatedTotals = {
        todayCalories,
        dailyGoal: userDoc.dailyGoal || 2000,
        percentage: Math.round(
          (todayCalories / (userDoc.dailyGoal || 2000)) * 100
        ),
      };
    }

    // ── STEP 5: Return the HTML‐formatted reply and updatedTotals (if any) ──
    return res.json({ geminiText, updatedTotals });
  } catch (error) {
    console.error('❌ Error in /api/process-meal:', error);
    console.error(error.stack);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
