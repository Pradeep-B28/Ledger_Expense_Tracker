import express from 'express';
import Transaction from '../models/Transaction.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const ALLOWED_TYPES = ['expense', 'income'];
const MAX_AMOUNT = 100000000; // 100 Million cap

// GET /api/expenses - get all transactions with filters & search
router.get('/', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const { category, type, search, startDate, endDate, accountId, limit = 100 } = req.query;
    
    const query = { userId: req.user.id };

    if (category && category !== 'All') {
      query.category = String(category).slice(0, 50);
    }

    if (type && type !== 'All' && ALLOWED_TYPES.includes(type)) {
      query.type = type;
    }

    if (accountId) {
      query.accountId = String(accountId).slice(0, 50);
    }

    if (search && typeof search === 'string') {
      const sanitizedSearch = search.trim().slice(0, 100);
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { category: { $regex: sanitizedSearch, $options: 'i' } },
        { notes: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) query.date.$lte = end;
      }
    }

    const safeLimit = Math.min(Math.max(1, Number(limit) || 100), 500);

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(safeLimit);

    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

// GET /api/expenses/stats - statistical breakdown for dashboard & charts
router.get('/stats', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const query = { userId: req.user.id };
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
    const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0;

    res.json({
      totalExpense,
      totalIncome,
      netSavings,
      savingsRate,
      count: transactions.length,
      categoryTotals,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses - create transaction with strict validation
router.post('/', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const { title, amount, category, type, date, notes, receiptUrl, isRecurring, recurringFrequency, accountId } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Transaction title is required.' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > MAX_AMOUNT) {
      return res.status(400).json({ error: 'Valid positive transaction amount is required.' });
    }

    const safeType = ALLOWED_TYPES.includes(type) ? type : 'expense';
    const safeCategory = (category && typeof category === 'string') ? category.trim().slice(0, 50) : 'General';
    const safeTitle = title.trim().slice(0, 100);
    const safeNotes = (notes && typeof notes === 'string') ? notes.trim().slice(0, 500) : '';

    // Validate receiptUrl if supplied
    let safeReceipt = '';
    if (receiptUrl && typeof receiptUrl === 'string') {
      if (receiptUrl.startsWith('data:image/') || receiptUrl.startsWith('https://')) {
        safeReceipt = receiptUrl;
      }
    }

    const txDate = date ? new Date(date) : new Date();
    const safeDate = isNaN(txDate.getTime()) ? new Date() : txDate;

    const newTx = await Transaction.create({
      userId: req.user.id,
      title: safeTitle,
      amount: numAmount,
      category: safeCategory,
      type: safeType,
      date: safeDate,
      notes: safeNotes,
      receiptUrl: safeReceipt,
      isRecurring: Boolean(isRecurring),
      recurringFrequency: ['weekly', 'monthly', 'yearly'].includes(recurringFrequency) ? recurringFrequency : 'none',
      accountId: accountId ? String(accountId).slice(0, 50) : 'main',
    });

    res.status(201).json(newTx);
  } catch (err) {
    next(err);
  }
});

// PUT /api/expenses/:id - update transaction (strictly scoped to owner)
router.put('/:id', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const { title, amount, category, type, date, notes, receiptUrl, isRecurring, recurringFrequency, accountId } = req.body;
    const updateFields = {};

    if (title !== undefined && typeof title === 'string') {
      updateFields.title = title.trim().slice(0, 100);
    }
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0 || numAmount > MAX_AMOUNT) {
        return res.status(400).json({ error: 'Valid positive transaction amount is required.' });
      }
      updateFields.amount = numAmount;
    }
    if (category !== undefined && typeof category === 'string') {
      updateFields.category = category.trim().slice(0, 50);
    }
    if (type !== undefined && ALLOWED_TYPES.includes(type)) {
      updateFields.type = type;
    }
    if (date !== undefined) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) updateFields.date = d;
    }
    if (notes !== undefined && typeof notes === 'string') {
      updateFields.notes = notes.trim().slice(0, 500);
    }
    if (receiptUrl !== undefined && typeof receiptUrl === 'string') {
      if (receiptUrl.startsWith('data:image/') || receiptUrl.startsWith('https://') || receiptUrl === '') {
        updateFields.receiptUrl = receiptUrl;
      }
    }
    if (isRecurring !== undefined) {
      updateFields.isRecurring = Boolean(isRecurring);
    }
    if (recurringFrequency !== undefined) {
      updateFields.recurringFrequency = recurringFrequency;
    }
    if (accountId !== undefined) {
      updateFields.accountId = String(accountId).slice(0, 50);
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction record not found or unauthorized access.' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/expenses/:id - delete transaction (strictly scoped to owner)
router.delete('/:id', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction record not found or unauthorized access.' });
    }

    res.json({ message: 'Transaction deleted successfully.', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

export default router;
