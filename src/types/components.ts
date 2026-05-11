import type { ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
  required?: boolean;
}

export interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  error?: string;
  required?: boolean;
}

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  label?: string;
  error?: string;
  required?: boolean;
}

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  hover?: boolean;
}

export interface SectionWrapperProps extends ComponentPropsWithoutRef<'section'> {
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
}
