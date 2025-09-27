import React, { useState } from 'react';
import { CountryPackage, CountryService } from '@consulting19/shared/types/country-config';

interface CustomPackageBuilderProps {
  basePackages: CountryPackage[];
  additionalServices: CountryService[];
  onCreateCustomPackage: (customPackage: CustomPackage) => void;
}

export interface CustomPackage {
  id: string;
  name: string;
  basePackage: CountryPackage;
  selectedServices: CountryService[];
  totalPrice: number;
  features: string[];
}

export const CustomPackageBuilder: React.FC<CustomPackageBuilderProps> = ({
  basePackages,
  additionalServices,
  onCreateCustomPackage
}) => {
  const [selectedBasePackage, setSelectedBasePackage] = useState<CountryPackage | null>(null);
  const [selectedServices, setSelectedServices] = useState<CountryService[]>([]);
  const [customPackageName, setCustomPackageName] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);

  const calculateTotalPrice = () => {
    const basePrice = selectedBasePackage?.price || 0;
    const servicesPrice = selectedServices.reduce((total, service) => total + service.price, 0);
    return basePrice + servicesPrice;
  };

  const getAllFeatures = () => {
    const baseFeatures = selectedBasePackage?.features || [];
    const serviceFeatures = selectedServices.map(service => service.name);
    return [...baseFeatures, ...serviceFeatures];
  };

  const toggleService = (service: CountryService) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleCreatePackage = () => {
    if (!selectedBasePackage || !customPackageName.trim()) return;

    const customPackage: CustomPackage = {
      id: `custom-${Date.now()}`,
      name: customPackageName,
      basePackage: selectedBasePackage,
      selectedServices,
      totalPrice: calculateTotalPrice(),
      features: getAllFeatures()
    };

    onCreateCustomPackage(customPackage);
    setShowBuilder(false);
    setSelectedBasePackage(null);
    setSelectedServices([]);
    setCustomPackageName('');
  };

  const resetBuilder = () => {
    setSelectedBasePackage(null);
    setSelectedServices([]);
    setCustomPackageName('');
  };

  if (!showBuilder) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Custom Package</h3>
          <p className="text-gray-600 mb-4">
            Build your own package by selecting a base package and adding additional services
          </p>
          <button
            onClick={() => setShowBuilder(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Start Building Custom Package
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Custom Package Builder</h3>
        <button
          onClick={() => setShowBuilder(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕ Close Builder
        </button>
      </div>

      {/* Step 1: Select Base Package */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4">Step 1: Choose Base Package</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basePackages.map(pkg => (
            <div
              key={pkg.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedBasePackage?.id === pkg.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedBasePackage(pkg)}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold">{pkg.name}</h5>
                <input
                  type="radio"
                  checked={selectedBasePackage?.id === pkg.id}
                  onChange={() => setSelectedBasePackage(pkg)}
                  className="w-4 h-4 text-purple-600"
                />
              </div>
              <div className="text-xl font-bold text-purple-600 mb-2">
                ${pkg.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {pkg.features.length} features included
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Add Additional Services */}
      {selectedBasePackage && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Step 2: Add Additional Services</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map(service => (
              <div
                key={service.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedServices.some(s => s.id === service.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleService(service)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{service.name}</h5>
                  <input
                    type="checkbox"
                    checked={selectedServices.some(s => s.id === service.id)}
                    onChange={() => toggleService(service)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <div className="text-lg font-bold text-blue-600">
                  +${service.price.toLocaleString()}
                </div>
                {service.description && (
                  <div className="text-sm text-gray-600 mt-2">
                    {service.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Package Summary and Name */}
      {selectedBasePackage && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">Step 3: Package Summary</h4>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-semibold">Price Breakdown</h5>
              <div className="text-2xl font-bold text-green-600">
                ${calculateTotalPrice().toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Package ({selectedBasePackage.name})</span>
                <span>${selectedBasePackage.price.toLocaleString()}</span>
              </div>
              {selectedServices.map(service => (
                <div key={service.id} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>+${service.price.toLocaleString()}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Package Name
            </label>
            <input
              type="text"
              value={customPackageName}
              onChange={(e) => setCustomPackageName(e.target.value)}
              placeholder="Enter a name for your custom package"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCreatePackage}
              disabled={!customPackageName.trim()}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Custom Package
            </button>
            <button
              onClick={resetBuilder}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};