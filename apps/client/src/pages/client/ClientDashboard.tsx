import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { BarChart3, FileText, CheckSquare, MessageSquare, CreditCard, Settings } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Projects', value: '3', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Pending Tasks', value: '8', icon: CheckSquare, color: 'text-orange-600' },
    { label: 'Documents', value: '12', icon: FileText, color: 'text-green-600' },
    { label: 'Messages', value: '5', icon: MessageSquare, color: 'text-purple-600' },
  ];

  const quickActions = [
    { label: 'View Projects', href: '/projects', icon: BarChart3 },
    { label: 'Upload Document', href: '/documents', icon: FileText },
    { label: 'View Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Billing', href: '/billing', icon: CreditCard },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>Client Dashboard - Consulting19</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.user_metadata?.full_name || 'Client'}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your projects and services</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <action.icon className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;