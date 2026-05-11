import type { ComponentProps } from 'react';

export interface SectionWrapperProps extends ComponentProps<'section'> {
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
}

export function SectionWrapper({ title, subtitle, id, className = '', children }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {(title || subtitle) && (
          <header className="text-center mb-16 max-w-3xl mx-auto">
            {subtitle && (
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">
                {subtitle}
              </span>
            )}
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-6">
              {title}
            </h2>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}