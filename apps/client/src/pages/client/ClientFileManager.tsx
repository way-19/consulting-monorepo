import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, 
  FolderPlus, 
  Upload, 
  Folder,
  Download,
  Trash2,
  Edit2,
  Search,
  Home,
  ChevronRight,
  File,
  Image,
  FileArchive,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface FileFolder {
  id: string;
  name: string;
  path: string;
  parent_folder_id: string | null;
  created_at: string;
}

interface ClientFile {
  id: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  folder_id: string | null;
  folder_name: string | null;
  folder_path: string | null;
  uploaded_by_name: string | null;
  description: string | null;
  tags: string[];
  created_at: string;
}

const ClientFileManager = () => {
  const [folders, setFolders] = useState<FileFolder[]>([]);
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [currentFolderId, searchQuery]);

  const fetchFolders = async () => {
    try {
      const response = await authFetch('/api/file-manager/folders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }

      const data = await response.json();
      setFolders(data.folders || []);
    } catch (err: any) {
      console.error('Error fetching folders:', err);
      setError(err.message || 'Failed to load folders');
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (currentFolderId) {
        params.append('folder_id', currentFolderId);
      } else {
        params.append('folder_id', 'root');
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await authFetch(`/api/file-manager/files?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    try {
      const response = await authFetch('/api/file-manager/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newFolderName,
          parent_folder_id: currentFolderId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create folder');
      }

      setNewFolderName('');
      setShowCreateFolder(false);
      await fetchFolders();
    } catch (err: any) {
      console.error('Error creating folder:', err);
      alert(err.message || 'Failed to create folder');
    }
  };

  const deleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Are you sure you want to delete folder "${folderName}"? This folder must be empty.`)) {
      return;
    }

    try {
      const response = await authFetch(`/api/file-manager/folders/${folderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete folder');
      }

      await fetchFolders();
    } catch (err: any) {
      console.error('Error deleting folder:', err);
      alert(err.message || 'Failed to delete folder');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      if (currentFolderId) {
        formData.append('folder_id', currentFolderId);
      }

      const response = await authFetch('/api/file-manager/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      await fetchFiles();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error uploading file:', err);
      alert(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const response = await authFetch(`/api/file-manager/download/${fileId}`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      alert(err.message || 'Failed to download file');
    }
  };

  const deleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const response = await authFetch(`/api/file-manager/files/${fileId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      await fetchFiles();
    } catch (err: any) {
      console.error('Error deleting file:', err);
      alert(err.message || 'Failed to delete file');
    }
  };

  const renameFile = async (fileId: string) => {
    if (!newFileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    try {
      const response = await authFetch(`/api/file-manager/files/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          original_name: newFileName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rename file');
      }

      setRenameFileId(null);
      setNewFileName('');
      await fetchFiles();
    } catch (err: any) {
      console.error('Error renaming file:', err);
      alert(err.message || 'Failed to rename file');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return <FileArchive className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCurrentPath = () => {
    if (!currentFolderId) return [];
    
    const path: FileFolder[] = [];
    let folderId: string | null = currentFolderId;
    
    while (folderId) {
      const folder = folders.find(f => f.id === folderId);
      if (!folder) break;
      path.unshift(folder);
      folderId = folder.parent_folder_id;
    }
    
    return path;
  };

  const getCurrentFolderSubfolders = () => {
    return folders.filter(f => f.parent_folder_id === currentFolderId);
  };

  if (loading && files.length === 0) {
    return (
      <>
        <Helmet>
          <title>File Manager - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
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
        <title>File Manager - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
            <p className="text-gray-600 mt-1">Organize and manage your business documents</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </button>
          {getCurrentPath().map(folder => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => setCurrentFolderId(folder.id)}
                className="text-gray-600 hover:text-gray-900"
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Folders */}
        {getCurrentFolderSubfolders().length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Folders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getCurrentFolderSubfolders().map(folder => (
                <div
                  key={folder.id}
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <button
                      onClick={() => setCurrentFolderId(folder.id)}
                      className="flex items-center space-x-2 flex-1"
                    >
                      <Folder className="w-8 h-8 text-blue-500" />
                      <span className="font-medium text-gray-900 truncate">{folder.name}</span>
                    </button>
                    <button
                      onClick={() => deleteFolder(folder.id, folder.name)}
                      className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Files</h2>
          {files.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Files</h3>
              <p className="text-gray-600 mb-6">
                Upload files to get started
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {files.map(file => (
                <div key={file.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="text-gray-500">
                        {getFileIcon(file.mime_type)}
                      </div>
                      {renameFileId === file.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                          <button
                            onClick={() => renameFile(file.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setRenameFileId(null);
                              setNewFileName('');
                            }}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.original_name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setRenameFileId(file.id);
                          setNewFileName(file.original_name);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadFile(file.id, file.original_name)}
                        className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFile(file.id, file.original_name)}
                        className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={createFolder}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientFileManager;
