import { Helmet } from 'react-helmet-async';
import { FileText, FolderPlus, Upload } from 'lucide-react';

const ClientFileManager = () => {

  return (
    <>
      <Helmet>
        <title>File Manager - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
          <p className="text-gray-600 mt-1">Organize and manage your business documents</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">File Manager</h3>
          <p className="text-gray-600 mb-6">
            Organize and manage your business documents securely.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientFileManager;

