import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TEAM } from '@/data'

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="about" className="py-24 px-8 bg-neutral-light" aria-label="About Crow Systems">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
            Who We Are
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            We bridge the gap between high-tech innovation and institutional stability, delivering operational confidence to SME owners worldwide.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
          {/* Company image/card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-8 h-[400px] relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkwTbvcoTSTFNYUJ8frCNdH42jVWTz9N-gdGXWMOGgVxIQcajQ5tJs37bDiz9gCI6gm_pSz_hQcI2V-KEMM0C-sDGqaHWRRpdKlwokhC1SZUm_v5y6GrU-TJEkP-cnFzuuRKgAKrICpsvSS7xLnIdN1O_WEdfPUxe0VrPPlohWiYeXWu2_HxGbvjVt7tocWy--VlHc0BEqj48z8L0UOe6-j_p_LgVi39auB2BfXA-zrN5AUcEV-Lc9SIrZ3rRTT8l3o8BS4kZbXoI"
              alt="Crow Systems office environment"
              className="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent/30 p-8 flex flex-col justify-end">
              <h3 className="text-2xl font-heading font-bold mb-2 text-primary">Our Story</h3>
              <p className="text-on-surface-variant max-w-lg text-sm leading-relaxed">
                Founded in 2018, Crow Systems emerged from the need for technical clarity in complex markets. We don&apos;t just advise; we engineer resilience.
              </p>
            </div>
          </motion.div>

          {/* Stats sidebar */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="bg-accent-alt/10 border border-accent-alt/20 rounded-xl p-8 flex flex-col justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-on-accent-alt text-4xl mb-4">analytics</span>
              <h4 className="text-3xl font-heading font-bold text-primary mb-2">240+</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Global Projects Completed with 99% operational uptime post-implementation.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-accent/5 border border-accent/10 rounded-xl p-8 flex flex-col justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-accent text-4xl mb-4">groups</span>
              <h4 className="text-3xl font-heading font-bold text-primary mb-2">15</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Core senior engineers dedicated to precision results.</p>
            </motion.div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: 'rocket_launch',
              title: 'Mission',
              text: 'To provide SMEs with the technical blueprints and strategic foresight required to dominate their respective markets through precision engineering.',
            },
            {
              icon: 'visibility',
              title: 'Vision',
              text: 'To become the global gold standard for operational confidence, turning technical complexity into a competitive advantage for our partners.',
            },
            {
              icon: 'shield_with_heart',
              title: 'Core Values',
              text: '',
              values: ['Radical Transparency', 'Mathematical Precision', 'Future-Proof Thinking'],
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className="bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/30 hover:border-accent/50 transition-all shadow-sm hover:shadow-md group"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-accent text-xl">{item.icon}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-primary">{item.title}</h3>
              {item.text ? (
                <p className="text-on-surface-variant leading-relaxed text-sm">{item.text}</p>
              ) : (
                <ul className="space-y-3">
                  {(item.values || []).map((v, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                      <span className="w-1.5 h-1.5 bg-accent-alt rounded-full"></span>
                      {v}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-heading font-bold mb-4 text-primary">
                Expert Minds.<br />Proven Results.
              </h2>
              <p className="text-on-surface-variant">Our team consists of veterans from aerospace, fintech, and data science industries, united by a singular focus on stability.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden mb-4 border border-outline-variant/30 shadow-sm">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-xl font-heading font-bold text-primary">{member.name}</h4>
                <p className="text-accent text-sm font-medium uppercase tracking-wider mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}