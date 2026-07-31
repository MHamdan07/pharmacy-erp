import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true }
  },
  { timestamps: true }
);

categorySchema.index({ pharmacy: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
