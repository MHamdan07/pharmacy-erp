import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
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
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientPhone: {
      type: String,
      default: ''
    },
    doctorName: {
      type: String,
      default: 'Dr. Unspecified'
    },
    prescriptionUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'
    },
    ocrRawText: {
      type: String,
      default: ''
    },
    ocrConfidence: {
      type: Number,
      default: 94.5
    },
    extractedMedicines: [
      {
        medicineName: String,
        strength: String,
        dosageFrequency: String,
        quantity: Number,
        unitPrice: Number,
        matchedMedicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine'
        }
      }
    ],
    drugInteractionAlerts: [
      {
        level: {
          type: String,
          enum: ['HIGH', 'MODERATE', 'LOW']
        },
        pair: [String],
        warningMessage: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'ocr_completed', 'approved', 'rejected', 'fulfilled'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      default: ''
    },
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

prescriptionSchema.index({ pharmacy: 1, branch: 1, status: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
