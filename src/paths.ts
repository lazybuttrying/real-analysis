/**
 * URL rules. The base is passed in by the caller. (import.meta.env.BASE_URL in the browser, SITE_BASE in build scripts)
 * It is also imported from Node, so it does not depend on import.meta.env or the DOM.
 */

export const homeUrl = (base: string): string => base;

export const chapterUrl = (base: string, chapterId: string): string => `${base}${chapterId}/`;

export const sceneUrl = (base: string, chapterId: string, sceneId: string): string =>
  `${base}${chapterId}/${sceneId}/`;

export interface ParsedPath {
  chapterId: string | undefined;
  sceneId: string | undefined;
}

/** Extracts the chapter id and scene id from location.pathname. */
export function parsePath(base: string, pathname: string): ParsedPath {
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  const [chapterId, sceneId] = relative.split('/').filter(Boolean);
  return { chapterId, sceneId };
}
