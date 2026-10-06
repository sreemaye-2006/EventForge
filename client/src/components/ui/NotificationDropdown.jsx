import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      const list = res.data?.data || [];
      setNotifications(list);
      setUnreadCount(res.data?.unreadCount || list.filter(n => !n.read).length);
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      // Ignored
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      // Ignored
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-lg transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-secondary-200 rounded-2xl shadow-xl z-40 overflow-hidden">
            <div className="p-4 border-b border-secondary-100 flex items-center justify-between bg-secondary-50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-secondary-900 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-secondary-100">
              {loading && notifications.length === 0 ? (
                <p className="p-4 text-xs text-center text-secondary-500">Loading alerts...</p>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-secondary-500 text-sm">
                  <p>No notifications yet.</p>
                </div>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <div
                    key={n._id}
                    onClick={() => !n.read && markAsRead(n._id)}
                    className={`p-3.5 hover:bg-secondary-50 transition cursor-pointer flex items-start justify-between gap-3 ${!n.read ? 'bg-primary-50/40' : ''}`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-secondary-900">{n.title}</h5>
                      <p className="text-xs text-secondary-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-secondary-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-600 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
