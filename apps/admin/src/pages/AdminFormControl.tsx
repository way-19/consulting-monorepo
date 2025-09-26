import React, { useState, useEffect } from 'react';
import { 
  Globe,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  FileText,
  Users,
  DollarSign,
  Power,
  PowerOff
} from 'lucide-react';
import { 
  CountryConfigService, 
  CountryConfiguration, 
  CountryFormField, 
  CountryPackage, 
  CountryService 
} from '@consulting19/shared';

const AdminFormControl: React.FC = () => {
  // CMS state
  const [countries, setCountries] = useState<CountryConfiguration[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfiguration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'countries'>('countries');
  const [activeCountryTab, setActiveCountryTab] = useState<'general' | 'forms' | 'packages' | 'services'>('general');

  // Load data on component mount
  useEffect(() => {
    initializeData();
  }, []);

  // Initialize data including passive countries
  const initializeData = () => {
    const configService = CountryConfigService.getInstance();
    
    // Initialize passive countries from order form
    configService.initializePassiveCountries();
    
    // Load all countries
    loadCountries();
  };

  // Load countries
  const loadCountries = () => {
    const configService = CountryConfigService.getInstance();
    const allCountries = configService.getAllConfigurations();
    setCountries(allCountries);
  };

  // Toggle country active status
  const toggleCountryStatus = async (countryCode: string) => {
    try {
      console.log('🔧 ADMIN APP - Toggling country status for:', countryCode);
      console.log('🔧 ADMIN APP - Current URL:', window.location.href);
      
      const configService = CountryConfigService.getInstance();
      const country = configService.getCountryConfig(countryCode);
      if (country) {
        console.log('🔧 ADMIN APP - Country before update:', country);
        const updatedCountry = { ...country, active: !country.active };
        console.log('🔧 ADMIN APP - Country after update:', updatedCountry);
        
        console.log('🔧 ADMIN APP - About to call saveConfiguration...');
        await configService.saveConfiguration(updatedCountry);
        console.log('🔧 ADMIN APP - saveConfiguration completed');
        
        // Check localStorage after save
        const localStorageData = localStorage.getItem('country_configurations');
        console.log('🔧 ADMIN APP - localStorage after save:', localStorageData);
        
        // Check if CrossDomainSync is working
        console.log('🔧 ADMIN APP - Checking CrossDomainSync instance...');
        const crossDomainSync = (configService as any).crossDomainSync;
        console.log('🔧 ADMIN APP - CrossDomainSync instance:', crossDomainSync);
        
        loadCountries();
        if (selectedCountry?.countryCode === countryCode) {
          setSelectedCountry(updatedCountry);
        }
      }
    } catch (error) {
      console.error('Error toggling country status:', error);
      alert('Error updating country status');
    }
  };

  // Create new country
  const createNewCountry = () => {
    const newCountry: CountryConfiguration = {
      countryCode: '',
      countryName: '',
      active: true,
      basePrice: 0,
      timeframe: '7-10 days',
      currency: 'USD',
      companyDetailsForm: {
        sections: []
      },
      packages: [],
      services: [],
      legalRequirements: {
        requiredDocuments: [],
        companyTypes: []
      },
      localization: {
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
        timezone: 'UTC'
      },
      metadata: {
        consultantRequired: true,
        estimatedProcessingTime: '7-10 business days',
        supportedLanguages: ['en']
      }
    };
    setSelectedCountry(newCountry);
    setIsEditing(true);
  };

  // Save country configuration
  const saveCountryConfiguration = async () => {
    if (!selectedCountry) return;

    try {
      const configService = CountryConfigService.getInstance();
      await configService.saveConfiguration(selectedCountry);
      loadCountries();
      setIsEditing(false);
      alert('Country configuration saved successfully!');
    } catch (error) {
      console.error('Error saving country configuration:', error);
      alert('Error saving country configuration');
    }
  };

  // Add form field
  const addFormField = () => {
    if (!selectedCountry) return;

    const newField: CountryFormField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: [],
      validation: {}
    };

    // Add to first section or create a new section if none exists
    const sections = selectedCountry.companyDetailsForm.sections;
    if (sections.length === 0) {
      sections.push({
        id: 'general',
        title: 'General Information',
        fields: [newField]
      });
    } else {
      sections[0].fields.push(newField);
    }

    setSelectedCountry({
      ...selectedCountry,
      companyDetailsForm: {
        ...selectedCountry.companyDetailsForm,
        sections: [...sections]
      }
    });
  };

  // Remove form field
  const removeFormField = (fieldId: string) => {
    if (!selectedCountry) return;

    const updatedSections = selectedCountry.companyDetailsForm.sections.map(section => ({
      ...section,
      fields: section.fields.filter(field => field.id !== fieldId)
    }));

    setSelectedCountry({
      ...selectedCountry,
      companyDetailsForm: {
        ...selectedCountry.companyDetailsForm,
        sections: updatedSections
      }
    });
  };

  // Add package
  const addPackage = () => {
    if (!selectedCountry) return;

    const newPackage: CountryPackage = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      currency: selectedCountry.currency,
      features: [],
      isPopular: false
    };

    setSelectedCountry({
      ...selectedCountry,
      packages: [...selectedCountry.packages, newPackage]
    });
  };

  // Remove package
  const removePackage = (packageId: number) => {
    if (!selectedCountry) return;

    setSelectedCountry({
      ...selectedCountry,
      packages: selectedCountry.packages.filter(pkg => pkg.id !== packageId)
    });
  };

  // Add service
  const addService = () => {
    if (!selectedCountry) return;

    const newService: CountryService = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      currency: selectedCountry.currency,
      category: '',
      deliveryTime: '',
      isPopular: false
    };

    setSelectedCountry({
      ...selectedCountry,
      services: [...selectedCountry.services, newService]
    });
  };

  // Remove service
  const removeService = (serviceId: number) => {
    if (!selectedCountry) return;

    setSelectedCountry({
      ...selectedCountry,
      services: selectedCountry.services.filter(service => service.id !== serviceId)
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Control & CMS</h1>
        <p className="text-gray-600">Manage country configurations, forms, packages, and services</p>
        

      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('countries')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'countries'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Country Management
        </button>
      </div>

      {/* Country Management Tab */}
      {activeTab === 'countries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Countries List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Countries</h3>
                <button
                  onClick={createNewCountry}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Country
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {countries.map((country) => (
                    <div
                      key={country.countryCode}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCountry?.countryCode === country.countryCode
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!country.active ? 'opacity-60' : ''}`}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsEditing(false);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{country.countryName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              country.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {country.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{country.countryCode} • {country.currency} • {country.timeframe}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCountryStatus(country.countryCode);
                            }}
                            className={`p-1 rounded ${
                              country.active 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-red-600 hover:text-red-700'
                            }`}
                            title={country.active ? 'Deactivate' : 'Activate'}
                          >
                            {country.active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCountry(country);
                              setIsEditing(true);
                            }}
                            className="text-gray-400 hover:text-blue-600 p-1 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Country Details */}
          <div className="lg:col-span-2">
            {selectedCountry ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCountry.countryName || 'Country Details'}
                  </h3>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveCountryConfiguration}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                          }}
                          className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Country Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-8 px-4">
                    {['general', 'forms', 'packages', 'services'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveCountryTab(tab as any)}
                        className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                          activeCountryTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab === 'general' && <Settings className="w-4 h-4 inline mr-1" />}
                        {tab === 'forms' && <FileText className="w-4 h-4 inline mr-1" />}
                        {tab === 'packages' && <Package className="w-4 h-4 inline mr-1" />}
                        {tab === 'services' && <DollarSign className="w-4 h-4 inline mr-1" />}
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <>
                    {/* General Tab */}
                    {activeCountryTab === 'general' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country Name
                          </label>
                          <input
                            type="text"
                            value={selectedCountry?.countryName || ''}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              countryName: e.target.value
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country Code
                          </label>
                          <input
                            type="text"
                            value={selectedCountry?.countryCode || ''}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              countryCode: e.target.value.toUpperCase()
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                          </label>
                          <input
                            type="text"
                            value={selectedCountry?.currency || ''}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              currency: e.target.value
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <input
                            type="text"
                            value={selectedCountry?.localization?.language || ''}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              localization: {
                                ...selectedCountry!.localization,
                                language: e.target.value
                              }
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                          </label>
                          <input
                            type="text"
                            value={selectedCountry?.localization?.timezone || ''}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              localization: {
                                ...selectedCountry!.localization,
                                timezone: e.target.value
                              }
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeframe
                          </label>
                          <input
                            type="text"
                            value={selectedCountry?.timeframe || ''}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              timeframe: e.target.value
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Base Price
                          </label>
                          <input
                            type="number"
                            value={selectedCountry?.basePrice || 0}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              basePrice: parseFloat(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={selectedCountry?.active || false}
                            onChange={(e) => setSelectedCountry({
                              ...selectedCountry!,
                              active: e.target.checked
                            })}
                            disabled={!isEditing}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Forms Tab */}
                  {activeCountryTab === 'forms' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Form Fields</h4>
                        {isEditing && (
                          <button
                            onClick={addFormField}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Field
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {selectedCountry.companyDetailsForm.sections.map((section) => (
                          <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-4">{section.title}</h4>
                            <div className="space-y-4">
                              {section.fields.map((field, index) => (
                                <div key={field.id} className="border border-gray-100 rounded-lg p-3">
                                  <div className="flex justify-between items-start mb-3">
                                    <h5 className="font-medium text-gray-900">Field {index + 1}</h5>
                                    {isEditing && (
                                      <button
                                        onClick={() => removeFormField(field.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Field Label
                                      </label>
                                      <input
                                        type="text"
                                        value={field?.label || ''}
                                        onChange={(e) => {
                                          const updatedSections = selectedCountry!.companyDetailsForm.sections.map(s => ({
                                            ...s,
                                            fields: s.fields.map(f =>
                                              f.id === field.id ? { ...f, label: e.target.value } : f
                                            )
                                          }));
                                          setSelectedCountry({ 
                                            ...selectedCountry!, 
                                            companyDetailsForm: {
                                              ...selectedCountry!.companyDetailsForm,
                                              sections: updatedSections
                                            }
                                          });
                                        }}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Field Type
                                      </label>
                                      <select
                                        value={field?.type || 'text'}
                                        onChange={(e) => {
                                          const updatedSections = selectedCountry!.companyDetailsForm.sections.map(s => ({
                                            ...s,
                                            fields: s.fields.map(f =>
                                              f.id === field.id ? { ...f, type: e.target.value as any } : f
                                            )
                                          }));
                                          setSelectedCountry({ 
                                            ...selectedCountry!, 
                                            companyDetailsForm: {
                                              ...selectedCountry!.companyDetailsForm,
                                              sections: updatedSections
                                            }
                                          });
                                        }}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                      >
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="number">Number</option>
                                        <option value="select">Select</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="radio">Radio</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                      {/* Packages Tab */}
                      {activeCountryTab === 'packages' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Packages</h4>
                        {isEditing && (
                          <button
                            onClick={addPackage}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Package
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {selectedCountry.packages.map((pkg, index) => (
                          <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-gray-900">Package {index + 1}</h5>
                              {isEditing && (
                                <button
                                  onClick={() => removePackage(pkg.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Package Name
                                </label>
                                <input
                                  type="text"
                                  value={pkg?.name || ''}
                                  onChange={(e) => {
                                    const updatedPackages = selectedCountry!.packages.map(p =>
                                      p.id === pkg.id ? { ...p, name: e.target.value } : p
                                    );
                                    setSelectedCountry({ ...selectedCountry!, packages: updatedPackages });
                                  }}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Price
                                </label>
                                <input
                                  type="number"
                                  value={pkg?.price || 0}
                                  onChange={(e) => {
                                    const updatedPackages = selectedCountry!.packages.map(p =>
                                      p.id === pkg.id ? { ...p, price: parseFloat(e.target.value) || 0 } : p
                                    );
                                    setSelectedCountry({ ...selectedCountry!, packages: updatedPackages });
                                  }}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Tab */}
                  {activeCountryTab === 'services' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Services</h4>
                        {isEditing && (
                          <button
                            onClick={addService}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Service
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {selectedCountry.services.map((service, index) => (
                          <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-gray-900">Service {index + 1}</h5>
                              {isEditing && (
                                <button
                                  onClick={() => removeService(service.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Service Name
                                </label>
                                <input
                                  type="text"
                                  value={service?.name || ''}
                                  onChange={(e) => {
                                    const updatedServices = selectedCountry!.services.map(s =>
                                      s.id === service.id ? { ...s, name: e.target.value } : s
                                    );
                                    setSelectedCountry({ ...selectedCountry!, services: updatedServices });
                                  }}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Price
                                </label>
                                <input
                                  type="number"
                                  value={service?.price || 0}
                                  onChange={(e) => {
                                    const updatedServices = selectedCountry!.services.map(s =>
                                      s.id === service.id ? { ...s, price: parseFloat(e.target.value) || 0 } : s
                                    );
                                    setSelectedCountry({ ...selectedCountry!, services: updatedServices });
                                  }}
                                  disabled={!isEditing}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Country Selected</h3>
                <p className="text-gray-600">Select a country from the list to view and edit its configuration.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFormControl;