# 01 System Architecture

## Overview
The **Pharmacy ERP & Inventory Management System** is built on an enterprise-grade MERN Stack (MongoDB, Express.js, React 19, Node.js) multi-tenant SaaS architecture.

## Clean Architecture Principles
- **Separation of Concerns**: Business logic is strictly isolated within backend services and controllers. React UI components remain purely presentational.
- **Multi-Tenant Data Scoping**: All database queries enforce tenant isolation using the `pharmacy` ObjectId discriminator.
- **Multi-Branch Isolation**: Branch-level data access is enforced using the `branch` ObjectId discriminator.
- **SOLID & Composition**: Prefer composition over inheritance with isolated feature modules.

## Architecture Layers
1. **Frontend Presentation (React 19 + Tailwind CSS)**: Modular pages, custom hooks, Axios API client, Recharts analytics, and Lucide icon design system.
2. **RESTful API Gateway (Express.js + Node.js)**: JSON REST API endpoints, RBAC permission guards, JWT authentication, and Helmet security middleware.
3. **Database Layer (MongoDB Atlas + Mongoose ODM)**: Multi-tenant collections (`pharmacies`, `branches`, `users`, `medicines`, `batches`, `sales`, `prescriptions`).
4. **Cloud Storage & Services**: Cloudinary for prescription image attachments, Vercel Serverless Functions for cloud hosting.
