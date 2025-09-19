import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { CheckCircle, Clock, ArrowRight, User, Building, FileText, CreditCard } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ComponentType<any>;
}

const ClientOnboarding = () => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your personal and company information',
      completed: !!profile?.full_name && !!profile?.company,
      icon: User
    },
    {
      id: 'consultant',
      title: 'Meet Your Consultant',
      description: 'Get assigned to an expert consultant',
      completed: false, // Will be checked from database
      icon: Building
    },
    {
      id: 'documents',
      title: 'Upload Initial Documents',
      description: 'Submit required business documents',
      completed: false, // Will be checked from database
      icon: FileText
    },
    {
      id: 'payment',
      title: 'Setup Payment Method',
      description: 'Add payment information for services',
      completed: false, // Will be checked from database
      icon: CreditCard
    }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100;

  const handleCompleteOnboarding = () => {
    // Mark onboarding as completed
    alert('Onboarding completed! Welcome to Consulting19.');
  };

  return (
    <>
      <Helmet>
        <title>Onboarding - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Consulting19!</h1>
          <p className="text-gray-600">Let's get you set up for success with our platform</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Onboarding Progress</h2>
            <span className="text-sm text-gray-600">{completedSteps} of {onboardingSteps.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{progressPercentage.toFixed(0)}% complete</p>
        </div>

        {/* Onboarding Steps */}
        <div className="space-y-4">
          {onboardingSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
                step.completed ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step.completed ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Completed
                    </span>
                  ) : (
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Start
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion */}
        {completedSteps === onboardingSteps.length ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">You're All Set!</h2>
            <p className="text-green-700 mb-6">
              Onboarding completed! Welcome to Consulting19.
            </p>
            <button 
              onClick={handleCompleteOnboarding}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Continue Your Setup</h3>
            <p className="text-blue-700">
              Complete the remaining steps to get the most out of Consulting19.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientOnboarding;