import { useState, useEffect } from 'react';
import { CountryConfigService, CrossDomainSync, createAuthenticatedFetch } from '@consulting19/shared';

export interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji: string;
  is_recommended: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  base_price: number;
  price: number;
}

export interface Bank {
  id: string;
  name: string;
  price: number;
  flag_url: string;
}

export interface OrderFormData {
  companyName: string;
  companyType: string;
  contactEmail: string;
  phoneNumber: string;
  selectedCountryId: string;
  selectedPackageId: string;
  selectedAdditionalServiceIds: string[];
  selectedBankId: string;
}

const initialFormData: OrderFormData = {
  companyName: '',
  companyType: '',
  contactEmail: '',
  phoneNumber: '',
  selectedCountryId: '',
  selectedPackageId: '',
  selectedAdditionalServiceIds: [],
  selectedBankId: '',
};

export const useOrderForm = () => {
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState<Country[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchInitialData();

    const handleCountryConfigUpdate = (data: any) => {
      console.log('🔄 ORDER FORM - Received country config update from admin', data);
      
      const configService = CountryConfigService.getInstance();
      configService.reloadFromStorage();
      
      const availableCountries = configService.getAvailableCountries();
      console.log('🔄 ORDER FORM - Raw updated countries from service:', availableCountries);
      
      const formattedCountries: Country[] = availableCountries.map(config => ({
        id: config.countryCode,
        name: config.countryName,
        code: config.countryCode,
        flag_emoji: '🏳️',
        is_recommended: config.countryCode === 'GE'
      }));
      
      console.log('🔄 ORDER FORM - Formatted updated countries:', formattedCountries);
      setCountries(formattedCountries);
    };

    const crossDomainSync = CrossDomainSync.getInstance();
    console.log('🔄 ORDER FORM - Setting up CrossDomainSync listener');
    crossDomainSync.addListener(handleCountryConfigUpdate);
    console.log('🔄 ORDER FORM - CrossDomainSync listener added successfully');

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'country_configurations') {
        console.log('🔄 Country configurations updated in localStorage, refreshing...');
        setTimeout(() => {
          const configService = CountryConfigService.getInstance();
          configService.reloadFromStorage();
          const availableCountries = configService.getAvailableCountries();
          
          const formattedCountries: Country[] = availableCountries.map(config => ({
            id: config.countryCode,
            name: config.countryName,
            code: config.countryCode,
            flag_emoji: '🏳️',
            is_recommended: config.countryCode === 'GE'
          }));
          
          setCountries(formattedCountries);
          console.log('✅ Countries updated:', formattedCountries.length);
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleFocus = () => {
      console.log('🔄 Tab focused, checking for country updates...');
      const configService = CountryConfigService.getInstance();
      configService.reloadFromStorage();
      const availableCountries = configService.getAvailableCountries();
      
      const formattedCountries: Country[] = availableCountries.map(config => ({
        id: config.countryCode,
        name: config.countryName,
        code: config.countryCode,
        flag_emoji: '🏳️',
        is_recommended: config.countryCode === 'GE'
      }));
      
      if (formattedCountries.length !== countries.length) {
        setCountries(formattedCountries);
        console.log('✅ Countries updated on focus:', formattedCountries.length);
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      crossDomainSync.removeListener(handleCountryConfigUpdate);
      console.log('🔄 ORDER FORM - CrossDomainSync listener removed');
    };
  }, [countries.length]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const configService = CountryConfigService.getInstance();
      const availableCountries = configService.getAvailableCountries();
      
      const formattedCountries: Country[] = availableCountries.map(config => ({
        id: config.countryCode,
        name: config.countryName,
        code: config.countryCode,
        flag_emoji: '🏳️',
        is_recommended: config.countryCode === 'GE'
      }));

      const [
        packagesRes,
        additionalServicesRes,
        banksRes,
      ] = await Promise.all([
        authFetch('/api/orders/packages/list', { method: 'GET' }),
        authFetch('/api/orders/additional-services/list', { method: 'GET' }),
        authFetch('/api/orders/banks/list', { method: 'GET' }),
      ]);

      if (!packagesRes.ok || !additionalServicesRes.ok || !banksRes.ok) {
        throw new Error('Failed to fetch order form data');
      }

      const packagesData = await packagesRes.json();
      const additionalServicesData = await additionalServicesRes.json();
      const banksData = await banksRes.json();

      setCountries(formattedCountries);
      setPackages(packagesData.packages || []);
      setAdditionalServices(additionalServicesData.additional_services?.map((s: any) => ({ ...s, price: s.base_price })) || []);
      setBanks(banksData.banks || []);

    } catch (err: any) {
      console.error('Error fetching initial data:', err);
      setError(err.message || 'Veri çekilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);
      const selectedBank = banks.find(b => b.id === formData.selectedBankId);
      const selectedAddOns = additionalServices.filter(s => formData.selectedAdditionalServiceIds.includes(s.id));

      let totalAmount = 0;
      if (selectedPackage) totalAmount += selectedPackage.price;
      if (selectedBank) totalAmount += selectedBank.price;
      selectedAddOns.forEach(s => totalAmount += s.price);

      const orderData = {
        title: `Yeni Sipariş: ${formData.companyName} - ${selectedPackage?.name}`,
        description: `Ülke: ${countries.find(c => c.id === formData.selectedCountryId)?.name}, Banka: ${selectedBank?.name}, Ek Hizmetler: ${selectedAddOns.map(s => s.name).join(', ')}`,
        budget: totalAmount,
        country_code: formData.selectedCountryId,
        selected_package_id: formData.selectedPackageId,
        additional_service_ids: formData.selectedAdditionalServiceIds,
        customer_details: {
          contactEmail: formData.contactEmail,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName,
          companyType: formData.companyType,
        },
        total_amount: totalAmount,
        currency: 'USD',
      };

      const response = await authFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      alert('Siparişiniz başarıyla oluşturuldu!');
      setFormData(initialFormData);
      setCurrentStep(1);

    } catch (err: any) {
      console.error('Sipariş oluşturulurken hata:', err);
      setError(err.message || 'Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    countries,
    packages,
    additionalServices,
    banks,
    loading,
    error,
    handleSubmit,
    isSubmitting,
  };
};
