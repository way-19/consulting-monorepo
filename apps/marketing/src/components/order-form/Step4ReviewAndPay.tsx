import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormData } from '../../types/order';

interface Step4Props {
  form: UseFormReturn<OrderFormData>;
}

const SERVICE_NAMES = {
  'payment-processing': 'Ödeme İşleme',
  'merchant-account': 'Merchant Hesabı',
  'pos-terminal': 'POS Terminal',
  'online-payments': 'Online Ödemeler',
};

const SERVICE_PRICES = {
  'payment-processing': 299,
  'merchant-account': 199,
  'pos-terminal': 149,
  'online-payments': 249,
};

export const Step4ReviewAndPay: React.FC<Step4Props> = ({ form }) => {
  const { register, watch, formState: { errors } } = form;
  const formData = watch();

  const selectedServices = formData.selectedServices || [];
  const totalPrice = selectedServices.reduce((total, serviceId) => {
    return total + (SERVICE_PRICES[serviceId as keyof typeof SERVICE_PRICES] || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">İnceleme ve Ödeme</h2>
        <p className="text-gray-600">Bilgilerinizi kontrol edin ve siparişi tamamlayın.</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Şirket:</span>
            <span className="font-medium">{formData.companyName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">E-posta:</span>
            <span className="font-medium">{formData.email}</span>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Seçilen Hizmetler:</h4>
            {selectedServices.length > 0 ? (
              <div className="space-y-2">
                {selectedServices.map((serviceId) => (
                  <div key={serviceId} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {SERVICE_NAMES[serviceId as keyof typeof SERVICE_NAMES]}
                    </span>
                    <span className="font-medium">
                      ₺{SERVICE_PRICES[serviceId as keyof typeof SERVICE_PRICES]}/ay
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Toplam:</span>
                    <span className="text-blue-600">₺{totalPrice}/ay</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Henüz hizmet seçilmedi</p>
            )}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-3 text-sm text-gray-700">
            <span className="font-medium">Hizmet Şartlarını</span> okudum ve kabul ediyorum.
            {errors.termsAccepted && (
              <span className="block text-red-600 mt-1">{errors.termsAccepted.message}</span>
            )}
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('privacyAccepted')}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-3 text-sm text-gray-700">
            <span className="font-medium">Gizlilik Politikasını</span> okudum ve kabul ediyorum.
            {errors.privacyAccepted && (
              <span className="block text-red-600 mt-1">{errors.privacyAccepted.message}</span>
            )}
          </label>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Ödeme Bilgisi</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Siparişinizi tamamladıktan sonra, ödeme detayları e-posta ile gönderilecektir. 
              İlk ay ücretsiz deneme süresi bulunmaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};