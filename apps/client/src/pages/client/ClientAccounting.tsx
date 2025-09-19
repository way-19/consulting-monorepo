import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Upload, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Eye,
  Trash2
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  created_at: string;
  notes: string;
}

const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [monthFilter, setMonthFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');

  useEffect(() => {
    if (user && profile) {
      fetchAccountingDocuments();
    }
  }, [user, profile]);

  const fetchAccountingDocuments = async () => {
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

      // Only fetch financial documents from last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('type', 'financial')
        .gte('created_at', threeMonthsAgo.toISOString())
        .order('created_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
        return;
      }

      setDocuments(docsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setUploading(true);
      
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Upload file to Supabase Storage
      const fileName = `accounting/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path);

      // Save document metadata
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          name: file.name,
          type: 'financial',
          category: documentType,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_at: new Date().toISOString(),
          notes: `Accounting document - ${documentType}`
        });

      if (docError) {
        throw docError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'accounting_document_upload',
          resource_type: 'document',
          description: `Uploaded accounting document: ${file.name}`,
          payload: { 
            file_name: file.name, 
            document_type: documentType,
            file_size: file.size 
          }
        });

      // Notify consultant
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'accounting_document_uploaded',
            payload: {
              client_name: profile?.full_name,
              document_name: file.name,
              document_type: documentType
            },
            email_notification: true
          }
        });
      }

      alert('Accounting document uploaded successfully!');
      fetchAccountingDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      });
    }
    
    return months;
  };

  const filteredDocuments = documents.filter(doc => {
    if (monthFilter !== 'all') {
      const docDate = new Date(doc.created_at);
      const docMonth = `${docDate.getFullYear()}-${(docDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (docMonth !== monthFilter) return false;
    }
    
    if (documentTypeFilter !== 'all' && doc.category !== documentTypeFilter) {
      return false;
    }
    
    return true;
  });

  // Calculate basic statistics
  const monthlyStats = getMonthOptions().map(month => {
    const monthDocs = documents.filter(doc => {
      const docDate = new Date(doc.created_at);
      const docMonth = `${docDate.getFullYear()}-${(docDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return docMonth === month.value;
    });
    
    return {
      month: month.label,
      totalDocuments: monthDocs.length,
      invoices: monthDocs.filter(doc => doc.category === 'invoice').length,
      bankStatements: monthDocs.filter(doc => doc.category === 'bank_statement').length,
      other: monthDocs.filter(doc => !['invoice', 'bank_statement'].includes(doc.category || '')).length
    };
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Accounting - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
          <p className="text-gray-600 mt-1">Submit monthly accounting documents and track your submissions</p>
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              📋 <strong>Note:</strong> Documents are automatically deleted after 3 months for security and storage optimization.
            </p>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Accounting Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="invoice-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'invoice');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="invoice-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Invoice</h3>
                <p className="text-sm text-gray-600">
                  Click to upload invoices, receipts, and expense documents
                </p>
              </label>
            </div>

            {/* Bank Statement Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="bank-statement-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'bank_statement');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="bank-statement-upload" className="cursor-pointer">
                <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Bank Statement</h3>
                <p className="text-sm text-gray-600">
                  Click to upload bank statements and financial reports
                </p>
              </label>
            </div>
          </div>
          
          {uploading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 font-medium">Uploading document...</span>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyStats.map((stats, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{stats.month}</h3>
                  <span className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoices:</span>
                    <span className="font-medium">{stats.invoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Statements:</span>
                    <span className="font-medium">{stats.bankStatements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other:</span>
                    <span className="font-medium">{stats.other}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="bank_statement">Bank Statements</option>
              <option value="expense">Expenses</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Accounting Documents</h2>
              <p className="text-sm text-gray-600">
                Documents from the last 3 months (older documents are automatically removed)
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{doc.category || 'Other'}</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(doc.file_url, '_blank')}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = doc.file_url;
                          a.download = doc.name;
                          a.click();
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accounting Documents</h3>
            <p className="text-gray-600 mb-6">
              Start by uploading your monthly accounting documents like invoices and bank statements.
              These will be securely shared with your consultant.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-green-900 mb-2">📊 Professional Accounting</h4>
              <p className="text-xs text-green-800">
                Our accounting module helps you maintain organized records and ensures your 
                consultant has all necessary documents for tax filings and financial reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default ClientAccounting;