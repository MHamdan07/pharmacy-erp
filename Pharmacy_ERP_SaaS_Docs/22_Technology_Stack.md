# 22 Technology Stack & Deployment Architecture

## Overview
The Pharmacy ERP Platform relies on a production-ready technology stack designed for high throughput, real-time data sync, cross-platform mobile delivery, and automated serverless cloud deployment.

---

## Technology Stack Breakdown

| Layer | Component | Technology | Purpose |
|---|---|---|---|
| **Database** | Primary Database | **MongoDB Atlas** | Document-oriented multi-tenant data store. |
| **ORM / ODM** | Data Modeling | **Prisma / Mongoose** | Type-safe schema validation and index enforcement. |
| **Backend Runtime** | Server Environment | **Node.js** | Non-blocking asynchronous I/O event loop. |
| **API Framework** | REST Gateway | **Express.js** | API routing, security headers, and rate limiting. |
| **Frontend Web** | Dashboard & POS UI | **React.js (React 19)** | High-speed Single Page Application (SPA). |
| **Web Portal** | Public & SEO Pages | **Next.js** | Server-Side Rendered (SSR) marketing pages. |
| **Mobile Apps** | Cross-Platform | **Flutter** | iOS and Android native apps for Customers & Employees. |
| **Caching Layer** | In-Memory Store | **Redis** | High-performance session caching & rate limiting. |
| **Media Assets** | Cloud Storage | **Cloudinary** | Prescription scan images & PDF invoice CDN. |
| **Authentication** | Token System | **JWT** | HttpOnly SameSite Refresh Cookies + Access Tokens. |
| **Real-Time Sync** | WebSockets | **Socket.io** | Live order tracking timeline & instant alerts. |

---

## Deployment Architecture

- **Vercel**: Monorepo serverless deployment hosting SPA frontend bundles and Express API routes.
- **MongoDB Atlas**: Managed cloud database cluster with continuous point-in-time backups.
- **Cloudinary**: High-availability media CDN hosting compressed images and PDF documents.
- **GitHub Actions**: Automated CI/CD workflow executing build validation, test runner suites, and zero-downtime production deployment.
