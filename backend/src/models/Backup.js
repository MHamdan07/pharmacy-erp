import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema(
  {
    backupName: { type: String, required: true, trim: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    schedule: { type: String, enum: ['daily', 'weekly', 'monthly', 'manual'], default: 'manual' },
    target: { type: String, enum: ['local', 'cloud'], default: 'local' },
    sizeBytes: { type: Number, default: 0 },
    recordCount: { type: Number, default: 0 },
    status: { type: String, enum: ['verified', 'corrupted', 'restored'], default: 'verified' },
    fileUrl: { type: String, default: '' },
    backupData: { type: String, default: '' } // Serialized database snapshot
  },
  { timestamps: true }
);

backupSchema.index({ pharmacy: 1, createdAt: -1 });

export default mongoose.model('Backup', backupSchema);
