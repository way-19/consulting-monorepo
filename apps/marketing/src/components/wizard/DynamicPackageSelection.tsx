import React from 'react';
import { CountryPackage } from '@consulting19/shared';

interface DynamicPackageSelectionProps {
  packages: CountryPackage[];
  selectedPackage: string | null;
  onPackageSelect: (packageId: string) => void;
  currency?: string;
}

const DynamicPackageSelection: React.FC<DynamicPackageSelectionProps> = ({
  packages,
  selectedPackage,
  onPackageSelect,
  currency = 'USD'
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'basic':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'standard':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'premium':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'basic':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
      case 'standard':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25';
      case 'premium':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25';
    }
  };

  const getPackageBackground = (packageId: string, type: string) => {
    const isSelected = selectedPackage === packageId;
    
    if (isSelected) {
      switch (type) {
        case 'basic':
          return 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 border-2 border-blue-300 shadow-xl shadow-blue-500/20';
        case 'standard':
          return 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-50 border-2 border-emerald-300 shadow-xl shadow-emerald-500/20';
        case 'premium':
          return 'bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 border-2 border-purple-300 shadow-xl shadow-purple-500/20';
        default:
          return 'bg-gradient-to-br from-slate-50 via-slate-100 to-gray-50 border-2 border-slate-300 shadow-xl shadow-slate-500/20';
      }
    }
    
    switch (type) {
      case 'basic':
        return 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border border-blue-200/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/70';
      case 'standard':
        return 'bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 border border-emerald-200/50 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300/70';
      case 'premium':
        return 'bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 border border-purple-200/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300/70';
      default:
        return 'bg-gradient-to-br from-white via-slate-50/30 to-gray-50/50 border border-slate-200/50 shadow-lg hover:shadow-xl hover:shadow-slate-500/10 hover:border-slate-300/70';
    }
  };

  const getSelectedStyle = (packageId: string) => {
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h2>
        <p className="text-gray-600">Select the package that best fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {packages
          .filter(pkg => pkg.available)
          .sort((a, b) => a.order - b.order)
          .map((pkg) => (
            <div
              key={pkg.id}
              className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${getPackageBackground(pkg.id, pkg.id.includes('basic') ? 'basic' : pkg.id.includes('standard') ? 'standard' : pkg.id.includes('premium') ? 'premium' : 'default')}`}
              onClick={() => onPackageSelect(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-orange-500/30 animate-pulse">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              {pkg.recommended && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/30">
                    💎 Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getPackageColor(pkg.id.includes('basic') ? 'basic' : pkg.id.includes('standard') ? 'standard' : pkg.id.includes('premium') ? 'premium' : 'default')}`}>
                  {getPackageIcon(pkg.id.includes('basic') ? 'basic' : pkg.id.includes('standard') ? 'standard' : pkg.id.includes('premium') ? 'premium' : 'default')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.name}</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  {formatPrice(pkg.price)}
                </div>
                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                  <div className="text-sm text-gray-500 line-through mb-2">
                    {formatPrice(pkg.originalPrice)}
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {pkg.deliveryTime && (
                <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delivery: {pkg.deliveryTime}
                </div>
              )}

              <button
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedPackage === pkg.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:shadow-md border border-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onPackageSelect(pkg.id);
                }}
              >
                {selectedPackage === pkg.id ? '✓ Selected' : 'Select Package'}
              </button>

              {pkg.metadata?.legalRequirements && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-yellow-800 mb-1">Legal Requirements</p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {pkg.metadata.legalRequirements.map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages available</h3>
          <p className="text-gray-600">Packages for this country are not configured yet.</p>
        </div>
      )}
    </div>
  );
};

export default DynamicPackageSelection;