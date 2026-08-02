# AGENTS.md

# 💊 Pharmacy ERP System

Version: 1.0.0

---

# Project Vision

Build an enterprise-grade Pharmacy ERP & Inventory Management System using the MERN Stack.

This project is NOT a tutorial project.

It should be production-ready, scalable, secure, modular, and maintainable.

The goal is to build software that could realistically be deployed in pharmacies.

---

# Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios
- Recharts

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Nodemailer
- Multer
- PDFKit
- ExcelJS
- Socket.IO

## Database

MongoDB

ODM

Mongoose

Cloud

MongoDB Atlas

Images

Cloudinary

Version Control

Git

---

# Architecture

Use Clean Architecture.

Never write spaghetti code.

Follow SOLID Principles.

Prefer Composition over Inheritance.

Every feature should be isolated.

Business logic must never exist inside React components.

---

# Folder Structure

/client
/src
/assets
/components
/layouts
/pages
/hooks
/context
/services
/api
/constants
/utils
/types

/server
/src
/config
/controllers
/models
/routes
/services
/middlewares
/validators
/utils
/jobs
/uploads
/logs

/docs

/database

---

# Code Standards

Always produce:

- reusable code
- scalable code
- readable code
- secure code

Avoid

- duplicated code
- deeply nested logic
- long functions
- magic numbers
- inline business logic

Maximum function size

≈40 lines

Maximum component size

≈250 lines

---

# Naming Convention

Variables

camelCase

Functions

camelCase

Components

PascalCase

Database Collections

camelCase

API Routes

kebab-case

Folders

lowercase

---

# Comment Rules

Do NOT overcomment.

Only explain

- complex algorithms
- security logic
- business rules

---

# Error Handling

Never swallow errors.

Always

try

catch

Return proper HTTP status codes.

Example

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

---

# Logging

Every important action should be logged.

Examples

Login

Logout

Medicine Added

Medicine Deleted

Purchase Created

Invoice Generated

Role Changed

Password Changed

Stock Updated

---

# Security Rules

Passwords

bcrypt

JWT Authentication

Refresh Tokens

Helmet

Rate Limiter

Input Validation

No SQL Injection

No XSS

No CSRF

Secure Cookies

Environment Variables

Never expose secrets.

---

# Git Workflow

main

↓

develop

↓

feature/authentication

↓

feature/inventory

↓

feature/sales

↓

feature/reports

↓

feature/notifications

↓

feature/multi-branch

Every feature

↓

Pull Request

↓

Review

↓

Merge

---

# UI Rules

Modern

Minimal

Professional

Medical Theme

Rounded cards

Clean spacing

Responsive

Accessible

Dark Mode

Light Mode

Never use random colors.

---

# Color Palette

Primary

#2563EB

Success

#16A34A

Danger

#DC2626

Warning

#D97706

Background

#F8FAFC

Dark

#0F172A

---

# Typography

Inter

Font sizes

12

14

16

18

24

32

Spacing

Use 8px Grid System

---

# API Rules

RESTful

Plural Resources

Example

/api/users

/api/medicines

/api/suppliers

/api/purchases

/api/sales

/api/reports

Never

/api/getUsers

---

# Validation

Validate

Frontend

AND

Backend

Never trust client data.

---

# Authentication

Must include

Register

Login

Logout

Refresh Token

Forgot Password

Reset Password

Email Verification

Profile

Role-based Authorization

---

# Roles

Owner

Admin

Manager

Pharmacist

Cashier

Inventory Manager

Each route must check permissions.

---

# Database Principles

Collections

users

roles

permissions

medicines

categories

suppliers

customers

purchases

purchaseItems

sales

saleItems

inventoryLogs

payments

notifications

auditLogs

branches

settings

Never duplicate data.

Reference using ObjectId whenever appropriate.

---

# Required Features

Authentication

Medicine CRUD

Categories

Suppliers

Purchases

Inventory

Expiry Tracking

POS

Billing

Invoices

Reports

Barcode Generation

QR Code Generation

QR Scanner

PDF Export

Excel Export

Email Notifications

SMS Notifications

Dark Mode

Multi Branch

Audit Logs

Automatic Backups

AI Forecasting

Offline Mode

Deployment

---

# Audit Rules

Every database change should create an audit log.

Store

User

Timestamp

Old Value

New Value

IP Address

Action

---

# Performance Rules

Pagination

Lazy Loading

Database Indexes

Compression

Caching

Optimized Images

Debouncing

Memoization

Avoid unnecessary renders.

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus States

Screen Reader Support

Minimum Contrast Ratio

Responsive

---

# Testing

Every feature must include

Happy Path

Edge Cases

Failure Cases

Security Tests

Validation Tests

---

# Documentation

Every feature must contain

Overview

Folder Structure

API Endpoints

Database Changes

Testing Instructions

Known Limitations

Future Improvements

---

# AI Agent Rules

Every AI agent MUST:

1. Think before coding.

2. Explain architecture first.

3. Never generate unnecessary files.

4. Reuse existing utilities.

5. Never break existing APIs.

6. Ask if requirements are ambiguous.

7. Follow project conventions.

8. Prefer maintainability over shortcuts.

9. Generate production-quality code.

10. Avoid placeholder implementations unless explicitly requested.

---

# Definition of Done

A task is complete only if:

✅ Code compiles

✅ No TypeScript/ESLint errors

✅ Validation implemented

✅ Error handling implemented

✅ Security considered

✅ API documented

✅ Responsive UI

✅ Dark Mode compatible

✅ Tested

✅ Clean architecture maintained

---

# Subagent Team Architecture

The system is developed and maintained by 8 specialized AI subagents:

1. **`pharmacy-erp-architect`**: Lead System Architect (Multi-tenancy, Mongoose schemas, SOLID clean architecture).
2. **`pharmacy-erp-backend`**: Core API & Node/Express Engineer (REST endpoints, middleware, POS transactions, audit logs).
3. **`pharmacy-erp-frontend`**: React 19 & Tailwind UI Engineer (POS interface, branch context, dark medical theme).
4. **`pharmacy-erp-qa`**: Quality Assurance Specialist (Unit test suite, RBAC permission verification, seed data integrity).
5. **`pharmacy-erp-ai-specialist`**: AI System Specialist (OCR prescription reading, drug interaction alerts, demand forecasting).
6. **`pharmacy-erp-inventory-manager`**: Supply Chain Manager (FEFO batch tracking, barcode/QR, purchase orders, transfers).
7. **`pharmacy-erp-security-compliance`**: Security Specialist (2FA, JWT HTTP-only cookies, audit logs, backup/restore routines).
8. **`pharmacy-erp-ecommerce-customer`**: Customer Portal Specialist (Storefront, cart, checkout, local payment gateways).

---

# Current Development Phase

Phase 1

Weeks 1–2

Current Objective

Project Setup

Authentication

Authorization

Roles

Permissions

Database Schema

Protected Routes

Security

No other module should be started until Phase 1 is complete.

---

# Final Goal

Build a production-grade Pharmacy ERP capable of serving:

- Independent pharmacies
- Pharmacy chains
- Hospitals
- Medical stores

The software should be scalable to multiple branches, secure by default, easy to maintain, and extensible for future AI-powered features.