import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Contact person
    company: { type: String, required: true, trim: true }, // Company Name
    taxId: { type: String, default: '', trim: true }, // NTN / GST / Tax ID
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    address: { type: String, default: '' },
    balancePayable: { type: Number, default: 0 }, // Outstanding Balance Owed
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true }
  },
  { timestamps: true }
);

supplierSchema.index({ pharmacy: 1, company: 1 });

export default mongoose.model('Supplier', supplierSchema);
