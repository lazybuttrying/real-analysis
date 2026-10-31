import { DEFAULT_LANG, LANGS, type Lang } from './contracts.ts';

/**
 * URL rules. The base is passed in by the caller. (import.meta.env.BASE_URL in the browser, SITE_BASE in build scripts)
 * It is also imported from Node, so it does not depend on import.meta.env or the DOM.
 *
 * Every page path is language-prefixed: /<lang>/ is the home page,
 * /<lang>/<chapter id>/ a chapter hub, /<lang>/<chapter id>/<scene id>/ a scene.
 * Un-prefixed paths exist only as legacy entry points; the shell redirects them
 * to the preferred language.
 */

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && (LANGS as readonly string[]).includes(value);
}

export const homeUrl = (base: string, lang: Lang): string => `${base}${lang}/`;

export const chapterUrl = (base: string, lang: Lang, chapterId: string): string => `${base}${lang}/${chapterId}/`;

export const sceneUrl = (base: string, lang: Lang, chapterId: string, sceneId: string): string =>
  `${base}${lang}/${chapterId}/${sceneId}/`;

/** The glossary page: /<lang>/glossary/ */
export const glossaryUrl = (base: string, lang: Lang): string => `${base}${lang}/glossary/`;

/** The learning paths index: /<lang>/paths/ */
export const pathsUrl = (base: string, lang: Lang): string => `${base}${lang}/paths/`;

/** One chapter's exercises page: /<lang>/<chapter id>/exercises/ */
export const exercisesUrl = (base: string, lang: Lang, chapterId: string): string =>
  `${base}${lang}/${chapterId}/exercises/`;

/** One learning path: /<lang>/paths/<id>/ */
export const pathDetailUrl = (base: string, lang: Lang, pathId: string): string =>
  `${base}${lang}/paths/${pathId}/`;

/**
 * Chapters retired by the 10-chapter split (2026-10-18). Their scene files
 * (models/, scenes/, problems/) remain on disk as scene stores under
 * src/chapters/{limits,series,calculus}/; only the chapter-level wiring is
 * retired.
 *
 * Retired scene URLs serve the full scene content directly (HTTP 200, no
 * redirect) with <link rel="canonical"> pointing at the scene's new chapter
 * URL — Google's preferred consolidation signal on static hosting, where
 * true 301s are unavailable.
 *
 * 'limits' and 'calculus' are fully retired: their hubs and exercises pages
 * are gone (404), every scene URL serves content canonically elsewhere.
 *
 * 'series' is only partially retired: the id is reused by the new (smaller)
 * Series chapter, so its hub and exercises page stay put and only the scenes
 * that moved away get legacy canonical pages. A scene URL under
 * /<lang>/series/<scene>/ is canonical when the scene still belongs to the
 * series chapter (legacyChapterOf(scene, 'series') === 'series').
 */
export const LEGACY_CHAPTER_IDS: readonly string[] = ['limits', 'series', 'calculus'];

/** Chapter ids with no pages at all anymore: hub and exercises URLs are gone (404). */
export const FULLY_RETIRED_CHAPTER_IDS: readonly string[] = ['limits', 'calculus'];

const SERIES_MOVED_SCENES = new Set(['m-test', 'dini', 'gamma', 'beta-function', 'bohr-mollerup', 'improper']);

/**
 * Scenes added after the 10-chapter split (2026-10-19). They never had
 * pre-split URLs, so they get no legacy canonical page: the "legacy
 * chapter" is the scene's own chapter, making buildLegacyPages skip them.
 */
const POST_SPLIT_SCENES = new Set([
  'nth-root',
  'axiom-of-choice',
  'zorn-lemma',
  'cantor-theorem',
  'integral-test',
  'double-series',
  'inverse-function-theorem',
  'integration-by-parts',
  'change-of-variables',
  'sqrt2-irrational',
  'density-of-rationals',
  'standard-limits',
  'continuity-equivalences',
  'derivative-monotonicity',
  'dirichlet-function',
  'riemann-stieltjes',
  'lebesgue-convergence',
  'fubini-tonelli',
  'egorov',
  'borel-cantelli',
  'riemann-lebesgue',
  'parseval',
  'holder',
  'clopen',
  'topologist-sine',
  'peano-curve',
  'thomae',
  'discontinuous-derivative',
  'gabriel-horn',
  'vitali',
  // 2026-10-22: gap-fill scenes against the Essence of Undergraduate Real
  // Analysis TOC — post-split additions, no legacy canonical pages.
  'connected',
  'complex-numbers',
  'parallelogram-law',
  'arc-length',
  'convolution',
  // 2026-10-22: the last two gap-fill scenes (function spaces, double
  // sequences) — post-split additions, no legacy canonical pages.
  'double-sequences',
  'function-spaces',
  // 2026-10-20: the proofs chapter's 10 scenes — post-split additions, no
  // legacy canonical pages (they never had pre-split URLs).
  'logic-propositions',
  'quantifiers',
  'direct-proof',
  'contrapositive',
  'contradiction',
  'cases-existence',
  'disproof-iff',
  'strong-induction',
  'relations-equivalence',
  'function-proofs',
  // 2026-10-28: the norm scene — post-split addition, no legacy canonical
  // page (it never had a pre-split URL).
  'norm',
  // 2026-10-29: six foundation scenes (absolute value, Archimedean
  // property, squeeze theorem, inner product, bounded sequences,
  // subsequences) — post-split additions, no legacy canonical pages.
  'absolute-value',
  'archimedean',
  'squeeze',
  'inner-product',
  'bounded',
  'subsequence',
  // 2026-10-31: two algebra-bridge scenes (ordered fields,
  // additive functions and the Hamel basis) — post-split additions.
  'ordered-fields',
  'additive-functions',
]);

/**
 * The pre-split chapter a scene lived in, recovered from the split
 * assignment: limits scenes are those now in numbers/sequences/continuity/
 * topology/approximation; series scenes are those now in series/power-series
 * plus the series-owned scenes that moved to function-series (m-test, dini)
 * and integration (gamma, beta-function, bohr-mollerup, improper); the rest
 * were calculus scenes.
 *
 * Post-split scenes (see POST_SPLIT_SCENES) return their own chapter id, so
 * no legacy page is emitted for them.
 */
export function legacyChapterOf(sceneId: string, chapterId: string): string {
  if (POST_SPLIT_SCENES.has(sceneId)) return chapterId;
  if (['numbers', 'sequences', 'continuity', 'topology', 'approximation'].includes(chapterId)) return 'limits';
  if (chapterId === 'series' || chapterId === 'power-series' || SERIES_MOVED_SCENES.has(sceneId)) return 'series';
  return 'calculus';
}

/** The same page in another language: only the lang segment changes, chapter/scene/query are kept. */
export function withLang(base: string, parsed: ParsedPath, lang: Lang): string {
  if (parsed.chapterId === undefined) return homeUrl(base, lang);
  if (parsed.chapterId === 'glossary') return glossaryUrl(base, lang);
  if (parsed.chapterId === 'paths') return parsed.sceneId ? pathDetailUrl(base, lang, parsed.sceneId) : pathsUrl(base, lang);
  if (parsed.sceneId === undefined) return chapterUrl(base, lang, parsed.chapterId);
  return sceneUrl(base, lang, parsed.chapterId, parsed.sceneId);
}

interface ParsedPath {
  /** The language segment, or undefined when the path is an un-prefixed legacy path. */
  lang: Lang | undefined;
  chapterId: string | undefined;
  sceneId: string | undefined;
}

/** Extracts the language, chapter id, and scene id from location.pathname. */
export function parsePath(base: string, pathname: string): ParsedPath {
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  const segments = relative.split('/').filter(Boolean);
  const [first, second, third] = segments;
  if (isLang(first)) return { lang: first, chapterId: second, sceneId: third };
  return { lang: undefined, chapterId: first, sceneId: second };
}

/** The language to send an un-prefixed visitor to: their stored choice, else the default. */
export function fallbackLang(stored: string | null | undefined): Lang {
  return stored != null && isLang(stored) ? stored : DEFAULT_LANG;
}
