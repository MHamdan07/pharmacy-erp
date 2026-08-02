import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Manager', 'Pharmacist', 'Cashier', 'Inventory Staff', 'Delivery Staff'],
      default: 'Cashier'
    },
    shift: {
      type: String,
      enum: ['Morning', 'Evening', 'Night', 'Flexible'],
      default: 'Morning'
    },
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

employeeSchema.index({ pharmacy: 1, branch: 1 });

export default mongoose.model('Employee', employeeSchema);
