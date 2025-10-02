import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  DollarSign, 
  Calendar, 
  RefreshCw,
  ChevronDown,
  Eye,
  Download
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  amount: number;
  currency: string;
  transaction_date: string;
  status: string;
  uploaded_at: string;
  file_url: string;
}

interface AccountingStats {
  totalDocuments: number;
  totalAmount: number;
  pendingReview: number;
  thisMonth: number;
}

const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<AccountingStats>({
    totalDocuments: 0,
    totalAmount: 0,
    pendingReview: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState('Newest First');

  useEffect(() => {
    if (user && profile) {
      fetchAccountingDocuments();
    }
  }, [user, profile]);

  const fetchAccountingDocuments = async () => {
    try {
      setLoading(true);
      const authFetch = createAuthenticatedFetch();
      
      // Fetch financial documents from backend API
      const response = await authFetch('/api/documents?document_type=financial');
      
      if (!response.ok) {
        console.error('Error fetching documents:', response.statusText);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const documentsList = data.documents || [];
      setDocuments(documentsList);

      // Calculate stats
      const totalDocuments = documentsList.length;
      const totalAmount = documentsList.reduce((sum: number, doc: Document) => sum + (doc.amount || 0), 0);
      const pendingReview = documentsList.filter((doc: Document) => doc.status === 'pending').length;
      
      // This month documents
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);
      const thisMonth = documentsList.filter((doc: Document) => 
        new Date(doc.uploaded_at) >= thisMonthStart
      ).length;

      setStats({
        totalDocuments,
        totalAmount,
        pendingReview,
        thisMonth
      });

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Accounting - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-16 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
        <title>Accounting - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Accounting</h1>
            <p className="text-gray-600 mt-1">Submit your monthly financial documents</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
                <p className="text-sm text-blue-600 mt-1">All financial docs</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">Financial value</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingReview}</p>
                <p className="text-sm text-orange-600 mt-1">Awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
                <p className="text-sm text-purple-600 mt-1">Recent uploads</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option>All Categories</option>
                  <option>Income Statements</option>
                  <option>Balance Sheets</option>
                  <option>Tax Documents</option>
                  <option>Bank Statements</option>
                  <option>Receipts</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Amount High to Low</option>
                  <option>Amount Low to High</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Financial Documents</h2>
            <button 
              onClick={fetchAccountingDocuments}
              className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>${doc.amount?.toLocaleString() || '0'} {doc.currency}</span>
                          <span>{new Date(doc.transaction_date || doc.uploaded_at).toLocaleDateString()}</span>
                          <span className="capitalize">{doc.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {doc.file_url && (
                        <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Financial Documents</h3>
              <p className="text-gray-600 mb-6">
                Upload your monthly financial documents to keep your accounting up to date.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Document
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientAccounting;