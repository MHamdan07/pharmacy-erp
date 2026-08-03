# 23 Subscription System & SaaS Packages

## Overview
The Subscription System manages SaaS package tiers, plan limit enforcement, feature flags, recurring billing lifecycles, and administrative plan modifications.

## 4 SaaS Package Tiers

1. **Starter Plan ($99 / month)**: Designed for single-location small retail medical stores.
2. **Professional Plan ($299 / month)**: Designed for growing multi-branch pharmacy chains.
3. **Enterprise Plan ($799 / month)**: Designed for hospital networks requiring AI OCR & demand forecasting.
4. **Unlimited Plan ($1499 / month)**: Designed for large-scale national pharmacy networks requiring unlimited scaling and dedicated 24/7 technical support.

---

## Package Control Parameters

Each subscription package controls the following operational capabilities and system thresholds:

- **Maximum Branches**: Cap on total physical outlets, hospital pharmacies, or distribution warehouses.
- **Maximum Employees**: Cap on registered employee staff accounts per organization.
- **Maximum Medicines**: Cap on total active drug catalog SKUs.
- **Storage**: Cloud storage quota (GB) for prescription scan images, PDF invoices, and backup archives.
- **Reports**: Access level for financial, inventory valuation, and audit log reports.
- **AI Features**: Toggle for AI OCR prescription parsing, drug interaction scanner, and 30-day demand forecasting.
- **Mobile App**: Access to delivery agent GPS app, manager mobile portal, and PWA patient storefront.
- **API Access**: Access to RESTful developer APIs and custom webhook integrations.
- **Support**: SLA response level (Standard, Priority, or Dedicated 24/7 Support).

---

## Package Comparison Matrix

| Controlled Parameter | Starter | Professional | Enterprise | Unlimited |
|---|---|---|---|---|
| **Max Branches** | 1 Branch | 5 Branches | 999 Branches | Unlimited |
| **Max Employees** | 3 Staff | 15 Staff | 999 Staff | Unlimited |
| **Max Medicines** | 500 SKUs | 99,999 SKUs | 999,999 SKUs | Unlimited |
| **Storage Quota** | 2 GB | 20 GB | 100 GB | 1,000 GB |
| **Reports Engine** | Standard | Advanced + Excel | Full PDF & Excel | Custom Analytics |
| **AI Features** | ❌ Disabled | Basic Warnings | Full AI OCR & Forecast | Custom AI Models |
| **Mobile App & PWA** | Patient PWA | PWA + Delivery | Full App Suite | White-Label App |
| **API Access** | ❌ Disabled | ❌ Disabled | ✅ Enabled | ✅ Unlimited API |
| **Support SLA** | Email Support | Priority Support | Dedicated Manager | 24/7 Live Support |

---

## Admin Action Controls

Super Administrators and Company Owners can execute 5 core subscription action controls:

1. **Upgrade**: Instantly upgrade active subscription plan to a higher tier with expanded limits and unlocked features.
2. **Downgrade**: Transition to a lower subscription tier at the conclusion of the active billing cycle.
3. **Suspend**: Temporarily suspend pharmacy organization access due to non-payment or compliance review.
4. **Renew**: Extend active subscription period by 30 days or 1 year.
5. **Cancel**: Schedule subscription cancellation at period end while preserving data access until expiration.
