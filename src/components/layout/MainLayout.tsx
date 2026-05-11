import { NAV_ITEMS } from '../../data/constants';
import { MainLayoutProps } from '../../types/layout';

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/20 font-body">
      <Navbar items={NAV_ITEMS} />
      <main className="pt-28">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Navbar({ items }: { items: Array<{ label: string; href: string }> }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30" role="navigation" aria-label="Main navigation">
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <a href="/" className="font-heading text-xl font-black tracking-tighter text-primary" aria-label="Crow Systems Home">
          CROW SYSTEMS
        </a>
        <div className="hidden md:flex items-center gap-6">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors duration-300 text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a href="#consulting" className="bg-primary text-on-primary font-bold px-5 py-2 rounded-lg text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
          Get Started
        </a>
        <button className="md:hidden p-2 text-on-surface" aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30" role="contentinfo">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-8 py-10 max-w-7xl mx-auto gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-base font-bold text-primary">CROW SYSTEMS</span>
          <p className="font-body text-sm text-on-surface-variant">© 2024 Crow Systems. Precision-Engineered Consulting.</p>
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          <a href="#" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">LinkedIn</a>
          <a href="#" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Twitter</a>
          <a href="#privacy" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#terms" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}