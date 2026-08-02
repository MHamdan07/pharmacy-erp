# 04 Authentication & Security Controls

## Overview
The Authentication Module enforces secure multi-tenant identity verification, role-based authorization (RBAC), HttpOnly cookie session management, account lockout protection, and two-factor authentication (2FA).

## Security Mechanisms
- **JWT Tokens**: 15-minute Access Tokens + 7-day HttpOnly `refreshToken` cookies (`sameSite: none`, `secure: true`).
- **Password Protection**: Salted bcrypt hashing (10 rounds) with safe fallback matching.
- **Account Lockout**: 5 failed login attempts trigger an automatic 15-minute account lock.
- **Two-Factor Authentication (2FA)**: Time-based 6-digit OTP sent to registered email for sensitive role logins.
- **Audit Logging**: Every login, logout, and security lockout event is recorded in the `AuditLog` collection.
