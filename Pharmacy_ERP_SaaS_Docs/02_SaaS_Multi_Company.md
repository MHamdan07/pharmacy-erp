# 02 SaaS Multi-Company & Company Management

## Overview
The Multi-Company SaaS Module governs company profiles, tenant registrations, multi-branch operations, employee management, and plan upgrade workflows.

## Company Entity Data Fields

Each registered pharmacy enterprise maintains the following core data attributes:

- **Company Name**: Official registered legal entity name.
- **Logo**: Corporate brand image URL (stored via Cloudinary).
- **License Number**: Pharmaceutical retail/wholesale operating license number.
- **Tax Number**: National Tax Number (NTN) or VAT registration number.
- **Country**: Registered country of business operation.
- **City**: Corporate head office city location.
- **Address**: Full physical business address.
- **Email**: Corporate contact and billing email.
- **Phone**: Enterprise contact hotline.
- **Website**: Official website URL or custom domain alias.
- **Owner**: Assigned primary Company Owner profile (ObjectId reference to `User`).
- **Status**: Operational status (`active`, `suspended`, `expired`, `canceled`).
- **Subscription**: Active SaaS package tier (`Starter`, `Professional`, `Enterprise`).
- **Created Date**: System timestamp of organization onboarding.

---

## Company Capabilities & Actions

1. **Edit Profile**: Modify enterprise name, contact phone, email, tax number, and head office address.
2. **Change Logo**: Upload new corporate branding logo.
3. **Add Employees**: Register new cashiers, pharmacists, inventory staff, and branch managers.
4. **Add Branches**: Provision new physical outlets, hospital pharmacies, or distribution warehouses.
5. **Upgrade Plan**: Upgrade SaaS subscription tier to unlock additional branches, users, and AI modules.
6. **Suspend Branch**: Temporarily disable or reactivate individual branch store operations.
7. **Transfer Employees**: Reassign employees and staff members between branches.
