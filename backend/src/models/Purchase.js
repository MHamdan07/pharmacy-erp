import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  medicineName: { type: String, required: true },
  orderedQuantity: { type: Number, required: true, min: 1 },
  receivedQuantity: { type: Number, default: 0, min: 0 }, // Partial delivery support
  batchNumber: { type: String, required: true, trim: true },
  expiryDate: { type: Date, required: true },
  manufacturingDate: { type: Date, default: null },
  rackNumber: { type: String, default: '' },
  costPrice: { type: Number, required: true, default: 0 },
  sellingPrice: { type: Number, required: true, default: 0 },
  taxRate: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 }
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseOrderNumber: { type: String, required: true, trim: true },
    supplierInvoiceNumber: { type: String, default: '', trim: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'partially_received', 'received', 'cancelled'],
      default: 'pending'
    },
    items: [purchaseItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
    invoiceDocumentUrl: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

purchaseSchema.index({ pharmacy: 1, branch: 1, purchaseOrderNumber: 1 });

export default mongoose.model('Purchase', purchaseSchema);
