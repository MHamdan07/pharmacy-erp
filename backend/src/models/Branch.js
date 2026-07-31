import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true }, // e.g., "BR-01"
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  address: { type: String, required: true },
  isHeadquarter: { type: Boolean, default: false },
  receiptHeader: { type: String, default: 'Thank you for visiting!' },
  receiptFooter: { type: String, default: 'Get well soon!' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

branchSchema.index({ pharmacy: 1, code: 1 }, { unique: true });

export default mongoose.model('Branch', branchSchema);