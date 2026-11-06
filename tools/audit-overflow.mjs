// Overflow audit for the built lecture sites (template-owned).
//
// What it does: serves a site's dist/ with its own static server, opens
// every scene page in headless Chrome, and records any drawn svg shape
// whose rendered box extends past its svg box by more than 10px.
// foreignObject / KaTeX internals are excluded (layout boxes, not ink).
// Unit tests cannot catch this class of bug: jsdom has no layout engine,
// so every coordinate reads 0 there. A real browser measuring real
// getBoundingClientRect values is the only way.
//
// Passes (default: all three):
//   states  first language, desktop, default state + every control state
//           (radio options, select options, slider min/max, checkboxes)
//   en      second language (when the dist has one), desktop, default only
//   mobile  first language, 390px wide, default only
// The page list is derived from the dist tree, so new scenes are covered
// without editing this file.
//
// Usage:
//   node tools/audit-overflow.mjs --dist dist --out audit-overflow.json
// Options:
//   --dist <dir>        built site to audit (default: dist)
//   --out <file>        findings JSON (default: audit-overflow.json)
//   --limit <n>         only the first n pages per pass (smoke runs)
//   --passes <a,b>      subset of: states,en,mobile
//   --only <a,b>        only slugs containing one of these substrings
//   --baseline <file>   a previous findings JSON; exit 1 when a finding
//                       appears that is not in the baseline (CI gate:
//                       known debt is tolerated, new regressions fail)
//   --chrome <path>     chrome-headless-shell executable
//                       (default: $CHROME_PATH, else the puppeteer cache)
// Requires puppeteer-core: resolved from ./node_modules, or from the
// path in $PUPPETEER_CORE_PATH.
import { createServer } from 'node:http';
import { existsSync, globSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { homedir } from 'node:os';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const DIST = resolve(arg('dist', 'dist'));
const OUT = arg('out', 'audit-overflow.json');
const LIMIT = Number(arg('limit', '0')) || 0;
const PASSES = arg('passes', 'states,en,mobile').split(',').map((s) => s.trim()).filter(Boolean);
const ONLY = arg('only', '').split(',').map((s) => s.trim()).filter(Boolean);
const BASELINE = arg('baseline', '');

async function loadPuppeteer() {
  try {
    return (await import('puppeteer-core')).default;
  } catch {
    const p = process.env.PUPPETEER_CORE_PATH;
    if (p && existsSync(p)) {
      // Accepts the package directory or its entry file; load through
      // createRequire so the package's own module layout applies.
      const { createRequire } = await import('node:module');
      const req = createRequire(join(process.cwd(), 'package.json'));
      const mod = req(p);
      return mod.default ?? mod;
    }
    throw new Error(
      'puppeteer-core not found: install it in this site or set PUPPETEER_CORE_PATH to its package directory.',
    );
  }
}

function findChrome() {
  const given = arg('chrome', '') || process.env.CHROME_PATH || '';
  if (given) return given;
  const cache = join(homedir(), '.cache', 'puppeteer', 'chrome-headless-shell');
  const hits = globSync(join(cache, '*', 'chrome-headless-shell-linux64', 'chrome-headless-shell')).sort();
  if (hits.length) return hits[hits.length - 1];
  throw new Error('chrome-headless-shell not found: pass --chrome <path> or set CHROME_PATH.');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

// The built pages reference their assets under the site's base path
// (e.g. /lecture/real-analysis/assets/...), so the server must answer
// under that prefix or every script 404s and the audit measures an
// empty page — a silent false pass. Detect the prefix from the built
// index.html instead of assuming the dist root is the site root.
function detectBasePath() {
  // The dist root index.html is a language redirect page with no asset
  // references, so probe a language home page (and a chapter page as a
  // fallback) for the asset prefix.
  const candidates = [];
  try {
    for (const e of readdirSync(DIST, { withFileTypes: true })) {
      if (!e.isDirectory() || !/^[a-z]{2}$/.test(e.name)) continue;
      candidates.push(join(DIST, e.name, 'index.html'));
      for (const ch of readdirSync(join(DIST, e.name))) {
        candidates.push(join(DIST, e.name, ch, 'index.html'));
      }
    }
  } catch {
    // fall through to the root page
  }
  candidates.push(join(DIST, 'index.html'));
  for (const file of candidates) {
    try {
      const html = readFileSync(file, 'utf8');
      const m = html.match(/(?:src|href)="(\/[^"]*?)\/assets\//);
      if (m) return m[1];
    } catch {
      // try the next candidate
    }
  }
  return '';
}
const BASE_PATH = detectBasePath();

function serveDist() {
  const server = createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (BASE_PATH && urlPath.startsWith(`${BASE_PATH}/`)) {
        urlPath = urlPath.slice(BASE_PATH.length);
      }
      let file = join(DIST, urlPath);
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (!existsSync(file) || !file.startsWith(DIST)) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
    } catch {
      res.writeHead(500);
      res.end('error');
    }
  });
  return new Promise((done) => {
    server.listen(0, '127.0.0.1', () => done({ server, port: server.address().port }));
  });
}

function languages() {
  const found = readdirSync(DIST, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^[a-z]{2}$/.test(e.name))
    .map((e) => e.name);
  // The sites are ko-primary: the state-exercising pass runs on the
  // primary language, so ko sorts first when present.
  return found.sort((a, b) => (a === 'ko' ? -1 : b === 'ko' ? 1 : a.localeCompare(b)));
}

function slugs(lang) {
  const out = [];
  for (const ch of readdirSync(join(DIST, lang))) {
    let scenes;
    try {
      scenes = readdirSync(join(DIST, lang, ch));
    } catch {
      continue;
    }
    for (const sc of scenes) {
      if (sc.endsWith('.html')) continue;
      out.push(`${ch}/${sc}`);
    }
  }
  const filtered = ONLY.length ? out.filter((s) => ONLY.some((o) => s.includes(o))) : out;
  return filtered.sort();
}

const MEASURE = () => {
  const results = [];
  document.querySelectorAll('svg[role="img"]').forEach((svg, idx) => {
    const sr = svg.getBoundingClientRect();
    if (!sr.width) return;
    let worst = null;
    svg.querySelectorAll(':scope > g *').forEach((el) => {
      if (el.closest('defs') || el.closest('foreignObject')) return;
      const b = el.getBoundingClientRect();
      if (!b.width && !b.height) return;
      const m = Math.max(sr.left - b.left, sr.top - b.top, b.right - sr.right, b.bottom - sr.bottom);
      if (m > 10 && (!worst || m > worst.m)) {
        worst = { m: Math.round(m), tag: el.tagName, txt: (el.textContent ?? '').trim().slice(0, 24) };
      }
    });
    if (worst) results.push({ idx, ...worst });
  });
  return results;
};

// Enumerate control states inside the main scene host; returns descriptors.
const ENUM_STATES = () => {
  const svg = document.querySelector('svg[role="img"]');
  if (!svg) return [];
  let host = svg;
  while (host && !host.querySelector('label.option, select, input[type="range"], input[type="checkbox"]')) {
    host = host.parentElement;
  }
  if (!host) return [];
  const states = [];
  const groups = new Map();
  host.querySelectorAll('label.option input[type="radio"]').forEach((inp) => {
    const key = inp.name || inp.closest('fieldset, div')?.className || 'g';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(inp.closest('label').textContent.trim());
  });
  for (const [key, labels] of groups) {
    labels.forEach((label, i) => {
      if (i > 0) states.push({ kind: 'radio', key, label });
    });
  }
  host.querySelectorAll('select').forEach((sel, si) => {
    [...sel.options].forEach((opt, oi) => {
      if (oi > 0) states.push({ kind: 'select', si, label: opt.textContent.trim(), oi });
    });
  });
  host.querySelectorAll('input[type="range"]').forEach((r, ri) => {
    states.push({ kind: 'range', ri, label: 'max', v: Number(r.max) });
    states.push({ kind: 'range', ri, label: 'min', v: Number(r.min) });
  });
  host.querySelectorAll('input[type="checkbox"]').forEach((c, ci) => {
    states.push({ kind: 'check', ci, label: 'toggle' });
  });
  return states.slice(0, 18);
};

const APPLY_STATE = (s) => {
  const svg = document.querySelector('svg[role="img"]');
  let host = svg;
  while (host && !host.querySelector('label.option, select, input[type="range"], input[type="checkbox"]')) {
    host = host.parentElement;
  }
  if (!host) return false;
  if (s.kind === 'radio') {
    const groups = new Map();
    host.querySelectorAll('label.option input[type="radio"]').forEach((inp) => {
      const key = inp.name || inp.closest('fieldset, div')?.className || 'g';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(inp);
    });
    const inp = (groups.get(s.key) ?? []).find((i) => i.closest('label').textContent.trim() === s.label);
    if (!inp) return false;
    inp.click();
    return true;
  }
  if (s.kind === 'select') {
    const sel = host.querySelectorAll('select')[s.si];
    if (!sel) return false;
    sel.selectedIndex = s.oi;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }
  if (s.kind === 'range') {
    const r = host.querySelectorAll('input[type="range"]')[s.ri];
    if (!r) return false;
    r.value = String(s.v);
    r.dispatchEvent(new Event('input', { bubbles: true }));
    r.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  if (s.kind === 'check') {
    const c = host.querySelectorAll('input[type="checkbox"]')[s.ci];
    if (!c) return false;
    c.click();
    return true;
  }
  return false;
};

const findings = [];
let errors = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { server, port } = await serveDist();
const BASE = `http://127.0.0.1:${port}`;

async function loadPage(page, lang, slug) {
  await page.goto(`${BASE}${BASE_PATH}/${lang}/${slug}/`, { waitUntil: 'load', timeout: 45000 });
  // Wait for the scene to actually mount instead of sleeping a fixed
  // interval: on a cold server the chunk load takes longer than any
  // fixed sleep, and a page whose scene never mounted has nothing to
  // measure — it must surface as a LOAD-ERROR, not as a clean page
  // (the false pass a base-path serving bug once caused).
  await page.waitForFunction(() => document.querySelectorAll('svg[role="img"]').length > 0, {
    timeout: 8000,
  });
  await sleep(250);
}

async function passStates(browser, lang) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const list = LIMIT ? slugs(lang).slice(0, LIMIT) : slugs(lang);
  let n = 0;
  for (const slug of list) {
    n++;
    try {
      await loadPage(page, lang, slug);
      for (const w of await page.evaluate(MEASURE)) {
        findings.push({ pass: `${lang}-states`, slug, state: 'default', ...w });
      }
      const states = await page.evaluate(ENUM_STATES);
      for (const s of states) {
        const ok = await page.evaluate(APPLY_STATE, s);
        if (!ok) continue;
        await sleep(220);
        for (const w of await page.evaluate(MEASURE)) {
          findings.push({ pass: `${lang}-states`, slug, state: `${s.kind}:${s.label}`, ...w });
        }
      }
    } catch (e) {
      errors++;
      findings.push({ pass: `${lang}-states`, slug, state: 'LOAD-ERROR', m: -1, tag: '', txt: String(e).slice(0, 60) });
    }
    if (n % 25 === 0) console.log(`${lang}-states ${n}/${list.length} findings=${findings.length} errors=${errors}`);
  }
  await page.close();
}

async function passDefault(browser, lang, viewport, passName) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const list = LIMIT ? slugs(lang).slice(0, LIMIT) : slugs(lang);
  let n = 0;
  for (const slug of list) {
    n++;
    try {
      await loadPage(page, lang, slug);
      for (const w of await page.evaluate(MEASURE)) {
        findings.push({ pass: passName, slug, state: 'default', ...w });
      }
    } catch (e) {
      errors++;
      findings.push({ pass: passName, slug, state: 'LOAD-ERROR', m: -1, tag: '', txt: String(e).slice(0, 60) });
    }
    if (n % 50 === 0) console.log(`${passName} ${n}/${list.length} findings=${findings.length} errors=${errors}`);
  }
  await page.close();
}

const langs = languages();
if (!langs.length) {
  console.error(`no language directories found under ${DIST} — build the site first.`);
  process.exit(2);
}
const puppeteer = await loadPuppeteer();
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ['--no-sandbox'] });
try {
  if (PASSES.includes('states')) await passStates(browser, langs[0]);
  if (PASSES.includes('en') && langs[1]) {
    await passDefault(browser, langs[1], { width: 1280, height: 900 }, `${langs[1]}-desktop`);
  }
  if (PASSES.includes('mobile')) {
    await passDefault(browser, langs[0], { width: 390, height: 844 }, `${langs[0]}-mobile`);
  }
} finally {
  await browser.close();
  server.close();
}
writeFileSync(OUT, JSON.stringify(findings, null, 1));
console.log('TOTAL findings:', findings.length, 'errors:', errors);

if (BASELINE) {
  const key = (f) => `${f.pass}|${f.slug}|${f.state}|${f.idx}`;
  const known = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).map(key));
  const fresh = findings.filter((f) => !known.has(key(f)));
  console.log(`baseline: ${known.size} known, ${fresh.length} new`);
  for (const f of fresh) console.log('NEW', JSON.stringify(f));
  if (fresh.length) process.exit(1);
}
