import mongoose from 'mongoose';

const supplierPaymentSchema = new mongoose.Schema(
  {
    paymentReceiptNumber: { type: String, required: true, trim: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', default: null },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: { type: String, enum: ['cash', 'bank_transfer', 'cheque', 'card'], default: 'bank_transfer' },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

supplierPaymentSchema.index({ pharmacy: 1, supplier: 1 });

export default mongoose.model('SupplierPayment', supplierPaymentSchema);
