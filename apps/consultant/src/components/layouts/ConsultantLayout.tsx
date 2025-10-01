import React, { useState } from 'react';
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
  Kanban
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import ConsultantSyncManager from '../ConsultantSyncManager';

interface ConsultantLayoutProps {
  children: React.ReactNode;
}

const ConsultantLayout: React.FC<ConsultantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

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
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* User Badge */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-700">Consultant</span>
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

      {/* Sync Manager */}
      <ConsultantSyncManager />
    </div>
  );
};

export default ConsultantLayout;