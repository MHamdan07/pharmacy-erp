# 07 Medicine Module & Master Drug Database

## Overview
The Medicine Module manages master drug catalog definitions, active ingredients (APIs), dosage forms, barcode SKUs, manufacturer profiles, clinical warnings, and 34 comprehensive medicine category classifications.

---

## 24 Master Medicine Data Attributes

1. **Medicine Name**: Commercial product brand title (e.g. `Panadol Extra 500mg`).
2. **Generic Name**: Active pharmaceutical ingredient / API (e.g. `Paracetamol / Caffeine`).
3. **Brand**: Commercial brand classification.
4. **Manufacturer**: Pharmaceutical manufacturing company (e.g. `GSK`, `Pfizer`, `Novartis`).
5. **Strength**: Concentration / dosage strength (e.g. `500mg`, `250mg/5ml`).
6. **Dosage Form**: Formulation type (`Tablet`, `Capsule`, `Syrup`, `Injection`, `Ointment`, `Drops`, `Inhaler`).
7. **Composition**: Exact chemical formulation and excipients.
8. **Batch Number**: Unique manufacturing batch identification code.
9. **Barcode**: Standard EAN-13 13-digit barcode for high-speed scanner readouts.
10. **QR Code**: Encoded 2D QR JSON payload.
11. **Category**: Parent medical category classification reference.
12. **Sub Category**: Secondary classification taxonomy.
13. **Storage**: Storage temperature and humidity conditions (`Cool & Dry`, `Refrigerated 2-8°C`, `Room Temp`).
14. **Price**: Maximum Retail Price (MRP) per unit.
15. **Discount**: Standard promotional discount percentage.
16. **Tax**: Applicable VAT / Sales Tax percentage.
17. **Stock**: Total available inventory units.
18. **Expiry**: Batch expiration date (`YYYY-MM-DD`).
19. **Prescription Required (Rx)**: Boolean clinical flag requiring Pharmacist validation prior to checkout.
20. **Drug Interactions**: List of contraindicated medications and drug-drug overlap warnings.
21. **Warnings**: Clinical precautions and black-box warnings.
22. **Side Effects**: Common and adverse side effects list.
23. **Alternatives**: Cross-referenced in-stock bio-equivalent generic alternatives.

---

## 34 Comprehensive Medicine Categories

1. **Prescription Medicines**
2. **OTC Medicines**
3. **Antibiotics**
4. **Analgesics**
5. **Antipyretics**
6. **Antihistamines**
7. **Cardiovascular**
8. **Diabetes**
9. **Respiratory**
10. **Neurology**
11. **Psychiatry**
12. **Dermatology**
13. **Gastroenterology**
14. **Orthopedics**
15. **Oncology**
16. **Pediatrics**
17. **Gynecology**
18. **Urology**
19. **Ophthalmology**
20. **ENT (Ear, Nose, Throat)**
21. **Vaccines**
22. **Vitamins**
23. **Supplements**
24. **Baby Care**
25. **Women's Health**
26. **Men's Health**
27. **Skin Care**
28. **Hair Care**
29. **Dental Care**
30. **Medical Devices**
31. **First Aid**
32. **Herbal Products**
33. **Personal Care**
34. **Nutrition**
