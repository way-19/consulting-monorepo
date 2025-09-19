export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

export interface OrderFormData {
  // Step 1: Company Details
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  
  // Step 2: Service Selection
  selectedServices: string[];
  projectDescription: string;
  timeline: string;
  budget: string;
  
  // Step 3: Additional Details
  additionalRequirements?: string;
  preferredStartDate: string;
  communicationPreference: 'email' | 'phone' | 'both';
}

export interface OrderStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}