# Pharmacy ERP

Full-stack multi-tenant pharmacy ERP for branch inventory, purchasing, sales, and audit logging.

## Local setup

1. Copy backend environment example:
   - `cd backend && cp .env.example .env`
2. Copy frontend environment example:
   - `cd frontend && cp .env.example .env`
3. Install dependencies:
   - `npm install`
4. Start development servers:
   - `npm run dev`

## Backend

- Entry point: `backend/server.js`
- Environment variables: `backend/.env.example`
- API prefix: `/api/v1`

## Frontend

- Entry point: `frontend/src/main.jsx`
- Axios base URL: `/api/v1`

## Docker development

Run MongoDB locally with Docker Compose:

```bash
docker compose up -d
```

This starts MongoDB on port `27017` and can be used by the backend with the example connection string.
