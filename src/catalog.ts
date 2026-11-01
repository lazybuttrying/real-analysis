import type { ChapterMeta, ProblemMeta } from './contracts.ts';
import { catalogLight } from './catalog-light.ts';
import { problemsByScene as proofsProblems } from './chapters/proofs/problems.ts';
import { problemsByScene as numbersProblems } from './chapters/numbers/problems.ts';
import { problemsByScene as sequencesProblems } from './chapters/sequences/problems.ts';
import { problemsByScene as continuityProblems } from './chapters/continuity/problems.ts';
import { problemsByScene as topologyProblems } from './chapters/topology/problems.ts';
import { problemsByScene as approximationProblems } from './chapters/approximation/problems.ts';
import { problemsByScene as seriesProblems } from './chapters/series/problems.ts';
import { problemsByScene as powerSeriesProblems } from './chapters/power-series/problems.ts';
import { problemsByScene as functionSeriesProblems } from './chapters/function-series/problems.ts';
import { problemsByScene as differentiationProblems } from './chapters/differentiation/problems.ts';
import { problemsByScene as integrationProblems } from './chapters/integration/problems.ts';

/**
 * The single source of truth that collects every chapter's meta. (Pure data — three, d3, and the DOM must not be pulled in)
 * To add a chapter, create src/chapters/<id>/, add its meta to
 * catalog-light.ts, and add its problems map here, both in the same
 * position: the two lists are paired by index.
 * The <id>/index.html entry point is generated automatically by scripts/gen-entries.ts.
 *
 * Chapter order here IS the chapter numbering. The shell derives "chapter 1, 2, ..."
 * from the array's index wherever a chapter title is displayed, so a number is
 * never stored in any meta file.
 *
 * This is the full view: the light chapter metas from catalog-light.ts,
 * each scene with its problems list reattached from the chapter's
 * problems.ts map. Node consumers (prerender, search index, tests, size
 * budget) import this view. Client code imports catalog-light.ts only,
 * so this module and the problems data never enter a page bundle; a
 * chapter's problems map reaches the browser solely through the
 * per-chapter dynamic import in its entry file.
 *
 * NOTE (10-chapter split, 2026-10-18): the chapters are LOGICAL groupings.
 * The scene files (models/, scenes/, problems/) live in the legacy scene
 * stores src/chapters/{limits,series,calculus}/; each chapter's meta.ts,
 * loaders.ts, entry.ts, and exercises.ts reference them via relative paths.
 * See docs/ARCHITECTURE.md ("Physical vs logical chapters").
 */
type ProblemsByScene = Readonly<Record<string, readonly ProblemMeta[]>>;

function attachProblems(chapter: ChapterMeta, byScene: ProblemsByScene): ChapterMeta {
  return {
    ...chapter,
    scenes: chapter.scenes.map((scene) => {
      const problems = byScene[scene.id];
      return problems === undefined ? scene : { ...scene, problems };
    }),
  };
}

const problemsMaps: readonly ProblemsByScene[] = [
  proofsProblems,
  numbersProblems,
  sequencesProblems,
  continuityProblems,
  topologyProblems,
  approximationProblems,
  seriesProblems,
  powerSeriesProblems,
  functionSeriesProblems,
  differentiationProblems,
  integrationProblems,
];

export const catalog: readonly ChapterMeta[] = catalogLight.map((chapter, index) =>
  attachProblems(chapter, problemsMaps[index] ?? {}),
);
