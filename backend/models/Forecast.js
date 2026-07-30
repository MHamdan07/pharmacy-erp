import mongoose from 'mongoose';

const forecastSchema = new mongoose.Schema(
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
      ref: 'Medicine'
    },
    medicineName: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      default: 'General'
    },
    predictedDemand: {
      type: Number,
      default: 0
    },
    predictedRevenue: {
      type: Number,
      default: 0
    },
    predictedGrowth: {
      type: Number,
      default: 0
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 85
    },
    trend: {
      type: String,
      enum: ['Growing', 'Stable', 'Declining', 'Seasonal', 'Dead Stock', 'New Product'],
      default: 'Stable'
    },
    recommendedOrderQuantity: {
      type: Number,
      default: 0
    },
    recommendedReorderDate: {
      type: Date
    },
    estimatedStockoutDate: {
      type: Date
    },
    daysUntilStockout: {
      type: Number,
      default: 30
    },
    algorithmVersion: {
      type: String,
      default: 'v1.0-rule-based'
    },
    recommendationText: {
      type: String
    },
    recommendationReason: {
      type: String
    }
  },
  { timestamps: true }
);

forecastSchema.index({ pharmacy: 1, branch: 1, createdAt: -1 });

export default mongoose.model('Forecast', forecastSchema);
