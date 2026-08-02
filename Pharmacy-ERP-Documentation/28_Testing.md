# 28 Quality Assurance & Testing Suite

## Overview
The System includes a automated Node.js test suite verifying JWT token issuance, multi-tenancy scoping, and role authorization.

## Test Suite Structure
- **Backend Tests**: Located in `backend/tests/` (Node.js test runner).
  - `auth.test.js`: Validates JWT generation and HttpOnly cookie options.
  - `rbac.test.js`: Verifies `authorizeRoles` and `authorizePermissions` middleware guards.
