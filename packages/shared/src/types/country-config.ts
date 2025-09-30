export interface CountryFormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: any;
  description?: string;
  order: number;
}

export interface CountryPackage {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  recommended?: boolean;
  features: string[];
  description?: string;
  available: boolean;
  order: number;
}

export interface CountryService {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
  required?: boolean;
  order: number;
  dependencies?: string[]; // Other service IDs that must be selected first
}

export interface CountryFormSection {
  id: string;
  title: string;
  description?: string;
  fields: CountryFormField[];
  order: number;
  conditional?: {
    field: string;
    value: any;
  };
}

export interface CountryConfiguration {
  countryCode: string;
  countryName: string;
  active: boolean;
  basePrice: number;
  timeframe: string;
  currency: string;
  
  // Form configuration
  companyDetailsForm: {
    sections: CountryFormSection[];
  };
  
  // Package configuration
  packages: CountryPackage[];
  
  // Services configuration
  services: CountryService[];
  
  // Legal requirements
  legalRequirements: {
    minimumCapital?: number;
    maximumShareholders?: number;
    minimumShareholders?: number;
    minimumDirectors?: number;
    minimumAge?: number;
    residencyRequirement?: boolean;
    localDirectorRequired?: boolean;
    corporateDirectorAllowed?: boolean;
    allowedBusinessTypes?: string[];
    restrictedBusinessTypes?: string[];
    complianceRequirements?: string[];
    requiredDocuments: string[];
    companyTypes: { value: string; label: string; description?: string }[];
  };
  
  // Localization
  localization: {
    currency: string;
    dateFormat: string;
    timeZone: string;
    language: string;
    numberFormat: string;
    translations: Record<string, string>;
  };
  
  // Additional metadata
  metadata: {
    consultantRequired: boolean;
    estimatedProcessingTime: string;
    supportedLanguages: string[];
    specialNotes?: string[];
    lastUpdated?: string;
    region?: string;
    popularity?: number;
    difficulty?: string;
    processingTime?: string;
    tags?: string[];
    version?: string;
    description?: string;
    benefits?: string[];
  };
}

export interface CountryConfigurationManager {
  getCountryConfig(countryCode: string): CountryConfiguration | null;
  getAvailableCountries(): CountryConfiguration[];
  getCountryPackages(countryCode: string): CountryPackage[];
  getCountryServices(countryCode: string): CountryService[];
  getCountryFormFields(countryCode: string): CountryFormSection[];
  validateCountrySelection(countryCode: string): boolean;
}