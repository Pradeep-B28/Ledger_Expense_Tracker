import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Account from '../models/Account.js';
import SavingsGoal from '../models/SavingsGoal.js';
import { generateToken } from '../utils/jwt.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, currency, consentGiven } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      return res.status(400).json({ error: 'Valid username (minimum 2 characters) is required.' });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // DPDP Act 2023 / GDPR Compliance: Mandatory Informed Consent
    if (!consentGiven) {
      return res.status(400).json({
        error: 'Consent required: You must review and agree to the Terms of Service and Privacy Policy.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address is already registered.' });
    }

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password,
      currency: currency || 'USD',
    });

    const token = generateToken({ id: user._id, email: user.email, username: user.username });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currency: user.currency,
        monthlyIncomeGoal: user.monthlyIncomeGoal,
        themePreference: user.themePreference,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const token = generateToken({ id: user._id, email: user.email, username: user.username });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currency: user.currency,
        monthlyIncomeGoal: user.monthlyIncomeGoal,
        themePreference: user.themePreference,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User account not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const { currency, monthlyIncomeGoal, themePreference, username } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User account not found.' });

    if (currency && typeof currency === 'string') user.currency = currency.slice(0, 5);
    if (monthlyIncomeGoal !== undefined && !isNaN(Number(monthlyIncomeGoal))) {
      user.monthlyIncomeGoal = Math.max(0, Number(monthlyIncomeGoal));
    }
    if (themePreference && typeof themePreference === 'string') {
      user.themePreference = themePreference.slice(0, 20);
    }
    if (username && typeof username === 'string' && username.trim().length >= 2) {
      user.username = username.trim().slice(0, 50);
    }

    await user.save();
    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currency: user.currency,
        monthlyIncomeGoal: user.monthlyIncomeGoal,
        themePreference: user.themePreference,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/export-data (DPDP Act 2023: Right to Data Portability)
router.get('/export-data', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const transactions = await Transaction.find({ userId });
    const budgets = await Budget.find({ userId });
    const accounts = await Account.find({ userId });
    const goals = await SavingsGoal.find({ userId });

    res.json({
      exportTimestamp: new Date().toISOString(),
      accountProfile: user,
      dataRecords: {
        transactionsCount: transactions.length,
        transactions,
        budgets,
        accounts,
        goals,
      },
      notice: 'Data exported in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/auth/erase-account (DPDP Act 2023: Right to Erasure / Right to be Forgotten)
router.delete('/erase-account', authMiddleware, requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Cascade delete all personal data
    await Transaction.deleteMany({ userId });
    await Budget.deleteMany({ userId });
    await Account.deleteMany({ userId });
    await SavingsGoal.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({
      message: 'Account and all associated personal financial records have been permanently erased.',
      erasedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
