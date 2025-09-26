import React from 'react';
import { CountryFormSection, CountryFormField, CountryConfiguration } from '@consulting19/shared';
import { Upload, User, Phone, FileText } from 'lucide-react';

interface ShareholderData {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportFile: File | null;
  passportFileName?: string;
}

interface DynamicCompanyDetailsProps {
  countryConfig: CountryConfiguration;
  formData: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export const DynamicCompanyDetails: React.FC<DynamicCompanyDetailsProps> = ({
  countryConfig,
  formData,
  onChange,
  errors = {}
}) => {
  const sections = countryConfig.companyDetailsForm.sections;

  // Handle shareholder count changes
  const handleShareholderCountChange = (fieldId: string, value: number | undefined) => {
    onChange(fieldId, value);
    
    // Only update shareholder details array if value is a valid number
    if (typeof value === 'number' && value > 0) {
      const currentShareholders = formData.shareholderDetails || [];
      const newShareholders: ShareholderData[] = [];
      
      for (let i = 0; i < value; i++) {
        if (currentShareholders[i]) {
          newShareholders.push(currentShareholders[i]);
        } else {
          newShareholders.push({
            id: `shareholder-${i + 1}`,
            fullName: '',
            phoneNumber: '',
            passportFile: null,
            passportFileName: undefined
          });
        }
      }
      
      onChange('shareholderDetails', newShareholders);
    }
  };

  // Handle shareholder detail changes
  const handleShareholderChange = (shareholderId: string, field: keyof ShareholderData, value: any) => {
    const currentShareholders = formData.shareholderDetails || [];
    const updatedShareholders = currentShareholders.map((shareholder: ShareholderData) =>
      shareholder.id === shareholderId ? { ...shareholder, [field]: value } : shareholder
    );
    onChange('shareholderDetails', updatedShareholders);
  };

  // Handle file upload for shareholders
  const handleFileUpload = (shareholderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleShareholderChange(shareholderId, 'passportFile', file);
      handleShareholderChange(shareholderId, 'passportFileName', file.name);
    }
  };

  const renderField = (field: CountryFormField) => {
    const value = formData[field.id] !== undefined ? formData[field.id] : (field.defaultValue !== undefined ? field.defaultValue : '');
    const error = errors[field.id];

    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numValue = inputValue === '' ? undefined : Number(inputValue);
              // Special handling for shareholders field
              if (field.id === 'shareholders') {
                handleShareholderCountChange(field.id, numValue);
              } else {
                onChange(field.id, numValue);
              }
            }}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseClasses} min-h-[100px] resize-vertical`}
            required={field.required}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={Boolean(value)}
              onChange={(e) => onChange(field.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required={field.required}
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  required={field.required}
                />
                <label htmlFor={`${field.id}-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Render shareholder details section
  const renderShareholderDetails = () => {
    const shareholderCount = formData.shareholders || 0;
    const shareholderDetails = formData.shareholderDetails || [];

    if (shareholderCount === 0) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Shareholder Details
          </h3>
          <p className="text-sm text-gray-600">
            Please provide details for each shareholder
          </p>
        </div>

        <div className="space-y-6">
          {shareholderDetails.map((shareholder: ShareholderData, index: number) => (
            <div key={shareholder.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Shareholder {index + 1}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shareholder.fullName}
                    onChange={(e) => handleShareholderChange(shareholder.id, 'fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
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
                      value={shareholder.phoneNumber}
                      onChange={(e) => handleShareholderChange(shareholder.id, 'phoneNumber', e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  const validateField = (field: CountryFormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation;

      if (field.type === 'text' || field.type === 'textarea') {
        const stringValue = String(value || '');
        if (min && stringValue.length < min) {
          return message || `${field.label} must be at least ${min} characters`;
        }
        if (max && stringValue.length > max) {
          return message || `${field.label} must be no more than ${max} characters`;
        }
        if (pattern && !new RegExp(pattern).test(stringValue)) {
          return message || `${field.label} format is invalid`;
        }
      }

      if (field.type === 'number') {
        const numValue = Number(value);
        if (min && numValue < min) {
          return message || `${field.label} must be at least ${min}`;
        }
        if (max && numValue > max) {
          return message || `${field.label} must be no more than ${max}`;
        }
      }
    }

    return null;
  };

  const isFieldVisible = (field: CountryFormField, section: CountryFormSection): boolean => {
    if (!section.conditional) return true;
    
    const conditionValue = formData[section.conditional.field];
    return conditionValue === section.conditional.value;
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-sm text-gray-600">{section.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields
              .filter((field) => isFieldVisible(field, section))
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <div
                  key={field.id}
                  className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                >
                  {field.type !== 'checkbox' && (
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  
                  {renderField(field)}
                  
                  {field.description && (
                    <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                  )}
                  
                  {errors[field.id] && (
                    <p className="mt-1 text-xs text-red-600">{errors[field.id]}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      
      {/* Render shareholder details if shareholders count > 0 */}
      {renderShareholderDetails()}
    </div>
  );
};

export default DynamicCompanyDetails;