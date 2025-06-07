import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import processMealRouter from './routes/processMeal.js';
import Questionnaire from './models/Questionnaire.js';
import User from './models/User.js';

dotenv.config();

// Path helpers (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check required environment variables
const requiredEnvVars = ['MONGODB_URI', 'GEMINI_API_KEY', 'PORT'];
const missing = requiredEnvVars.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize Google GenAI (Gemini)
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simple "X-User-Id" header authentication
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

// ─────────────────────────────────────────────────────────────────────────
// 1. Check if a user has completed their questionnaire & has a meal plan
// ─────────────────────────────────────────────────────────────────────────
app.get('/api/user-questionnaire/:userId', async (req, res) => {
  try {
    const user = await Questionnaire.findOne({ userId: req.params.userId });
    if (!user) {
      return res.json({ hasCompletedQuestionnaire: false });
    }
    res.json({
      hasCompletedQuestionnaire: true,
      hasMealPlan: !!user.mealPlan,
      mealPlan: user.mealPlan || null,
    });
  } catch (err) {
    console.error('Error in /api/user-questionnaire:', err);
    res.status(500).json({ error: 'Server error checking questionnaire.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// 2. Save Questionnaire Answers
// ─────────────────────────────────────────────────────────────────────────
app.post('/api/questionnaire', async (req, res) => {
  const data = req.body;
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

  const missingFields = requiredFields.filter((k) => !data[k]);
  if (missingFields.length) {
    return res
      .status(400)
      .json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }

  try {
    const existing = await Questionnaire.findOne({ userId: data.userId });
    if (existing) {
      return res.status(400).json({ error: 'Questionnaire already submitted.' });
    }

    // Save the questionnaire data
    await Questionnaire.create(data);

    // Also ensure a corresponding User document exists (for tracking daily calories)
    let userDoc = await User.findById(data.userId);
    if (!userDoc) {
      userDoc = new User({ _id: data.userId });
      await userDoc.save();
    }

    res.json({ success: true, message: 'Questionnaire saved.' });
  } catch (err) {
    console.error('Error saving questionnaire:', err);
    res.status(500).json({ error: 'Error saving questionnaire.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// 3. Generate a 7-day Meal Plan via Gemini (Google GenAI)
// ─────────────────────────────────────────────────────────────────────────
app.post('/api/generate-meal-plan', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const userQ = await Questionnaire.findOne({ userId });
    if (!userQ) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Build the Gemini prompt requesting a strict JSON output
    const prompt = `
Generate a personalized 7-day Indian meal plan based on:
- Name: ${userQ.name}, Age: ${userQ.age}, Gender: ${userQ.gender}
- Height: ${userQ.height} cm, Weight: ${userQ.weight} kg
- Goal: ${userQ.goal}, Meals per day: ${userQ.mealFrequency}
- Cooking Time (Weekday): ${userQ.cookingTimeWeekday}, (Weekend): ${userQ.cookingTimeWeekend}
- Dietary Restrictions: ${userQ.restrictions}
- Eating Style: ${userQ.eatingStyle}
- Protein Preference: ${userQ.proteinPreference}
- Roti/Rice Preference: ${userQ.rotiRicePreference}
- Oil/Fat Preference: ${userQ.oilFatPreference}
- Health Issues: ${userQ.healthIssues}
- Exercise Frequency: ${userQ.exerciseFrequency}, Energy Level: ${userQ.energyLevel}
- Budget Priority: ${userQ.budgetPriority}, Eats Out Frequency: ${userQ.eatingOutFrequency}

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
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('No text returned from Gemini.');
    }

    // Try to clean and parse the JSON response
    let mealPlanToStore;
    try {
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      let fixedText = cleanedText
        // Fix common JSON formatting issues:
        .replace(/"\s*}\s*"/g, '", "')
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');

      const parsed = JSON.parse(fixedText);
      const outer = parsed.mealPlan || parsed;
      if (outer.days && Array.isArray(outer.days) && outer.days.length === 7) {
        // Validate each day’s structure
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
                fat: Number(day.breakfast.nutrition?.fat) || 0,
              },
            },
            lunch: {
              item: day.lunch.item || '',
              nutrition: {
                calories: Number(day.lunch.nutrition?.calories) || 0,
                protein: Number(day.lunch.nutrition?.protein) || 0,
                carbs: Number(day.lunch.nutrition?.carbs) || 0,
                fat: Number(day.lunch.nutrition?.fat) || 0,
              },
            },
            dinner: {
              item: day.dinner.item || '',
              nutrition: {
                calories: Number(day.dinner.nutrition?.calories) || 0,
                protein: Number(day.dinner.nutrition?.protein) || 0,
                carbs: Number(day.dinner.nutrition?.carbs) || 0,
                fat: Number(day.dinner.nutrition?.fat) || 0,
              },
            },
            snacks: {
              item: day.snacks.item || '',
              nutrition: {
                calories: Number(day.snacks.nutrition?.calories) || 0,
                protein: Number(day.snacks.nutrition?.protein) || 0,
                carbs: Number(day.snacks.nutrition?.carbs) || 0,
                fat: Number(day.snacks.nutrition?.fat) || 0,
              },
            },
          };
        });
        mealPlanToStore = { days: validatedDays };
      } else {
        // If parsing fails or not exactly 7 days, store raw text
        mealPlanToStore = { rawText };
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini JSON:', parseError);
      mealPlanToStore = { rawText };
    }

    // Upsert into Questionnaire
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

// ─────────────────────────────────────────────────────────────────────────
// 4. Fetch Meal Plan for a Given User
// ─────────────────────────────────────────────────────────────────────────
app.get('/api/meal-plan/:userId', async (req, res) => {
  try {
    const userQ = await Questionnaire.findOne({ userId: req.params.userId });
    if (!userQ) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let mealPlan = userQ.mealPlan || { days: [] };
    if (mealPlan.rawText) {
      try {
        const cleanedText = mealPlan.rawText.replace(/```json|```/g, '').trim();
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

    return res.json({ mealPlan });
  } catch (err) {
    console.error('Error fetching meal plan:', err);
    return res.status(500).json({ error: 'Failed to fetch meal plan.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// 5. (Optional) Test Gemini Connection
// ─────────────────────────────────────────────────────────────────────────
app.get('/api/test-gemini', async (req, res) => {
  try {
    const result = await genAI.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Hello from Gemini! How are you?' }],
        },
      ],
    });
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.json({ success: true, reply });
  } catch (err) {
    console.error('Gemini test error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// 6. Process Meal (Image + Text OR Text-Only) → Gemini Chat
// ─────────────────────────────────────────────────────────────────────────
app.post('/api/process-meal', userAuthMiddleware, async (req, res) => {
  try {
    const { macros, prompt } = req.body;
    const userId = req.userId;

    // ── STEP 1: Load the user's saved 7-day meal plan ──
    let mealPlanJSON = null;
    try {
      const planDoc = await Questionnaire.findOne({ userId });
      console.log('➤ Loaded mealPlanDoc for /api/process-meal:', planDoc);

      if (
        planDoc &&
        planDoc.mealPlan &&
        Array.isArray(planDoc.mealPlan.days)
      ) {
        mealPlanJSON = planDoc.mealPlan;
        console.log('➤ Parsed mealPlanJSON:', JSON.stringify(mealPlanJSON));
      } else {
        console.log('➤ No valid mealPlan found for user:', userId);
      }
    } catch (dbErr) {
      console.error('⚠️ Error fetching mealPlan in /api/process-meal:', dbErr);
    }

    // Convert plan JSON to a compact string if it exists
    let planString = '';
    if (mealPlanJSON) {
      planString = JSON.stringify(mealPlanJSON);
    }

    // ── STEP 2: Build the concise Gemini prompt without <br> ──
    const lines = [];

    // Always inject the plan context (or a "no plan" note)
    if (planString) {
      lines.push(`Here is the user's saved 7-day meal plan (JSON):\n${planString}`);
    } else {
      lines.push(`No saved meal plan found for user ${userId}.`);
    }

    if (macros) {
      // CASE A: Macros exist (image was uploaded)
      const percent = Math.round((macros.calories / 2000) * 100);
      lines.push(`
The user's most recent meal macros are:
• Calories: ${macros.calories} kcal  
• Protein: ${macros.protein} g  
• Fat: ${macros.fat} g  
• Carbs: ${macros.carbs} g  

User note: "${prompt || ''}"

Please respond in **no more than FOUR lines**. Include:
1) All four macros in one line (e.g. "Calories: 972 kcal; Protein: 36 g; ...").  
2) "Today's calories: [sum] kcal / 2000 kcal ([percent]% of goal)".  
3) "Next meal: [one meal from the saved plan]".  
4) A one-sentence tip.
      `.trim());
    } else {
      // CASE B: No macros (user only sent a text prompt)
      lines.push(`
User wrote: "${prompt || ''}"

As a nutrition coach, and using the plan above if it exists, respond in **no more than TWO lines**:
1) Acknowledge their question in context of the plan.
2) Give a quick suggestion referencing the plan.  

If there's no plan, give a two-line friendly tip.
      `.trim());
    }

    // Combine lines into the final prompt
    const geminiPrompt = lines.join('\n\n');
    console.log('➤ Final Gemini prompt sent to /api/process-meal:\n', geminiPrompt);

    // ── STEP 3: Call Gemini (Google GenAI) ─────────────────────
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
    console.log('➤ Gemini responded to /api/process-meal:\n', geminiText);

    // ── STEP 4: If macros exist, record this meal in User and update totals ──
    let updatedTotals = null;
    if (macros) {
      console.log('➤ /api/process-meal saving macros to User collection for userId:', userId);

      let userDoc = await User.findById(userId);
      if (!userDoc) {
        console.log('➤ No existing User found—creating new User for ID:', userId);
        userDoc = new User({ _id: userId });
      }

      userDoc.meals.push({
        description: macros.food,
        calories: macros.calories,
        protein: macros.protein,
        fat: macros.fat,
        carbs: macros.carbs,
      });

      // Recompute today's total calories:
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayCalories = userDoc.meals
        .filter((m) => m.timestamp >= startOfDay)
        .reduce((sum, m) => sum + m.calories, 0);

      userDoc.dailyCalories = todayCalories;
      console.log('➤ Saving updated User doc with new meals:', userDoc);
      await userDoc.save();

      updatedTotals = {
        todayCalories,
        dailyGoal: userDoc.dailyGoal || 2000,
        percentage: Math.round(
          (todayCalories / (userDoc.dailyGoal || 2000)) * 100
        ),
      };
      console.log('➤ Computed updatedTotals:', updatedTotals);
    }

    // ── STEP 5: Return the Gemini text + updatedTotals if any ──
    return res.json({ geminiText, updatedTotals });
  } catch (error) {
    // Log full stack for debugging
    console.error('❌ Error in /api/process-meal:', error);
    console.error(error.stack);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.use('/api/process-meal', processMealRouter);

// Start the Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
