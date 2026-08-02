# 19 Security & Compliance Standards

## Overview
The Security Module enforces enterprise-grade security protocols across all application layers to safeguard sensitive healthcare data and ensure strict multi-tenant isolation.

## Controls
- **JWT & HttpOnly Refresh Cookies**: 15-minute Access Tokens + 7-day HttpOnly SameSite Refresh Cookies (`sameSite: none`, `secure: true`).
- **Password Security**: Salted bcrypt hashing (10 rounds).
- **Two-Factor Authentication (2FA)**: OTP verification for administrative logins.
- **Account Lockout**: 5 failed login attempts trigger an automatic 15-minute account lock.
- **Rate Limiting**: Custom IP rate limiter protecting against brute-force attacks (200 req/15 min).
- **Data Scoping**: Strict Mongoose query scoping with `pharmacy` and `branch` ObjectIds.
