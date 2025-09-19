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
          Şirket Bilgileri
        </h2>
        <p className="text-gray-600">
          Lütfen şirketiniz hakkında temel bilgileri paylaşın
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Şirket Adı"
          placeholder="Şirket adınızı giriniz"
          required
          {...register('companyName')}
          error={errors.companyName?.message}
        />

        <Input
          label="İletişim Kişisi"
          placeholder="Adınız ve soyadınız"
          required
          {...register('contactPerson')}
          error={errors.contactPerson?.message}
        />

        <Input
          label="E-posta Adresi"
          type="email"
          placeholder="ornek@sirket.com"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Telefon Numarası"
          type="tel"
          placeholder="+90 555 123 45 67"
          required
          {...register('phone')}
          error={errors.phone?.message}
        />

        <div className="md:col-span-2">
          <Input
            label="Web Sitesi"
            type="url"
            placeholder="https://www.sirketiniz.com"
            {...register('website')}
            error={errors.website?.message}
            helperText="Mevcut web siteniz varsa paylaşabilirsiniz"
          />
        </div>
      </div>
    </div>
  );
};