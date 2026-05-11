import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { SectionWrapper } from '../layout/SectionWrapper';
import { submitConsultation } from '../api/client';
import { useState } from 'react';

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range' },
  { value: '$10k-$25k', label: '$10k - $25k' },
  { value: '$25k-$50k', label: '$25k - $50k' },
  { value: '$50k-$100k', label: '$50k - $100k' },
  { value: '$100k+', label: '$100k+' },
];

const PROBLEM_OPTIONS = [
  { value: '', label: 'Select a business problem' },
  { value: 'Operational Inefficiency', label: 'Operational Inefficiency' },
  { value: 'Digital Transformation', label: 'Digital Transformation' },
  { value: 'Market Entry Strategy', label: 'Market Entry Strategy' },
  { value: 'Technical Debt Reduction', label: 'Technical Debt Reduction' },
  { value: 'Infrastructure Scaling', label: 'Infrastructure Scaling' },
  { value: 'Other', label: 'Other' },
];

export function ConsultingSection() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, clearErrors } = useConsultationForm();
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const onSubmit = async (data: Record<string, unknown>) => {
    setServerError('');
    setServerSuccess('');
    try {
      const payload = {
        fullName: data.fullName as string,
        company: data.company as string,
        email: data.email as string,
        phone: data.phone as string,
        businessProblem: data.businessProblem as string,
        projectGoals: data.projectGoals as string,
        budgetRange: data.budgetRange as string,
      };
      const result = await submitConsultation(payload);
      if (result.success) {
        setServerSuccess('Thank you! Your consultation request has been submitted. We will be in touch within 4 business hours.');
        setValue('fullName', '');
        setValue('company', '');
        setValue('email', '');
        setValue('phone', '');
        setValue('businessProblem', '');
        setValue('projectGoals', '');
        setValue('budgetRange', '');
        clearErrors();
      } else {
        setServerError(result.message || 'Submission failed. Please try again.');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    }
  };

  const selectedBudget = watch('budgetRange');
  const [budgetLabels, budgetValues] = [['$10k - $25k', '$25k - $50k', '$50k - $100k', '$100k+'], ['$10k-$25k', '$25k-$50k', '$50k-$100k', '$100k+']];

  return (
    <SectionWrapper id="consulting" title="Start a Consultation" subtitle="Consulting Request">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card hover className="p-8">
            <h3 className="font-heading text-xl font-bold mb-6 text-on-surface">Request a Consultation</h3>
            {serverSuccess && (
              <div className="mb-6 p-4 bg-accent/10 text-accent dark:text-accent-dark rounded-lg text-sm font-medium" role="alert">
                {serverSuccess}
              </div>
            )}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium" role="alert">
                {serverError}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" required error={errors.fullName?.message} {...register('fullName')} />
                <Input label="Company" required error={errors.company?.message} {...register('company')} />
                <Input label="Work Email" type="email" required error={errors.email?.message} {...register('email')} />
                <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
              </div>
              <Select label="Business Problem" required error={errors.businessProblem?.message} {...register('businessProblem')}>
                {PROBLEM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Select>
              <TextArea label="Project Goals" error={errors.projectGoals?.message} {...register('projectGoals')} />
              <Select label="Budget Range" {...register('budgetRange')}>
                {BUDGET_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Select>
              <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Submit Consulting Request'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card hover className="p-8">
            <h4 className="font-heading text-lg font-bold mb-6 text-on-surface">The Crow Engagement Method</h4>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Triage', desc: 'Our lead architects review your submission within 4 business hours.' },
                { step: '02', title: 'Discovery', desc: 'A 30-minute high-fidelity call to align on technical constraints and KPI targets.' },
                { step: '03', title: 'Proposal', desc: 'A comprehensive roadmap with fixed-fee options delivered in 48 hours.' },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 font-bold text-sm">{item.step}</div>
                  <div>
                    <p className="text-on-surface font-bold text-sm">{item.title}</p>
                    <p className="text-on-surface-variant text-sm mt-1 font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card hover className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                <img alt="Marcus Thorne Portrait" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" />
              </div>
              <div>
                <p className="font-bold text-on-surface">Marcus Thorne</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Managing Partner, Crow Systems</p>
              </div>
            </div>
            <p className="italic text-on-surface-variant text-sm leading-relaxed border-l-2 border-primary/30 pl-4">
              "We built this intake system to capture the 'why' behind the problem. Audio allows us to hear the priorities that spreadsheets often hide."
            </p>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}