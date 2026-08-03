# 12 Cashier Module & POS Workstation

## Overview
The Cashier Module provides a dedicated high-speed Point of Sale (POS) workstation designed specifically for **Cashiers**. Cashiers manage daily sales counter operations, scan product barcodes, collect payments, print thermal receipts, and perform shift cash reconciliations.

---

## Cashier Dashboard & Counter Management

Cashiers operate with real-time counter controls:

- **Today's Sales**: Live counter display tracking cumulative sales revenue and invoice counts generated during the active shift.
- **Open Counter**: Shift startup action initializing the cash drawer float balance (e.g. $100 starting cash).
- **Close Counter**: End-of-shift action closing the counter session and generating the shift Z-report.

---

## 12 Core POS Billing Tools

1. **POS Billing**: High-speed itemized cart interface for fast retail sales checkout.
2. **Generate Invoice**: Instant creation of official sales invoice with unique tax registration number.
3. **Scan Barcode**: USB / Bluetooth 1D & 2D barcode scanner integration for instant product lookup.
4. **Search Medicine**: Instant drug catalog search by commercial brand or active generic ingredient with stock counts.
5. **Apply Discount**: Line-item unit discount or total invoice percentage discount application.
6. **Coupons**: Promotional code validation and coupon discount deduction.
7. **Returns**: Sales return processing for non-damaged or customer-exchanged products.
8. **Refunds**: Immediate cash/card refund processing with restock logs.
9. **Customer Lookup**: Patient search by phone/email to automatically attach profile and apply loyalty reward points.
10. **Print Receipt**: Direct 80mm ESC/POS thermal receipt printing with verification QR code.
11. **Cash Drawer**: Automated electronic cash drawer trigger kick upon payment confirmation.
12. **Shift Report**: End-of-shift Z-Report summary detailing total cash, card, and digital wallet collections.

---

## Payment Collection Gateways & Daily Closing

### Payment Channels
- **Cash**: Direct cash payment with automated change calculation.
- **JazzCash**: Mobile digital wallet payment processing.
- **EasyPaisa**: Digital wallet QR code collection.
- **Card**: Credit & Debit card terminal integration.

### Daily Closing & Cash Reconciliation
- **Physical Cash Count**: Cashier inputs actual physical currency counted in the drawer at shift end.
- **Variance Log**: System automatically compares physical drawer cash against calculated system cash and flags any cash discrepancy.

---

## Cashier Access Boundaries & Constraints

To ensure strict operational security and inventory integrity, Cashiers are governed by strict RBAC access boundaries:

### ✅ Permitted Cashier Capabilities
- Access POS Billing Terminal
- Process Sales Returns & Refunds
- Access Customer Orders & Invoices
- Print Thermal Receipts & Shift Reports

### ❌ Strict Cashier Prohibitions
- **NO Inventory Editing**: Cashiers cannot alter medicine prices, stock levels, or batch quantities.
- **NO Company Settings**: Cashiers cannot access corporate profiles, tax parameters, or subscription settings.
