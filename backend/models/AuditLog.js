import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, default: 'System' },
    action: {
      type: String,
      required: true
    },
    module: { type: String, required: true },
    details: { type: String, required: true },
    oldValue: { type: String, default: '' },
    newValue: { type: String, default: '' }
  },
  { timestamps: true }
);

auditLogSchema.index({ pharmacy: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
