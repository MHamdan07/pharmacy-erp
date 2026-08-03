import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    licenseNumber: { type: String, default: '' },
    taxNumber: { type: String, default: '' },
    country: { type: String, default: 'USA' },
    city: { type: String, default: 'New York' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: 'https://pharmacy-erp-rouge.vercel.app' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    logo: { type: String, default: '' },
    plan: { type: String, enum: ['Starter', 'Professional', 'Enterprise'], default: 'Professional' },
    subscriptionStatus: { type: String, enum: ['active', 'suspended', 'expired', 'canceled'], default: 'active' },
    isActive: { type: Boolean, default: true },

    // Feature Flags for SaaS Subscriptions
    featureFlags: {
      barcode: { type: Boolean, default: true },
      qrScanner: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      multiBranch: { type: Boolean, default: true },
      auditLogs: { type: Boolean, default: true },
      aiForecast: { type: Boolean, default: true },
      clinicalWarnings: { type: Boolean, default: true }
    },

    // Custom Tenant Branding & Settings
    branding: {
      logo: { type: String, default: '' },
      primaryColor: { type: String, default: '#2563eb' },
      secondaryColor: { type: String, default: '#059669' },
      currency: { type: String, default: 'USD' },
      currencySymbol: { type: String, default: '$' },
      timezone: { type: String, default: 'UTC' },
      language: { type: String, default: 'en' },
      receiptFooter: { type: String, default: 'Thank you for choosing our pharmacy! Get well soon.' }
    },

    // Custom SMTP Email Configuration
    smtp: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
      fromEmail: { type: String, default: '' }
    },

    // Custom SMS Provider Configuration
    smsProvider: {
      provider: { type: String, default: 'Twilio' },
      apiKey: { type: String, default: '' },
      senderId: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Pharmacy', pharmacySchema);
