import { useCallback, useState } from 'react';
import { useLang } from './i18n';
import { SECTIONS } from './data/menu';
import { useRevealAll } from './motion';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import Section from './components/Section';
import ProductSheet from './components/ProductSheet';
import SearchOverlay from './components/SearchOverlay';
import Footer from './components/Footer';

export default function App() {
  const { lang } = useLang();
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useRevealAll([lang]);

  return (
    <>
      <Header onSearch={() => setSearchOpen(true)} />
      <main>
        <Hero />
        <CategoryNav />
        {SECTIONS.map(s => <Section key={s.id} section={s} />)}
      </main>
      <Footer />
      <ProductSheet />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
