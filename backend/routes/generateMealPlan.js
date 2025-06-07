// backend/routes/generateMealPlan.js

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Questionnaire from '../models/Questionnaire.js';

const router = express.Router();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/generate-meal-plan
// Uses Gemini to generate a 7-day meal plan for a user
router.post('/', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const user = await Questionnaire.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const prompt = `
Generate a personalized 7-day Indian meal plan based on:
- Name: ${user.name}, Age: ${user.age}, Gender: ${user.gender}
- Height: ${user.height} cm, Weight: ${user.weight} kg
- Goal: ${user.goal}, Meals per day: ${user.mealFrequency}
- Cooking Time (Weekday): ${user.cookingTimeWeekday}, (Weekend): ${user.cookingTimeWeekend}
- Dietary Restrictions: ${user.restrictions}
- Eating Style: ${user.eatingStyle}
- Protein Preference: ${user.proteinPreference}
- Roti/Rice Preference: ${user.rotiRicePreference}
- Oil/Fat Preference: ${user.oilFatPreference}
- Health Issues: ${user.healthIssues}
- Exercise Frequency: ${user.exerciseFrequency}, Energy Level: ${user.energyLevel}
- Budget Priority: ${user.budgetPriority}, Eats Out Frequency: ${user.eatingOutFrequency}

**Important**: Output must be valid JSON only—no markdown fences or extra text.
The JSON must have exactly this structure:
{
  "days": [
    {
      "day": "Monday",
      "breakfast": {
        "item": "meal description",
        "nutrition": {
          "calories": 500,
          "protein": 20,
          "carbs": 60,
          "fat": 15
        }
      },
      "lunch": {
        "item": "meal description",
        "nutrition": {
          "calories": 600,
          "protein": 25,
          "carbs": 70,
          "fat": 20
        }
      },
      "dinner": {
        "item": "meal description",
        "nutrition": {
          "calories": 550,
          "protein": 22,
          "carbs": 65,
          "fat": 18
        }
      },
      "snacks": {
        "item": "meal description",
        "nutrition": {
          "calories": 200,
          "protein": 8,
          "carbs": 25,
          "fat": 7
        }
      }
    }
  ]
}

Rules:
1. Each day must have "day" as the full day name (e.g., "Monday", "Tuesday", etc.).
2. Each meal must have "item" and "nutrition" fields.
3. Nutrition values must be numbers only (no units).
4. The days array must contain exactly 7 days, starting from Monday.
5. Do not include any text before or after the JSON.
6. Do not use markdown formatting.
7. Ensure all property names are in double quotes.
8. Use proper JSON syntax with commas.

Respond with that JSON exactly.`;

    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    });

    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('No text returned from Gemini.');
    }

    let mealPlanToStore;
    try {
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      let fixedText = cleanedText
        // Fix missing commas between properties
        .replace(/"\s*}\s*"/g, '", "')
        // Fix missing quotes around property names
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Remove any non-JSON text before/after the object
        .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1')
        // Remove units from nutrition values
        .replace(/(\\d+)(g|k?cal|cal)/gi, '$1');

      const parsed = JSON.parse(fixedText);
      const outer = parsed.mealPlan || parsed;
      if (outer.days && Array.isArray(outer.days) && outer.days.length === 7) {
        const validatedDays = outer.days.map((day) => {
          if (
            !day.day ||
            !day.breakfast ||
            !day.lunch ||
            !day.dinner ||
            !day.snacks
          ) {
            throw new Error('Invalid day structure');
          }
          return {
            day: day.day,
            breakfast: {
              item: day.breakfast.item || '',
              nutrition: {
                calories: Number(day.breakfast.nutrition?.calories) || 0,
                protein: Number(day.breakfast.nutrition?.protein) || 0,
                carbs: Number(day.breakfast.nutrition?.carbs) || 0,
                fat: Number(day.breakfast.nutrition?.fat) || 0
              }
            },
            lunch: {
              item: day.lunch.item || '',
              nutrition: {
                calories: Number(day.lunch.nutrition?.calories) || 0,
                protein: Number(day.lunch.nutrition?.protein) || 0,
                carbs: Number(day.lunch.nutrition?.carbs) || 0,
                fat: Number(day.lunch.nutrition?.fat) || 0
              }
            },
            dinner: {
              item: day.dinner.item || '',
              nutrition: {
                calories: Number(day.dinner.nutrition?.calories) || 0,
                protein: Number(day.dinner.nutrition?.protein) || 0,
                carbs: Number(day.dinner.nutrition?.carbs) || 0,
                fat: Number(day.dinner.nutrition?.fat) || 0
              }
            },
            snacks: {
              item: day.snacks.item || '',
              nutrition: {
                calories: Number(day.snacks.nutrition?.calories) || 0,
                protein: Number(day.snacks.nutrition?.protein) || 0,
                carbs: Number(day.snacks.nutrition?.carbs) || 0,
                fat: Number(day.snacks.nutrition?.fat) || 0
              }
            }
          };
        });
        mealPlanToStore = { days: validatedDays };
      } else {
        mealPlanToStore = { rawText };
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini JSON:', parseError);
      mealPlanToStore = { rawText };
    }

    await Questionnaire.updateOne(
      { userId },
      { mealPlan: mealPlanToStore },
      { upsert: true }
    );
    return res.json({ success: true, mealPlan: mealPlanToStore });
  } catch (err) {
    console.error('🚨 generate-meal-plan error:', err);
    return res.status(500).json({ error: 'Failed to generate meal plan.' });
  }
});

export default router;
