import React from 'react';
import { X, AlertCircle, CheckCircle, Info, TrendingUp, FileText, Users } from 'lucide-react';
import { Card } from './ui/card';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'critical',
      title: 'High Risk Alert',
      message: 'Patient John Anderson flagged with 94% diabetes risk',
      time: '5 mins ago',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Analysis Complete',
      message: 'Cardiovascular analysis for Sarah Mitchell completed successfully',
      time: '15 mins ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update',
      message: 'AI model accuracy improved to 94.2%',
      time: '1 hour ago',
      read: true
    },
    {
      id: '4',
      type: 'warning',
      title: 'Data Validation Issue',
      message: '3 records require manual review',
      time: '2 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'info',
      title: 'New Reports Available',
      message: '12 new patient reports uploaded',
      time: '3 hours ago',
      read: true
    },
    {
      id: '6',
      type: 'success',
      title: 'Backup Complete',
      message: 'Daily database backup completed successfully',
      time: '5 hours ago',
      read: true
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle size={20} className="text-pink-400" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-400" />;
      case 'info':
        return <Info size={20} className="text-cyan-400" />;
      default:
        return <Info size={20} className="text-gray-400" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-pink-500/30 bg-pink-500/5';
      case 'success':
        return 'border-green-500/30 bg-green-500/5';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'info':
        return 'border-cyan-500/30 bg-cyan-500/5';
      default:
        return 'border-gray-700 bg-black/40';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-black/95 backdrop-blur-xl border-l neon-border-cyan transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-cyan-400 neon-text-cyan">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-pink-500/20 border border-pink-500/50 text-pink-400 text-xs rounded-full neon-glow-pink">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all"
          >
            <X size={20} className="text-gray-400 hover:text-cyan-400" />
          </button>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto h-[calc(100%-100px)] p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 neon-glow-cyan">
              <CheckCircle size={32} className="text-cyan-400" />
            </div>
            <p className="text-gray-400">No notifications</p>
            <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${getColorClass(
                notification.type
              )} ${!notification.read ? 'border-opacity-100' : 'border-opacity-50 opacity-60'}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm text-white">{notification.title}</h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-1 neon-glow-cyan" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <FileText size={16} className="text-cyan-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">67 Reports</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Users size={16} className="text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">284 Patients</p>
          </div>
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <TrendingUp size={16} className="text-pink-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">92% Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
