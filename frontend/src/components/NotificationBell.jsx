import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  Bell, AlertTriangle, Clock, ShoppingCart, Truck, Database, ShieldAlert,
  KeyRound, Check, X
} from 'lucide-react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'low_stock': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'expiring_medicine': return <Clock className="w-4 h-4 text-purple-400" />;
      case 'new_sale': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'new_purchase': return <Truck className="w-4 h-4 text-blue-400" />;
      case 'backup_status': return <Database className="w-4 h-4 text-indigo-400" />;
      case 'login_new_device': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'failed_login': return <KeyRound className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 relative cursor-pointer transition-all"
        title="In-App Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
          <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-blue-400" />
              <span>In-App Notifications ({unreadCount} unread)</span>
            </div>
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark All Read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 italic text-xs">
                No recent notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 space-y-1 transition-colors ${
                    n.isRead ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-800/60 text-slate-200 font-semibold'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      {getEventIcon(n.type)}
                      {n.title}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
