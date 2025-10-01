import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, 
  Package, 
  FileText, 
  Truck, 
  Scan, 
  Archive, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface MailItem {
  id: string;
  tracking_number: string | null;
  sender: string;
  received_date: string;
  mail_type: string;
  description: string | null;
  status: string;
  scan_url: string | null;
  forward_address: string | null;
  forward_requested_at: string | null;
  forward_completed_at: string | null;
  notes: string | null;
}

const ClientMailbox = () => {
  const [mailItems, setMailItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [forwardAddress, setForwardAddress] = useState('');
  const [showForwardModal, setShowForwardModal] = useState<string | null>(null);
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchMailItems();
  }, []);

  const fetchMailItems = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/api/mailbox', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mail items');
      }

      const data = await response.json();
      setMailItems(data.mailItems || []);
    } catch (err: any) {
      console.error('Error fetching mail items:', err);
      setError(err.message || 'Failed to load mail items');
    } finally {
      setLoading(false);
    }
  };

  const requestScan = async (mailId: string) => {
    try {
      setActionLoading(mailId);
      const response = await authFetch(`/api/mailbox/${mailId}/request-scan`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request scan');
      }

      const data = await response.json();
      
      // Update mail item in state
      setMailItems(prev => prev.map(item => 
        item.id === mailId ? data.mailItem : item
      ));

      alert('Scan request submitted successfully! You will be notified when the scan is ready.');
    } catch (err: any) {
      console.error('Error requesting scan:', err);
      alert(err.message || 'Failed to request scan');
    } finally {
      setActionLoading(null);
    }
  };

  const requestForward = async (mailId: string) => {
    if (!forwardAddress.trim()) {
      alert('Please enter a valid forward address');
      return;
    }

    try {
      setActionLoading(mailId);
      const response = await authFetch(`/api/mailbox/${mailId}/request-forward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ forward_address: forwardAddress })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request forward');
      }

      const data = await response.json();
      
      // Update mail item in state
      setMailItems(prev => prev.map(item => 
        item.id === mailId ? data.mailItem : item
      ));

      setShowForwardModal(null);
      setForwardAddress('');
      alert('Forward request submitted successfully! Your mail will be forwarded soon.');
    } catch (err: any) {
      console.error('Error requesting forward:', err);
      alert(err.message || 'Failed to request forward');
    } finally {
      setActionLoading(null);
    }
  };

  const archiveItem = async (mailId: string) => {
    if (!confirm('Are you sure you want to archive this mail item?')) {
      return;
    }

    try {
      setActionLoading(mailId);
      const response = await authFetch(`/api/mailbox/${mailId}/archive`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to archive mail item');
      }

      const data = await response.json();
      
      // Update mail item in state
      setMailItems(prev => prev.map(item => 
        item.id === mailId ? data.mailItem : item
      ));
    } catch (err: any) {
      console.error('Error archiving mail item:', err);
      alert(err.message || 'Failed to archive mail item');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      received: { color: 'blue', icon: Mail, label: 'Received' },
      pending_scan: { color: 'yellow', icon: Clock, label: 'Scan Pending' },
      scanned: { color: 'green', icon: CheckCircle2, label: 'Scanned' },
      pending_forward: { color: 'purple', icon: Clock, label: 'Forward Pending' },
      forwarded: { color: 'green', icon: Truck, label: 'Forwarded' },
      archived: { color: 'gray', icon: Archive, label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.received;
    const Icon = config.icon;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[config.color as keyof typeof colorClasses]}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getMailTypeIcon = (type: string) => {
    switch (type) {
      case 'package':
        return <Package className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Virtual Mailbox - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
          <p className="text-gray-600 mt-1">Manage your company mail and forwarding requests</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Mail Items List */}
        {mailItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mail Items</h3>
            <p className="text-gray-600">
              You don't have any mail items yet. Mail received at your virtual address will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mailItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {getMailTypeIcon(item.mail_type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.mail_type.charAt(0).toUpperCase() + item.mail_type.slice(1)} from {item.sender}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Received: {new Date(item.received_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {item.tracking_number && (
                        <p className="text-sm text-gray-500">
                          Tracking: <span className="font-mono">{item.tracking_number}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {item.description && (
                  <p className="text-gray-700 mb-4">{item.description}</p>
                )}

                {/* Scanned Document */}
                {item.scan_url && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Scan Available</span>
                      </div>
                      <a 
                        href={item.scan_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-700 hover:text-green-900"
                      >
                        View Scan <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Forward Info */}
                {item.forward_address && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Truck className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Forwarding To:</span>
                    </div>
                    <p className="text-sm text-purple-700 ml-7">{item.forward_address}</p>
                    {item.forward_completed_at && (
                      <p className="text-xs text-purple-600 ml-7 mt-1">
                        Completed: {new Date(item.forward_completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {item.status === 'received' && (
                    <>
                      <button
                        onClick={() => requestScan(item.id)}
                        disabled={actionLoading === item.id}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Scan className="w-4 h-4 mr-2" />
                        {actionLoading === item.id ? 'Processing...' : 'Request Scan'}
                      </button>
                      <button
                        onClick={() => setShowForwardModal(item.id)}
                        disabled={actionLoading === item.id}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Request Forward
                      </button>
                    </>
                  )}
                  
                  {['scanned', 'forwarded'].includes(item.status) && (
                    <button
                      onClick={() => archiveItem(item.id)}
                      disabled={actionLoading === item.id}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      {actionLoading === item.id ? 'Archiving...' : 'Archive'}
                    </button>
                  )}
                </div>

                {/* Notes */}
                {item.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 whitespace-pre-wrap">{item.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Forward Modal */}
        {showForwardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Mail Forwarding</h3>
              <p className="text-gray-600 mb-4">
                Enter the address where you'd like this mail forwarded:
              </p>
              
              <textarea
                value={forwardAddress}
                onChange={(e) => setForwardAddress(e.target.value)}
                placeholder="123 Main St, City, State, ZIP, Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                rows={4}
              />

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => requestForward(showForwardModal)}
                  disabled={actionLoading === showForwardModal || !forwardAddress.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === showForwardModal ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => {
                    setShowForwardModal(null);
                    setForwardAddress('');
                  }}
                  disabled={actionLoading === showForwardModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
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
