# 15 Financial Reports & Analytics Studio

## Overview
The Reports & Analytics Module provides comprehensive financial, operational, and inventory analytics with 1-click Excel (ExcelJS) and PDF (PDFKit) exports.

## Integrated Tools & Export Engines

### 1. Excel Export Engine (ExcelJS Tool)
- **Features**: Generates styled `.xlsx` spreadsheets with multi-tab worksheets, header formatting, column auto-fit, and formula totals.
- **Worksheets**: Sales Summary, Itemized Inventory Valuation, Batch Expiry Risk Matrix, Supplier Payable Ledger.

### 2. PDF Document Generator Tool (PDFKit)
- **Features**: Generates vector PDF reports with custom company branding, logo header, data tables, and digital footer signatures.

### 3. Analytics & Reporting Views
- **Daily / Monthly Sales Report**: Total revenue, COGS, gross profit margin, tax collected.
- **Top-Selling Drugs Chart**: Ranked by sales volume, revenue, and profit margin using Recharts visual charts.
- **Inventory Stock Valuation**: Total stock value at purchase cost vs retail price.
- **Branch Revenue Comparison**: Side-by-side performance metrics across multi-branch locations.

## API Endpoints
- `GET /api/v1/reports/dashboard-metrics`: Fetch real-time dashboard KPIs.
- `GET /api/v1/reports/sales/export-excel`: Download sales report as Excel file.
- `GET /api/v1/reports/sales/export-pdf`: Download sales report as PDF document.
