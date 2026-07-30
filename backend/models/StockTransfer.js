import mongoose from 'mongoose';

const transferItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  batchNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true, min: 1 },
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  mrp: { type: Number, default: 0 }
});

const stockTransferSchema = new mongoose.Schema(
  {
    transferNumber: { type: String, required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    fromBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    toBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [transferItemSchema],
    status: { type: String, enum: ['pending', 'approved', 'dispatched', 'received', 'rejected'], default: 'pending' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

stockTransferSchema.index({ pharmacy: 1, transferNumber: 1 }, { unique: true });

export default mongoose.model('StockTransfer', stockTransferSchema);
