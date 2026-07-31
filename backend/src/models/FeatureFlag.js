import mongoose from 'mongoose';

const featureFlagSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true, unique: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    pos: { type: Boolean, default: true },
    inventory: { type: Boolean, default: true },
    medicines: { type: Boolean, default: true },
    expiry: { type: Boolean, default: true },
    barcode: { type: Boolean, default: true },
    qrScanner: { type: Boolean, default: true },
    reports: { type: Boolean, default: true },
    multiBranch: { type: Boolean, default: true },
    accounting: { type: Boolean, default: true },
    purchaseApproval: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    clinicalWarnings: { type: Boolean, default: true },
    auditLogs: { type: Boolean, default: true },
    riskMatrix: { type: Boolean, default: true },
    transfers: { type: Boolean, default: true },
    purchases: { type: Boolean, default: true },
    customers: { type: Boolean, default: true },
    backups: { type: Boolean, default: true },
    aiForecast: { type: Boolean, default: true },
    voiceSearch: { type: Boolean, default: false },
    webhooks: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('FeatureFlag', featureFlagSchema);
