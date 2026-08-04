# 💊 Multi-Tenant Enterprise Pharmacy ERP & Inventory System

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev/)
[![Version](https://img.shields.io/badge/Version-1.0.0-emerald.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

An enterprise-grade, multi-tenant **Pharmacy ERP & Inventory Management SaaS System** designed for independent pharmacies, hospital pharmacy chains, and medical outlets. Built with **Node.js, Express, MongoDB (Mongoose), React 19, Vite, and Tailwind CSS**.

---

## 🌟 Key Product Features

- 🏢 **Multi-Tenancy & Multi-Branch Architecture**: Complete data isolation per pharmacy organization with multi-branch outlet support and seamless inter-branch stock transfers.
- 💊 **FEFO Batch Inventory Control**: First-Expiry, First-Out batch tracking, supplier management, shelf/rack placement, automated reorder triggers, and barcode/QR generation.
- ⚡ **High-Speed POS Checkout**: Point of Sale billing terminal supporting barcode scanning, instant calculations, cash/card/digital payments, and invoice generation.
- 📑 **AI-Powered Prescription OCR**: Automatic extraction of medicine name, dosage, and frequency from prescription images with drug interaction safety warnings.
- 👑 **SaaS SuperAdmin & Subscription Engine**: Multi-tier subscription management (Starter, Professional, Enterprise, Unlimited), automated trial management, company status lifecycle, and SaaS revenue analytics.
- 🔐 **Granular Role-Based Access Control (RBAC)**: Complete security matrix enforcing permissions across 8 distinct user roles.
- 📊 **Real-time Analytics & Financial Reporting**: Visual revenue graphs, sales distribution breakdown, stock movement logs, and audit trails.

---

## 🛠️ Technology Stack

### Backend
- **Core**: Node.js, Express.js (REST API, ES Modules)
- **Database**: MongoDB & Mongoose ODM / Prisma ORM
- **Security**: JWT (JSON Web Tokens), bcryptjs, CORS, Helmet, Rate Limiter
- **Utilities**: Nodemailer, PDFKit, ExcelJS

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Vanilla Tailwind CSS (Dark Medical Theme)
- **State & Router**: React Context API, React Router DOM
- **HTTP & Charts**: Axios, Recharts, Lucide Icons

---

## 🔑 Default Credentials Directory

Use these credentials to log in and test different access levels across the system:

| Role | Email Address | Password | Access Level & Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@pharmacy.com` | `SuperAdminPass@2026!` | SaaS Platform Controller (All Companies & Subscriptions) |
| **Company Owner** | `owner@pharmacy.com` | `OwnerPass@2026!` | Full Multi-Branch Enterprise Control & P&L Analytics |
| **Branch Manager (HQ)** | `manager.hq@pharmacy.com` | `ManagerPass@2026!` | Headquarter Outlet Operations & Staff Management |
| **Branch Manager (Branch)** | `manager.downtown@pharmacy.com` | `ManagerPass@2026!` | Downtown Branch Outlet Operations |
| **Pharmacist** | `pharmacist@pharmacy.com` | `PharmPass@2026!` | Clinical Dispensing, Prescription OCR & Interactions |
| **Cashier** | `cashier@pharmacy.com` | `CashierPass@2026!` | POS Terminal & Customer Billing |
| **Inventory Staff** | `inventory@pharmacy.com` | `InventoryPass@2026!` | Stock Inwarding, FEFO Rack Placement & Transfers |
| **Delivery Staff** | `delivery@pharmacy.com` | `DeliveryPass@2026!` | Order Dispatch, Delivery Status & COD Collection |
| **Customer** | `customer@pharmacy.com` | `CustomerPass@2026!` | Patient Portal, Online Medicine Orders & Prescriptions |

---

## ⚙️ Setup and Installation Guide

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** `>= v18.x` (or `v20+`)
- **npm** `>= v9.x`
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/MHamdan07/pharmacy-erp.git
cd pharmacy-erp
```

---

### Step 2: Backend Configuration & Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` folder (you can copy `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/pharmacy_erp
   NODE_ENV=development
   CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
   JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_2026
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_2026
   ```

4. Seed the Database (Creates initial tenants, branches, products, and default user accounts):
   ```bash
   npm run seed
   ```

5. Start the Backend Development Server:
   ```bash
   npm run dev
   ```
   *The backend server will run on `http://localhost:5000`.*

---

### Step 3: Frontend Configuration & Setup

1. Open a new terminal window, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend/` folder (you can copy `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_APP_TITLE=Pharmacy ERP
   ```

4. Start the Frontend Development Server:
   ```bash
   npm run dev
   ```
   *The application will launch on `http://localhost:5173`.*

> ⚠️ **Important Note on Running Scripts**:  
> Always use `npm run dev` (NOT `npx run dev`) to start local development servers.

---

## 📁 Repository Structure

```
pharmacy-erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & third-party integrations
│   │   ├── controllers/     # Business logic & request handlers
│   │   ├── middlewares/     # Auth, RBAC, tenant & subscription gatekeepers
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # RESTful API route definitions
│   │   ├── services/        # Auxiliary services (PDF, Mail, AI)
│   │   ├── seed.js          # Main database seeder script
│   │   └── server.js        # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & interceptors
│   │   ├── components/      # UI components & modals
│   │   ├── context/         # Auth & Branch state management
│   │   ├── pages/           # Dashboard & system pages
│   │   └── main.jsx         # React DOM root entry
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 📡 Core API Modules

| Module Route | Description | Allowed Roles |
| :--- | :--- | :--- |
| `/api/v1/auth` | Authentication (Register, Login, Me, Logout) | Public / Authenticated |
| `/api/v1/subscriptions/admin` | SaaS Analytics & Subscription Management | `SuperAdmin` |
| `/api/v1/medicines` | Inventory Products & Batch Stocking | `Owner`, `Branch Manager`, `Pharmacist`, `Inventory Staff` |
| `/api/v1/sales` | POS Transactions & Sales Invoices | `Owner`, `Branch Manager`, `Pharmacist`, `Cashier` |
| `/api/v1/prescriptions` | AI Prescription OCR Verification | `Owner`, `Branch Manager`, `Pharmacist` |
| `/api/v1/tenants` | Multi-Branch Outlet Management | `SuperAdmin`, `Owner` |

---

## 🛡️ License & Support

Developed for **Enterprise Pharmacy Operations**. Built with SOLID architectural standards and Clean Architecture principles.
