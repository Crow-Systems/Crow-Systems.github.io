// Environment variable configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://crowsys.chrislabs.net/api/v1';
export const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/contact';
export const CONSULTATION_ENDPOINT = import.meta.env.VITE_CONSULTATION_ENDPOINT ?? '/consultation';
export const AUDIO_UPLOAD_ENDPOINT = import.meta.env.VITE_AUDIO_UPLOAD_ENDPOINT ?? '/audio/upload';
export const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL ?? '';
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? 'solutions@crowsystems.tech';
export const COMPANY_REGION = import.meta.env.VITE_COMPANY_REGION ?? 'North America, European Union, & APAC';