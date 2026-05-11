/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CONTACT_ENDPOINT: string;
  readonly VITE_CONSULTATION_ENDPOINT: string;
  readonly VITE_AUDIO_UPLOAD_ENDPOINT: string;
  readonly VITE_LINKEDIN_URL: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_COMPANY_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}