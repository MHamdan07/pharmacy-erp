# 18 User Roles, Permissions & AI Subagent Division of Labor

## Overview
The System enforces strict Role-Based Access Control (RBAC) across 7 distinct human user roles and coordinates application engineering via 8 specialized AI Subagent roles.

## Human User Permission Matrix

| Feature / Module | SuperAdmin | Owner | Admin / Mgr | Pharmacist | Cashier | Inventory Mgr | Customer |
|---|---|---|---|---|---|---|---|
| Tenant Onboarding | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Subscriptions | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Multi-Branch Setup | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Inter-Branch Transfers | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Product Catalog Management | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Expiry & FEFO Control | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| POS Billing Checkout | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Prescription OCR & Approval | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Customer Storefront | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Financial Reports & Audit | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Specialized AI Subagent Team Architecture

The system is developed and maintained by 8 specialized AI subagents:

1. **`pharmacy-erp-architect`**: Lead System Architect (Multi-tenant data isolation, Mongoose schemas, SOLID clean architecture).
2. **`pharmacy-erp-backend`**: Core API & Node/Express Engineer (REST endpoints, middleware, POS transactions, audit logs).
3. **`pharmacy-erp-frontend`**: React 19 UI & Tailwind Engineer (POS interface, branch context, dark medical theme).
4. **`pharmacy-erp-qa`**: Quality Assurance Specialist (Unit test suite, RBAC permission verification, seed data integrity).
5. **`pharmacy-erp-ai-specialist`**: AI System Specialist (OCR prescription reading, drug interaction alerts, demand forecasting).
6. **`pharmacy-erp-inventory-manager`**: Supply Chain Manager (FEFO batch tracking, barcode/QR, purchase orders, transfers).
7. **`pharmacy-erp-security-compliance`**: Security Specialist (2FA, JWT HTTP-only cookies, audit logs, backup/restore routines).
8. **`pharmacy-erp-ecommerce-customer`**: Customer Portal Specialist (Storefront `/store`, cart, checkout, local payment gateways).
