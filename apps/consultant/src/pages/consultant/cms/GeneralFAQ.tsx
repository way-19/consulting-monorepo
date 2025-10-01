import React, { useState, useEffect } from 'react';
import { createAuthenticatedFetch } from '@consulting19/shared';
import { Plus, Trash2, Save, Loader } from 'lucide-react';

const authFetch = createAuthenticatedFetch('http://localhost:3002');

interface FAQ {
  id?: string;
  question_en: string;
  answer_en: string;
  order_index: number;
  is_visible: boolean;
}

const GeneralFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await authFetch('/api/cms-content/general-faqs');
      const data = await response.json();
      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFAQ = () => {
    setFaqs([...faqs, {
      question_en: '',
      answer_en: '',
      order_index: faqs.length,
      is_visible: true
    }]);
  };

  const updateFAQ = (index: number, field: string, value: any) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const saveFAQ = async (faq: FAQ, index: number) => {
    try {
      if (faq.id) {
        await authFetch(`/api/cms-content/general-faqs/${faq.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq)
        });
      } else {
        const response = await authFetch('/api/cms-content/general-faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...faq, country_code: 'GE' })
        });
        const data = await response.json();
        if (data.success) {
          const updated = [...faqs];
          updated[index] = data.faq;
          setFaqs(updated);
        }
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const deleteFAQ = async (faqId: string | undefined, index: number) => {
    if (faqId) {
      try {
        await authFetch(`/api/cms-content/general-faqs/${faqId}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General FAQ</h1>
          <p className="text-gray-600 mt-1">Main page frequently asked questions</p>
        </div>
        <button
          onClick={addFAQ}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs Yet</h3>
          <p className="text-gray-600 mb-4">Add your first general FAQ</p>
          <button
            onClick={addFAQ}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-medium text-gray-900">FAQ #{index + 1}</h3>
                <button
                  onClick={() => deleteFAQ(faq.id, index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                  <input
                    type="text"
                    value={faq.question_en}
                    onChange={(e) => updateFAQ(index, 'question_en', e.target.value)}
                    onBlur={() => saveFAQ(faq, index)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter question"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
                  <textarea
                    value={faq.answer_en}
                    onChange={(e) => updateFAQ(index, 'answer_en', e.target.value)}
                    onBlur={() => saveFAQ(faq, index)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter answer"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={faq.is_visible}
                    onChange={(e) => {
                      updateFAQ(index, 'is_visible', e.target.checked);
                      saveFAQ({ ...faq, is_visible: e.target.checked }, index);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Visible on page</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralFAQ;
