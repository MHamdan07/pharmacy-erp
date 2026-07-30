# Pharmacy ERP

Full-stack multi-tenant pharmacy ERP for branch inventory, purchasing, sales, and audit logging.

## Local setup

### Backend

1. Copy backend environment example:
   - `cd backend && cp .env.example .env`
2. Install backend dependencies:
   - `cd backend && npm install`
3. Start backend development server:
   - `cd backend && npm run dev`

### Frontend

1. Copy frontend environment example:
   - `cd frontend && cp .env.example .env`
2. Install frontend dependencies:
   - `cd frontend && npm install`
3. Start frontend development server:
   - `cd frontend && npm run dev`

### Workspace

If you want to run both projects from the repo root:

```bash
npm install
npm run dev
```

### Backend

- Entry point: `backend/server.js`
- Environment variables: `backend/.env.example`
- API prefix: `/api/v1`

### Frontend

- Entry point: `frontend/src/main.jsx`
- Axios base URL: `/api/v1`

### Docker development

The repo includes `docker-compose.yml` at the root.

Start the stack with:

```bash
docker compose up --build
```

This will start MongoDB, the backend, and the frontend for local development.

### Docs and agent plans

- `docs/superpowers/plans/` contains the implementation plan.
- `.agents/skills/pharmacy-erp/SKILL.md` contains the repository-specific pharmacy ERP agent guidance.
