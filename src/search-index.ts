import { catalog } from './catalog.ts';
import { localize, stripInlineMath, type Lang } from './contracts.ts';
import { glossary } from './glossary.ts';

/**
 * Build-time search index. Pure data construction, run in Node by
 * scripts/prerender.ts (which emits one JSON file per language) and by tests.
 * The browser never imports this module: the shell fetches the emitted JSON
 * lazily and filters it with the tiny matcher in src/shell/search.ts, so the
 * catalog's full weight never enters a page bundle because of search.
 */

export interface SearchSceneRecord {
  chapterId: string;
  sceneId: string;
  title: string;
  /** Plain text (math delimiters stripped) for substring matching. */
  summary: string;
  /** "1. 극한과 연속" — shown as the result's context line. */
  chapterTitle: string;
}

export interface SearchTermRecord {
  id: string;
  term: string;
  /** Plain text (math delimiters stripped) for substring matching. */
  definition: string;
  /** Scene title, shown as the result's context line. */
  sceneTitle: string;
  chapterId: string;
  sceneId: string;
}

export interface SearchIndexData {
  scenes: readonly SearchSceneRecord[];
  terms: readonly SearchTermRecord[];
}

/** One JSON-serializable index per language, covering every scene and every glossary term. */
export function buildSearchIndex(lang: Lang): SearchIndexData {
  const scenes: SearchSceneRecord[] = [];
  const sceneTitleOf = new Map<string, string>();
  catalog.forEach((chapter, chapterIndex) => {
    const chapterTitle = `${chapterIndex + 1}. ${localize(chapter.title, lang)}`;
    for (const scene of [...chapter.scenes].sort((a, b) => a.order - b.order)) {
      const title = localize(scene.title, lang);
      sceneTitleOf.set(`${chapter.id}/${scene.id}`, title);
      scenes.push({
        chapterId: chapter.id,
        sceneId: scene.id,
        title,
        summary: stripInlineMath(localize(scene.summary, lang)),
        chapterTitle,
      });
    }
  });
  const terms: SearchTermRecord[] = glossary.map((entry) => ({
    id: entry.id,
    term: stripInlineMath(localize(entry.term, lang)),
    definition: stripInlineMath(localize(entry.definition, lang)),
    sceneTitle: sceneTitleOf.get(`${entry.chapterId}/${entry.sceneId}`) ?? entry.sceneId,
    chapterId: entry.chapterId,
    sceneId: entry.sceneId,
  }));
  return { scenes, terms };
}
