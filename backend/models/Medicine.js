import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, default: '' },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    strength: { type: String, default: '' },
    dosageForm: { type: String, default: '' },
    packSize: { type: String, default: '' },
    unitPrice: { type: Number, default: 0 },
    stockQty: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    expiryDate: { type: Date, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
