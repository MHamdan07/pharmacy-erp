# E2E Test Infra: Prescription Processing Center

## Test Philosophy

The Prescription Processing Center is a safety-critical enterprise module within the Pharmacy ERP system. Because prescriptions directly impact clinical outcome, patient safety, multi-tenant data boundary integrity, and financial accounting (POS billing sync), testing must be comprehensive, opaque-box, and deterministic.

### Core Testing Principles
1. **Zero-Trust Clinical & Tenant Boundaries**: Every API endpoint and frontend component must enforce multi-tenant isolation (`pharmacy` organization and `branch` location) and rigorous clinical safety checks (drug interactions, allergies, dosages, pregnancy bounds).
2. **Dual-Track & 4-Tier Structure**: Testing is structured into four deterministic tiers covering feature completeness, boundary edge cases, cross-feature interaction pipelines, and real-world clinical workloads.
3. **Genuine Real-State Verification**: Hardcoded values, facade test runners, or mock bypasses are strictly prohibited. Tests execute real state transitions, schema validations, DB queries, and API payloads.
4. **FEFO Inventory Integrity**: All inventory reservation and deduction tests must strictly validate First-Expired, First-Out (`expiryDate: 1`) sorting rules across single and multi-branch queries.
5. **Audit Trail Immutability**: All status transitions (Approve, Reject, Edit, Request Clarification) and POS billing sync events must generate non-modifiable audit trail log entries with exact diff tracking (`oldValue`, `newValue`).

---

## Feature Inventory & Test Coverage Requirements

The Prescription Processing Center comprises **14 core features**. The test suite mandates comprehensive coverage across all 4 tiers, enforcing a minimum of **162 test cases** (70 Tier 1 + 70 Tier 2 + 15 Tier 3 + 7 Tier 4).

| # | Feature Name | Tier 1: Feature Coverage (min 5) | Tier 2: Boundary & Corner (min 5) | Tier 3: Interactions (min 15 total) | Tier 4: Scenarios (min 7 total) | Total Minimum Coverage |
|---|--------------|----------------------------------|-----------------------------------|--------------------------------------|---------------------------------|------------------------|
| 1 | Prescription Schema Extension | 5 test cases (T1-01 - T1-05) | 5 test cases (T2-01 - T2-05) | T3-06, T3-14 | T4-02, T4-05 | 14 test references |
| 2 | Core CRUD & Auto-Suggest APIs | 5 test cases (T1-06 - T1-10) | 5 test cases (T2-06 - T2-10) | T3-01, T3-09, T3-14 | T4-01, T4-05 | 15 test references |
| 3 | Image Upload & Preprocessing Engine | 5 test cases (T1-11 - T1-15) | 5 test cases (T2-11 - T2-15) | T3-01, T3-10 | T4-01, T4-04 | 14 test references |
| 4 | AI OCR Extraction & Confidence Service | 5 test cases (T1-16 - T1-20) | 5 test cases (T2-16 - T2-20) | T3-01, T3-02, T3-10 | T4-01, T4-04, T4-06 | 16 test references |
| 5 | Clinical Validation Safety Engine | 5 test cases (T1-21 - T1-25) | 5 test cases (T2-21 - T2-25) | T3-02, T3-03, T3-09, T3-13 | T4-02, T4-05 | 16 test references |
| 6 | Real-time Branch Inventory & FEFO Matcher | 5 test cases (T1-26 - T1-30) | 5 test cases (T2-26 - T2-30) | T3-04, T3-07 | T4-03, T4-06 | 14 test references |
| 7 | Pharmacist Review Workspace API | 5 test cases (T1-31 - T1-35) | 5 test cases (T2-31 - T2-35) | T3-03, T3-05, T3-06, T3-07, T3-11 | T4-01, T4-02, T4-04, T4-05 | 19 test references |
| 8 | Audit Trail & Status Timeline Logging | 5 test cases (T1-36 - T1-40) | 5 test cases (T2-36 - T2-40) | T3-05, T3-06, T3-14 | T4-02, T4-05, T4-06 | 16 test references |
| 9 | POS Billing Sync Engine | 5 test cases (T1-41 - T1-45) | 5 test cases (T2-41 - T2-45) | T3-04, T3-08, T3-11 | T4-01, T4-03, T4-07 | 16 test references |
| 10| OCR & Prescription Analytics API | 5 test cases (T1-46 - T1-50) | 5 test cases (T2-46 - T2-50) | T3-08, T3-12 | T4-06 | 13 test references |
| 11| Modular React UI Component Suite | 5 test cases (T1-51 - T1-55) | 5 test cases (T2-51 - T2-55) | T3-11, T3-13 | T4-01, T4-02, T4-04 | 15 test references |
| 12| Master Page & Routing | 5 test cases (T1-56 - T1-60) | 5 test cases (T2-56 - T2-60) | T3-12 | T4-01, T4-06 | 13 test references |
| 13| Responsive Medical UI Theme | 5 test cases (T1-61 - T1-65) | 5 test cases (T2-61 - T2-65) | T3-13 | T4-01, T4-02 | 13 test references |
| 14| E2E Test Suite & Final Integration | 5 test cases (T1-66 - T1-70) | 5 test cases (T2-66 - T2-70) | T3-15 | T4-01 - T4-07 | 18 test references |

---

## Test Architecture & Harness Details

The Prescription Processing Center test runner is built on the native Node.js Test Runner (`node --test`), leveraging native `node:assert/strict` assertions and Mongoose in-memory database tooling (`mongodb-memory-server` or dedicated test database URI).

### Test Architecture Components
```
tests/
├── setup.js                      # In-memory MongoDB bootstrap & tenant context seeder
├── fixtures/                     # Test fixtures (prescriptions, drugs, patients, doctors)
│   ├── prescriptionFixtures.js
│   ├── patientFixtures.js
│   └── medicineFixtures.js
├── tier1_feature_coverage/       # Tier 1: Feature Coverage (T1-01 to T1-70)
│   ├── schema.test.js
│   ├── crud.test.js
│   ├── upload.test.js
│   ├── ocr.test.js
│   ├── clinical.test.js
│   ├── fefo.test.js
│   ├── workspace.test.js
│   ├── audit.test.js
│   ├── pos_sync.test.js
│   ├── analytics.test.js
│   ├── components.test.js
│   ├── routing.test.js
│   ├── theme.test.js
│   └── e2e_integration.test.js
├── tier2_boundary_corner/        # Tier 2: Boundary & Corner Cases (T2-01 to T2-70)
├── tier3_interactions/           # Tier 3: Cross-Feature Interactions (T3-01 to T3-15)
└── tier4_real_world/             # Tier 4: Real-World Scenarios (T4-01 to T4-07)
```

### Key Execution Environment Specs
- **Runner**: Node.js built-in test runner (`node --test tests/**/*.test.js`)
- **Backend Stack**: Node.js ES Modules (`"type": "module"`), Express, Mongoose 8.3.4
- **Tenant Context**: Injected header parameters `X-Pharmacy-Id` and `X-Branch-Id`
- **Authentication**: JWT Bearer token headers simulating roles: `Pharmacist`, `Admin`, `Inventory Manager`, `Cashier`

---

## Detailed Tier Breakdown & Test Case Definitions

### Tier 1: Feature Coverage (70 Test Cases)

#### Feature 1: Prescription Schema Extension (T1-01 - T1-05)
- **T1-01: Schema Multi-Tenant Discriminators**
  - *Description*: Verify `Prescription` Mongoose schema requires valid `pharmacy` (ObjectId) and `branch` (ObjectId) tenant identifiers and indexed query parameters.
  - *Precondition*: Database connection active.
  - *Expected Result*: Document creation fails if `pharmacy` or `branch` is missing; index metadata includes `{ pharmacy: 1, branch: 1, createdAt: -1 }`.
- **T1-02: Patient & Doctor Reference Population**
  - *Description*: Validate patient and doctor reference fields populate associated User/Patient/Doctor documents correctly.
  - *Precondition*: Seed patient and doctor records in test DB.
  - *Expected Result*: `populate('patientId doctorId')` returns populated sub-documents with name, phone, license, and clinical notes.
- **T1-03: Clinical Validation Sub-document Schema**
  - *Description*: Verify nested schema structure for clinical validation results (`drugInteractions`, `allergyWarnings`, `dosageWarnings`, `pregnancyWarnings`, `isSafe`).
  - *Precondition*: Save prescription with clinical validation results payload.
  - *Expected Result*: Sub-documents persist all severity levels, warning descriptions, and boolean flags matching schema definitions.
- **T1-04: Batch Line Matching Sub-schema**
  - *Description*: Verify line item array contains batch line matching schema fields (`medicineId`, `requestedQty`, `allocatedBatchId`, `expiryDate`, `unitPrice`).
  - *Precondition*: Insert prescription with matched line items.
  - *Expected Result*: All batch matching metadata persists accurately with proper decimal numeric types.
- **T1-05: Audit History Array & OCR Metrics Fields**
  - *Description*: Validate schema fields `auditHistory` array and `ocrProcessingTimeMs` / `ocrConfidence` metrics.
  - *Precondition*: Create prescription with OCR execution metadata.
  - *Expected Result*: `ocrProcessingTimeMs` stores integer milliseconds; `auditHistory` stores initial document creation entry.

#### Feature 2: Core CRUD & Auto-Suggest APIs (T1-06 - T1-10)
- **T1-06: Create Draft Prescription Record**
  - *Description*: POST `/api/v1/prescriptions` with draft payload creates new prescription document in `pending_review` status.
  - *Precondition*: Valid tenant headers provided.
  - *Expected Result*: HTTP 201 Created; returns document ID and status `pending_review`.
- **T1-07: Paginated Prescription List Retrieval**
  - *Description*: GET `/api/v1/prescriptions?page=1&limit=10` fetches paginated prescriptions matching caller's branch.
  - *Precondition*: 15 prescriptions created for tenant branch.
  - *Expected Result*: HTTP 200 OK; returns `data` array of 10 items and pagination metadata (`total: 15`, `page: 1`, `pages: 2`).
- **T1-08: Filter Prescriptions by Status**
  - *Description*: GET `/api/v1/prescriptions?status=approved` filters records by status value.
  - *Precondition*: Prescriptions exist in `approved`, `rejected`, and `pending_review` states.
  - *Expected Result*: HTTP 200 OK; all returned documents have `status: 'approved'`.
- **T1-09: Patient Auto-Suggest Search API**
  - *Description*: GET `/api/v1/prescriptions/patients/search?q=John` performs partial name/phone matching.
  - *Precondition*: Patient "John Doe" exists in database.
  - *Expected Result*: HTTP 200 OK; returns matching patient record with `_id`, `name`, `phone`, and `allergies`.
- **T1-10: Doctor Auto-Suggest Search API**
  - *Description*: GET `/api/v1/prescriptions/doctors/search?q=DOC123` searches doctors by registration number or name.
  - *Precondition*: Doctor record with registration number `DOC123` seeded.
  - *Expected Result*: HTTP 200 OK; returns doctor profile details including license verification status.

#### Feature 3: Image Upload & Preprocessing Engine (T1-11 - T1-15)
- **T1-11: Multi-Format Image File Upload**
  - *Description*: Upload valid prescription files (PNG, JPG, PDF) via `multipart/form-data`.
  - *Precondition*: Sample valid image files prepared.
  - *Expected Result*: HTTP 201 Created; returns uploaded file URL, mime type, and storage path.
- **T1-12: Image Crop Transformation API**
  - *Description*: POST `/api/v1/prescriptions/:id/ocr` with `imageAdjustments.crop` bounding box coordinates `{ x, y, width, height }`.
  - *Precondition*: Uploaded prescription image exists.
  - *Expected Result*: Server applies crop transformation; processed image buffer matches crop dimensions.
- **T1-13: Image Rotation Transformation API**
  - *Description*: Apply 90° clockwise rotation adjustment to uploaded image.
  - *Precondition*: Uploaded image ID available.
  - *Expected Result*: Image orientation updated; metadata reflects 90° rotation transformation.
- **T1-14: Brightness and Contrast Adjustment**
  - *Description*: Apply brightness (+20) and contrast (+15) adjustment values.
  - *Precondition*: Uploaded image ID available.
  - *Expected Result*: Image processor applies visual enhancements; preview URL reflects adjusted histogram.
- **T1-15: Deskew Algorithm Preview Generation**
  - *Description*: Execute deskew auto-alignment algorithm on skewed scan input.
  - *Precondition*: Skewed prescription scan uploaded.
  - *Expected Result*: Deskew angle computed and preview image returned with deskew correction angle.

#### Feature 4: AI OCR Extraction & Confidence Service (T1-16 - T1-20)
- **T1-16: Execute AI OCR Extraction Endpoint**
  - *Description*: POST `/api/v1/prescriptions/:id/ocr` triggers structured field extraction engine.
  - *Precondition*: Preprocessed prescription image attached to ID.
  - *Expected Result*: HTTP 200 OK; returns `ocrRawText`, overall `ocrConfidence`, and `extractedMedicines`.
- **T1-17: Structured Medicine Extraction Array**
  - *Description*: Verify extracted items array parses medicine name, dosage, frequency, duration, and quantity.
  - *Precondition*: OCR processing complete.
  - *Expected Result*: Extracted array items contain mapped `matchedMedicineId`, `dosage`, `frequency`, `quantity`.
- **T1-18: Per-field Visual Confidence Scores**
  - *Description*: Validate confidence scores (0-100%) calculated per extracted line item and header field.
  - *Precondition*: OCR extraction response received.
  - *Expected Result*: Every item has numeric `confidence` property between `0` and `100`.
- **T1-19: Low-Confidence Field Inline Editing API**
  - *Description*: PATCH `/api/v1/prescriptions/:id/ocr-item` allows manual pharmacist correction of low-confidence fields.
  - *Precondition*: Extracted medicine item has low confidence score (e.g. 45%).
  - *Expected Result*: HTTP 200 OK; item updated with corrected name/dosage and flagged as `manually_edited: true`.
- **T1-20: OCR Processing Time Metric Recording**
  - *Description*: Verify OCR execution duration is recorded in milliseconds in `ocrProcessingTimeMs`.
  - *Precondition*: Trigger OCR extraction.
  - *Expected Result*: `ocrProcessingTimeMs` field populated with positive integer value (>0).

#### Feature 5: Clinical Validation Safety Engine (T1-21 - T1-25)
- **T1-21: Execute 4-Tier Clinical Safety Check**
  - *Description*: POST `/api/v1/prescriptions/:id/validate-clinical` executes full safety scanner.
  - *Precondition*: Prescription contains medicines, patient ID attached.
  - *Expected Result*: HTTP 200 OK; returns safety scan object with interaction, allergy, dosage, and pregnancy results.
- **T1-22: Drug-Drug Interaction Detection**
  - *Description*: Scanner flags severe interactions when co-prescribing contra-indicated medications (e.g. Warfarin + Aspirin).
  - *Precondition*: Prescription items contain Warfarin and Aspirin.
  - *Expected Result*: `drugInteractions` array contains entry with `severity: 'HIGH'`, `drugPair`, and clinical warning text.
- **T1-23: Patient Allergy Cross-Reactivity Detection**
  - *Description*: Scanner flags allergy warning when patient is allergic to Penicillin and Amoxicillin is prescribed.
  - *Precondition*: Patient profile has `allergies: ['Penicillin']`; prescription has Amoxicillin.
  - *Expected Result*: `allergyWarnings` array contains cross-reactivity alert with `patientAllergy: 'Penicillin'`.
- **T1-24: Dosage Bounds Exceeded Validation**
  - *Description*: Scanner flags dosage limit warning when single/daily dose exceeds maximum threshold (e.g., Paracetamol > 4000mg/day).
  - *Precondition*: Prescription dosage specifies Paracetamol 6000mg daily.
  - *Expected Result*: `dosageWarnings` array contains item detailing `extractedDosage` vs `maxDailyDosage`.
- **T1-25: Pregnancy & Lactation Contraindication Warning**
  - *Description*: Scanner flags warning for Category X/D drugs prescribed to pregnant patient.
  - *Precondition*: Patient recorded as pregnant; prescription contains Methotrexate (Category X).
  - *Expected Result*: `pregnancyWarnings` array contains FDA category warning with `fdaCategory: 'X'`.

#### Feature 6: Real-time Branch Inventory & FEFO Matcher (T1-26 - T1-30)
- **T1-26: Branch Inventory Matching Query**
  - *Description*: GET `/api/v1/prescriptions/:id/inventory-match` checks line items against current branch stock.
  - *Precondition*: Prescription items created; branch stock available in DB.
  - *Expected Result*: HTTP 200 OK; returns stock availability status and allocated batch info for each line item.
- **T1-27: Strict FEFO Batch Selection**
  - *Description*: Inventory allocation selects batch with earliest expiration date (`expiryDate: 1`).
  - *Precondition*: Medicine has Batch A (exp 2026-10) and Batch B (exp 2026-06).
  - *Expected Result*: Matching engine selects Batch B as primary allocated batch.
- **T1-28: Sibling Branch Stock Aggregation**
  - *Description*: Query aggregates stock across sibling branches when local branch stock is deficient.
  - *Precondition*: Local branch stock is 5 units; Sibling Branch 2 stock is 50 units; requested quantity is 20 units.
  - *Expected Result*: Response includes `siblingBranchStock` array detailing available inventory at Sibling Branch 2.
- **T1-29: 1-Click Generic Alternative Suggestion**
  - *Description*: Engine generates alternative generic drug suggestions with price comparison delta when primary drug is out of stock.
  - *Precondition*: Brand name drug requested, 0 stock available; generic equivalent in stock.
  - *Expected Result*: `alternativeSuggestions` array lists generic drug ID, name, unit price, and stock count.
- **T1-30: Line Item Availability Status Flag**
  - *Description*: Verify `isAvailable` boolean flag per item is `true` only when local branch stock meets requested quantity.
  - *Precondition*: Item A has sufficient stock; Item B has partial stock.
  - *Expected Result*: Item A returns `isAvailable: true`; Item B returns `isAvailable: false`.

#### Feature 7: Pharmacist Review Workspace API (T1-31 - T1-35)
- **T1-31: Approve Prescription Workflow Action**
  - *Description*: PUT `/api/v1/prescriptions/:id/review` with `action: 'approve'` transitions status to `approved`.
  - *Precondition*: Prescription in `pending_review` state, clinical validation passed or overridden.
  - *Expected Result*: HTTP 200 OK; status changes to `approved`; audit log entry created.
- **T1-32: Reject Prescription Workflow Action**
  - *Description*: PUT `/api/v1/prescriptions/:id/review` with `action: 'reject'` and mandatory `reason`.
  - *Precondition*: Prescription in `pending_review` state.
  - *Expected Result*: HTTP 200 OK; status changes to `rejected`; rejection reason stored in document.
- **T1-33: Edit Prescription Workflow Action**
  - *Description*: PUT `/api/v1/prescriptions/:id/review` with `action: 'edit'` updates line item quantities and notes.
  - *Precondition*: Prescription in `pending_review` state.
  - *Expected Result*: HTTP 200 OK; updated fields saved; audit trail records edited field diffs.
- **T1-34: Request Clarification Workflow Action**
  - *Description*: PUT `/api/v1/prescriptions/:id/review` with `action: 'request_clarification'` transitions status to `clarification_requested`.
  - *Precondition*: Unclear prescription dosage scanned.
  - *Expected Result*: HTTP 200 OK; status changes to `clarification_requested`; clarification notes attached.
- **T1-35: Workflow State Machine Transition Guard**
  - *Description*: Enforce strict state transition rules (e.g. valid actions from `pending_review`).
  - *Precondition*: Prescription is in `approved` state.
  - *Expected Result*: Attempt to reject already approved prescription returns HTTP 400 Bad Request error.

#### Feature 8: Audit Trail & Status Timeline Logging (T1-36 - T1-40)
- **T1-36: Automatic AuditLog Creation on Status Change**
  - *Description*: Status change from `pending_review` to `approved` creates immutable `AuditLog` entry.
  - *Precondition*: Trigger status transition API.
  - *Expected Result*: `AuditLog` collection contains entry linked to `prescriptionId`.
- **T1-37: Audit Entry Performing User & Timestamp**
  - *Description*: Verify audit log entry stores performing `userId`, IP address, timestamp, and action code.
  - *Precondition*: Execute review action while authenticated as Pharmacist user.
  - *Expected Result*: Audit entry contains exact `userId`, current UTC timestamp, and `action: 'PRESCRIPTION_APPROVED'`.
- **T1-38: Field Diff Change Tracking**
  - *Description*: Verify edited prescription fields store precise `oldValue` and `newValue` diff payloads.
  - *Precondition*: Edit prescription line item quantity from 10 to 20.
  - *Expected Result*: Audit log diff details `{ field: 'items[0].quantity', oldValue: 10, newValue: 20 }`.
- **T1-39: Fetch Prescription Audit Timeline Endpoint**
  - *Description*: GET `/api/v1/prescriptions/:id/audit-trail` returns chronological list of audit logs.
  - *Precondition*: Multiple actions (create, edit, approve) performed on prescription.
  - *Expected Result*: HTTP 200 OK; returns sorted timeline array ordered by `timestamp: 1`.
- **T1-40: Enforce Audit Log Immutability**
  - *Description*: Direct modification or deletion attempts on `AuditLog` collection are blocked.
  - *Precondition*: Existing audit log record ID available.
  - *Expected Result*: PUT / DELETE requests on audit log endpoints return HTTP 403 Forbidden.

#### Feature 9: POS Billing Sync Engine (T1-41 - T1-45)
- **T1-41: POS Billing Sync Endpoint Execution**
  - *Description*: POST `/api/v1/prescriptions/:id/sync-pos` generates draft invoice payload.
  - *Precondition*: Prescription status is `approved`.
  - *Expected Result*: HTTP 200 OK; returns `saleId`, `invoiceNumber`, and total bill amount.
- **T1-42: Immediate FEFO Stock Deduction**
  - *Description*: POS sync executes immediate stock reduction on allocated batch inventory records.
  - *Precondition*: Batch stock is 100 units; prescription requests 20 units.
  - *Expected Result*: Batch stock count updated to 80 units immediately after POS sync.
- **T1-43: POS Sale ID Cross-Reference Persistence**
  - *Description*: Link generated `saleId` and `invoiceNumber` to prescription document.
  - *Precondition*: POS sync succeeds.
  - *Expected Result*: Prescription document `posSaleRef` field contains created Sale ObjectId.
- **T1-44: Transactional Rollback on Stock Failure**
  - *Description*: Verify full transaction rollback if inventory deduction fails during POS sync.
  - *Precondition*: Batch stock deleted or locked concurrently before deduction.
  - *Expected Result*: POS sale generation fails; prescription status remains `approved` without orphan invoice.
- **T1-45: Invoice Subtotal & Tax Recalculation**
  - *Description*: Verify POS invoice payload correctly calculates line item subtotals, applicable sales tax, and grand total.
  - *Precondition*: Prescription items with unit prices $10.00 (qty 2) and $15.00 (qty 1), tax rate 10%.
  - *Expected Result*: Subtotal = $35.00, Tax = $3.50, Grand Total = $38.50.

#### Feature 10: OCR & Prescription Analytics API (T1-46 - T1-50)
- **T1-46: Overall OCR Accuracy Rate Metric**
  - *Description*: GET `/api/v1/prescriptions/analytics` returns aggregated `ocrAccuracyPct`.
  - *Precondition*: Prescriptions processed with known OCR confidence scores.
  - *Expected Result*: HTTP 200 OK; `ocrAccuracyPct` equals mathematical average of OCR confidence scores.
- **T1-47: Stage Processing Time Aggregation**
  - *Description*: Analytics aggregation calculates average processing duration (`avgProcessingTimeMs`).
  - *Precondition*: Prescriptions with recorded `ocrProcessingTimeMs`.
  - *Expected Result*: Response includes `avgProcessingTimeMs` metric.
- **T1-48: Approval Status Ratio Metrics**
  - *Description*: Response provides breakdown counts for `approved`, `rejected`, `edited`, and `pending` prescriptions.
  - *Precondition*: 10 approved, 3 rejected, 2 pending prescriptions in DB.
  - *Expected Result*: `approvalBreakdown` returns `{ approved: 10, rejected: 3, edited: 0, pending: 2 }`.
- **T1-49: Top Prescribed Drugs Aggregation**
  - *Description*: Analytics aggregation identifies top 5 prescribed medicines ranked by prescription frequency count.
  - *Precondition*: Multiple prescriptions referencing various medicines.
  - *Expected Result*: `topPrescribedMedicines` returns array of `{ name, count }` sorted descending by count.
- **T1-50: Multi-Tenant Scoped Analytics Isolation**
  - *Description*: Analytics endpoint strictly isolates metrics to the caller's tenant branch.
  - *Precondition*: Prescriptions exist across Branch A and Branch B.
  - *Expected Result*: Caller from Branch A receives analytics computed strictly from Branch A records.

#### Feature 11: Modular React UI Component Suite (T1-51 - T1-55)
- **T1-51: Render PrescriptionHeader Component**
  - *Description*: Mount `PrescriptionHeader.jsx` with prescription ID, status badge, and review action buttons.
  - *Precondition*: Valid prescription props passed.
  - *Expected Result*: Component renders status badge with correct status color (e.g. green for `approved`).
- **T1-52: Render PrescriptionUpload Component**
  - *Description*: Mount `PrescriptionUpload.jsx` drag-and-drop file upload zone.
  - *Precondition*: Component mounted in UI test harness.
  - *Expected Result*: Renders drag area, browse file button, and supported file extension helper text.
- **T1-53: Render ImagePreprocessor Component**
  - *Description*: Mount `ImagePreprocessor.jsx` with crop, rotate, brightness, and contrast adjustment controls.
  - *Precondition*: Image file loaded into state.
  - *Expected Result*: Adjustment sliders and deskew preview trigger preview state updates on user input.
- **T1-54: Render OcrExtractionView Component**
  - *Description*: Mount `OcrExtractionView.jsx` displaying extracted text, field confidence badges, and inline editing.
  - *Precondition*: OCR extraction payload provided in props.
  - *Expected Result*: Renders item table; confidence scores <70% highlight yellow/red; edit inputs enable field mutation.
- **T1-55: Render ClinicalValidationAlerts Component**
  - *Description*: Mount `ClinicalValidationAlerts.jsx` with drug interaction, allergy, and dosage warning cards.
  - *Precondition*: Clinical validation warnings present in props.
  - *Expected Result*: Severity banners render with appropriate iconography and override button handlers.

#### Feature 12: Master Page & Routing (T1-56 - T1-60)
- **T1-56: Render Master Prescriptions Page**
  - *Description*: Render `frontend/src/pages/Prescriptions.jsx` master view.
  - *Precondition*: App router rendered at path `/prescriptions`.
  - *Expected Result*: Master layout mounts Header, Upload, Search, and Workspace subcomponents.
- **T1-57: React Router Path Matching**
  - *Description*: Router navigates to `/prescriptions` route defined in `App.jsx`.
  - *Precondition*: User clicks Prescriptions sidebar navigation link.
  - *Expected Result*: Page component loads without console errors or blank screen.
- **T1-58: PrescriptionManagement.jsx Re-export Verification**
  - *Description*: Verify `PrescriptionManagement.jsx` correctly re-exports `Prescriptions.jsx` for backward compatibility.
  - *Precondition*: Import `PrescriptionManagement` in test runner.
  - *Expected Result*: Exported component is identical to `Prescriptions.jsx`.
- **T1-59: Tab Navigation State Persistence**
  - *Description*: Switching between "Active Queue", "Analytics", and "Audit Logs" tabs updates URL search params.
  - *Precondition*: User toggles page tabs.
  - *Expected Result*: URL updates to `/prescriptions?tab=analytics`; correct tab view displays.
- **T1-60: Data Loading Skeletons & Empty States**
  - *Description*: Page renders loading skeletons while fetching prescriptions and empty state when 0 records exist.
  - *Precondition*: Mock API call with simulated 500ms latency.
  - *Expected Result*: Loading skeleton visible during fetch; empty state component renders when array is empty.

#### Feature 13: Responsive Medical UI Theme (T1-61 - T1-65)
- **T1-61: Light Mode Theme Palette Verification**
  - *Description*: Inspect rendered CSS computed styles in Light Mode.
  - *Precondition*: Light theme active (`html.light`).
  - *Expected Result*: Primary color matches `#2563EB`, background matches `#F8FAFC`, surface cards `#FFFFFF`.
- **T1-62: Dark Mode Theme Palette Verification**
  - *Description*: Inspect rendered CSS computed styles in Dark Mode.
  - *Precondition*: Dark theme active (`html.dark`).
  - *Expected Result*: Dark background matches `#0F172A`, text color contrasts at > 4.5:1 ratio against dark background.
- **T1-63: Glassmorphism Design Tokens**
  - *Description*: Verify glassmorphism style classes (`backdrop-blur-md`, border highlights) applied on workspace cards.
  - *Precondition*: Workspace cards rendered.
  - *Expected Result*: Card elements contain glass backdrop filter styles and subtle dark/light border classes.
- **T1-64: Responsive Grid Breakpoint Layout**
  - *Description*: Verify grid layout adapts across mobile (320px), tablet (768px), and desktop (1280px).
  - *Precondition*: Viewport resized in UI test harness.
  - *Expected Result*: Mobile displays single-column view; desktop displays side-by-side workspace split view.
- **T1-65: Accessible Focus States & WCAG Compliance**
  - *Description*: Test interactive elements (buttons, inputs, selects) exhibit visible focus rings on tab focus.
  - *Precondition*: Tab keyboard navigation triggered.
  - *Expected Result*: Active element displays high-contrast focus outline (`ring-2 ring-blue-500`).

#### Feature 14: E2E Test Suite & Final Integration (T1-66 - T1-70)
- **T1-66: Native Node.js Test Suite Runner Execution**
  - *Description*: Execute entire backend test suite using `node --test tests/**/*.test.js`.
  - *Precondition*: All test files in place.
  - *Expected Result*: All tests execute sequentially with 0 process failures or uncaught errors.
- **T1-67: Full End-to-End API Integration Sequence**
  - *Description*: Run full pipeline: Upload -> OCR -> Validate -> Match FEFO -> Approve -> Sync POS.
  - *Precondition*: Test environment initialized.
  - *Expected Result*: Prescription passes through all states; draft POS invoice generated successfully.
- **T1-68: Dual-Tenant Isolation Sanity Test**
  - *Description*: Execute E2E sequence across two isolated tenants in parallel.
  - *Precondition*: Tenant A and Tenant B initialized.
  - *Expected Result*: Zero cross-tenant data leakage between tenant DB queries.
- **T1-69: Zero Memory Leak / Resource Cleanup Check**
  - *Description*: Verify test execution cleans up file buffers, image temp files, and DB handles post-execution.
  - *Precondition*: Full test suite run finished.
  - *Expected Result*: Process memory returns to baseline (<100MB heap); no open file handles remaining.
- **T1-70: Definition of Done Compliance Verification**
  - *Description*: Verify codebase meets all DoD criteria (compiles, 0 lint errors, full validation, security rules enforced).
  - *Precondition*: Project audit run.
  - *Expected Result*: All 10 DoD checkpoints in `AGENTS.md` verified green.

---

### Tier 2: Boundary & Corner Cases (70 Test Cases)

#### Feature 1: Prescription Schema Extension (T2-01 - T2-05)
- **T2-01: Missing Tenant Discriminators Rejection**
  - *Description*: Attempt creating prescription without `pharmacy` or `branch` tenant fields.
  - *Precondition*: Payload missing `pharmacyId`.
  - *Expected Result*: Mongoose SchemaValidationError; save operation aborted.
- **T2-02: Malformed ObjectId Reference Validation**
  - *Description*: Submit invalid string (e.g. `'invalid-id-123'`) for `patientId` or `doctorId`.
  - *Precondition*: API POST payload with invalid ID string.
  - *Expected Result*: HTTP 400 Bad Request / CastError; validation error message returned.
- **T2-03: Negative / Zero Line Item Quantity Boundary**
  - *Description*: Submit line item with `requestedQty: 0` or `requestedQty: -5`.
  - *Precondition*: POST draft prescription payload.
  - *Expected Result*: HTTP 422 Validation Error; schema enforces `min: 1`.
- **T2-04: Duplicate Medicine Entry Array Prevention**
  - *Description*: Submit prescription payload containing two identical `medicineId` references.
  - *Precondition*: Payload has duplicate medicine items.
  - *Expected Result*: Validation warning triggered; items merged or rejected with duplicate item error.
- **T2-05: Maximum Audit History Array Overflow Handling**
  - *Description*: Simulate prescription subjected to 500+ edit actions to test array size boundary.
  - *Precondition*: Perform rapid repeated edits.
  - *Expected Result*: Schema manages audit history array efficiently without MongoDB 16MB document size breach.

#### Feature 2: Core CRUD & Auto-Suggest APIs (T2-06 - T2-10)
- **T2-06: Empty Query String Auto-Suggest Handling**
  - *Description*: GET `/api/v1/prescriptions/patients/search?q=` with empty string.
  - *Precondition*: API invocation.
  - *Expected Result*: HTTP 200 OK; returns empty array `[]` without performing full database scan.
- **T2-07: Special Character & Regex Injection Prevention**
  - *Description*: Submit search query `q=John.*$` or SQL/NoSQL injection string `q[$ne]=null`.
  - *Precondition*: API call with sanitized search parameters.
  - *Expected Result*: Query input strictly escaped; returns only literal string matches or empty result.
- **T2-08: Pagination Limit Boundary Ceiling**
  - *Description*: GET `/api/v1/prescriptions?limit=1000` requesting excessive page size.
  - *Precondition*: API request.
  - *Expected Result*: Server caps maximum page size to `100`; returns 100 items with valid pagination metadata.
- **T2-09: Non-existent Prescription ID Query**
  - *Description*: GET `/api/v1/prescriptions/650000000000000000009999` with valid format but non-existent ID.
  - *Precondition*: Database query execution.
  - *Expected Result*: HTTP 404 Not Found; error message `Prescription not found`.
- **T2-10: Cross-Branch Data Leak Attempt**
  - *Description*: Authenticated Branch A user attempts accessing prescription belonging to Branch B.
  - *Precondition*: Prescription exists in Branch B.
  - *Expected Result*: HTTP 404 Not Found / 403 Forbidden; tenant middleware blocks cross-branch exposure.

#### Feature 3: Image Upload & Preprocessing Engine (T2-11 - T2-15)
- **T2-11: Upload File Size Ceiling Enforcement**
  - *Description*: Attempt uploading 20MB image file exceeding 15MB upload limit.
  - *Precondition*: 20MB dummy file prepared.
  - *Expected Result*: HTTP 413 Payload Too Large / 422 Error; upload rejected before buffer processing.
- **T2-12: Unsupported File MIME Type Rejection**
  - *Description*: Attempt uploading executable `.exe` or text `.txt` file disguised as prescription image.
  - *Precondition*: File upload payload with invalid MIME type.
  - *Expected Result*: HTTP 415 Unsupported Media Type / 422 Error; file upload rejected.
- **T2-13: Corrupted / Truncated Image Buffer Handling**
  - *Description*: Upload corrupted PNG file with broken header bytes.
  - *Precondition*: Corrupted file payload.
  - *Expected Result*: HTTP 400 Bad Request; image processor returns readable processing error without process crash.
- **T2-14: Extreme Rotation Angles Input Boundary**
  - *Description*: Submit non-standard rotation angle parameters (`rotate: 45` or `rotate: 720`).
  - *Precondition*: Adjustment payload.
  - *Expected Result*: Server normalizes angle to nearest valid right angle (0°, 90°, 180°, 270°) or returns validation error.
- **T2-15: Zero-Byte Empty File Upload Boundary**
  - *Description*: Submit 0-byte file payload during image upload.
  - *Precondition*: 0-byte file attached.
  - *Expected Result*: HTTP 400 Bad Request; message `Uploaded file is empty`.

#### Feature 4: AI OCR Extraction & Confidence Service (T2-16 - T2-20)
- **T2-16: Low-Confidence Blurry Image Handling**
  - *Description*: Process severely blurred scan resulting in average confidence <30%.
  - *Precondition*: Blurred image uploaded.
  - *Expected Result*: HTTP 200 OK; returns `ocrConfidence: 22%`, sets `requiresManualReview: true` flag.
- **T2-17: Completely Blank / White Image Upload**
  - *Description*: Trigger OCR extraction on completely white/blank image scan.
  - *Precondition*: Blank image uploaded.
  - *Expected Result*: HTTP 200 OK; `extractedMedicines` array is empty `[]`; warning `No text detected` returned.
- **T2-18: Multi-Page PDF Document OCR Extraction**
  - *Description*: Trigger OCR extraction on 3-page PDF prescription scan.
  - *Precondition*: 3-page PDF uploaded.
  - *Expected Result*: Engine processes all pages sequentially and aggregates extracted items into single response.
- **T2-19: Inline Edit Validation Boundary**
  - *Description*: Pharmacist submits inline edit clearing medicine name to empty string.
  - *Precondition*: Edit request on extracted item.
  - *Expected Result*: HTTP 422 Validation Error; medicine name cannot be empty.
- **T2-20: Downstream AI Service Timeout Handling**
  - *Description*: Simulate downstream AI OCR engine timeout (delay > 10,000ms).
  - *Precondition*: Mock OCR service delay.
  - *Expected Result*: Server fallback handles timeout gracefully; returns HTTP 504 Gateway Timeout or partial extraction mode.

#### Feature 5: Clinical Validation Safety Engine (T2-21 - T2-25)
- **T2-21: Multi-Drug Complex Interaction Cascade**
  - *Description*: Validate prescription containing 5+ co-prescribed medications with multiple intersecting drug interactions.
  - *Precondition*: 5 interacting drugs added to prescription.
  - *Expected Result*: Scanner identifies all pair-wise interactions without missing secondary warnings.
- **T2-22: Combination Medication Allergy Sub-Ingredient Detection**
  - *Description*: Patient allergic to "Clavulanic Acid"; prescription contains "Augmentin" (Amoxicillin + Clavulanate).
  - *Precondition*: Patient allergy set to Clavulanic Acid.
  - *Expected Result*: Scanner decomposes combination drug active ingredients and triggers allergy warning.
- **T2-23: Pediatric / Age-Specific Dosage Limit Bounds**
  - *Description*: Validate adult dosage prescribed to 3-year-old pediatric patient profile.
  - *Precondition*: Patient age is 3 years; adult dosage (1000mg) prescribed.
  - *Expected Result*: Scanner flags pediatric dosage limit warning based on patient age context.
- **T2-24: Missing Patient Allergy History Profile Context**
  - *Description*: Execute clinical validation for new patient with unrecorded allergy profile (`allergies: null`).
  - *Precondition*: Patient profile has null allergy array.
  - *Expected Result*: Validation completes safely; returns warning `Patient allergy history unrecorded`.
- **T2-25: Unrated / Unknown FDA Pregnancy Category Drug**
  - *Description*: Validate drug with no assigned FDA pregnancy rating in drug database.
  - *Precondition*: Newly added drug with `fdaCategory: 'N/A'`.
  - *Expected Result*: Scanner returns `pregnancyWarnings` item with `fdaCategory: 'UNKNOWN'` and precautionary advisory.

#### Feature 6: Real-time Branch Inventory & FEFO Matcher (T2-26 - T2-30)
- **T2-26: Zero Branch & Chain-wide Stock Availability**
  - *Description*: Perform inventory lookup for medicine with 0 stock across all chain branches.
  - *Precondition*: DB inventory records for medicine equal 0.
  - *Expected Result*: `isAvailable: false`, `currentBranchStock: 0`, `siblingBranchStock: []`, generic alternatives triggered.
- **T2-27: Identical Expiration Date FEFO Tie-Breaking**
  - *Description*: Two batches exist with identical `expiryDate` values.
  - *Precondition*: Batch 1 (created Jan 1), Batch 2 (created Jan 5) have exp 2026-12-31.
  - *Expected Result*: FEFO engine breaks tie using FIFO (`createdAt: 1`), selecting Batch 1 first.
- **T2-28: Partial Stock Allocation Boundary**
  - *Description*: Prescription requests 100 units; local branch has 40 units available.
  - *Precondition*: Branch stock = 40.
  - *Expected Result*: `isAvailable: false`; allocates 40 units from local batch and flags 60 units deficit.
- **T2-29: Generic Substitution Search Fallback**
  - *Description*: Primary brand drug out of stock; search for generic alternative yields 0 direct generic matches.
  - *Precondition*: Generic category search returns empty.
  - *Expected Result*: Engine falls back to therapeutic class substitution suggestions with notice badge.
- **T2-30: Exclusion of Expired Inventory Batches**
  - *Description*: Branch has Batch A (expired 5 days ago, stock 50) and Batch B (expires next month, stock 10).
  - *Precondition*: Expired batch present in DB.
  - *Expected Result*: Engine strictly filters out expired batch (`expiryDate > current_date`); allocates only from Batch B.

#### Feature 7: Pharmacist Review Workspace API (T2-31 - T2-35)
- **T2-31: Unoverridden Severe Clinical Warning Approval Block**
  - *Description*: Pharmacist attempts approving prescription with HIGH severity clinical alert without checking override box.
  - *Precondition*: Prescription has HIGH severity drug interaction.
  - *Expected Result*: HTTP 400 Bad Request; message `Severe clinical warnings require explicit override rationale`.
- **T2-32: Approval Attempt with Zero Line Items**
  - *Description*: Attempt approving prescription where all line items have been deleted.
  - *Precondition*: `items` array is empty `[]`.
  - *Expected Result*: HTTP 422 Validation Error; `Prescription must contain at least one valid line item`.
- **T2-33: Concurrent Review Action Conflict (Optimistic Locking)**
  - *Description*: Pharmacist A and Pharmacist B submit review actions simultaneously on same prescription document version.
  - *Precondition*: Two concurrent PUT requests sent with same `__v` version key.
  - *Expected Result*: First request succeeds; second request returns HTTP 409 Conflict error.
- **T2-34: Invalid State Machine Reversion Rejection**
  - *Description*: Attempt invoking `action: 'approve'` on an already `rejected` prescription.
  - *Precondition*: Status is `rejected`.
  - *Expected Result*: HTTP 400 Bad Request; illegal state transition error message.
- **T2-35: Empty Clarification Rationale Rejection**
  - *Description*: Submit `action: 'request_clarification'` with empty clarification notes string.
  - *Precondition*: Action payload has `reason: ''`.
  - *Expected Result*: HTTP 422 Validation Error; clarification reason is mandatory.

#### Feature 8: Audit Trail & Status Timeline Logging (T2-36 - T2-40)
- **T2-36: Nested Sub-Document Diff Representation**
  - *Description*: Edit nested dosage object within prescription item array and verify audit diff representation.
  - *Precondition*: Update `dosage.frequency` from "QD" to "BID".
  - *Expected Result*: Audit diff clearly isolates nested path `items[0].dosage.frequency`.
- **T2-37: Automated System Action Audit Logging**
  - *Description*: Trigger background system job action (e.g. OCR auto-timeout expiration) with no active user session.
  - *Precondition*: System background job execution.
  - *Expected Result*: Audit entry logs `userId: 'SYSTEM_BOT'` and records automated action.
- **T2-38: Mid-Transaction Failure Audit Rollback**
  - *Description*: Simulate DB write error during prescription update transaction.
  - *Precondition*: Intentionally trigger DB write exception during review update.
  - *Expected Result*: Transaction rolls back completely; no orphan audit log entry remains in DB.
- **T2-39: Large-Scale Audit Timeline Pagination Boundary**
  - *Description*: Query audit timeline for prescription with 100+ historical changes.
  - *Precondition*: 100 audit records created.
  - *Expected Result*: GET `/api/v1/prescriptions/:id/audit-trail` returns paginated audit events without latency.
- **T2-40: Direct Audit Entry Modification Rejection**
  - *Description*: Send PATCH `/api/v1/audit-logs/:id` payload attempting to modify past audit record text.
  - *Precondition*: Valid audit log ID.
  - *Expected Result*: HTTP 405 Method Not Allowed / 403 Forbidden; audit records remain immutable.

#### Feature 9: POS Billing Sync Engine (T2-41 - T2-45)
- **T2-41: POS Sync Attempt on Non-Approved Prescription**
  - *Description*: Attempt triggering POST `/api/v1/prescriptions/:id/sync-pos` on prescription in `pending_review` status.
  - *Precondition*: Prescription status is `pending_review`.
  - *Expected Result*: HTTP 400 Bad Request; message `Only approved prescriptions can be synced to POS billing`.
- **T2-42: POS Service Unavailability Circuit Breaker**
  - *Description*: Execute POS sync while POS billing service module is unreachable.
  - *Precondition*: POS module endpoint disabled.
  - *Expected Result*: HTTP 503 Service Unavailable; prescription state preserved; clear retry recommendation returned.
- **T2-43: Zero-Total Fully Discounted Prescription POS Sync**
  - *Description*: Execute POS sync for 100% insurance-covered prescription with $0.00 patient copay total.
  - *Precondition*: Prescription grand total = $0.00.
  - *Expected Result*: HTTP 200 OK; draft invoice generated with $0.00 balance; stock successfully deducted.
- **T2-44: Duplicate POS Sync Request Prevention**
  - *Description*: Trigger POS sync twice in rapid succession for same prescription ID.
  - *Precondition*: First POS sync request active/completed.
  - *Expected Result*: Second call returns existing POS sale reference without creating duplicate draft invoice.
- **T2-45: Stock Deduction Idempotency Guarantee**
  - *Description*: Verify retrying POS sync after network retry does not deduct inventory twice.
  - *Precondition*: POS sync executed twice with same idempotency token.
  - *Expected Result*: Batch stock count deducted exactly once.

#### Feature 10: OCR & Prescription Analytics API (T2-46 - T2-50)
- **T2-46: Empty Dataset Analytics Safe Default Fallback**
  - *Description*: Query analytics endpoint when zero prescriptions exist in the tenant database.
  - *Precondition*: Empty prescription collection.
  - *Expected Result*: HTTP 200 OK; returns `{ ocrAccuracyPct: 0, avgProcessingTimeMs: 0, totalProcessed: 0, approvalBreakdown: { approved: 0, rejected: 0, edited: 0, pending: 0 }, topPrescribedMedicines: [] }`.
- **T2-47: Invalid Date Range Filter Validation**
  - *Description*: Query analytics with `startDate=2026-12-31&endDate=2026-01-01` (start > end).
  - *Precondition*: Inverted date query parameters.
  - *Expected Result*: HTTP 400 Bad Request; error `startDate must be prior to or equal to endDate`.
- **T2-48: Equal Count Rank Order Stability in Top Medicines**
  - *Description*: Query top prescribed medicines when 3 medicines have equal prescription counts.
  - *Precondition*: Medicine A (5), Medicine B (5), Medicine C (5).
  - *Expected Result*: Aggregation returns deterministic alphabetical tie-breaking order.
- **T2-49: Unauthorized Cross-Branch Analytics Query Block**
  - *Description*: Branch manager from Branch 1 requests analytics with explicit parameter `branchId=branch2`.
  - *Precondition*: User lacks cross-branch manager role.
  - *Expected Result*: Request restricted to caller's assigned branch ID (`Branch 1`) by tenant middleware.
- **T2-50: Outlier Filtering in Average Processing Time Metric**
  - *Description*: Compute `avgProcessingTimeMs` when one anomalous record has processing time of 5,000,000ms.
  - *Precondition*: 10 normal records (~500ms), 1 outlier record.
  - *Expected Result*: Aggregation pipeline excludes non-standard outliers or computes median metric accurately.

#### Feature 11: Modular React UI Component Suite (T2-51 - T2-55)
- **T2-51: High-Volume Line Item Table Rendering (50+ Items)**
  - *Description*: Mount `OcrExtractionView.jsx` with 50 extracted line items.
  - *Precondition*: Props contain 50 items.
  - *Expected Result*: Table renders smoothly without DOM freezing or broken UI pagination.
- **T2-52: Missing Warning Description Component Resilience**
  - *Description*: Mount `ClinicalValidationAlerts.jsx` with alert object containing undefined warning text.
  - *Precondition*: Props have alert missing description string.
  - *Expected Result*: Component renders fallback text `"Clinical warning detail unavailable"` without crashing UI.
- **T2-53: PosSyncModal Keyboard Focus Trapping & Escape Dismissal**
  - *Description*: Open `PosSyncModal.jsx` and test keyboard focus cycling and `Escape` key press.
  - *Precondition*: Modal dialog open.
  - *Expected Result*: Focus trapped within modal elements; pressing `Escape` triggers close handler.
- **T2-54: Delayed API Network Response Skeleton State**
  - *Description*: Mount `BranchInventoryLookup.jsx` with pending asynchronous fetch promise.
  - *Precondition*: Inventory lookup loading prop is `true`.
  - *Expected Result*: Renders animated loading skeleton rows matching inventory table dimensions.
- **T2-55: Invalid File Object Drag-and-Drop Drop Handler**
  - *Description*: User drops non-file text snippet onto `PrescriptionUpload.jsx` drop target.
  - *Precondition*: Drag-and-drop event with plain text payload.
  - *Expected Result*: Drop zone rejects non-file object gracefully with visual error feedback.

#### Feature 12: Master Page & Routing (T2-56 - T2-60)
- **T2-56: Unauthenticated Route Access Protection**
  - *Description*: Navigate browser directly to `/prescriptions` without JWT auth cookie/header.
  - *Precondition*: No auth token stored.
  - *Expected Result*: React Router redirects user immediately to `/login` with `returnUrl=/prescriptions`.
- **T2-57: Insufficient Role Permission Guard (403 State)**
  - *Description*: User logged in with `Cashier` role navigates to `/prescriptions` review workspace.
  - *Precondition*: Role lacks pharmacist review permission.
  - *Expected Result*: Page displays `403 Unauthorized Access` banner; review actions disabled.
- **T2-58: Page Refresh Context Preservation (F5 Keypress)**
  - *Description*: Refresh browser page while viewing prescription ID `PRES-1002` detail modal.
  - *Precondition*: Browser URL `/prescriptions?id=PRES-1002`.
  - *Expected Result*: Page re-hydrates state and re-opens `PRES-1002` detail workspace accurately.
- **T2-59: Browser Back / Forward History Navigation**
  - *Description*: User navigates: List View -> Prescriptions Detail -> Analytics Tab, then clicks Browser Back twice.
  - *Precondition*: Navigation history populated.
  - *Expected Result*: Router pops history state cleanly back to initial List View without state mismatch.
- **T2-60: Global React Error Boundary Fallback**
  - *Description*: Throw intentional runtime render exception inside child workspace component.
  - *Precondition*: Child component throws error.
  - *Expected Result*: Parent ErrorBoundary catches exception; displays user-friendly recovery UI with "Reload Module" button.

#### Feature 13: Responsive Medical UI Theme (T2-61 - T2-65)
- **T2-61: Rapid Light / Dark Theme Toggling Resilience**
  - *Description*: Toggle theme mode back and forth 10 times in 1 second.
  - *Precondition*: Theme switcher button active.
  - *Expected Result*: Theme state settles cleanly; no duplicate style tags or theme class mismatches.
- **T2-62: Mobile Viewport 320px Overflow Prevention**
  - *Description*: Render workspace layout at 320px x 568px screen resolution.
  - *Precondition*: Mobile screen emulator active.
  - *Expected Result*: Zero horizontal body scrollbar; table elements scroll horizontally within self-contained container.
- **T2-63: Retina 4K Display Resolution Scaling**
  - *Description*: Render UI on 4K display resolution (3840px x 2160px) at 200% scaling.
  - *Precondition*: High-DPI viewport active.
  - *Expected Result*: Typography, icons, and status badges render crisp without visual pixelation or alignment gaps.
- **T2-64: High-Contrast Accessibility Mode Verification**
  - *Description*: Enable OS high-contrast display mode and inspect alert status cards.
  - *Precondition*: High-contrast media query active.
  - *Expected Result*: Banners display high-contrast border outlines matching accessibility guidelines.
- **T2-65: Print Media Stylesheet Layout Output**
  - *Description*: Trigger window print preview (`@media print`) on prescription review detail view.
  - *Precondition*: Print mode invoked.
  - *Expected Result*: Navigation header, sidebars, and action buttons hidden; prescription summary formatted for paper printout.

#### Feature 14: E2E Test Suite & Final Integration (T2-66 - T2-70)
- **T2-66: Unexpected Database Disconnection Recovery**
  - *Description*: Simulate database connection drop mid-way through test execution.
  - *Precondition*: Database handle forcibly closed.
  - *Expected Result*: Test harness captures disconnection error; connection retry logic triggers re-connect or clean test failure log.
- **T2-67: Heap Memory Limit Stability Verification**
  - *Description*: Run full 162-test suite continuously 3 times in single process.
  - *Precondition*: Continuous execution loop.
  - *Expected Result*: Process heap usage remains bounded (<150MB growth); garbage collection reclaims unused memory.
- **T2-68: Sensitive Secret Leak Prevention in Logs**
  - *Description*: Scan stdout and stderr output during test suite execution for JWT secret or DB password strings.
  - *Precondition*: Logging enabled during test run.
  - *Expected Result*: Zero secret strings present in raw console output.
- **T2-69: Missing Optional Environment Variable Defaults**
  - *Description*: Run backend test suite with optional env vars (e.g. `OCR_TIMEOUT_MS`) unset.
  - *Precondition*: Optional env vars removed from environment.
  - *Expected Result*: Backend boots using safe fallback defaults without crash.
- **T2-70: Test Suite Wiped Database Cleanup Verification**
  - *Description*: Inspect test database after full test suite teardown finishes.
  - *Precondition*: Test suite execution completed.
  - *Expected Result*: Test databases completely dropped or reset to clean initial state.

---

### Tier 3: Cross-Feature Interactions (15 Test Cases)

- **T3-01: Upload (F3) → OCR (F4) → Auto-Suggest Patient/Doctor Search (F2) Data Flow Pipeline**
  - *Description*: Upload prescription image (F3), trigger OCR extraction (F4) to parse patient name "Jane Doe" and doctor registration "DOC-555", then automatically query Auto-Suggest APIs (F2) to link existing database records.
  - *Precondition*: Image uploaded, matching patient and doctor exist in DB.
  - *Expected Result*: System populates prescription draft with matched patient `patientId` and doctor `doctorId`.
- **T3-02: AI OCR Extracted Medicines (F4) → Clinical Safety Validation (F5) Auto-Scan Integration**
  - *Description*: Parsed OCR medicine array (F4) is automatically piped into 4-tier Clinical Validation Scanner (F5) upon extraction completion.
  - *Precondition*: OCR extracts "Amoxicillin 500mg".
  - *Expected Result*: Clinical validation scanner executes automatically and returns allergy/interaction scan results attached to draft.
- **T3-03: Clinical Validation Severe Alerts (F5) → Pharmacist Review Workspace (F7) Approval Blockage**
  - *Description*: Pharmacist attempts approving prescription in Review Workspace (F7); system checks Clinical Validation Alerts (F5) and blocks approval due to unresolved HIGH severity drug interaction.
  - *Precondition*: Unresolved severe alert attached to prescription.
  - *Expected Result*: Workspace UI presents alert banner; approval action blocked until override rationale is provided.
- **T3-04: FEFO Batch Matcher (F6) → POS Billing Sync Engine (F9) Inventory Deduction Sequence**
  - *Description*: FEFO Matcher (F6) allocates specific batch IDs (`expiryDate: 1`); upon pharmacist approval, POS Sync Engine (F9) deducts inventory strictly from those allocated batch IDs.
  - *Precondition*: Batch B allocated as earliest expiry batch.
  - *Expected Result*: Stock deducted from Batch B in database; POS sale record reflects Batch B assignment.
- **T3-05: Pharmacist Review Approval (F7) → Audit Trail Logging (F8) → Status Timeline UI Update**
  - *Description*: Pharmacist clicks Approve in Workspace (F7); API updates status, generates immutable AuditLog entry (F8), and front-end Audit Timeline subcomponent immediately appends new timeline node.
  - *Precondition*: Prescription in `pending_review`.
  - *Expected Result*: Status becomes `approved`; AuditLog record persisted; timeline UI displays approval event with timestamp and pharmacist name.
- **T3-06: Pharmacist Edit Action (F7) → Schema Extension Fields (F1) → Audit Trail Diff Recording (F8)**
  - *Description*: Pharmacist edits dosage quantity from 10 to 15 in Workspace (F7); Schema (F1) updates item array and Audit Logger (F8) captures precise `oldValue: 10` and `newValue: 15` diff payload.
  - *Precondition*: Prescription detail loaded in edit mode.
  - *Expected Result*: Item quantity updated in DB; audit entry records exact numeric diff.
- **T3-07: Out-of-Stock FEFO Matcher (F6) → Generic Alternative Selection → Review Workspace Item Replacement (F7)**
  - *Description*: FEFO Lookup (F6) flags primary drug out of stock; pharmacist selects 1-click Generic Alternative suggestion, which updates line item in Review Workspace (F7).
  - *Precondition*: Primary drug stock = 0; generic drug stock = 100.
  - *Expected Result*: Line item replaced with generic medicine ID; inventory availability indicator turns green.
- **T3-08: POS Billing Sync Execution (F9) → OCR & Prescription Analytics Pipeline Update (F10)**
  - *Description*: Successful POS sync completion (F9) triggers real-time analytics aggregation update (F10), incrementing approved count and total revenue metrics.
  - *Precondition*: Initial analytics state recorded.
  - *Expected Result*: Analytics endpoint reflects updated approval ratios and processing counts immediately.
- **T3-09: Patient Auto-Suggest Selection (F2) → Patient Allergy Profile Cross-Reactivity Scanner (F5)**
  - *Description*: Selecting patient profile via Auto-Suggest (F2) attaches patient allergy history to clinical scanner context (F5), triggering immediate allergy cross-reactivity scan.
  - *Precondition*: Patient with Penicillin allergy selected.
  - *Expected Result*: Clinical alerts component updates dynamically to display Penicillin allergy warning.
- **T3-10: Image Preprocessor Crop/Rotate (F3) → AI OCR Extraction Confidence Score Impact (F4)**
  - *Description*: Rotating skewed scan 90° clockwise in Preprocessor (F3) prior to OCR re-execution increases overall OCR Confidence Score (F4) from 45% to 92%.
  - *Precondition*: Skewed image initially yields low OCR confidence.
  - *Expected Result*: Post-rotation OCR re-extraction yields higher field confidence scores.
- **T3-11: React Workspace State (F11) → Review API Submission (F7) → POS Sync Modal Trigger (F11)**
  - *Description*: Clicking Approve in UI Workspace (F11) sends API request (F7), and on successful HTTP 200 response, automatically opens `PosSyncModal.jsx` (F11) with draft invoice summary.
  - *Precondition*: User clicks Approve button.
  - *Expected Result*: POS Sync Modal opens automatically presenting calculated billing subtotals.
- **T3-12: Master Page Tab Switching (F12) → Analytics Dashboard Aggregation Fetch (F10)**
  - *Description*: User navigates from "Prescription Queue" tab to "Analytics Dashboard" tab on Master Page (F12), triggering fresh GET request to Analytics API (F10).
  - *Precondition*: Page loaded on Queue tab.
  - *Expected Result*: Tab switch triggers Analytics API fetch; dashboard renders up-to-date chart visualizers.
- **T3-13: Medical Dark Mode Theme Toggle (F13) → Clinical Alerts Severity Banner Visual Contrast (F5/F11)**
  - *Description*: Toggling UI theme from Light to Dark Mode (F13) updates Clinical Validation Alert Banners (F5/F11) styling to maintain WCAG AA contrast ratios against dark backgrounds.
  - *Precondition*: Severe clinical alert banner rendered in Light Mode.
  - *Expected Result*: Dark mode styles apply high-contrast dark red/yellow background classes with readable light text.
- **T3-14: Cross-Tenant Breach Attempt (F2) → Schema Tenant Discriminator (F1) → Audit Trail Security Alert Logging (F8)**
  - *Description*: Unauthorized user attempts accessing prescription from another branch (F2); Schema tenant check (F1) fails, blocking request and logging a security violation entry in Audit Trail (F8).
  - *Precondition*: Unauthorized cross-branch GET request sent.
  - *Expected Result*: HTTP 403 response; security audit event `UNAUTHORIZED_TENANT_ACCESS_ATTEMPT` persisted in DB.
- **T3-15: Complete End-to-End Workflow Execution (F1-F13) → Native E2E Test Runner Verification (F14)**
  - *Description*: Native test suite runner (F14) executes complete end-to-end integration flow encompassing all 13 prior features in a single automated test run.
  - *Precondition*: Test harness initialized with clean in-memory database.
  - *Expected Result*: All stage assertions pass cleanly; complete prescription lifecycle verified end-to-end.

---

### Tier 4: Real-World Scenarios (7 Scenarios)

#### T4-01: High-Volume Peak Morning Rush Workload Scenario
- **Description**: Simulate peak morning pharmacy rush where 50 prescriptions are submitted concurrently via drag-and-drop multi-format uploads (PNG, JPG, PDF). AI OCR processes files in parallel, patient auto-suggest links existing customer profiles, FEFO stock matchers reserve inventory, and pharmacists review and batch-approve prescriptions in under 2 minutes.
- **Precondition**: Multi-tenant database initialized with 100 stock items, 50 patient profiles, and 5 active pharmacist sessions.
- **Test Steps**:
  1. Dispatch 50 concurrent multipart upload requests to POST `/api/v1/prescriptions`.
  2. Trigger parallel AI OCR extractions across all 50 uploaded records.
  3. Execute bulk Clinical Safety Scans and FEFO inventory matching across all 50 items.
  4. Perform 50 concurrent Pharmacist Review approvals via PUT `/api/v1/prescriptions/:id/review`.
  5. Execute POS Billing Sync for all 50 approved prescriptions.
- **Expected Result**: All 50 prescriptions successfully pass from `pending_review` to `approved` and generate POS draft invoices without deadlocks, race conditions, or memory leaks; server responds within SLA (<500ms per approval request).

#### T4-02: Complex Elderly Multi-Comorbidity Patient Prescription
- **Description**: Process a prescription for an 78-year-old patient with chronic kidney disease and hypertension prescribed 8 co-medications simultaneously (including Warfarin, Lisinopril, Potassium Supplements, and NSAIDs). Clinical safety engine must flag 3 high-severity drug interactions, 1 dosage bound warning, and 1 allergy alert. Pharmacist edits dosages, overrides interactions with clinical rationale, and approves.
- **Precondition**: Elderly patient profile with detailed medical notes and recorded Penicillin/NSAID sensitivity.
- **Test Steps**:
  1. Create draft prescription with 8 complex medications for target patient profile.
  2. Execute POST `/api/v1/prescriptions/:id/validate-clinical`.
  3. Verify safety engine flags exact 3 drug interactions, 1 dosage warning, and 1 allergy alert.
  4. Submit PUT `/api/v1/prescriptions/:id/review` with `action: 'edit'` to adjust Lisinopril dosage.
  5. Submit approval with explicit clinical override rationale string.
  6. Fetch GET `/api/v1/prescriptions/:id/audit-trail`.
- **Expected Result**: System mandates clinical override reason for every severe alert; edited dosage and pharmacist rationale are permanently recorded in immutable audit log; status updates to `approved`.

#### T4-03: Out-of-Stock Emergency Chain Substitution Scenario
- **Description**: A critical antibiotic (Augmentin 625mg) prescribed for a urgent infection is completely out of stock at Branch 1. The FEFO matcher aggregates sibling branch stock (showing 50 units at Branch 2 located 3km away) and generates a 1-click Generic Equivalent suggestion (Amoxicillin/Clavulanate generic) in stock at Branch 1. Pharmacist selects generic substitution, updates pricing delta, approves prescription, and syncs POS bill.
- **Precondition**: Branch 1 Augmentin stock = 0; Branch 1 Amoxicillin/Clavulanate generic stock = 30; Branch 2 Augmentin stock = 50.
- **Test Steps**:
  1. Create prescription requesting Augmentin 625mg at Branch 1.
  2. Execute GET `/api/v1/prescriptions/:id/inventory-match`.
  3. Verify `isAvailable: false`, sibling branch stock detected, and generic substitution suggested.
  4. Select generic alternative suggestion via review workspace.
  5. Submit approval and trigger POST `/api/v1/prescriptions/:id/sync-pos`.
- **Expected Result**: Line item updated to generic alternative; local inventory reserved from generic batch; POS bill accurately reflects generic unit price; customer receives medication without delay.

#### T4-04: Illegible Handwritten Prescription Clarification Loop Scenario
- **Description**: An illegible handwritten prescription is uploaded. AI OCR returns low average confidence (28%) and flags illegible dosage text. Pharmacist attempts review but cannot determine prescribed frequency. Pharmacist triggers `request_clarification` state action, attaching notes for prescribing doctor. Doctor receives alert, provides written clarification, pharmacist edits prescription record, re-scans safety engine, and approves.
- **Precondition**: Low-quality handwritten scan uploaded.
- **Test Steps**:
  1. Run OCR extraction on low-quality scan; confirm `ocrConfidence: 28%`.
  2. Pharmacist invokes PUT `/api/v1/prescriptions/:id/review` with `action: 'request_clarification'` and notes.
  3. Confirm status transitions to `clarification_requested`.
  4. Doctor submits updated clarification details via API endpoint.
  5. Pharmacist edits line item with clarified dosage and approves.
- **Expected Result**: Prescription transitions cleanly: `pending_review` -> `clarification_requested` -> `pending_review` (edited) -> `approved`; full audit log records clarification dialogue and resolution.

#### T4-05: High-Risk Controlled Substance Prescription Validation Scenario
- **Description**: Process a prescription for a Schedule II controlled narcotic (Oxycodone 10mg). System mandates strict doctor license auto-search verification, checks patient prescription history for duplicate dispensing within 30 days (refill too soon check), validates maximum daily dosage bounds, requires two-factor pharmacist authorization code, and logs a tamper-evident security audit entry.
- **Precondition**: Oxycodone seeded in drug database as Controlled Substance (Schedule II); patient record exists with past prescription history.
- **Test Steps**:
  1. Create prescription referencing Oxycodone for patient.
  2. Doctor auto-suggest verifies active medical license status.
  3. Safety engine scans past 30-day dispensing history and flags early refill warning if applicable.
  4. Submit approval request providing mandatory pharmacist secondary authorization code.
  5. Inspect generated AuditLog document.
- **Expected Result**: Early refill and controlled substance alerts triggered; approval blocked if authorization code missing; audit log records controlled substance dispensing compliance flag.

#### T4-06: Multi-Branch Chain Manager Analytics & Stock Audit Scenario
- **Description**: Chain Operations Manager accesses Analytics Dashboard (F10) to inspect performance metrics across 5 regional branch pharmacies. Analytics pipeline computes total prescriptions processed, OCR accuracy rate (94.2%), average stage processing latency (340ms), and top 10 prescribed drugs across all branches, while enforcing read-only branch filtering capabilities.
- **Precondition**: 500 prescriptions processed across 5 distinct branches over past 30 days.
- **Test Steps**:
  1. Authenticate user with `Operations Manager` cross-branch role.
  2. Send GET `/api/v1/prescriptions/analytics?timeframe=30d`.
  3. Verify response aggregates metrics across all 5 branches.
  4. Filter request by `branchId=branch_3` and verify branch-specific metrics recalculate.
  5. Fetch top prescribed medicines list.
- **Expected Result**: Multi-branch manager receives complete chain-wide analytics; branch filtering accurately narrows scope; aggregations execute efficiently under 300ms query time.

#### T4-07: Disaster Recovery & POS Sync Network Disruption Scenario
- **Description**: During POS Billing Sync execution (F9), network connection to POS hardware service drops midway through transaction. System circuit breaker catches connection failure, aborts inventory deduction, rolls back POS sale creation, preserves prescription status in `approved` state with `pos_sync_pending` flag, and allows 1-click manual retry once network connectivity is restored.
- **Precondition**: Approved prescription ready for POS sync; simulated network disconnection on POS service port.
- **Test Steps**:
  1. Submit POST `/api/v1/prescriptions/:id/sync-pos` while POS service is disconnected.
  2. Verify error handling catches failure and returns HTTP 503 with retry advice.
  3. Confirm DB inventory was NOT deducted (no orphan deduction).
  4. Restore POS service connectivity.
  5. Re-submit POS sync request.
- **Expected Result**: System handles network outage gracefully without duplicate inventory deductions or corrupt state; second attempt completes successfully and generates POS invoice.

---

## Verification Commands & Pass/Fail Criteria

### Standard Verification Commands

To execute the Prescription Processing Center test suite, run the following commands from the project root directory (`d:\projects\pharmacy-erp`):

#### 1. Run Complete E2E Test Suite (All Tiers 1-4)
```bash
node --test tests/prescription_processing_center/**/*.test.js
```

#### 2. Run Tier 1 Feature Coverage Tests Only
```bash
node --test tests/prescription_processing_center/tier1_feature_coverage/*.test.js
```

#### 3. Run Tier 2 Boundary & Corner Case Tests Only
```bash
node --test tests/prescription_processing_center/tier2_boundary_corner/*.test.js
```

#### 4. Run Tier 3 Cross-Feature Interaction Tests Only
```bash
node --test tests/prescription_processing_center/tier3_interactions/*.test.js
```

#### 5. Run Tier 4 Real-World Scenario Tests Only
```bash
node --test tests/prescription_processing_center/tier4_real_world/*.test.js
```

#### 6. Run Test Suite with Coverage & Memory Inspection
```bash
node --experimental-test-coverage --test tests/prescription_processing_center/**/*.test.js
```

---

### Pass/Fail Criteria

A test run is considered **PASS** if and only if all of the following conditions are strictly satisfied:

1. **100% Test Case Execution**: All **162 test cases** (T1-01 through T1-70, T2-01 through T2-70, T3-01 through T3-15, and T4-01 through T4-07) execute to completion without skipped or pending tests.
2. **Zero Failures or Unhandled Exceptions**: `0` tests failed, `0` uncaught promise rejections, and `0` process crashes reported by the Node.js test runner.
3. **Multi-Tenant Boundary Compliance**: 100% of tested API endpoints verify `pharmacy` and `branch` multi-tenant isolation; zero cross-tenant data leaks.
4. **FEFO Inventory Allocation Strictness**: 100% of inventory reservation tests confirm batches are selected in strict ascending `expiryDate` order (`expiryDate: 1`).
5. **Audit Trail Immutability**: All prescription state mutations generate corresponding `AuditLog` records containing exact user, timestamp, and field diff payloads (`oldValue`, `newValue`).
6. **Performance & Memory SLA**: Average processing time per test assertion is < 100ms; total test suite heap memory growth remains under 150MB.
