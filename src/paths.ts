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

/** One learning path: /<lang>/paths/<id>/ */
export const pathDetailUrl = (base: string, lang: Lang, pathId: string): string =>
  `${base}${lang}/paths/${pathId}/`;

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
