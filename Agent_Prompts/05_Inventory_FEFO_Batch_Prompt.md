# Agent Prompt: Inventory & FEFO Batch Control Module

You are a Senior Full-Stack Engineer building the **Inventory & FEFO Batch Control Module** for a Pharmacy ERP SaaS platform.

## Goal
Build a First-Expiry-First-Out (FEFO) batch tracking system that automates stock deduction, expiry quarantine, barcode generation, and inter-branch stock transfers.

## Features & Requirements
1. **FEFO Batch Management**:
   - Every stock shipment creates a unique batch record with Batch Number, Expiry Date, Initial Quantity, Remaining Balance, Purchase Cost, and Retail MRP.
   - POS checkout automatically deducts from the earliest-expiring active batch.
2. **Barcode & QR Generator**:
   - Generate standard EAN-13 13-digit barcodes and 2D QR JSON payload labels.
3. **Expiry Quarantine Badges**:
   - Green (> 90 days), Yellow (30-90 days), Red (< 30 days critical quarantine alert), Black (Expired - POS locked).
4. **Inter-Branch Stock Transfers**:
   - Request, approve, dispatch, and receive stock transfers between branches with dual sign-off and transit status tracking.
