import React from 'react';
import { Plus, Minus } from 'lucide-react';

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface AdditionalServicesProps {
  services: AdditionalService[];
  selectedServices: AdditionalService[];
  onServiceToggle: (service: AdditionalService) => void;
}

const AdditionalServices: React.FC<AdditionalServicesProps> = ({
  services,
  selectedServices,
  onServiceToggle
}) => {
  const isSelected = (service: AdditionalService) => 
    selectedServices.some(s => s.id === service.id);

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Services</h2>
        <p className="text-gray-600">Enhance your package with additional services</p>
      </div>
      
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services
              .filter(service => service.category === category)
              .map((service) => {
                const selected = isSelected(service);
                
                return (
                  <div
                    key={service.id}
                    className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onServiceToggle(service)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <div className={`ml-2 p-1 rounded-full ${
                            selected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {selected ? (
                              <Minus className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        <div className="text-lg font-bold text-blue-600">
                          +${service.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
      
      {selectedServices.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Selected Additional Services:</h4>
          <div className="space-y-1">
            {selectedServices.map(service => (
              <div key={service.id} className="flex justify-between text-sm">
                <span className="text-blue-800">{service.name}</span>
                <span className="font-medium text-blue-900">+${service.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-blue-200 mt-2 pt-2">
            <div className="flex justify-between font-bold text-blue-900">
              <span>Total Additional Services:</span>
              <span>+${selectedServices.reduce((sum, s) => sum + s.price, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServices;