# 16 Notification System & Alert Center

## Overview
The Notification System delivers real-time multi-channel alerts across in-app UI badges, email notifications (Nodemailer), and SMS gateways.

## Triggers
- **Low Stock Warning**: Product stock drops below `minStockLevel`.
- **Expiry Risk Alert**: Batch enters 30-day critical expiry window.
- **Prescription Upload Alert**: Notifies Pharmacists of new patient prescription uploads.
- **Stock Transfer Alert**: Notifies branch managers of pending inter-branch transfer requests.
- **Security Alert**: Notifies users of new device logins or 2FA code requests.
