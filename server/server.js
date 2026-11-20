// Price server for the cafe menu. Zero dependencies, Node 18+.
//
//   ADMIN_PASSWORD=...  (required) panel password
//   PORT=3000           port to listen on
//   DATA_DIR=./data     where overrides.json is stored (mount a disk here)
//   ALLOWED_ORIGIN=*    the menu's address, e.g. https://cafe-x.ir
//
// GET    /api/overrides       public: current price/stock overrides
// GET    /api/stream          public: Server-Sent Events, pushes every change
// POST   /api/login           { password } -> { token }
// PATCH  /api/overrides       (token) { [productId]: { price?, priceMax?, inStock? } }
// DELETE /api/overrides       (token) back to the printed menu
// GET    /api/health          ok
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT) || 3000;
const PASSWORD = process.env.ADMIN_PASSWORD || '';
const DATA_DIR = path.resolve(process.env.DATA_DIR || './data');
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const FILE = path.join(DATA_DIR, 'overrides.json');
const TOKEN_DAYS = 30;

if (PASSWORD.length < 6) {
  console.error('Set ADMIN_PASSWORD (at least 6 characters).');
  process.exit(1);
}
// Tokens are signed with a key derived from the password: changing the
// password logs everyone out.
const KEY = crypto.createHash('sha256').update('menu-token:' + PASSWORD).digest();

fs.mkdirSync(DATA_DIR, { recursive: true });
let overrides = {};
try { overrides = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { /* first run */ }

function persist() {
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(overrides, null, 1));
  fs.renameSync(tmp, FILE);
}

// ---- auth --------------------------------------------------------------
const sign = data => crypto.createHmac('sha256', KEY).update(data).digest('base64url');
function makeToken() {
  const exp = Date.now() + TOKEN_DAYS * 864e5;
  const body = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${body}.${sign(body)}`;
}
function checkToken(req) {
  const m = /^Bearer (.+)\.(.+)$/.exec(req.headers.authorization || '');
  if (!m) return false;
  const [, body, sig] = m;
  const good = Buffer.from(sign(body));
  if (good.length !== Buffer.from(sig).length || !crypto.timingSafeEqual(good, Buffer.from(sig))) return false;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
function samePassword(given) {
  const a = crypto.createHash('sha256').update(String(given)).digest();
  const b = crypto.createHash('sha256').update(PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}
// 8 login attempts per 10 minutes per IP
const attempts = new Map();
function tooMany(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter(t => now - t < 10 * 60e3);
  list.push(now);
  attempts.set(ip, list);
  return list.length > 8;
}

// ---- validation ----------------------------------------------------------
function cleanPatch(p) {
  if (!p || typeof p !== 'object') return null;
  const out = {};
  for (const k of ['price', 'priceMax']) {
    if (p[k] === undefined) continue;
    if (p[k] === null && k === 'priceMax') { out[k] = null; continue; }
    if (!Number.isInteger(p[k]) || p[k] <= 0 || p[k] >= 100000) return null;
    out[k] = p[k];
  }
  if (p.inStock !== undefined) {
    if (typeof p.inStock !== 'boolean') return null;
    out.inStock = p.inStock;
  }
  return out;
}

// ---- live push -----------------------------------------------------------
const clients = new Set();
function broadcast() {
  const msg = `event: overrides\ndata: ${JSON.stringify(overrides)}\n\n`;
  for (const res of clients) res.write(msg);
}
setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 25e3).unref();

// ---- http ----------------------------------------------------------------
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 200e3) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('bad json')); } });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const url = new URL(req.url, 'http://x');
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  try {
    if (url.pathname === '/api/health') return send(res, 200, { ok: true });

    if (url.pathname === '/api/overrides' && req.method === 'GET') return send(res, 200, overrides);

    if (url.pathname === '/api/stream' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
      res.write(`event: overrides\ndata: ${JSON.stringify(overrides)}\n\n`);
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }

    if (url.pathname === '/api/login' && req.method === 'POST') {
      if (tooMany(ip)) return send(res, 429, { error: 'too many attempts' });
      const { password } = await readJson(req);
      if (!password || !samePassword(password)) return send(res, 401, { error: 'bad password' });
      return send(res, 200, { token: makeToken() });
    }

    if (url.pathname === '/api/overrides' && (req.method === 'PATCH' || req.method === 'DELETE')) {
      if (!checkToken(req)) return send(res, 401, { error: 'login required' });
      if (req.method === 'DELETE') {
        overrides = {};
      } else {
        const body = await readJson(req);
        const entries = Object.entries(body);
        if (!entries.length || entries.length > 500) return send(res, 400, { error: 'nothing to save' });
        const next = { ...overrides };
        for (const [id, patch] of entries) {
          if (!/^\d{1,9}$/.test(id)) return send(res, 400, { error: `bad id ${id}` });
          const clean = cleanPatch(patch);
          if (!clean) return send(res, 400, { error: `bad values for ${id}` });
          next[id] = { ...next[id], ...clean };
        }
        overrides = next;
      }
      persist();
      broadcast();
      return send(res, 200, overrides);
    }

    send(res, 404, { error: 'not found' });
  } catch (e) {
    send(res, 400, { error: e.message });
  }
});

server.listen(PORT, () => console.log(`menu price server on :${PORT}, data in ${FILE}`));
