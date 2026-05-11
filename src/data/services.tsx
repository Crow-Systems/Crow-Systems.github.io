import React from 'react';
import { Service } from '../types';

const ICON_MAP: Record<string, React.JSX.Element> = {
  hub: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
      <path d="M7.05 7.05 12 12l-4.95 4.95" /><path d="M16.95 16.95 12 12l4.95-4.95" /><path d="M16.95 7.05 12 12l4.95 4.95" /><path d="M7.05 16.95 12 12l-4.95-4.95" />
    </svg>
  ),
  dns: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  terminal: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="10" y1="19" x2="20" y2="19" />
    </svg>
  ),
  architecture: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  database: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  robot_2: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="3" /><path d="M8 8l0-4" /><path d="M16 8l0-4" /><path d="M12 16v3" />
    </svg>
  ),
  rocket_launch: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2-2-3.5-2-5.5" /><path d="m13.5 3-1 2 1 2" /><path d="m16.5 9-2 1 2 1" /><path d="m15 5-2 6-4 1" />
      <path d="M21.24 15a9 9 0 0 0-9.24-9 9 9 0 0 0-9.24 9" /><path d="M8.69 19c.26.66.77 1.19 1.31 1.54" /><path d="M13.31 19c-.55.35-1.05.88-1.31 1.54" />
    </svg>
  ),
  security: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="m12 12 4-2 4 2v4H8v-4l4-2z" />
    </svg>
  ),
  mic: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="8" /><path d="M8 6V4a4 4 0 0 1 8 0v2" /><rect x="4" y="10" width="16" height="11" rx="2" />
    </svg>
  ),
};

export function getServiceIcon(iconKey: string, className?: string): React.JSX.Element | null {
  const icon = ICON_MAP[iconKey];
  if (!icon) return null;
  if (className) {
    return React.cloneElement(icon, { className });
  }
  return icon;
}

export const SERVICES: Service[] = [
  {
    icon: 'hub',
    title: 'Systems Consulting',
    description: 'Audit and optimize your internal workflows to reduce operational friction and eliminate technical silos across departments.',
    cta: 'Learn More',
  },
  {
    icon: 'dns',
    title: 'IT Infrastructure',
    description: 'Build resilient, scalable network foundations that ensure 99.9% uptime and enterprise-grade security for your critical data.',
    cta: 'Learn More',
  },
  {
    icon: 'terminal',
    title: 'Software Solutions',
    description: 'Custom-engineered software tools designed to solve specific bottlenecks, allowing your team to focus on high-value output.',
    cta: 'Learn More',
  },
  {
    icon: 'architecture',
    title: 'Technical Strategy',
    description: 'Align your technology roadmap with long-term business growth to future-proof your organization against market shifts.',
    cta: 'Learn More',
  },
  {
    icon: 'database',
    title: 'Digital Transformation',
    description: 'Modernize legacy systems and integrate advanced data analytics to drive informed, evidence-based decision making.',
    cta: 'Learn More',
  },
  {
    icon: 'robot_2',
    title: 'Automation Consulting',
    description: 'Save time through automation of repetitive tasks, significantly increasing your operational velocity and reducing human error.',
    cta: 'Learn More',
  },
];

export const STEPS = [
  { number: '01', title: 'Triage', description: 'Our lead architects review your audio submission and brief within 4 business hours.' },
  { number: '02', title: 'Discovery', description: 'A 30-minute high-fidelity call to align on technical constraints and KPI targets.' },
  { number: '03', title: 'Proposal', description: 'A comprehensive roadmap with fixed-fee options delivered in 48 hours.' },
];

export const STATS = [
  { value: '240+', label: 'Global Projects Completed' },
  { value: '99%', label: 'Operational Uptime Post-Implementation' },
  { value: '15', label: 'Core Senior Engineers' },
  { value: '4hrs', label: 'Average Triage Response Time' },
];