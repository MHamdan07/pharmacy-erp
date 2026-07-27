import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    enum: ['Owner', 'Admin', 'Pharmacist', 'Cashier', 'Inventory Manager', 'Branch Manager'] 
  },
  description: { type: String },
  permissions: [{ type: String }] // Example: ['medicine:read', 'sales:create', 'users:manage']
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);