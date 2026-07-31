import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    age: { type: Number, default: 0 },
    gender: { type: String, enum: ['male', 'female', 'other', 'unspecified'], default: 'unspecified' },
    address: { type: String, default: '' },
    allergies: [{ type: String }],
    loyaltyPoints: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true }
  },
  { timestamps: true }
);

customerSchema.index({ pharmacy: 1, phone: 1 });

export default mongoose.model('Customer', customerSchema);
