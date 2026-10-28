import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { useMenu } from '../MenuContext';
import { imageFor, sectionOf } from '../data/menu';

export default function ProductSheet() {
  const { product, closeProduct } = useMenu();
  const { l, t, num, unit, variant, lang } = useLang();
  const [shown, setShown] = useState(null); // keeps content during the closing animation
  const [open, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const scrollRef = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    if (product) {
      setShown(product);
      requestAnimationFrame(() => setOpen(true));
      document.documentElement.classList.add('no-scroll');
    } else {
      setOpen(false);
      document.documentElement.classList.remove('no-scroll');
      const id = setTimeout(() => setShown(null), 380);
      return () => clearTimeout(id);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = e => e.key === 'Escape' && closeProduct();
    window.addEventListener('keydown', onKey);
    sheetRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [product, closeProduct]);

  // Swipe down on the sheet to dismiss.
  const onTouchStart = e => {
    if (scrollRef.current.scrollTop > 0) return;
    drag.current = { y: e.touches[0].clientY, dy: 0 };
  };
  const onTouchMove = e => {
    if (!drag.current) return;
    const dy = Math.max(0, e.touches[0].clientY - drag.current.y);
    drag.current.dy = dy;
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = () => {
    if (!drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    sheetRef.current.style.transform = '';
    if (dy > 90) closeProduct();
  };

  if (!shown) return null;
  const p = shown;
  const img = imageFor(p);
  const section = sectionOf(p);

  return (
    <div className={`sheet-root ${open ? 'is-open' : ''}`}>
      <div className="sheet-backdrop" onClick={closeProduct} />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <span className="sheet__grip" aria-hidden="true" />
        <button type="button" className="sheet__close icon-btn" onClick={closeProduct} aria-label={t('close')}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>

        {img && (
          <div className="sheet__visual">
            <span className="pv__contact" aria-hidden="true" />
            <img src={img.src} alt={l(p.name)} />
          </div>
        )}

        <div className="sheet__body" ref={scrollRef}>
          {section && <p className="sheet__cat">{lang === 'fa' ? section.fa : section.en}</p>}
          <h2 id="sheet-title" className="sheet__title">{l(p.name)}</h2>
          {lang === 'fa' && p.name.en !== p.name.fa && <p className="sheet__alt" lang="en" dir="ltr">{p.name.en}</p>}

          {lang === 'fa' && <p className="sheet__desc">{p.description || t('noDescription')}</p>}

          {p.ingredients.length > 0 && (
            <>
              <h3 className="sheet__h">{t('ingredients')}</h3>
              <ul className="chips">
                {p.ingredients.map(i => <li key={i.fa}>{l(i)}</li>)}
              </ul>
            </>
          )}

          <div className="sheet__prices">
            {p.variants && p.priceMax ? (
              <>
                <h3 className="sheet__h">{t('beans')}</h3>
                <div className="variants">
                  {[p.price, p.priceMax].map((price, i) => (
                    <div className="variant" key={i}>
                      <span className="variant__name">{variant(p.variants[i])}</span>
                      <span className="variant__price"><b>{num(price)}</b> {unit}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="sheet__price"><b>{num(p.price)}</b> {unit}</p>
            )}
            <span className={`stock ${p.inStock ? '' : 'stock--out'}`}>{p.inStock ? t('inStock') : t('outOfStock')}</span>
          </div>

          {img && <p className="sheet__note">{t('illustrative')}</p>}
        </div>
      </div>
    </div>
  );
}
