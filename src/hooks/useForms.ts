import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';

const consultationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(1, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  businessProblem: z.string().min(20, 'Please describe your business problem in at least 20 characters'),
  projectGoals: z.string().optional(),
  budgetRange: z.string().optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationSchema>;

export function useConsultationForm(defaultValues?: Partial<ConsultationFormValues>): UseFormReturn<ConsultationFormValues> {
  return useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phone: '',
      businessProblem: '',
      projectGoals: '',
      budgetRange: '',
      ...defaultValues,
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export function useContactForm(): UseFormReturn<ContactFormValues> {
  return useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
}