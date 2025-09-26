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
    'asap': 'As soon as possible',
    '1-month': 'Within 1 month',
    '2-3-months': 'Within 2-3 months',
    '3-6-months': 'Within 3-6 months',
    'flexible': 'Flexible'
  };

  const budgetLabels: Record<string, string> = {
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-50k': '$25,000 - $50,000',
    '50k+': '$50,000+',
    'discuss': 'Let\'s discuss'
  };

  const communicationLabels: Record<string, string> = {
    'email': 'Email',
    'phone': 'Phone',
    'both': 'Both'
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Summary
        </h2>
        <p className="text-gray-600">
          Review your information and confirm your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Company Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Company:</span>
              <p className="text-gray-900">{formData.companyName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Contact Person:</span>
              <p className="text-gray-900">{formData.contactPerson}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-gray-900">{formData.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Phone:</span>
              <p className="text-gray-900">{formData.phone}</p>
            </div>
            {formData.website && (
              <div>
                <span className="text-sm font-medium text-gray-500">Website:</span>
                <p className="text-gray-900">{formData.website}</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Services
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
                  <span className="text-gray-900">Total:</span>
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
            Project Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Timeline:</span>
              <p className="text-gray-900">{timelineLabels[formData.timeline] || formData.timeline}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Budget:</span>
              <p className="text-gray-900">{budgetLabels[formData.budget] || formData.budget}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Description:</span>
              <p className="text-gray-900 text-sm">{formData.projectDescription}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Start Date:</span>
              <p className="text-gray-900">
                {formData.preferredStartDate ? 
                  new Date(formData.preferredStartDate).toLocaleDateString('en-US') : 
                  '-'
                }
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Communication Preference:</span>
              <p className="text-gray-900">
                {communicationLabels[formData.communicationPreference] || formData.communicationPreference}
              </p>
            </div>
            {formData.additionalRequirements && (
              <div>
                <span className="text-sm font-medium text-gray-500">Additional Requirements:</span>
                <p className="text-gray-900 text-sm">{formData.additionalRequirements}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">
          🎯 Order Confirmation
        </h4>
        <p className="text-blue-800 text-sm mb-4">
          Have you reviewed the information above? Once you confirm your order, 
          our team will contact you within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            loading={isSubmitting}
            onClick={onSubmit}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};