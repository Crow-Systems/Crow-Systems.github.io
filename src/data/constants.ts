export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Ideas', href: '#audio' },
  { label: 'Consulting', href: '#consulting' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const SOCIAL_LINKS = {
  linkedin: '',
  twitter: '',
  github: '',
};

export const COMPANY_INFO = {
  email: 'solutions@crowsystems.tech',
  region: 'North America, European Union, & APAC',
  businessHours: {
    weekdays: 'Mon — Fri: 08:00 - 18:00 EST',
    saturday: 'Sat: 10:00 - 14:00 EST (On-call only)',
  },
};

export const STATS = [
  { value: '240+', label: 'Global Projects Completed' },
  { value: '99%', label: 'Operational Uptime' },
  { value: '15', label: 'Senior Engineers' },
];

export const MAX_RECORDING_DURATION = 300; // 5 minutes in seconds
export const AUDIO_MIME_TYPES = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'];
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB