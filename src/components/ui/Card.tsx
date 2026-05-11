import type { ComponentPropsWithoutRef } from 'react';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm ${
        hover ? 'hover:border-primary/50 hover:shadow-md transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
