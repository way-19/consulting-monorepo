import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FolderPlus, 
  Upload, 
  Download, 
  Search,
  Filter,
  Star,
  MoreVertical,
  Eye,
  Trash2,
  Move,
  Copy,
  Lock,
  Unlock,
  Calendar,
  User,
  FileText,
  Image,
  Archive,
  HardDrive,
  AlertTriangle,
  Crown,
  Zap,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  file_type?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  folder_path: string;
  parent_folder_id?: string;
  is_starred: boolean;
  is_shared: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface StorageStats {
  storage_limit_gb: number;
  storage_used_bytes: number;
  storage_used_mb: number;
  storage_percentage: number;
  files_count: number;
  tier: string;
}

const ClientFileManager = () => {
  const { user, profile } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [clientStatus, setClientStatus] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Storage tier configurations
  const storageTiers = {
    basic: { limit: 5, price: 0, name: 'Basic (Free)', color: 'gray' },
    standard: { limit: 20, price: 19, name: 'Standard', color: 'blue' },
    premium: { limit: 50, price: 49, name: 'Premium', color: 'purple' },
    enterprise: { limit: 100, price: 99, name: 'Enterprise', color: 'gold' }
  };

  // Allowed file types
  const allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  const allowedExtensions = ['.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png'];

  useEffect(() => {
    if (user && profile) {
      checkClientAccess();
    }
  }, [user, profile, currentPath]);

  const checkClientAccess = async () => {
    try {
      setCheckingAccess(true);
      
      // Get client status first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, status, storage_tier')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('Client fetch error:', clientError);
        setError('Unable to verify client status');
        setCheckingAccess(false);
        return;
      }

      if (!clientData) {
        setError('Client record not found');
        setClientStatus(null);
        setCheckingAccess(false);
        return;
      }

      setClientStatus(clientData.status);
      
      // If client is active, fetch storage stats and files
      if (clientData.status === 'active') {
        await fetchStorageStats();
        await fetchFiles();
      }
      
      setCheckingAccess(false);
    } catch (err) {
      console.error('Error checking client access:', err);
      setError('An unexpected error occurred');
      setCheckingAccess(false);
    }
  };
  const fetchStorageStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_storage_stats', { user_id_param: user?.id });

      if (error) {
        console.error('Error fetching storage stats:', error);
        return;
      }

      if (data && data.length > 0) {
        setStorageStats(data[0]);
      }
    } catch (err) {
      console.error('Storage stats fetch error:', err);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, status, storage_tier')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('Client fetch error:', clientError);
        setError('Unable to load client data');
        return;
      }

      if (!clientData) {
        setError('No client record found');
        return;
      }

      // Check if user has active service
      if (clientData.status !== 'active') {
        setError('File Manager requires an active consulting service');
        setLoading(false);
        return;
      }

      // Fetch files for current path
      const { data: filesData, error: filesError } = await supabase
        .from('file_manager')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('folder_path', currentPath)
        .order('type', { ascending: false })
        .order('name', { ascending: true });

      if (filesError) {
        console.error('Files fetch error:', filesError);
        setError('Unable to load files');
        return;
      }

      setFiles(filesData || []);
      setError('');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validateFileType = (file: File): boolean => {
    return allowedFileTypes.includes(file.type);
  };

  const checkStorageLimit = (fileSize: number): boolean => {
    if (!storageStats) return false;
    
    const limitBytes = storageStats.storage_limit_gb * 1024 * 1024 * 1024;
    const newUsage = storageStats.storage_used_bytes + fileSize;
    
    return newUsage <= limitBytes;
  };

  const hasActiveService = (): boolean => {
    return clientStatus === 'active';
  };

  const handleFileUpload = async (files: FileList) => {
    if (!hasActiveService()) {
      setError('File upload requires an active consulting service. Please contact your consultant.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const fileArray = Array.from(files);
      
      // Validate file types
      for (const file of fileArray) {
        if (!validateFileType(file)) {
          setError(`File type not allowed: ${file.name}. Only PDF, DOCX, XLSX, JPG, PNG files are permitted.`);
          return;
        }
        
        if (!checkStorageLimit(file.size)) {
          setError(`Storage limit exceeded. File ${file.name} would exceed your ${storageStats?.storage_limit_gb}GB limit.`);
          return;
        }
      }

      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Upload each file
      for (const file of fileArray) {
        // Upload to Supabase Storage
        const fileName = `file-manager/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(uploadData.path);

        // Save to file_manager table
        const { error: dbError } = await supabase
          .from('file_manager')
          .insert({
            client_id: clientData.id,
            created_by: user?.id,
            name: file.name,
            type: 'file',
            file_type: file.type,
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            folder_path: currentPath,
            is_starred: false,
            is_shared: false,
            version: 1
          });

        if (dbError) {
          throw dbError;
        }
      }

      setSuccessMessage(`Successfully uploaded ${fileArray.length} file(s)!`);
      fetchFiles();
      fetchStorageStats();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!hasActiveService()) {
      setError('Creating folders requires an active consulting service.');
      return;
    }

    if (!newFolderName.trim()) {
      setError('Folder name is required');
      return;
    }

    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      const { error } = await supabase
        .from('file_manager')
        .insert({
          client_id: clientData.id,
          created_by: user?.id,
          name: newFolderName,
          type: 'folder',
          folder_path: currentPath,
          is_starred: false,
          is_shared: false,
          version: 1
        });

      if (error) {
        throw error;
      }

      setSuccessMessage('Folder created successfully!');
      setShowNewFolderModal(false);
      setNewFolderName('');
      fetchFiles();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Folder creation error:', err);
      setError('Failed to create folder. Please try again.');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('file_manager')
        .delete()
        .eq('id', fileId);

      if (error) {
        throw error;
      }

      setSuccessMessage('Item deleted successfully!');
      fetchFiles();
      fetchStorageStats();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const toggleStar = async (fileId: string, currentStarred: boolean) => {
    try {
      const { error } = await supabase
        .from('file_manager')
        .update({ is_starred: !currentStarred })
        .eq('id', fileId);

      if (error) {
        throw error;
      }

      fetchFiles();
    } catch (err) {
      console.error('Star toggle error:', err);
      setError('Failed to update star status.');
    }
  };

  const getFileIcon = (fileType: string, mimeType?: string) => {
    if (mimeType?.startsWith('image/')) return '🖼️';
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word')) return '📝';
    if (mimeType?.includes('excel') || mimeType?.includes('sheet')) return '📊';
    return '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCurrentTier = () => {
    if (!storageStats) return storageTiers.basic;
    return storageTiers[storageStats.tier as keyof typeof storageTiers] || storageTiers.basic;
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const tiers = Object.values(storageTiers);
    const currentIndex = tiers.findIndex(t => t.limit === currentTier.limit);
    return tiers[currentIndex + 1] || null;
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const folders = filteredFiles.filter(item => item.type === 'folder');
  const fileItems = filteredFiles.filter(item => item.type === 'file');

  if (loading || checkingAccess) {
    return (
      <>
        <Helmet>
          <title>File Manager - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (clientStatus !== 'active') {
    return (
      <>
        <Helmet>
          <title>File Manager - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={checkClientAccess}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-900 mb-4">File Manager Access Restricted</h3>
              <p className="text-yellow-800 mb-6">
                The File Manager feature is available only to clients with active consulting services. 
                This ensures secure document handling and professional service delivery.
              </p>
              <div className="bg-white rounded-lg p-4 border border-yellow-300 max-w-md mx-auto">
                <h4 className="font-semibold text-gray-900 mb-2">📋 To Get Access:</h4>
                <ol className="text-sm text-gray-700 text-left space-y-1">
                  <li>1. Purchase a consulting service</li>
                  <li>2. Get assigned to a consultant</li>
                  <li>3. Access your secure file storage</li>
                </ol>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs">
                <strong>Current Status:</strong> {clientStatus || 'Unknown'} | 
                <strong>Required:</strong> active
              </div>
            </div>
          )}
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNewFolderModal(true)}
              disabled={!hasActiveService() || (storageStats && storageStats.storage_percentage >= 95)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </button>
            
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept={allowedExtensions.join(',')}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                !hasActiveService() || (storageStats && storageStats.storage_percentage >= 95) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </label>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {storageStats ? formatFileSize(storageStats.storage_used_bytes) : '0 Bytes'}
                </p>
                <p className="text-xs text-gray-500">
                  of {storageStats?.storage_limit_gb || 5}GB
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {storageStats && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      storageStats.storage_percentage > 90 ? 'bg-red-500' :
                      storageStats.storage_percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(storageStats.storage_percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {storageStats.storage_percentage.toFixed(1)}% used
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{storageStats?.files_count || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-xl font-bold text-gray-900">{getCurrentTier().name}</p>
                <p className="text-xs text-gray-500">{getCurrentTier().limit}GB Storage</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                getCurrentTier().color === 'gold' ? 'bg-yellow-100' :
                getCurrentTier().color === 'purple' ? 'bg-purple-100' :
                getCurrentTier().color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {getCurrentTier().color === 'gold' ? <Crown className="w-6 h-6 text-yellow-600" /> :
                 getCurrentTier().color === 'purple' ? <Zap className="w-6 h-6 text-purple-600" /> :
                 getCurrentTier().color === 'blue' ? <TrendingUp className="w-6 h-6 text-blue-600" /> :
                 <User className="w-6 h-6 text-gray-600" />}
              </div>
            </div>
          </div>

          {getNextTier() && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-sm border border-blue-200">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Upgrade Available</p>
                <p className="text-xl font-bold text-blue-600">{getNextTier()!.name}</p>
                <p className="text-sm text-gray-600 mb-3">${getNextTier()!.price}/month</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Storage Warning */}
        {storageStats && storageStats.storage_percentage > 80 && (
          <div className={`p-4 rounded-lg border ${
            storageStats.storage_percentage > 95 ? 'bg-red-50 border-red-200' :
            storageStats.storage_percentage > 90 ? 'bg-orange-50 border-orange-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${
                storageStats.storage_percentage > 95 ? 'text-red-600' :
                storageStats.storage_percentage > 90 ? 'text-orange-600' :
                'text-yellow-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  storageStats.storage_percentage > 95 ? 'text-red-900' :
                  storageStats.storage_percentage > 90 ? 'text-orange-900' :
                  'text-yellow-900'
                }`}>
                  {storageStats.storage_percentage > 95 ? 'Storage Full' :
                   storageStats.storage_percentage > 90 ? 'Storage Almost Full' :
                   'Storage Warning'}
                </p>
                <p className={`text-xs ${
                  storageStats.storage_percentage > 95 ? 'text-red-800' :
                  storageStats.storage_percentage > 90 ? 'text-orange-800' :
                  'text-yellow-800'
                }`}>
                  {storageStats.storage_percentage > 95 
                    ? 'You cannot upload new files. Please delete some files or upgrade your plan.'
                    : storageStats.storage_percentage > 90
                      ? 'You are running low on storage space. Consider upgrading your plan.'
                      : 'You are approaching your storage limit.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Type Restrictions Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 mt-0.5">📋</div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">File Upload Guidelines</h4>
              <p className="text-xs text-blue-800">
                <strong>Allowed formats:</strong> PDF, DOCX, XLSX, JPG, PNG only • 
                <strong>Max file size:</strong> 50MB per file • 
                <strong>Purpose:</strong> Business documents and images only
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Current path:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {currentPath}
              </span>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredFiles.length > 0 ? (
            <div className="p-6">
              {/* Folders */}
              {folders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Folders</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                      <div key={folder.id} className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">📁</span>
                            <h4 className="font-medium text-gray-900 truncate">{folder.name}</h4>
                          </div>
                          <button
                            onClick={() => toggleStar(folder.id, folder.is_starred)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star className={`w-4 h-4 ${folder.is_starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(folder.created_at).toLocaleDateString()}</span>
                          <button
                            onClick={() => handleDeleteFile(folder.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {fileItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Files</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fileItems.map((file) => (
                      <div key={file.id} className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="text-2xl">{getFileIcon(file.file_type || '', file.mime_type)}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate" title={file.name}>
                                {file.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {file.file_size ? formatFileSize(file.file_size) : 'Unknown size'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleStar(file.id, file.is_starred)}
                            >
                              <Star className={`w-4 h-4 ${file.is_starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </button>
                            {file.file_url && (
                              <button
                                onClick={() => window.open(file.file_url!, '_blank')}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(file.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Files Yet</h3>
              <p className="text-gray-600 mb-6">
                Start uploading your business documents to keep everything organized.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-sm font-semibold text-green-900 mb-2">💼 Professional File Storage</h4>
                <p className="text-xs text-green-800">
                  Upload contracts, certificates, reports and other business documents. 
                  Files are automatically organized and securely stored.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* New Folder Modal */}
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Folder</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name *
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g., Tax Documents, Contracts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Create Folder
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

