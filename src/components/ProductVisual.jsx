import { useParallax, useTilt } from '../motion';
import { imageFor } from '../data/menu';
import { useLang } from '../i18n';

// A cut-out product photo floating above the page: contact shadow on the surface,
// a soft cast shadow, and the photo itself with layered drop-shadows (see .pv in styles).
// The photo is object-fit: contain, so a tall glass fills only part of the box width.
// Size the ground shadow to the visible base instead of the whole box.
function fitShadow(e) {
  const img = e.currentTarget;
  const box = img.getBoundingClientRect();
  if (!box.width || !img.naturalHeight) return;
  const fill = Math.min(1, (img.naturalWidth / img.naturalHeight) * (box.height / box.width));
  img.parentElement.style.setProperty('--fill', fill.toFixed(3));
}

export default function ProductVisual({ product, size = 'md', depth = 0.35, tilt = false, eager = false, className = '', style }) {
  const { l } = useLang();
  const pRef = useParallax(depth);
  const tRef = useTilt(tilt ? 6 : 0);
  const img = imageFor(product);
  if (!img) return null;
  return (
    <div className={`pv pv--${size} ${className}`} ref={pRef} style={style}>
      <div className="pv__float" ref={tilt ? tRef : undefined}>
        <span className="pv__cast" aria-hidden="true" />
        <span className="pv__contact" aria-hidden="true" />
        <img
          className="pv__img"
          src={img.src}
          alt={l(product.name)}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          draggable="false"
          onLoad={fitShadow}
        />
      </div>
    </div>
  );
}
