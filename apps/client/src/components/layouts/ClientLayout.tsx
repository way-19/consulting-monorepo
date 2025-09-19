import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Briefcase, 
  MessageSquare, 
  Clock, 
  Calendar,
  CreditCard, 
  BarChart3, 
  FileText, 
  Mail, 
  TrendingUp, 
  HelpCircle, 
  Settings, 
  LogOut,
  User,
  Bell
} from 'lucide-react';

const ClientLayout = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/client/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/client/tasks', icon: CheckSquare },
    { name: 'Services', href: '/client/services', icon: Briefcase },
    { name: 'Messages', href: '/client/messages', icon: MessageSquare },
    { name: 'Meetings', href: '/client/meetings', icon: Calendar },
    { name: 'Calendar', href: '/client/calendar', icon: Clock },
    { name: 'Billing', href: '/client/billing', icon: CreditCard },
    { name: 'Reports', href: '/client/accounting', icon: BarChart3 },
    { name: 'Documents', href: '/client/file-manager', icon: FileText },
    { name: 'Mailbox', href: '/client/mailbox', icon: Mail },
    { name: 'Progress', href: '/client/progress', icon: TrendingUp },
    { name: 'Support', href: '/client/support', icon: HelpCircle },
    { name: 'Settings', href: '/client/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C19</span>
            </div>
            <span className="font-semibold text-gray-900">Client Portal</span>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Client Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option>🇺🇸 English</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  🤖 AI Assistant
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Bell className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;