import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true, unique: true },
    companyName: { type: String, default: 'Pharmacy ERP SaaS' },
    taxRegistrationNumber: { type: String, default: 'NTN-9021-X' },
    currencySymbol: { type: String, default: '$' },
    defaultTaxRate: { type: Number, default: 5.0 },
    receiptWidth: { type: String, enum: ['80mm', '58mm'], default: '80mm' },
    receiptHeader: { type: String, default: 'Welcome to Pharmacy ERP' },
    receiptFooter: { type: String, default: 'Thank you for visiting! Non-returnable without receipt.' },
    enableQrVerification: { type: Boolean, default: true },
    autoQuarantineExpired: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 10 }
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
