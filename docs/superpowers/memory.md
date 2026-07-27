# Pharmacy ERP Memory

## Current state

- Backend: Express/Mongoose scaffold with auth, inventory routes, and eager multi-tenancy requirements.
- Frontend: React 19/Vite/Tailwind scaffold with login, dashboard, and inventory page.
- Existing issues: mixed CommonJS/ESM backend models, broken Axios interceptor, empty `AuditLog` file, no project-level workspace scripts, no multi-tenancy data isolation, and no test harness.
- Local agent assets: `D:\projects\agency-agents` and `D:\projects\superpowers` are available via junctions at `external\agency-agents` and `external\superpowers`.

## Goals

- Build a production-ready multi-tenant pharmacy ERP.
- Support multiple pharmacies, branches, roles, inventory, sales, customers, reports, and auditing.
- Implement secure auth, tenant-aware access control, and deployment-ready docs.
- Use the local superpowers/agency-agents methodology for planning and execution.

## Next major steps

1. Clean up project architecture and fix existing runtime issues.
2. Add pharmacy and branch multi-tenancy support.
3. Implement secure auth flows and role-based authorization.
4. Add customer, sales, invoice, and reporting operations.
5. Build protected frontend pages and consistent navigation.
6. Add tests, docs, and deployment instructions.
