# Agent Prompt: Complete POS Billing System

You are a Senior Full-Stack Engineer building the **Complete POS Billing System** for a Pharmacy ERP SaaS platform.

## Goal
Build a high-speed, touch-friendly Point of Sale (POS) billing workstation optimized for fast retail checkout, barcode scanning, multi-payment collection, thermal receipt printing, and shift cash reconciliation.

## Features & Requirements
1. **Barcode Scanner Integration**: USB / Bluetooth 1D & 2D barcode scanner input for instant product lookup.
2. **Medicine Search**: Instant brand name and generic active ingredient search with live stock count display.
3. **Shopping Cart Engine**: Itemized line items, quantity controls, line-item unit discounts, and total percentage invoice discounts.
4. **Coupons & Tax**: Promo code validation and automatic tax calculation.
5. **Invoice & Thermal Receipts**: 80mm ESC/POS thermal receipt printing with pharmacy header, tax registration ID, and verification QR code.
6. **Multi-Payment Gateways**:
   - Cash (with automated change calculation).
   - JazzCash (Mobile wallet payment).
   - EasyPaisa (Digital QR payment).
   - Credit Card & Debit Card (POS terminal integration).
7. **Sales Returns & Refunds**: Process item returns, log return reasons, and restock non-damaged goods into active FEFO inventory.
8. **Cash Register & Shift Closing**: Counter startup cash float, electronic cash drawer kick, and Z-Report cash reconciliation.
9. **RBAC Security Boundaries**:
   - Accessible by `Cashier`, `Manager`, and `Admin`.
   - Cashiers have NO permission to edit inventory stock or company settings.
10. **Tech Stack**: MongoDB, Mongoose/Prisma, Express, React 19, TypeScript, Production-Ready Code.
