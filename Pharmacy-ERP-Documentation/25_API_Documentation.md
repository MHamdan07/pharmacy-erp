# 25 RESTful API Documentation

## Overview
The Pharmacy ERP provides a standard RESTful API under `/api/v1` featuring JSON request/response bodies and Bearer Token + HTTP-Only Cookie authentication.

## Key API Resources

### Authentication (`/api/v1/auth`)
- `POST /login`: Authenticate user and issue JWT access token + refresh cookie.
- `POST /logout`: Revoke active session and clear HTTP-Only cookies.
- `GET /me`: Fetch authenticated user profile and permissions.

### Inventory & Batches (`/api/v1/inventory`)
- `GET /`: Fetch catalog medicines with stock totals.
- `GET /batches`: List active batches ordered by FEFO expiry date.
- `POST /batches`: Add new shipment batch.

### POS & Sales (`/api/v1/pos`)
- `POST /checkout`: Process sale, deduct FEFO stock, and generate invoice.
- `GET /invoices/:id`: Fetch invoice details.

### AI Engine (`/api/v1/ai`)
- `POST /check-interactions`: Check drug-drug interaction warnings for medicine list.
- `GET /demand-forecast`: Generate 30-day inventory demand forecast.
- `POST /suggest-alternatives`: Get available generic alternatives for out-of-stock items.
