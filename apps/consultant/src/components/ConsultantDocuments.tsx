import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  Image, 
  File, 
  Search,
  Filter,
  Plus,
  Share2,
  Lock,
  Unlock,
  Calendar,
  User,
  FolderPlus,
  MoreVertical
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared/contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: string;
  is_public: boolean;
  client_id?: string;
  project_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    description?: string;
    tags?: string[];
    version?: number;
  };
  client?: {
    first_name: string;
    last_name: string;
  };
  project?: {
    title: string;
  };
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const STORAGE_BUCKET = 'consultant-documents';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'text/csv'
];

const DOCUMENT_CATEGORIES = [
  'contracts',
  'invoices',
  'legal_documents',
  'client_files',
  'templates',
  'reports',
  'certificates',
  'correspondence',
  'other'
];

const ConsultantDocuments: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState('other');
  const [uploadClientId, setUploadClientId] = useState('');
  const [uploadProjectId, setUploadProjectId] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchDocuments();
      fetchClients();
      fetchProjects();
    }
  }, [user?.id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('consultant_documents')
        .select(`
          *,
          client:clients(first_name, last_name),
          project:projects(title)
        `)
        .eq('uploaded_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('consultant_id', user?.id)
        .order('first_name');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, client_id')
        .eq('consultant_id', user?.id)
        .order('title');

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 50MB limit`;
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    
    return null;
  };

  const generateFilePath = (fileName: string, category: string): string => {
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${user?.id}/${category}/${timestamp}_${sanitizedName}`;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const validation = validateFile(file);
    if (validation) {
      throw new Error(validation);
    }

    const filePath = generateFilePath(file.name, uploadCategory);
    
    // Update progress
    setUploadProgress(prev => [
      ...prev.filter(p => p.fileName !== file.name),
      { fileName: file.name, progress: 0, status: 'uploading' }
    ]);

    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Update progress to completed
      setUploadProgress(prev => prev.map(p => 
        p.fileName === file.name 
          ? { ...p, progress: 100, status: 'completed' }
          : p
      ));

      return data.path;
    } catch (error) {
      // Update progress to error
      setUploadProgress(prev => prev.map(p => 
        p.fileName === file.name 
          ? { ...p, status: 'error', error: error.message }
          : p
      ));
      throw error;
    }
  };

  const saveDocumentRecord = async (file: File, filePath: string) => {
    const metadata = {
      description: uploadDescription || undefined,
      tags: uploadTags ? uploadTags.split(',').map(tag => tag.trim()) : [],
      version: 1
    };

    const { data, error } = await supabase
      .from('consultant_documents')
      .insert({
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category: uploadCategory,
        is_public: isPublic,
        client_id: uploadClientId || null,
        project_id: uploadProjectId || null,
        uploaded_by: user?.id,
        metadata
      })
      .select(`
        *,
        client:clients(first_name, last_name),
        project:projects(title)
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress([]);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        try {
          const filePath = await uploadFile(file);
          if (filePath) {
            const documentRecord = await saveDocumentRecord(file, filePath);
            return documentRecord;
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<Document>).value);

      // Add successful uploads to documents list
      setDocuments(prev => [...successful, ...prev]);

      // Reset form
      setSelectedFiles(null);
      setUploadCategory('other');
      setUploadClientId('');
      setUploadProjectId('');
      setUploadDescription('');
      setUploadTags('');
      setIsPublic(false);
      setShowUploadModal(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setUploading(false);
      // Clear progress after 3 seconds
      setTimeout(() => setUploadProgress([]), 3000);
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(document.file_path);

      if (error) {
        console.error('Error downloading file:', error);
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const deleteDocument = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([document.file_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('consultant_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) {
        console.error('Error deleting from database:', dbError);
        return;
      }

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesClient = clientFilter === 'all' || doc.client_id === clientFilter;
    
    return matchesSearch && matchesCategory && matchesClient;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600">Upload, organize, and manage your documents</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Documents
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {DOCUMENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {`${client.first_name} ${client.last_name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-3">
              {uploadProgress.map((progress, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>{progress.fileName}</span>
                      <span className={`font-medium ${
                        progress.status === 'completed' ? 'text-green-600' :
                        progress.status === 'error' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {progress.status === 'completed' ? 'Completed' :
                         progress.status === 'error' ? 'Error' :
                         `${progress.progress}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progress.status === 'completed' ? 'bg-green-500' :
                          progress.status === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                    {progress.error && (
                      <p className="text-red-600 text-xs mt-1">{progress.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">Upload your first document to get started</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Documents
              </button>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <div key={document.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600">
                        {getFileIcon(document.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                        <p className="text-sm text-gray-500">{formatFileSize(document.file_size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {document.is_public ? (
                        <Unlock className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FolderPlus className="w-4 h-4 mr-2" />
                      <span className="capitalize">{document.category.replace('_', ' ')}</span>
                    </div>
                    
                    {document.client && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{`${document.client.first_name} ${document.client.last_name}`}</span>
                      </div>
                    )}
                    
                    {document.project && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        <span>{document.project.title}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(document.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {document.metadata?.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {document.metadata.description}
                    </p>
                  )}

                  {document.metadata?.tags && document.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {document.metadata.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {document.metadata.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{document.metadata.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadDocument(document)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => deleteDocument(document)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* File Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Files
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ALLOWED_FILE_TYPES.join(',')}
                      onChange={(e) => setSelectedFiles(e.target.files)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 50MB. Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT, CSV
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {DOCUMENT_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client (Optional)
                    </label>
                    <select
                      value={uploadClientId}
                      onChange={(e) => setUploadClientId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {`${client.first_name} ${client.last_name}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project (Optional)
                    </label>
                    <select
                      value={uploadProjectId}
                      onChange={(e) => setUploadProjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a project</option>
                      {projects
                        .filter(project => !uploadClientId || project.client_id === uploadClientId)
                        .map(project => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the document..."
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (Optional)
                    </label>
                    <input
                      type="text"
                      value={uploadTags}
                      onChange={(e) => setUploadTags(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>

                  {/* Public/Private */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                      Make documents publicly accessible
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFileUpload}
                    disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Upload Documents'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantDocuments;