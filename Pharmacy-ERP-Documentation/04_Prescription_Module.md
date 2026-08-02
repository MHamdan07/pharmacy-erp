# 04 Prescription Module

## Purpose & Overview
Manages patient prescription intake, digital image/PDF uploads, OCR text extraction, pharmacist review, pricing, and order fulfillment.

## Features & Workflow
1. **Upload**: Patient uploads prescription image (JPG/PNG) or PDF via Web Storefront or Mobile App.
2. **AI OCR Analysis**: System extracts text lines (Doctor Name, Patient Name, Dosage, Medicine Names).
3. **Pharmacist Intake**: Pharmacist receives real-time notification to review prescription details.
4. **Item Mapping & Pricing**: Pharmacist matches extracted names to available FEFO inventory batches and sets quantities.
5. **Approval & Payment**: Patient receives pricing breakdown and approves payment (COD, JazzCash, EasyPaisa, Card).
6. **Fulfillment**: Order transitions to Cashier/Delivery for dispatch.

## Database Collections
- `prescriptions`: `patientId`, `pharmacyId`, `branchId`, `imageUrl`, `ocrResult`, `status`, `approvedBy`, `items`, `totalAmount`.

## API Endpoints
- `POST /api/v1/prescriptions/upload`: Upload prescription image/PDF.
- `GET /api/v1/prescriptions/pending`: List pending prescriptions for pharmacist review.
- `PUT /api/v1/prescriptions/:id/approve`: Approve prescription and lock inventory batches.
- `PUT /api/v1/prescriptions/:id/reject`: Reject invalid prescription with reason note.
