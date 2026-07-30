import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true }, // e.g., 'medicines:create'
    name: { type: String, required: true, trim: true },
    module: { type: String, required: true, trim: true }, // e.g., 'Inventory'
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Permission', permissionSchema);
