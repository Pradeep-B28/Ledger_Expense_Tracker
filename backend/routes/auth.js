import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, currency } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      username,
      email,
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
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, requireAuth, async (req, res) => {
  try {
    const { currency, monthlyIncomeGoal, themePreference, username } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (currency) user.currency = currency;
    if (monthlyIncomeGoal !== undefined) user.monthlyIncomeGoal = Number(monthlyIncomeGoal);
    if (themePreference) user.themePreference = themePreference;
    if (username) user.username = username;

    await user.save();
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      currency: user.currency,
      monthlyIncomeGoal: user.monthlyIncomeGoal,
      themePreference: user.themePreference,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
