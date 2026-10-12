/**
 * URL 규칙. base는 호출하는 쪽이 넘긴다. (브라우저에서는 import.meta.env.BASE_URL, 빌드 스크립트에서는 SITE_BASE)
 * Node에서도 import 되므로 import.meta.env나 DOM에 의존하지 않는다.
 */

export const homeUrl = (base: string): string => base;

export const chapterUrl = (base: string, chapterId: string): string => `${base}${chapterId}/`;

export const sceneUrl = (base: string, chapterId: string, sceneId: string): string =>
  `${base}${chapterId}/${sceneId}/`;

export interface ParsedPath {
  chapterId: string | undefined;
  sceneId: string | undefined;
}

/** location.pathname 에서 챕터 id와 씬 id를 꺼낸다. */
export function parsePath(base: string, pathname: string): ParsedPath {
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  const [chapterId, sceneId] = relative.split('/').filter(Boolean);
  return { chapterId, sceneId };
}
