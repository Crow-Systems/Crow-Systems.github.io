interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  label?: string
  title?: string
  subtitle?: React.ReactNode
  className?: string
  dark?: boolean
}

export function SectionWrapper({
  id,
  label,
  title,
  subtitle,
  className = '',
  dark = false,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-24 px-8 ${
        dark ? 'bg-primary text-white' : 'bg-surface'
      } ${className}`}
      aria-label={title}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        {(label || title) && (
          <div className="mb-16">
            {label && (
              <span
                className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full ${
                  dark
                    ? 'bg-accent-alt/20 text-accent-alt'
                    : 'bg-accent/10 text-accent'
                }`}
              >
                {label}
              </span>
            )}
            {title && (
              <h2
                className={`text-4xl md:text-5xl font-heading font-bold leading-tight ${
                  dark ? 'text-white' : 'text-primary'
                }`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <div
                className={`mt-4 max-w-2xl text-lg ${
                  dark ? 'text-white/80' : 'text-on-surface-variant'
                }`}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}