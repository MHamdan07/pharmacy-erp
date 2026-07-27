# Agent Coordination Plan

This workspace is structured for a multi-agent delivery model:

- Backend agent: owns server setup, auth, inventory APIs, and database integration.
- Frontend agent: owns React/Vite UI, auth flow, dashboards, and routing.
- QA agent: validates build health, API routes, and regression checks.

## Suggested workflow

1. Backend agent implements and verifies API endpoints.
2. Frontend agent consumes the API and connects UI screens.
3. QA agent runs build and smoke tests for the full stack.
