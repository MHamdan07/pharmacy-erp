# 08 Cashier Module & High-Speed POS Terminal

## Overview
The Cashier Module provides a high-speed, touch-friendly Point of Sale (POS) interface optimized for fast retail checkout. It supports physical barcode scanning, QR code reading, thermal receipt printing, split payment processing, and automatic FEFO batch inventory deduction.

## Integrated Tools & Features

### 1. High-Speed Barcode & QR Scanner Tool
- **1D / 2D USB & Bluetooth Scanner Input**: Instant item lookup by EAN-13 barcode or QR code.
- **Visual Quick Keys**: Touch grid pills for top-selling OTC products.

### 2. ESC/POS Thermal Receipt Printing Tool
- **80mm Thermal Receipt Generator**: Prints itemized layout including Pharmacy Header, Tax ID, Itemized List, Batch Number, Expiry Date, Cashier Name, and QR Receipt Verification Code.

### 3. Multi-Method Payment & Split Payment Engine
- **Cash**: Instant change calculation.
- **Card / POS Terminal**: Credit & Debit card integration.
- **Digital Wallets**: JazzCash, EasyPaisa, QR payments.
- **Split Payments**: Pay partial cash and remaining amount via card or digital wallet.

### 4. Shift Cash Register Closing Tool (Z-Report)
- **Shift Reconciliation**: Compares expected cash in drawer vs physical cash counted at end of shift.
- **Variance Log**: Automatically logs cash discrepancies for audit review.

## API Endpoints
- `POST /api/v1/pos/checkout`: Process POS sale and generate thermal invoice.
- `GET /api/v1/pos/invoices/:id`: Fetch invoice details for re-printing.
- `POST /api/v1/pos/refund`: Process sales refund and restock non-damaged items.
