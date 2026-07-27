# Multi-Tenant Pharmacy ERP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing pharmacy ERP scaffold into a production-ready multi-tenant application with branch-level inventory, role-based access, sales and purchase operations, audit logging, and a secure React frontend.

**Architecture:** Keep backend logic in Express/Mongoose modules, isolate multi-tenancy at the request layer, and build a React/Tailwind frontend with protected routes and API integration.

**Tech Stack:** Node.js 20+, Express, Mongoose, JWT, bcryptjs, React 19, Vite, Tailwind CSS, Axios.

## Global Constraints

- Use RESTful plural API routes under `/api/v1/`.
- Every backend write operation must be authenticated and tenant-aware.
- No hardcoded secrets in code; use `.env` and `.env.example`.
- Keep frontend components focused and reuse the existing UI structure.
- Add integration test coverage for auth and inventory workflows.
- Preserve existing folder structure unless a split is necessary for maintainability.
- Use the local superpowers and agency-agents repositories as methodology/inspiration, but implement the app with existing Node/React tooling.

---

### Task 1: Fix project architecture and existing backend/frontend issues

**Files:**
- Modify: `backend/server.js`
- Modify: `backend/config/db.js`
- Modify: `backend/models/Branch.js`
- Modify: `backend/models/AuditLog.js`
- Modify: `frontend/src/api/axios.js`
- Create: `README.md`
- Create: `.env.example`
- Create: `docker-compose.yml`
- Create: `package.json`

**Interfaces:**
- Consumes: current Express server bootstrap, existing frontend auth provider, base packages from `backend/package.json` and `frontend/package.json`.
- Produces: stable project entry points, shared docs, and configured environment examples.

- [ ] **Step 1: Fix inconsistent backend module styles and create missing audit model**

```js
// backend/models/Branch.js
import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Branch', branchSchema);
```

```js
// backend/models/AuditLog.js
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
```

- [ ] **Step 2: Fix frontend axios interceptor bug and ensure auth token is attached**

```js
// frontend/src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
```

- [ ] **Step 3: Create project-level README and environment examples**

```md
# Pharmacy ERP

Full-stack multi-tenant pharmacy ERP for branches, inventory, purchases, sales, and reporting.

## Setup

1. Copy `.env.example` to `.env` in `backend/`
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm run dev`
```

- [ ] **Step 4: Add `docker-compose.yml` to run MongoDB and the backend frontend during local development**

```yaml
version: '3.9'
services:
  mongo:
    image: mongo:7.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: pharmacy_erp
    volumes:
      - mongo_data:/data/db
    ports:
      - 27017:27017

volumes:
  mongo_data:
```

- [ ] **Step 5: Add a root helper `package.json` with workspace scripts**

```json
{
  "name": "pharmacy-erp",
  "private": true,
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "install": "npm install --workspaces",
    "dev": "concurrently \"npm:start --workspace backend\" \"npm:start --workspace frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

- [ ] **Step 6: Run a smoke check**

Run: `cd backend && npm install && npm run dev` and `cd frontend && npm install && npm run dev` on separate terminals. Verify no syntax or startup failures.

### Task 2: Add multi-tenant pharmacy and branch core models

**Files:**
- Create: `backend/models/Pharmacy.js`
- Modify: `backend/models/Branch.js`
- Modify: `backend/models/User.js`
- Modify: `backend/config/db.js`
- Create: `backend/middlewares/tenantMiddleware.js`
- Modify: `backend/routes/authRoutes.js`
- Modify: `backend/controllers/authController.js`

**Interfaces:**
- Consumes: request auth middleware, `User` model, secure tokens.
- Produces: tenant-aware request context and pharmacy/branch associations for users and inventory.

- [ ] **Step 1: Create a Pharmacy model**

```js
// backend/models/Pharmacy.js
import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  code: { type: String, required: true, trim: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Pharmacy', pharmacySchema);
```

- [ ] **Step 2: Update the Branch model to reference `Pharmacy`**

```js
import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Branch', branchSchema);
```

- [ ] **Step 3: Update the User model to include pharmacy and branch references**

```js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['Owner', 'Admin', 'Pharmacist', 'Cashier', 'Inventory Manager', 'Branch Manager'], default: 'Cashier' },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
```

- [ ] **Step 4: Add tenant middleware to attach `req.pharmacy` and `req.branch` from the authenticated user**

```js
// backend/middlewares/tenantMiddleware.js
export const attachTenant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  req.pharmacy = req.user.pharmacy;
  req.branch = req.user.branch || null;
  next();
};
```

- [ ] **Step 5: Apply tenant middleware to protected routes**

```js
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

router.use(protect);
router.use(attachTenant);
```

- [ ] **Step 6: Add a seed or registration flow to bootstrap an owner user with pharmacy and branch references**

```js
// backend/seed.js update or new seed script
import Pharmacy from './models/Pharmacy.js';
import Branch from './models/Branch.js';
import User from './models/User.js';

const pharmacy = await Pharmacy.create({ name: 'Default Pharmacy', code: 'PH01', address: '123 Market Street', phone: '+10000000000', email: 'info@example.com' });
const branch = await Branch.create({ name: 'Main Branch', code: 'BR01', pharmacy: pharmacy._id, phone: '+10000000000', address: '123 Market Street' });
await User.create({ name: 'Owner', email: 'owner@pharmacy.com', password: 'P@ssw0rd!', role: 'Owner', pharmacy: pharmacy._id, branch: branch._id });
```

- [ ] **Step 7: Run a schema sanity check**

Start backend and confirm login, protected route guard, and tenant middleware do not throw runtime errors.

### Task 3: Build secure auth, registration, refresh, and password reset APIs

**Files:**
- Modify: `backend/routes/authRoutes.js`
- Modify: `backend/controllers/authController.js`
- Create: `backend/utils/tokenUtils.js`
- Create: `backend/middlewares/authorize.js`
- Create: `backend/validators/authValidator.js`
- Create: `backend/routes/userRoutes.js`

**Interfaces:**
- Consumes: `generateTokens(res, user)` and `protect` middleware.
- Produces: auth endpoints for login, register, refresh, logout, forgot-password, reset-password, and current user profile.

- [ ] **Step 1: Add token utility and refresh token cookie support**

```js
// backend/utils/tokenUtils.js
import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, pharmacyId, branchId, role) =>
  jwt.sign({ id: userId, pharmacy: pharmacyId, branch: branchId, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

export const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
```

- [ ] **Step 2: Add `/register`, `/refresh`, `/forgot-password`, and `/reset-password` to auth routes**

```js
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
```

- [ ] **Step 3: Implement registration and refresh logic**

```js
export const register = async (req, res) => {
  const { name, email, password, pharmacyCode, branchCode, role } = req.body;
  const pharmacy = await Pharmacy.findOne({ code: pharmacyCode });
  const branch = await Branch.findOne({ code: branchCode, pharmacy: pharmacy._id });
  if (!pharmacy || !branch) return res.status(400).json({ message: 'Invalid pharmacy or branch' });
  const user = await User.create({ name, email, password, role, pharmacy: pharmacy._id, branch: branch._id });
  const accessToken = generateAccessToken(user._id, user.pharmacy, user.branch, user.role);
  const refreshToken = generateRefreshToken(user._id);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ accessToken, user: sanitizeUser(user) });
};
```

- [ ] **Step 4: Add password reset token generation and verification**

```js
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, an email was sent.' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save();
  await sendPasswordResetEmail(user.email, token);
  res.status(200).json({ message: 'Password reset link sent' });
};
```

- [ ] **Step 5: Add authorization middleware and protect administrative routes**

```js
export const authorize = (allowedRoles) => (req, res, next) => {
  const role = req.user.role;
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
```

- [ ] **Step 6: Add profile and user management routes**

```js
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
```

- [ ] **Step 7: Validate using the new auth validator**

```js
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
```

- [ ] **Step 8: Run a backend acceptance check**

Call `/api/v1/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me` against local backend and confirm expected JSON responses.

### Task 4: Add inventory, sales, customer, and reporting operations to backend

**Files:**
- Create: `backend/models/Customer.js`
- Create: `backend/models/Sale.js`
- Create: `backend/models/SaleItem.js`
- Modify: `backend/models/Medicine.js`
- Modify: `backend/models/PurchaseOrder.js`
- Modify: `backend/models/PurchaseReceipt.js`
- Create: `backend/models/InventoryLog.js`
- Modify: `backend/controllers/inventoryController.js`
- Create: `backend/controllers/salesController.js`
- Create: `backend/controllers/customerController.js`
- Create: `backend/controllers/reportController.js`
- Modify: `backend/routes/inventoryRoutes.js`
- Create: `backend/routes/salesRoutes.js`
- Create: `backend/routes/customerRoutes.js`
- Create: `backend/routes/reportRoutes.js`

**Interfaces:**
- Consumes: tenant middleware, user context, existing inventory logic.
- Produces: full operational endpoints for products, customers, sales, receipts, and reports.

- [ ] **Step 1: Add customer model**

```js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  type: { type: String, enum: ['walk-in', 'registered'], default: 'walk-in' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
```

- [ ] **Step 2: Add Sale and SaleItem models**

```js
import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true, min: 0 },
});

const saleSchema = new mongoose.Schema({
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'paid' },
  status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Sale', saleSchema);
```

- [ ] **Step 3: Add inventory log model**

```js
import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  change: { type: Number, required: true },
  beforeQty: { type: Number, required: true },
  afterQty: { type: Number, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('InventoryLog', inventoryLogSchema);
```

- [ ] **Step 4: Update inventory controller to use tenant-scoped queries and log inventory changes**

```js
const medicines = await Medicine.find({ pharmacy: req.pharmacy }).populate('category supplier');
```

- [ ] **Step 5: Create sales endpoints that decrement stock and record invoices**

```js
export const createSale = async (req, res) => {
  const { customer, items, paymentStatus, notes } = req.body;
  const userId = req.user.id;
  const invoiceNumber = `INV-${Date.now()}`;
  const saleItems = items.map((item) => ({
    medicine: item.medicine,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.quantity * item.unitPrice,
  }));
  const totalAmount = saleItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const sale = await Sale.create({ pharmacy: req.pharmacy, branch: req.branch, customer, user: userId, invoiceNumber, items: saleItems, totalAmount, paymentStatus, notes });
  for (const item of items) {
    const medicine = await Medicine.findOne({ _id: item.medicine, pharmacy: req.pharmacy });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    medicine.stockQty -= item.quantity;
    await medicine.save();
    await InventoryLog.create({ pharmacy: req.pharmacy, branch: req.branch, medicine: medicine._id, user: userId, action: 'sale', change: -item.quantity, beforeQty: medicine.stockQty + item.quantity, afterQty: medicine.stockQty, notes: `Sale ${invoiceNumber}` });
  }
  res.status(201).json(sale);
};
```

- [ ] **Step 6: Add report endpoints for low stock, expiry, and sales summary**

```js
export const getLowStock = async (req, res) => {
  const medicines = await Medicine.find({ pharmacy: req.pharmacy, stockQty: { $lte: '$reorderLevel' } }).sort({ stockQty: 1 });
  res.json(medicines);
};
```

- [ ] **Step 7: Wire new routes into backend**

```js
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/reports', reportRoutes);
```

- [ ] **Step 8: Validate sales and customer operations**

Call backend endpoints to create a customer, create a sale, and verify stock levels decrement.

### Task 5: Harden backend with audit logging and permissions

**Files:**
- Create: `backend/middlewares/auditMiddleware.js`
- Modify: `backend/controllers/inventoryController.js`
- Modify: `backend/controllers/salesController.js`
- Modify: `backend/controllers/customerController.js`
- Modify: `backend/models/Role.js`
- Modify: `backend/routes/inventoryRoutes.js`
- Create: `backend/routes/adminRoutes.js`

**Interfaces:**
- Consumes: current user and tenant context.
- Produces: audit records and role-guarded admin endpoints.

- [ ] **Step 1: Add audit middleware that logs user changes**

```js
import AuditLog from '../models/AuditLog.js';

export const audit = async (req, res, next) => {
  res.on('finish', async () => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode < 400) {
      await AuditLog.create({ user: req.user.id, pharmacy: req.pharmacy, action: `${req.method} ${req.path}`, resource: req.path.split('/')[2], resourceId: res.locals.resourceId || null, oldValue: res.locals.oldValue || null, newValue: res.locals.newValue || null, ipAddress: req.ip });
    }
  });
  next();
};
```

- [ ] **Step 2: Add `authorize` middleware and use it on route groups**

```js
router.post('/categories', authorize(['Owner', 'Admin', 'Inventory Manager']), createCategory);
```

- [ ] **Step 3: Add an admin route to manage users, roles, pharmacies, and branches**

```js
router.get('/users', authorize(['Owner', 'Admin']), getUsers);
```
```

- [ ] **Step 4: Add audit logs list endpoint**

```js
router.get('/audits', authorize(['Owner', 'Admin']), getAuditLogs);
```
```

- [ ] **Step 5: Run backend authorization scenarios**

Test that a cashier cannot create categories but an inventory manager can.

### Task 6: Improve frontend structure and routing

**Files:**
- Modify: `frontend/src/main.jsx`
- Modify: `frontend/src/App.jsx` or create it if missing
- Create: `frontend/src/layouts/AppLayout.jsx`
- Create: `frontend/src/pages/Branches.jsx`
- Create: `frontend/src/pages/Customers.jsx`
- Create: `frontend/src/pages/Sales.jsx`
- Create: `frontend/src/pages/Reports.jsx`
- Create: `frontend/src/components/Sidebar.jsx`

**Interfaces:**
- Consumes: `AuthProvider`, `ProtectedRoute`, API client.
- Produces: navigation and page skeletons for core workflows.

- [ ] **Step 1: Ensure the app uses browser router and auth provider**

```jsx
// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```
```

- [ ] **Step 2: Create `App.jsx` with protected routes and public pages**

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Branches from './pages/Branches';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/branches" element={<Branches />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
```

- [ ] **Step 3: Create page components that load backend data and render summaries**

Add a `Customers.jsx` page loading `/customers`, a `Sales.jsx` page listing recent invoices, and a `Branches.jsx` page listing branches.

- [ ] **Step 4: Add a shared layout or sidebar**

Use `AppLayout.jsx` for navigation and page wrapper so all protected pages have a consistent shell.

- [ ] **Step 5: Run frontend smoke checks**

Start the frontend and confirm navigation to `/login`, `/dashboard`, and `/inventory` works with successful API calls after login.

### Task 7: Add tests, docs, and deployment support

**Files:**
- Create: `backend/jest.config.cjs`
- Create: `backend/tests/auth.test.js`
- Create: `backend/tests/inventory.test.js`
- Modify: `README.md`
- Create: `backend/.env.example`
- Create: `frontend/.env.example`

**Interfaces:**
- Consumes: Jest, Supertest, backend app exports.
- Produces: deterministic tests and documentation for install and deploy.

- [ ] **Step 1: Add Jest and Supertest dependencies to backend**

Run: `cd backend && npm install --save-dev jest supertest @types/jest`.

- [ ] **Step 2: Export the Express app from `server.js` so tests can import it**

```js
export default app;
```

- [ ] **Step 3: Write an auth integration test**

```js
import request from 'supertest';
import app from '../server.js';

test('POST /api/v1/auth/login returns 200 for valid credentials', async () => {
  const response = await request(app).post('/api/v1/auth/login').send({ email: 'owner@pharmacy.com', password: 'P@ssw0rd!' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('accessToken');
  expect(response.body.user.email).toBe('owner@pharmacy.com');
});
```

- [ ] **Step 4: Write an inventory smoke test**

```js
test('GET /api/v1/inventory/categories returns 401 without auth', async () => {
  const response = await request(app).get('/api/v1/inventory/categories');
  expect(response.statusCode).toBe(401);
});
```

- [ ] **Step 5: Add README sections for onboarding, env setup, and how to run tests**

```md
## Testing

cd backend && npm test
```

- [ ] **Step 6: Run the test suite**

Run: `cd backend && npm test` and fix any failing tests.

### Task 8: Review and finalize production readiness

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `docker-compose.yml`
- Modify: `backend/server.js`

**Interfaces:**
- Consumes: all application behavior.
- Produces: deployment instructions and final run checks.

- [ ] **Step 1: Add production server recommendations and environment variables**

- [ ] **Step 2: Confirm `NODE_ENV=production` readiness and secure CORS**

- [ ] **Step 3: Validate `.env.example` covers `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `PORT`

- [ ] **Step 4: Start the complete stack and verify the app can be installed and launched from scratch**

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-27-multi-tenant-pharmacy-erp.md`. Two execution options:**

1. Subagent-Driven (recommended) - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. Inline Execution - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach would you like?