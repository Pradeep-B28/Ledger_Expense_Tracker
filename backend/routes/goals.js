import express from 'express';
import SavingsGoal from '../models/SavingsGoal.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/goals - list only authenticated user's goals
router.get('/', authMiddleware, requireAuth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve savings goals' });
  }
});

// POST /api/goals - create savings goal for authenticated user
router.post('/', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, category, color, icon } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Valid goal name is required' });
    }

    const numTarget = Number(targetAmount);
    if (isNaN(numTarget) || numTarget <= 0) {
      return res.status(400).json({ error: 'Target amount must be a positive number' });
    }

    const numCurrent = Math.max(0, Number(currentAmount || 0));

    const goal = await SavingsGoal.create({
      userId: req.user.id,
      name: name.trim().slice(0, 80),
      targetAmount: numTarget,
      currentAmount: numCurrent,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      category: typeof category === 'string' ? category.trim().slice(0, 50) : 'General',
      color: typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#10b981',
      icon: typeof icon === 'string' ? icon.slice(0, 30) : 'Target',
      isCompleted: numCurrent >= numTarget,
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create savings goal' });
  }
});

// PUT /api/goals/:id - update or deposit funds into goal owned by authenticated user
router.put('/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, depositAmount, targetDate, category, color, icon } = req.body;

    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ error: 'Goal not found or unauthorized' });

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Goal name cannot be empty' });
      }
      goal.name = name.trim().slice(0, 80);
    }

    if (targetAmount !== undefined) {
      const numTarget = Number(targetAmount);
      if (isNaN(numTarget) || numTarget <= 0) {
        return res.status(400).json({ error: 'Target amount must be positive' });
      }
      goal.targetAmount = numTarget;
    }

    if (category !== undefined) {
      goal.category = typeof category === 'string' ? category.trim().slice(0, 50) : 'General';
    }

    if (color !== undefined) {
      goal.color = typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#10b981';
    }

    if (icon !== undefined) {
      goal.icon = typeof icon === 'string' ? icon.slice(0, 30) : 'Target';
    }

    if (targetDate !== undefined) {
      goal.targetDate = targetDate ? new Date(targetDate) : undefined;
    }

    if (depositAmount !== undefined) {
      const numDeposit = Number(depositAmount);
      if (isNaN(numDeposit) || numDeposit < 0) {
        return res.status(400).json({ error: 'Deposit amount must be non-negative' });
      }
      goal.currentAmount += numDeposit;
    } else if (currentAmount !== undefined) {
      const numCurrent = Number(currentAmount);
      if (isNaN(numCurrent) || numCurrent < 0) {
        return res.status(400).json({ error: 'Current amount must be non-negative' });
      }
      goal.currentAmount = numCurrent;
    }

    goal.isCompleted = goal.currentAmount >= goal.targetAmount;

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update goal' });
  }
});

// DELETE /api/goals/:id - delete goal owned by authenticated user
router.delete('/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const deleted = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Goal not found or unauthorized' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete goal' });
  }
});

export default router;
