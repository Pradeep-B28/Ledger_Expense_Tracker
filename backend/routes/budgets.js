import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/budgets - list budgets with current spent calculation
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user) query.userId = req.user.id;

    const budgets = await Budget.find(query);
    const txQuery = { type: 'expense', ...(req.user ? { userId: req.user.id } : {}) };
    const transactions = await Transaction.find(txQuery);

    const result = budgets.map((b) => {
      const categoryTxs = transactions.filter((t) => t.category === b.category);
      const spent = categoryTxs.reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        ...b.toObject(),
        spent,
        remaining: Math.max(0, b.limitAmount - spent),
        percentage: Math.min(100, Math.round((spent / b.limitAmount) * 100)),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/budgets
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category, limitAmount, period, color } = req.body;
    if (!category || !limitAmount) {
      return res.status(400).json({ error: 'Category and limitAmount are required' });
    }

    const budget = await Budget.create({
      userId: req.user ? req.user.id : null,
      category,
      limitAmount: Number(limitAmount),
      period: period || 'monthly',
      color: color || '#3b82f6',
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/budgets/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { category, limitAmount, period, color } = req.body;
    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      { category, limitAmount: Number(limitAmount), period, color },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/budgets/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
