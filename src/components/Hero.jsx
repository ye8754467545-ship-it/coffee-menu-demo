import { useLang } from '../i18n';
import { useMenu } from '../MenuContext';
import { HERO, SECTIONS } from '../data/menu';
import { useParallax } from '../motion';
import ProductVisual from './ProductVisual';
import Price from './Price';
import { Bean, Brush, Drops, Ice, PanelEdge } from './Decor';

export default function Hero() {
  const { l, t, lang } = useLang();
  const { openProduct } = useMenu();
  const wordRef = useParallax(-0.35);
  const decoRef = useParallax(0.9);
  const p = HERO;

  const toMenu = () => {
    const el = document.getElementById(SECTIONS[0].id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 112, behavior: 'smooth' });
  };

  return (
    <section className="hero" id="top" data-tilt-host>
      <div className="hero__panel" aria-hidden="true"><PanelEdge /></div>
      <Brush className="hero__brush" />
      <div className="hero__word" ref={wordRef} aria-hidden="true">
        <span>{lang === 'fa' ? 'آیس' : 'ICED'}</span>
        <span>{lang === 'fa' ? 'لته' : 'LATTE'}</span>
      </div>

      <div className="hero__deco" ref={decoRef} aria-hidden="true">
        <Ice className="hero__ice hero__ice--a" rotate={-18} size={54} />
        <Ice className="hero__ice hero__ice--b" rotate={26} size={38} />
        <Bean className="hero__bean hero__bean--a" rotate={-32} size={20} />
        <Bean className="hero__bean hero__bean--b" rotate={50} size={15} />
        <Bean className="hero__bean hero__bean--c" rotate={12} size={17} />
      </div>

      <button type="button" className="hero__glass" onClick={() => openProduct(p)} tabIndex={-1} aria-hidden="true">
        <ProductVisual product={p} size="hero" depth={0.12} tilt eager />
        <Drops className="hero__drops" />
      </button>

      <div className="hero__copy">
        <p className="demo-pill hero__demo">{t('demoLong')}</p>
        <p className="hero__eyebrow">{t('featured')}</p>
        <h1 className="hero__title">{l(p.name)}</h1>
        <p className="hero__desc">{lang === 'fa' ? p.description : p.ingredients.map(i => i.en).join(' · ')}</p>
        <div className="hero__row">
          <Price product={p} className="hero__price" />
          <button type="button" className="btn btn--ghost" onClick={() => openProduct(p)}>{t('details')}</button>
        </div>
        <button type="button" className="btn btn--solid hero__cta" onClick={toMenu}>
          {t('seeMenu')}
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 5v14m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
}
