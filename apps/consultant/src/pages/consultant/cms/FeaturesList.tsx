import React, { useState, useEffect } from 'react';
import { createAuthenticatedFetch } from '@consulting19/shared';
import { Plus, Save, Trash2, Loader, Languages } from 'lucide-react';

const authFetch = createAuthenticatedFetch('http://localhost:3002');

interface Feature {
  id?: string;
  icon: string;
  title_en: string;
  title_tr?: string;
  title_pt?: string;
  title_es?: string;
  description_en: string;
  description_tr?: string;
  description_pt?: string;
  description_es?: string;
  order_index?: number;
}

const FeaturesList = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await authFetch('/api/cms-content/features');
      const data = await response.json();
      if (data.success) {
        setFeatures(data.features);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFeatures([...features, { 
      icon: '⭐', 
      title_en: '', 
      description_en: '',
      order_index: features.length 
    }]);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const translateFeature = async (index: number) => {
    const feature = features[index];
    if (!feature.title_en || !feature.description_en) return;

    setTranslating(feature.id || `new-${index}`);
    try {
      const [titleResponse, descResponse] = await Promise.all([
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: feature.title_en })
        }),
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: feature.description_en })
        })
      ]);

      const titleData = await titleResponse.json();
      const descData = await descResponse.json();

      if (titleData.success && descData.success) {
        const updated = [...features];
        updated[index] = {
          ...updated[index],
          title_tr: titleData.translations.tr,
          title_pt: titleData.translations.pt,
          title_es: titleData.translations.es,
          description_tr: descData.translations.tr,
          description_pt: descData.translations.pt,
          description_es: descData.translations.es
        };
        setFeatures(updated);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(null);
    }
  };

  const saveFeature = async (feature: Feature, index: number) => {
    try {
      if (feature.id) {
        await authFetch(`/api/cms-content/features/${feature.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feature)
        });
      } else {
        const response = await authFetch('/api/cms-content/features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...feature, country_code: 'GE' })
        });
        const data = await response.json();
        if (data.success) {
          const updated = [...features];
          updated[index] = data.feature;
          setFeatures(updated);
        }
      }
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  const deleteFeature = async (feature: Feature, index: number) => {
    if (feature.id) {
      try {
        await authFetch(`/api/cms-content/features/${feature.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting feature:', error);
      }
    }
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < features.length; i++) {
        await saveFeature(features[i], i);
      }
      await fetchFeatures();
      alert('All features saved successfully!');
    } catch (error) {
      console.error('Error saving features:', error);
      alert('Failed to save some features. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-bold text-gray-900">Key Features</h1>
          <button
            onClick={addFeature}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>What is this section?</strong> Manage the feature cards displayed on your country's homepage.
            <br />
            <strong>Examples:</strong> "Company Formation", "Tax Optimization", "Banking Solutions" - highlight your main service offerings.
            <br />
            <strong>Where it appears:</strong> Homepage → "Why Choose Us" section
          </p>
        </div>
      </div>

      {features.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Features Yet</h3>
          <p className="text-gray-600 mb-4">Add your first feature</p>
          <button
            onClick={addFeature}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={feature.id || index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Feature #{index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => translateFeature(index)}
                      disabled={translating === (feature.id || `new-${index}`) || !feature.title_en || !feature.description_en}
                      className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 text-sm"
                    >
                      {translating === (feature.id || `new-${index}`) ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Languages className="w-4 h-4 mr-2" />
                      )}
                      Translate
                    </button>
                    <button
                      onClick={() => deleteFeature(feature, index)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <input
                        type="text"
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-3xl text-center"
                        placeholder="🎯"
                      />
                    </div>
                    <div className="col-span-10">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title (English) *</label>
                      <input
                        type="text"
                        value={feature.title_en}
                        onChange={(e) => updateFeature(index, 'title_en', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Feature title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title (Turkish)</label>
                      <input
                        type="text"
                        value={feature.title_tr || ''}
                        onChange={(e) => updateFeature(index, 'title_tr', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Türkçe başlık"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title (Portuguese)</label>
                      <input
                        type="text"
                        value={feature.title_pt || ''}
                        onChange={(e) => updateFeature(index, 'title_pt', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Título"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title (Spanish)</label>
                      <input
                        type="text"
                        value={feature.title_es || ''}
                        onChange={(e) => updateFeature(index, 'title_es', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Título"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (English) *</label>
                    <textarea
                      value={feature.description_en}
                      onChange={(e) => updateFeature(index, 'description_en', e.target.value)}
                      onBlur={() => saveFeature(feature, index)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (TR)</label>
                      <textarea
                        value={feature.description_tr || ''}
                        onChange={(e) => updateFeature(index, 'description_tr', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (PT)</label>
                      <textarea
                        value={feature.description_pt || ''}
                        onChange={(e) => updateFeature(index, 'description_pt', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (ES)</label>
                      <textarea
                        value={feature.description_es || ''}
                        onChange={(e) => updateFeature(index, 'description_es', e.target.value)}
                        onBlur={() => saveFeature(feature, index)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 inline-flex items-center"
            >
              {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save All Features
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturesList;
