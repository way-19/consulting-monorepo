import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { HelpCircle, Plus, MessageSquare } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

const ClientSupport = () => {

  return (
    <>
      <Helmet>
        <title>Support - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-600 mt-1">Get help and submit support requests</p>
        </div>
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