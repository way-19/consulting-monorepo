import { 
  CountryConfiguration, 
  CountryConfigurationManager, 
  CountryPackage, 
  CountryService, 
  CountryFormSection 
} from '../types/country-config';
import { CrossDomainSync } from './CrossDomainSync';
import { supabase } from '../lib/supabase';

export class CountryConfigService implements CountryConfigurationManager {
  private static instance: CountryConfigService;
  private configurations: Map<string, CountryConfiguration> = new Map();
  private readonly STORAGE_KEY = 'country_configurations';
  private crossDomainSync: CrossDomainSync;

  private constructor() {
    this.crossDomainSync = CrossDomainSync.getInstance();
    this.setupCrossDomainSync();
    this.loadFromStorage();
    this.initializeDefaultConfigurations();
    this.initializePassiveCountries();
    
    // Load from database and sync with localStorage
    this.loadFromDatabase();
  }

  private setupCrossDomainSync(): void {
    // Listen for cross-domain updates
    this.crossDomainSync.addListener((data) => {
      if (data && data.key === this.STORAGE_KEY) {
        console.log('Received cross-domain country config update');
        this.loadFromStorage();
      }
    });

    // Request initial sync when service starts
    setTimeout(() => {
      this.crossDomainSync.requestSync();
    }, 1000);
  }

  public static getInstance(): CountryConfigService {
    if (!CountryConfigService.instance) {
      CountryConfigService.instance = new CountryConfigService();
    }
    return CountryConfigService.instance;
  }

  private initializeDefaultConfigurations(): void {
    // Georgia Configuration
    this.configurations.set('GE', {
      countryCode: 'GE',
      countryName: 'Georgia',
      active: true,
      basePrice: 1200,
      timeframe: '5-7 days',
      currency: 'USD',
      
      companyDetailsForm: {
        sections: [
          {
            id: 'basic-info',
            title: 'Basic Company Information',
            description: 'Enter your company\'s basic details',
            order: 1,
            fields: [
              {
                id: 'companyName',
                type: 'text',
                label: 'Company Name',
                placeholder: 'Enter your company name',
                required: true,
                order: 1,
                validation: {
                  min: 2,
                  max: 100,
                  message: 'Company name must be between 2-100 characters'
                }
              },
              {
                id: 'businessType',
                type: 'select',
                label: 'Business Type',
                required: true,
                order: 2,
                options: [
                  { value: 'LLC', label: 'Limited Liability Company (LLC)' },
                  { value: 'JSC', label: 'Joint Stock Company (JSC)' },
                  { value: 'LP', label: 'Limited Partnership (LP)' },
                  { value: 'GP', label: 'General Partnership (GP)' }
                ]
              },
              {
                id: 'shareholders',
                type: 'number',
                label: 'Number of Shareholders',
                required: true,
                order: 3,
                defaultValue: 1,
                validation: {
                  min: 1,
                  max: 50,
                  message: 'Number of shareholders must be between 1-50'
                }
              },
              {
                id: 'authorizedCapital',
                type: 'number',
                label: 'Authorized Capital (GEL)',
                required: true,
                order: 4,
                defaultValue: 1000,
                validation: {
                  min: 1,
                  message: 'Minimum authorized capital is 1 GEL'
                }
              },
              {
                id: 'businessActivity',
                type: 'textarea',
                label: 'Business Activity Description',
                placeholder: 'Describe your main business activities',
                required: true,
                order: 5,
                validation: {
                  min: 10,
                  max: 500,
                  message: 'Business activity description must be between 10-500 characters'
                }
              }
            ]
          }
        ]
      },
      
      packages: [
        {
          id: 'basic-ge',
          name: 'Basic Georgia Package',
          price: 999,
          available: true,
          order: 1,
          features: [
            'Company Registration with House of Justice',
            'Tax Registration',
            'Bank Account Opening Support',
            'Digital Certificate',
            'Basic Legal Consultation'
          ]
        },
        {
          id: 'standard-ge',
          name: 'Standard Georgia Package',
          price: 1499,
          originalPrice: 1799,
          popular: true,
          available: true,
          order: 2,
          features: [
            'Everything in Basic',
            'Registered Office Address (Tbilisi)',
            'Company Seal',
            'Share Certificates',
            'Board Resolution Templates',
            'Compliance Calendar',
            'Georgian Tax Consultation'
          ]
        },
        {
          id: 'premium-ge',
          name: 'Premium Georgia Package',
          price: 2299,
          originalPrice: 2799,
          recommended: true,
          available: true,
          order: 3,
          features: [
            'Everything in Standard',
            'Virtual Office (6 months)',
            'Accounting Setup',
            'Legal Document Templates',
            'Priority Support',
            'Annual Compliance Support',
            'Georgian Banking Relationship Manager'
          ]
        },
        {
          id: 'tbilisi-special-ge',
          name: 'Tbilisi Business Hub Package',
          price: 1799,
          available: true,
          order: 4,
          features: [
            'Everything in Standard',
            'Premium Tbilisi Office Address',
            'Local Business Network Access',
            'Government Relations Support',
            'Tbilisi Chamber of Commerce Membership',
            'Local Banking Partnerships'
          ]
        },
        {
          id: 'batumi-special-ge',
          name: 'Batumi Free Zone Package',
          price: 1999,
          available: true,
          order: 5,
          features: [
            'Everything in Standard',
            'Batumi Free Zone Registration',
            'Tax-Free Status Setup',
            'Port & Logistics Support',
            'International Trade Consultation',
            'Free Zone Banking Services'
          ]
        }
      ],
      
      services: [
        {
          id: 'trademark-ge',
          name: 'Georgian Trademark Registration',
          price: 599,
          description: 'Register your trademark in Georgia',
          category: 'Legal',
          available: true,
          order: 1
        },
        {
          id: 'accounting-ge',
          name: 'Monthly Accounting (Georgia)',
          price: 299,
          description: 'Professional bookkeeping services in Georgian',
          category: 'Accounting',
          available: true,
          order: 2
        },
        {
          id: 'virtual-office-ge',
          name: 'Virtual Office Tbilisi (12 months)',
          price: 899,
          description: 'Professional business address in Tbilisi',
          category: 'Office',
          available: true,
          order: 3
        },
        {
          id: 'website-ge',
          name: 'Georgian Business Website',
          price: 1299,
          description: 'Custom website with Georgian language support',
          category: 'Digital',
          available: true,
          order: 4
        }
      ],
      
      legalRequirements: {
        minimumCapital: 1,
        maximumShareholders: 50,
        minimumShareholders: 1,
        requiredDocuments: [
          'Passport copies of all shareholders',
          'Proof of address for all shareholders',
          'Company charter',
          'Shareholder agreement'
        ],
        companyTypes: [
          { value: 'LLC', label: 'Limited Liability Company', description: 'Most popular choice for small businesses' },
          { value: 'JSC', label: 'Joint Stock Company', description: 'Suitable for larger businesses with multiple investors' },
          { value: 'LP', label: 'Limited Partnership', description: 'For businesses with active and passive partners' },
          { value: 'GP', label: 'General Partnership', description: 'Simple partnership structure' }
        ]
      },
      
      localization: {
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'en-US',
        timezone: 'Asia/Tbilisi'
      },
      
      metadata: {
        consultantRequired: true,
        estimatedProcessingTime: '5-7 business days',
        supportedLanguages: ['en', 'ka', 'ru'],
        specialNotes: [
          'Georgia offers 0% corporate tax on reinvested profits',
          'Small business status available for companies with turnover under 500,000 GEL',
          'International banking services available'
        ]
      }
    });

    // Costa Rica Configuration
    this.configurations.set('CR', {
      countryCode: 'CR',
      countryName: 'Costa Rica',
      active: true,
      basePrice: 1800,
      timeframe: '10-14 days',
      currency: 'USD',
      
      companyDetailsForm: {
        sections: [
          {
            id: 'basic-info',
            title: 'Basic Company Information',
            description: 'Enter your company basic details',
            order: 1,
            fields: [
              {
                id: 'companyName',
                type: 'text',
                label: 'Company Name',
                placeholder: 'Enter your company name',
                required: true,
                order: 1,
                validation: {
                  min: 2,
                  max: 100,
                  message: 'Company name must be between 2-100 characters'
                }
              },
              {
                id: 'businessType',
                type: 'select',
                label: 'Company Type',
                required: true,
                order: 2,
                options: [
                  { value: 'SA', label: 'Corporation (S.A.)' },
                  { value: 'SRL', label: 'Limited Liability Company (S.R.L.)' },
                  { value: 'SC', label: 'General Partnership' }
                ]
              },
              {
                id: 'shareholders',
                type: 'number',
                label: 'Number of Shareholders',
                required: true,
                order: 3,
                defaultValue: 2,
                validation: {
                  min: 2,
                  max: 100,
                  message: 'Number of shareholders must be between 2-100'
                }
              },
              {
                id: 'authorizedCapital',
                type: 'number',
                label: 'Authorized Capital (USD)',
                required: true,
                order: 4,
                defaultValue: 1000,
                validation: {
                  min: 1000,
                  message: 'Minimum authorized capital is $1,000 USD'
                }
              },
              {
                id: 'businessActivity',
                type: 'textarea',
                label: 'Business Activity Description',
                placeholder: 'Describe your main business activities',
                required: true,
                order: 5,
                validation: {
                  min: 10,
                  max: 500,
                  message: 'Business activity description must be between 10-500 characters'
                }
              }
            ]
          }
        ]
      },
      
      packages: [
        {
          id: 'basic-cr',
          name: 'Basic Costa Rica Package',
          price: 1299,
          available: true,
          order: 1,
          features: [
            'Company Registration at National Registry',
            'Tax Registration',
            'Bank Account Opening Support',
            'Digital Certificate',
            'Basic Legal Consultation'
          ]
        },
        {
          id: 'standard-cr',
          name: 'Standard Costa Rica Package',
          price: 1899,
          originalPrice: 2199,
          popular: true,
          available: true,
          order: 2,
          features: [
            'Everything in Basic',
            'Registered Office Address (San José)',
            'Company Seal',
            'Share Certificates',
            'Resolution Templates',
            'Compliance Calendar'
          ]
        },
        {
          id: 'premium-cr',
          name: 'Premium Costa Rica Package',
          price: 2799,
          originalPrice: 3299,
          recommended: true,
          available: true,
          order: 3,
          features: [
            'Everything in Standard',
            'Virtual Office (12 months)',
            'Accounting Setup & Training',
            'Legal Document Templates',
            'Dedicated Account Manager',
            'Priority Support',
            'Annual Compliance Support',
            'Costa Rican Banking Relationship Manager'
          ]
        },
        {
          id: 'sanjose-business-cr',
          name: 'San José Business District Package',
          price: 2199,
          available: true,
          order: 4,
          features: [
            'Everything in Standard',
            'Premium San José Office Address',
            'Business District Network Access',
            'Government Relations Support',
            'Costa Rican Chamber of Commerce Membership',
            'Downtown Banking Partnerships'
          ]
        },
        {
          id: 'cartago-tech-cr',
          name: 'Cartago Technology Hub Package',
          price: 2399,
          available: true,
          order: 5,
          features: [
            'Everything in Standard',
            'Technology Park Registration',
            'R&D Tax Incentives Setup',
            'Tech Industry Network Access',
            'Innovation Support Services',
            'Specialized Tech Banking'
          ]
        }
      ],
      
      services: [
        {
          id: 'trademark-cr',
          name: 'Trademark Registration in Costa Rica',
          price: 799,
          description: 'Register your trademark in Costa Rica',
          category: 'Legal',
          available: true,
          order: 1
        },
        {
          id: 'accounting-cr',
          name: 'Monthly Accounting (Costa Rica)',
          price: 399,
          description: 'Professional accounting services',
          category: 'Accounting',
          available: true,
          order: 2
        }
      ],
      
      legalRequirements: {
        minimumCapital: 1000,
        maximumShareholders: 100,
        minimumShareholders: 2,
        requiredDocuments: [
          'Passport copies of all shareholders',
          'Proof of address',
          'Company bylaws',
          'Shareholders agreement'
        ],
        companyTypes: [
          { value: 'SA', label: 'Corporation', description: 'Most common structure for companies' },
          { value: 'SRL', label: 'Limited Liability Company', description: 'For small and medium enterprises' }
        ]
      },
      
      localization: {
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
        timezone: 'America/Costa_Rica'
      },
      
      metadata: {
        consultantRequired: true,
        estimatedProcessingTime: '10-14 business days',
        supportedLanguages: ['en', 'es'],
        specialNotes: [
          'Costa Rica offers political and economic stability',
          'Preferential access to US and European markets',
          'Strong and regulated banking system'
        ]
      }
    });
  }

  // localStorage methods
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.configurations = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load configurations from localStorage:', error);
    }
  }

  public reloadFromStorage(): void {
    this.loadFromStorage();
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.configurations);
      const jsonData = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, jsonData);
      
      // Notify other domains about the update
      this.crossDomainSync.notifyCountryConfigUpdate(this.STORAGE_KEY, jsonData);
      console.log('Country configurations saved and cross-domain sync notified');
    } catch (error) {
      console.warn('Failed to save configurations to localStorage:', error);
    }
  }

  public getCountryConfig(countryCode: string): CountryConfiguration | null {
    return this.configurations.get(countryCode) || null;
  }

  public getAvailableCountries(): CountryConfiguration[] {
    return Array.from(this.configurations.values()).filter(config => config.active);
  }

  public getCountryPackages(countryCode: string): CountryPackage[] {
    const config = this.getCountryConfig(countryCode);
    return config ? config.packages.filter(pkg => pkg.available).sort((a, b) => a.order - b.order) : [];
  }

  public getCountryServices(countryCode: string): CountryService[] {
    const config = this.getCountryConfig(countryCode);
    return config ? config.services.filter(service => service.available).sort((a, b) => a.order - b.order) : [];
  }

  public getCountryFormFields(countryCode: string): CountryFormSection[] {
    const config = this.getCountryConfig(countryCode);
    return config ? config.companyDetailsForm.sections.sort((a, b) => a.order - b.order) : [];
  }

  public validateCountrySelection(countryCode: string): boolean {
    const config = this.getCountryConfig(countryCode);
    return config !== null && config.active;
  }

  // Admin methods for managing configurations
  public addCountryConfiguration(config: CountryConfiguration): void {
    this.configurations.set(config.countryCode, config);
  }

  public updateCountryConfiguration(countryCode: string, updates: Partial<CountryConfiguration>): boolean {
    const existing = this.configurations.get(countryCode);
    if (existing) {
      this.configurations.set(countryCode, { ...existing, ...updates });
      return true;
    }
    return false;
  }

  public removeCountryConfiguration(countryCode: string): boolean {
    return this.configurations.delete(countryCode);
  }

  public getAllConfigurations(): CountryConfiguration[] {
    return Array.from(this.configurations.values());
  }

  public async saveConfiguration(config: CountryConfiguration): Promise<void> {
    try {
      // Validate the configuration
      if (!config.countryCode || !config.countryName) {
        throw new Error('Country code and name are required');
      }

      // Save the configuration (add or update) in memory
      this.configurations.set(config.countryCode, config);
      
      // Save to Supabase database
      const { error: dbError } = await supabase
        .from('country_configurations')
        .upsert({
          country_code: config.countryCode,
          country_name: config.countryName,
          is_active: config.active,
          currency: config.currency || 'USD',
          language: config.localization?.language || 'en',
          time_zone: config.localization?.timezone || 'UTC',
          date_format: config.localization?.dateFormat || 'MM/DD/YYYY',
          minimum_capital: config.legalRequirements?.minimumCapital || 0,
          minimum_directors: config.legalRequirements?.minimumDirectors || 1,
          minimum_shareholders: config.legalRequirements?.minimumShareholders || 1,
          requires_local_director: config.legalRequirements?.localDirectorRequired || false,
          requires_local_address: config.legalRequirements?.residencyRequirement || false,
          allows_foreign_ownership: true, // Default to true
          processing_time: config.timeframe || '5-7 business days',
          popularity: config.metadata?.popularity || 0,
          description: config.metadata?.description || `Company formation in ${config.countryName}`,
          benefits: config.metadata?.benefits || [],
          requirements: config.legalRequirements?.requiredDocuments || [],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'country_code'
        });

      if (dbError) {
        console.error('Database save error:', dbError);
        throw new Error(`Failed to save to database: ${dbError.message}`);
      }

      console.log(`✅ Country configuration for ${config.countryCode} saved to database`);
      
      // Persist to localStorage
      this.saveToStorage();
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }

  public initializePassiveCountries(): void {
    const passiveCountries = [
      { code: 'US', name: 'United States', region: 'North America' },
      { code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
      { code: 'EE', name: 'Estonia', region: 'Europe' },
      { code: 'MT', name: 'Malta', region: 'Europe' },
      { code: 'PT', name: 'Portugal', region: 'Europe' },
      { code: 'PA', name: 'Panama', region: 'Central America' },
      { code: 'CH', name: 'Switzerland', region: 'Europe' },
      { code: 'SG', name: 'Singapore', region: 'Asia' },
      { code: 'NL', name: 'Netherlands', region: 'Europe' },
      { code: 'IE', name: 'Ireland', region: 'Europe' },
      { code: 'GI', name: 'Gibraltar', region: 'Europe' },
      { code: 'LT', name: 'Lithuania', region: 'Europe' },
      { code: 'CA', name: 'Canada', region: 'North America' },
      { code: 'BG', name: 'Bulgaria', region: 'Europe' },
      { code: 'ES', name: 'Spain', region: 'Europe' },
      { code: 'ME', name: 'Montenegro', region: 'Europe' },
      { code: 'NO', name: 'Norway', region: 'Europe' }
    ];

    passiveCountries.forEach(country => {
      // Only add if not already exists
      if (!this.configurations.has(country.code)) {
        const passiveConfig: CountryConfiguration = {
          countryCode: country.code,
          countryName: country.name,
          active: false, // Passive entry
          basePrice: 0,
          timeframe: '0 days',
          currency: 'USD',
          companyDetailsForm: {
            sections: []
          },
          packages: [],
          services: [],
          legalRequirements: {
            minimumCapital: 0,
            minimumDirectors: 1,
            minimumShareholders: 1,
            residencyRequirement: false,
            localDirectorRequired: false,
            corporateDirectorAllowed: true,
            minimumAge: 18,
            allowedBusinessTypes: [],
            restrictedBusinessTypes: [],
            complianceRequirements: []
          },
          localization: {
            language: 'en',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            timeZone: 'UTC',
            translations: {}
          },
          metadata: {
            region: country.region,
            popularity: 0,
            difficulty: 'medium',
            processingTime: '0 days',
            tags: ['passive', 'coming-soon'],
            lastUpdated: new Date().toISOString(),
            version: '1.0.0'
          }
        };
        
        this.configurations.set(country.code, passiveConfig);
      }
    });
    
    // Save to localStorage after adding passive countries
    this.saveToStorage();
  }

  private async loadFromDatabase(): Promise<void> {
    try {
      console.log('🔄 Loading country configurations from database...');
      
      const { data: dbConfigs, error } = await supabase
        .from('country_configurations')
        .select('*')
        .order('country_code');

      if (error) {
        console.warn('Failed to load from database:', error);
        return;
      }

      if (dbConfigs && dbConfigs.length > 0) {
        console.log(`📊 Found ${dbConfigs.length} configurations in database`);
        
        // Convert database records to CountryConfiguration objects
        dbConfigs.forEach(dbConfig => {
          const config: CountryConfiguration = {
            countryCode: dbConfig.country_code,
            countryName: dbConfig.country_name,
            active: dbConfig.is_active,
            basePrice: 0, // This would need to be calculated from packages
            timeframe: dbConfig.processing_time || '5-7 business days',
            currency: dbConfig.currency || 'USD',
            companyDetailsForm: {
              sections: [] // This would need to be loaded from related tables
            },
            packages: [], // This would need to be loaded from related tables
            services: [], // This would need to be loaded from related tables
            legalRequirements: {
              minimumCapital: dbConfig.minimum_capital || 0,
              minimumDirectors: dbConfig.minimum_directors || 1,
              minimumShareholders: dbConfig.minimum_shareholders || 1,
              residencyRequirement: dbConfig.requires_local_address || false,
              localDirectorRequired: dbConfig.requires_local_director || false,
              corporateDirectorAllowed: true,
              minimumAge: 18,
              allowedBusinessTypes: [],
              restrictedBusinessTypes: [],
              complianceRequirements: [],
              requiredDocuments: dbConfig.requirements || []
            },
            localization: {
              language: dbConfig.language || 'en',
              currency: dbConfig.currency || 'USD',
              dateFormat: dbConfig.date_format || 'MM/DD/YYYY',
              timezone: dbConfig.time_zone || 'UTC',
              translations: {}
            },
            metadata: {
              region: 'Unknown',
              popularity: dbConfig.popularity || 0,
              difficulty: 'medium',
              processingTime: dbConfig.processing_time || '5-7 business days',
              tags: dbConfig.is_active ? ['active'] : ['inactive'],
              lastUpdated: dbConfig.updated_at || new Date().toISOString(),
              version: '1.0.0',
              description: dbConfig.description,
              benefits: dbConfig.benefits || []
            }
          };

          // Only update if the database version is newer or if we don't have this config
          const existing = this.configurations.get(config.countryCode);
          if (!existing || (existing.metadata?.lastUpdated && config.metadata?.lastUpdated && 
              new Date(config.metadata.lastUpdated) > new Date(existing.metadata.lastUpdated))) {
            this.configurations.set(config.countryCode, config);
            console.log(`✅ Updated ${config.countryCode} from database`);
          }
        });

        // Save updated configurations to localStorage
        this.saveToStorage();
        console.log('✅ Database sync completed');
      }
    } catch (error) {
      console.warn('Error loading from database:', error);
    }
  }
}