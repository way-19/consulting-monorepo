import React from 'react';
import { Check, Clock, DollarSign, Building, User, Mail } from 'lucide-react';
import { Country } from './CountrySelection';
import { Package } from './PackageSelection';
import { AdditionalService } from './AdditionalServices';
import { CompanyDetailsData } from './CompanyDetails';
import { UserCredentialsData } from './UserCredentials';
import { CountryConfiguration, CountryPackage, CountryService } from '@consulting19/shared';

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

interface OrderSummaryProps {
  selectedCountry: Country | null;
  selectedPackage: Package | null;
  selectedServices: AdditionalService[];
  companyDetails: CompanyDetailsData;
  userCredentials: UserCredentialsData;
  onSubmit: () => void;
  isSubmitting: boolean;
  assignedConsultant?: Consultant | null;
  countryConfig?: CountryConfiguration | null;
  selectedDynamicPackage?: CountryPackage | null;
  selectedDynamicServices?: CountryService[];
  dynamicCompanyData?: Record<string, any>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedCountry,
  selectedPackage,
  selectedServices,
  companyDetails,
  userCredentials,
  onSubmit,
  isSubmitting,
  assignedConsultant,
  countryConfig,
  selectedDynamicPackage,
  selectedDynamicServices = [],
  dynamicCompanyData = {}
}) => {
  // Use dynamic data if available, otherwise fallback to original data
  const currentPackage = selectedDynamicPackage || selectedPackage;
  const currentServices = selectedDynamicServices.length > 0 ? selectedDynamicServices : selectedServices;
  const currentCompanyData = Object.keys(dynamicCompanyData).length > 0 ? dynamicCompanyData : companyDetails;
  const currency = countryConfig?.localization.currency || '$';
  
  const basePrice = currentPackage?.price || 0;
  const servicesPrice = currentServices.reduce((sum, service) => sum + service.price, 0);
  const totalPrice = basePrice + servicesPrice;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
        <p className="text-gray-600">Review your order before submitting</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="space-y-6">
          {/* Country Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Incorporation Country
            </h3>
            {selectedCountry && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-6 rounded overflow-hidden border border-gray-200"
                  style={{
                    backgroundImage: `url(${selectedCountry.flag})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedCountry.name}</p>
                  <p className="text-sm text-gray-600">{selectedCountry.timeframe}</p>
                </div>
              </div>
            )}
          </div>

          {/* Company Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Company Information
            </h3>
            <div className="space-y-2 text-sm">
              {countryConfig && Object.keys(dynamicCompanyData).length > 0 ? (
                // Render dynamic company data
                countryConfig.companyDetailsForm.sections.map(section => 
                  section.fields.map(field => (
                    <div key={field.id} className="flex justify-between">
                      <span className="text-gray-600">{field.label}:</span>
                      <span className="font-medium">
                        {dynamicCompanyData[field.id] || 'Not specified'}
                      </span>
                    </div>
                  ))
                ).flat()
              ) : (
                // Fallback to original company details
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company Name:</span>
                    <span className="font-medium">{companyDetails.companyName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Type:</span>
                    <span className="font-medium">{companyDetails.businessType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shareholders:</span>
                    <span className="font-medium">{companyDetails.shareholders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authorized Capital:</span>
                    <span className="font-medium">${companyDetails.authorizedCapital.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {userCredentials.firstName} {userCredentials.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userCredentials.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Pricing Breakdown
            </h3>
            
            {/* Package */}
            {currentPackage && (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{currentPackage.name}</p>
                    <p className="text-sm text-gray-600">Base package</p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {currency}{currentPackage.price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Additional Services */}
            {currentServices.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="font-medium text-gray-900 mb-3">Additional Services:</p>
                <div className="space-y-2">
                  {currentServices.map(service => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium">+{currency}{service.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {currency}{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Submit Order
              </>
            )}
          </button>

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center">
            By submitting this order, you agree to our Terms of Service and Privacy Policy.
            You will receive a confirmation email with next steps.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;