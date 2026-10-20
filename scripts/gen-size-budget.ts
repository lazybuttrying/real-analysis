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
 * - shared chunks (shell, view kit, problems data) get their own entries;
 * - the home entry keeps its fixed 1 kB budget; vendor limits are fixed
 *   (third-party code, stable);
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

// Candidate prefixes: every chapter id (verbatim entry chunk), every scene's
// chunk name from its loaders.ts, and the known shared chunks.
const candidates = [
  ...catalog.map((chapter) => chapter.id),
  ...catalog.flatMap((chapter) => sceneChunkNames(chapter.id)),
  'app',
  'tex',
  'sum',
  'clamp',
  'd3kit',
  'richslot',
  'richtext',
  'preload-helper',
  'exercises',
  'home',
  'glossary-page',
  'learning-paths',
  'map-page',
  'paths-page',
];
const chunkFiles = indexChunks(candidates);

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

// 1. Home entry: the fixed 1 kB budget (reported; CI must fail if it grows).
budgets.push({ name: 'home entry', path: 'dist/assets/home-*.js', limit: '1 kB' });

// 2. Shared chunks, loaded alongside chapter entries.
const sharedGroups: Array<[string, string[]]> = [
  ['shared shell chunks', ['app', 'tex', 'sum', 'clamp']],
  ['shared view kit', ['d3kit', 'richslot', 'richtext']],
  ['shared problems data (all chapters)', ['preload-helper']],
];
for (const [name, prefixes] of sharedGroups) {
  const files = prefixes.flatMap(resolveShared);
  if (files.length === 0) throw new Error(`gen-size-budget: shared group '${name}' matched no chunks at all`);
  const kb = brotliBytes(files) / 1024;
  budgets.push({
    name,
    path: prefixes.map((prefix) => `dist/assets/${prefix}-*.js`),
    limit: niceLimit(kb * HEADROOM),
  });
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
  const kb = brotliBytes(files) / 1024;
  budgets.push({
    name: 'home lazy chunks (glossary, paths, map)',
    path: prefixes.map((prefix) => `dist/assets/${prefix}-*.js`),
    limit: niceLimit(kb * HEADROOM),
  });
}

// 6. Vendors: fixed limits (third-party code, stable across builds).
budgets.push(
  { name: 'vendor: d3', path: 'dist/assets/vendor-d3-*.js', limit: '25 kB' },
  { name: 'vendor: katex', path: 'dist/assets/vendor-katex-*.js', limit: '95 kB' },
  { name: 'vendor: three (basel only)', path: 'dist/assets/vendor-three-*.js', limit: '170 kB' },
);

const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8')) as Record<string, unknown>;
const next = JSON.stringify(budgets, null, 2);
if (JSON.stringify(pkg['size-limit'], null, 2) !== next) {
  pkg['size-limit'] = budgets;
  writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`gen-size-budget: rewrote ${budgets.length} budgets in package.json`);
} else {
  console.log(`gen-size-budget: ${budgets.length} budgets already current`);
}
