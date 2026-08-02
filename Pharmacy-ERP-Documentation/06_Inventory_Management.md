# 06 Inventory Management & FEFO Control

## Overview
The Inventory Management Module enforces strict **First-Expiry-First-Out (FEFO)** batch tracking across all pharmacy branches. It prevents dispensing expired medications, automates stock replenishment, and tracks movement from supplier receiving to POS checkout.

## Integrated Tools & Features

### 1. FEFO Batch Inventory Engine
- **Batch Tracking**: Every incoming shipment creates a unique `Batch` record:
  - Batch Number (`BATCH-2026-08A`)
  - Expiry Date (`2026-12-31`)
  - Initial Quantity & Remaining Quantity
  - Purchase Price & Retail Price
- **Automatic Stock Deduction**: POS checkout automatically selects items from the batch with the **earliest expiry date**.

### 2. Barcode & QR Code Generator Tool
- **EAN-13 Barcode Generator**: Generates 13-digit standard barcodes for quick POS scanner readouts.
- **2D QR Code Generator**: Encodes JSON payloads with SKU, Batch Number, Expiry Date, and Retail Price.

### 3. Expiry Warning Badges & Quarantine Workflow
- **Green Badge (> 90 Days)**: Good stock.
- **Yellow Warning (30-90 Days)**: Prompts promotional discount or return to supplier.
- **Red Alert (< 30 Days)**: Automatic quarantine alert.
- **Black Badges (Expired)**: Billed POS checkout locked automatically.

### 4. Inter-Branch Stock Transfer Tool
- **Request & Approval**: Branch A requests stock from Branch B.
- **Transit Status Tracking**: `Requested` -> `Approved` -> `Dispatched` -> `Received`.
- **Dual Sign-Off**: Ensures quantity reconciliation upon arrival.

## API Endpoints
- `GET /api/v1/inventory/batches`: Fetch all active batches sorted by FEFO.
- `GET /api/v1/expiry/upcoming`: List medicines nearing expiration.
- `POST /api/v1/transfers`: Create inter-branch stock transfer request.
- `PUT /api/v1/transfers/:id/status`: Approve or dispatch stock transfer.
