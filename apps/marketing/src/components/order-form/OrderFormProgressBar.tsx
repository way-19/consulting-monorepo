import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface OrderFormProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const OrderFormProgressBar: React.FC<OrderFormProgressBarProps> = ({ 
  currentStep, 
  totalSteps = 4 
}) => {
  const steps = [
    'Company Details',
    'Service Selection', 
    'Banking Details',
    'Review & Pay'
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1 <= currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default OrderFormProgressBar;