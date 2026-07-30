import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  medicineName: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  batchNumber: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  total: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, trim: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    patientName: { type: String, default: 'Walk-in Customer' },
    patientPhone: { type: String, default: '' },
    doctorName: { type: String, default: '' },
    prescriptionNumber: { type: String, default: '' },
    prescriptionDocumentUrl: { type: String, default: '' }, // Prescription Upload URL

    items: [saleItemSchema],

    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    loyaltyPointsEarned: { type: Number, default: 0 },
    loyaltyPointsRedeemed: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'jazzcash', 'easypaisa', 'credit_account'],
      default: 'cash'
    },
    status: { type: String, enum: ['completed', 'refunded', 'cancelled'], default: 'completed' },
    qrVerificationData: { type: String, default: '' } // Thermal Invoice Verification QR Code
  },
  { timestamps: true }
);

saleSchema.index({ pharmacy: 1, branch: 1, invoiceNumber: 1 });
saleSchema.index({ pharmacy: 1, createdAt: -1 });

export default mongoose.model('Sale', saleSchema);
