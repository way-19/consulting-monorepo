import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Calendar,
  Truck,
  Plus,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Building
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  file_url: string | null;
  file_size: number | null;
  notes: string | null;
  uploaded_at: string | null;
  created_at: string;
}

interface MailForwardingRequest {
  id: string;
  forwarding_address: string;
  status: string;
  payment_amount: number;
  payment_currency: string;
  notes: string | null;
  created_at: string;
  processed_at: string | null;
  document_name?: string;
}

const ClientMailbox = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [forwardingRequests, setForwardingRequests] = useState<MailForwardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForwardingModal, setShowForwardingModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [forwardingForm, setForwardingForm] = useState({
    address: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchMailboxData();
    }
  }, [user, profile]);

  const fetchMailboxData = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        console.error('Error fetching client data:', clientError);
        return;
      }

      console.log('Client mailbox - consultant ID:', clientData.assigned_consultant_id);

      // Verify consultant exists if assigned
      if (clientData.assigned_consultant_id) {
        const { data: consultantData, error: consultantError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('id', clientData.assigned_consultant_id)
          .eq('role', 'consultant')
          .eq('is_active', true)
          .single();

        if (consultantError || !consultantData) {
          console.log('Consultant info:', consultantData?.full_name);
        }
      }

      // Fetch documents uploaded by consultant (avoiding relationship issues)
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .not('consultant_id', 'is', null)
        .order('uploaded_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
      } else {
        setDocuments(docsData || []);
      }

      // Fetch mail forwarding requests (separate query to avoid relationship issues)
      const { data: forwardingData, error: forwardingError } = await supabase
        .from('mail_forwarding_requests')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (forwardingError) {
        console.error('Error fetching forwarding requests:', forwardingError);
      } else {
        // Enrich forwarding requests with document names (separate queries)
        const enrichedRequests = await Promise.all(
          (forwardingData || []).map(async (request) => {
            if (request.document_id) {
              const { data: docData } = await supabase
                .from('documents')
                .select('name')
                .eq('id', request.document_id)
                .single();
              
              return {
                ...request,
                document_name: docData?.name || 'Unknown Document'
              };
            }
            return request;
          })
        );
        
        setForwardingRequests(enrichedRequests);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestForwarding = async (documentId: string) => {
    setSelectedDocumentId(documentId);
    setShowForwardingModal(true);
  };

  const submitForwardingRequest = async () => {
    if (!forwardingForm.address.trim() || !selectedDocumentId) {
      alert('Please provide a forwarding address');
      return;
    }

    try {
      setSubmitting(true);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create forwarding request
      const { data: forwardingRequest, error: forwardingError } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          document_id: selectedDocumentId,
          forwarding_address: forwardingForm.address,
          notes: forwardingForm.notes,
          payment_amount: 15.00,
          payment_currency: 'USD',
          status: 'pending'
        })
        .select()
        .single();

      if (forwardingError) {
        throw forwardingError;
      }

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            mail_forwarding_request_id: forwardingRequest.id,
            amount: 1500, // $15 in cents
            currency: 'usd',
            title: 'Mail Forwarding Service',
            description: `Forward document to ${forwardingForm.address}`,
            success_url: `${window.location.origin}/mailbox?forwarding=success`,
            cancel_url: `${window.location.origin}/mailbox?forwarding=cancelled`
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      // Redirect to Stripe Checkout
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'mail_forwarding_requested',
          description: `Requested mail forwarding to: ${forwardingForm.address}`,
          payload: { 
            document_id: selectedDocumentId,
            forwarding_address: forwardingForm.address,
            amount: 15.00
          }
        });

    } catch (err) {
      console.error('Forwarding request error:', err);
      alert('Failed to create forwarding request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'business': return '🏢';
      case 'legal': return '⚖️';
      case 'identity': return '🆔';
      case 'financial': return '💰';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalDocuments = documents.length;
  const newThisWeek = documents.filter(doc => {
    const uploadDate = new Date(doc.uploaded_at || doc.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate >= weekAgo;
  }).length;
  const forwardRequests = forwardingRequests.length;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Virtual Mailbox - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
        <title>Virtual Mailbox - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
          <p className="text-gray-600 mt-1">Access your company documents and manage physical mail forwarding</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-blue-600">{totalDocuments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-3xl font-bold text-green-600">{newThisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Forward Requests</p>
                <p className="text-3xl font-bold text-orange-600">{forwardRequests}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="legal">Legal</option>
              <option value="financial">Financial</option>
              <option value="identity">Identity</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Company Documents Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Company Documents</h2>
            <p className="text-sm text-gray-600">Important documents uploaded by your consultant</p>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{doc.type}</span>
                          {doc.category && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{doc.category}</span>
                            </>
                          )}
                          {doc.file_size && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>
                            {doc.uploaded_at 
                              ? new Date(doc.uploaded_at).toLocaleDateString()
                              : new Date(doc.created_at).toLocaleDateString()
                            }
                          </span>
                        </div>
                        {doc.notes && (
                          <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                            {doc.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {doc.file_url && (
                        <>
                          <button 
                            onClick={() => window.open(doc.file_url!, '_blank')}
                            className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Preview document"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </button>
                          <button 
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = doc.file_url!;
                              a.download = doc.name;
                              a.click();
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Download document"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                          <button 
                            onClick={() => handleRequestForwarding(doc.id)}
                            className="inline-flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            title="Request physical mail forwarding"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Forward Mail ($15)
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 mb-6">
                Your consultant will upload important documents here. Company certificates, 
                legal documents, and other important paperwork will appear in your virtual mailbox.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">📮 Virtual Mailbox</h4>
                <p className="text-xs text-blue-800">
                  All your important business documents are stored securely here. You can preview, 
                  download, or request physical mail forwarding for any document.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mail Forwarding Requests */}
        {forwardingRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mail Forwarding Requests</h2>
              <p className="text-sm text-gray-600">Track your physical mail forwarding requests</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {forwardingRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Mail Forwarding Request
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>To: {request.forwarding_address}</span>
                          <span>•</span>
                          <span>${request.payment_amount} {request.payment_currency}</span>
                          <span>•</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                        {request.document_name && (
                          <p className="text-sm text-blue-600">Document: {request.document_name}</p>
                        )}
                        {request.notes && (
                          <p className="text-sm text-gray-600 mt-1">{request.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mail Forwarding Modal */}
        {showForwardingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xs max-h-[70vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Request Mail Forwarding
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                We'll send this document to your physical address for $15 (includes international shipping)
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Forwarding Address *
                  </label>
                  <textarea
                    value={forwardingForm.address}
                    onChange={(e) => setForwardingForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter complete mailing address including country..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={forwardingForm.notes}
                    onChange={(e) => setForwardingForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special delivery instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-3 h-3 text-orange-600" />
                    <span className="text-xs font-semibold text-orange-900">Payment Details</span>
                  </div>
                  <p className="text-xs text-orange-800">
                    <strong>Cost:</strong> $15 USD (includes international shipping)<br />
                    <strong>Payment:</strong> Secure payment via Stripe<br />
                    <strong>Delivery:</strong> 5-10 business days
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => {
                    setShowForwardingModal(false);
                    setSelectedDocumentId(null);
                    setForwardingForm({ address: '', notes: '' });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitForwardingRequest}
                  disabled={submitting || !forwardingForm.address.trim()}
                  className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors text-sm"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3 h-3 mr-1 inline" />
                      Pay $15 & Forward
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientMailbox;