import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    batchNumber: { type: String, required: true, trim: true },
    manufacturingDate: { type: Date, default: null },
    expiryDate: { type: Date, required: true },
    costPrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 },
    mrp: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    
    // Stock Tracking Categories
    quantity: { type: Number, required: true, default: 0, min: 0 }, // Available Stock
    reservedQuantity: { type: Number, default: 0, min: 0 }, // Reserved Stock
    damagedQuantity: { type: Number, default: 0, min: 0 }, // Damaged / Quarantined Stock
    returnedQuantity: { type: Number, default: 0, min: 0 }, // Returned Stock
    inTransitQuantity: { type: Number, default: 0, min: 0 }, // In Transit Stock

    rackNumber: { type: String, default: '' },
    barcode: { type: String, default: '' },
    status: { type: String, enum: ['active', 'expired', 'recalled', 'exhausted'], default: 'active' }
  },
  { timestamps: true }
);

batchSchema.index({ pharmacy: 1, branch: 1, medicine: 1, expiryDate: 1 });
batchSchema.index({ pharmacy: 1, branch: 1, batchNumber: 1 });

export default mongoose.model('Batch', batchSchema);
