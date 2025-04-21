import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardAPI } from '../lib/api/mockData';
import { useLanguage } from './LanguageContext';

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'support' | 'milestone';
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  bgColor: string;
  unread: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    // Load initial notifications
    const fetchNotifications = async () => {
      try {
        const data = await dashboardAPI.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Set up real-time notification listener
    const notificationInterval = setInterval(() => {
      dashboardAPI.checkNewNotifications().then(newNotifications => {
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev]);
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            newNotifications.forEach(notification => {
              new Notification(t(notification.title), {
                body: t(notification.message),
                icon: '/notification-icon.png'
              });
            });
          }
        }
      });
    }, 30000); // Check every 30 seconds

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      clearInterval(notificationInterval);
    };
  }, [t]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const addNotification = async (notification: Omit<Notification, 'id' | 'time'>) => {
    try {
      const newNotification = await dashboardAPI.addNotification(notification);
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await dashboardAPI.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, unread: false }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await dashboardAPI.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, unread: false }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotification = async (id: string) => {
    try {
      await dashboardAPI.deleteNotification(id);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await dashboardAPI.deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}