# 01 System Architecture

## Architecture Overview
The system follows Clean Architecture and SOLID principles across the MERN stack with multi-tenant data isolation.

```text
               +-------------------------------------------------------+
               |                  Super Admin Portal                    |
               +-------------------------------------------------------+
                                           |
               +-------------------------------------------------------+
               |                    Pharmacy Tenant                     |
               +-------------------------------------------------------+
                                           |
                  +------------------------+------------------------+
                  |                                                 |
       +--------------------+                             +--------------------+
       |  Headquarter (HQ)  |                             |   Retail Branch    |
       +--------------------+                             +--------------------+
                  |                                                 |
      +-----------+-----------+                         +-----------+-----------+
      |           |           |                         |           |           |
  [Owner]     [Manager]  [Pharmacist]               [Manager]   [Cashier]  [Inventory]
```

## Data Isolation & Discriminators
- **Tenant Discriminator**: `pharmacy: Schema.Types.ObjectId` on all domain collections.
- **Branch Discriminator**: `branch: Schema.Types.ObjectId` on branch-scoped collections (Stock, Sales, Batches, POS).
- **Middleware**: `tenantContext` middleware validates user permissions and populates `req.pharmacyId` and `req.branchId`.

## Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js, Mongoose, JWT (Access/Refresh Tokens), bcrypt, Multer, Helmet, Express Rate Limit.
- **Database**: MongoDB Atlas with indexing on `{ pharmacy: 1, branch: 1, expiryDate: 1 }`.
- **Hosting & CI/CD**: Vercel monorepo deployment with automated Serverless API routing.
