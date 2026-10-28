import { useLang } from '../i18n';

// Compact price: "180" or "from 180" for items with bean variants.
export default function Price({ product, className = '' }) {
  const { num, unit, t } = useLang();
  return (
    <span className={`price ${className}`}>
      {product.priceMax && <span className="price__from">{t('from')}</span>}
      <span className="price__num">{num(product.price)}</span>
      <span className="price__unit">{unit}</span>
    </span>
  );
}
