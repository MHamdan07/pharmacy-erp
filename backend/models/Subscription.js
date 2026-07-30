import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true, unique: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    planName: { type: String, default: 'Professional' },
    status: {
      type: String,
      enum: ['none', 'pending_payment', 'active', 'trial', 'cancelled', 'canceled', 'expired', 'suspended', 'under_review', 'payment_failed'],
      default: 'active'
    },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    price: { type: Number, default: 299 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    renewalDate: { type: Date },
    expiresAt: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelledAt: { type: Date, default: null },
    trialEndsAt: { type: Date, default: null },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
    autoRenew: { type: Boolean, default: true },
    invoiceNumber: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
