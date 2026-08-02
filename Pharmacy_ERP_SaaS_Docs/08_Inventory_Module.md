# 08 Inventory Module & FEFO Control

## Overview
The Inventory Module manages batch-level stock tracking, First-Expiry-First-Out (FEFO) deduction rules, stock intake, and expiry quarantine protocols.

## Core Mechanics
- **FEFO Batch Control**: Tracks batch number, expiry date, initial quantity, remaining balance, and cost/retail price. POS checkout automatically deducts from the earliest-expiring active batch.
- **Expiry Badges**:
  - Green: > 90 Days.
  - Yellow: 30-90 Days.
  - Red: < 30 Days (Quarantine).
  - Black: Expired (POS Billing Locked).
- **Stock Movements**: Receiving PO inflow, POS sales outflow, damage/discrepancy stock adjustments, and inter-branch transfers.
