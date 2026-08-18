import mongoose from 'mongoose';

const savingsGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true, min: 1 },
  currentAmount: { type: Number, default: 0, min: 0 },
  targetDate: { type: Date },
  category: { type: String, default: 'General' },
  color: { type: String, default: '#10b981' },
  icon: { type: String, default: 'Target' },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SavingsGoal', savingsGoalSchema);
