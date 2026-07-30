import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'low_stock',
        'expiring_medicine',
        'new_purchase',
        'new_sale',
        'backup_status',
        'login_new_device',
        'failed_login'
      ],
      required: true
    },
    channels: [{ type: String, enum: ['in_app', 'email', 'sms'], default: ['in_app'] }],
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

notificationSchema.index({ pharmacy: 1, user: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
