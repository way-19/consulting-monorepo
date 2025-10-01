import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  MessageCircle, 
  DollarSign, 
  Calendar, 
  Settings, 
  LogOut, 
  User,
  Bell,
  Briefcase,
  BarChart3,
  PenTool,
  Kanban,
  Languages,
  Clock
} from 'lucide-react';
import { useAuth, useLanguage, createAuthenticatedFetch } from '@consulting19/shared';
import type { Notification } from '@consulting19/shared';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

const ConsultantLayout: React.FC<ConsultantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const authenticatedFetch = createAuthenticatedFetch();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Task Board', href: '/tasks/board', icon: Kanban },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Financial', href: '/financial', icon: DollarSign },
    { name: 'Availability', href: '/availability', icon: Calendar },
    { name: 'Cross Assignments', href: '/cross-assignments', icon: BarChart3 },
    { name: 'Content', href: '/content', icon: PenTool },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
      const interval = setInterval(() => {
        loadUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const response = await authenticatedFetch('/api/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await authenticatedFetch('/api/notifications/unread-count');
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await authenticatedFetch(`/api/notifications/${id}/read`, {
        method: 'POST'
      });
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await authenticatedFetch('/api/notifications/read-all', {
        method: 'POST'
      });
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = 'https://consulting19.com';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Consultant</span>
              <div className="text-xs text-gray-500">Business Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.full_name || 
                   (profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : '') ||
                   user?.email?.split('@')[0] || 'Consultant'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-600" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Consultant Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Sync Status */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Sync Active</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notif.is_read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`mt-1 ${notif.is_read ? 'text-gray-400' : 'text-blue-600'}`}>
                                  {notif.type === 'meeting_reminder' ? <Clock className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${notif.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notif.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                {!notif.is_read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Languages className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 uppercase">{language}</span>
                </button>
                
                {showLanguageMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'tr', name: 'Türkçe' },
                        { code: 'pt', name: 'Português' },
                        { code: 'es', name: 'Español' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as 'en' | 'tr' | 'pt' | 'es');
                            setShowLanguageMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            language === lang.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ConsultantLayout;