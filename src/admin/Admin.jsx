import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/menu';
import { CATEGORIES } from '../data/categories';
import { CAFE, PRICE_UNIT, DEMO_PASSWORD } from '../config';
import { MODE, applyOverride, loadOverrides, login, resetOverrides, saveOverrides, subscribe } from '../live/store';
import './admin.css';

const nf = new Intl.NumberFormat('fa-IR');
const toEn = s => String(s).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const parsePrice = s => { const n = parseInt(toEn(s).replace(/[^\d]/g, ''), 10); return Number.isFinite(n) ? n : null; };
const TOKEN_KEY = 'see-admin-token';

export default function Admin() {
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } });

  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    document.documentElement.removeAttribute('data-theme');
    document.title = 'پنل مدیریت منو';
  }, []);

  const onLogin = t => { setToken(t); try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ } };
  const onLogout = () => { setToken(null); try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

  return (
    <div className="adm">
      <header className="adm__hdr">
        <div>
          <p className="adm__brand">{CAFE.name.fa}</p>
          <h1 className="adm__title">پنل مدیریت منو</h1>
        </div>
        <a className="adm__view" href="#/" target="_blank" rel="noreferrer">مشاهده منو ↗</a>
      </header>
      <p className={`adm__mode adm__mode--${MODE}`}>
        {MODE === 'demo'
          ? 'حالت نمایشی: تغییرات فقط روی همین مرورگر ذخیره می‌شود. منو را در یک تب دیگر باز کنید تا تغییر را همان لحظه ببینید.'
          : 'متصل به سرور: هر تغییر همان لحظه برای همه‌ی مشتری‌ها نمایش داده می‌شود.'}
      </p>
      {token ? <Editor token={token} onLogout={onLogout} /> : <Login onLogin={onLogin} />}
    </div>
  );
}

function Login({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true); setErr('');
    try { onLogin(await login(toEn(pw))); }
    catch (x) { setErr(x.status === 401 ? 'رمز اشتباه است.' : x.status === 429 ? 'تلاش زیاد بود. چند دقیقه بعد دوباره امتحان کنید.' : 'اتصال به سرور برقرار نشد.'); }
    finally { setBusy(false); }
  };

  return (
    <form className="adm__login" onSubmit={submit}>
      <label htmlFor="pw">رمز ورود</label>
      <input id="pw" type="password" inputMode="numeric" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
      {err && <p className="adm__err" role="alert">{err}</p>}
      <button className="adm__btn adm__btn--solid" disabled={busy || !pw}>{busy ? '…' : 'ورود'}</button>
      {MODE === 'demo' && <p className="adm__hint">رمز نمونه: <b dir="ltr">{DEMO_PASSWORD}</b></p>}
    </form>
  );
}

function Editor({ token, onLogout }) {
  const [saved, setSaved] = useState({});      // overrides on the server / in storage
  const [draft, setDraft] = useState({});      // unsaved edits: { id: { price?, priceMax?, inStock? } }
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState('10');

  useEffect(() => {
    loadOverrides().then(o => setSaved(o || {})).catch(() => setToast('خطا در دریافت قیمت‌ها'));
    return subscribe(o => setSaved(o || {}));
  }, []);

  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2600); return () => clearTimeout(id); }, [toast]);

  const current = p => applyOverride(applyOverride(p, saved[p.id]), draft[p.id]);
  const edit = (id, patch) => setDraft(d => ({ ...d, [id]: { ...d[id], ...patch } }));

  const list = useMemo(() => {
    const term = toEn(q).trim().toLowerCase();
    return PRODUCTS.filter(p => (cat === 'all' || p.category === cat) &&
      (!term || p.name.fa.includes(term) || p.name.en.toLowerCase().includes(term)));
  }, [cat, q]);

  const dirtyIds = Object.keys(draft).filter(id => {
    const p = PRODUCTS.find(x => String(x.id) === id); if (!p) return false;
    const a = applyOverride(p, saved[id]), b = current(p);
    return a.price !== b.price || a.priceMax !== b.priceMax || a.inStock !== b.inStock;
  });

  const save = async () => {
    if (!dirtyIds.length) return;
    const patches = Object.fromEntries(dirtyIds.map(id => [id, draft[id]]));
    setBusy(true);
    try {
      setSaved(await saveOverrides(token, patches));
      setDraft({});
      setToast(`ذخیره شد ✓ ${nf.format(dirtyIds.length)} آیتم در منو به‌روز شد`);
    } catch (x) {
      if (x.status === 401) { setToast('نشست تمام شده؛ دوباره وارد شوید.'); onLogout(); }
      else setToast('ذخیره نشد. اتصال را بررسی کنید.');
    } finally { setBusy(false); }
  };

  // raise every visible price by pct %, rounded up to the nearest 5 thousand Toman
  const bulk = () => {
    const k = parseFloat(toEn(pct));
    if (!Number.isFinite(k) || k === 0) return;
    const round = n => Math.max(5, Math.ceil((n * (1 + k / 100)) / 5) * 5);
    setDraft(d => {
      const next = { ...d };
      for (const p of list) {
        const c = current(p);
        next[p.id] = { ...next[p.id], price: round(c.price), ...(c.priceMax ? { priceMax: round(c.priceMax) } : {}) };
      }
      return next;
    });
    setToast(`قیمت ${nf.format(list.length)} آیتم ${k > 0 ? 'افزایش' : 'کاهش'} یافت. برای اعمال، «ذخیره» را بزنید.`);
  };

  const reset = async () => {
    if (!window.confirm('همه‌ی قیمت‌ها و وضعیت‌ها به حالت اولیه‌ی منو برگردد؟')) return;
    setBusy(true);
    try { setSaved(await resetOverrides(token)); setDraft({}); setToast('به قیمت‌های اولیه برگشت.'); }
    catch { setToast('انجام نشد.'); }
    finally { setBusy(false); }
  };

  return (
    <>
      <div className="adm__tools">
        <input className="adm__search" type="search" placeholder="جست‌وجوی آیتم…" value={q} onChange={e => setQ(e.target.value)} />
        <div className="adm__chips" role="tablist">
          <button className={cat === 'all' ? 'is-on' : ''} onClick={() => setCat('all')}>همه</button>
          {CATEGORIES.map(c => (
            <button key={c.fa} className={cat === c.fa ? 'is-on' : ''} onClick={() => setCat(c.fa)}>{c.fa}</button>
          ))}
        </div>
        <div className="adm__bulk">
          <span>تغییر گروهی {cat === 'all' ? 'همه‌ی' : `«${cat}»`} قیمت‌ها:</span>
          <input inputMode="decimal" value={pct} onChange={e => setPct(e.target.value)} aria-label="درصد" />
          <span>٪</span>
          <button className="adm__btn" onClick={bulk}>اعمال</button>
        </div>
      </div>

      <ul className="adm__list">
        {list.map(p => {
          const c = current(p);
          const base = p;
          const changed = c.price !== base.price || c.priceMax !== base.priceMax;
          const dirty = dirtyIds.includes(String(p.id));
          return (
            <li key={p.id} className={`adm__item ${c.inStock === false ? 'is-out' : ''} ${dirty ? 'is-dirty' : ''}`}>
              <div className="adm__name">
                <b>{p.name.fa}</b>
                <span>{p.category}{changed && <> · قیمت اولیه {nf.format(base.price)}</>}</span>
              </div>
              <div className="adm__prices">
                <PriceInput label={p.priceMax ? p.variants?.[0] : null} value={c.price} onChange={v => edit(p.id, { price: v })} />
                {p.priceMax != null && <PriceInput label={p.variants?.[1]} value={c.priceMax} onChange={v => edit(p.id, { priceMax: v })} />}
              </div>
              <label className="adm__stock">
                <input type="checkbox" checked={c.inStock !== false} onChange={e => edit(p.id, { inStock: e.target.checked })} />
                <span className="adm__switch" aria-hidden="true" />
                <span>{c.inStock !== false ? 'موجود' : 'تمام شد'}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="adm__foot">
        <button className="adm__link" onClick={reset} disabled={busy}>بازگشت به قیمت‌های اولیه</button>
        <button className="adm__link" onClick={onLogout}>خروج</button>
      </div>

      <div className={`adm__bar ${dirtyIds.length ? 'is-on' : ''}`}>
        <button className="adm__btn adm__btn--ghost" onClick={() => setDraft({})} disabled={busy}>لغو</button>
        <button className="adm__btn adm__btn--solid" onClick={save} disabled={busy}>
          {busy ? 'در حال ذخیره…' : `ذخیره‌ی تغییرات (${nf.format(dirtyIds.length)})`}
        </button>
      </div>
      {toast && <div className="adm__toast" role="status">{toast}</div>}
    </>
  );
}

function PriceInput({ label, value, onChange }) {
  const [text, setText] = useState(nf.format(value));
  const [focus, setFocus] = useState(false);
  useEffect(() => { if (!focus) setText(nf.format(value)); }, [value, focus]);
  return (
    <label className="adm__price">
      {label && <small>{label}</small>}
      <input
        inputMode="numeric"
        value={text}
        onFocus={e => { setFocus(true); e.target.select(); }}
        onMouseUp={e => e.preventDefault()}   // keep the selection made on focus
        onBlur={() => { setFocus(false); setText(nf.format(value)); }}
        onChange={e => { setText(e.target.value); const n = parsePrice(e.target.value); if (n != null && n > 0 && n < 100000) onChange(n); }}
        onKeyDown={e => e.key === 'Enter' && e.target.blur()}
      />
      <span>{PRICE_UNIT.fa}</span>
    </label>
  );
}
