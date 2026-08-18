import express from 'express';
import Account from '../models/Account.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/accounts - list user accounts
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user) query.userId = req.user.id;

    const accounts = await Account.find(query).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/accounts
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type, balance, currency, color, icon, accountNumber, isCloudConnected } = req.body;
    if (!name) return res.status(400).json({ error: 'Account name is required' });

    const account = await Account.create({
      userId: req.user ? req.user.id : null,
      name,
      type: type || 'bank',
      balance: Number(balance || 0),
      currency: currency || 'USD',
      color: color || '#3b82f6',
      icon: icon || 'Wallet',
      accountNumber: accountNumber || '',
      isCloudConnected: Boolean(isCloudConnected),
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/accounts/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, type, balance, currency, color, icon, accountNumber } = req.body;
    const updated = await Account.findByIdAndUpdate(
      req.params.id,
      { name, type, balance: Number(balance), currency, color, icon, accountNumber },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/accounts/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
