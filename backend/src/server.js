import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { securityHeaders, rateLimiter } from './middlewares/securityMiddleware.js';

import tenantRoutes from './routes/tenantRoutes.js';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import posRoutes from './routes/posRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import expiryRoutes from './routes/expiryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import reorderDuplicateRoutes from './routes/reorderDuplicateRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Security & Base Middleware
app.use(securityHeaders);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Branch-ID'],
}));

// Route Registrations
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/pos', posRoutes);
app.use('/api/v1/transfers', transferRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/expiry', expiryRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/backups', backupRoutes);
app.use('/api/v1/forecast', forecastRoutes);
app.use('/api/v1', reorderDuplicateRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);

// Healthcheck Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Multi-Tenant Enterprise Pharmacy ERP API is active',
    security: 'JWT + HttpOnly Cookies + Rate Limiting + Account Lockout + 2FA + RBAC Active',
    version: '2.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start Server (only if not running on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Multi-Tenant Pharmacy ERP Server running on port ${PORT}`);
  });
}

export default app;