// Cafe-wide settings. Product data lives in src/data/.
// This build is a portfolio demo: the cafe name is generic and contact details are masked.

// Final public address of the online menu. Leave empty during development:
// the QR code then encodes the current URL and is labelled as a test code.
export const MENU_URL = '';

// Sample prices are stored in thousand Toman.
export const PRICE_UNIT = { fa: 'هزار تومان', en: 'K Toman' };

export const CAFE = {
  brand: { fa: 'نمونه', en: 'SAMPLE' },
  name: { fa: 'کافه نمونه', en: 'Sample Café' },
  address: {
    fa: 'شهر ****، خیابان ********، پلاک **',
    en: '******** St., No. **, ****',
  },
  hours: { fa: 'هر روز ۹ صبح تا ۱۱ شب', en: 'Daily, 9 AM – 11 PM' },
  phone: { fa: '۰۹۱۲ *** ****', en: '0912 *** ****' },
  instagram: '@********',
};
