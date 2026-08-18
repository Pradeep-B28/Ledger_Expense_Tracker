import express from 'express';
import SavingsGoal from '../models/SavingsGoal.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/goals
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user) query.userId = req.user.id;

    const goals = await SavingsGoal.find(query).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/goals
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, category, color, icon } = req.body;
    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'Goal name and targetAmount are required' });
    }

    const goal = await SavingsGoal.create({
      userId: req.user ? req.user.id : null,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate: targetDate ? new Date(targetDate) : undefined,
      category: category || 'General',
      color: color || '#10b981',
      icon: icon || 'Target',
      isCompleted: Number(currentAmount || 0) >= Number(targetAmount),
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/goals/:id - update or deposit funds
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, depositAmount, targetDate, category, color, icon } = req.body;

    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (name) goal.name = name;
    if (targetAmount) goal.targetAmount = Number(targetAmount);
    if (category) goal.category = category;
    if (color) goal.color = color;
    if (icon) goal.icon = icon;
    if (targetDate) goal.targetDate = new Date(targetDate);

    if (depositAmount !== undefined) {
      goal.currentAmount += Number(depositAmount);
    } else if (currentAmount !== undefined) {
      goal.currentAmount = Number(currentAmount);
    }

    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await SavingsGoal.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
