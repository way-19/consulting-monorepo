import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { Button } from '../ui';
import { OrderFormData } from '../../types/order';
import { services } from '../../data/services';

interface Step4Props {
  watch: UseFormWatch<OrderFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const Step4ReviewAndSubmit: React.FC<Step4Props> = ({
  watch,
  isSubmitting,
  onSubmit
}) => {
  const formData = watch();
  const selectedServiceDetails = services.filter(service => 
    formData.selectedServices?.includes(service.id)
  );
  
  const totalPrice = selectedServiceDetails.reduce((total, service) => 
    total + service.price, 0
  );

  const timelineLabels: Record<string, string> = {
    'asap': 'En kısa sürede',
    '1-month': '1 ay içinde',
    '2-3-months': '2-3 ay içinde',
    '3-6-months': '3-6 ay içinde',
    'flexible': 'Esnek'
  };

  const budgetLabels: Record<string, string> = {
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-50k': '$25,000 - $50,000',
    '50k+': '$50,000+',
    'discuss': 'Görüşelim'
  };

  const communicationLabels: Record<string, string> = {
    'email': 'E-posta',
    'phone': 'Telefon',
    'both': 'Her ikisi'
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sipariş Özeti
        </h2>
        <p className="text-gray-600">
          Bilgilerinizi kontrol edin ve siparişinizi onaylayın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Şirket Bilgileri
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Şirket:</span>
              <p className="text-gray-900">{formData.companyName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">İletişim Kişisi:</span>
              <p className="text-gray-900">{formData.contactPerson}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">E-posta:</span>
              <p className="text-gray-900">{formData.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Telefon:</span>
              <p className="text-gray-900">{formData.phone}</p>
            </div>
            {formData.website && (
              <div>
                <span className="text-sm font-medium text-gray-500">Web Sitesi:</span>
                <p className="text-gray-900">{formData.website}</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Seçilen Hizmetler
          </h3>
          <div className="space-y-3">
            {selectedServiceDetails.map((service) => (
              <div key={service.id} className="flex justify-between items-center">
                <span className="text-gray-900">{service.name}</span>
                {service.price > 0 && (
                  <span className="font-semibold text-blue-600">
                    ${service.price.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
            {totalPrice > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-900">Toplam:</span>
                  <span className="text-xl text-blue-600">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Proje Detayları
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Zaman Çizelgesi:</span>
              <p className="text-gray-900">{timelineLabels[formData.timeline] || formData.timeline}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bütçe:</span>
              <p className="text-gray-900">{budgetLabels[formData.budget] || formData.budget}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Açıklama:</span>
              <p className="text-gray-900 text-sm">{formData.projectDescription}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ek Bilgiler
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Başlangıç Tarihi:</span>
              <p className="text-gray-900">
                {formData.preferredStartDate ? 
                  new Date(formData.preferredStartDate).toLocaleDateString('tr-TR') : 
                  '-'
                }
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">İletişim Tercihi:</span>
              <p className="text-gray-900">
                {communicationLabels[formData.communicationPreference] || formData.communicationPreference}
              </p>
            </div>
            {formData.additionalRequirements && (
              <div>
                <span className="text-sm font-medium text-gray-500">Ek Gereksinimler:</span>
                <p className="text-gray-900 text-sm">{formData.additionalRequirements}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">
          🎯 Sipariş Onayı
        </h4>
        <p className="text-blue-800 text-sm mb-4">
          Yukarıdaki bilgileri kontrol ettiniz mi? Siparişinizi onayladığınızda, 
          ekibimiz 24 saat içinde sizinle iletişime geçecektir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            loading={isSubmitting}
            onClick={onSubmit}
            className="flex-1"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Siparişi Onayla'}
          </Button>
        </div>
      </div>
    </div>
  );
};