import { NAV_ITEMS, SOCIAL_LINKS, COMPANY_INFO } from "../../data/constants";
import type { MainLayoutProps } from "../../types/layout";

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/20 font-body">
      <Navbar items={NAV_ITEMS} />
      <main className="pt-28">{children}</main>
      <Footer />
    </div>
  );
}

import {
  SOCIAL_LINKS as SOCIAL,
  COMPANY_INFO as INFO,
} from "../../data/constants";
import type { ComponentPropsWithoutRef } from "react";

function Navbar({ items }: { items: Array<{ label: string; href: string }> }) {
  const handleMenuToggle = () => {
    const menu = document.getElementById("mobile-menu");
    if (menu) menu.classList.toggle("hidden");
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <a
          href="/"
          className="font-heading text-xl font-black tracking-tighter text-primary"
          aria-label="Crow Systems Home"
        >
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
        <a
          href="/consulting"
          className="bg-primary text-on-primary font-bold px-5 py-2 rounded-lg text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
        >
          Get Started
        </a>
        <button
          onClick={handleMenuToggle}
          className="md:hidden p-2 text-on-surface"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <div
        id="mobile-menu"
        className="md:hidden hidden border-t border-outline-variant/30 bg-surface"
      >
        <div className="px-6 py-4 space-y-3">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-on-surface-variant hover:text-primary text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer
      className="bg-surface-container-low border-t border-outline-variant/20"
      role="contentinfo"
    >
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-8 py-10 max-w-7xl mx-auto gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-base font-bold text-primary">
            CROW SYSTEMS
          </span>
          <p className="font-body text-sm text-on-surface-variant">
            © 2024 Crow Systems. Engineering Solutions for Growing Businesses.
          </p>
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          <a
            href="/privacy"
            className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Terms of Service
          </a>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          {Object.entries(SOCIAL).map(([key, url]) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors capitalize"
            >
              {key === "x" ? "Twitter/X" : key}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
