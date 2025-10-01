import React, { useState, useEffect } from 'react';
import { createAuthenticatedFetch } from '@consulting19/shared';
import { 
  Globe, Plus, Edit, Trash2, Eye, EyeOff, Save, X, Upload, Image as ImageIcon,
  Languages, CheckCircle, AlertCircle, Loader, FileText, List, Layout
} from 'lucide-react';

const authFetch = createAuthenticatedFetch('http://localhost:3002');

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  country_code: string;
  is_published: boolean;
  created_at: string;
}

interface CMSImage {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  alt_text_en?: string;
  created_at: string;
}

type SectionType = 'hero' | 'features' | 'services' | 'stats' | 'faq' | 'cta';

interface SectionData {
  id: string;
  block_type: SectionType;
  content: any;
  order_index: number;
  is_visible: boolean;
}

const ConsultantContent = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [images, setImages] = useState<CMSImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'media' | 'seo'>('sections');
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    fetchPages();
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchPageSections(selectedPage.id);
    }
  }, [selectedPage]);

  const fetchPages = async () => {
    try {
      const response = await authFetch('/api/cms-content/pages');
      const data = await response.json();
      if (data.success) {
        setPages(data.pages);
        if (data.pages.length > 0 && !selectedPage) {
          setSelectedPage(data.pages[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageSections = async (pageId: string) => {
    try {
      const response = await authFetch(`/api/cms-content/pages/${pageId}`);
      const data = await response.json();
      if (data.success) {
        setSections(data.blocks || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await authFetch('/api/cms-content/media');
      const data = await response.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('alt_text_en', '');

      const response = await authFetch('/api/cms-content/media', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        fetchImages();
        return data.image.id;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleTranslate = async (text: string) => {
    if (!text.trim()) return { tr: '', pt: '', es: '' };
    
    setTranslating(true);
    try {
      const response = await authFetch('/api/cms-content/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_langs: ['TR', 'PT', 'ES'] })
      });

      const data = await response.json();
      if (data.success) {
        return data.translations;
      }
      return { tr: '', pt: '', es: '' };
    } catch (error) {
      console.error('Error translating:', error);
      return { tr: '', pt: '', es: '' };
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!selectedPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content Pages</h2>
          <p className="text-gray-600">Contact admin to create your country page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600 mt-1">
                Manage your country landing page content
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPage.id}
                onChange={(e) => {
                  const page = pages.find(p => p.id === e.target.value);
                  if (page) setSelectedPage(page);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {pages.map(page => (
                  <option key={page.id} value={page.id}>
                    {page.country_code.toUpperCase()} - {page.title}
                  </option>
                ))}
              </select>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPage.is_published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {selectedPage.is_published ? (
                  <>
                    <Eye className="w-4 h-4 inline mr-2" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 inline mr-2" />
                    Draft
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('sections')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'sections'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              Content Sections
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'media'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Media Library
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'seo'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              SEO Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Page Sections</h2>
              <button
                onClick={() => {
                  setEditingSection({
                    id: 'new',
                    block_type: 'hero',
                    content: {},
                    order_index: sections.length,
                    is_visible: true
                  });
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sections Yet</h3>
                <p className="text-gray-600 mb-4">Start building your page by adding content sections</p>
                <button
                  onClick={() => {
                    setEditingSection({
                      id: 'new',
                      block_type: 'hero',
                      content: {},
                      order_index: 0,
                      is_visible: true
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Section
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {section.block_type.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">Order: {section.order_index}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            section.is_visible
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {section.is_visible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Content:</strong> {JSON.stringify(section.content).substring(0, 100)}...
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Section"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title={section.is_visible ? 'Hide' : 'Show'}
                        >
                          {section.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
              <button
                onClick={() => setShowImageUpload(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map(image => (
                <div key={image.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={`/api/cms-content/media/${image.id}/data`}
                      alt={image.filename}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{image.filename}</p>
                  <p className="text-xs text-gray-500">{(image.file_size / 1024).toFixed(1)} KB</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">SEO Settings</h2>
            <p className="text-gray-600">SEO meta tags and keywords editor coming soon...</p>
          </div>
        )}
      </div>

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditor
          section={editingSection}
          pageId={selectedPage.id}
          onClose={() => setEditingSection(null)}
          onSave={() => {
            setEditingSection(null);
            fetchPageSections(selectedPage.id);
          }}
          onTranslate={handleTranslate}
          translating={translating}
        />
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUploadModal
          onClose={() => setShowImageUpload(false)}
          onUpload={async (file) => {
            await handleImageUpload(file);
            setShowImageUpload(false);
          }}
        />
      )}
    </div>
  );
};

// Section Editor Component
const SectionEditor: React.FC<{
  section: SectionData;
  pageId: string;
  onClose: () => void;
  onSave: () => void;
  onTranslate: (text: string) => Promise<any>;
  translating: boolean;
}> = ({ section, pageId, onClose, onSave, onTranslate, translating }) => {
  const [formData, setFormData] = useState<any>(section.content || {});
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      const authFetch = createAuthenticatedFetch('http://localhost:3002');
      
      if (section.id === 'new') {
        await authFetch('/api/cms-content/blocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_id: pageId,
            block_type: section.block_type,
            content: formData
          })
        });
      } else {
        await authFetch(`/api/cms-content/blocks/${section.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: formData })
        });
      }
      
      onSave();
    } catch (error) {
      setError('Failed to save section');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {section.id === 'new' ? 'Add Section' : 'Edit Section'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {section.block_type === 'hero' && (
              <HeroEditor formData={formData} setFormData={setFormData} onTranslate={onTranslate} translating={translating} />
            )}
            {section.block_type === 'services' && (
              <ServicesEditor formData={formData} setFormData={setFormData} onTranslate={onTranslate} translating={translating} />
            )}
            {section.block_type === 'features' && (
              <FeaturesEditor formData={formData} setFormData={setFormData} onTranslate={onTranslate} translating={translating} />
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero Editor
const HeroEditor: React.FC<any> = ({ formData, setFormData, onTranslate, translating }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title (English) *
        </label>
        <input
          type="text"
          value={formData.title_en || ''}
          onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter title in English"
        />
        <button
          onClick={async () => {
            if (formData.title_en) {
              const translations = await onTranslate(formData.title_en);
              setFormData({
                ...formData,
                title_tr: translations.tr,
                title_pt: translations.pt,
                title_es: translations.es
              });
            }
          }}
          disabled={translating || !formData.title_en}
          className="mt-2 inline-flex items-center px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300"
        >
          {translating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
          Translate Title
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title (Turkish)</label>
          <input
            type="text"
            value={formData.title_tr || ''}
            onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Türkçe başlık"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title (Portuguese)</label>
          <input
            type="text"
            value={formData.title_pt || ''}
            onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Título em português"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title (Spanish)</label>
          <input
            type="text"
            value={formData.title_es || ''}
            onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Título en español"
          />
        </div>
      </div>
    </div>
  );
};

// Services Editor (placeholder)
const ServicesEditor: React.FC<any> = ({ formData, setFormData }) => {
  return (
    <div className="text-gray-600">
      <p>Services editor with per-service FAQ - coming in next update...</p>
    </div>
  );
};

// Features Editor (placeholder)
const FeaturesEditor: React.FC<any> = ({ formData, setFormData }) => {
  return (
    <div className="text-gray-600">
      <p>Features editor - coming in next update...</p>
    </div>
  );
};

// Image Upload Modal
const ImageUploadModal: React.FC<{
  onClose: () => void;
  onUpload: (file: File) => void;
}> = ({ onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => file && onUpload(file)}
              disabled={!file}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantContent;
