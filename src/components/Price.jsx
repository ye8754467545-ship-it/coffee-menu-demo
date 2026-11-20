import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { useLive } from '../live/LiveMenu';

// Compact price: "180" or "from 180" for items with bean variants.
// Uses the live price; briefly glows when the cafe changes it.
export default function Price({ product, className = '' }) {
  const { num, unit, t } = useLang();
  const p = useLive(product);
  const prev = useRef(p.price);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prev.current === p.price) return;
    prev.current = p.price;
    setFlash(true);
    const id = setTimeout(() => setFlash(false), 1600);
    return () => clearTimeout(id);
  }, [p.price]);

  if (p.inStock === false) {
    return <span className={`price price--out ${className}`}><span className="price__soldout">{t('soldOut')}</span></span>;
  }
  return (
    <span className={`price ${flash ? 'price--flash' : ''} ${className}`}>
      {p.priceMax && <span className="price__from">{t('from')}</span>}
      <span className="price__num" key={p.price}>{num(p.price)}</span>
      <span className="price__unit">{unit}</span>
    </span>
  );
}
