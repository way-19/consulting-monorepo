import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../ui';
import { OrderFormData } from '../../types/order';

interface Step1Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

export const Step1CompanyDetails: React.FC<Step1Props> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Company Details
        </h2>
        <p className="text-gray-600">
          Please provide basic information about your company
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          placeholder="Enter your company name"
          required
          {...register('companyName')}
          error={errors.companyName?.message}
        />

        <Input
          label="Contact Person"
          placeholder="Your full name"
          required
          {...register('contactPerson')}
          error={errors.contactPerson?.message}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="example@company.com"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 555 123 4567"
          required
          {...register('phone')}
          error={errors.phone?.message}
        />

        <div className="md:col-span-2">
          <Input
            label="Website"
            type="url"
            placeholder="https://www.yourcompany.com"
            {...register('website')}
            error={errors.website?.message}
            helperText="Share your existing website if you have one"
          />
        </div>
      </div>
    </div>
  );
};