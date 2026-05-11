import type { ComponentPropsWithoutRef } from 'react';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
  required?: boolean;
}

let idCounter = 0;

export function Input({ label, error, required, className = '', id: propId, type = 'text', ...props }: InputProps) {
  const inputId = propId || `input-${idCounter++}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
          {required && <span className="text-error" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full bg-surface-container-lowest border ${
          error ? 'border-error' : 'border-outline-variant/50'
        } rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
