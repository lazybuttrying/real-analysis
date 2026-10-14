import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Dependency-direction lint, enforcing the architecture rules from docs/ARCHITECTURE.md:
 *
 *  1. models/ imports nothing from d3, three, the view kits, or the shell
 *     (pure computation — it must stay movable to a Worker and testable in Node).
 *  2. meta.ts imports types plus its own ./problems/* sibling data modules only
 *     (pure data — no code, models, views, or shell). Every page's navigation
 *     and the build scripts read meta.ts; a runtime import of anything heavier
 *     would drag that code into every bundle.
 *  3. 'three' is imported only in src/view/threekit.ts (the single 3D boundary,
 *     so vendor-three loads only for 3D scenes).
 *  4. Chapter code reaches the shell only through its entry.ts (the wiring point),
 *     and never imports another chapter.
 *  5. Outside the chapters, only src/catalog.ts may import chapter code
 *     (it is the aggregation point for chapter meta).
 *
 * Exits non-zero and prints every violation it finds.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');

interface ImportRef {
  spec: string;
  typeOnly: boolean;
  dynamic: boolean;
}

function listTsFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listTsFiles(path);
    return entry.name.endsWith('.ts') ? [path] : [];
  });
}

/** True when an import clause brings in only types: `type X`, `{ type A, type B }`. */
function clauseIsTypeOnly(clause: string): boolean {
  const trimmed = clause.trim();
  if (/^type\b/.test(trimmed)) return true;
  const braces = /\{([\s\S]*)\}/.exec(trimmed);
  if (!braces) return false;
  const parts = (braces[1] ?? '').split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 0 && parts.every((part) => part.startsWith('type '));
}

/** Extracts static and dynamic import specifiers. Import statements may span several lines. */
function importsOf(source: string): ImportRef[] {
  const refs: ImportRef[] = [];
  for (const match of source.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    refs.push({ spec: match[1] ?? '', typeOnly: false, dynamic: true });
  }
  // Side-effect imports: import 'x'
  for (const match of source.matchAll(/\bimport\s*['"]([^'"]+)['"]/g)) {
    refs.push({ spec: match[1] ?? '', typeOnly: false, dynamic: false });
  }
  // import <clause> from 'x' — a clause never contains '=' (that would be a declaration, not an import).
  for (const match of source.matchAll(/\bimport\s+([^'";=]*?)\s+from\s*['"]([^'"]+)['"]/g)) {
    refs.push({ spec: match[2] ?? '', typeOnly: clauseIsTypeOnly(match[1] ?? ''), dynamic: false });
  }
  // export <clause> from 'x' (re-exports). Plain export declarations have no 'from' and are not imports.
  for (const match of source.matchAll(/\bexport\s+([^'";=]*?)\s+from\s*['"]([^'"]+)['"]/g)) {
    refs.push({ spec: match[2] ?? '', typeOnly: clauseIsTypeOnly(match[1] ?? ''), dynamic: false });
  }
  return refs;
}

/** Resolves a relative specifier to a src-relative path (posix separators, no extension juggling). */
function resolveRelative(fromFile: string, spec: string): string {
  const resolved = normalize(join(dirname(fromFile), spec));
  return resolved.slice(SRC.length + 1).split('\\').join('/');
}

const isD3 = (spec: string): boolean => spec === 'd3' || spec.startsWith('d3-') || spec.startsWith('d3/');
const isThree = (spec: string): boolean => spec === 'three' || spec.startsWith('three/');

interface Violation {
  file: string;
  rule: string;
  detail: string;
}

const violations: Violation[] = [];
const files = listTsFiles(SRC);

for (const file of files) {
  const rel = file.slice(SRC.length + 1).split('\\').join('/');
  const refs = importsOf(readFileSync(file, 'utf8'));
  const inModels = rel.split('/').includes('models');
  const inChapter = rel.startsWith('chapters/');
  const base = rel.split('/').pop() ?? '';

  for (const ref of refs) {
    const resolved = ref.spec.startsWith('.') ? resolveRelative(file, ref.spec) : undefined;
    const targetsViewOrShell = resolved !== undefined && (resolved.startsWith('view/') || resolved.startsWith('shell/'));

    if (inModels && (isD3(ref.spec) || isThree(ref.spec) || targetsViewOrShell)) {
      violations.push({ file: rel, rule: 'models stay pure', detail: `imports '${ref.spec}'` });
    }
    // meta.ts may import types and its own ./problems/* sibling data modules
    // (pure data). Anything else as a value would drag code into every bundle.
    const isProblemsDataImport = base === 'meta.ts' && ref.spec.startsWith('./problems/');
    if (base === 'meta.ts' && !ref.typeOnly && !isProblemsDataImport) {
      violations.push({ file: rel, rule: 'meta.ts imports types and problems-data only', detail: `imports '${ref.spec}' as a value` });
    }
    if (isThree(ref.spec) && rel !== 'view/threekit.ts') {
      violations.push({ file: rel, rule: 'three only in view/threekit.ts', detail: `imports '${ref.spec}'` });
    }
    if (inChapter && resolved !== undefined && resolved.startsWith('shell/') && base !== 'entry.ts') {
      violations.push({ file: rel, rule: 'chapters reach the shell only via entry.ts', detail: `imports '${ref.spec}'` });
    }
    if (inChapter && resolved !== undefined && resolved.startsWith('chapters/')) {
      const ownChapter = rel.split('/')[1];
      const targetChapter = resolved.split('/')[1];
      if (targetChapter !== ownChapter) {
        violations.push({ file: rel, rule: 'chapters do not import other chapters', detail: `imports '${ref.spec}'` });
      }
    }
    if (!inChapter && resolved !== undefined && resolved.startsWith('chapters/') && rel !== 'catalog.ts') {
      violations.push({ file: rel, rule: 'only catalog.ts aggregates chapters', detail: `imports '${ref.spec}'` });
    }
    if (ref.dynamic && base === 'meta.ts') {
      violations.push({ file: rel, rule: 'meta.ts imports types and problems-data only', detail: `dynamically imports '${ref.spec}'` });
    }
  }
}

if (violations.length > 0) {
  console.error(`check-deps: ${violations.length} violation(s) in src/ (${files.length} files scanned):`);
  for (const violation of violations) {
    console.error(`  ${violation.file} — ${violation.rule}: ${violation.detail}`);
  }
  process.exit(1);
}
console.log(`check-deps: OK (${files.length} files scanned, dependency directions hold)`);
