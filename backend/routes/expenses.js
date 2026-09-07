import express from 'express';
import Transaction from '../models/Transaction.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/expenses - get all transactions with filters & search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, type, search, startDate, endDate, accountId, limit = 100 } = req.query;
    
    let query = {};
    if (req.user) {
      query.userId = req.user.id;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (accountId) {
      query.accountId = accountId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(Number(limit));

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/stats - statistical breakdown for dashboard & charts
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query.userId = req.user.id;
    }

    const transactions = await Transaction.find(query);

    let totalExpense = 0;
    let totalIncome = 0;
    const categoryTotals = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

    res.json({
      totalExpense,
      totalIncome,
      netSavings,
      savingsRate,
      count: transactions.length,
      categoryTotals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses - create transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type, date, notes, receiptUrl, isRecurring, recurringFrequency, accountId } = req.body;
    if (!title || amount === undefined) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }

    const newTx = await Transaction.create({
      userId: req.user ? req.user.id : null,
      title,
      amount: Number(amount),
      category: category || 'Other',
      type: type || 'expense',
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
      receiptUrl: receiptUrl || '',
      isRecurring: Boolean(isRecurring),
      recurringFrequency: recurringFrequency || 'none',
      accountId: accountId || 'main',
    });

    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/expenses/:id - update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, type, date, notes, receiptUrl, isRecurring, recurringFrequency, accountId } = req.body;
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (amount !== undefined && !isNaN(Number(amount))) updateFields.amount = Number(amount);
    if (category !== undefined) updateFields.category = category;
    if (type !== undefined) updateFields.type = type;
    if (date !== undefined) updateFields.date = new Date(date);
    if (notes !== undefined) updateFields.notes = notes;
    if (receiptUrl !== undefined) updateFields.receiptUrl = receiptUrl;
    if (isRecurring !== undefined) updateFields.isRecurring = Boolean(isRecurring);
    if (recurringFrequency !== undefined) updateFields.recurringFrequency = recurringFrequency;
    if (accountId !== undefined) updateFields.accountId = accountId;

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id - delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/expenses/seed - seed demo data for instantly rich experience
router.post('/seed', authMiddleware, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sampleData = [
      { title: 'Tech Corp Salary', amount: 4800, type: 'income', category: 'Salary', date: new Date(Date.now() - 86400000 * 2), notes: 'Monthly payroll deposit' },
      { title: 'Whole Foods Market', amount: 142.50, type: 'expense', category: 'Food', date: new Date(Date.now() - 86400000 * 1), notes: 'Weekly organic groceries' },
      { title: 'Electric & Power Bill', amount: 85.00, type: 'expense', category: 'Bills', date: new Date(Date.now() - 86400000 * 3), notes: 'Utility bill' },
      { title: 'Uber Ride to Airport', amount: 34.20, type: 'expense', category: 'Travel', date: new Date(Date.now() - 86400000 * 4), notes: 'Business travel' },
      { title: 'Nike Store Apparel', amount: 110.00, type: 'expense', category: 'Shopping', date: new Date(Date.now() - 86400000 * 5), notes: 'Running shoes' },
      { title: 'Netflix & Spotify Subs', amount: 28.99, type: 'expense', category: 'Bills', date: new Date(Date.now() - 86400000 * 6), isRecurring: true, recurringFrequency: 'monthly' },
      { title: 'Freelance Design Client', amount: 750.00, type: 'income', category: 'Investment', date: new Date(Date.now() - 86400000 * 7), notes: 'Logo design project' },
      { title: 'Starbucks Coffee', amount: 6.75, type: 'expense', category: 'Food', date: new Date(), notes: 'Morning espresso' },
    ];

    const created = await Transaction.insertMany(sampleData.map((d) => ({ ...d, userId })));
    res.json({ message: 'Seeded sample transactions successfully', count: created.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
