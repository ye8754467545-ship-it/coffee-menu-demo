import { useLang } from '../i18n';
import { useMenu } from '../MenuContext';
import ProductVisual from './ProductVisual';
import PriceList from './PriceList';
import Price from './Price';
import { Bean, Brush, Drops, Dust, Ice, PanelEdge, WaveTop } from './Decor';

const DARK_THEMES = new Set(['navy', 'caramel']);

function SectionHead({ section, tone }) {
  const { l, num, lang, t } = useLang();
  return (
    <header className={`sh sh--${tone}`} data-reveal>
      <span className="sh__idx">{num(section.index).padStart(2, lang === 'fa' ? '۰' : '0')}</span>
      <p className="sh__kicker">{l(section.kicker)}</p>
      <h2 className="sh__title" id={`${section.id}-t`}>{lang === 'fa' ? section.fa : section.en}</h2>
      <p className="sh__meta">
        {lang === 'fa' && <span className="sh__en" lang="en" dir="ltr">{section.en}</span>}
        <span>{t('items')(num(section.items.length))}</span>
      </p>
    </header>
  );
}

// Name, short description and price next to a large product image.
function FeatureText({ product, size = 'md' }) {
  const { l, lang } = useLang();
  const { openProduct } = useMenu();
  const blurb = shortBlurb(product, lang);
  return (
    <button type="button" className={`ft ft--${size}`} onClick={() => openProduct(product)}>
      <span className="ft__name">{l(product.name)}</span>
      {blurb && <span className="ft__desc">{blurb}</span>}
      <Price product={product} className="ft__price" />
    </button>
  );
}

// The site's Persian descriptions are long, so cards show the first clause.
// There is no English description, so English shows the ingredients instead.
function shortBlurb(product, lang) {
  if (lang === 'en' || !product.description) return product.ingredients.map(i => i[lang]).join(lang === 'en' ? ', ' : '، ');
  const desc = product.description;
  const cut = desc.split(/[،.]/)[0];
  return cut.length < desc.length ? `${cut}…` : desc;
}

function Zigzag({ section }) {
  const { openProduct } = useMenu();
  return (
    <>
      <div className="zz">
        <div className="zz__panel" aria-hidden="true"><PanelEdge /></div>
        <Dust className="zz__dust zz__dust--a" seed={section.index} />
        <Dust className="zz__dust zz__dust--b" seed={section.index + 7} count={14} />
        <Bean className="zz__bean zz__bean--a" rotate={-28} />
        <Bean className="zz__bean zz__bean--b" rotate={42} size={14} />
        <Bean className="zz__bean zz__bean--c" rotate={8} size={16} />
        {section.featured.map((p, i) => (
          <article className="zz__item" key={p.id} style={{ '--i': i }} data-reveal>
            <button type="button" className="zz__visual" onClick={() => openProduct(p)} tabIndex={-1} aria-hidden="true">
              <ProductVisual product={p} size="lg" depth={0.25 + (i % 2) * 0.15} />
            </button>
            <div className="zz__text"><FeatureText product={p} /></div>
          </article>
        ))}
      </div>
      <PriceList items={section.rest} tone="light" boxed />
    </>
  );
}

function Spotlight({ section, dark }) {
  const { openProduct } = useMenu();
  const { l, lang } = useLang();
  const [hero, ...supporting] = section.featured;
  const cold = section.theme === 'ice';
  return (
    <div className="spot">
      <div className="spot__stage" data-tilt-host>
        <span className="spot__word" aria-hidden="true">{lang === 'fa' ? section.fa : section.en}</span>
        {cold && <><Ice className="spot__ice spot__ice--a" rotate={-14} /><Ice className="spot__ice spot__ice--b" rotate={22} size={34} /><Ice className="spot__ice spot__ice--c" rotate={4} size={26} /></>}
        {!cold && <Brush className="spot__brush" color={dark ? 'rgba(244,236,226,.12)' : 'var(--caramel)'} />}
        {supporting.map((p, i) => (
          <button type="button" key={p.id} className={`spot__side spot__side--${i}`} onClick={() => openProduct(p)} tabIndex={-1} aria-hidden="true">
            <ProductVisual product={p} size="sm" depth={0.55 + i * 0.2} />
            <span className="spot__tag">{l(p.name)}</span>
          </button>
        ))}
        <button type="button" className="spot__hero" onClick={() => openProduct(hero)} tabIndex={-1} aria-hidden="true">
          <ProductVisual product={hero} size="xl" depth={0.2} tilt />
          {cold && <Drops className="spot__drops" />}
        </button>
      </div>
      <div className="spot__copy" data-reveal><FeatureText product={hero} size="lg" /></div>
      <PriceList items={[...supporting, ...section.rest]} tone={dark ? 'dark' : 'light'} />
    </div>
  );
}

function Duo({ section }) {
  return (
    <>
      <div className={`duo duo--${section.featured.length}`}>
        {section.theme === 'matcha' && <Brush className="duo__brush" color="var(--matcha)" />}
        {section.theme === 'berry' && <Brush className="duo__brush" color="var(--berry)" />}
        {section.theme === 'warm' && <Dust className="duo__dust" seed={section.index} />}
        {section.featured.map((p, i) => (
          <article key={p.id} className={`duo__item duo__item--${i}`} data-reveal style={{ '--i': i }}>
            <DuoVisual product={p} i={i} />
            <FeatureText product={p} />
          </article>
        ))}
      </div>
      <PriceList items={section.rest} tone="light" />
    </>
  );
}

function DuoVisual({ product, i }) {
  const { openProduct } = useMenu();
  return (
    <button type="button" className="duo__visual" onClick={() => openProduct(product)} tabIndex={-1} aria-hidden="true">
      <ProductVisual product={product} size={i === 0 ? 'lg' : 'md'} depth={i === 0 ? 0.25 : 0.5} />
    </button>
  );
}

function Plate({ section }) {
  const { openProduct } = useMenu();
  const [main, second] = section.featured;
  const flip = section.index % 2 === 0;
  return (
    <>
      <div className={`plt ${flip ? 'plt--flip' : ''}`}>
        <Dust className="plt__dust" seed={section.index} count={16} />
        <button type="button" className="plt__visual" onClick={() => openProduct(main)} tabIndex={-1} aria-hidden="true">
          <ProductVisual product={main} size="plate" depth={0.3} />
        </button>
        <div className="plt__text" data-reveal><FeatureText product={main} size="lg" /></div>
        {second && (
          <div className="plt__second" data-reveal>
            <button type="button" className="plt__visual2" onClick={() => openProduct(second)} tabIndex={-1} aria-hidden="true">
              <ProductVisual product={second} size="sm" depth={0.6} />
            </button>
            <FeatureText product={second} />
          </div>
        )}
      </div>
      <PriceList items={section.rest} tone="light" boxed={section.fa === 'وافل و تاپینگ'} />
    </>
  );
}

export default function Section({ section: raw }) {
  // Without any product photo a visual layout has nothing to show; fall back to the list.
  const section = raw.featured.length ? raw : { ...raw, layout: 'list' };
  const dark = DARK_THEMES.has(section.theme);
  const tone = dark ? 'dark' : 'light';
  const coloured = section.theme !== 'paper' && section.theme !== 'warm' && section.theme !== 'matcha' && section.theme !== 'berry';
  return (
    <section id={section.id} className={`sec sec--${section.layout} theme-${section.theme}`} aria-labelledby={`${section.id}-t`}>
      {coloured && <WaveTop className="sec__wave" />}
      <div className="sec__inner">
        <SectionHead section={section} tone={tone} />
        {section.layout === 'zigzag' && <Zigzag section={section} />}
        {section.layout === 'spotlight' && <Spotlight section={section} dark={dark} />}
        {section.layout === 'duo' && <Duo section={section} />}
        {section.layout === 'plate' && <Plate section={section} />}
        {section.layout === 'list' && <PriceList items={section.items} tone="light" boxed />}
      </div>
    </section>
  );
}
