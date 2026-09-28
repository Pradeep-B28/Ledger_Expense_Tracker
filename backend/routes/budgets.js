import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/budgets - list budgets with spent calculation for authenticated user
router.get('/', authMiddleware, requireAuth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    const transactions = await Transaction.find({ type: 'expense', userId: req.user.id });

    const result = budgets.map((b) => {
      const categoryTxs = transactions.filter((t) => t.category === b.category);
      const spent = categoryTxs.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      return {
        ...b.toObject(),
        spent,
        remaining: Math.max(0, b.limitAmount - spent),
        percentage: b.limitAmount > 0 ? Math.min(100, Math.round((spent / b.limitAmount) * 100)) : 0,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve budgets' });
  }
});

// POST /api/budgets - create budget for authenticated user
router.post('/', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { category, limitAmount, period, color } = req.body;
    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ error: 'Valid budget category is required' });
    }

    const numLimit = Number(limitAmount);
    if (isNaN(numLimit) || numLimit <= 0) {
      return res.status(400).json({ error: 'Budget limit amount must be a positive number' });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category: category.trim().slice(0, 50),
      limitAmount: numLimit,
      period: ['weekly', 'monthly', 'quarterly', 'yearly'].includes(period) ? period : 'monthly',
      color: typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#3b82f6',
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create budget' });
  }
});

// PUT /api/budgets/:id - update budget owned by authenticated user
router.put('/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { category, limitAmount, period, color } = req.body;
    const updateData = {};

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({ error: 'Valid category is required' });
      }
      updateData.category = category.trim().slice(0, 50);
    }

    if (limitAmount !== undefined) {
      const numLimit = Number(limitAmount);
      if (isNaN(numLimit) || numLimit <= 0) {
        return res.status(400).json({ error: 'Limit amount must be greater than zero' });
      }
      updateData.limitAmount = numLimit;
    }

    if (period !== undefined) {
      updateData.period = ['weekly', 'monthly', 'quarterly', 'yearly'].includes(period) ? period : 'monthly';
    }

    if (color !== undefined) {
      updateData.color = typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#3b82f6';
    }

    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Budget not found or unauthorized' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update budget' });
  }
});

// DELETE /api/budgets/:id - delete budget owned by authenticated user
router.delete('/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found or unauthorized' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete budget' });
  }
});

export default router;
