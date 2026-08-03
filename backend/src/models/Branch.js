import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true }, // e.g., "BR-01"
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  address: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  openingHours: { type: String, default: '08:00 AM - 10:00 PM' },
  isWarehouse: { type: Boolean, default: false },
  isHeadquarter: { type: Boolean, default: false },
  receiptHeader: { type: String, default: 'Thank you for visiting!' },
  receiptFooter: { type: String, default: 'Get well soon!' },
  status: { type: String, enum: ['active', 'suspended', 'closed'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

branchSchema.index({ pharmacy: 1, code: 1 }, { unique: true });

export default mongoose.model('Branch', branchSchema);