import React from 'react';
import { Building, Upload, User, Phone, FileText } from 'lucide-react';

export interface ShareholderData {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportFile: File | null;
  passportFileName?: string;
}

export interface CompanyDetailsData {
  companyName: string;
  businessType: string;
  shareholders: number;
  authorizedCapital: number;
  shareholderDetails: ShareholderData[];
}

interface CompanyDetailsProps {
  companyDetails: CompanyDetailsData;
  onCompanyDetailsChange: (details: CompanyDetailsData) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  companyDetails,
  onCompanyDetailsChange
}) => {
  const handleChange = (field: keyof CompanyDetailsData, value: string | number) => {
    const updatedDetails = {
      ...companyDetails,
      [field]: value
    };

    // When shareholders number changes, update shareholderDetails array
    if (field === 'shareholders') {
      const shareholderCount = value as number;
      const currentShareholders = companyDetails.shareholderDetails || [];
      
      if (shareholderCount > currentShareholders.length) {
        // Add new shareholders
        const newShareholders = [];
        for (let i = currentShareholders.length; i < shareholderCount; i++) {
          newShareholders.push({
            id: `shareholder-${i + 1}`,
            fullName: '',
            phoneNumber: '',
            passportFile: null,
            passportFileName: ''
          });
        }
        updatedDetails.shareholderDetails = [...currentShareholders, ...newShareholders];
      } else if (shareholderCount < currentShareholders.length) {
        // Remove excess shareholders
        updatedDetails.shareholderDetails = currentShareholders.slice(0, shareholderCount);
      }
    }

    onCompanyDetailsChange(updatedDetails);
  };

  const handleShareholderChange = (shareholderId: string, field: keyof ShareholderData, value: string | File | null) => {
    const updatedShareholders = (companyDetails.shareholderDetails || []).map(shareholder => {
      if (shareholder.id === shareholderId) {
        const updatedShareholder = { ...shareholder, [field]: value };
        
        // If uploading a file, also store the filename
        if (field === 'passportFile' && value instanceof File) {
          updatedShareholder.passportFileName = value.name;
        }
        
        return updatedShareholder;
      }
      return shareholder;
    });

    onCompanyDetailsChange({
      ...companyDetails,
      shareholderDetails: updatedShareholders
    });
  };

  const handleFileUpload = (shareholderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleShareholderChange(shareholderId, 'passportFile', file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Details</h2>
        <p className="text-gray-600">Provide information about your company</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your company name"
            value={companyDetails.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={companyDetails.businessType}
            onChange={(e) => handleChange('businessType', e.target.value)}
          >
            <option value="">Select business type</option>
            <option value="llc">Limited Liability Company (LLC)</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
            <option value="sole-proprietorship">Sole Proprietorship</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Shareholders
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={companyDetails.shareholders}
              onChange={(e) => handleChange('shareholders', parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authorized Capital ($)
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={companyDetails.authorizedCapital}
              onChange={(e) => handleChange('authorizedCapital', parseInt(e.target.value) || 50000)}
            />
          </div>
        </div>
      </div>

      {/* Shareholder Details Sections */}
      {companyDetails.shareholderDetails && companyDetails.shareholderDetails.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Shareholder Information</h3>
          </div>
          
          {companyDetails.shareholderDetails.map((shareholder, index) => (
            <div key={shareholder.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Shareholder {index + 1}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                    value={shareholder.fullName}
                    onChange={(e) => handleShareholderChange(shareholder.id, 'fullName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      value={shareholder.phoneNumber}
                      onChange={(e) => handleShareholderChange(shareholder.id, 'phoneNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport/ID Document *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id={`passport-${shareholder.id}`}
                    onChange={(e) => handleFileUpload(shareholder.id, e)}
                  />
                  <label
                    htmlFor={`passport-${shareholder.id}`}
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {shareholder.passportFile ? (
                      <>
                        <FileText className="h-8 w-8 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {shareholder.passportFileName}
                        </span>
                        <span className="text-xs text-gray-500">Click to change file</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Upload Passport/ID Document
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, JPG, PNG up to 10MB
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;