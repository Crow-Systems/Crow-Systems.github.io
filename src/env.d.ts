/// <reference types="astro/client" />

interface Umami {
  track(event: string, data?: Record<string, unknown>): void;
  identify(id: string, data?: Record<string, unknown>): void;
  identify(data: Record<string, unknown>): void;
}

interface Window {
  umami?: Umami;
}

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string;
  readonly PUBLIC_CONTACT_ENDPOINT: string;
  readonly PUBLIC_CONSULTATION_ENDPOINT: string;
  readonly PUBLIC_AUDIO_UPLOAD_ENDPOINT: string;
  readonly UMAMI_WEBSITE_ID?: string;
  readonly PUBLIC_UMAMI_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
