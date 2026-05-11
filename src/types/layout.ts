import type { ComponentPropsWithoutRef } from 'react';

export interface MainLayoutProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}