# 21 RESTful API Documentation

## Overview
The Pharmacy ERP provides a standard RESTful API under `/api/v1` featuring JSON request/response bodies and Bearer Token + HTTP-Only Cookie authentication.

## Key Resource Routes
- `/api/v1/auth`: Authentication, session validation, logout, 2FA.
- `/api/v1/tenants`: Tenant onboarding and domain settings.
- `/api/v1/inventory`: Catalog medicines and FEFO batch inventory.
- `/api/v1/pos`: Checkout, invoices, shift register closing, refunds.
- `/api/v1/prescriptions`: AI OCR upload, listing, approval.
- `/api/v1/ai`: Interaction checks, generic suggestions, 30-day forecast.
- `/api/v1/employees`: Employee roster, shift scheduling, performance.
- `/api/v1/settings`: Tenant settings, thermal receipt template, tax rates.
