import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  category: { type: String, required: true },
  limitAmount: { type: Number, required: true, min: 0 },
  period: { type: String, enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' },
  color: { type: String, default: '#3b82f6' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Budget', budgetSchema);
