import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, default: '', trim: true },
    brand: { type: String, default: '', trim: true },
    brandName: { type: String, default: '', trim: true },
    manufacturer: { type: String, default: '', trim: true },
    strength: { type: String, default: '' },
    dosageForm: { type: String, default: 'Tablet' },
    composition: { type: String, default: '' },
    batchNumber: { type: String, default: '' },
    sku: { type: String, required: true, trim: true },
    barcode: { type: String, default: '', trim: true },
    qrCode: { type: String, default: '' },
    qrCodeData: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, default: 'General' },
    storage: { type: String, default: 'Store in a cool, dry place below 25°C' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    unit: { type: String, default: 'Strip' },
    price: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    defaultDiscount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    expiry: { type: Date, default: null },
    minStock: { type: Number, default: 10 },
    maxStock: { type: Number, default: 500 },
    prescriptionRequired: { type: Boolean, default: false },
    rxRequired: { type: Boolean, default: false },
    drugInteractions: [{ type: String }],
    warnings: [{ type: String }],
    sideEffects: [{ type: String }],
    alternatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    storageInstructions: { type: String, default: 'Store in a cool, dry place below 25°C.' },
    sideNotes: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true }
  },
  { timestamps: true }
);

medicineSchema.index({ pharmacy: 1, sku: 1 }, { unique: true });
medicineSchema.index({ pharmacy: 1, barcode: 1 });

export default mongoose.model('Medicine', medicineSchema);
