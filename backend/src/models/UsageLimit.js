import mongoose from 'mongoose';

const usageLimitSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true, unique: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    maxBranches: { type: Number, default: 5 },
    maxUsers: { type: Number, default: 15 },
    maxMedicines: { type: Number, default: 99999 },
    maxStorageGB: { type: Number, default: 20 },
    maxApiRequests: { type: Number, default: 50000 }
  },
  { timestamps: true }
);

export default mongoose.model('UsageLimit', usageLimitSchema);
