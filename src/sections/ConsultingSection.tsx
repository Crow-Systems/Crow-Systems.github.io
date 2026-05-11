import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useFormValidation } from '@/hooks/useFormValidation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SUBMIT_CONSULTATION, submitAudio } from '@/services'
import type { ConsultingFormData, AudioSubmissionData } from '@/types'

export function ConsultingSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const audio = useAudioRecorder()
  const { errors, validateField, validateAll, clearError, clearAllErrors } = useFormValidation()

  const [formData, setFormData] = useState<Partial<ConsultingFormData>>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    businessProblem: '',
    projectGoals: '',
    budgetRange: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) clearError(name)
  }

  const handleAudioDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, audioDescription: e.target.value }))
  }

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    clearAllErrors()

    const validation = validateAll(formData)
    if (!validation.isValid) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await SUBMIT_CONSULTATION(formData as ConsultingFormData)
      if (result.success) {
        setSubmitted(true)
        setFormData({ fullName: '', company: '', email: '', phone: '', businessProblem: '', projectGoals: '', budgetRange: '' })
      } else {
        setSubmitError(result.message || 'Submission failed. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAudioSubmit = async () => {
    if (!audio.blob) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitAudio(audio.blob, {
        email: formData.email || '',
        description: formData.projectGoals || '',
        duration: audio.duration,
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setSubmitError(result.message || 'Audio upload failed.')
      }
    } catch {
      setSubmitError('Network error during audio upload.')
    } finally {
      setSubmitting(false)
    }
  }

  const budgetOptions = [
    { label: '$10k – $25k', value: '10k-25k' },
    { label: '$25k – $50k', value: '25k-50k' },
    { label: '$50k – $100k', value: '50k-100k' },
    { label: '$100k+', value: '100k+' },
  ]

  if (submitted) {
    return (
      <section ref={ref} id="consulting" className="py-24 px-8 bg-surface" aria-label="Consulting submitted">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div className="w-20 h-20 rounded-full bg-accent-alt/20 flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-accent-alt text-5xl">check_circle</span>
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Thank You!</h2>
          <p className="text-xl text-on-surface-variant mb-4">Your consultation request has been received.</p>
          <p className="text-on-surface-variant mb-12">We'll review your submission and respond within 4 business hours.</p>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = '#home' }}>
            Back to Home
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} id="consulting" className="py-24 px-8 bg-surface" aria-label="Consulting intake">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Left: Audio + Form */}
          <div className="md:col-span-7 space-y-8">
            {/* Audio Recording */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-8 relative overflow-hidden group shadow-sm"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-on-surface">mic</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-2 h-2 rounded-full ${audio.isRecording ? 'bg-error animate-pulse' : 'bg-accent'}`} aria-hidden="true" />
                <h2 className="text-2xl font-heading font-bold text-primary">Audio Idea Submission</h2>
              </div>

              {!audio.permissionDenied && (
                <div className="bg-surface rounded-xl p-8 border border-outline-variant/30 mb-6 flex flex-col items-center justify-center text-center">
                  {/* Visualizer bars */}
                  <div className="flex gap-1 items-end h-16 mb-6" aria-hidden="true">
                    {[4, 12, 16, 24, 16, 12, 8, 4].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${audio.isRecording ? 'bg-accent' : 'bg-outline-variant/40'}`}
                        style={{ height: audio.isRecording ? `${Math.max(8, Math.random() * h)}px` : `${h}px` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Delete */}
                    <button
                      onClick={audio.deleteRecording}
                      disabled={!audio.blob && !audio.isRecording}
                      className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-error hover:text-error transition-all bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Delete recording"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>

                    {/* Record / Stop */}
                    <button
                      onClick={audio.isRecording ? audio.stop : audio.start}
                      disabled={submitting}
                      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        audio.isRecording
                          ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                          : 'bg-accent text-white hover:bg-accent/90 active:scale-95'
                      } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      aria-label={audio.isRecording ? 'Stop recording' : 'Start recording'}
                    >
                      <span className="material-symbols-outlined text-4xl">
                        {audio.isRecording ? 'stop' : 'mic'}
                      </span>
                    </button>

                    {/* Play */}
                    <button
                      onClick={() => {
                        if (audio.url) {
                          const audioEl = new Audio(audio.url)
                          audioEl.play()
                        }
                      }}
                      disabled={!audio.url || audio.isRecording}
                      className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-accent hover:text-accent transition-all bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Play recording"
                    >
                      <span className="material-symbols-outlined">play_arrow</span>
                    </button>
                  </div>

                  {/* Duration */}
                  <p className="mt-6 font-mono text-sm text-on-surface-variant">
                    {String(Math.floor(audio.duration / 60000)).padStart(2, '0')}:
                    {String(Math.floor((audio.duration % 60000) / 1000)).padStart(2, '0')}{' '}
                    / 05:00
                  </p>
                </div>
              )}

              {audio.permissionDenied && (
                <div className="bg-surface-container rounded-xl p-8 text-center">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">mic_off</span>
                  <p className="text-on-surface-variant mb-2">Microphone access is required for audio recording.</p>
                  <p className="text-sm text-on-surface-variant">Please enable microphone permissions in your browser settings, or use the form below to submit your request.</p>
                </div>
              )}

              {/* Optional description */}
              <div className="space-y-2 mt-6">
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="audio-description">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="audio-description"
                  className="w-full bg-white border border-outline-variant rounded-lg p-4 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none min-h-[120px] transition-all font-body text-sm"
                  placeholder="Describe any technical constraints or specific outcomes you're looking for..."
                  value={formData.businessProblem || ''}
                  onChange={handleAudioDescriptionChange}
                />
              </div>

              {/* Audio submit button */}
              {audio.blob && !submitted && (
                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<span className="material-symbols-outlined text-xl">upload</span>}
                    onClick={handleAudioSubmit}
                    isLoading={submitting}
                    className="w-full"
                  >
                    Submit Audio Idea
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Consulting Request Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-8 md:p-12 shadow-sm"
            >
              <h3 className="text-2xl font-heading font-bold text-primary mb-8">Consulting Request Form</h3>

              <form onSubmit={handleSubmitConsultation} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      className={`w-full bg-surface-container-lowest border ${errors.fullName ? 'border-error' : 'border-outline-variant/50'} rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all`}
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() => validateField('fullName', formData.fullName || '')}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="text-error text-xs mt-1" role="alert">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Company <span className="text-error">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      className={`w-full bg-surface-container-lowest border ${errors.company ? 'border-error' : 'border-outline-variant/50'} rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all`}
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={() => validateField('company', formData.company || '')}
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? 'company-error' : undefined}
                    />
                    {errors.company && (
                      <p id="company-error" className="text-error text-xs mt-1" role="alert">{errors.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Work Email <span className="text-error">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`w-full bg-surface-container-lowest border ${errors.email ? 'border-error' : 'border-outline-variant/50'} rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all`}
                      placeholder="j.doe@acme.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => validateField('email', formData.email || '')}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-error text-xs mt-1" role="alert">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="businessProblem" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Business Problem <span className="text-error">*</span>
                  </label>
                  <select
                    id="businessProblem"
                    name="businessProblem"
                    required
                    className={`w-full bg-surface-container-lowest border ${errors.businessProblem ? 'border-error' : 'border-outline-variant/50'} rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none`}
                    value={formData.businessProblem}
                    onChange={handleChange}
                    onBlur={() => validateField('businessProblem', formData.businessProblem || '')}
                    aria-invalid={!!errors.businessProblem}
                    aria-describedby={errors.businessProblem ? 'businessProblem-error' : undefined}
                  >
                    <option value="">Select business problem</option>
                    <option>Operational Inefficiency</option>
                    <option>Digital Transformation</option>
                    <option>Market Entry Strategy</option>
                    <option>Technical Debt Reduction</option>
                    <option>Infrastructure Scaling</option>
                    <option>Other</option>
                  </select>
                  {errors.businessProblem && (
                    <p id="businessProblem-error" className="text-error text-xs mt-1" role="alert">{errors.businessProblem}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="projectGoals" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Project Goals
                  </label>
                  <textarea
                    id="projectGoals"
                    name="projectGoals"
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[100px]"
                    placeholder="What are the key outcomes you're looking to achieve?"
                    value={formData.projectGoals}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Budget Range
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {budgetOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, budgetRange: option.value }))
                          if (errors.budgetRange) clearError('budgetRange')
                        }}
                        className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                          formData.budgetRange === option.value
                            ? 'bg-accent text-white border-accent'
                            : 'bg-surface-container-lowest border-outline-variant/50 text-on-surface hover:border-accent/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {submitError && (
                  <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-error text-sm" role="alert">
                    {submitError}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  isLoading={submitting}
                  icon={<span className="material-symbols-outlined text-xl">arrow_forward</span>}
                  className="w-full"
                >
                  Submit Consulting Request
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <aside className="md:col-span-5 space-y-6">
            {/* Process Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAySuLLuDFjdPWYNsP8aWixJs559cGfA5CmY2mXTqXw-jbiU0xQm0vjPxURMoRiwP9gwYKyCVpw5vCed6688C0IsOHjt2uu4JrdwMXkAjlmb1Vc6ES5M-rpRHT2y5EBw3jOnNnLHROdNb17KQN09f__dnUhElSlyQpFOd3-t8Pbrxd0GM7u2YF2ZaPVOhC1FrPUl7hhik5QXBGmDEhIYw8Ik13hg9aYEra1nKCwl96oOGFq5iodfHxTEfIelCChqVXv0L4ZD2tiR0M"
                alt="Modern corporate boardroom"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-8">
                <h4 className="text-xl font-heading font-bold mb-6 text-primary">The Crow Engagement Method</h4>
                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Triage', desc: 'Our lead architects review your audio submission and brief within 4 business hours.' },
                    { step: '02', title: 'Discovery', desc: 'A 30-minute high-fidelity call to align on technical constraints and KPI targets.' },
                    { step: '03', title: 'Proposal', desc: 'A comprehensive roadmap with fixed-fee options delivered in 48 hours.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent-alt flex items-center justify-center text-white shrink-0 font-bold text-xs">
                        {step}
                      </div>
                      <div>
                        <p className="text-sm text-primary font-bold">{title}</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-accent-alt/5 border border-accent-alt/20 rounded-xl p-8 shadow-sm"
            >
              <div className="mb-6">
                <span className="material-symbols-outlined text-accent text-4xl">verified_user</span>
              </div>
              <h4 className="text-xl font-heading font-bold mb-3 text-primary">Corporate-Grade Security</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                All submissions, including audio files, are encrypted using AES-256 at rest and TLS 1.3 in transit. Standard NDAs are available upon request.
              </p>
            </motion.div>

            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-8 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/30">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1010-HA1iNNdUpSIT5LymnEYRVKVzmOSmlZnrMxBM2YbAOD2t_GH7Km8YwVXnL5Vh03K-L3zh5BR43BVl42LlDtOn5LN51GcmhicptJkxFLsb_4OdBEsksCQLX-YJ9647VTJoPfdMDb6ColRFJAd1__6YhHhsJVAm04S-myUQcJrlgB19uVLE-LbrF2aNDZUfkKMb1GbIMNkWnvvRyC22lUl9yHbwHczachxeVm4mLqG-61-zOHpsRno3V8EZq2eHNtRZSi2Yr4g"
                    alt="Marcus Thorne Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-heading font-bold text-primary">Marcus Thorne</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Managing Partner, Crow Systems</p>
                </div>
              </div>
              <blockquote className="italic text-sm text-on-surface-variant leading-relaxed border-l-2 border-accent pl-4">
                &ldquo;We built this intake system to capture the &lsquo;why&rsquo; behind the problem. Audio allows us to hear the priorities that spreadsheets often hide.&rdquo;
              </blockquote>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  )
}