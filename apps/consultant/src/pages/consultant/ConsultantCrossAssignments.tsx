import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, XCircle, Clock, AlertCircle, Globe, 
  DollarSign, User, MapPin, Calendar, Send, Inbox
} from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface CrossAssignment {
  id: string;
  service_description: string;
  estimated_price: number | null;
  status: string;
  target_country_code: string;
  client_name: string;
  client_email: string;
  client_company: string;
  referring_consultant_name?: string;
  referring_consultant_email?: string;
  referring_country_code?: string;
  target_consultant_name?: string;
  target_consultant_email?: string;
  target_country_code_display?: string;
  rejection_reason?: string | null;
  created_at: string;
  approved_at?: string | null;
  rejected_at?: string | null;
}

const ConsultantCrossAssignments = () => {
  const [receivedAssignments, setReceivedAssignments] = useState<CrossAssignment[]>([]);
  const [sentAssignments, setSentAssignments] = useState<CrossAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        authFetch('/api/cross-assignments/received'),
        authFetch('/api/cross-assignments/sent')
      ]);

      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setReceivedAssignments(data.assignments || []);
      }

      if (sentRes.ok) {
        const data = await sentRes.json();
        setSentAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (assignmentId: string) => {
    if (!confirm('Approve this cross-country service request?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/cross-assignments/${assignmentId}/approve`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve assignment');
      }

      alert('Assignment approved successfully!');
      await fetchAssignments();
    } catch (error: any) {
      console.error('Error approving assignment:', error);
      alert(error.message || 'Failed to approve assignment');
    }
  };

  const handleRejectSubmit = async (assignmentId: string) => {
    try {
      const response = await authFetch(`/api/cross-assignments/${assignmentId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject assignment');
      }

      alert('Assignment rejected.');
      setRejectingId(null);
      setRejectionReason('');
      await fetchAssignments();
    } catch (error: any) {
      console.error('Error rejecting assignment:', error);
      alert(error.message || 'Failed to reject assignment');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4" />
      },
      approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-4 h-4" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-gray-100 text-gray-800',
        icon: <AlertCircle className="w-4 h-4" />
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Cross-Country Assignments - Consultant Portal</title>
        </Helmet>
        
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cross-Country Assignments - Consultant Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cross-Country Assignments</h1>
            <p className="text-gray-600 mt-1">
              Collaborate with consultants in other countries and earn referral commissions
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'received'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Inbox className="w-4 h-4" />
                  <span>Received Requests</span>
                  {receivedAssignments.filter(a => a.status === 'pending').length > 0 && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {receivedAssignments.filter(a => a.status === 'pending').length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sent'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Sent Requests</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Received Assignments */}
          {activeTab === 'received' && (
            <div className="space-y-6">
              {receivedAssignments.length > 0 ? (
                receivedAssignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {assignment.service_description}
                          </h3>
                          {getStatusBadge(assignment.status)}
                        </div>
                      </div>
                      {assignment.estimated_price && (
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-600">Estimated</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${assignment.estimated_price.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Client:</strong> {assignment.client_name}
                            {assignment.client_company && ` (${assignment.client_company})`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Referring Consultant:</strong> {assignment.referring_consultant_name} ({assignment.referring_country_code})
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Requested:</strong> {new Date(assignment.created_at).toLocaleString()}
                          </span>
                        </div>
                        {assignment.approved_at && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span>
                              <strong>Approved:</strong> {new Date(assignment.approved_at).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {assignment.rejected_at && (
                          <div className="flex items-center text-sm text-red-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            <span>
                              <strong>Rejected:</strong> {new Date(assignment.rejected_at).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {assignment.rejection_reason && (
                      <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-900">
                          <strong>Rejection Reason:</strong> {assignment.rejection_reason}
                        </p>
                      </div>
                    )}

                    {assignment.status === 'pending' && (
                      <div className="border-t border-gray-200 pt-4">
                        {rejectingId === assignment.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Optionally provide a reason for rejection..."
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            />
                            <div className="flex space-x-3">
                              <button
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectionReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleRejectSubmit(assignment.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirm Rejection
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setRejectingId(assignment.id)}
                              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(assignment.id)}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Request
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {assignment.status === 'approved' && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-900">
                            <strong>✓ Approved:</strong> You can now work with this client. 
                            The referring consultant will earn a 15% commission on your services.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Received Requests
                  </h3>
                  <p className="text-gray-600">
                    You haven't received any cross-country service requests yet
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sent Assignments */}
          {activeTab === 'sent' && (
            <div className="space-y-6">
              {sentAssignments.length > 0 ? (
                sentAssignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {assignment.service_description}
                          </h3>
                          {getStatusBadge(assignment.status)}
                        </div>
                      </div>
                      {assignment.estimated_price && (
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-600">Estimated</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${assignment.estimated_price.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Client:</strong> {assignment.client_name}
                            {assignment.client_company && ` (${assignment.client_company})`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Target Country:</strong> {assignment.target_country_code}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Target Consultant:</strong> {assignment.target_consultant_name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            <strong>Sent:</strong> {new Date(assignment.created_at).toLocaleString()}
                          </span>
                        </div>
                        {assignment.status === 'approved' && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-green-600">
                              <strong>Commission Rate:</strong> 15%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {assignment.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-900">
                          <strong>Rejection Reason:</strong> {assignment.rejection_reason}
                        </p>
                      </div>
                    )}

                    {assignment.status === 'approved' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-900">
                          <strong>✓ Approved:</strong> The consultant has accepted this request. 
                          You will earn a 15% commission on services provided to this client.
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Sent Requests
                  </h3>
                  <p className="text-gray-600">
                    You haven't sent any cross-country service requests yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultantCrossAssignments;
