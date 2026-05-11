import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SERVICES } from '@/data'
import type { Service } from '@/types'

interface ServiceIconProps {
  icon: string
}

function ServiceIcon({ icon }: ServiceIconProps) {
  const iconMap: Record<string, string> = {
    hub: 'hub',
    dns: 'dns',
    terminal: 'terminal',
    architecture: 'architecture',
    database: 'database',
    smart_robot: 'smart_robot',
    cloud_sync: 'cloud_sync',
    shield_person: 'shield_person',
    rocket_launch: 'rocket_launch',
  }
  const name = iconMap[icon] || icon

  return (
    <span className="material-symbols-outlined text-3xl text-accent select-none">
      {name}
    </span>
  )
}

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="services" className="py-24 px-8 bg-surface" aria-label="Our services">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-block px-3 py-1 border border-accent/20 bg-accent/10 rounded-full text-xs font-bold tracking-widest text-accent uppercase"
            >
              Precision Consulting
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading font-bold leading-tight text-primary"
            >
              Modernizing Your <span className="text-accent">Operational Core</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-on-surface-variant text-lg"
            >
              We don&apos;t just recommend tech; we build the foundational systems that drive your business&apos;s next stage of evolution.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Button variant="secondary" size="md" onClick={() => { window.location.href = '#consulting' }}>
              View All Services <span className="material-symbols-outlined text-base">trending_flat</span>
            </Button>
          </motion.div>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service: Service, index: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              <Card
                icon={<ServiceIcon icon={service.icon} />}
                title={service.title}
                description={service.description}
                features={service.features}
                cta={service.cta}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-24 relative overflow-hidden bg-primary rounded-3xl p-12 md:p-20 text-white shadow-2xl"
          role="complementary"
          aria-label="Call to action"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 text-white text-[12rem] pointer-events-none">
            <span className="material-symbols-outlined">query_stats</span>
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <h3 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
              Ready to Optimize Your Operations?
            </h3>
            <p className="text-primary-fixed-dim text-lg leading-relaxed">
              Schedule a technical audit with our lead consultants to identify high-impact opportunities for your infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => { window.location.href = '#consulting' }}
              >
                Schedule Your Consultation
              </Button>
              <Button
                variant="tertiary"
                size="lg"
              >
                Download Capabilities
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}