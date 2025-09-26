import React, { useState } from 'react';
import { Check, Star, BarChart3, Wrench } from 'lucide-react';

export interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
}

interface PackageSelectionProps {
  packages: Package[];
  selectedPackage: Package | null;
  onPackageSelect: (pkg: Package) => void;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({
  packages,
  selectedPackage,
  onPackageSelect
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const toggleComparisonSelection = (packageId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else if (prev.length < 3) {
        return [...prev, packageId];
      }
      return prev;
    });
  };

  const getSelectedPackagesForComparison = () => {
    return packages.filter(pkg => selectedForComparison.includes(pkg.id));
  };

  const getAllFeatures = () => {
    const selectedData = getSelectedPackagesForComparison();
    const allFeatures = new Set<string>();
    selectedData.forEach(pkg => {
      pkg.features.forEach(feature => allFeatures.add(feature));
    });
    return Array.from(allFeatures);
  };

  const hasFeature = (packageData: Package, feature: string) => {
    return packageData.features.includes(feature);
  };

  if (showComparison && selectedForComparison.length > 0) {
    const selectedData = getSelectedPackagesForComparison();
    const allFeatures = getAllFeatures();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Comparison</h2>
            <p className="text-gray-600">Compare selected packages side by side</p>
          </div>
          <button
            onClick={() => setShowComparison(false)}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-300 rounded-lg"
          >
            ← Back to Packages
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="text-left p-4 border-b-2 border-gray-200 font-semibold bg-gray-50">Features</th>
                {selectedData.map(pkg => (
                  <th key={pkg.id} className="text-center p-4 border-b-2 border-gray-200 bg-gray-50">
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">{pkg.name}</h4>
                      <div className="text-2xl font-bold text-blue-600">
                        ${pkg.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => onPackageSelect(pkg)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedPackage?.id === pkg.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        {selectedPackage?.id === pkg.id ? 'Selected' : 'Select'}
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Package</h2>
        <p className="text-gray-600">Select the package that best fits your needs</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowComparison(true)}
          disabled={selectedForComparison.length === 0}
          className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Compare Packages ({selectedForComparison.length})
        </button>
        <button
          onClick={() => setShowCustomBuilder(true)}
          className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Wrench className="w-4 h-4 mr-2" />
          Build Custom Package
        </button>
      </div>

      {/* Custom Package Builder Modal */}
      {showCustomBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Build Custom Package</h3>
              <button
                onClick={() => setShowCustomBuilder(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Choose Base Package</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.slice(0, 3).map(pkg => (
                    <div
                      key={pkg.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-green-500 transition-colors"
                      onClick={() => {
                        // Create a custom package based on selected base
                        const customPackage: Package = {
                          id: `custom-${pkg.id}-${Date.now()}`,
                          name: `Custom ${pkg.name}`,
                          price: pkg.price + 500, // Add custom fee
                          features: [
                            ...pkg.features,
                            'Custom Configuration',
                            'Dedicated Support',
                            'Priority Processing'
                          ]
                        };
                        onPackageSelect(customPackage);
                        setShowCustomBuilder(false);
                      }}
                    >
                      <h5 className="font-bold mb-2">{pkg.name}</h5>
                      <div className="text-lg font-bold text-green-600 mb-2">
                        Base: ${pkg.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        + Custom features (+$500)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Custom Package Includes:</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• All features from base package</li>
                  <li>• Custom configuration tailored to your needs</li>
                  <li>• Dedicated support representative</li>
                  <li>• Priority processing and faster turnaround</li>
                  <li>• Additional consultation sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              selectedPackage?.id === pkg.id
                ? 'border-blue-500 shadow-lg ring-4 ring-blue-100'
                : selectedForComparison.includes(pkg.id)
                ? 'border-purple-500 shadow-lg ring-2 ring-purple-100'
                : 'border-gray-200 hover:border-gray-300'
            } ${pkg.popular ? 'transform scale-105' : ''}`}
          >
            {/* Comparison Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <input
                type="checkbox"
                checked={selectedForComparison.includes(pkg.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleComparisonSelection(pkg.id);
                }}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                title="Select for comparison"
              />
            </div>

            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}
            
            {pkg.recommended && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-yellow-400 text-yellow-900 p-2 rounded-full">
                  <Star className="w-4 h-4" />
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-blue-600">
                  ${pkg.price.toLocaleString()}
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onPackageSelect(pkg)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPackage?.id === pkg.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageSelection;