import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['cash', 'bank', 'credit', 'savings', 'investment'],
    default: 'bank',
  },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  color: { type: String, default: '#6366f1' },
  icon: { type: String, default: 'Wallet' },
  accountNumber: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Account', accountSchema);
