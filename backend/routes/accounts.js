import express from 'express';
import Account from '../models/Account.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/accounts - list only authenticated user's accounts
router.get('/', authMiddleware, requireAuth, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve accounts' });
  }
});

// POST /api/accounts - create account scoped to authenticated user
router.post('/', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { name, type, balance, currency, color, icon, accountNumber, isCloudConnected } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Valid account name is required' });
    }

    const validBalance = Number(balance);
    if (isNaN(validBalance)) {
      return res.status(400).json({ error: 'Valid initial balance is required' });
    }

    const account = await Account.create({
      userId: req.user.id,
      name: name.trim().slice(0, 80),
      type: ['bank', 'cash', 'credit_card', 'investment', 'savings', 'wallet'].includes(type) ? type : 'bank',
      balance: validBalance,
      currency: typeof currency === 'string' && currency.length <= 5 ? currency.toUpperCase() : 'USD',
      color: typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#3b82f6',
      icon: typeof icon === 'string' ? icon.slice(0, 30) : 'Wallet',
      accountNumber: typeof accountNumber === 'string' ? accountNumber.trim().slice(0, 30) : '',
      isCloudConnected: Boolean(isCloudConnected),
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create account. Please verify input data.' });
  }
});

// PUT /api/accounts/:id - update account owned by authenticated user
router.put('/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { name, type, balance, currency, color, icon, accountNumber } = req.body;
    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Account name cannot be empty' });
      }
      updateData.name = name.trim().slice(0, 80);
    }

    if (type !== undefined) {
      updateData.type = ['bank', 'cash', 'credit_card', 'investment', 'savings', 'wallet'].includes(type) ? type : 'bank';
    }

    if (balance !== undefined) {
      const numBal = Number(balance);
      if (isNaN(numBal)) return res.status(400).json({ error: 'Invalid balance value' });
      updateData.balance = numBal;
    }

    if (currency !== undefined) {
      updateData.currency = typeof currency === 'string' && currency.length <= 5 ? currency.toUpperCase() : 'USD';
    }

    if (color !== undefined) {
      updateData.color = typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#3b82f6';
    }

    if (icon !== undefined) {
      updateData.icon = typeof icon === 'string' ? icon.slice(0, 30) : 'Wallet';
    }

    if (accountNumber !== undefined) {
      updateData.accountNumber = typeof accountNumber === 'string' ? accountNumber.trim().slice(0, 30) : '';
    }

    const updated = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Account not found or unauthorized' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update account' });
  }
});

// DELETE /api/accounts/:id - delete account owned by authenticated user
router.delete('/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const deleted = await Account.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Account not found or unauthorized' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete account' });
  }
});

export default router;
