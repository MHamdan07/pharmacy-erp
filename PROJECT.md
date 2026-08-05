# Project: Enterprise Prescription Processing Center

## Architecture
The Prescription Processing Center is a core enterprise module inside the Pharmacy ERP MERN stack.
- **Frontend Architecture**: React 19 + Vite + Tailwind CSS v4 + React Router v7 + Axios + Lucide React inside `frontend/`.
- **Backend Architecture**: Node.js + Express (ES Modules `"type": "module"`), Mongoose 8.3.4 ODM, mounted under `/api/v1/prescriptions`.
- **Multi-Tenant Isolation**: Dual-level isolation (`pharmacy` organization and `branch` location) enforced via `tenantMiddleware.js` (`req.pharmacyId`, `req.branchId`).
- **Clean Architecture & SOLID**: Component size <= 250 lines, function size <= 40 lines, isolated business logic in service layers (`frontend/src/services/prescriptionService.js` and backend controllers/services).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Prescription Schema Extension | Add patient/doctor refs, clinical validation fields, batch line matching, audit history, POS sale ref, and OCR timing metrics to `Prescription.js` | M1 | survey |
| 2 | Core CRUD & Auto-Suggest APIs | Endpoints for listing, filtering, patient auto-search, doctor auto-search | M1 | survey |
| 3 | Image Upload & Preprocessing Engine | Multi-format upload (PNG, JPG, PDF, camera, drag & drop) with client/server image adjustment controls (crop, rotate 90°, brightness, contrast, deskew preview) | M2 | survey |
| 4 | AI OCR Extraction & Confidence Service | Structured field extraction (medicines, dosages, patient, doctor, issue date) with visual per-field confidence scores (0-100%) and inline editing support | M2 | survey |
| 5 | Clinical Validation Safety Engine | 4-tier safety scanner: Drug-Drug Interactions (severity levels), Patient Allergy Cross-Reactivity, Dosage Limit Bounds, Pregnancy & Lactation Warnings | M3 | survey |
| 6 | Real-time Branch Inventory & FEFO Matcher | Multi-branch FEFO stock allocation (`expiryDate: 1`), sibling branch stock aggregation, and 1-click alternative medicine / generic substitution suggestions | M3 | survey |
| 7 | Pharmacist Review Workspace API | Workflow state machine actions: Approve, Reject, Edit, Request Clarification | M4 | survey |
| 8 | Audit Trail & Status Timeline Logging | Immutable logging of timestamp, user, action, and diff changes (`oldValue`, `newValue`) in `AuditLog` model | M4 | survey |
| 9 | POS Billing Sync Engine | Auto-generate draft invoice payload and execute FEFO stock reservation/deduction upon pharmacist approval | M4 | survey |
| 10| OCR & Prescription Analytics API | Aggregation pipeline calculating OCR accuracy %, stage processing times, approval/rejection ratios, and top prescribed drugs | M4 | survey |
| 11| Modular React UI Component Suite | Build `frontend/src/components/prescriptions/` subcomponents: Header, Upload, Preprocessor, OcrView, PatientDoctorSearch, ClinicalAlerts, InventoryLookup, Workspace, AuditTimeline, AnalyticsDashboard, PosSyncModal | M5 | survey |
| 12| Master Page & Routing | `frontend/src/pages/Prescriptions.jsx`, `/prescriptions` route update in `App.jsx`, re-export in `PrescriptionManagement.jsx` | M5 | survey |
| 13| Responsive Medical UI Theme | Full Light & Dark mode support, glassmorphism design tokens, medical theme palette, responsive layout | M5 | survey |
| 14| E2E Test Suite & Final Integration | Dual-track 4-Tier opaque-box test suite + Tier 5 adversarial testing + Forensic Integrity Verification | M6 | survey |

## Code Layout

### Frontend Layout
- `frontend/src/pages/Prescriptions.jsx` (Master page component)
- `frontend/src/pages/PrescriptionManagement.jsx` (Re-exports `Prescriptions.jsx`)
- `frontend/src/services/prescriptionService.js` (API communication layer)
- `frontend/src/components/prescriptions/`
  - `PrescriptionHeader.jsx`
  - `PrescriptionUpload.jsx`
  - `ImagePreprocessor.jsx`
  - `OcrExtractionView.jsx`
  - `PatientDoctorSearch.jsx`
  - `ClinicalValidationAlerts.jsx`
  - `BranchInventoryLookup.jsx`
  - `PharmacistReviewWorkspace.jsx`
  - `AuditTrailTimeline.jsx`
  - `PrescriptionAnalyticsDashboard.jsx`
  - `PosSyncModal.jsx`

### Backend Layout
- `backend/src/models/Prescription.js` (Enhanced Mongoose schema)
- `backend/src/controllers/prescriptionController.js` (Expanded controller endpoints)
- `backend/src/routes/prescriptionRoutes.js` (Route declarations)
- `backend/tests/` (Backend unit & integration tests)

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend Schema & Core API Foundation | Enhanced Mongoose `Prescription` schema, patient & doctor auto-suggest search APIs, base CRUD endpoints | none | PLANNED |
| M2 | AI OCR & Image Preprocessing Engine | Multi-format image upload handler, client/server preprocessing pipeline, structured AI OCR extraction & confidence scoring service | M1 | PLANNED |
| M3 | Clinical Safety & FEFO Inventory Engine | 4-tier Clinical Validation scanner (interactions, allergies, dosages, pregnancy) + Multi-branch FEFO stock matcher & 1-click generic alternative engine | M1 | PLANNED |
| M4 | Pharmacist Workstation, POS Sync & Analytics APIs | Pharmacist review workflow state machine (Approve/Reject/Edit/Clarify), POS draft invoice sync & stock deduction, Audit trail logger & Analytics MongoDB aggregations | M1, M2, M3 | PLANNED |
| M5 | Responsive Medical UI & Frontend Components | Frontend service layer, modular UI components in `frontend/src/components/prescriptions/`, master `Prescriptions.jsx` page, Light/Dark mode styling | M1, M2, M3, M4 | PLANNED |
| M6 | E2E Testing Track, Hardening & Audit Gate | Requirement-driven 4-tier E2E test suite (`TEST_READY.md`), Tier 5 adversarial testing, Forensic Audit verification gate check | M1, M2, M3, M4, M5 | PLANNED |

## Interface Contracts

### 1. GET `/api/v1/prescriptions/patients/search?q={query}`
- Response: `[ { _id, name, phone, allergies, medicalNotes } ]`

### 2. GET `/api/v1/prescriptions/doctors/search?q={query}`
- Response: `[ { name, registrationNumber, hospital } ]`

### 3. POST `/api/v1/prescriptions/:id/ocr`
- Payload: `{ imageAdjustments: { crop, rotate, brightness, contrast } }`
- Response: `{ ocrRawText, ocrConfidence, extractedMedicines: [ { rawName, matchedMedicineId, matchedMedicineName, dosage, frequency, duration, quantity, confidence } ], ocrProcessingTimeMs }`

### 4. POST `/api/v1/prescriptions/:id/validate-clinical`
- Response: `{ drugInteractions: [ { severity, drugPair: [string], clinicalDescription } ], allergyWarnings: [ { patientAllergy, triggeringDrug, severity } ], dosageWarnings: [ { medicineName, extractedDosage, maxDailyDosage, issue } ], pregnancyWarnings: [ { medicineName, fdaCategory, warningText } ], isSafe: boolean }`

### 5. GET `/api/v1/prescriptions/:id/inventory-match`
- Response: `{ items: [ { medicineId, medicineName, requestedQty, currentBranchStock, isAvailable, selectedBatch: { batchId, batchNumber, expiryDate, stockQty }, siblingBranchStock: [ { branchId, branchName, availableQty } ], alternativeSuggestions: [ { medicineId, name, genericName, price, priceDeltaPct, stockQty } ] } ] }`

### 6. PUT `/api/v1/prescriptions/:id/review`
- Payload: `{ action: 'approve' | 'reject' | 'edit' | 'request_clarification', reason, editedFields }`
- Response: `{ prescription: PrescriptionDoc, auditLog: AuditLogDoc }`

### 7. POST `/api/v1/prescriptions/:id/sync-pos`
- Response: `{ saleId, invoiceNumber, grandTotal, items: [...] }`

### 8. GET `/api/v1/prescriptions/analytics`
- Response: `{ ocrAccuracyPct, avgProcessingTimeMs, totalProcessed, approvalBreakdown: { approved, rejected, edited, pending }, topPrescribedMedicines: [ { name, count } ] }`
