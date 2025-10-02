import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  CreditCard,
  RefreshCw,
  Eye,
  Download,
  AlertTriangle,
  Calendar,
  Wallet,
  Shield,
  Info
} from 'lucide-react';

interface Invoice {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  memo: string;
  due_date: string;
  paid_at: string;
  created_at: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string;
  payment_type: string;
}

interface BillingStats {
  totalSpent: number;
  pendingPayments: number;
  totalInvoices: number;
}

const ClientBilling = () => {
  const { user, profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<BillingStats>({
    totalSpent: 0,
    pendingPayments: 0,
    totalInvoices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchBillingData();
    }
  }, [user, profile]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const authFetch = createAuthenticatedFetch();
      
      // Fetch invoices from backend API
      const response = await authFetch('/api/orders/invoices');
      
      if (!response.ok) {
        console.error('Error fetching invoices:', response.statusText);
        return;
      }

      const data = await response.json();
      const invoicesList = data.invoices || [];
      setInvoices(invoicesList);

      // Calculate stats
      const totalSpent = invoicesList
        .filter((invoice: Invoice) => invoice.status === 'paid')
        .reduce((sum: number, invoice: Invoice) => sum + Number(invoice.amount_due), 0);
      
      const pendingPayments = invoicesList
        .filter((invoice: Invoice) => invoice.status === 'pending')
        .reduce((sum: number, invoice: Invoice) => sum + Number(invoice.amount_due), 0);
      
      const totalInvoices = invoicesList.length;

      setStats({
        totalSpent,
        pendingPayments,
        totalInvoices
      });

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handlePayNow = (invoice: Invoice) => {
    // Placeholder for Stripe payment integration
    alert(`Payment for invoice ${invoice.id} will be implemented with Stripe integration`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Placeholder for invoice viewing
    alert(`Invoice details for ${invoice.id} will open in a modal or new page`);
  };



  if (loading) {
    return (
      <>
        <Helmet>
          <title>Billing & Payments - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-16 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Billing & Payments - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-1">Manage your payments and billing history</p>
          </div>
          <button 
            onClick={fetchBillingData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600">${stats.pendingPayments.toLocaleString()}</p>
                <p className="text-sm text-yellow-600 mt-1">Awaiting payment</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalInvoices}</p>
                <p className="text-sm text-blue-600 mt-1">All invoices</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Invoices</h2>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{invoices.length}</span>
              </div>
            </div>
          </div>

          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {invoice.memo || `Invoice #${invoice.id.slice(0, 8)}`}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Created: {new Date(invoice.created_at).toLocaleDateString()}</span>
                          </div>
                          {invoice.due_date && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {invoice.paid_at && (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span>Paid: {new Date(invoice.paid_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${Number(invoice.amount_due).toLocaleString()} {invoice.currency}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handlePayNow(invoice)}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
              <p className="text-gray-600 mb-6">
                Your billing history will appear here once you start using our services.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Info className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">How billing works</h4>
                    <p className="text-xs text-blue-800">
                      Invoices are automatically generated when you order services or schedule paid consultations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Secure Payments */}
            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Secure Payments</h3>
                <p className="text-sm text-green-800">
                  All payments are processed securely through Stripe with bank-level encryption.
                </p>
              </div>
            </div>

            {/* Accepted Payment Methods */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Accepted Payment Methods</h3>
                <p className="text-sm text-blue-800">
                  Visa, MasterCard, American Express, and other major cards accepted.
                </p>
              </div>
            </div>

            {/* Invoice Downloads */}
            <div className="flex items-start space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                <Download className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Invoice Downloads</h3>
                <p className="text-sm text-purple-800">
                  Download PDF invoices for your accounting and record-keeping needs.
                </p>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Payment Terms</h3>
                <p className="text-sm text-orange-800">
                  Most invoices are due immediately. Extended payment terms available upon request.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payments Alert */}
        {stats.pendingPayments > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">Outstanding Balance</h3>
                  <p className="text-sm text-yellow-700">
                    You have ${stats.pendingPayments.toLocaleString()} in pending payments that require your attention.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const pendingInvoice = invoices.find(i => i.status === 'pending');
                  if (pendingInvoice) handlePayNow(pendingInvoice);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Payment Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure Payment Processing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    256-bit SSL encryption for all transactions
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    PCI DSS compliant payment processing
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Automatic invoice generation and tracking
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Instant payment confirmation
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Detailed payment history and receipts
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    24/7 billing support available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientBilling;