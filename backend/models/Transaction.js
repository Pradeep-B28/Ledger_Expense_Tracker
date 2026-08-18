import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  accountId: { type: String, default: 'main' },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  type: {
    type: String,
    enum: ['expense', 'income', 'transfer'],
    default: 'expense',
  },
  category: {
    type: String,
    required: true,
    default: 'Other',
  },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  receiptUrl: { type: String, default: '' },
  tags: [{ type: String }],
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
