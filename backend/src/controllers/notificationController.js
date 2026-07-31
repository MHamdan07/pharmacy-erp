import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ pharmacy: req.pharmacyId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ pharmacy: req.pharmacyId, isRead: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ pharmacy: req.pharmacyId, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dispatchNotificationHelper = async ({ pharmacyId, branchId, userId, title, message, type, channels = ['in_app', 'email', 'sms'] }) => {
  try {
    await Notification.create({
      pharmacy: pharmacyId,
      branch: branchId || null,
      user: userId || null,
      title,
      message,
      type,
      channels,
      isRead: false
    });

    console.log(`🔔 [NOTIFICATION DISPATCH - ${channels.join('/')}]: ${title} -> ${message}`);
  } catch (err) {
    console.error('Failed to dispatch notification:', err);
  }
};
