import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Eye, CreditCard, Wallet } from 'lucide-react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FinancialData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedProjects: number;
  averageProjectValue: number;
  commissionRate: number;
}

interface Transaction {
  id: string;
  type: 'earning' | 'commission' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  client_name?: string;
  project_name?: string;
}

const ConsultantFinancial: React.FC = () => {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, [user, selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        console.error('No authenticated user');
        return;
      }

      // Get consultant profile to get commission rate
      const { data: consultantProfile } = await supabase
        .from('consultants')
        .select('commission_rate')
        .eq('id', currentUser.id)
        .single();

      // Calculate date range based on selected period
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch service orders for this consultant
      const { data: serviceOrders, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          client:clients(first_name, last_name),
          service:services(name)
        `)
        .eq('consultant_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service orders:', error);
        return;
      }

      // Calculate financial metrics
      const allOrders = serviceOrders || [];
      const completedOrders = allOrders.filter(order => order.status === 'completed');
      const pendingOrders = allOrders.filter(order => order.status === 'approved' || order.status === 'in_progress');
      
      // Calculate period-specific orders
      const periodOrders = allOrders.filter(order => 
        new Date(order.created_at) >= startDate
      );
      const periodCompletedOrders = periodOrders.filter(order => order.status === 'completed');

      const totalEarnings = completedOrders.reduce((sum, order) => {
        const commission = (order.total_amount || 0) * ((consultantProfile?.commission_rate || 15) / 100);
        return sum + commission;
      }, 0);

      const monthlyEarnings = periodCompletedOrders.reduce((sum, order) => {
        const commission = (order.total_amount || 0) * ((consultantProfile?.commission_rate || 15) / 100);
        return sum + commission;
      }, 0);

      const pendingPayments = pendingOrders.reduce((sum, order) => {
        const commission = (order.total_amount || 0) * ((consultantProfile?.commission_rate || 15) / 100);
        return sum + commission;
      }, 0);

      const averageProjectValue = completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / completedOrders.length
        : 0;

      const calculatedFinancialData: FinancialData = {
        totalEarnings,
        monthlyEarnings,
        pendingPayments,
        completedProjects: completedOrders.length,
        averageProjectValue,
        commissionRate: consultantProfile?.commission_rate || 15
      };

      // Transform service orders to transactions
      const transformedTransactions: Transaction[] = allOrders.map(order => {
        const commission = (order.total_amount || 0) * ((consultantProfile?.commission_rate || 15) / 100);
        return {
          id: order.id,
          type: 'commission' as const,
          amount: commission,
          description: `Commission from ${order.service?.name || 'service'}`,
          date: order.created_at,
          status: order.status === 'completed' ? 'completed' : 
                  order.status === 'approved' || order.status === 'in_progress' ? 'pending' : 'processing',
          client_name: order.client ? `${order.client.first_name} ${order.client.last_name}` : 'Unknown Client',
          project_name: order.service?.name || 'Service Order'
        };
      });

      setFinancialData(calculatedFinancialData);
      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return <DollarSign className="w-4 h-4" />;
      case 'commission':
        return <TrendingUp className="w-4 h-4" />;
      case 'bonus':
        return <Wallet className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Track your earnings and financial performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData?.totalEarnings || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData?.monthlyEarnings || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8.2% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData?.pendingPayments || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">{financialData?.completedProjects || 0} completed projects</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Project Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData?.averageProjectValue || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">{financialData?.commissionRate || 0}% commission rate</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>View All</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        transaction.type === 'earning' ? 'bg-green-100 text-green-600' :
                        transaction.type === 'commission' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getTypeIcon(transaction.type)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                      {transaction.project_name && (
                        <div className="text-sm text-gray-500">{transaction.project_name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.client_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultantFinancial;