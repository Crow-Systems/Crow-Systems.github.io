/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string;
  readonly PUBLIC_CONTACT_ENDPOINT: string;
  readonly PUBLIC_CONSULTATION_ENDPOINT: string;
  readonly PUBLIC_AUDIO_UPLOAD_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
