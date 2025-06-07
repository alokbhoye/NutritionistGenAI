import mongoose from 'mongoose';

const dayNutritionSchema = new mongoose.Schema({
  item: String,
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: String,
  breakfast: dayNutritionSchema,
  lunch: dayNutritionSchema,
  dinner: dayNutritionSchema,
  snacks: dayNutritionSchema
}, { _id: false });

const questionnaireSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  goal: String,
  mealFrequency: String,
  cookingTimeWeekday: String,
  cookingTimeWeekend: String,
  restrictions: String,
  eatingStyle: String,
  proteinPreference: String,
  rotiRicePreference: String,
  oilFatPreference: String,
  healthIssues: String,
  exerciseFrequency: String,
  energyLevel: String,
  budgetPriority: String,
  eatingOutFrequency: String,
  mealPlan: {
    days: [daySchema]
  }
});

// Ensure the uniqueness of userId (Clerk's userId as MongoDB _id)
questionnaireSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('Questionnaire', questionnaireSchema);
