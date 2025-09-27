import React, { useEffect, useState } from 'react';
import { supabase, useAuth } from '@consulting19/shared';
import { Bell } from 'lucide-react';

interface SyncNotification {
  id: string;
  type: 'new_client' | 'payment_received' | 'message_received' | 'commission_update';
  payload: any;
  created_at: string;
}

interface ConsultantSyncManagerProps {
  onNotification?: (notification: SyncNotification) => void;
}

const ConsultantSyncManager: React.FC<ConsultantSyncManagerProps> = ({ onNotification }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<SyncNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Setup real-time subscription for consultant notifications
    const channel = supabase
      .channel('consultant-sync')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_profile_id=eq.${user.id}`
        },
        (payload) => {
          const notification: SyncNotification = {
            id: payload.new.id,
            type: payload.new.type,
            payload: payload.new.payload,
            created_at: payload.new.created_at
          };
          
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
          onNotification?.(notification);
          
          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Client Activity', {
              body: getNotificationMessage(notification),
              icon: '/favicon.svg'
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'service_orders',
          filter: `consultant_id=eq.${user.id}`
        },
        (payload) => {
          const notification: SyncNotification = {
            id: `order-${payload.new.id}`,
            type: 'payment_received',
            payload: {
              amount: payload.new.total_amount,
              currency: payload.new.currency,
              title: payload.new.title
            },
            created_at: payload.new.created_at
          };
          
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
          onNotification?.(notification);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onNotification]);

  const getNotificationMessage = (notification: SyncNotification) => {
    switch (notification.type) {
      case 'new_client':
        return `New client assigned: ${notification.payload.client_name}`;
      case 'payment_received':
        return `Payment received: $${notification.payload.amount} ${notification.payload.currency}`;
      case 'message_received':
        return `New message from client`;
      case 'commission_update':
        return `Commission rate updated to ${notification.payload.rate}%`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Connection Status */}
      <div className={`mb-2 px-3 py-1 rounded-full text-xs font-medium ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? '🟢 Sync Active' : '🔴 Sync Offline'}
      </div>

      {/* Recent Notifications - Show only latest */}
      {notifications.slice(0, 1).map((notification) => (
        <div
          key={notification.id}
          className="mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-sm animate-slide-in"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-3 h-3 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {getNotificationMessage(notification)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(notification.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConsultantSyncManager;