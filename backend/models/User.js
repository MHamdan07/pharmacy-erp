import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      enum: ['Owner', 'Admin', 'Pharmacist', 'Cashier', 'Inventory Manager', 'Branch Manager'], 
      default: 'Cashier' 
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ⚠️ MAKE SURE THIS EXACT LINE IS AT THE VERY BOTTOM ⚠️
export default mongoose.model('User', userSchema);