import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Ensure this field is unique and acts as the identifier
  meals: [{ description: String, calories: Number, protein: Number, fat: Number, carbs: Number }],
  dailyCalories: Number,
  dailyGoal: { type: Number, default: 2000 }
});

export default mongoose.model('User', userSchema);
