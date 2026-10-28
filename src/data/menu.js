import products from './products.json';
import credits from './image-credits.json';
import { CATEGORIES, CATEGORY_IMAGE, HERO_PRODUCT, PRODUCT_IMAGE } from './categories';

const files = import.meta.glob('../assets/products/*.webp', { eager: true, import: 'default' });

// key -> { src, credit }
export const IMAGES = Object.fromEntries(
  Object.entries(files).map(([path, src]) => {
    const key = path.split('/').pop().replace('.webp', '');
    return [key, { key, src, credit: credits[key] }];
  }),
);

export const PRODUCTS = products;
export const byId = Object.fromEntries(products.map(p => [p.id, p]));

export function imageFor(product) {
  const key = PRODUCT_IMAGE[product.id] || CATEGORY_IMAGE[product.category];
  return IMAGES[key] || null;
}

export const SECTIONS = CATEGORIES
  .map((cat, i) => {
    const items = products.filter(p => p.category === cat.fa);
    const featured = cat.feature.map(id => byId[id]).filter(p => p && imageFor(p));
    const rest = items.filter(p => !featured.includes(p));
    return { ...cat, id: `cat-${i + 1}`, index: i + 1, items, featured, rest };
  })
  .filter(s => s.items.length > 0);

export const HERO = byId[HERO_PRODUCT];

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(p =>
    p.name.fa.includes(q) ||
    p.name.en.toLowerCase().includes(q) ||
    p.category.includes(q) ||
    p.ingredients.some(i => i.fa.includes(q) || i.en.toLowerCase().includes(q)),
  );
}

export const sectionOf = product => SECTIONS.find(s => s.fa === product.category);
