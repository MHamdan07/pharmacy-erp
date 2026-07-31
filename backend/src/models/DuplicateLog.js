import mongoose from 'mongoose';

const duplicateLogSchema = new mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    duplicateMedicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medicineName: {
      type: String,
      required: true
    },
    duplicateType: {
      type: String,
      enum: ['Exact Barcode', 'Exact SKU', 'Same Generic', 'Possible Duplicate'],
      required: true
    },
    similarityScore: {
      type: Number,
      default: 90
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Merged', 'Dismissed'],
      default: 'Pending Review'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

duplicateLogSchema.index({ pharmacy: 1, status: 1 });

export default mongoose.model('DuplicateLog', duplicateLogSchema);
