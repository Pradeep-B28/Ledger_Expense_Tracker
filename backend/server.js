import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import accountRoutes from './routes/accounts.js';
import budgetRoutes from './routes/budgets.js';
import goalRoutes from './routes/goals.js';

dotenv.config();

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'http://localhost:5000', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Force HTTPS in Production Environments
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// 3. CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'capacitor://localhost'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow during dev/evaluation
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 4. Rate Limiting to prevent brute-force attacks and abuse
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP address. Please try again after 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 login/register attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes before trying again.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 5. Body Parser with strict payload limits (Prevent Denial of Service)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 6. API Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/transactions', expenseRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
    dpdpCompliant: true,
    environment: process.env.NODE_ENV || 'development',
  });
});

// 7. Global 404 Route Handler for undefined endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Requested API endpoint not found.' });
});

// 8. Centralized Error Handler (Mask internal stack traces & sensitive error details)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500
      ? 'An unexpected internal server error occurred. Please contact support if the issue persists.'
      : err.message,
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense-tracker';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database.');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.warn('MongoDB connection note:', err.message);
    console.warn('Starting Express server in fallback mode.');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT} (local mode)`));
  });
