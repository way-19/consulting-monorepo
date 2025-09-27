import { useState, useEffect } from 'react';
import { Search, Download, Check, X, Upload, Eye, FileText, Calendar, User, RefreshCw, Building } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: string;
  user_profiles: {
    first_name?: string;
    last_name?: string;
    full_name?: string; // Keep for backward compatibility
    email: string;
  } | null;
}

interface Document {
  id: string;
  name: string;
  type: 'accounting' | 'official';
  category: string;
  status: string;
  file_path: string;
  file_size: number | null;
  notes: string | null;
  amount: number | null;
  currency: string | null;
  transaction_date: string | null;
  uploaded_at: string;
  client: {
    id: string;
    first_name?: string;
    last_name?: string;
    full_name?: string; // Keep for backward compatibility
    company_name: string;
  };
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

  // Upload button component to avoid duplication
  const UploadButton = ({ id, className = "" }: { id: string; className?: string }) => (
    <div className="relative">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        className="hidden"
        id={id}
        onChange={handleFileUpload}
        disabled={uploadingFile || selectedClientId === 'all'}
      />
      <label
        htmlFor={id}
        className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
          uploadingFile || selectedClientId === 'all'
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${className}`}
      >
        {uploadingFile ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload {activeTab === 'accounting' ? 'Accounting' : 'Official'} Document
          </>
        )}
      </label>
    </div>
  );

  useEffect(() => {
    fetchClients();
  }, [user]);

  useEffect(() => {
    if (selectedClientId === 'all') {
      fetchAllDocuments();
    } else if (selectedClientId) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [selectedClientId, activeTab]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Get consultant's assigned clients
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          profile_id,
          company_name,
          status,
          user_profiles!clients_profile_id_fkey(
            full_name,
            email
          )
        `)
        .eq('assigned_consultant_id', user.id)
        .eq('status', 'active')
        .order('company_name');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedClients = clientsData?.map(client => ({
        ...client,
        user_profiles: Array.isArray(client.user_profiles) 
          ? client.user_profiles[0] || null 
          : client.user_profiles
      })) || [];
      
      setClients(transformedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDocuments = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingDocuments(true);

      // Get consultant profile
      const { data: consultantProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('role', 'consultant')
        .single();

      if (profileError || !consultantProfile) {
        console.error('Consultant profile not found:', profileError);
        setLoadingDocuments(false);
        return;
      }

      // Get consultant's assigned clients through service_orders
      const { data: serviceOrders, error: ordersError } = await supabase
        .from('service_orders')
        .select('client_id')
        .eq('consultant_id', consultantProfile.id);

      if (ordersError) {
        console.error('Error fetching service orders:', ordersError);
        setLoadingDocuments(false);
        return;
      }

      const assignedClientIds = serviceOrders?.map(order => order.client_id) || [];

      if (assignedClientIds.length === 0) {
        setDocuments([]);
        setLoadingDocuments(false);
        return;
      }

      // Build query for documents from all assigned clients
      let query = supabase
        .from('documents')
        .select(`
          *,
          client:clients(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .in('client_id', assignedClientIds);

      // Filter by document type based on active tab
      if (activeTab === 'accounting') {
        query = query.eq('document_type', 'accounting');
      } else {
        query = query.eq('document_type', 'official');
      }

      // Order by upload date
      query = query.order('uploaded_at', { ascending: false });

      const { data: documentsData, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      // Transform data to match interface
      const transformedDocuments = documentsData?.map(doc => ({
        ...doc,
        client: {
          id: doc.client?.id || '',
          full_name: doc.client?.profile?.full_name || '',
          company_name: doc.client?.company_name || ''
        }
      })) || [];

      setDocuments(transformedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const fetchDocuments = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingDocuments(true);
      
      if (!selectedClientId) return;

      // Get consultant profile
      const { data: consultantProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .eq('role', 'consultant')
        .single();

      if (profileError || !consultantProfile) {
        console.error('Consultant profile not found:', profileError);
        setLoadingDocuments(false);
        return;
      }

      // Get consultant's assigned clients through service_orders
      const { data: serviceOrders, error: ordersError } = await supabase
        .from('service_orders')
        .select('client_id')
        .eq('consultant_id', consultantProfile.id);

      if (ordersError) {
        console.error('Error fetching service orders:', ordersError);
        setLoadingDocuments(false);
        return;
      }

      const assignedClientIds = serviceOrders?.map(order => order.client_id) || [];

      if (assignedClientIds.length === 0 || !assignedClientIds.includes(selectedClientId)) {
        setDocuments([]);
        setLoadingDocuments(false);
        return;
      }

      // Build query for documents
      let query = supabase
        .from('documents')
        .select(`
          *,
          client:clients(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('client_id', selectedClientId);

      // Filter by document type based on active tab
      if (activeTab === 'accounting') {
        query = query.eq('document_type', 'accounting');
      } else {
        query = query.eq('document_type', 'official');
      }

      // Order by upload date
      query = query.order('uploaded_at', { ascending: false });

      const { data: documentsData, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      // Transform data to match interface
      const transformedDocuments = documentsData?.map(doc => ({
        ...doc,
        client: {
          id: doc.client?.id || '',
          full_name: doc.client?.profile?.full_name || '',
          company_name: doc.client?.company_name || ''
        }
      })) || [];

      setDocuments(transformedDocuments);
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
      ? (doc.client.full_name?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
         doc.client.company_name.toLowerCase().includes(clientSearchTerm.toLowerCase()))
      : true;
    
    return matchesSearch && matchesClientSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
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
    if (!file || !selectedClientId) {
      alert('Please select a client first');
      return;
    }

    setUploadingFile(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${selectedClientId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Determine document type based on active tab
      const documentType = activeTab === 'accounting' ? 'accounting' : 'official';
      
      // For accounting documents, try to extract amount from filename or set default
      let documentData: any = {
        client_id: selectedClientId,
        consultant_id: user?.id,
        document_type: documentType,
        category: 'general',
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending',
        uploaded_by: user?.id
      };

      // If it's an accounting document, add financial fields
      if (documentType === 'accounting') {
        documentData = {
          ...documentData,
          amount: 0, // Default amount, can be updated later
          currency: 'EUR',
          transaction_date: new Date().toISOString().split('T')[0],
          category: 'other' // Default category
        };
      }

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert(documentData);

      if (dbError) throw dbError;

      // Refresh documents list
      fetchDocuments();
      
      // Reset file input
      event.target.value = '';
      
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const selectedClient = clients.find(client => client.id === selectedClientId);

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600">Review and manage client documents</p>
            </div>
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
                      {client.user_profiles?.full_name} - {client.company_name}
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
        ) : selectedClientId === 'all' ? (
          <>
            {/* All Clients Info */}
             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
               <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                   <User className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                   <h2 className="text-xl font-semibold text-gray-900">
                     All Assigned Clients
                   </h2>
                   <p className="text-gray-600">Viewing documents from all your assigned clients ({clients.length} clients)</p>
                 </div>
               </div>
             </div>

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
                    
                    <div className="text-sm text-gray-500 px-4 py-2 bg-gray-100 rounded-lg">
                      Upload disabled for all clients view
                    </div>
                  </div>
                  
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
                              <div className="flex items-center space-x-2 ml-auto">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600 font-medium">
                                  {doc.client.full_name} - {doc.client.company_name}
                                </span>
                              </div>
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
                              <p className="text-sm text-gray-600">{doc.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </button>
                            <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </button>
                            {doc.status === 'uploaded' && (
                              <>
                                <button className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </button>
                                <button className="inline-flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {activeTab} documents found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {activeTab === 'accounting' 
                        ? 'No accounting documents have been uploaded by your assigned clients yet.'
                        : 'No official documents have been uploaded by your assigned clients yet.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
           </>
        ) : (
          <>
            {/* Selected Client Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedClient?.user_profiles?.full_name}
                  </h2>
                  <p className="text-gray-600">{selectedClient?.company_name}</p>
                </div>
              </div>
            </div>

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
                    
                    <UploadButton id="document-upload-header" />
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
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 font-medium">
                                    {doc.client.full_name} - {doc.client.company_name}
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
                              <p className="text-sm text-gray-600">{doc.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </button>
                            <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </button>
                            {doc.status === 'uploaded' && (
                              <>
                                <button className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </button>
                                <button className="inline-flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {activeTab} documents found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {activeTab === 'accounting' 
                        ? 'No accounting documents have been uploaded by this client yet.'
                        : 'No official documents have been uploaded for this client yet.'
                      }
                    </p>
                    <UploadButton id="document-upload" />
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