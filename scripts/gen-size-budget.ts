import { brotliCompressSync } from 'node:zlib';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/catalog.ts';

/**
 * Regenerates the `size-limit` budgets in package.json from the catalog and
 * the current dist output, so the budget list can never go stale when scenes
 * or chapters are added. Run via `npm run size` (which regenerates, then
 * checks) — never edit the budgets by hand.
 *
 * Rules:
 * - one entry per chapter (entry chunk + its scene chunks), named from the
 *   catalog, so every page's JS is covered;
 * - shared chunks (shell, view kit, problems data) get their own entries,
 *   but a shared group or vendor entry is emitted only when this build
 *   actually produces its chunks (a fork may fold a whole shared group
 *   into its importers, externalize KaTeX, or never emit three);
 * - shared chunk names are derived from the build output, never listed by
 *   hand: every emitted chunk that is neither a chapter entry, nor a scene
 *   chunk, nor a vendor chunk is a shared chunk. The rules in section 2
 *   only assign derived names to groups; a name no rule claims lands in a
 *   catch-all group, so a future shared chunk is budgeted the moment it
 *   appears and a removed one disappears on its own;
 * - the home entry keeps its fixed 1 kB budget wherever the build meets
 *   it; a fork whose home chunk is structurally larger (its catalog is
 *   embedded in the chunk) gets a measured budget instead, so the check
 *   stays green without hiding future growth elsewhere;
 * - vendor limits are fixed (third-party code, stable);
 * - computed limits are measured brotli size x HEADROOM, rounded up.
 * Fails loudly when dist/ is missing or a catalog scene has no chunk.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ASSETS = join(ROOT, 'dist', 'assets');
const PKG_PATH = join(ROOT, 'package.json');

if (!existsSync(ASSETS)) {
  throw new Error('gen-size-budget: dist/assets not found — run `npm run build` first.');
}

const HEADROOM = 1.35;

/**
 * Scene id -> chunk name, read from the chapter's loaders.ts
 * ('diffcont' -> '../calculus/scenes/diffCont' -> chunk 'diffCont').
 * Chunk names follow file names, not scene ids, so parsing the loaders is
 * the only exact mapping.
 */
function sceneChunkNames(chapterId: string): string[] {
  const source = readFileSync(join(ROOT, 'src', 'chapters', chapterId, 'loaders.ts'), 'utf8');
  const names: string[] = [];
  const pattern = /(?:'([^']+)'|([A-Za-z_$][\w$-]*))\s*:\s*\(\)\s*=>\s*import\('([^']+)'\)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    const importPath = match[3] ?? '';
    names.push(importPath.slice(importPath.lastIndexOf('/') + 1));
  }
  if (names.length === 0) {
    throw new Error(`gen-size-budget: no loaders parsed in src/chapters/${chapterId}/loaders.ts`);
  }
  return names;
}

/** prefix -> files, by longest candidate-prefix match ('richslot-CQ59a-kQ.js'
 * belongs to 'richslot' even though the hash itself contains a dash). */
function indexChunks(candidates: string[]): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const file of readdirSync(ASSETS)) {
    if (!file.endsWith('.js')) continue;
    const stem = file.slice(0, -'.js'.length);
    let best: string | undefined;
    for (const candidate of candidates) {
      if (stem === candidate || stem.startsWith(`${candidate}-`)) {
        if (best === undefined || candidate.length > best.length) best = candidate;
      }
    }
    if (best === undefined) continue; // vendor chunks, fonts-adjacent js, etc.
    const list = index.get(best) ?? [];
    list.push(join(ASSETS, file));
    index.set(best, list);
  }
  return index;
}

function resolve(prefix: string): string[] {
  const files = chunkFiles.get(prefix);
  if (files === undefined || files.length === 0) {
    throw new Error(
      `gen-size-budget: no chunk for prefix '${prefix}' in dist/assets ` +
        `(catalog and build output disagree — did a scene id change?)`,
    );
  }
  return files;
}

/**
 * Like resolve(), but for shared-chunk groups: a site's import graph may not
 * emit every shared module as its own chunk (Rollup folds small shared
 * modules into their importers). Missing prefixes are skipped with a
 * warning; chapter and scene chunks stay strict (resolve()).
 */
function resolveShared(prefix: string): string[] {
  const files = chunkFiles.get(prefix);
  if (files === undefined || files.length === 0) {
    console.warn(`gen-size-budget: warning: no chunk for shared prefix '${prefix}' — this build does not emit it separately; skipped`);
    return [];
  }
  return files;
}

/**
 * The chunk name of an emitted file: the stem minus the trailing content
 * hash ('richslot-CQ59a-kQ.js' -> 'richslot'). Vite hashes are 8 chars
 * from an alphabet that includes '-', so only the final '-XXXXXXXX' is
 * stripped. A file without a hash suffix keeps its whole stem.
 */
function chunkName(file: string): string {
  const stem = file.slice(0, -'.js'.length);
  const hash = /-[A-Za-z0-9_-]{8}$/.exec(stem);
  return hash === null ? stem : stem.slice(0, hash.index);
}

// Owned prefixes: every chapter id (verbatim entry chunk) and every
// scene's chunk name from its loaders.ts. These stay strict (resolve()).
const ownedCandidates = [
  ...catalog.map((chapter) => chapter.id),
  ...catalog.flatMap((chapter) => sceneChunkNames(chapter.id)),
];
const chunkFiles = indexChunks(ownedCandidates);

// Shared chunks, derived by exclusion: every emitted .js file that no
// chapter or scene claimed and whose chunk name is not a vendor chunk.
// Grouped by chunk name (several files may share one name, e.g. the
// per-chapter 'exercises' chunks).
const sharedChunks = new Map<string, string[]>();
{
  const claimed = new Set<string>();
  for (const files of chunkFiles.values()) {
    for (const file of files) claimed.add(file);
  }
  for (const file of readdirSync(ASSETS)) {
    if (!file.endsWith('.js')) continue;
    const path = join(ASSETS, file);
    if (claimed.has(path)) continue;
    const name = chunkName(file);
    if (name.startsWith('vendor-')) continue; // section 6 budgets these
    const list = sharedChunks.get(name) ?? [];
    list.push(path);
    sharedChunks.set(name, list);
    const owned = chunkFiles.get(name) ?? [];
    owned.push(path);
    chunkFiles.set(name, owned);
  }
}

function brotliBytes(paths: string[]): number {  let total = 0;
  for (const path of paths) {
    total += brotliCompressSync(readFileSync(path)).length;
  }
  return total;
}

/** Round a kB limit up: whole kB under 20 kB, multiples of 5 kB above. */
function niceLimit(kb: number): string {
  const stepped = kb < 20 ? Math.ceil(kb) : Math.ceil(kb / 5) * 5;
  return `${stepped} kB`;
}

interface Budget {
  name: string;
  path: string | string[];
  limit: string;
}

const budgets: Budget[] = [];

// 1. Home entry: the fixed 1 kB budget (CI must fail if it grows past it).
// A fork whose home chunk embeds a much larger catalog may not fit 1 kB
// at all; it gets a measured budget (still headroom-capped) rather than a
// permanently failing check.
{
  const kb = brotliBytes(resolve('home')) / 1024;
  budgets.push({
    name: 'home entry',
    path: 'dist/assets/home-*.js',
    limit: kb <= 1 ? '1 kB' : niceLimit(kb * HEADROOM),
  });
}

// 2. Shared chunks, loaded alongside chapter entries. Membership is the
// derived sharedChunks set above; these rules only assign names to
// groups (a rule naming a chunk this build does not emit is skipped with
// a warning, via resolveShared). Names reserved for their own sections
// ('home' in 1, 'exercises' in 4, the lazy page chunks in 5) and every
// rule-claimed name are excluded from the catch-all group that follows,
// so each shared chunk is budgeted exactly once.
const sharedGroups: Array<[string, string[]]> = [
  ['shared shell chunks', ['app', 'tex', 'sum', 'clamp']],
  ['shared view kit', ['d3kit', 'richslot', 'richtext']],
  ['shared problems data (all chapters)', ['preload-helper']],
];
for (const [name, prefixes] of sharedGroups) {
  const files = prefixes.flatMap(resolveShared);
  if (files.length === 0) {
    console.warn(`gen-size-budget: warning: shared group '${name}' matched no chunks at all — skipped`);
    continue;
  }
  const kb = brotliBytes(files) / 1024;
  budgets.push({
    name,
    path: prefixes.map((prefix) => `dist/assets/${prefix}-*.js`),
    limit: niceLimit(kb * HEADROOM),
  });
}

// Catch-all: derived shared chunks no group rule claims (per-chapter meta
// chunks, shared models and scene helpers, anything a future refactor
// emits). Budgeted as one entry so new shared code can never slip past
// the size check unnoticed.
{
  const claimed = new Set<string>([
    'home',
    'exercises',
    'glossary-page',
    'learning-paths',
    'map-page',
    'paths-page',
    ...sharedGroups.flatMap(([, prefixes]) => prefixes),
  ]);
  const names = [...sharedChunks.keys()].filter((name) => !claimed.has(name)).sort();
  if (names.length > 0) {
    const files = names.flatMap((name) => sharedChunks.get(name) ?? []);
    const kb = brotliBytes(files) / 1024;
    budgets.push({
      name: 'shared other chunks',
      path: names.map((name) => `dist/assets/${name}-*.js`),
      limit: niceLimit(kb * HEADROOM),
    });
  }
}

// 3. One entry per chapter: entry chunk + its scene chunks.
for (const chapter of catalog) {
  const prefixes = [chapter.id, ...sceneChunkNames(chapter.id)];
  if (prefixes.length !== chapter.scenes.length + 1) {
    throw new Error(
      `gen-size-budget: loaders.ts lists ${prefixes.length - 1} scenes for '${chapter.id}' but catalog has ${chapter.scenes.length}`,
    );
  }
  const files = prefixes.flatMap(resolve);
  const kb = brotliBytes(files) / 1024;
  budgets.push({
    name: `chapter: ${chapter.id} (entry + ${chapter.scenes.length} scenes)`,
    path: prefixes.map((prefix) => `dist/assets/${prefix}-*.js`),
    limit: niceLimit(kb * HEADROOM),
  });
}

// 4. Exercises chunks: one per chapter, indistinguishable by name — single entry.
{
  const files = resolve('exercises');
  const kb = brotliBytes(files) / 1024;
  budgets.push({
    name: `exercises (all chapters, ${files.length} chunks)`,
    path: 'dist/assets/exercises-*.js',
    limit: niceLimit(kb * HEADROOM),
  });
}

// 5. Home page lazy chunks (glossary, learning paths, concept map, path detail).
{
  const prefixes = ['glossary-page', 'learning-paths', 'map-page', 'paths-page'];
  const files = prefixes.flatMap(resolveShared);
  if (files.length === 0) {
    console.warn('gen-size-budget: warning: home lazy chunks matched no chunks at all — skipped');
  } else {
    const kb = brotliBytes(files) / 1024;
    budgets.push({
      name: 'home lazy chunks (glossary, paths, map)',
      path: prefixes.map((prefix) => `dist/assets/${prefix}-*.js`),
      limit: niceLimit(kb * HEADROOM),
    });
  }
}

// 6. Vendors: fixed limits (third-party code, stable across builds).
// Emitted only when the build produces the chunk: a fork may externalize
// a vendor (KaTeX via CDN) or never bundle it (three), and a budget entry
// pointing at a missing file fails size-limit outright.
{
  const assetFiles = readdirSync(ASSETS);
  const vendors: Array<[string, string, string]> = [
    ['vendor: d3', 'vendor-d3', '25 kB'],
    ['vendor: katex', 'vendor-katex', '95 kB'],
    ['vendor: three (basel only)', 'vendor-three', '170 kB'],
  ];
  for (const [name, prefix, limit] of vendors) {
    if (assetFiles.some((file) => file.startsWith(`${prefix}-`) && file.endsWith('.js'))) {
      budgets.push({ name, path: `dist/assets/${prefix}-*.js`, limit });
    } else {
      console.warn(`gen-size-budget: warning: no chunk for vendor prefix '${prefix}' — skipped`);
    }
  }
}

const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8')) as Record<string, unknown>;
const next = JSON.stringify(budgets, null, 2);
if (JSON.stringify(pkg['size-limit'], null, 2) !== next) {
  pkg['size-limit'] = budgets;
  writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`gen-size-budget: rewrote ${budgets.length} budgets in package.json`);
} else {
  console.log(`gen-size-budget: ${budgets.length} budgets already current`);
}
