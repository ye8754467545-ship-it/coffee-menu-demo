import { useLang } from '../i18n';
import { useMenu } from '../MenuContext';
import Price from './Price';

// Typographic list for the products that don't get a large image.
export default function PriceList({ items, tone = 'light', boxed = false, title }) {
  const { l, t } = useLang();
  const { openProduct } = useMenu();
  if (!items.length) return null;
  return (
    <div className={`plist plist--${tone} ${boxed ? 'plist--boxed' : ''}`} data-reveal>
      {title && <h3 className="plist__title">{title}</h3>}
      <ul>
        {items.map(p => (
          <li key={p.id}>
            <button type="button" className="plist__row" onClick={() => openProduct(p)}>
              <span className="plist__name">{l(p.name)}</span>
              <span className="plist__dots" aria-hidden="true" />
              <Price product={p} className="plist__price" />
              {p.ingredients.length > 0 && (
                <span className="plist__ing">{p.ingredients.map(i => l(i)).join(t('sep'))}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
