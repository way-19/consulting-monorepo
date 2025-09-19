import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormData } from '../../types/order';
import { Select } from '../ui';

interface Step3Props {
  form: UseFormReturn<OrderFormData>;
}

const BANKS = [
  { value: 'ziraat', label: 'Ziraat Bankası' },
  { value: 'garanti', label: 'Garanti BBVA' },
  { value: 'isbank', label: 'İş Bankası' },
  { value: 'akbank', label: 'Akbank' },
  { value: 'yapi-kredi', label: 'Yapı Kredi' },
  { value: 'halkbank', label: 'Halkbank' },
  { value: 'vakifbank', label: 'VakıfBank' },
];

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Vadesiz Hesap' },
  { value: 'savings', label: 'Vadeli Hesap' },
];

const MONTHLY_VOLUMES = [
  { value: '0-10k', label: '0 - 10.000 ₺' },
  { value: '10k-50k', label: '10.000 - 50.000 ₺' },
  { value: '50k-100k', label: '50.000 - 100.000 ₺' },
  { value: '100k-500k', label: '100.000 - 500.000 ₺' },
  { value: '500k+', label: '500.000 ₺+' },
];

const BUSINESS_TYPES = [
  { value: 'retail', label: 'Perakende' },
  { value: 'wholesale', label: 'Toptan' },
  { value: 'service', label: 'Hizmet' },
  { value: 'manufacturing', label: 'İmalat' },
  { value: 'technology', label: 'Teknoloji' },
  { value: 'healthcare', label: 'Sağlık' },
  { value: 'education', label: 'Eğitim' },
  { value: 'other', label: 'Diğer' },
];

const RISK_LEVELS = [
  { value: 'low', label: 'Düşük Risk' },
  { value: 'medium', label: 'Orta Risk' },
  { value: 'high', label: 'Yüksek Risk' },
];

export const Step3BankingDetails: React.FC<Step3Props> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bankacılık Detayları</h2>
        <p className="text-gray-600">İşletmenizin finansal bilgilerini giriniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Ana Bankanız"
          required
          {...register('bankName')}
          error={errors.bankName?.message}
          options={BANKS}
          placeholder="Banka seçiniz"
        />

        <Select
          label="Hesap Türü"
          required
          {...register('accountType')}
          error={errors.accountType?.message}
          options={ACCOUNT_TYPES}
          placeholder="Hesap türü seçiniz"
        />

        <Select
          label="Aylık İşlem Hacmi"
          required
          {...register('monthlyVolume')}
          error={errors.monthlyVolume?.message}
          options={MONTHLY_VOLUMES}
          placeholder="İşlem hacmi seçiniz"
        />

        <Select
          label="İş Türü"
          required
          {...register('businessType')}
          error={errors.businessType?.message}
          options={BUSINESS_TYPES}
          placeholder="İş türü seçiniz"
        />

        <div className="md:col-span-2">
          <Select
            label="Risk Seviyesi"
            required
            {...register('riskLevel')}
            error={errors.riskLevel?.message}
            options={RISK_LEVELS}
            placeholder="Risk seviyesi seçiniz"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Bilgi</h3>
            <p className="text-sm text-blue-700 mt-1">
              Bu bilgiler, size en uygun ödeme çözümünü sunabilmemiz için gereklidir. 
              Tüm bilgileriniz güvenli bir şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};