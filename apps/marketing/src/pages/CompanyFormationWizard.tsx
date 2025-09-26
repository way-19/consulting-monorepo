import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, Building, Package as PackageIcon, Plus, Check, Clock, Shield, Award, Star, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CountryConfigService, CountryConfiguration, CrossDomainSync } from '@consulting19/shared';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// Import modular components
import CountrySelection, { Country } from '../components/wizard/CountrySelection';
import PackageSelection, { Package as PackageType } from '../components/wizard/PackageSelection';
import AdditionalServices, { AdditionalService } from '../components/wizard/AdditionalServices';
import CompanyDetails, { CompanyDetailsData } from '../components/wizard/CompanyDetails';
import UserCredentials, { UserCredentialsData } from '../components/wizard/UserCredentials';
import OrderSummary from '../components/wizard/OrderSummary';

// Import new dynamic components
import DynamicPackageSelection from '../components/wizard/DynamicPackageSelection';
import DynamicAdditionalServices from '../components/wizard/DynamicAdditionalServices';
import DynamicCompanyDetails from '../components/wizard/DynamicCompanyDetails';

interface Consultant {
  id: string;
  name: string;
  country: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'coming_soon';
  specialties: string[];
}

const CompanyFormationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [selectedServices, setSelectedServices] = useState<AdditionalService[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsData>({
    companyName: '',
    businessType: '',
    shareholders: 1,
    authorizedCapital: 50000,
    shareholderDetails: [{
      id: 'shareholder-1',
      fullName: '',
      phoneNumber: '',
      passportFile: null,
      passportFileName: ''
    }]
  });
  const [userCredentials, setUserCredentials] = useState<UserCredentialsData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [assignedConsultant, setAssignedConsultant] = useState<Consultant | null>(null);

  // New state for country configuration
  const [countryConfig, setCountryConfig] = useState<CountryConfiguration | null>(null);
  const [dynamicCompanyData, setDynamicCompanyData] = useState<Record<string, any>>({});
  const [selectedDynamicPackage, setSelectedDynamicPackage] = useState<string | null>(null);
  const [selectedDynamicServices, setSelectedDynamicServices] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Load country configuration when country is selected
  useEffect(() => {
    if (selectedCountry) {
      const config = CountryConfigService.getInstance().getCountryConfig(selectedCountry.code);
      setCountryConfig(config);
      
      // Initialize dynamic form data with default values
      const initialData: Record<string, any> = {};
      config.companyDetailsForm.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            initialData[field.id] = field.defaultValue;
          }
        });
      });
      
      setDynamicCompanyData(initialData);
      setSelectedDynamicPackage(null);
      setSelectedDynamicServices([]);
      setFormErrors({});
    }
  }, [selectedCountry]);

  // Get countries from CountryConfigService
  const [countries, setCountries] = useState<Country[]>([]);

  // Refresh function to reload country configurations
  const refreshCountryConfigs = () => {
    console.log('🔄 Refreshing country configurations...');
    const service = CountryConfigService.getInstance();
    
    // Force reload from localStorage
    service.reloadFromStorage();
    
    // Get all configurations using the same method as initial load
    const allCountries = service.getAllConfigurations();
    console.log('📊 Loaded configurations:', allCountries);
    
    // Update countries list with same formatting as initial load
    const updatedCountries: Country[] = allCountries.map(config => ({
      code: config.countryCode,
      name: config.countryName,
      flag: `https://flagcdn.com/w320/${config.countryCode.toLowerCase()}.png`,
      price: config.packages[0]?.price || config.basePrice || 1200,
      timeframe: config.timeframe || '5-7 days',
      recommended: config.countryCode === 'GE',
      active: config.active
    }));
    
    console.log('🔄 Updated countries:', updatedCountries);
    console.log('🔄 Active countries:', updatedCountries.filter(c => c.active));
    setCountries(updatedCountries);
    
    // If a country is currently selected, refresh its config
    if (selectedCountry) {
      const updatedConfig = service.getCountryConfig(selectedCountry.code);
      setCountryConfig(updatedConfig);
    }
    
    console.log('✅ Country configurations refreshed');
  };

  // Load countries from CountryConfigService
  useEffect(() => {
    console.log('🔍 MARKETING APP - Loading countries...');
    console.log('🔍 MARKETING APP - Current URL:', window.location.href);
    
    // Check localStorage content
    const localStorageData = localStorage.getItem('country_configurations');
    console.log('🔍 MARKETING APP - localStorage data:', localStorageData);
    
    // Force reload from localStorage to ensure cross-domain sync
    const countryConfigService = CountryConfigService.getInstance();
    
    // Force reload configurations from localStorage
    countryConfigService.reloadFromStorage();
    
    const allCountries = countryConfigService.getAllConfigurations();
    console.log('🔍 MARKETING APP - All countries from service:', allCountries);
    
    const formattedCountries: Country[] = allCountries.map(config => ({
      code: config.countryCode,
      name: config.countryName,
      flag: `https://flagcdn.com/w320/${config.countryCode.toLowerCase()}.png`,
      price: config.packages?.[0]?.price || config.basePrice || 1200, // Use first package price or base price
      timeframe: config.timeframe || '5-7 days',
      recommended: config.countryCode === 'GE', // Georgia is recommended
      active: config.active
    }));

    console.log('🔍 MARKETING APP - Formatted countries:', formattedCountries);
    console.log('🔍 MARKETING APP - Active countries:', formattedCountries.filter(c => c.active));
    setCountries(formattedCountries);

    // Set up CrossDomainSync listener for automatic updates
    const handleCountryConfigUpdate = (data: any) => {
      console.log('🔄 MARKETING APP - Received country config update from admin', data);
      
      // Reload countries from updated localStorage
      const service = CountryConfigService.getInstance();
      service.reloadFromStorage();
      
      const updatedCountries = service.getAllConfigurations();
      console.log('🔄 MARKETING APP - Raw updated countries from service:', updatedCountries);
      
      const formattedUpdatedCountries: Country[] = updatedCountries.map(config => ({
        code: config.countryCode,
        name: config.countryName,
        flag: `https://flagcdn.com/w320/${config.countryCode.toLowerCase()}.png`,
        price: config.packages[0]?.price || config.basePrice || 1200,
        timeframe: config.timeframe || '5-7 days',
        recommended: config.countryCode === 'GE',
        active: config.active
      }));
      
      console.log('🔄 MARKETING APP - Formatted updated countries:', formattedUpdatedCountries);
      setCountries(formattedUpdatedCountries);
    };

    // Initialize CrossDomainSync and add listener
    const crossDomainSync = CrossDomainSync.getInstance();
    console.log('🔄 MARKETING APP - Setting up CrossDomainSync listener');
    crossDomainSync.addListener(handleCountryConfigUpdate);
    console.log('🔄 MARKETING APP - CrossDomainSync listener added successfully');

    // Cleanup listener on unmount
    return () => {
      crossDomainSync.removeListener(handleCountryConfigUpdate);
    };
  }, []);

  // Function to get packages based on selected country
  const getPackagesForCountry = (): PackageType[] => {
    if (countryConfig && countryConfig.packages) {
      return countryConfig.packages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        popular: pkg.popular,
        recommended: pkg.recommended,
        features: pkg.features
      }));
    }
    
    // Default packages if no country is selected or no country-specific packages
    return [
      {
        id: 'basic',
        name: 'Starter Package',
        price: 799,
        features: [
          'Company Registration',
          'Tax Registration',
          'Bank Account Opening Support',
          'Digital Certificate',
          'Basic Legal Consultation',
          'Email Support'
        ]
      },
      {
        id: 'standard',
        name: 'Business Package',
        price: 1299,
        originalPrice: 1599,
        popular: true,
        features: [
          'Everything in Starter',
          'Registered Office Address (3 months)',
          'Company Seal & Certificates',
          'Share Certificates',
          'Board Resolution Templates',
          'Compliance Calendar',
          'Priority Email Support'
        ]
      },
      {
        id: 'premium',
        name: 'Professional Package',
        price: 1999,
        originalPrice: 2499,
        recommended: true,
        features: [
          'Everything in Business',
          'Virtual Office (12 months)',
          'Accounting Setup & Training',
          'Legal Document Templates',
          'Dedicated Account Manager',
          'Phone & Video Support',
          'Annual Compliance Support',
          'Tax Planning Consultation'
        ]
      }
    ];
  };

  // Function to get additional services based on selected country
  const getAdditionalServicesForCountry = (): AdditionalService[] => {
    if (countryConfig && countryConfig.services) {
      return countryConfig.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        description: service.description
      }));
    }
    
    // Default additional services if no country is selected or no country-specific services
    return [
      { id: 'trademark', name: 'Trademark Registration', price: 599, description: 'Protect your brand name and logo' },
      { id: 'accounting', name: 'Monthly Accounting', price: 299, description: 'Professional bookkeeping services' },
      { id: 'virtual-office', name: 'Virtual Office (12 months)', price: 899, description: 'Professional business address' },
      { id: 'website', name: 'Professional Website', price: 1299, description: 'Custom business website design' }
    ];
  };

  const consultants: Consultant[] = [
    {
      id: 'uae-1',
      name: 'Ahmed Al-Rashid',
      country: 'UAE',
      email: 'ahmed@consulting19.com',
      phone: '+971 50 123 4567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      specialties: ['Company Formation', 'Banking', 'Visa Services']
    },
    {
      id: 'uk-1',
      name: 'James Wilson',
      country: 'United Kingdom',
      email: 'james@consulting19.com',
      phone: '+44 20 7123 4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      specialties: ['UK Company Law', 'Tax Planning', 'Compliance']
    },
    {
      id: 'us-1',
      name: 'Sarah Johnson',
      country: 'United States',
      email: 'sarah@consulting19.com',
      phone: '+1 555 123 4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      specialties: ['LLC Formation', 'Federal Compliance', 'State Regulations']
    },
    {
      id: 'sg-1',
      name: 'Li Wei Chen',
      country: 'Singapore',
      email: 'liwei@consulting19.com',
      phone: '+65 8123 4567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      specialties: ['ACRA Registration', 'Banking Setup', 'Work Permits']
    },
    {
      id: 'de-1',
      name: 'Hans Mueller',
      country: 'Germany',
      email: 'hans@consulting19.com',
      phone: '+49 30 123 4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'coming_soon',
      specialties: ['GmbH Formation', 'German Tax Law', 'EU Compliance']
    },
    {
      id: 'ca-1',
      name: 'Emily Thompson',
      country: 'Canada',
      email: 'emily@consulting19.com',
      phone: '+1 416 123 4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'coming_soon',
      specialties: ['Federal Incorporation', 'Provincial Registration', 'CRA Compliance']
    }
  ];

  const steps = [
    { number: 1, title: 'Select Country', icon: Globe },
    { number: 2, title: 'Company Details', icon: Building },
    { number: 3, title: 'Choose Package', icon: PackageIcon },
    { number: 4, title: 'Additional Services', icon: Plus },
    { number: 5, title: 'User Credentials', icon: Shield },
    { number: 6, title: 'Payment', icon: CreditCard },
    { number: 7, title: 'Order Confirmation', icon: Check }
  ];

  const calculateTotal = () => {
    let total = 0;
    
    // Add country price
    total += selectedCountry?.price || 0;
    
    // Add package price (dynamic or static)
    if (countryConfig && selectedDynamicPackage) {
      const dynamicPackage = countryConfig.packages.find(p => p.id === selectedDynamicPackage);
      total += dynamicPackage?.price || 0;
    } else if (selectedPackage) {
      total += selectedPackage.price || 0;
    }
    
    // Add services price (dynamic or static)
    if (countryConfig && selectedDynamicServices.length > 0) {
      selectedDynamicServices.forEach(serviceId => {
        const service = countryConfig.additionalServices.find(s => s.id === serviceId);
        total += service?.price || 0;
      });
    } else {
      total += selectedServices.reduce((sum, service) => sum + service.price, 0);
    }
    
    return total;
  };

  const handleServiceToggle = (service: AdditionalService) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleDynamicServiceToggle = (serviceId: string) => {
    setSelectedDynamicServices(prev => {
      const isSelected = prev.includes(serviceId);
      if (isSelected) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleDynamicCompanyDataChange = (field: string, value: any) => {
    setDynamicCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateDynamicForm = (): boolean => {
    if (!countryConfig) return true;
    
    const errors: Record<string, string> = {};
    
    countryConfig.companyDetailsForm.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const value = dynamicCompanyData[field.id];
          if (!value || value === '') {
            errors[field.id] = `${field.label} is required`;
          }
        }
        
        // Additional validation based on field type and rules
        if (field.validation && dynamicCompanyData[field.id]) {
          const value = dynamicCompanyData[field.id];
          const { min, max, pattern, message } = field.validation;
          
          if (field.type === 'text' || field.type === 'textarea') {
            const stringValue = String(value);
            if (min && stringValue.length < min) {
              errors[field.id] = message || `${field.label} must be at least ${min} characters`;
            }
            if (max && stringValue.length > max) {
              errors[field.id] = message || `${field.label} must be no more than ${max} characters`;
            }
            if (pattern && !new RegExp(pattern).test(stringValue)) {
              errors[field.id] = message || `${field.label} format is invalid`;
            }
          }
          
          if (field.type === 'number') {
            const numValue = Number(value);
            if (min && numValue < min) {
              errors[field.id] = message || `${field.label} must be at least ${min}`;
            }
            if (max && numValue > max) {
              errors[field.id] = message || `${field.label} must be no more than ${max}`;
            }
          }
        }
      });
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create checkout session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateTotal() * 100, // Convert to cents
          currency: 'usd',
          orderData: {
            selectedCountry,
            selectedPackage,
            selectedServices,
            companyDetails,
            userCredentials,
            assignedConsultant,
            countryConfig,
            selectedDynamicPackage,
            selectedDynamicServices,
            dynamicCompanyData
          }
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error('Stripe error:', result.error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Create client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          first_name: userCredentials.firstName,
          last_name: userCredentials.lastName,
          email: userCredentials.email,
          phone: userCredentials.phone,
          company_name: dynamicCompanyData.companyName,
          country_code: selectedCountry?.code,
          preferred_language: 'en'
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // 2. Get country ID
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('id')
        .eq('code', selectedCountry?.code)
        .single();

      if (countryError) throw countryError;

      // 3. Assign consultant automatically
      const consultant = await assignConsultant(selectedCountry?.code || '');

      // 4. Create service order
      const orderData = {
        client_id: clientData.id,
        consultant_id: consultant?.id || null,
        title: `Company Formation - ${dynamicCompanyData.companyName}`,
        description: `Company formation service for ${dynamicCompanyData.companyName} in ${selectedCountry?.name}. Package: ${selectedDynamicPackage?.name}. Additional services: ${selectedDynamicServices.map(s => s.name).join(', ')}`,
        budget: calculateTotal(),
        status: 'pending',
        priority: 'medium',
        country_id: countryData.id
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('service_orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // 5. Create service purchase record
      const { error: purchaseError } = await supabase
        .from('service_purchases')
        .insert({
          order_id: orderResult.id,
          client_id: clientData.id,
          consultant_id: consultant?.id || null,
          amount: calculateTotal(),
          currency: 'EUR',
          payment_status: 'completed',
          payment_method: 'stripe'
        });

      if (purchaseError) throw purchaseError;

      // 6. Calculate and record commission if consultant is assigned
      if (consultant?.id) {
        const totalAmount = calculateTotal();
        const commissionRate = 0.15; // 15% commission
        const commissionAmount = totalAmount * commissionRate;

        // Check if there's an existing commission payout for this month
        const currentDate = new Date();
        const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const periodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let { data: existingPayout, error: payoutFetchError } = await supabase
          .from('commission_payouts')
          .select('id')
          .eq('consultant_id', consultant.id)
          .eq('period_start', periodStart.toISOString().split('T')[0])
          .eq('period_end', periodEnd.toISOString().split('T')[0])
          .single();

        if (payoutFetchError && payoutFetchError.code !== 'PGRST116') {
          console.error('Error fetching existing payout:', payoutFetchError);
        }

        let payoutId;

        if (!existingPayout) {
          // Create new commission payout
          const { data: newPayout, error: newPayoutError } = await supabase
            .from('commission_payouts')
            .insert({
              consultant_id: consultant.id,
              period_start: periodStart.toISOString().split('T')[0],
              period_end: periodEnd.toISOString().split('T')[0],
              total_amount: commissionAmount,
              commission_rate: commissionRate,
              status: 'pending'
            })
            .select()
            .single();

          if (newPayoutError) {
            console.error('Error creating commission payout:', newPayoutError);
          } else {
            payoutId = newPayout.id;
          }
        } else {
          payoutId = existingPayout.id;
          
          // Get current total and update
          const { data: currentPayout, error: getCurrentError } = await supabase
            .from('commission_payouts')
            .select('total_amount')
            .eq('id', existingPayout.id)
            .single();

          if (!getCurrentError && currentPayout) {
            const newTotal = parseFloat(currentPayout.total_amount) + commissionAmount;
            
            const { error: updatePayoutError } = await supabase
              .from('commission_payouts')
              .update({ total_amount: newTotal })
              .eq('id', existingPayout.id);

            if (updatePayoutError) {
              console.error('Error updating commission payout:', updatePayoutError);
            }
          }
        }

        // Create commission payout item
        if (payoutId) {
          const { error: payoutItemError } = await supabase
            .from('commission_payout_items')
            .insert({
              payout_id: payoutId,
              purchase_id: orderResult.id, // Using order ID as purchase ID
              service_amount: totalAmount,
              commission_amount: commissionAmount
            });

          if (payoutItemError) {
            console.error('Error creating commission payout item:', payoutItemError);
          }
        }
      }

      setIsSubmitting(false);
      alert('Order submitted successfully! You will receive a confirmation email shortly.');
      
      // Redirect to success page or reset form
      navigate('/payment-success');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  const assignConsultant = async (countryCode: string) => {
    try {
      // Get country ID first
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('id')
        .eq('code', countryCode)
        .single();

      if (countryError) {
        console.error('Error fetching country:', countryError);
        return null;
      }

      // Find active consultants for this country
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          is_active,
          consultant_countries!inner(country_id)
        `)
        .eq('consultant_countries.country_id', countryData.id)
        .eq('is_active', true)
        .limit(1);

      if (consultantError) {
        console.error('Error fetching consultants:', consultantError);
        return null;
      }

      if (consultantData && consultantData.length > 0) {
        const consultant = consultantData[0];
        const assignedConsultantData = {
          id: consultant.id,
          name: `${consultant.first_name} ${consultant.last_name}`,
          country: countryCode,
          email: consultant.email,
          phone: consultant.phone || '',
          avatar: '/api/placeholder/40/40',
          status: 'active' as const
        };
        
        setAssignedConsultant(assignedConsultantData);
        return assignedConsultantData;
      }

      // If no active consultant found, try to find any consultant for this country
      const { data: anyConsultantData, error: anyConsultantError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          is_active,
          consultant_countries!inner(country_id)
        `)
        .eq('consultant_countries.country_id', countryData.id)
        .limit(1);

      if (anyConsultantError) {
        console.error('Error fetching any consultants:', anyConsultantError);
        return null;
      }

      if (anyConsultantData && anyConsultantData.length > 0) {
        const consultant = anyConsultantData[0];
        const assignedConsultantData = {
          id: consultant.id,
          name: `${consultant.first_name} ${consultant.last_name}`,
          country: countryCode,
          email: consultant.email,
          phone: consultant.phone || '',
          avatar: '/api/placeholder/40/40',
          status: 'coming_soon' as const
        };
        
        setAssignedConsultant(assignedConsultantData);
        return assignedConsultantData;
      }

      return null;
    } catch (error) {
      console.error('Error in assignConsultant:', error);
      return null;
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedCountry !== null;
      case 2:
        if (countryConfig) {
          return validateDynamicForm();
        }
        return companyDetails.companyName && companyDetails.businessType;
      case 3:
        if (countryConfig) {
          return selectedDynamicPackage !== null;
        }
        return selectedPackage !== null;
      case 4:
        return true; // Additional services are optional
      case 5:
        return userCredentials.email && userCredentials.password && userCredentials.confirmPassword;
      case 6:
        return paymentCompleted; // Can only proceed after payment is completed
      case 7:
        return false; // Final step, no next step
      default:
        return false;
    }
  };

  const nextStep = () => {
    // Check if we can proceed to next step
    if (!canProceedToNextStep()) {
      if (currentStep === 2 && countryConfig) {
        // Trigger validation for dynamic form
        validateDynamicForm();
      }
      return;
    }

    // Handle final order submission (step 7)
    if (currentStep === 7) {
      handleSubmit();
      return;
    }
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CountrySelection
            countries={countries}
            selectedCountry={selectedCountry}
            onCountrySelect={(country) => {
              setSelectedCountry(country);
              assignConsultant(country.code);
            }}
          />
        );

      case 2:
        // Use dynamic company details if country config is available
        if (countryConfig && countryConfig.companyDetailsForm.sections.length > 0) {
          return (
            <DynamicCompanyDetails
              countryConfig={countryConfig}
              formData={dynamicCompanyData}
              onChange={handleDynamicCompanyDataChange}
              errors={formErrors}
            />
          );
        } else {
          // Fallback to original company details
          return (
            <CompanyDetails
              companyDetails={companyDetails}
              onCompanyDetailsChange={setCompanyDetails}
            />
          );
        }

      case 3:
        // Use dynamic package selection if country config is available
        if (countryConfig && countryConfig.packages.length > 0) {
          return (
            <DynamicPackageSelection
              packages={countryConfig.packages}
              selectedPackage={selectedDynamicPackage}
              onPackageSelect={setSelectedDynamicPackage}
              currency={countryConfig.localization.currency}
            />
          );
        } else {
          // Show dynamic packages based on selected country or default packages
          return (
            <PackageSelection
              packages={getPackagesForCountry()}
              selectedPackage={selectedPackage}
              onPackageSelect={setSelectedPackage}
            />
          );
        }

      case 4:
        // Use dynamic additional services if country config is available
        if (countryConfig && countryConfig.services.length > 0) {
          return (
            <DynamicAdditionalServices
              services={countryConfig.services}
              selectedServices={selectedDynamicServices}
              onServiceToggle={handleDynamicServiceToggle}
              currency={countryConfig.localization.currency}
            />
          );
        } else {
          // Show dynamic additional services based on selected country or default services
          return (
            <AdditionalServices
              services={getAdditionalServicesForCountry()}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
          );
        }

      case 5:
        return (
          <UserCredentials
            userCredentials={userCredentials}
            onCredentialsChange={setUserCredentials}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        );

      case 6:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <CreditCard className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h2>
                <p className="text-gray-600">Complete your order with our secure payment system</p>
              </div>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country: {selectedCountry?.name}</span>
                      <span className="font-medium">${selectedCountry?.price.toLocaleString()}</span>
                    </div>
                    {selectedPackage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package: {selectedPackage.name}</span>
                        <span className="font-medium">${selectedPackage.price.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedServices.length > 0 && (
                      <div>
                        <span className="text-gray-600">Additional Services:</span>
                        {selectedServices.map(service => (
                          <div key={service.id} className="flex justify-between ml-4">
                            <span className="text-gray-500">• {service.name}</span>
                            <span className="font-medium">${service.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-teal-600">${calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ${calculateTotal().toLocaleString()} with Stripe</span>
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500">
                  <p>🔒 Your payment is secured by Stripe</p>
                  <p>We accept all major credit cards</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <OrderSummary
            selectedCountry={selectedCountry}
            selectedPackage={selectedPackage}
            selectedServices={selectedServices}
            companyDetails={companyDetails}
            userCredentials={userCredentials}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            assignedConsultant={assignedConsultant}
            countryConfig={countryConfig}
            selectedDynamicPackage={selectedDynamicPackage}
            selectedDynamicServices={selectedDynamicServices}
            dynamicCompanyData={dynamicCompanyData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg">
          <div className="p-6">
            {/* Logo */}
            <div className="mb-8">
              <a href="/" className="block">
                <div className="flex items-center space-x-3">
                  <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
                    <circle cx="24" cy="24" r="24" fill="#0d9488"/>
                    <text x="24" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Inter, sans-serif">19</text>
                  </svg>
                  <div>
                    <h1 className="text-xl font-bold text-teal-600">Consulting</h1>
                    <p className="text-sm text-gray-500">Company Formation Experts</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Temporary Debug Buttons */}
            <div className="mb-4 space-y-2">
              <button
                onClick={() => {
                  console.log('=== REFRESH BUTTON CLICKED ===');
                  console.log('Current URL:', window.location.href);
                  console.log('localStorage content:', JSON.stringify(localStorage, null, 2));
                  
                  // Get service instance
                  const service = CountryConfigService.getInstance();
                  
                  // Force reload from localStorage
                  service.reloadFromStorage();
                  
                  // Reload countries using the same method as refreshCountryConfigs
                  const allCountries = service.getAllConfigurations();
                  console.log('Reloaded countries:', allCountries);
                  
                  // Format countries the same way
                  const formattedCountries: Country[] = allCountries.map(config => ({
                    code: config.countryCode,
                    name: config.countryName,
                    flag: `https://flagcdn.com/w320/${config.countryCode.toLowerCase()}.png`,
                    price: config.packages[0]?.price || config.basePrice || 1200,
                    timeframe: config.timeframe || '5-7 days',
                    recommended: config.countryCode === 'GE',
                    active: config.active
                  }));
                  
                  // Update state to trigger re-render
                  setCountries(formattedCountries);
                  
                  alert('Countries refreshed! Check console for details.');
                }}
                className="w-full bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
              >
                🔄 Refresh Countries (Debug)
              </button>
              
              <button
                onClick={refreshCountryConfigs}
                className="w-full bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center justify-center gap-2"
              >
                🔄 Refresh Configurations
              </button>
            </div>

            {/* Timer */}
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <div className="flex items-center text-red-600 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>
              <div className="text-2xl font-bold text-red-600">23:45:12</div>
              <p className="text-xs text-red-500">Expires today!</p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div
                    key={step.number}
                    className={`flex items-center p-3 rounded-lg ${
                      isActive ? 'bg-blue-50 border border-blue-200' : 
                      isCompleted ? 'bg-green-50 border border-green-200' : 
                      'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isActive ? 'bg-blue-500 text-white' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-700' :
                        isCompleted ? 'text-green-700' :
                        'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="w-4 h-4 mr-2 text-blue-500" />
                <span>Licensed & Regulated</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <span>5000+ Happy Clients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === 5}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                  currentStep === 5
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentStep === 5 ? 'Confirm Order' : 'Next Step'}
                {currentStep < 5 && <ChevronRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white shadow-lg">
          <div className="p-6">
            {/* Order Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                {selectedCountry && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formation in {selectedCountry.name}</span>
                    <span className="font-medium">${selectedCountry.price}</span>
                  </div>
                )}
                {selectedPackage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedPackage.name}</span>
                    <span className="font-medium">${selectedPackage.price}</span>
                  </div>
                )}
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="font-medium">${service.price}</span>
                  </div>
                ))}
                {(selectedCountry || selectedPackage || selectedServices.length > 0) && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Awards */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Awards & Recognition</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Best Service 2024</p>
                    <p className="text-xs text-gray-500">Business Excellence Awards</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">5-Star Rating</p>
                    <p className="text-xs text-gray-500">Trustpilot Reviews</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormationWizard;