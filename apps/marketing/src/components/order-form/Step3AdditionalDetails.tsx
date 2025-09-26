import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input, Select, Textarea } from '../ui';
import { OrderFormData } from '../../types/order';

interface Step3Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

const communicationOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'both', label: 'Both' }
];

export const Step3AdditionalDetails: React.FC<Step3Props> = ({ register, errors }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Additional Details
        </h2>
        <p className="text-gray-600">
          Additional information to better understand your project
        </p>
      </div>

      <div className="space-y-6">
        <Textarea
          label="Additional Requirements"
          placeholder="Special requests, technical requirements, or other notes..."
          rows={4}
          {...register('additionalRequirements')}
          error={errors.additionalRequirements?.message}
          helperText="You can specify any special requirements for your project"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Preferred Start Date"
            type="date"
            min={today}
            required
            {...register('preferredStartDate')}
            error={errors.preferredStartDate?.message}
          />

          <Select
            label="Communication Preference"
            placeholder="Select your communication method"
            options={communicationOptions}
            required
            {...register('communicationPreference')}
            error={errors.communicationPreference?.message}
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">
          📋 Next Steps
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• We will get back to you within 24 hours after you submit your form</li>
          <li>• We will prepare a detailed project plan and timeline</li>
          <li>• We will schedule a free consultation meeting</li>
        </ul>
      </div>
    </div>
  );
};