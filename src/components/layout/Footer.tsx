import { APP_CONFIG } from '@/config'
import { SECTIONS } from '@/data'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold">{APP_CONFIG.siteName}</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Precision-engineered consulting for growing businesses. We help small and medium-sized companies modernize, optimize, and grow.
            </p>
            <a href={`mailto:${APP_CONFIG.supportEmail}`} className="text-accent text-sm hover:underline">
              {APP_CONFIG.supportEmail}
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={section.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a href={APP_CONFIG.linkedinUrl} className="text-white/70 hover:text-white transition-colors text-sm" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
            <div className="pt-4 space-y-2">
              <a href="#" className="text-sm text-white/50 hover:text-white/80 transition-colors block">Privacy Policy</a>
              <a href="#" className="text-sm text-white/50 hover:text-white/80 transition-colors block">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/50">
            © {currentYear} Crow Systems. All rights reserved. Precision-Engineered Consulting.
          </p>
        </div>
      </div>
    </footer>
  )
}