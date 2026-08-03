# 20 Database Architecture, Technology Stack & Deployment

## Overview
The Pharmacy ERP system leverages an enterprise-grade technology stack powered by **MongoDB Atlas**, Node.js microservices, React 19 web interfaces, Next.js portals, and Flutter mobile applications deployed on Vercel serverless cloud infrastructure.

---

## Complete Technology Stack (11 Tech Layers)

1. **MongoDB**: High-performance multi-tenant document database storing tenant schemas, medicines, inventory batches, and sales transactions.
2. **Mongoose / Prisma ODM**: Object Document Mapper enforcing strict schema validation, indexes, and multi-tenant discriminators.
3. **Node.js**: Asynchronous event-driven server runtime environment.
4. **Express.js**: RESTful API framework handling authentication, rate limiting, and route controllers.
5. **React.js (React 19)**: Single-Page Application (SPA) framework powering the ERP operations dashboard and POS billing terminal.
6. **Next.js**: Server-Side Rendered (SSR) web framework powering public portals and SEO-optimized marketing pages.
7. **Flutter**: Cross-platform mobile application framework delivering Customer & Employee mobile apps for iOS and Android.
8. **Redis**: High-speed in-memory data store for session caching, rate limiting, and temporary state management.
9. **Cloudinary**: Cloud asset management for prescription scan images, PDF invoices, and company logos.
10. **JWT (JSON Web Tokens)**: Secure token authentication using 15-minute Access Tokens and 7-day HttpOnly Refresh Cookies.
11. **Socket.io**: Real-time bi-directional WebSocket engine powering live order tracking and instant low-stock notifications.

---

## Deployment Architecture & CI/CD Pipeline

1. **Vercel**: Monorepo serverless cloud deployment hosting the frontend SPA and Node serverless API functions (`/api/index.js`).
2. **MongoDB Atlas**: Fully managed multi-region cloud database cluster with automated snapshot backups and failover.
3. **Cloudinary**: High-availability CDN hosting compressed prescription scans and media assets.
4. **GitHub Actions**: Automated CI/CD pipelines executing lint checks, unit testing suites, and continuous production deployment on `git push origin main`.
