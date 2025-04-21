import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  Heart,
  Trophy,
  Calendar,
  Clock,
  ChevronRight,
  X,
  Check,
  Settings,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t, direction } = useLanguage();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  } = useNotifications();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return Trophy;
      case 'Calendar':
        return Calendar;
      case 'MessageSquare':
        return MessageSquare;
      case 'Heart':
        return Heart;
      default:
        return Bell;
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-16 ${direction === 'rtl' ? 'left-4' : 'right-4'} w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700`}
            dir={direction}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('notifications')}
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                    {unreadCount} {t('new')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 tooltip"
                  title={t('mark_all_read')}
                >
                  <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 tooltip"
                  title={t('clear_all')}
                >
                  <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {t('no_notifications')}
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getIcon(notification.icon);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer ${
                        notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${notification.bgColor}`}>
                          <Icon className={`w-5 h-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {t(notification.title)}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {t(notification.message)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 group">
                <span>{t('view_all_notifications')}</span>
                <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ${
                  direction === 'rtl' ? 'transform-flip' : ''
                }`} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;