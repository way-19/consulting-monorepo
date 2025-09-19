import React from 'react';
import { Check } from 'lucide-react';
import { Service } from '../../types/order';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onSelect
}) => {
  return (
    <div
      className={`
        relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300
        hover:shadow-lg transform hover:-translate-y-1
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
      onClick={() => onSelect(service.id)}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {service.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {service.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Süre: {service.duration}</span>
          {service.price > 0 && (
            <span className="font-semibold text-blue-600">
              ${service.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Özellikler:</h4>
        <ul className="space-y-1">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};