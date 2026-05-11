import type { AppConfig } from '@/types'

export const APP_CONFIG: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://crowsys.chrislabs.net/api/v1',
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '/contact',
  consultationEndpoint: import.meta.env.VITE_CONSULTATION_ENDPOINT || '/consultation',
  audioUploadEndpoint: import.meta.env.VITE_AUDIO_UPLOAD_ENDPOINT || '/audio/upload',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/crow-systems',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'solutions@crowsystems.tech',
  companyRegion: import.meta.env.VITE_COMPANY_REGION || 'International',
  siteName: 'Crow Systems',
}