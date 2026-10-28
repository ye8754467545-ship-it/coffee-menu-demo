import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLang } from '../i18n';
import { CAFE, MENU_URL } from '../config';
import { IMAGES } from '../data/menu';
import Logo from './Logo';

export default function Footer() {
  const { t, l } = useLang();
  const [qr, setQr] = useState('');
  const isTest = !MENU_URL;
  const url = MENU_URL || window.location.origin + window.location.pathname;

  useEffect(() => {
    QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#02314B', light: '#0000' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [url]);

  const credits = Object.values(IMAGES).filter(i => i.credit).sort((a, b) => a.key.localeCompare(b.key));

  return (
    <footer className="ftr">
      <div className="ftr__inner">
        <div className="ftr__brand">
          <Logo size={60} />
          <div>
            <p className="ftr__name">{l(CAFE.brand)}</p>
            <p className="ftr__sub">{l(CAFE.name)} · <span className="demo-pill demo-pill--dark">{t('demoLong')}</span></p>
          </div>
        </div>

        {/* Contact details are masked: this is a portfolio sample */}
        <dl className="ftr__info">
          <div><dt>{t('hours')}</dt><dd>{l(CAFE.hours)}</dd></div>
          <div><dt>{t('address')}</dt><dd>{l(CAFE.address)}</dd></div>
          <div><dt>{t('phone')}</dt><dd dir="ltr" className="ftr__masked">{l(CAFE.phone)}</dd></div>
          <div><dt>Instagram</dt><dd dir="ltr" className="ftr__masked">{CAFE.instagram}</dd></div>
        </dl>

        <div className={`qr ${isTest ? 'qr--test' : ''}`}>
          <div className="qr__code" dangerouslySetInnerHTML={{ __html: qr }} />
          <div>
            <p className="qr__title">{t('qrTitle')}</p>
            {isTest && <span className="qr__badge">TEST</span>}
            <p className="qr__note">{isTest ? t('qrTest') : t('qrFinal')}</p>
            <p className="qr__url" dir="ltr">{url}</p>
          </div>
        </div>

        <p className="ftr__data">{t('dataNote')}</p>

        <details className="credits">
          <summary>{t('credits')}</summary>
          <p>{t('creditsNote')}</p>
          <ul>
            {credits.map(({ key, credit }) => (
              <li key={key} dir="ltr">
                <a href={credit.source} target="_blank" rel="noreferrer">{credit.title}</a> — {credit.author || 'unknown'} · {credit.license}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  );
}
