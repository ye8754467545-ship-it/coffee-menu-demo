// Menu sections in display order. `fa` must match the category name in products.json.
// layout: how the section is composed (see components/Section.jsx)
//   zigzag    – plates/cups straddling a dark panel, like a printed poster
//   spotlight – one large hero product with the rest listed beside it
//   duo       – two floating products at different depths + list
//   plate     – one large plate offset to the side + list
//   list      – typographic price list only
// theme: background mood of the section
// feature: product ids (in order) that get a large image; the rest are listed.
export const CATEGORIES = [
  { fa: 'بار گرم', en: 'Espresso Bar', layout: 'zigzag', theme: 'warm',
    feature: [8297, 8289, 8307, 8311], kicker: { fa: 'قهوه‌های گرم', en: 'Hot coffee' } },
  { fa: 'قهوه دمی', en: 'Slow Bar', layout: 'spotlight', theme: 'navy',
    feature: [8391], kicker: { fa: 'دمی و دستی', en: 'Brewed by hand' } },
  { fa: 'آیس کافی', en: 'Iced Coffee', layout: 'spotlight', theme: 'ice',
    feature: [8284, 8280, 8255], kicker: { fa: 'سرد و خنک', en: 'Over ice' } },
  { fa: 'ماچا', en: 'Matcha', layout: 'duo', theme: 'matcha',
    feature: [8243, 8241], kicker: { fa: 'چای سبز ژاپنی', en: 'Japanese green tea' } },
  { fa: 'شیک', en: 'Shakes', layout: 'spotlight', theme: 'caramel',
    feature: [8171, 8163, 8159], kicker: { fa: 'غلیظ و جسور', en: 'Thick & bold' } },
  { fa: 'اسموتی', en: 'Smoothies', layout: 'duo', theme: 'berry',
    feature: [8237], kicker: { fa: 'میوه‌ای', en: 'Fruit-forward' } },
  { fa: 'چای سرد', en: 'Iced Tea', layout: 'duo', theme: 'paper',
    feature: [8218], kicker: { fa: 'سبک و خنک', en: 'Light & cold' } },
  { fa: 'نوشیدنی گرم', en: 'Hot Drinks', layout: 'duo', theme: 'warm',
    feature: [8403, 8407], kicker: { fa: 'بدون قهوه', en: 'Coffee-free' } },
  { fa: 'دمنوش', en: 'Tea', layout: 'duo', theme: 'paper',
    feature: [8401], kicker: { fa: 'دم‌کرده', en: 'Steeped' } },
  { fa: 'کیک و کوکی', en: 'Cakes', layout: 'zigzag', theme: 'warm',
    feature: [8415, 8538, 8413, 8540], kicker: { fa: 'دسرهای کافه', en: 'From the counter' } },
  { fa: 'وافل و تاپینگ', en: 'Waffle & Toppings', layout: 'plate', theme: 'paper',
    feature: [8419], kicker: { fa: 'وافل را کامل کنید', en: 'Build your waffle' } },
  { fa: 'صبحانه', en: 'Breakfast', layout: 'plate', theme: 'paper',
    feature: [8441], kicker: { fa: 'پانوتزوهای صبح', en: 'Morning panuozzo' } },
  { fa: 'پیش غذا', en: 'Starters & Salads', layout: 'plate', theme: 'paper',
    feature: [8048, 8057], kicker: { fa: 'برای شروع', en: 'To begin' } },
  { fa: 'دیپ', en: 'Dips', layout: 'list', theme: 'paper',
    feature: [], kicker: { fa: 'کنار غذا', en: 'On the side' } },
  { fa: 'ساندویج', en: 'Panuozzo', layout: 'plate', theme: 'paper',
    feature: [8096], kicker: { fa: 'ساندویچ‌های گرم', en: 'Warm sandwiches' } },
  { fa: 'برگر', en: 'Burgers', layout: 'plate', theme: 'paper',
    feature: [8062], kicker: { fa: 'گوشت تازه', en: 'Fresh beef' } },
  { fa: 'پیتزا', en: 'Pizza', layout: 'plate', theme: 'paper',
    feature: [8127], kicker: { fa: 'ایتالیایی', en: 'Italian classics' } },
  { fa: 'پاستا', en: 'Pasta', layout: 'plate', theme: 'paper',
    feature: [8071], kicker: { fa: 'سس‌های خامه‌ای و قرمز', en: 'Cream & tomato' } },
  { fa: 'استیک', en: 'Steak', layout: 'plate', theme: 'paper',
    feature: [8133], kicker: { fa: 'گریل', en: 'From the grill' } },
  { fa: 'سرویس قلیان', en: 'Hookah', layout: 'list', theme: 'paper',
    feature: [], kicker: { fa: 'سرویس', en: 'Service' } },
];

// The hero scene at the top of the page.
export const HERO_PRODUCT = 8260; // آیس لته

// Illustrative photo for each product (key into src/assets/products/).
// Products not listed fall back to their category photo below.
export const PRODUCT_IMAGE = {
  8260: 'iced-latte', 8297: 'latte', 8289: 'espresso', 8307: 'mocha', 8311: 'cortado',
  8391: 'chemex', 8387: 'chemex', 8395: 'chemex', 8397: 'chemex',
  8284: 'frappe', 8280: 'affogato', 8255: 'iced-coffee', 8274: 'frappe', 8264: 'iced-coffee', 8251: 'iced-coffee',
  8243: 'iced-matcha', 8241: 'matcha-latte', 8245: 'iced-matcha', 8247: 'iced-matcha', 8239: 'iced-matcha',
  8171: 'shake', 8163: 'shake-choc', 8159: 'shake-straw', 8165: 'shake-choc', 8152: 'shake-choc', 8156: 'shake-choc',
  8237: 'smoothie', 8218: 'iced-tea', 8403: 'hot-chocolate', 8405: 'hot-chocolate', 8407: 'masala', 8401: 'tea',
  8415: 'tiramisu', 8538: 'cheesecake', 8413: 'choco-cake', 8417: 'choco-cake', 8540: 'carrot-cake',
  8419: 'waffle', 8048: 'salad', 8053: 'salad', 8055: 'salad', 8057: 'bruschetta',
  8096: 'panuozzo', 8441: 'panuozzo', 8092: 'panuozzo', 8094: 'panuozzo', 8099: 'panuozzo', 8062: 'burger', 8127: 'pizza', 8071: 'pasta', 8076: 'pasta', 8069: 'pasta', 8074: 'pasta', 8133: 'steak', 8135: 'steak',
};

export const CATEGORY_IMAGE = {
  'بار گرم': 'latte', 'قهوه دمی': 'chemex', 'آیس کافی': 'iced-coffee', 'ماچا': 'matcha-latte', 'شیک': 'shake',
  'اسموتی': 'smoothie', 'چای سرد': 'iced-tea', 'نوشیدنی گرم': 'hot-chocolate', 'دمنوش': 'tea',
  'کیک و کوکی': 'tiramisu', 'وافل و تاپینگ': 'waffle', 'صبحانه': 'panuozzo', 'پیش غذا': 'salad',
  'ساندویج': 'panuozzo', 'برگر': 'burger', 'پیتزا': 'pizza', 'پاستا': 'pasta', 'استیک': 'steak',
};
