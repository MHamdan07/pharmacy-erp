import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brandName: { type: String, default: '', trim: true },
    genericName: { type: String, default: '', trim: true },
    manufacturer: { type: String, default: '', trim: true },
    sku: { type: String, required: true, trim: true },
    barcode: { type: String, default: '', trim: true },
    qrCodeData: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    unit: { type: String, default: 'Strip' }, // Strip, Box, Bottle, Vial, Tablet, Pack
    strength: { type: String, default: '' },
    dosageForm: { type: String, default: 'Tablet' },
    packSize: { type: String, default: '10s' },
    hsnCode: { type: String, default: '' },
    costPrice: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 }, // Selling Price
    defaultDiscount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    minStock: { type: Number, default: 10 },
    maxStock: { type: Number, default: 500 },
    rxRequired: { type: Boolean, default: false },
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
