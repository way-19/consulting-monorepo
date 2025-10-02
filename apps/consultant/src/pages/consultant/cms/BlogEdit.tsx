import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createAuthenticatedFetch } from '@consulting19/shared';
import { Save, ArrowLeft, Languages, Loader, Trash2 } from 'lucide-react';

const authFetch = createAuthenticatedFetch();

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title_en: '',
    title_tr: '',
    title_pt: '',
    title_es: '',
    excerpt_en: '',
    excerpt_tr: '',
    excerpt_pt: '',
    excerpt_es: '',
    content_en: '',
    content_tr: '',
    content_pt: '',
    content_es: '',
    slug: '',
    is_published: false,
    featured_image_id: null
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (formData.featured_image_id && !imagePreview) {
      setImagePreview(`http://localhost:3002/api/cms-content/media/${formData.featured_image_id}/data`);
    }
  }, [formData.featured_image_id]);

  const fetchPost = async () => {
    try {
      const response = await authFetch(`/api/cms-content/blog/${id}`);
      const data = await response.json();
      if (data.success) {
        setFormData(data.post);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!formData.title_en || !formData.excerpt_en || !formData.content_en) return;

    setTranslating(true);
    try {
      const [titleRes, excerptRes, contentRes] = await Promise.all([
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.title_en })
        }),
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.excerpt_en })
        }),
        authFetch('/api/cms-content/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.content_en })
        })
      ]);

      const [titleData, excerptData, contentData] = await Promise.all([
        titleRes.json(),
        excerptRes.json(),
        contentRes.json()
      ]);

      if (titleData.success && excerptData.success && contentData.success) {
        setFormData(prev => ({
          ...prev,
          title_tr: titleData.translations.tr,
          title_pt: titleData.translations.pt,
          title_es: titleData.translations.es,
          excerpt_tr: excerptData.translations.tr,
          excerpt_pt: excerptData.translations.pt,
          excerpt_es: excerptData.translations.es,
          content_tr: contentData.translations.tr,
          content_pt: contentData.translations.pt,
          content_es: contentData.translations.es
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

      const url = isNew ? '/api/cms-content/blog' : `/api/cms-content/blog/${id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, featured_image_id, country_code: 'GE' })
      });

      if (response.ok) {
        navigate('/content/blog');
      }
    } catch (error) {
      console.error('Error saving post:', error);
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
        <button
          onClick={() => navigate('/content/blog')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? 'New Blog Post' : 'Edit Blog Post'}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Featured Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Image</h2>
          
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Featured" className="w-full max-w-2xl rounded-lg" />
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
                id="blog-image"
              />
              <label htmlFor="blog-image" className="cursor-pointer">
                <div className="text-gray-600 mb-2">Click to upload featured image</div>
                <div className="text-sm text-gray-500">PNG, JPG up to 5MB</div>
              </label>
            </div>
          )}
        </div>

        {/* Content - English with Translate Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Content (English)</h2>
            <button
              onClick={handleTranslate}
              disabled={translating || !formData.title_en || !formData.content_en}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
            >
              {translating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
              Translate All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="url-friendly-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt_en}
                onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Brief summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="Write your post content (HTML supported)"
              />
            </div>
          </div>
        </div>

        {/* Turkish Translation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Turkish Translation</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.title_tr}
              onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Başlık"
            />
            <textarea
              value={formData.excerpt_tr}
              onChange={(e) => setFormData({ ...formData, excerpt_tr: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Özet"
            />
            <textarea
              value={formData.content_tr}
              onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="İçerik"
            />
          </div>
        </div>

        {/* Portuguese Translation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Portuguese Translation</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.title_pt}
              onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Título"
            />
            <textarea
              value={formData.excerpt_pt}
              onChange={(e) => setFormData({ ...formData, excerpt_pt: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Resumo"
            />
            <textarea
              value={formData.content_pt}
              onChange={(e) => setFormData({ ...formData, content_pt: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Conteúdo"
            />
          </div>
        </div>

        {/* Spanish Translation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spanish Translation</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.title_es}
              onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Título"
            />
            <textarea
              value={formData.excerpt_es}
              onChange={(e) => setFormData({ ...formData, excerpt_es: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Resumen"
            />
            <textarea
              value={formData.content_es}
              onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Contenido"
            />
          </div>
        </div>

        {/* Publish Option */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Publish immediately</label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate('/content/blog')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.title_en || !formData.slug}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 inline-flex items-center"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEdit;
