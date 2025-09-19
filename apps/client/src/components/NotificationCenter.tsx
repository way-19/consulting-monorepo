import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Clock, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import { supabase, useAuth } from '@consulting19/shared';

interface Notification {
  id: string;
  type: string;
  payload: any;
  read_at: string | null;
  created_at: string;
  actor_profile: {
    full_name: string;
  } | null;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor_profile:user_profiles!notifications_actor_profile_id_fkey(full_name)
        `)
        .eq('recipient_profile_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(notificationsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(prev => [...prev, notificationId]);

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    } finally {
      setMarkingAsRead(prev => prev.filter(id => id !== notificationId));
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invoice_created':
      case 'payment_reminder':
        return '💰';
      case 'payment_overdue':
        return '🚨';
      case 'payment_received':
        return '✅';
      case 'document_uploaded':
        return '📄';
      case 'message_sent':
        return '💬';
      case 'task_assigned':
        return '✔️';
      case 'meeting_scheduled':
        return '📅';
      default:
        return '🔔';
    }
  };

  const getNotificationMessage = (type: string, payload: any, actorName: string) => {
    switch (type) {
      case 'invoice_created':
        return `💰 New invoice: ${payload.invoice_title} - $${payload.amount} ${payload.currency}`;
      case 'payment_reminder':
        return `⏰ Payment reminder: Invoice due ${payload.due_date ? new Date(payload.due_date).toLocaleDateString() : 'soon'}`;
      case 'payment_overdue':
        return `🚨 Overdue payment: $${payload.amount} ${payload.currency} - Please pay immediately`;
      case 'payment_received':
        return `✅ Payment received: $${payload.amount} ${payload.currency} - Thank you!`;
      case 'document_uploaded':
        return `📄 Document uploaded: ${payload.document_name}`;
      case 'message_sent':
        return `💬 New message from ${actorName}`;
      case 'task_assigned':
        return `✔️ New task assigned: ${payload.task_title}`;
      case 'meeting_scheduled':
        return `📅 Meeting scheduled: ${payload.meeting_title}`;
      default:
        return `🔔 New notification from ${actorName}`;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'invoice_created':
        return 'bg-emerald-50 border-emerald-200';
      case 'payment_reminder':
        return 'bg-yellow-50 border-yellow-200';
      case 'payment_overdue':
        return 'bg-red-50 border-red-200';
      case 'payment_received':
        return 'bg-green-50 border-green-200';
      case 'document_uploaded':
        return 'bg-blue-50 border-blue-200';
      case 'message_sent':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read_at ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      !notification.read_at ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}>
                      {getNotificationMessage(
                        notification.type,
                        notification.payload,
                        notification.actor_profile?.full_name || 'System'
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!notification.read_at && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={markingAsRead.includes(notification.id)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Mark as read"
                      >
                        {markingAsRead.includes(notification.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No notifications yet</p>
            <p className="text-sm text-gray-500">You'll receive updates about invoices, payments, and messages here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            const unread = notifications.filter(n => !n.read_at);
            unread.forEach(n => markAsRead(n.id));
          }}
          disabled={notifications.every(n => n.read_at)}
          className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Mark All as Read
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;