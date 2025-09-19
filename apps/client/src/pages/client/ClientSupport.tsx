import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Send,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  ticket_type: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  consultant: {
    full_name: string;
  } | null;
}

const ClientSupport = () => {
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    type: 'general',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user && profile) {
      fetchSupportTickets();
    }
  }, [user, profile]);

  const fetchSupportTickets = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('❌ Client fetch error:', clientError);
        return;
      }

      if (!clientData) {
        console.log('❌ No client record found for this user');
        return;
      }

      // Fetch support tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select(`
          *,
          consultant:user_profiles(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        return;
      }

      setTickets(ticketsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      alert('Please fill in all required fields');
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

      // Create support ticket
      const { error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          client_id: clientData.id,
          consultant_id: newTicket.type === 'complaint' ? null : clientData.assigned_consultant_id,
          subject: newTicket.subject,
          description: newTicket.description,
          ticket_type: newTicket.type,
          priority: newTicket.priority,
          status: 'open'
        });

      if (ticketError) {
        throw ticketError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'support_ticket_created',
          description: `Created ${newTicket.type} support ticket: ${newTicket.subject}`,
          payload: newTicket
        });

      // Notify recipient
      const recipientId = newTicket.type === 'complaint' 
        ? null // In real implementation, you'd have admin user IDs
        : clientData.assigned_consultant_id;

      if (recipientId) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: recipientId,
            type: 'support_ticket_created',
            payload: {
              client_name: profile?.full_name,
              subject: newTicket.subject,
              type: newTicket.type,
              priority: newTicket.priority
            },
            email_notification: true
          }
        });
      }

      alert('Support ticket submitted successfully!');
      setShowTicketForm(false);
      setNewTicket({ subject: '', description: '', type: 'general', priority: 'medium' });
      fetchSupportTickets();
    } catch (err) {
      console.error('Ticket submission error:', err);
      alert('Failed to submit support ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'open': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'closed': return <CheckCircle className="w-5 h-5 text-gray-600" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Support - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
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
        <title>Support - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support</h1>
            <p className="text-gray-600 mt-1">Get help from your consultant or submit general inquiries</p>
          </div>
          <button 
            onClick={() => setShowTicketForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Support Request
          </button>
        </div>

        {/* Support Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.total}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-yellow-600">{ticketStats.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{ticketStats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{ticketStats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search support tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Support Tickets */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                      <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{ticket.ticket_type}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        {ticket.consultant && (
                          <>
                            <span>•</span>
                            <span>Assigned to: {ticket.consultant.full_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  {ticket.status === 'open' && (
                    <button className="inline-flex items-center px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                      <Send className="w-4 h-4 mr-1" />
                      Add Response
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Support Tickets</h3>
            <p className="text-gray-600 mb-6">
              Need help? Submit a support request and get assistance from your consultant or our admin team.
            </p>
            <button 
              onClick={() => setShowTicketForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Support Request
            </button>
          </div>
        )}

        {/* Support Request Modal */}
        {showTicketForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">New Support Request</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type
                  </label>
                  <select
                    value={newTicket.type}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General Support (to Consultant)</option>
                    <option value="technical">Technical Issue (to Consultant)</option>
                    <option value="complaint">Complaint (to Admin)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {newTicket.type === 'complaint' 
                      ? 'Complaints are sent directly to our admin team'
                      : 'This request will be sent to your assigned consultant'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide detailed information about your request..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Standard support</option>
                    <option value="high">High - Important issue</option>
                    <option value="urgent">Urgent - Critical issue</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTicket}
                  disabled={submitting || !newTicket.subject.trim() || !newTicket.description.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Help */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">📋 How to upload documents?</h3>
              <p className="text-sm text-gray-600">
                Go to Tasks or Accounting section and use the upload areas to submit your documents.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">💬 How to message my consultant?</h3>
              <p className="text-sm text-gray-600">
                Use the Messages section to chat directly with your consultant in real-time.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">💳 How to make payments?</h3>
              <p className="text-sm text-gray-600">
                Check the Billing section for pending invoices and use the secure payment system.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">📦 How to request mail forwarding?</h3>
              <p className="text-sm text-gray-600">
                Use the Mailbox section to request physical mail forwarding for $15.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientSupport;