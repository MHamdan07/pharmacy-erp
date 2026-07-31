import mongoose from 'mongoose';

const forecastSettingSchema = new mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
      unique: true
    },
    predictionWindow: {
      type: Number,
      default: 30 // Days: 7, 30, 90, 365
    },
    minimumConfidence: {
      type: Number,
      default: 70
    },
    deadStockDays: {
      type: Number,
      default: 180
    },
    movingAverageWindow: {
      type: Number,
      default: 14 // Days
    },
    seasonalAdjustment: {
      type: Boolean,
      default: true
    },
    autoGenerate: {
      type: Boolean,
      default: true
    },
    scheduleFrequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly'],
      default: 'Daily'
    }
  },
  { timestamps: true }
);

export default mongoose.model('ForecastSetting', forecastSettingSchema);
