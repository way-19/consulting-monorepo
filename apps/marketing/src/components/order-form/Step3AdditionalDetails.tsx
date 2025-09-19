import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input, Select, Textarea } from '../ui';
import { OrderFormData } from '../../types/order';

interface Step3Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

const communicationOptions = [
  { value: 'email', label: 'E-posta' },
  { value: 'phone', label: 'Telefon' },
  { value: 'both', label: 'Her ikisi' }
];

export const Step3AdditionalDetails: React.FC<Step3Props> = ({ register, errors }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ek Detaylar
        </h2>
        <p className="text-gray-600">
          Projenizi daha iyi anlamamız için ek bilgiler
        </p>
      </div>

      <div className="space-y-6">
        <Textarea
          label="Ek Gereksinimler"
          placeholder="Özel istekleriniz, teknik gereksinimler veya diğer notlar..."
          rows={4}
          {...register('additionalRequirements')}
          error={errors.additionalRequirements?.message}
          helperText="Projeniz için özel gereksinimleriniz varsa belirtebilirsiniz"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tercih Edilen Başlangıç Tarihi"
            type="date"
            min={today}
            required
            {...register('preferredStartDate')}
            error={errors.preferredStartDate?.message}
          />

          <Select
            label="İletişim Tercihi"
            placeholder="İletişim yönteminizi seçin"
            options={communicationOptions}
            required
            {...register('communicationPreference')}
            error={errors.communicationPreference?.message}
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">
          📋 Sonraki Adımlar
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Formunuzu gönderdikten sonra 24 saat içinde size dönüş yapacağız</li>
          <li>• Detaylı proje planı ve zaman çizelgesi hazırlayacağız</li>
          <li>• Ücretsiz danışmanlık toplantısı planlayacağız</li>
        </ul>
      </div>
    </div>
  );
};