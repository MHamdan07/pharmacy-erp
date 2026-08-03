# 05 Customer Module & E-Storefront Portal

## Overview
The Customer Module governs patient relationship management (CRM) inside the back-office and patient interactions across the public E-Commerce Storefront (`/store`) and mobile app.

---

## Customer Authentication & Login

Patients authenticate into the e-storefront using simplified credentials:

- **Credential Credentials**: Email, Password, Phone Number.
- **Form Controls**: `Remember Me` checkbox, `Forgot Password` reset trigger, `Login` action button, `Register` account button.

---

## Customer Editable Profile Attributes (13 Fields)

Patients can manage and edit their personal profile metrics:

1. **Name**: Full legal patient name.
2. **Profile Photo**: Avatar image upload (Cloudinary).
3. **Email**: Primary contact & digital receipt email.
4. **Phone**: Contact phone number for delivery updates.
5. **Password**: Encrypted login credential.
6. **Address**: Street address for home medication delivery.
7. **City**: Patient city location.
8. **Country**: Patient country location.
9. **Date of Birth**: Patient birth date for clinical dosage calculations.
10. **Gender**: Gender designation (`Male`, `Female`, `Other`).
11. **Emergency Contact**: Phone number of primary emergency contact.
12. **Allergies**: List of known drug or food allergies (cross-checked during POS & Rx verification).
13. **Medical Notes**: Additional clinical history notes provided by patient.

---

## 11 Customer Platform Features

1. **Medicine Search**: Real-time generic name and brand search with category pill filters.
2. **Order Medicines**: Add OTC and prescription drugs to cart with quantity controls.
3. **Upload Prescription**: Drag-and-drop Rx image uploader for prescription-only drugs.
4. **Order History**: Track past completed orders with downloadable PDF receipts.
5. **Wishlist**: Save favorite or recurring medications for 1-click reordering.
6. **Saved Addresses**: Manage multiple delivery addresses (Home, Office, Family).
7. **Medicine Reminders**: Set automated daily medication dosage alarms and push notifications.
8. **Reviews**: Submit product ratings and reviews for OTC healthcare products.
9. **Notifications**: Multi-channel alerts for order status, prescription approvals, and refill reminders.
10. **Edit Profile**: Modify contact details, allergies, and emergency contact numbers.
11. **Change Password**: Update security account credentials.

---

## 5 Payment Gateways & Methods

Patients can complete checkout using 5 supported payment channels:

1. **Cash (Cash on Delivery / COD)**: Physical cash payment collected upon home delivery.
2. **JazzCash**: Direct digital wallet transfer.
3. **Easypaisa**: Mobile wallet payment collection.
4. **Credit Card**: Visa / Mastercard online payment gateway.
5. **Debit Card**: Direct bank debit payment gateway.
