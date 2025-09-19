import { z } from 'zod';

export const step1Schema = z.object({
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  contactPerson: z.string().min(2, 'İletişim kişisi adı en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  website: z.string().url('Geçerli bir web sitesi adresi giriniz').optional().or(z.literal(''))
});

export const step2Schema = z.object({
  selectedServices: z.array(z.string()).min(1, 'En az bir hizmet seçmelisiniz'),
  projectDescription: z.string().min(10, 'Proje açıklaması en az 10 karakter olmalıdır'),
  timeline: z.string().min(1, 'Zaman çizelgesi seçmelisiniz'),
  budget: z.string().min(1, 'Bütçe aralığı seçmelisiniz')
});

export const step3Schema = z.object({
  additionalRequirements: z.string().optional(),
  preferredStartDate: z.string().min(1, 'Başlangıç tarihi seçmelisiniz'),
  communicationPreference: z.enum(['email', 'phone', 'both'], {
    required_error: 'İletişim tercihi seçmelisiniz'
  })
});

export const orderFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type OrderFormData = z.infer<typeof orderFormSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;