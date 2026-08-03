# 01 System Architecture & Platform Blueprint

## Overview
The **Pharmacy ERP & Inventory Management System** is a cloud-based multi-tenant SaaS platform where multiple pharmacy companies can register their organizations, subscribe to different plans, create multiple branches, and manage medicines, inventory, prescriptions, billing, employees, reports, and customers from one centralized dashboard.

## Platform Component Layers
1. **ERP Website**: Main operational web application for branch managers, pharmacists, cashiers, and inventory staff.
2. **Admin Software**: Super Admin platform control panel for SaaS onboarding, tenant management, and subscription tracking.
3. **Customer Website**: Public e-commerce portal at `/store` for patient browsing, prescription upload, and online ordering.
4. **Customer Mobile App**: PWA and mobile-first interface for order tracking, prescription camera uploads, and delivery routing.
5. **SaaS Subscription System**: Multi-tiered subscription engine governing feature gates, branch limits, and recurring billing.

## Platform Users (8 Roles)
- **Administrator (Super Admin)**: Global SaaS platform oversight, tenant subscriptions, global analytics, and system maintenance.
- **Company Owner**: Full enterprise tenant control, multi-branch setup, subscription billing, and executive financial reports.
- **Branch Manager**: Branch-level inventory, stock transfers, employee shift scheduling, and local sales approvals.
- **Pharmacist**: Prescription review & pricing, dosage verification, drug interaction checking, and clinical sign-off.
- **Cashier (Main Operational User)**: High-speed POS checkout, barcode/QR scanning, cash/card payment collection, thermal receipt printing, and sales returns.
- **Inventory Staff**: Purchase order receiving, batch creation, stock intake, barcode labeling, and expiry quarantine checks.
- **Delivery Staff**: Order dispatch, delivery routing, proof-of-delivery capture, and order status updates.
- **Customer / Patient**: Public storefront browsing, generic drug search, online order placement, prescription upload, and delivery tracking.

## Clean Architecture Principles
- **Separation of Concerns**: Business logic is strictly isolated within backend services and controllers. React UI components remain purely presentational.
- **Multi-Tenant Data Scoping**: All database queries enforce tenant isolation using the `pharmacy` ObjectId discriminator.
- **Multi-Branch Isolation**: Branch-level data access is enforced using the `branch` ObjectId discriminator.
- **SOLID & Composition**: Prefer composition over inheritance with isolated feature modules.
