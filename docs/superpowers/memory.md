# Pharmacy ERP Memory

## Current state

- Backend: Express/Mongoose engine with JWT authentication, refresh tokens, RBAC, tenant discriminators, and Node test runner test harness.
- Frontend: React 19/Vite/Tailwind frontend with 0 ESLint errors/warnings, automatic JWT refresh interceptor, and full multi-tenant branch support.
- Fixed Issues: All 141 ESLint errors resolved, Axios response interceptor auto-refreshes JWT access tokens on 401, root workspace package scripts added (`dev`, `lint`, `build`, `test`), and automated backend test suite added (`node --test`).

## Goals

- Build a production-ready multi-tenant pharmacy ERP.
- Support multiple pharmacies, branches, roles, inventory, sales, customers, reports, and auditing.
- Implement secure auth, tenant-aware access control, and deployment-ready docs.

## Status

Phase 1 setup, authentication, authorization, roles, permissions, database schemas, protected routes, security, and automated tests fully verified and complete.
