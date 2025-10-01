import React, { useState, useEffect } from 'react';
import { createAuthenticatedFetch } from '@consulting19/shared';
import { Save, Languages, Loader, User } from 'lucide-react';

const authFetch = createAuthenticatedFetch('http://localhost:3002');

const HeroSection = () => {
  const [heroData, setHeroData] = useState({
    title_en: '',
    title_tr: '',
    title_pt: '',
    title_es: '',
    subtitle_en: '',
    subtitle_tr: '',
    subtitle_pt: '',
    subtitle_es: ''
  });

  const [consultantInfo, setConsultantInfo] = useState({
    full_name: '',
    company: '',
    experience: '',
    specializations: '',
    languages: '',
    bio_en: '',
    bio_tr: '',
    bio_pt: '',
    bio_es: ''
  });

  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async (field: 'title' | 'subtitle' | 'bio') => {
    let text = '';
    if (field === 'title') text = heroData.title_en;
    else if (field === 'subtitle') text = heroData.subtitle_en;
    else if (field === 'bio') text = consultantInfo.bio_en;

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
        if (field === 'bio') {
          setConsultantInfo(prev => ({
            ...prev,
            bio_tr: data.translations.tr,
            bio_pt: data.translations.pt,
            bio_es: data.translations.es
          }));
        } else {
          setHeroData(prev => ({
            ...prev,
            [`${field}_tr`]: data.translations.tr,
            [`${field}_pt`]: data.translations.pt,
            [`${field}_es`]: data.translations.es
          }));
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authFetch('/api/cms-content/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultantInfo)
      });

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-gray-600 mt-1">Manage your country page hero and consultant profile</p>
      </div>

      <div className="space-y-8">
        {/* Hero Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={heroData.title_en}
                  onChange={(e) => setHeroData({ ...heroData, title_en: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Company Formation in Georgia"
                />
                <button
                  onClick={() => handleTranslate('title')}
                  disabled={translating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  <Languages className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Turkish)</label>
                <input
                  type="text"
                  value={heroData.title_tr}
                  onChange={(e) => setHeroData({ ...heroData, title_tr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Portuguese)</label>
                <input
                  type="text"
                  value={heroData.title_pt}
                  onChange={(e) => setHeroData({ ...heroData, title_pt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Spanish)</label>
                <input
                  type="text"
                  value={heroData.title_es}
                  onChange={(e) => setHeroData({ ...heroData, title_es: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (English) *
              </label>
              <div className="flex gap-2">
                <textarea
                  value={heroData.subtitle_en}
                  onChange={(e) => setHeroData({ ...heroData, subtitle_en: e.target.value })}
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Brief description of your services"
                />
                <button
                  onClick={() => handleTranslate('subtitle')}
                  disabled={translating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  <Languages className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (TR)</label>
                <textarea
                  value={heroData.subtitle_tr}
                  onChange={(e) => setHeroData({ ...heroData, subtitle_tr: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (PT)</label>
                <textarea
                  value={heroData.subtitle_pt}
                  onChange={(e) => setHeroData({ ...heroData, subtitle_pt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (ES)</label>
                <textarea
                  value={heroData.subtitle_es}
                  onChange={(e) => setHeroData({ ...heroData, subtitle_es: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Consultant Profile */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Consultant Profile</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This information will be displayed on your country page. Phone and email are NOT shown - all communication happens through the platform.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={consultantInfo.full_name}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={consultantInfo.company}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <input
                  type="text"
                  value={consultantInfo.experience}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 8+ years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                <input
                  type="text"
                  value={consultantInfo.languages}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, languages: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., English, Georgian, Russian"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
              <input
                type="text"
                value={consultantInfo.specializations}
                onChange={(e) => setConsultantInfo({ ...consultantInfo, specializations: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Company Formation, Tax Optimization, Banking"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio (English)</label>
              <div className="flex gap-2">
                <textarea
                  value={consultantInfo.bio_en}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, bio_en: e.target.value })}
                  rows={4}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Write about your background and expertise"
                />
                <button
                  onClick={() => handleTranslate('bio')}
                  disabled={translating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  <Languages className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio (TR)</label>
                <textarea
                  value={consultantInfo.bio_tr}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, bio_tr: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio (PT)</label>
                <textarea
                  value={consultantInfo.bio_pt}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, bio_pt: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio (ES)</label>
                <textarea
                  value={consultantInfo.bio_es}
                  onChange={(e) => setConsultantInfo({ ...consultantInfo, bio_es: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 inline-flex items-center"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
