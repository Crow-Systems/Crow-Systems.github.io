import type { ButtonSize, CtaType } from '@/types'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CtaType
  size?: ButtonSize
  isLoading?: boolean
  icon?: React.ReactNode
}

const variantStyles: Record<CtaType, string> = {
  primary:
    'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]',
  secondary:
    'border border-accent text-accent hover:bg-accent/10 active:scale-[0.98]',
  tertiary:
    'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-accent hover:text-accent hover:bg-surface-container/50 active:scale-[0.98]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-bold
          transition-all duration-200 whitespace-nowrap
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-px'}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <span className="inline-flex">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'