# 20 Database Schema Architecture

## Overview
The Database Architecture uses **MongoDB Atlas** with Mongoose ODM to maintain a scalable, multi-tenant document store.

## Core Schemas
- `pharmacies`: SaaS tenant accounts with domain prefix, contact info, and subscription plan.
- `branches`: Physical store locations linked to parent pharmacy tenant.
- `users`: User profiles with role, assigned branches, password hash, and 2FA secrets.
- `medicines`: Master product catalog with brand name, generic name, barcode, and min stock level.
- `batches`: Individual inventory shipments with batch number, FEFO expiry date, stock quantity, and pricing.
- `sales`: POS transaction records and itemized line details.
- `prescriptions`: Patient prescriptions, OCR raw text, extracted drugs, interaction alerts, and approval status.
- `employees`: Staff profiles, shifts, attendance, and role permissions.
- `settings`: Tenant configuration, receipt templates, and tax parameters.
