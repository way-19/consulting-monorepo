import { useState, useEffect } from 'react';
import { Search, Download, Check, X, Upload, Eye, FileText, Calendar, User, RefreshCw, Building } from 'lucide-react';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: string;
}

interface Document {
  id: string;
  name: string;
  document_type: 'accounting' | 'official';
  category: string;
  status: string;
  file_path: string;
  file_size: number | null;
  notes: string | null;
  amount: number | null;
  currency: string | null;
  transaction_date: string | null;
  uploaded_at: string;
  company_name: string;
  client_name: string;
}

const ConsultantDocuments = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'accounting' | 'official'>('accounting');
  const [uploadingFile, setUploadingFile] = useState(false);

  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchClients();
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [selectedClientId, activeTab]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      const response = await authFetch('/api/clients', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingDocuments(true);
      
      const queryParams = new URLSearchParams({
        document_type: activeTab,
        page: '1',
        limit: '100'
      });

      if (selectedClientId && selectedClientId !== 'all') {
        queryParams.append('client_id', selectedClientId);
      }

      const response = await authFetch(`/api/documents?${queryParams}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClientSearch = selectedClientId === 'all' 
      ? (doc.client_name?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
         doc.company_name?.toLowerCase().includes(clientSearchTerm.toLowerCase()))
      : true;
    
    return matchesSearch && matchesClientSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': 
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedClientId || selectedClientId === 'all') {
      alert('Please select a specific client first');
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('client_id', selectedClientId);
      formData.append('document_type', activeTab);
      formData.append('category', 'general');

      const response = await authFetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      fetchDocuments();
      event.target.value = '';
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(error instanceof Error ? error.message : 'Error uploading document. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleStatusUpdate = async (documentId: string, newStatus: string, notes?: string) => {
    try {
      const response = await authFetch(`/api/documents/${documentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, notes })
      });

      if (!response.ok) {
        throw new Error('Failed to update document status');
      }

      fetchDocuments();
      alert('Document status updated successfully!');
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Error updating document status. Please try again.');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      fetchDocuments();
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting document. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600">Review and manage client documents</p>
          </div>

          {/* Client Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Client
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Clients - View documents from all assigned clients</option>
                  <option value="">Choose a specific client to manage their documents</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={fetchClients}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {!selectedClientId ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a Client
            </h3>
            <p className="text-gray-600">
              Choose a client from the dropdown above to manage their documents
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('accounting')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'accounting'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Accounting Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('official')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'official'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Official Company Documents
                  </button>
                </nav>
              </div>

              {/* Search Bar and Upload */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {selectedClientId !== 'all' ? (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                          id="file-upload"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                        />
                        <label
                          htmlFor="file-upload"
                          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                            uploadingFile
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {uploadingFile ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Document
                            </>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 px-4 py-2 bg-gray-100 rounded-lg">
                        Select a client to upload
                      </div>
                    )}
                  </div>
                  
                  {selectedClientId === 'all' && (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Filter by client name or company..."
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Documents List */}
              <div className="p-6">
                {loadingDocuments ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                              {selectedClientId === 'all' && (
                                <div className="flex items-center space-x-2 ml-auto">
                                  <Building className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 font-medium">
                                    {doc.company_name || doc.client_name}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              {doc.category && (
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {doc.category}
                                </span>
                              )}
                              {doc.file_size && (
                                <span>{formatFileSize(doc.file_size)}</span>
                              )}
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>
                                  {activeTab === 'accounting' && doc.transaction_date 
                                    ? `Transaction: ${new Date(doc.transaction_date).toLocaleDateString()}`
                                    : `Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}`
                                  }
                                </span>
                              </div>
                              {activeTab === 'accounting' && doc.amount && (
                                <span className="font-medium text-green-600">
                                  {formatCurrency(doc.amount, doc.currency || 'EUR')}
                                </span>
                              )}
                            </div>

                            {doc.notes && (
                              <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {doc.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(doc.id, 'approved')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt('Rejection reason:');
                                    if (notes) handleStatusUpdate(doc.id, 'rejected', notes);
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Documents Found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || clientSearchTerm 
                        ? 'No documents match your search criteria'
                        : `No ${activeTab} documents available for this client`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultantDocuments;
