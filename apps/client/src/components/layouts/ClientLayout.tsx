import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Users, 
  CheckSquare, 
  FileText, 
  MessageCircle, 
  DollarSign, 
  Calendar, 
  Settings, 
  LogOut, 
  User,
  Bell,
  Globe, 
  ChevronDown,
  Briefcase,
  BarChart3,
  Clock,
  PenTool
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import NotificationCenter from '../NotificationCenter';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const { i18n } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setShowLanguageMenu(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/client', icon: Home, current: location.pathname === '/client' },
    { name: 'Projects', href: '/client/projects', icon: Briefcase, current: location.pathname.startsWith('/client/projects') },
    { name: 'Tasks', href: '/client/tasks', icon: CheckSquare, current: location.pathname === '/client/tasks' },
    { name: 'Documents', href: '/client/documents', icon: FileText, current: location.pathname === '/client/documents' },
    { name: 'Messages', href: '/client/messages', icon: MessageCircle, current: location.pathname === '/client/messages' },
    { name: 'Invoices', href: '/client/invoices', icon: DollarSign, current: location.pathname === '/client/invoices' },
    { name: 'Calendar', href: '/client/calendar', icon: Calendar, current: location.pathname === '/client/calendar' },
    { name: 'Reports', href: '/client/reports', icon: BarChart3, current: location.pathname === '/client/reports' },
    { name: 'Time Tracking', href: '/client/time-tracking', icon: Clock, current: location.pathname === '/client/time-tracking' },
    { name: 'Support', href: '/client/support', icon: MessageCircle, current: location.pathname === '/client/support' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <PenTool className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Client Portal</span>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              
              <div className="flex items-center space-x-4">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showLanguageMenu && (
                    <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                            i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          <span className="mr-3">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                  
                  {showNotifications && (
                    <NotificationCenter onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* Settings */}
                <Link
                  to="/client/settings"
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;