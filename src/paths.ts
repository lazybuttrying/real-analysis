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
 * 'limits' and 'calculus' are fully retired: every URL under them redirects
 * (scene URLs to the scene's new chapter via LEGACY_SCENE_CHAPTER, hubs and
 * exercises pages to the home page).
 *
 * 'series' is only partially retired: the id is reused by the new (smaller)
 * Series chapter, so its hub and exercises page stay put and only the scenes
 * that moved away redirect. A scene URL under /<lang>/series/<scene>/ stays
 * when LEGACY_SCENE_CHAPTER[scene] === 'series'.
 */
export const LEGACY_CHAPTER_IDS: readonly string[] = ['limits', 'series', 'calculus'];

/** Chapter ids with no pages at all anymore: hub and exercises URLs redirect home. */
export const FULLY_RETIRED_CHAPTER_IDS: readonly string[] = ['limits', 'calculus'];

/**
 * sceneId -> owning chapterId after the 10-chapter split. Redirects retired
 * scene URLs (/<lang>/{limits,series,calculus}/<scene>/) to their new homes.
 * Covers every scene in the catalog exactly once (asserted by tests).
 */
export const LEGACY_SCENE_CHAPTER: Readonly<Record<string, string>> = {
  // numbers
  'natural-numbers': 'numbers',
  'binomial': 'numbers',
  'integers-rationals': 'numbers',
  'sets': 'numbers',
  'supremum': 'numbers',
  'countable': 'numbers',
  'groups-fields': 'numbers',
  'vector-spaces': 'numbers',
  'dimension-rank': 'numbers',
  // sequences
  'epsilon-n': 'sequences',
  'sequence-spaces': 'sequences',
  'cauchy-schwarz': 'sequences',
  'holes': 'sequences',
  'construction': 'sequences',
  'bolzano-weierstrass': 'sequences',
  'monotone-cauchy': 'sequences',
  'limsup-liminf': 'sequences',
  'stolz-cesaro': 'sequences',
  // continuity
  'epsdelta': 'continuity',
  'continuity': 'continuity',
  'monotone-discontinuities': 'continuity',
  'uniform-continuity': 'continuity',
  'ivt': 'continuity',
  'evt': 'continuity',
  'uniform': 'continuity',
  // topology
  'opensets': 'topology',
  'closure': 'topology',
  'compact': 'topology',
  'metric-spaces': 'topology',
  'contraction': 'topology',
  'baire-category': 'topology',
  'baire-1': 'topology',
  'cantor': 'topology',
  'fat-cantor': 'topology',
  'cantor-function': 'topology',
  // approximation
  'arzela-ascoli': 'approximation',
  'weierstrass-approx': 'approximation',
  'stone-weierstrass': 'approximation',
  'muntz-szasz': 'approximation',
  // series
  'harmonic': 'series',
  'euler-mascheroni': 'series',
  'basel': 'series',
  'euler-product': 'series',
  'leibniz': 'series',
  'tests': 'series',
  'raabe-test': 'series',
  'kummer-test': 'series',
  'condensation': 'series',
  'telescoping': 'series',
  'geometric': 'series',
  'wallis': 'series',
  'stirling': 'series',
  'grandi': 'series',
  'dirichlet-test': 'series',
  'abel-test': 'series',
  // power-series
  'power-series': 'power-series',
  'hadamard-gap': 'power-series',
  'abel-theorem': 'power-series',
  'tauber': 'power-series',
  'eseries': 'power-series',
  'zeta4': 'power-series',
  'rearrangement': 'power-series',
  'absolute': 'power-series',
  'riemann-rearrangement': 'power-series',
  'cauchy-product': 'power-series',
  // function-series
  'm-test': 'function-series',
  'dini': 'function-series',
  'fourier': 'function-series',
  'fejer-theorem': 'function-series',
  'gibbs-phenomenon': 'function-series',
  // differentiation
  'diffcont': 'differentiation',
  'mvt': 'differentiation',
  'cauchy-mvt': 'differentiation',
  'lhopital': 'differentiation',
  'darboux': 'differentiation',
  'weierstrass-function': 'differentiation',
  'taylor': 'differentiation',
  'taylor-thm': 'differentiation',
  'convex': 'differentiation',
  'newton': 'differentiation',
  'banach': 'differentiation',
  // integration
  'gamma': 'integration',
  'beta-function': 'integration',
  'bohr-mollerup': 'integration',
  'improper': 'integration',
  'riemann': 'integration',
  'volterra-function': 'integration',
  'ftc': 'integration',
  'bounded-variation': 'integration',
  'jordan-decomposition': 'integration',
  'measure': 'integration',
  'lebesgue': 'integration',
  'absolute-continuity': 'integration',
};

/** The same page in another language: only the lang segment changes, chapter/scene/query are kept. */
export function withLang(base: string, parsed: ParsedPath, lang: Lang): string {
  if (parsed.chapterId === undefined) return homeUrl(base, lang);
  if (parsed.chapterId === 'glossary') return glossaryUrl(base, lang);
  if (parsed.chapterId === 'paths') return parsed.sceneId ? pathDetailUrl(base, lang, parsed.sceneId) : pathsUrl(base, lang);
  if (parsed.sceneId === undefined) return chapterUrl(base, lang, parsed.chapterId);
  return sceneUrl(base, lang, parsed.chapterId, parsed.sceneId);
}

export interface ParsedPath {
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
