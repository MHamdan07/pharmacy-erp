import mongoose from 'mongoose';

const reorderSuggestionSchema = new mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    medicineName: {
      type: String,
      required: true
    },
    currentStock: {
      type: Number,
      default: 0
    },
    minimumStock: {
      type: Number,
      default: 10
    },
    maximumStock: {
      type: Number,
      default: 500
    },
    averageDailySales: {
      type: Number,
      default: 0
    },
    remainingDays: {
      type: Number,
      default: 0
    },
    recommendedQuantity: {
      type: Number,
      default: 100
    },
    recommendedSupplier: {
      type: String,
      default: 'PharmaCorp Global Ltd'
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    confidence: {
      type: Number,
      default: 95
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

reorderSuggestionSchema.index({ pharmacy: 1, branch: 1, priority: 1 });

export default mongoose.model('ReorderSuggestion', reorderSuggestionSchema);
