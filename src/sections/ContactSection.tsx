import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { APP_CONFIG } from '@/config'

interface ContactInfoItemProps {
  icon: string
  label: string
  children: React.ReactNode
}

function ContactInfoItem({ icon, label, children }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-accent text-xl mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <h5 className="font-bold text-primary">{label}</h5>
        <p className="text-sm text-on-surface-variant">{children}</p>
      </div>
    </div>
  )
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="contact" className="py-24 px-8 bg-surface" aria-label="Contact information">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16"
        >
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-heading font-bold text-primary mb-8">Establish Contact.</h2>
            <p className="text-on-surface-variant mb-12 leading-relaxed">
              Whether you need a full systems audit or a strategic consultation, our engineers are ready to deploy.
            </p>
            <div className="space-y-6">
              <ContactInfoItem icon="mail" label="Inquiries">
                <a href={`mailto:${APP_CONFIG.supportEmail}`} className="text-accent hover:underline">
                  {APP_CONFIG.supportEmail}
                </a>
              </ContactInfoItem>
              <ContactInfoItem icon="schedule" label="Business Hours">
                <div>
                  <p>Mon — Fri: 08:00 - 18:00 EST</p>
                  <p>Sat: 10:00 - 14:00 EST (On-call only)</p>
                </div>
              </ContactInfoItem>
              <ContactInfoItem icon="public" label="Regions Served">
                {APP_CONFIG.companyRegion}
              </ContactInfoItem>
            </div>
            <div className="pt-8 border-t border-outline-variant/50 flex gap-6">
              <a href={APP_CONFIG.linkedinUrl} className="text-on-surface-variant hover:text-accent font-medium transition-colors" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="#" className="text-on-surface-variant hover:text-accent font-medium transition-colors">
                GitHub
              </a>
              <a href={PRIVACY_POLICY_URL} className="text-on-surface-variant hover:text-accent font-medium transition-colors">
                Privacy Policy
              </a>
              <a href={TERMS_URL} className="text-on-surface-variant hover:text-accent font-medium transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-7 bg-surface-container-low p-8 md:p-12 rounded-xl border border-outline-variant/30 shadow-sm"
          >
            <h3 className="text-2xl font-heading font-bold text-primary mb-8">Send Us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Name
                  </label>
                  <input id="contact-name" type="text" placeholder="John Doe" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Email
                  </label>
                  <input id="contact-email" type="email" placeholder="john@example.com" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Message
                </label>
                <textarea id="contact-message" rows={5} placeholder="How can we help you?" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"></textarea>
              </div>
              <Button variant="primary" size="lg" icon={<span className="material-symbols-outlined text-xl">send</span>}>
                Send Message
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}