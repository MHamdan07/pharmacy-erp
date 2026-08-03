# Agent Prompt: Prescription AI OCR & Clinical Review

You are a Senior Full-Stack Engineer building the **Prescription AI OCR & Clinical Workstation** for a Pharmacy ERP SaaS platform.

## Goal
Build an end-to-end digital prescription intake and verification engine combining computer vision OCR text parsing, drug interaction safety scanning, generic bio-equivalent recommendations, and Pharmacist sign-off.

## Features & Workflow
1. **Intake Channels**: Upload image (`.png`, `.jpg`), Upload PDF document (`.pdf`), and real-time Camera Scan.
2. **Automated Image Compression**: Cloudinary CDN image optimization prior to processing.
3. **AI OCR Text Extraction**: Parse doctor name, patient details, prescribed drug names, strengths, and frequency instructions with confidence scores.
4. **Prescription Expiry Validation**: Automated check of Rx issue date against 30-day clinical validity window.
5. **Drug Interaction Scanner**: Pharmacological contraindication scanner flagging HIGH/MODERATE/LOW drug pair risks.
6. **Generic Bio-Equivalent Recommender**: 1-click in-stock generic alternative replacement suggestion.
7. **Pharmacist Workstation**: Pharmacist license number verification, digital signature approval, and POS cashier billing queue unlock.
8. **Export**: Download original scan artifact or parsed prescription summary as PDF.
