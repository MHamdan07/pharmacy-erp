import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    default: null
  },
  rawText: {
    type: String,
    default: ''
  },
  dosage: {
    type: String,
    default: ''
  },
  frequency: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    default: 1
  },
  confidence: {
    type: Number,
    default: 0
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    default: null
  },
  isMatched: {
    type: Boolean,
    default: false
  }
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: ''
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  performedByName: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
});

const drugInteractionWarningSchema = new mongoose.Schema({
  severity: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'],
    default: 'MODERATE'
  },
  drugPair: [{ type: String }],
  clinicalDescription: {
    type: String,
    default: ''
  }
});

const allergyWarningSchema = new mongoose.Schema({
  patientAllergy: {
    type: String,
    default: ''
  },
  triggeringDrug: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'],
    default: 'HIGH'
  }
});

const dosageWarningSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    default: ''
  },
  extractedDosage: {
    type: String,
    default: ''
  },
  maxDailyDosage: {
    type: String,
    default: ''
  },
  issue: {
    type: String,
    default: ''
  }
});

const pregnancyWarningSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    default: ''
  },
  fdaCategory: {
    type: String,
    default: ''
  },
  warningText: {
    type: String,
    default: ''
  }
});

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
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
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
    doctor: {
      name: { type: String, trim: true, default: '' },
      registrationNumber: { type: String, trim: true, default: '' },
      hospital: { type: String, trim: true, default: '' }
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
    ocrProcessingTimeMs: {
      type: Number,
      default: 0
    },
    lineItems: [lineItemSchema],
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
    clinicalValidation: {
      drugInteractions: [drugInteractionWarningSchema],
      allergyWarnings: [allergyWarningSchema],
      dosageWarnings: [dosageWarningSchema],
      pregnancyWarnings: [pregnancyWarningSchema],
      isSafe: {
        type: Boolean,
        default: true
      }
    },
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
    fileType: {
      type: String,
      enum: ['image', 'pdf', 'camera_scan'],
      default: 'image'
    },
    isCompressed: {
      type: Boolean,
      default: true
    },
    rxIssueDate: {
      type: Date,
      default: Date.now
    },
    rxExpiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    isExpired: {
      type: Boolean,
      default: false
    },
    workflowStage: {
      type: String,
      enum: [
        'upload',
        'ocr',
        'compression',
        'ai_detection',
        'validation',
        'pharmacist_review',
        'approval',
        'invoice',
        'payment',
        'delivery'
      ],
      default: 'upload'
    },
    suggestedAlternatives: [
      {
        originalDrug: String,
        genericName: String,
        suggestedBrand: String,
        priceDifference: Number
      }
    ],
    status: {
      type: String,
      enum: [
        'pending',
        'ocr_completed',
        'under_review',
        'clarification_requested',
        'approved',
        'rejected',
        'fulfilled'
      ],
      default: 'pending'
    },
    statusHistory: [statusHistorySchema],
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    imagePreprocessing: {
      rotationAngle: { type: Number, default: 0 },
      isDenoised: { type: Boolean, default: false },
      isDeskewed: { type: Boolean, default: false },
      brightness: { type: Number, default: 100 },
      contrast: { type: Number, default: 100 },
      cropBounds: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        width: { type: Number, default: 100 },
        height: { type: Number, default: 100 }
      }
    },
    batchGroupId: {
      type: String,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    clarificationNotes: {
      type: String,
      default: ''
    },
    pharmacistLicense: {
      type: String,
      default: ''
    },
    digitalSignature: {
      type: String,
      default: ''
    },
    posConvertedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

prescriptionSchema.index({ pharmacy: 1, branch: 1, status: 1 });
prescriptionSchema.index({ pharmacy: 1, patient: 1 });
prescriptionSchema.index({ pharmacy: 1, branch: 1, createdAt: -1 });
prescriptionSchema.index({ pharmacy: 1, saleId: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;

