// Converts a WooCommerce Store API product dump into src/data/products.json.
// Usage: node scripts/build-data.mjs <path-to-store-api-products.json>
// Source: <shop>/wp-json/wc/store/v1/products?per_page=100
import { readFileSync, writeFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync(process.argv[2], 'utf8'));

// English names are translations of the Persian product names.
const EN = {
  8542: 'Raffaello Cake', 8540: 'Carrot & Walnut Cake', 8538: 'San Sebastián Cheesecake', 8452: 'Nutella Panuozzo',
  8450: 'Veggie Omelette Panuozzo', 8447: 'Classic', 8445: 'Fried Egg & Spinach Panuozzo', 8443: 'Hunter Sausage Panuozzo',
  8441: 'Bacon Panuozzo', 8436: 'Special Service', 8434: 'Simple Service', 8432: 'Ice Cream Topping', 8430: 'Kiwi Topping',
  8428: 'Pineapple Topping', 8426: 'Banana Topping', 8424: 'Strawberry Topping', 8422: 'Nutella Topping', 8419: 'Waffle',
  8417: 'Nutella Cake', 8415: 'Tiramisu', 8413: 'Double Chocolate Cake', 8411: 'Tres Leches Cake', 8407: 'Masala',
  8405: 'White Chocolate', 8403: 'Hot Chocolate', 8401: 'Black Tea', 8399: 'Turkish Coffee', 8397: 'AeroPress', 8395: 'Siphon',
  8391: 'Chemex', 8387: 'V60', 8315: 'Nescafé', 8311: 'Cortado', 8307: 'Mocha', 8301: 'Caramel Macchiato', 8297: 'Latte',
  8293: 'Americano', 8289: 'Espresso', 8284: 'Frappuccino', 8280: 'Affogato', 8274: 'Iced Mocha', 8264: 'Iced Hazelnut Macchiato',
  8260: 'Iced Latte', 8255: 'Iced Americano', 8251: 'Iced Caramel Macchiato', 8247: 'Strawberry Matcha', 8245: 'Iced Mango Matcha',
  8243: 'Iced Matcha', 8241: 'Matcha Latte', 8239: 'Matcha Mango Cream', 8237: 'Red Ice', 8235: 'Barbie', 8232: 'Capra',
  8229: 'Pastille', 8227: 'Sweety', 8225: 'Madagascar', 8223: 'Life', 8221: 'Casablanca', 8218: 'Iced Tea', 8171: 'Cookie',
  8169: 'Lotus', 8167: 'Tiramisu', 8165: 'B2', 8163: 'Snickers', 8159: 'Tango', 8156: 'Salsa', 8154: 'Peanut Cheese',
  8152: 'Dutch Nutella', 8149: 'Gouda Dip', 8146: 'Mushroom & Cream Dip', 8140: 'Parmesan Dip', 8135: 'Cowboy Stuffed Chicken',
  8133: 'Fillet Steak', 8131: 'Smoky Chicken', 8129: 'Altaccino', 8127: 'Margherita', 8107: 'Bacon', 8105: 'Pepperoni Cheese',
  8103: 'Garlic & Steak', 8099: 'Turkey Panuozzo', 8096: 'House Panuozzo', 8094: 'Chicken Panuozzo', 8092: 'Bacon Panuozzo',
  8076: 'Pomodoro', 8074: 'Shrimp Red Bell Pepper', 8071: 'Alfredo', 8069: 'Alla Norma', 8067: 'Classic Zinger', 8065: 'Bacon Burger',
  8062: 'Cheeseburger', 8059: 'Classic Burger', 8057: 'Bruschetta', 8055: 'Salute Salad', 8053: 'Rucola Beef Salad',
  8048: 'Caesar Salad', 3373: 'French Fries',
};

const ING_EN = {
  'نوتلا': 'Nutella', 'میوه فصل(شلیل-هلو-پرتقال)': 'seasonal fruit (nectarine, peach, orange)', 'مغز گردو': 'walnuts',
  'توت فرنگی': 'strawberry', 'توت‌فرنگی': 'strawberry', 'شکلات تکه ای': 'chocolate chunks', 'تخم مرغ': 'egg',
  'سبزیجات روز': 'fresh vegetables', 'پنیر خامه ای': 'cream cheese', 'گوجه': 'tomato', 'خیار': 'cucumber', 'ریحان': 'basil',
  'اسفناج': 'spinach', 'قارچ': 'mushroom', 'سوسیس شکاری': 'hunter sausage', 'بیکن گوشت': 'beef bacon', 'پیازچه': 'scallion',
  'دارچین': 'cinnamon', 'هل': 'cardamom', 'شیر': 'milk', 'شکلات سفید': 'white chocolate', 'شیر گرم': 'hot milk',
  'شکلات': 'chocolate', 'چای سیاه': 'black tea', 'قهوه تازه آسیاب‌شده': 'freshly ground coffee', 'قهوه فوری': 'instant coffee',
  'قهوه اسپرسو': 'espresso', 'کارامل': 'caramel', 'فوم شیر': 'milk foam', 'آب داغ': 'hot water', 'اسپرسو': 'espresso',
  'یخ': 'ice', 'کاکائو': 'cocoa', 'بستنی وانیلی': 'vanilla ice cream', 'فندق': 'hazelnut', 'آب سرد': 'cold water',
  'ماچا': 'matcha', 'انبه': 'mango', 'هندوانه': 'watermelon', 'پرتقال': 'orange', 'هلو': 'peach', 'نعنا': 'mint',
  'بهارنارنج': 'orange blossom', 'لیمو': 'lemon', 'پاستیل': 'gummy candy', 'موز': 'banana', 'آناناس': 'pineapple',
  'کرفس': 'celery', 'سیب': 'apple', 'بستنی': 'ice cream', 'بیسکویت کوکی': 'cookie biscuits', 'کره لوتوس': 'Lotus spread',
  'قهوه': 'coffee', 'مغزیجات': 'mixed nuts', 'اسنیکرز': 'Snickers', 'ام ان ام': "M&M's", 'کیت کت': 'KitKat',
  'کره بادام زمینی': 'peanut butter', 'پنیر گودا': 'gouda', 'فلفل سیاه': 'black pepper', 'کره': 'butter',
  'پنیر پارمسان': 'parmesan', 'نمک و فلفل سیاه': 'salt & black pepper', 'سینه مرغ گریل': 'grilled chicken breast',
  'دورچین سبزیجات': 'vegetable sides', 'سس کابوی': 'cowboy sauce', 'فیله گوساله طعم دار': 'seasoned veal fillet',
  'سس قارچ': 'mushroom sauce', 'پنیر موزارلا': 'mozzarella', 'سس اسموکی': 'smoky sauce', 'روکولا': 'rocket',
  'خامه طعم دار': 'flavoured cream', 'کا پاریس': 'capers', 'بیکن بوقلمون': 'turkey bacon', 'زیتون': 'olives',
  'سس پومودورو': 'pomodoro sauce', 'سس گوجه': 'tomato sauce', 'ریحان ایتالیایی': 'Italian basil', 'روغن زیتون': 'olive oil',
  'زیتون سیاه': 'black olives', 'پپرونی': 'pepperoni', 'فلفل هالوپینو': 'jalapeño', 'پیاز قرمز': 'red onion',
  'سس پستوریحان': 'basil pesto', 'رست بوقلمون': 'roast turkey', 'زیتون کبابی': 'grilled olives', 'پارمسان': 'parmesan',
  'فیله گوساله': 'veal fillet', 'گوجه خشک': 'sun-dried tomato', 'موزارلا': 'mozzarella', 'رست سینه مرغ': 'roast chicken breast',
  'سس پومو': 'pomodoro sauce', 'نخود فرنگی': 'peas', 'فتوچینی': 'fettuccine', 'میگو': 'shrimp', 'سی پیر': 'bell pepper',
  'سس خامه': 'cream sauce', 'سبزیجات': 'vegetables', 'سینه مرغ سوخاری': 'fried chicken breast', 'خیارشور': 'pickles',
  'سس تارتار': 'tartar sauce', 'سس تارتار8': 'tartar sauce', 'میکس گوساله': 'beef mix', 'بیکن': 'bacon', 'کاهو': 'lettuce',
  'نان سیر': 'garlic bread', 'سینه مرغ': 'chicken breast', 'سس بالزامیک': 'balsamic', 'چهار مغز': 'four nuts',
  'میوه فصل': 'seasonal fruit', 'نان کروتان': 'croutons', 'گوجه گیلاسی': 'cherry tomato', 'سیب‌زمینی': 'potato',
  'ادویه‌های مخصوص': 'house spices',
};

// The live site shows a description that belongs to a different product for these items, so only ingredients are kept.
const BROKEN_DESC = new Set([8105, 3373, 8156, 8159]);

// Demo menu: keep product names and copy free of any real cafe's name.
const FA_NAME = { 8096: 'پانوتزو مخصوص' };
EN[8096] = 'House Panuozzo';
const neutral = s => s
  .replace(/کافه رستوران سی/g, 'کافه')
  .replace(/پانوتزو سی/g, 'پانوتزو مخصوص')
  .replace(/کافه سی/g, 'کافه');

const clean = s => neutral(s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());

const products = raw.map(p => {
  const html = p.short_description || '';
  const desc = (html.match(/<p>([\s\S]*?)<\/p>/) || [])[1];
  // A few items list the same ingredient twice on the site.
  const ingredients = [...new Set([...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => clean(m[1]).replace(/\d+$/, '')))];
  const range = p.prices.price_range;
  const variants = (p.attributes || []).find(a => a.has_variations);
  return {
    id: p.id,
    category: p.categories[0]?.name,
    name: { fa: FA_NAME[p.id] || p.name, en: EN[p.id] || p.name },
    // Store API prices are in the shop currency (IRT) with no decimals.
    price: Number(range ? range.min_amount : p.prices.price),
    priceMax: range ? Number(range.max_amount) : null,
    variants: variants ? variants.terms.map(t => t.name) : null,
    description: BROKEN_DESC.has(p.id) || !desc ? null : clean(desc),
    ingredients: ingredients.map(fa => ({ fa, en: ING_EN[fa] || fa })),
    inStock: p.is_in_stock,
  };
});

writeFileSync(new URL('../src/data/products.json', import.meta.url), JSON.stringify(products, null, 1) + '\n');
console.log(`wrote ${products.length} products`);
