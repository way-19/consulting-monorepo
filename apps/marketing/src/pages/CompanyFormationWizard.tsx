import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import jurisdictionsData from '../config/jurisdictions.json';

// Company Formation Application schema
const formationApplicationSchema = z.object({
  jurisdiction: z.string().min(1, 'Please select a jurisdiction'),
  entityType: z.string().min(1, 'Please select an entity type'),
  proposedNames: z.array(z.string()).min(1, 'At least one company name is required'),
  package: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    currency: z.string()
  }),
  addons: z.array(z.object({
    id: z.string(),
    label: z.string(),
    price: z.number()
  })).optional(),
  contact: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone number is required')
  }),
  personal: z.object({
    nationality: z.string().min(1, 'Nationality is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    passportNumber: z.string().optional(),
    address: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().optional(),
      zipcode: z.string().min(1, 'Zip code is required'),
      country: z.string().min(1, 'Country is required')
    })
  }),
  consents: z.object({
    termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
  })
});

type FormationApplicationData = z.infer<typeof formationApplicationSchema>;

const CompanyFormationWizard: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormationApplicationData>({
    resolver: zodResolver(formationApplicationSchema),
    mode: 'onChange',
    defaultValues: {
      jurisdiction: '',
      entityType: '',
      proposedNames: ['', '', ''],
      addons: [],
      contact: {
        fullName: '',
        email: '',
        phone: ''
      },
      personal: {
        nationality: '',
        dateOfBirth: '',
        passportNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: ''
        }
      },
      consents: {
        termsAccepted: false
      }
    }
  });

  const watchedValues = form.watch();

  // Load wizard state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('company-formation-wizard');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        form.reset(parsedState.formData);
        setCurrentStep(parsedState.currentStep);
        
        // Find and set selected jurisdiction
        if (parsedState.formData.jurisdiction) {
          const jurisdiction = jurisdictionsData.jurisdictions.find(
            j => j.code === parsedState.formData.jurisdiction
          );
          setSelectedJurisdiction(jurisdiction);
        }
      } catch (error) {
        console.error('Failed to load saved wizard state:', error);
      }
    }
  }, [form]);

  // Save wizard state to localStorage whenever form data or step changes
  useEffect(() => {
    const stateToSave = {
      formData: watchedValues,
      currentStep
    };
    localStorage.setItem('company-formation-wizard', JSON.stringify(stateToSave));
  }, [watchedValues, currentStep]);

  const onSubmit = async (data: FormationApplicationData) => {
    if (!user) {
      toast.error('Please log in to submit your application');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate totals
      const packagePrice = data.package.price;
      const addonsTotal = data.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
      const estimatedTotal = packagePrice + addonsTotal;

      // Prepare submission payload
      const submissionPayload = {
        ...data,
        totals: {
          package: packagePrice,
          addons: addonsTotal,
          estimatedTotal
        },
        meta: {
          submittedAt: new Date().toISOString(),
          source: 'company-formation-wizard'
        }
      };

      // Update user profile with selected jurisdiction
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          role: 'client',
          country_id: data.jurisdiction
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create or update client record with assigned consultant
      const { error: clientError } = await supabase
        .from('clients')
        .upsert({
          user_id: user.id,
          assigned_consultant_id: selectedJurisdiction?.defaultConsultantId,
          updated_at: new Date().toISOString()
        });

      if (clientError) throw clientError;

      // Create service order
      const { data: serviceOrder, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: user.id,
          consultant_id: selectedJurisdiction?.defaultConsultantId,
          service_type: 'company_formation',
          status: 'pending',
          total_amount: estimatedTotal,
          currency: data.package.currency,
          details: submissionPayload,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Send notification to assigned consultant
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          recipient_id: selectedJurisdiction?.defaultConsultantId,
          type: 'new_application',
          payload: {
            applicant_name: data.contact.fullName,
            company_name: data.proposedNames[0],
            jurisdiction: selectedJurisdiction?.name,
            application_id: serviceOrder.id,
            estimated_total: estimatedTotal,
            currency: data.package.currency
          },
          email_notification: true
        }),
      });

      // Trigger webhook for application submitted
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhooks/application-submitted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          application_id: serviceOrder.id,
          user_id: user.id,
          jurisdiction: data.jurisdiction,
          total_amount: estimatedTotal,
          consultant_id: selectedJurisdiction?.defaultConsultantId
        }),
      });

      // Clear saved wizard state
      localStorage.removeItem('company-formation-wizard');

      toast.success('Application submitted successfully! Our team will contact you shortly.');
      
      // Redirect to client dashboard
      window.location.href = '/client';

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      // Auto-skip disabled steps
      let nextStepNumber = currentStep + 1;
      
      if (selectedJurisdiction) {
        // Skip addons step if disabled for this jurisdiction
        if (nextStepNumber === 4 && !selectedJurisdiction.steps.addons) {
          nextStepNumber = 5;
        }
      }
      
      setCurrentStep(Math.min(nextStepNumber, 6));
    } else {
      toast.error('Please complete all required fields before proceeding');
    }
  };

  const prevStep = () => {
    let prevStepNumber = currentStep - 1;
    
    if (selectedJurisdiction) {
      // Skip addons step if disabled for this jurisdiction (going backwards)
      if (prevStepNumber === 4 && !selectedJurisdiction.steps.addons) {
        prevStepNumber = 3;
      }
    }
    
    setCurrentStep(Math.max(prevStepNumber, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Stepper */}
          <div className="col-span-3">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Formation</h2>
              <div className="text-sm text-gray-500 mb-6">~3 min to complete</div>
              
              {/* Stepper component will go here */}
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Select Jurisdiction', enabled: true },
                  { step: 2, title: 'Company Name & Type', enabled: true },
                  { step: 3, title: 'Select Package', enabled: true },
                  { step: 4, title: 'Additional Services', enabled: selectedJurisdiction?.steps.addons !== false },
                  { step: 5, title: 'Your Details', enabled: true },
                  { step: 6, title: 'Review & Submit', enabled: true }
                ].map(({ step, title, enabled }) => (
                  <div
                    key={step}
                    className={`flex items-center space-x-3 ${
                      !enabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? 'bg-indigo-600 text-white'
                          : currentStep > step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step ? '✓' : step}
                    </div>
                    <span
                      className={`text-sm ${
                        currentStep === step
                          ? 'text-indigo-600 font-medium'
                          : currentStep > step
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {!enabled ? `${title} (Skipped)` : title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Step content will be rendered here */}
              <div className="mb-8">
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Select Jurisdiction</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {jurisdictionsData.jurisdictions
                        .filter(j => j.active)
                        .map(jurisdiction => (
                          <button
                            key={jurisdiction.code}
                            type="button"
                            onClick={() => {
                              form.setValue('jurisdiction', jurisdiction.code);
                              setSelectedJurisdiction(jurisdiction);
                            }}
                            className={`p-4 border-2 rounded-lg text-left transition-all hover:border-indigo-300 ${
                              watchedValues.jurisdiction === jurisdiction.code
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{jurisdiction.flag}</span>
                              <span className="font-medium text-gray-900">{jurisdiction.name}</span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Review & Submit</h3>
                    
                    {/* Payment Information Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
                      <p className="text-sm text-blue-700">
                        After your application is reviewed and approved, you will receive payment instructions 
                        from your assigned consultant. Payment processing is handled securely through our 
                        integrated payment system.
                      </p>
                    </div>

                    {/* Application Summary */}
                    <div className="space-y-4 mb-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Application Summary</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Jurisdiction:</strong> {selectedJurisdiction?.name}</p>
                          <p><strong>Entity Type:</strong> {watchedValues.entityType}</p>
                          <p><strong>Proposed Names:</strong> {watchedValues.proposedNames.filter(name => name.trim()).join(', ')}</p>
                          <p><strong>Package:</strong> {watchedValues.package?.name}</p>
                          {watchedValues.addons && watchedValues.addons.length > 0 && (
                            <p><strong>Add-ons:</strong> {watchedValues.addons.map(addon => addon.label).join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-6">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          {...form.register('consents.termsAccepted')}
                          className="mt-1"
                        />
                        <span className="text-sm text-gray-700">
                          I confirm I have read and agree to the{' '}
                          <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                      {form.formState.errors.consents?.termsAccepted && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.consents.termsAccepted.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                
                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || !watchedValues.consents?.termsAccepted}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="col-span-3">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
                
                <div className="space-y-4 text-sm">
                  {watchedValues.jurisdiction && selectedJurisdiction && (
                    <div>
                      <span className="text-gray-500">Jurisdiction:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span>{selectedJurisdiction.flag}</span>
                        <span className="font-medium">{selectedJurisdiction.name}</span>
                      </div>
                    </div>
                  )}

                  {watchedValues.entityType && (
                    <div>
                      <span className="text-gray-500">Entity Type:</span>
                      <div className="font-medium mt-1">{watchedValues.entityType}</div>
                    </div>
                  )}

                  {watchedValues.proposedNames.some(name => name.trim()) && (
                    <div>
                      <span className="text-gray-500">Proposed Names:</span>
                      <div className="mt-1 space-y-1">
                        {watchedValues.proposedNames
                          .filter(name => name.trim())
                          .map((name, index) => (
                            <div key={index} className="font-medium">{name}</div>
                          ))}
                      </div>
                    </div>
                  )}

                  {watchedValues.package && (
                    <div>
                      <span className="text-gray-500">Package:</span>
                      <div className="font-medium mt-1">{watchedValues.package.name}</div>
                      <div className="text-indigo-600 font-semibold">
                        {selectedJurisdiction?.currency} {watchedValues.package.price.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {watchedValues.addons && watchedValues.addons.length > 0 && (
                    <div>
                      <span className="text-gray-500">Add-ons:</span>
                      <div className="mt-1 space-y-1">
                        {watchedValues.addons.map((addon, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="font-medium">{addon.label}</span>
                            <span className="text-indigo-600">
                              {selectedJurisdiction?.currency} {addon.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {watchedValues.package && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Estimated Total:</span>
                        <span className="font-bold text-lg text-indigo-600">
                          {selectedJurisdiction?.currency}{' '}
                          {(
                            watchedValues.package.price +
                            (watchedValues.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormationWizard;