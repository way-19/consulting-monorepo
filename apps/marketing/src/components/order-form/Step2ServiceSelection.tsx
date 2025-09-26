import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Select, Textarea } from '../ui';
import { ServiceCard } from './ServiceCard';
import { OrderFormData } from '../../types/order';
import { services } from '../../data/services';

interface Step2Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
  setValue: UseFormSetValue<OrderFormData>;
}

const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: 'Within 2-3 months' },
  { value: '3-6-months', label: 'Within 3-6 months' },
  { value: 'flexible', label: 'Flexible' }
];

const budgetOptions = [
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k+', label: '$50,000+' },
  { value: 'discuss', label: 'Let\'s discuss' }
];

export const Step2ServiceSelection: React.FC<Step2Props> = ({
  register,
  errors,
  watch,
  setValue
}) => {
  const selectedServices = watch('selectedServices') || [];

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = selectedServices;
    const isSelected = currentServices.includes(serviceId);
    
    if (isSelected) {
      setValue('selectedServices', currentServices.filter(id => id !== serviceId));
    } else {
      setValue('selectedServices', [...currentServices, serviceId]);
    }
  };

  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Service Selection
        </h2>
        <p className="text-gray-600">
          Select the services you need
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Services
        </h3>
        {errors.selectedServices && (
          <p className="text-sm text-red-600 mb-4 flex items-center gap-1">
            <span className="w-4 h-4">⚠️</span>
            {errors.selectedServices.message}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onSelect={handleServiceToggle}
            />
          ))}
        </div>

        {selectedServices.length > 0 && totalPrice > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Selected Services Total:
              </span>
              <span className="text-xl font-bold text-blue-600">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Textarea
          label="Project Description"
          placeholder="Provide detailed information about your project..."
          rows={4}
          required
          {...register('projectDescription')}
          error={errors.projectDescription?.message}
          helperText="Describe your goals, expectations, and special requirements"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Timeline"
            placeholder="Select project start time"
            options={timelineOptions}
            required
            {...register('timeline')}
            error={errors.timeline?.message}
          />

          <Select
            label="Budget Range"
            placeholder="Select your budget range"
            options={budgetOptions}
            required
            {...register('budget')}
            error={errors.budget?.message}
          />
        </div>
      </div>
    </div>
  );
};