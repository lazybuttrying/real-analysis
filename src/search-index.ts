import { catalog } from './catalog.ts';
import { exercises as proofsExercises } from './chapters/proofs/exercises.ts';
import { exercises as numbersExercises } from './chapters/numbers/exercises.ts';
import { exercises as sequencesExercises } from './chapters/sequences/exercises.ts';
import { exercises as continuityExercises } from './chapters/continuity/exercises.ts';
import { exercises as topologyExercises } from './chapters/topology/exercises.ts';
import { exercises as approximationExercises } from './chapters/approximation/exercises.ts';
import { exercises as seriesExercises } from './chapters/series/exercises.ts';
import { exercises as powerSeriesExercises } from './chapters/power-series/exercises.ts';
import { exercises as functionSeriesExercises } from './chapters/function-series/exercises.ts';
import { exercises as differentiationExercises } from './chapters/differentiation/exercises.ts';
import { exercises as integrationExercises } from './chapters/integration/exercises.ts';
import { localize, stripInlineMath, type ExerciseMeta, type Lang } from './contracts.ts';
import { glossary } from './glossary.ts';

/**
 * Build-time search index. Pure data construction, run in Node by
 * scripts/prerender.ts (which emits one JSON file per language) and by tests.
 * The browser never imports this module: the shell fetches the emitted JSON
 * lazily and filters it with the tiny matcher in src/shell/search.ts, so the
 * catalog's full weight never enters a page bundle because of search.
 *
 * The exercise data modules are imported directly (an explicit exception in
 * scripts/check-deps.ts): this module is build/test-only and never enters a
 * client bundle, so no chapter code leaks into a page because of search.
 */

interface SearchSceneRecord {
  chapterId: string;
  sceneId: string;
  title: string;
  /** Plain text (math delimiters stripped) for substring matching. */
  summary: string;
  /** "1. 극한과 연속" — shown as the result's context line. */
  chapterTitle: string;
}

interface SearchTermRecord {
  id: string;
  term: string;
  /** Plain text (math delimiters stripped) for substring matching. */
  definition: string;
  /** Scene title, shown as the result's context line. */
  sceneTitle: string;
  chapterId: string;
  sceneId: string;
}

interface SearchExerciseRecord {
  chapterId: string;
  exerciseId: string;
  /** 1-based position in the chapter's exercise file (the number shown on the card). */
  number: number;
  /** Plain text (math delimiters stripped) for substring matching. */
  statement: string;
  /** "1. 극한과 연속" — shown as the result's context line. */
  chapterTitle: string;
}

export interface SearchIndexData {
  scenes: readonly SearchSceneRecord[];
  terms: readonly SearchTermRecord[];
  exercises: readonly SearchExerciseRecord[];
}

/** Chapter id -> that chapter's exercise data, in catalog order. */
const exercisesByChapter = new Map<string, readonly ExerciseMeta[]>([
  ['proofs', proofsExercises],
  ['numbers', numbersExercises],
  ['sequences', sequencesExercises],
  ['continuity', continuityExercises],
  ['topology', topologyExercises],
  ['approximation', approximationExercises],
  ['series', seriesExercises],
  ['power-series', powerSeriesExercises],
  ['function-series', functionSeriesExercises],
  ['differentiation', differentiationExercises],
  ['integration', integrationExercises],
]);

/** One JSON-serializable index per language, covering every scene, glossary term, and chapter exercise. */
export function buildSearchIndex(lang: Lang): SearchIndexData {
  const scenes: SearchSceneRecord[] = [];
  const sceneTitleOf = new Map<string, string>();
  const exercises: SearchExerciseRecord[] = [];
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
    const chapterExercises = exercisesByChapter.get(chapter.id) ?? [];
    chapterExercises.forEach((exercise, index) => {
      exercises.push({
        chapterId: chapter.id,
        exerciseId: exercise.id,
        number: index + 1,
        statement: stripInlineMath(localize(exercise.statement, lang)),
        chapterTitle,
      });
    });
  });
  const terms: SearchTermRecord[] = glossary.map((entry) => ({
    id: entry.id,
    term: stripInlineMath(localize(entry.term, lang)),
    definition: stripInlineMath(localize(entry.definition, lang)),
    sceneTitle: sceneTitleOf.get(`${entry.chapterId}/${entry.sceneId}`) ?? entry.sceneId,
    chapterId: entry.chapterId,
    sceneId: entry.sceneId,
  }));
  return { scenes, terms, exercises };
}
