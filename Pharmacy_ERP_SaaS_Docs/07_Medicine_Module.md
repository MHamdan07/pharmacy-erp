# 07 Medicine Database & Catalog

## Overview
The Medicine Database manages drug definitions, active pharmaceutical ingredients (APIs), dosage forms, barcodes, and pricing structures across tenant branches.

## Attributes
- **Commercial Name**: Commercial brand name (e.g. `Panadol Extra 500mg`).
- **Generic Name**: Active ingredient (e.g. `Paracetamol / Caffeine`).
- **Barcodes & QR Codes**: EAN-13 13-digit barcode + 2D QR JSON payload.
- **Pricing & Tax**: Wholesale cost price, retail price (MRP), VAT percentage.
- **Stock Control**: Minimum reorder level, maximum warehouse capacity.
- **Safety Flags**: Prescription Required (Rx), Controlled/Narcotic flag.
