import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  RefreshCw,
  Filter,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

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
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client data not found:', clientError);
        setLoading(false);
        return;
      }

      // Fetch financial documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('type', 'financial')
        .order('uploaded_at', { ascending: false });

      if (documentsError) {
        console.error('Error fetching documents:', documentsError);
        setLoading(false);
        return;
      }

      const documentsList = documentsData || [];
      setDocuments(documentsList);

      // Calculate stats
      const totalDocuments = documentsList.length;
      const totalAmount = documentsList.reduce((sum, doc) => sum + (doc.amount || 0), 0);
      const pendingReview = documentsList.filter(doc => doc.status === 'pending').length;
      
      // This month documents
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);
      const thisMonth = documentsList.filter(doc => 
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
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Center</h3>
          <p className="text-gray-600 mb-6">
            Get help from your consultant or submit support requests.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Consultant
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Support Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAccounting;