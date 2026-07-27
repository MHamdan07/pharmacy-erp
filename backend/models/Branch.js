import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }, // e.g., "BR-01"
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Branch', branchSchema);