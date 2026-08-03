# 24 Branch Management & Multi-Outlet Operations

## Overview
The Branch Management Module enables pharmacy enterprises to manage multiple retail outlets, hospital outlets, and central warehouse distribution centers under a single corporate tenant.

## Branch Data Attributes

Each registered branch store contains the following data attributes:

- **Branch Name**: Physical store name (e.g. `HealthCare Main Branch`).
- **Manager**: Primary assigned Branch Manager profile (ObjectId reference to `User`).
- **Phone**: Branch contact hotline.
- **Email**: Store notification email address.
- **Address**: Full physical street location.
- **Warehouse Flag**: Boolean indicator (`isWarehouse`) distinguishing retail store outlets from central storage warehouses.
- **Assigned Cashiers**: List of active cashiers assigned to the branch.
- **Assigned Pharmacists**: List of clinical pharmacists assigned to the branch.
- **Assigned Inventory Staff**: List of inventory personnel assigned to the branch.
- **Status**: Operational status (`active`, `suspended`, `closed`).
- **Opening Hours**: Operating hours schedule (e.g. `08:00 AM - 10:00 PM`).

---

## Branch Dashboard Metrics & Widgets

The Branch Dashboard provides real-time operational visibility across 8 key performance indicators:

1. **Daily Sales**: Total sales revenue and transaction count generated today.
2. **Stock**: Total items and units currently available in branch active batches.
3. **Today's Orders**: Volume of completed POS sales and e-commerce orders today.
4. **Revenue**: Total monthly and cumulative gross revenue for the branch.
5. **Employees**: Total count of active staff members assigned to the branch.
6. **Customers**: Total registered patients and recurring customers linked to the branch.
7. **Low Stock**: Count of medicines whose stock level has fallen below the reorder threshold.
8. **Expiry Medicines**: Count of inventory batches entering the 30-day or 60-day expiration window.

---

## Role Access Control Scoping Rules

To maintain strict operational security and data isolation, branch access is scoped by user role:

- **Company Owner**: Full access across all branches with dynamic branch-switcher control.
- **Branch Manager**: Full operational access restricted strictly to their assigned branch.
- **Cashier**: Access restricted exclusively to POS Billing, Cash Register, and Thermal Receipts.
- **Pharmacist**: Access restricted to Prescription Intake Queue, AI OCR Verification, and Drug Interaction Warnings.
- **Inventory Staff**: Access restricted to Batch Management, Stock Intake, Barcodes, and FEFO Expiry Controls.
- **Customer**: Access restricted strictly to own patient profile, cart, prescription uploads, and order history.
