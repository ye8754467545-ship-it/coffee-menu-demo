// Live price/stock overrides on top of the base menu in data/products.json.
//
// Two modes:
//  - server: MENU_API is set in config.js -> overrides come from the small Node
//    server in /server (Iranian host). Changes reach every customer at once.
//  - demo:   MENU_API is empty (GitHub Pages portfolio) -> overrides live in this
//    browser only. The panel and the menu update each other instantly when they
//    are open in two tabs of the same browser. Good for showing a client.
//
// An override looks like: { price?: number, priceMax?: number, inStock?: boolean }
import { MENU_API, DEMO_PASSWORD } from '../config';

export const MODE = MENU_API ? 'server' : 'demo';
const API = MENU_API.replace(/\/+$/, '');
const LS_KEY = 'see-overrides';
const CHANNEL = 'see-menu-live';

const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
};
const writeLocal = data => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* storage blocked */ }
  try { new BroadcastChannel(CHANNEL).postMessage(data); } catch { /* old browser */ }
};

async function call(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function loadOverrides() {
  if (MODE === 'demo') return readLocal();
  return call('/api/overrides');
}

// Calls cb(overrides) whenever they change elsewhere. Returns an unsubscribe fn.
export function subscribe(cb) {
  if (MODE === 'demo') {
    const onStorage = e => { if (e.key === LS_KEY) cb(readLocal()); };
    window.addEventListener('storage', onStorage);
    let bc;
    try { bc = new BroadcastChannel(CHANNEL); bc.onmessage = e => cb(e.data || {}); } catch { /* ignore */ }
    return () => { window.removeEventListener('storage', onStorage); bc?.close(); };
  }
  // server: push via Server-Sent Events, plus a slow poll as a safety net
  let es;
  try {
    es = new EventSource(API + '/api/stream');
    es.addEventListener('overrides', e => { try { cb(JSON.parse(e.data)); } catch { /* ignore */ } });
  } catch { /* no SSE */ }
  const id = setInterval(() => loadOverrides().then(cb).catch(() => {}), 60000);
  return () => { es?.close(); clearInterval(id); };
}

export async function login(password) {
  if (MODE === 'demo') {
    if (password.trim() !== DEMO_PASSWORD) { const e = new Error('bad password'); e.status = 401; throw e; }
    return 'demo';
  }
  const { token } = await call('/api/login', { method: 'POST', body: { password } });
  return token;
}

// patches: { [id]: override } -> returns the full, saved overrides
export async function saveOverrides(token, patches) {
  if (MODE === 'demo') {
    const next = { ...readLocal() };
    for (const [id, patch] of Object.entries(patches)) next[id] = { ...next[id], ...patch };
    writeLocal(next);
    return next;
  }
  return call('/api/overrides', { method: 'PATCH', token, body: patches });
}

export async function resetOverrides(token) {
  if (MODE === 'demo') { writeLocal({}); return {}; }
  return call('/api/overrides', { method: 'DELETE', token });
}

export const applyOverride = (product, o) => (o ? { ...product, ...o } : product);
