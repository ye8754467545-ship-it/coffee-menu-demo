import { useEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { useMenu } from '../MenuContext';
import { imageFor, searchProducts, sectionOf } from '../data/menu';
import Price from './Price';

export default function SearchOverlay({ open, onClose }) {
  const { t, l, lang } = useLang();
  const { openProduct } = useMenu();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const results = useMemo(() => searchProducts(q), [q]);

  useEffect(() => {
    if (!open) return;
    setQ('');
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('no-scroll');
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('no-scroll');
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search" role="dialog" aria-modal="true" aria-label={t('search')}>
      <div className="search__bar">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('search')}
          enterKeyHint="search"
        />
        <button type="button" className="search__close" onClick={onClose}>{t('close')}</button>
      </div>

      <div className="search__results" aria-live="polite">
        {q.trim() && results.length === 0 && <p className="search__empty">{t('noResults')}</p>}
        <ul>
          {results.map(p => {
            const img = imageFor(p);
            const sec = sectionOf(p);
            return (
              <li key={p.id}>
                <button type="button" onClick={() => { onClose(); openProduct(p); }}>
                  <span className="search__thumb">{img && <img src={img.src} alt="" loading="lazy" />}</span>
                  <span className="search__text">
                    <span className="search__name">{l(p.name)}</span>
                    <span className="search__cat">{sec ? (lang === 'fa' ? sec.fa : sec.en) : ''}</span>
                  </span>
                  <Price product={p} className="search__price" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
