import en from './locales/en.json';
import es from './locales/es.json';

export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const localeMap: Record<Locale, typeof en> = { en, es };

export function getLocaleFromUrl(): Locale {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
    return segments[0] as Locale;
  }
  return 'en';
}

export function getLocalizedPath(locale: Locale, path?: string): string {
  const currentPath = path || window.location.pathname;
  const segments = currentPath.split('/').filter(Boolean);

  // Remove existing locale prefix if present
  if (SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
    segments.shift();
  }

  if (locale === 'en') {
    return '/' + segments.join('/');
  }
  return '/' + locale + '/' + segments.join('/');
}

export function useTranslations(locale: Locale = 'en') {
  const translations = localeMap[locale] || localeMap.en;

  function t(key: string): string {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      if (result === undefined || result === null) return key;
      result = result[k];
    }
    return typeof result === 'string' ? result : key;
  }

  return { t };
}

export function getStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ lang: locale }));
}

export { en as enTranslations, es as esTranslations };