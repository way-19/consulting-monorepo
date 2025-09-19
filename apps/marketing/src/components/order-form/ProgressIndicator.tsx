import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${step.isCompleted
                    ? 'bg-green-500 text-white'
                    : step.isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step.isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center
                  ${step.isActive ? 'text-blue-600' : 'text-gray-500'}
                `}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 transition-all duration-300
                  ${steps[index + 1].isCompleted || steps[index + 1].isActive
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                  }
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};