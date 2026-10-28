import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRICE_UNIT } from './config';

const STRINGS = {
  fa: {
    menu: 'منو',
    sep: '، ',
    search: 'جست‌وجو',
    searchPlaceholder: 'نام نوشیدنی، غذا یا ماده اولیه…',
    noResults: 'چیزی پیدا نشد. نام دیگری را امتحان کنید.',
    close: 'بستن',
    from: 'از',
    ingredients: 'مواد تشکیل‌دهنده',
    inStock: 'موجود',
    outOfStock: 'ناموجود',
    illustrative: 'تصویر نمایشی است.',
    featured: 'نوشیدنی شاخص',
    seeMenu: 'مشاهده منو',
    details: 'جزئیات',
    items: n => `${n} آیتم`,
    beans: 'انتخاب دانه',
    qrTitle: 'منو روی میز شما',
    qrTest: 'QR آزمایشی — به آدرس محیط توسعه اشاره می‌کند، نه نسخه نهایی.',
    qrFinal: 'این کد به نسخه آنلاین منو اشاره می‌کند.',
    hours: 'ساعت کاری',
    address: 'نشانی',
    phone: 'تلفن',
    credits: 'منبع تصاویر',
    creditsNote: 'تصاویر از Wikimedia Commons با مجوز آزاد؛ پس‌زمینه برخی حذف و برش داده شده است.',
    dataNote: 'این یک وب‌سایت نمونه برای نمایش طراحی منوی دیجیتال است. نام کافه، قیمت‌ها و اطلاعات تماس نمایشی‌اند.',
    demo: 'نمونه کار',
    demoLong: 'نمونه کار — منوی نمایشی',
    themeDark: 'حالت شب',
    themeLight: 'حالت روز',
    noDescription: 'توضیحی برای این محصول ثبت نشده است.',
  },
  en: {
    menu: 'Menu',
    sep: ', ',
    search: 'Search',
    searchPlaceholder: 'Drink, dish or ingredient…',
    noResults: 'Nothing found. Try another name.',
    close: 'Close',
    from: 'from',
    ingredients: 'Ingredients',
    inStock: 'Available',
    outOfStock: 'Unavailable',
    illustrative: 'Illustrative photo.',
    featured: 'Signature drink',
    seeMenu: 'Browse the menu',
    details: 'Details',
    items: n => `${n} items`,
    beans: 'Bean choice',
    qrTitle: 'The menu at your table',
    qrTest: 'Test QR — points to the development URL, not the final menu.',
    qrFinal: 'This code opens the online menu.',
    hours: 'Hours',
    address: 'Address',
    phone: 'Phone',
    credits: 'Photo credits',
    creditsNote: 'Photos from Wikimedia Commons under free licences; some were cut out and cropped.',
    dataNote: 'This is a sample website showcasing a digital menu design. The café name, prices and contact details are placeholders.',
    demo: 'Demo',
    demoLong: 'Portfolio demo — sample menu',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    noDescription: 'No description for this item yet.',
  },
};

const VARIANT_EN = { 'روبوستا': 'Robusta', 'عربیکا': 'Arabica' };

const LangContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem('see-lang');
    if (saved === 'fa' || saved === 'en') return saved;
  } catch { /* storage unavailable */ }
  return 'fa';
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'fa' ? 'rtl' : 'ltr';
    try { localStorage.setItem('see-lang', lang); } catch { /* ignore */ }
  }, [lang]);

  const value = useMemo(() => {
    const nf = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US');
    return {
      lang,
      setLang,
      dir: lang === 'fa' ? 'rtl' : 'ltr',
      t: key => STRINGS[lang][key],
      // Picks the current language from a {fa, en} pair.
      l: pair => (pair ? pair[lang] ?? pair.fa : ''),
      num: n => nf.format(n),
      unit: PRICE_UNIT[lang],
      variant: name => (lang === 'en' ? VARIANT_EN[name] || name : name),
    };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
