import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import { useTheme } from '../theme';
import { CAFE } from '../config';
import Logo from './Logo';

export default function Header({ onSearch }) {
  const { lang, setLang, l, t } = useLang();
  const [theme, toggleTheme] = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = theme === 'dark';

  return (
    <header className={`hdr ${scrolled ? 'hdr--solid' : ''}`}>
      <a className="hdr__brand" href="#top" aria-label={l(CAFE.name)}>
        <Logo size={34} className="hdr__logo" />
        <span className="hdr__name">
          <strong>{l(CAFE.brand)}</strong>
          <small className="demo-pill">{t('demo')}</small>
        </span>
      </a>
      <div className="hdr__actions">
        <button type="button" className="icon-btn" onClick={onSearch} aria-label={t('search')}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={dark ? t('themeLight') : t('themeDark')} aria-pressed={dark}>
          {dark ? (
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          )}
        </button>
        <div className="lang" role="group" aria-label="Language">
          <button type="button" aria-pressed={lang === 'fa'} onClick={() => setLang('fa')}>فا</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">EN</button>
        </div>
      </div>
    </header>
  );
}
