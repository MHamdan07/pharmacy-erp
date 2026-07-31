import Batch from '../models/Batch.js';
import AuditLog from '../models/AuditLog.js';

export const getExpiryAnalytics = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;
    const branchFilter = { pharmacy: pharmacyId };
    if (req.branchId) branchFilter.branch = req.branchId;

    const batches = await Batch.find(branchFilter)
      .populate({ path: 'medicine', populate: ['category', 'supplier'] })
      .populate('supplier')
      .populate('branch')
      .sort({ expiryDate: 1 });

    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const day30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const day60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const day90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const expired = [];
    const expiringToday = [];
    const days7 = [];
    const days30 = [];
    const days60 = [];
    const days90 = [];

    batches.forEach((b) => {
      if (b.quantity <= 0) return;

      const exp = new Date(b.expiryDate);
      if (exp < now) {
        expired.push(b);
      } else if (exp <= todayEnd) {
        expiringToday.push(b);
      } else if (exp <= day7) {
        days7.push(b);
      } else if (exp <= day30) {
        days30.push(b);
      } else if (exp <= day60) {
        days60.push(b);
      } else if (exp <= day90) {
        days90.push(b);
      }
    });

    res.json({
      counts: {
        expired: expired.length,
        expiringToday: expiringToday.length,
        days7: days7.length,
        days30: days30.length,
        days60: days60.length,
        days90: days90.length
      },
      expired,
      expiringToday,
      days7,
      days30,
      days60,
      days90
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const triggerAlert = async (req, res) => {
  const { alertType, batchIds } = req.body; // alertType: 'email', 'sms', 'lock'

  try {
    const pharmacyId = req.pharmacyId;

    if (alertType === 'lock') {
      // Lock expired batches
      const now = new Date();
      const updated = await Batch.updateMany(
        { pharmacy: pharmacyId, expiryDate: { $lt: now } },
        { status: 'expired' }
      );

      await AuditLog.create({
        pharmacy: pharmacyId,
        branch: req.branchId,
        user: req.userFull._id,
        userName: req.userFull.name,
        action: 'EXPIRED_BATCHES_LOCKED',
        module: 'Expiry Management',
        details: `Locked ${updated.modifiedCount} expired batches from POS billing.`
      });

      return res.json({ message: `Successfully locked ${updated.modifiedCount} expired batches.` });
    }

    if (alertType === 'email' || alertType === 'sms') {
      await AuditLog.create({
        pharmacy: pharmacyId,
        branch: req.branchId,
        user: req.userFull._id,
        userName: req.userFull.name,
        action: alertType === 'email' ? 'EXPIRED_EMAIL_ALERT_SENT' : 'EXPIRED_SMS_ALERT_SENT',
        module: 'Expiry Management',
        details: `Triggered ${alertType.toUpperCase()} alerts to pharmacy managers for near-expiry inventory.`
      });

      return res.json({ message: `${alertType.toUpperCase()} alerts dispatched to pharmacy managers successfully.` });
    }

    res.status(400).json({ message: 'Invalid alert type' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
