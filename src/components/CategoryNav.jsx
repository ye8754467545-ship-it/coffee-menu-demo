import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { SECTIONS } from '../data/menu';

// Sticky, horizontally scrolling category chips with scroll-spy.
export default function CategoryNav() {
  const { lang } = useLang();
  const [active, setActive] = useState(SECTIONS[0].id);
  const listRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-35% 0px -60% 0px' });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Keep the active chip in view without moving the page.
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector(`[data-id="${active}"]`);
    if (!chip) return;
    // Works for both RTL and LTR scroll origins.
    const delta = chip.getBoundingClientRect().left + chip.offsetWidth / 2 - (list.getBoundingClientRect().left + list.clientWidth / 2);
    list.scrollBy({ left: delta, behavior: 'smooth' });
  }, [active]);

  const go = id => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 112;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <nav className="cnav" aria-label={lang === 'fa' ? 'دسته‌بندی‌ها' : 'Categories'}>
      <ul ref={listRef}>
        {SECTIONS.map(s => (
          <li key={s.id}>
            <button type="button" data-id={s.id} aria-current={active === s.id ? 'true' : undefined} onClick={() => go(s.id)}>
              {lang === 'fa' ? s.fa : s.en}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
