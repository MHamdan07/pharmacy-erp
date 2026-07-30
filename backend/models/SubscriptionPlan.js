import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Starter, Professional, Enterprise, Custom
    price: { type: Number, required: true, default: 99 },
    yearlyPrice: { type: Number, default: 990 }, // Discounted yearly
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    description: { type: String, default: '' },

    // Plan Limits
    limits: {
      maxBranches: { type: Number, default: 1 },
      maxUsers: { type: Number, default: 3 },
      maxMedicines: { type: Number, default: 500 },
      maxStorageGB: { type: Number, default: 2 },
      maxApiRequests: { type: Number, default: 5000 }
    },

    // Feature Flags Matrix
    features: {
      pos: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      medicines: { type: Boolean, default: true },
      expiry: { type: Boolean, default: true },
      barcode: { type: Boolean, default: true },
      qrScanner: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
      multiBranch: { type: Boolean, default: false },
      accounting: { type: Boolean, default: false },
      purchaseApproval: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      clinicalWarnings: { type: Boolean, default: false },
      auditLogs: { type: Boolean, default: false },
      riskMatrix: { type: Boolean, default: false },
      transfers: { type: Boolean, default: false },
      purchases: { type: Boolean, default: false },
      customers: { type: Boolean, default: true },
      backups: { type: Boolean, default: false },
      aiForecast: { type: Boolean, default: false },
      voiceSearch: { type: Boolean, default: false },
      webhooks: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false }
    },

    status: { type: String, enum: ['active', 'archived'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
