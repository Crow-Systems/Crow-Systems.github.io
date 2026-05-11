import type { ComponentPropsWithoutRef } from 'react';

export interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  error?: string;
  required?: boolean;
}

let idCounter = 0;

export function TextArea({ label, error, required, className = '', id: propId, rows = 4, ...props }: TextAreaProps) {
  const inputId = propId || `textarea-${idCounter++}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
          {required && <span className="text-error" aria-hidden="true"> *</span>}
        </label>
      )}
      <textarea
        id={inputId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        rows={rows}
        className={`w-full bg-surface-container-lowest border ${
          error ? 'border-error' : 'border-outline-variant/50'
        } rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none ${className}`}
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
