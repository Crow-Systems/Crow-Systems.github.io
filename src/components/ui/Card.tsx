interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description: string
  features?: string[]
  cta?: string
  onCtaClick?: () => void
}

export function Card({
  className = '',
  icon,
  title,
  description,
  features,
  cta,
  onCtaClick,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {children
        ? children
        : <>
            {icon && (
              <div className="w-12 h-12 flex items-center justify-center bg-accent/10 text-accent mb-6 rounded-lg">
                {icon}
              </div>
            )}
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">{title}</h3>
            <p className="text-on-surface-variant mb-6 leading-relaxed">{description}</p>
            {features && features.length > 0 && (
              <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-accent-alt text-lg">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            {cta && onCtaClick && (
              <button
                onClick={onCtaClick}
                className="inline-flex items-center gap-2 text-accent font-bold hover:gap-4 transition-all"
              >
                {cta} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </>
      }
    </div>
  )
}