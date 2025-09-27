import React, { useState } from 'react';
import { CountryPackage } from '@consulting19/shared/types/country-config';

interface PackageComparisonProps {
  packages: CountryPackage[];
  onSelectPackage: (packageId: string) => void;
  selectedPackageId?: string;
}

export const PackageComparison: React.FC<PackageComparisonProps> = ({
  packages,
  onSelectPackage,
  selectedPackageId
}) => {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const togglePackageSelection = (packageId: string) => {
    setSelectedPackages(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else if (prev.length < 3) {
        return [...prev, packageId];
      }
      return prev;
    });
  };

  const getSelectedPackagesData = () => {
    return packages.filter(pkg => selectedPackages.includes(pkg.id));
  };

  const getAllFeatures = () => {
    const selectedData = getSelectedPackagesData();
    const allFeatures = new Set<string>();
    selectedData.forEach(pkg => {
      pkg.features.forEach((feature: string) => allFeatures.add(feature));
    });
    return Array.from(allFeatures);
  };

  const hasFeature = (packageData: CountryPackage, feature: string) => {
    return packageData.features.includes(feature);
  };

  if (showComparison && selectedPackages.length > 0) {
    const selectedData = getSelectedPackagesData();
    const allFeatures = getAllFeatures();

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Package Comparison</h3>
          <button
            onClick={() => setShowComparison(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕ Close Comparison
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b-2 border-gray-200 font-semibold">Features</th>
                {selectedData.map(pkg => (
                  <th key={pkg.id} className="text-center p-4 border-b-2 border-gray-200">
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">{pkg.name}</h4>
                      <div className="text-2xl font-bold text-blue-600">
                        ${pkg.price.toLocaleString()}
                        {pkg.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onSelectPackage(pkg.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedPackageId === pkg.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        {selectedPackageId === pkg.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, index) => (
                <tr key={feature} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 border-b border-gray-200 font-medium">{feature}</td>
                  {selectedData.map(pkg => (
                    <td key={pkg.id} className="p-4 border-b border-gray-200 text-center">
                      {hasFeature(pkg, feature) ? (
                        <span className="text-green-600 text-xl">✓</span>
                      ) : (
                        <span className="text-gray-300 text-xl">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Compare Packages</h3>
        <div className="text-sm text-gray-600">
          Select up to 3 packages to compare
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPackages.includes(pkg.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => togglePackageSelection(pkg.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{pkg.name}</h4>
              <input
                type="checkbox"
                checked={selectedPackages.includes(pkg.id)}
                onChange={() => togglePackageSelection(pkg.id)}
                className="w-5 h-5 text-blue-600"
              />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ${pkg.price.toLocaleString()}
              {pkg.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${pkg.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {pkg.features.length} features included
            </div>
            {pkg.popular && (
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mt-2">
                Most Popular
              </span>
            )}
            {pkg.recommended && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                Recommended
              </span>
            )}
          </div>
        ))}
      </div>

      {selectedPackages.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowComparison(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Compare Selected Packages ({selectedPackages.length})
          </button>
        </div>
      )}
    </div>
  );
};