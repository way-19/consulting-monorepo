import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, Plus, Edit, Trash2, Eye, Globe, Save, X, 
  ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  is_published: boolean;
  country_code: string;
  created_at: string;
  updated_at: string;
}

interface CMSBlock {
  id: string;
  page_id: string;
  block_type: string;
  content: any;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const BLOCK_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'features', label: 'Features Grid' },
  { value: 'services', label: 'Services List' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'faq', label: 'FAQ Section' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'text_content', label: 'Text Content' },
  { value: 'image_gallery', label: 'Image Gallery' },
  { value: 'video', label: 'Video Embed' },
  { value: 'contact_form', label: 'Contact Form' }
];

const ConsultantContent = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState<CMSBlock | null>(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showCreateBlock, setShowCreateBlock] = useState(false);
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/api/cms-content/pages');
      
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Error fetching CMS pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageWithBlocks = async (pageId: string) => {
    try {
      const response = await authFetch(`/api/cms-content/pages/${pageId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSelectedPage(data.page);
        setBlocks(data.blocks || []);
      }
    } catch (error) {
      console.error('Error fetching page blocks:', error);
    }
  };

  const handlePublishToggle = async (pageId: string, currentStatus: boolean) => {
    try {
      const response = await authFetch(`/api/cms-content/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus })
      });

      if (response.ok) {
        await fetchPages();
        if (selectedPage?.id === pageId) {
          setSelectedPage(prev => prev ? { ...prev, is_published: !currentStatus } : null);
        }
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Delete this page? All blocks will also be deleted.')) return;

    try {
      const response = await authFetch(`/api/cms-content/pages/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPages();
        if (selectedPage?.id === pageId) {
          setSelectedPage(null);
          setBlocks([]);
        }
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleBlockVisibilityToggle = async (blockId: string, currentStatus: boolean) => {
    try {
      const response = await authFetch(`/api/cms-content/blocks/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentStatus })
      });

      if (response.ok) {
        if (selectedPage) {
          await fetchPageWithBlocks(selectedPage.id);
        }
      }
    } catch (error) {
      console.error('Error toggling block visibility:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Delete this block?')) return;

    try {
      const response = await authFetch(`/api/cms-content/blocks/${blockId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (selectedPage) {
          await fetchPageWithBlocks(selectedPage.id);
        }
      }
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Content Management - Consultant Portal</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Content Management - Consultant Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600 mt-1">
                Create and manage your country landing page with modular blocks
              </p>
            </div>
            <button
              onClick={() => setShowCreatePage(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </button>
          </div>

          {/* Pages List */}
          {!selectedPage && (
            <div className="space-y-4">
              {pages.length > 0 ? (
                pages.map(page => (
                  <div key={page.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{page.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            page.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Slug:</strong> /{page.slug}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Country:</strong> {page.country_code}
                        </p>
                        {page.meta_description && (
                          <p className="text-sm text-gray-500 mt-2">{page.meta_description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fetchPageWithBlocks(page.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Page"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePublishToggle(page.id, page.is_published)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title={page.is_published ? 'Unpublish' : 'Publish'}
                        >
                          <Globe className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Pages Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first country landing page to get started
                  </p>
                  <button
                    onClick={() => setShowCreatePage(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Page
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Page Editor */}
          {selectedPage && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPage.title}</h2>
                    <p className="text-gray-600">/{selectedPage.slug}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPage(null);
                      setBlocks([]);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setShowCreateBlock(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </button>
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {blocks.length > 0 ? (
                  blocks.map((block, index) => (
                    <div key={block.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {BLOCK_TYPES.find(t => t.value === block.block_type)?.label || block.block_type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              block.is_visible 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {block.is_visible ? 'Visible' : 'Hidden'}
                            </span>
                            <span className="text-sm text-gray-500">Order: {block.order_index}</span>
                          </div>
                          <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto max-h-32">
                            {JSON.stringify(block.content, null, 2)}
                          </pre>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBlockVisibilityToggle(block.id, block.is_visible)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title={block.is_visible ? 'Hide' : 'Show'}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Block"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Copy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Blocks Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add content blocks to build your page
                    </p>
                    <button
                      onClick={() => setShowCreateBlock(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Block
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Note: Create Page & Create Block modals would go here in full implementation */}
          {/* Omitted for brevity - forms would POST to /api/cms-content/pages and /blocks */}
        </div>
      </div>
    </>
  );
};

export default ConsultantContent;
