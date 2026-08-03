import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profilePhoto: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other', 'unspecified'], default: 'unspecified' },
    emergencyContact: { type: String, default: '' },
    allergies: [{ type: String }],
    medicalNotes: { type: String, default: '' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    savedAddresses: [{ title: String, fullAddress: String, isDefault: Boolean }],
    medicineReminders: [{ medicineName: String, time: String, dosage: String, active: Boolean }],
    loyaltyPoints: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true }
  },
  { timestamps: true }
);

customerSchema.index({ pharmacy: 1, phone: 1 });

export default mongoose.model('Customer', customerSchema);
