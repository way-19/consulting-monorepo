import React from 'react';
import { Users, Globe, FileText, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Card } from '@consulting19/shared';

const AdminDashboard = () => {
  const statCards = [
    {
      title: 'Total Users',
      value: '0',
      icon: Users,
      color: 'blue',
      description: 'All platform users',
    },
    {
      title: 'Active Countries',
      value: '0',
      icon: Globe,
      color: 'green',
      description: 'Supported jurisdictions',
    },
    {
      title: 'Content Pages',
      value: '0',
      icon: FileText,
      color: 'purple',
      description: 'Published content',
    },
    {
      title: 'Monthly Revenue',
      value: '$0',
      icon: DollarSign,
      color: 'green',
      description: 'Platform earnings',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Admin Dashboard!
        </h1>
        <p className="text-gray-600">Platform overview and system management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* System Status */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Response</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Fast
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                75% Used
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;