import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Package, 
  Download, 
  Eye, 
  Forward, 
  Archive, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  MapPin,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Settings,
  CreditCard,
  Globe
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared/contexts/AuthContext';

interface MailItem {
  id: string;
  type: 'letter' | 'package' | 'document';
  sender_name: string;
  sender_address?: string;
  subject?: string;
  received_date: string;
  status: 'received' | 'scanned' | 'forwarded' | 'archived' | 'destroyed';
  priority: 'normal' | 'urgent' | 'registered';
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tracking_number?: string;
  scan_images?: string[];
  forwarding_address?: string;
  forwarding_date?: string;
  forwarding_tracking?: string;
  notes?: string;
  client_id: string;
  virtual_address_id: string;
  created_at: string;
  updated_at: string;
}

interface VirtualAddress {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_active: boolean;
  monthly_fee: number;
  setup_fee: number;
  client_id: string;
  created_at: string;
}

interface ForwardingRequest {
  id: string;
  mail_item_id: string;
  destination_address: string;
  shipping_method: 'standard' | 'express' | 'overnight';
  cost: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  tracking_number?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  created_at: string;
}

const VirtualMailbox: React.FC = () => {
  const { user } = useAuth();
  const [mailItems, setMailItems] = useState<MailItem[]>([]);
  const [virtualAddresses, setVirtualAddresses] = useState<VirtualAddress[]>([]);
  const [forwardingRequests, setForwardingRequests] = useState<ForwardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [forwardingAddress, setForwardingAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
      setupRealtimeSubscription();
    }
    
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [user?.id]);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('mailbox-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'virtual_mail_items',
          filter: `client_id=eq.${user?.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMail = payload.new as MailItem;
            setMailItems(prev => [newMail, ...prev]);
            
            // Show notification for new mail
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Mail Received', {
                body: `You have received mail from ${newMail.sender_name}`,
                icon: '/mail-icon.png'
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMail = payload.new as MailItem;
            setMailItems(prev => prev.map(mail => 
              mail.id === updatedMail.id ? updatedMail : mail
            ));
          }
        }
      )
      .subscribe();

    setRealtimeChannel(channel);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch mail items
      const { data: mailData, error: mailError } = await supabase
        .from('virtual_mail_items')
        .select('*')
        .eq('client_id', user?.id)
        .order('received_date', { ascending: false });

      if (mailError) {
        console.error('Error fetching mail items:', mailError);
      } else {
        setMailItems(mailData || []);
      }

      // Fetch virtual addresses
      const { data: addressData, error: addressError } = await supabase
        .from('virtual_addresses')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (addressError) {
        console.error('Error fetching virtual addresses:', addressError);
      } else {
        setVirtualAddresses(addressData || []);
      }

      // Fetch forwarding requests
      const { data: forwardingData, error: forwardingError } = await supabase
        .from('mail_forwarding_requests')
        .select(`
          *,
          mail_item:virtual_mail_items(*)
        `)
        .eq('mail_item.client_id', user?.id)
        .order('created_at', { ascending: false });

      if (forwardingError) {
        console.error('Error fetching forwarding requests:', forwardingError);
      } else {
        setForwardingRequests(forwardingData || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestForwarding = async () => {
    if (!selectedMail || !forwardingAddress) return;

    try {
      const cost = shippingCosts[shippingMethod];
      
      const { data, error } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          mail_item_id: selectedMail.id,
          destination_address: forwardingAddress,
          shipping_method: shippingMethod,
          cost,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating forwarding request:', error);
        return;
      }

      // Update mail item status
      await supabase
        .from('virtual_mail_items')
        .update({ status: 'forwarded' })
        .eq('id', selectedMail.id);

      // Update local state
      setMailItems(prev => prev.map(mail => 
        mail.id === selectedMail.id ? { ...mail, status: 'forwarded' } : mail
      ));
      
      setForwardingRequests(prev => [data, ...prev]);
      
      // Reset form
      setShowForwardModal(false);
      setSelectedMail(null);
      setForwardingAddress('');
      setShippingMethod('standard');

    } catch (error) {
      console.error('Error requesting forwarding:', error);
    }
  };

  const downloadScan = async (mailItem: MailItem, imageIndex: number) => {
    if (!mailItem.scan_images || !mailItem.scan_images[imageIndex]) return;

    try {
      const { data, error } = await supabase.storage
        .from('mail-scans')
        .download(mailItem.scan_images[imageIndex]);

      if (error) {
        console.error('Error downloading scan:', error);
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mail-scan-${mailItem.id}-${imageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading scan:', error);
    }
  };

  const archiveMail = async (mailId: string) => {
    try {
      const { error } = await supabase
        .from('virtual_mail_items')
        .update({ status: 'archived' })
        .eq('id', mailId);

      if (error) {
        console.error('Error archiving mail:', error);
        return;
      }

      setMailItems(prev => prev.map(mail => 
        mail.id === mailId ? { ...mail, status: 'archived' } : mail
      ));
    } catch (error) {
      console.error('Error archiving mail:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'scanned': return 'bg-green-100 text-green-800';
      case 'forwarded': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'destroyed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'letter': return <Mail className="w-5 h-5" />;
      case 'package': return <Package className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'registered': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const filteredMail = mailItems.filter(mail => {
    const matchesSearch = 
      mail.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || mail.status === statusFilter;
    const matchesType = typeFilter === 'all' || mail.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
            <p className="text-gray-600">Manage your mail and packages remotely</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddressModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Virtual Addresses */}
        {virtualAddresses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Virtual Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {virtualAddresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">{address.address_line_1}</div>
                        {address.address_line_2 && (
                          <div className="text-gray-600">{address.address_line_2}</div>
                        )}
                        <div className="text-gray-600">
                          {address.city}, {address.state} {address.postal_code}
                        </div>
                        <div className="text-gray-600">{address.country}</div>
                        <div className="text-sm text-green-600 mt-1">
                          ${address.monthly_fee}/month
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      address.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {address.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {mailItems.filter(m => m.status === 'received').length}
                </div>
                <div className="text-sm text-gray-600">New Mail</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {mailItems.filter(m => m.status === 'scanned').length}
                </div>
                <div className="text-sm text-gray-600">Scanned</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Forward className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {forwardingRequests.filter(f => f.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending Forwards</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Archive className="w-8 h-8 text-gray-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {mailItems.filter(m => m.status === 'archived').length}
                </div>
                <div className="text-sm text-gray-600">Archived</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="received">Received</option>
                <option value="scanned">Scanned</option>
                <option value="forwarded">Forwarded</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="letter">Letters</option>
                <option value="package">Packages</option>
                <option value="document">Documents</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mail Items */}
        <div className="space-y-4">
          {filteredMail.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No mail found</h3>
              <p className="text-gray-600">Your virtual mailbox is empty or no items match your filters.</p>
            </div>
          ) : (
            filteredMail.map((mail) => (
              <div key={mail.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`text-gray-600 ${getPriorityColor(mail.priority)}`}>
                        {getTypeIcon(mail.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{mail.sender_name}</h3>
                          {mail.priority !== 'normal' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mail.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {mail.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {mail.subject && (
                          <p className="text-gray-600 mb-2">{mail.subject}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(mail.received_date).toLocaleDateString()}
                          </div>
                          {mail.weight && (
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-1" />
                              {mail.weight}g
                            </div>
                          )}
                          {mail.tracking_number && (
                            <div className="flex items-center">
                              <Truck className="w-4 h-4 mr-1" />
                              {mail.tracking_number}
                            </div>
                          )}
                        </div>
                        {mail.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{mail.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mail.status)}`}>
                        {mail.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Scan Images */}
                  {mail.scan_images && mail.scan_images.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Scanned Images</h4>
                      <div className="flex space-x-2">
                        {mail.scan_images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => downloadScan(mail, index)}
                            className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Scan {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {mail.status === 'scanned' && (
                        <button
                          onClick={() => {
                            setSelectedMail(mail);
                            setShowForwardModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Forward className="w-4 h-4 mr-1" />
                          Forward
                        </button>
                      )}
                      {mail.status !== 'archived' && (
                        <button
                          onClick={() => archiveMail(mail.id)}
                          className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Archive className="w-4 h-4 mr-1" />
                          Archive
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Received {new Date(mail.received_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Forwarding Requests */}
        {forwardingRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Forwarding Requests</h2>
            <div className="space-y-3">
              {forwardingRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Mail forwarding to {request.destination_address.split(',')[0]}...
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.shipping_method} shipping - ${request.cost}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      request.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                    {request.tracking_number && (
                      <span className="text-xs text-gray-500">#{request.tracking_number}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forward Modal */}
        {showForwardModal && selectedMail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Forward Mail</h2>
                  <button
                    onClick={() => setShowForwardModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mail Item
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{selectedMail.sender_name}</div>
                      {selectedMail.subject && (
                        <div className="text-sm text-gray-600">{selectedMail.subject}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Address
                    </label>
                    <textarea
                      value={forwardingAddress}
                      onChange={(e) => setForwardingAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter complete mailing address..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Method
                    </label>
                    <div className="space-y-2">
                      {Object.entries(shippingCosts).map(([method, cost]) => (
                        <label key={method} className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value={method}
                            checked={shippingMethod === method}
                            onChange={(e) => setShippingMethod(e.target.value as any)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {method} - ${cost}
                            {method === 'standard' && ' (5-7 business days)'}
                            {method === 'express' && ' (2-3 business days)'}
                            {method === 'overnight' && ' (next business day)'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">
                        Total cost: ${shippingCosts[shippingMethod]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowForwardModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={requestForwarding}
                    disabled={!forwardingAddress.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Request Forwarding
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualMailbox;