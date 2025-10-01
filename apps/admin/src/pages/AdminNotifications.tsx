import React, { useState, useEffect } from 'react';
import { Bell, DollarSign, MessageSquare, TrendingUp, LogOut, Users, Percent, Settings } from 'lucide-react';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';

interface SalesNotification {
  id: string;
  type: string;
  payload: any;
  created_at: string;
}

interface ConsultantCommission {
  consultant_id: string;
  consultant_name: string;
  total_sales: number;
  commission_rate: number;
  commission_amount: number;
  pending_commission: number;
}

interface RevenueStats {
  totalSystemRevenue: number;
  totalConsultantCommissions: number;
  totalRevenue: number;
  systemRevenuePercentage: number;
  consultantRevenuePercentage: number;
  averageCommissionRate: number;
}

const AdminNotifications = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<SalesNotification[]>([]);
  const [consultantCommissions, setConsultantCommissions] = useState<ConsultantCommission[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalSystemRevenue: 0,
    totalConsultantCommissions: 0,
    totalRevenue: 0,
    systemRevenuePercentage: 35,
    consultantRevenuePercentage: 65,
    averageCommissionRate: 65
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    activeMessages: 0,
    activeConsultants: 0
  });
  const [loading, setLoading] = useState(true);
  const [commissionRates, setCommissionRates] = useState<{[key: string]: number}>({});

  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    fetchConsultantCommissions();
    fetchRevenueStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await authFetch('/api/admin/notifications?limit=20', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authFetch('/api/admin/stats', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const response = await authFetch('/api/admin/revenue-stats', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch revenue stats');
      }

      const data = await response.json();
      setRevenueStats(data.revenueStats);
    } catch (err) {
      console.error('Error fetching revenue stats:', err);
    }
  };

  const fetchConsultantCommissions = async () => {
    try {
      const response = await authFetch('/api/admin/consultant-commissions', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch consultant commissions');
      }

      const data = await response.json();
      setConsultantCommissions(data.consultantCommissions || []);

      const rates: {[key: string]: number} = {};
      data.consultantCommissions?.forEach((c: ConsultantCommission) => {
        rates[c.consultant_id] = c.commission_rate;
      });
      setCommissionRates(rates);
    } catch (err) {
      console.error('Error fetching consultant commissions:', err);
    }
  };

  const handleCommissionRateUpdate = async (consultantId: string, newRate: number) => {
    try {
      const response = await authFetch(`/api/admin/consultant-commissions/${consultantId}`, {
        method: 'PATCH',
        body: JSON.stringify({ commission_rate: newRate })
      });

      if (!response.ok) {
        throw new Error('Failed to update commission rate');
      }

      alert('Commission rate updated successfully!');
      fetchConsultantCommissions();
      fetchRevenueStats();
    } catch (err) {
      console.error('Error updating commission rate:', err);
      alert('Failed to update commission rate');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'service_purchase':
      case 'payment_received':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'message_sent':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'invoice_created':
        return <Bell className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationTitle = (type: string, payload: any) => {
    switch (type) {
      case 'service_purchase':
        return 'New Service Purchase';
      case 'payment_received':
        return 'Payment Received';
      case 'message_sent':
        return 'New Message';
      case 'invoice_created':
        return 'Invoice Created';
      default:
        return 'Notification';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalSales)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalCommissions)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.activeMessages}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Consultants</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.activeConsultants}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Revenue Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">System Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(revenueStats.totalSystemRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {revenueStats.systemRevenuePercentage.toFixed(1)}% of total
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Consultant Commissions</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueStats.totalConsultantCommissions)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {revenueStats.consultantRevenuePercentage.toFixed(1)}% of total
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(revenueStats.totalRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Avg. Commission: {revenueStats.averageCommissionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Consultant Commissions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Percent className="w-5 h-5 mr-2" />
            Consultant Commissions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultantCommissions.map((commission) => (
                  <tr key={commission.consultant_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {commission.consultant_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(commission.total_sales)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={commissionRates[commission.consultant_id] || commission.commission_rate}
                          onChange={(e) => setCommissionRates({
                            ...commissionRates,
                            [commission.consultant_id]: parseFloat(e.target.value)
                          })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(commission.commission_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-orange-600">
                        {formatCurrency(commission.pending_commission)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleCommissionRateUpdate(
                          commission.consultant_id,
                          commissionRates[commission.consultant_id] || commission.commission_rate
                        )}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getNotificationTitle(notification.type, notification.payload)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
