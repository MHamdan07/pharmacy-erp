# 04 Prescription Module & AI OCR Engine

## Overview
The Prescription Module provides end-to-end digital prescription processing, combining patient intake, camera image scanning, AI OCR text extraction, drug-drug interaction warning scanning, and Pharmacist 1-click approval.

## Integrated Tools & Features

### 1. AI OCR Scanner Tool
- **Input Types**: High-res images (`.png`, `.jpg`, `.jpeg`), PDF documents, and camera scans.
- **Parsing Engine**: Automatically extracts:
  - Patient Name & Doctor Details.
  - Prescribed Drug Names, Strengths (e.g. `500mg`), and Frequencies (e.g. `TDS x 5 days`).
- **Confidence Metrics**: Displays color-coded OCR confidence scores (e.g. `96.8% Confidence`).

### 2. Drug-Drug Interaction (DDI) Scanner
- **Safety Rules**: Scans extracted medications against internal drug interaction database.
- **Alert Levels**:
  - `CRITICAL`: Co-administration contraindicated (e.g., Warfarin + High-dose Aspirin).
  - `MODERATE`: Enhanced monitoring required (e.g., Paracetamol + Ibuprofen).
  - `MILD`: Minor therapeutic overlap.

### 3. Generic Alternative Recommender Tool
- **Stock Matching**: Matches prescribed brand names against available branch inventory.
- **1-Click Substitution**: Recommends in-stock generic equivalents with equal strength and dosage form.

### 4. Pharmacist Approval & Sign-Off Workstation
- **Digital Sign-Off**: Attaches Pharmacist License Number, Timestamp, and Digital Signature.
- **POS Unlock**: Approved prescriptions immediately appear in POS cashier billing queue.

## API Endpoints
- `POST /api/v1/prescriptions/upload`: Upload prescription and run AI OCR analysis.
- `GET /api/v1/prescriptions`: Fetch all prescriptions with filter flags.
- `PUT /api/v1/prescriptions/:id/approve`: Pharmacist approval endpoint.
