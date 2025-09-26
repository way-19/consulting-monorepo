import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CountryConfigService, CrossDomainSync } from '@consulting19/shared';

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
  price: number; // This will be the country-specific price
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

  useEffect(() => {
    fetchInitialData();

    // Set up CrossDomainSync listener for automatic updates from admin panel
    const handleCountryConfigUpdate = (data: any) => {
      console.log('🔄 ORDER FORM - Received country config update from admin', data);
      
      // Reload countries from updated localStorage
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

    // Initialize CrossDomainSync and add listener
    const crossDomainSync = CrossDomainSync.getInstance();
    console.log('🔄 ORDER FORM - Setting up CrossDomainSync listener');
    crossDomainSync.addListener(handleCountryConfigUpdate);
    console.log('🔄 ORDER FORM - CrossDomainSync listener added successfully');

    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'country_configurations') {
        console.log('🔄 Country configurations updated in localStorage, refreshing...');
        // Force reload countries from updated localStorage
        setTimeout(() => {
          const configService = CountryConfigService.getInstance();
          configService.reloadFromStorage(); // Force reload from localStorage
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

    // Also listen for focus events to refresh data when user switches back to tab
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
      // Clean up CrossDomainSync listener
      crossDomainSync.removeListener(handleCountryConfigUpdate);
      console.log('🔄 ORDER FORM - CrossDomainSync listener removed');
    };
  }, [countries.length]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Get countries from CountryConfigService instead of Supabase
      const configService = CountryConfigService.getInstance();
      const availableCountries = configService.getAvailableCountries();
      
      // Convert CountryConfiguration to Country interface
      const formattedCountries: Country[] = availableCountries.map(config => ({
        id: config.countryCode,
        name: config.countryName,
        code: config.countryCode,
        flag_emoji: '🏳️', // Default flag, can be enhanced later
        is_recommended: config.countryCode === 'GE' // Georgia is recommended
      }));

      const [
        packagesRes,
        additionalServicesRes,
        banksRes,
      ] = await Promise.all([
        supabase.from('packages').select('*').eq('is_active', true).order('price'),
        supabase.from('additional_services').select('*').eq('is_active', true).order('base_price'),
        supabase.from('banks').select('*').eq('is_active', true).order('name'),
      ]);

      if (packagesRes.error) throw packagesRes.error;
      if (additionalServicesRes.error) throw additionalServicesRes.error;
      if (banksRes.error) throw banksRes.error;

      setCountries(formattedCountries);
      setPackages(packagesRes.data || []);
      setAdditionalServices(additionalServicesRes.data?.map(s => ({ ...s, price: s.base_price })) || []); // Use base_price as default
      setBanks(banksRes.data || []);

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
      // Calculate total amount
      const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);
      const selectedBank = banks.find(b => b.id === formData.selectedBankId);
      const selectedAddOns = additionalServices.filter(s => formData.selectedAdditionalServiceIds.includes(s.id));

      let totalAmount = 0;
      if (selectedPackage) totalAmount += selectedPackage.price;
      if (selectedBank) totalAmount += selectedBank.price;
      selectedAddOns.forEach(s => totalAmount += s.price);

      // Get client ID (assuming user is logged in and has a client profile)
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error('Kullanıcı girişi yapılmamış.');
      }

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', authUser.user.id)
        .single();

      if (clientError || !clientData) {
        throw new Error('Müşteri profili bulunamadı.');
      }

      // Insert into service_orders table
      const { data: order, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: clientData.id,
          title: `Yeni Sipariş: ${formData.companyName} - ${selectedPackage?.name}`,
          description: `Ülke: ${countries.find(c => c.id === formData.selectedCountryId)?.name}, Banka: ${selectedBank?.name}, Ek Hizmetler: ${selectedAddOns.map(s => s.name).join(', ')}`,
          budget: totalAmount,
          status: 'pending',
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
        })
        .select()
        .single();

      if (orderError) throw orderError;

      alert('Siparişiniz başarıyla oluşturuldu!');
      // Optionally redirect or clear form
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