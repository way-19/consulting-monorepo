import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createAuthenticatedFetch } from '@consulting19/shared';
import { Save, ArrowLeft, Plus, Trash2, Languages, Loader } from 'lucide-react';

const authFetch = createAuthenticatedFetch();

interface FAQ {
  id?: string;
  question_en: string;
  question_tr?: string;
  question_pt?: string;
  question_es?: string;
  answer_en: string;
  answer_tr?: string;
  answer_pt?: string;
  answer_es?: string;
  order_index: number;
}

const ServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title_en: '',
    title_tr: '',
    title_pt: '',
    title_es: '',
    description_en: '',
    description_tr: '',
    description_pt: '',
    description_es: '',
    seo_keywords_en: '',
    seo_keywords_tr: '',
    seo_keywords_pt: '',
    seo_keywords_es: '',
    duration: '',
    category: '',
    link: '',
    show_on_homepage: true,
    order_index: 0,
    featured_image_id: null
  });

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchService();
      fetchFAQs();
    }
  }, [id]);

  useEffect(() => {
    if (formData.featured_image_id && !imagePreview) {
      setImagePreview(`http://localhost:3002/api/cms-content/media/${formData.featured_image_id}/data`);
    }
  }, [formData.featured_image_id]);

  const fetchService = async () => {
    try {
      const response = await authFetch(`/api/cms-content/services`);
      const data = await response.json();
      if (data.success) {
        const service = data.services.find((s: any) => s.id === id);
        if (service) {
          setFormData(service);
        }
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await authFetch(`/api/cms-content/services/${id}/faqs`);
      const data = await response.json();
      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleTranslate = async (field: 'title' | 'description' | 'seo_keywords') => {
    let text = '';
    if (field === 'title') text = formData.title_en;
    else if (field === 'description') text = formData.description_en;
    else if (field === 'seo_keywords') text = formData.seo_keywords_en;
    
    if (!text) return;

    setTranslating(true);
    try {
      const response = await authFetch('/api/cms-content/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          [`${field}_tr`]: data.translations.tr,
          [`${field}_pt`]: data.translations.pt,
          [`${field}_es`]: data.translations.es
        }));
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);

      const response = await authFetch('/api/cms-content/media', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        return data.image.id;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const deleteImage = async () => {
    if (!formData.featured_image_id) return;

    try {
      await authFetch(`/api/cms-content/media/${formData.featured_image_id}`, {
        method: 'DELETE'
      });
      setFormData({ ...formData, featured_image_id: null });
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let featured_image_id = formData.featured_image_id;
      
      if (imageFile) {
        const uploadedId = await uploadImage();
        if (uploadedId) {
          featured_image_id = uploadedId;
        }
      }

      const url = isNew ? '/api/cms-content/services' : `/api/cms-content/services/${id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, featured_image_id, country_code: 'GE' })
      });

      if (response.ok) {
        navigate('/content/services');
      }
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setSaving(false);
    }
  };

  const addFAQ = () => {
    setFaqs([...faqs, {
      question_en: '',
      answer_en: '',
      order_index: faqs.length
    }]);
  };

  const updateFAQ = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const saveFAQ = async (faq: FAQ, index: number) => {
    try {
      if (faq.id) {
        await authFetch(`/api/cms-content/faqs/${faq.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq)
        });
      } else if (!isNew) {
        const response = await authFetch(`/api/cms-content/services/${id}/faqs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq)
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

  const translateFAQ = async (index: number) => {
    const faq = faqs[index];
    if (!faq.question_en || !faq.answer_en) return;

    setTranslating(true);
    try {
      const [questionRes, answerRes] = await Promise.all([
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: faq.question_en })
        }),
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: faq.answer_en })
        })
      ]);

      const [questionData, answerData] = await Promise.all([
        questionRes.json(),
        answerRes.json()
      ]);

      if (questionData.success && answerData.success) {
        const updated = [...faqs];
        updated[index] = {
          ...updated[index],
          question_tr: questionData.translations.tr,
          question_pt: questionData.translations.pt,
          question_es: questionData.translations.es,
          answer_tr: answerData.translations.tr,
          answer_pt: answerData.translations.pt,
          answer_es: answerData.translations.es
        };
        setFaqs(updated);
        await saveFAQ(updated[index], index);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  const deleteFAQ = async (faqId: string, index: number) => {
    if (faqId) {
      try {
        await authFetch(`/api/cms-content/faqs/${faqId}`, { method: 'DELETE' });
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
      <div className="mb-6">
        <button
          onClick={() => navigate('/content/services')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? 'Add New Service' : 'Edit Service'}
        </h1>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service title in English"
                />
                <button
                  onClick={() => handleTranslate('title')}
                  disabled={translating || !formData.title_en}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 inline-flex items-center"
                >
                  {translating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
                  Translate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Turkish)</label>
                <input
                  type="text"
                  value={formData.title_tr}
                  onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Türkçe başlık"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Portuguese)</label>
                <input
                  type="text"
                  value={formData.title_pt}
                  onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Título"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Spanish)</label>
                <input
                  type="text"
                  value={formData.title_es}
                  onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Título"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English) *
              </label>
              <div className="flex gap-2">
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service description"
                />
                <button
                  onClick={() => handleTranslate('description')}
                  disabled={translating || !formData.description_en}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  <Languages className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (TR)</label>
                <textarea
                  value={formData.description_tr}
                  onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (PT)</label>
                <textarea
                  value={formData.description_pt}
                  onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (ES)</label>
                <textarea
                  value={formData.description_es}
                  onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 2-3 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Company Formation"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.show_on_homepage}
                onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">Show on homepage</label>
            </div>
          </div>
        </div>

        {/* Service Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Image</h2>
          
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Service preview" className="w-full max-w-md rounded-lg" />
                <button
                  onClick={() => {
                    if (formData.featured_image_id) {
                      deleteImage();
                    } else {
                      setImageFile(null);
                      setImagePreview(null);
                    }
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="service-image"
                />
                <label htmlFor="service-image" className="cursor-pointer">
                  <div className="text-gray-600 mb-2">Click to upload service image</div>
                  <div className="text-sm text-gray-500">PNG, JPG up to 5MB</div>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* SEO Keywords */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Meta Keywords</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords (English)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.seo_keywords_en}
                  onChange={(e) => setFormData({ ...formData, seo_keywords_en: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., company formation, business setup, georgia"
                />
                <button
                  onClick={() => handleTranslate('seo_keywords')}
                  disabled={translating || !formData.seo_keywords_en}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  <Languages className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (Turkish)</label>
                <input
                  type="text"
                  value={formData.seo_keywords_tr}
                  onChange={(e) => setFormData({ ...formData, seo_keywords_tr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (Portuguese)</label>
                <input
                  type="text"
                  value={formData.seo_keywords_pt}
                  onChange={(e) => setFormData({ ...formData, seo_keywords_pt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (Spanish)</label>
                <input
                  type="text"
                  value={formData.seo_keywords_es}
                  onChange={(e) => setFormData({ ...formData, seo_keywords_es: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service FAQs */}
        {!isNew && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Service FAQs</h2>
              <button
                onClick={addFAQ}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No FAQs yet. Add your first FAQ.</p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">FAQ #{index + 1}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => translateFAQ(index)}
                          disabled={translating || !faq.question_en || !faq.answer_en}
                          className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 text-sm"
                        >
                          {translating ? <Loader className="w-4 h-4 mr-1 animate-spin" /> : <Languages className="w-4 h-4 mr-1" />}
                          Translate
                        </button>
                        <button
                          onClick={() => faq.id && deleteFAQ(faq.id, index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* English */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Question (EN)</label>
                        <input
                          type="text"
                          value={faq.question_en}
                          onChange={(e) => updateFAQ(index, 'question_en', e.target.value)}
                          onBlur={() => saveFAQ(faq, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-2">Answer (EN)</label>
                        <textarea
                          value={faq.answer_en}
                          onChange={(e) => updateFAQ(index, 'answer_en', e.target.value)}
                          onBlur={() => saveFAQ(faq, index)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* Turkish */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Question (TR)</label>
                          <input
                            type="text"
                            value={faq.question_tr || ''}
                            onChange={(e) => updateFAQ(index, 'question_tr', e.target.value)}
                            onBlur={() => saveFAQ(faq, index)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Answer (TR)</label>
                          <textarea
                            value={faq.answer_tr || ''}
                            onChange={(e) => updateFAQ(index, 'answer_tr', e.target.value)}
                            onBlur={() => saveFAQ(faq, index)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {/* Portuguese */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Question (PT)</label>
                          <input
                            type="text"
                            value={faq.question_pt || ''}
                            onChange={(e) => updateFAQ(index, 'question_pt', e.target.value)}
                            onBlur={() => saveFAQ(faq, index)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Answer (PT)</label>
                          <textarea
                            value={faq.answer_pt || ''}
                            onChange={(e) => updateFAQ(index, 'answer_pt', e.target.value)}
                            onBlur={() => saveFAQ(faq, index)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {/* Spanish */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Question (ES)</label>
                          <input
                            type="text"
                            value={faq.question_es || ''}
                            onChange={(e) => updateFAQ(index, 'question_es', e.target.value)}
                            onBlur={() => saveFAQ(faq, index)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Answer (ES)</label>
                          <textarea
                            value={faq.answer_es || ''}
                            onChange={(e) => updateFAQ(index, 'answer_es', e.target.value)}
                            onBlur={() => saveFAQ(faq, index)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate('/content/services')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 inline-flex items-center"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceEdit;
