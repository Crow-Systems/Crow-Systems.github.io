import { useTranslations } from '../i18n';

interface LanguageSwitcherProps {
  currentLang: string;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const { t } = useTranslations(currentLang as any);
  const otherLang = currentLang === 'en' ? 'es' : 'en';
  const label = otherLang === 'en' ? 'EN' : 'ES';
  const currentLabel = currentLang === 'en' ? 'EN' : 'ES';

  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);

    // Remove existing locale prefix if present
    if (segments[0] === 'en' || segments[0] === 'es') {
      segments.shift();
    }

    let newPath: string;
    if (otherLang === 'en') {
      newPath = '/' + segments.join('/');
    } else {
      newPath = '/' + otherLang + '/' + segments.join('/');
    }

    if (newPath === '' || newPath === '/') {
      newPath = '/';
    }

    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Language selector">
      <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider font-semibold">
        {currentLabel}
      </span>
      <button
        onClick={handleSwitch}
        className="text-xs font-bold text-primary hover:text-accent transition-colors duration-300 uppercase tracking-wider px-2 py-1 rounded-md hover:bg-primary/10"
        aria-label={`Switch to ${label}`}
      >
        {label}
      </button>
    </div>
  );
}