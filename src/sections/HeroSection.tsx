import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { HERO_DATA, STATS } from '@/data'
import type { HeroSectionData } from '@/types'

interface StatBadgeProps {
  value: string
  label: string
}

function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
      <span className="text-2xl md:text-3xl font-heading font-bold text-accent">{value}</span>
      <span className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">{label}</span>
    </div>
  )
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-[90vh] flex items-center pt-20 pb-12 px-8 overflow-hidden bg-surface"
      aria-label="Hero"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L400 100M0 200L400 200M0 300L400 300M0 400L400 400M0 500L400 500M100 0L100 600M200 0L200 600M300 0L300 600" stroke="var(--color-accent)" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-heading text-xl font-black tracking-tighter text-primary">
            CROW SYSTEMS
          </span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-on-surface-variant hover:text-accent font-medium transition-colors text-sm">Services</a>
            <a href="#consulting" className="text-on-surface-variant hover:text-accent font-medium transition-colors text-sm">Consulting</a>
            <a href="#about" className="text-on-surface-variant hover:text-accent font-medium transition-colors text-sm">About</a>
            <a href="#contact" className="text-on-surface-variant hover:text-accent font-medium transition-colors text-sm">Contact</a>
          </div>

          <Button variant="primary" size="sm" onClick={() => { window.location.href = '#consulting' }}>
            Get Started
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-alt/10 text-accent-alt text-xs font-bold tracking-widest uppercase">
              {HERO_DATA.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.08] text-primary">
            {HERO_DATA.headline.split('{0}').map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && (
                  <span className="text-accent relative">
                    Growing
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-accent/20 rounded-full" />
                  </span>
                )}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl">
            {HERO_DATA.subheadline}
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              icon={<span className="material-symbols-outlined text-xl">arrow_forward</span>}
              onClick={() => { window.location.href = '#consulting' }}
            >
              {HERO_DATA.primaryCta}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => { window.location.href = '#services' }}
            >
              {HERO_DATA.secondaryCta}
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="hidden md:block relative"
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel shadow-xl border border-outline-variant/20">
            <img
              src={HERO_DATA.imageSrc}
              alt={HERO_DATA.imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Floating stat card */}
          <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-outline-variant/20 shadow-xl max-w-[220px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded bg-accent/10 flex items-center justify-center text-accent">
                <span className="material-symbols-outlined text-lg">monitoring</span>
              </div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">System Health</span>
            </div>
            <div className="text-3xl font-heading font-bold text-primary">99.9%</div>
            <p className="text-xs text-on-surface-variant">Uptime across all integrated environments</p>
          </div>
        </motion.div>
      </div>

      {/* Quick stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto w-full"
        role="list"
        aria-label="Key statistics"
      >
        {STATS.map((stat) => (
          <div key={stat.label} role="listitem" className="text-center p-6 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <span className="text-3xl font-heading font-bold text-accent block">{stat.value}</span>
            <span className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 block">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}