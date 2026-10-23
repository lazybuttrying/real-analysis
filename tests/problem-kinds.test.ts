import { describe, expect, it } from 'vitest';
import { pages } from '../scripts/prerender.ts';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize, type ExerciseMeta, type ProblemKindFields } from '../src/contracts.ts';
import { exercises as ProofsExercises } from '../src/chapters/proofs/exercises.ts';
import { exercises as NumbersExercises } from '../src/chapters/numbers/exercises.ts';
import { exercises as SequencesExercises } from '../src/chapters/sequences/exercises.ts';
import { exercises as ContinuityExercises } from '../src/chapters/continuity/exercises.ts';
import { exercises as TopologyExercises } from '../src/chapters/topology/exercises.ts';
import { exercises as ApproximationExercises } from '../src/chapters/approximation/exercises.ts';
import { exercises as SeriesExercises } from '../src/chapters/series/exercises.ts';
import { exercises as PowerSeriesExercises } from '../src/chapters/power-series/exercises.ts';
import { exercises as FunctionSeriesExercises } from '../src/chapters/function-series/exercises.ts';
import { exercises as DifferentiationExercises } from '../src/chapters/differentiation/exercises.ts';
import { exercises as IntegrationExercises } from '../src/chapters/integration/exercises.ts';

/**
 * Problem-kind templates (docs/problem-types.md):
 * - every tagged item carries the fields its kind requires, bilingual and non-empty,
 * - each non-proof kind is used at least 3 times across the site's content,
 * - the prerendered static pages carry the kind-specific markers,
 * - pages whose items are all 'proof' keep the classic rendering (no kind badge).
 */

interface TaggedItem extends ProblemKindFields {
  id: string;
}

const chapterExercises: ReadonlyArray<{ id: string; exercises: readonly ExerciseMeta[] }> = [
  { id: 'proofs', exercises: ProofsExercises },
  { id: 'numbers', exercises: NumbersExercises },
  { id: 'sequences', exercises: SequencesExercises },
  { id: 'continuity', exercises: ContinuityExercises },
  { id: 'topology', exercises: TopologyExercises },
  { id: 'approximation', exercises: ApproximationExercises },
  { id: 'series', exercises: SeriesExercises },
  { id: 'power-series', exercises: PowerSeriesExercises },
  { id: 'function-series', exercises: FunctionSeriesExercises },
  { id: 'differentiation', exercises: DifferentiationExercises },
  { id: 'integration', exercises: IntegrationExercises },
];

const allExercises: readonly ExerciseMeta[] = chapterExercises.flatMap(({ exercises }) => exercises);

// The prerender shim corpus: every chapter except proofs.
const shimExercises: readonly ExerciseMeta[] = chapterExercises
  .filter(({ id }) => id !== 'proofs')
  .flatMap(({ exercises }) => exercises);

const sceneProblems: readonly TaggedItem[] = catalog.flatMap((chapter) =>
  (chapter.scenes ?? []).flatMap((scene) => (scene.problems ?? []) as readonly TaggedItem[]),
);

const allItems: readonly TaggedItem[] = [...sceneProblems, ...allExercises];
const prerenderItems: readonly TaggedItem[] = [...sceneProblems, ...shimExercises];

function expectBilingual(value: { ko: string; en: string } | undefined, loc: string): void {
  expect(value, loc).toBeDefined();
  for (const lang of LANGS) {
    expect(localize(value!, lang).trim().length, `${loc} (${lang})`).toBeGreaterThan(0);
  }
}

describe('problem kinds: data integrity', () => {
  it('covers exactly the catalog chapters, in order', () => {
    expect(chapterExercises.map(({ id }) => id)).toEqual(catalog.map((chapter) => chapter.id));
  });

  it('gives every tagged item the fields its kind requires', () => {
    for (const item of allItems) {
      const kind = item.kind ?? 'proof';
      if (kind === 'compute') {
        expectBilingual(item.answer, `${item.id}: compute answer`);
      } else if (kind === 'counterexample') {
        expectBilingual(item.verdict, `${item.id}: counterexample verdict`);
      } else if (kind === 'concept') {
        expect(item.choices, `${item.id}: concept choices`).toBeDefined();
        expect(item.choices!.length, `${item.id}: concept choices count`).toBeGreaterThanOrEqual(3);
        expect(item.choices!.length, `${item.id}: concept choices count`).toBeLessThanOrEqual(4);
        for (const choice of item.choices!) expectBilingual(choice, `${item.id}: concept choice`);
        expect(item.correctIndex, `${item.id}: concept correctIndex`).toBeDefined();
        expect(Number.isInteger(item.correctIndex), `${item.id}: concept correctIndex integer`).toBe(true);
        expect(item.correctIndex!, `${item.id}: concept correctIndex range`).toBeGreaterThanOrEqual(0);
        expect(item.correctIndex!, `${item.id}: concept correctIndex range`).toBeLessThan(item.choices!.length);
        expectBilingual(item.explanation, `${item.id}: concept explanation`);
      }
    }
  });

  it('uses each non-proof kind at least 3 times', () => {
    for (const kind of ['compute', 'counterexample', 'concept'] as const) {
      const count = allItems.filter((item) => item.kind === kind).length;
      expect(count, `kind '${kind}' total`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('problem kinds: prerendered pages', () => {
  const bodies = pages
    .filter((page) => page.segments('ko').length === 3)
    .map((page) => ({ segments: page.segments('ko'), body: page.body('ko') }));

  it('renders the kind-specific markers for every kind present in the prerender corpus', () => {
    const present = new Set(prerenderItems.map((item) => item.kind ?? 'proof'));
    const allBodies = bodies.map((entry) => entry.body).join('\n');
    if (present.has('compute')) {
      expect(allBodies).toContain('problem-answer');
      expect(allBodies).toContain('kind-badge kind-compute');
    }
    if (present.has('counterexample')) {
      expect(allBodies).toContain('problem-verdict');
      expect(allBodies).toContain('counterexample-construction');
      expect(allBodies).toContain('kind-badge kind-counterexample');
    }
    if (present.has('concept')) {
      expect(allBodies).toContain('concept-choices-static');
      expect(allBodies).toContain('concept-explanation');
      expect(allBodies).toContain('kind-badge kind-concept');
    }
  });

  it('keeps proof-only scene pages free of kind badges', () => {
    const taggedSceneIds = new Set(
      catalog.flatMap((chapter) =>
        chapter.scenes.filter((scene) => (scene.problems ?? []).some((problem) => (problem.kind ?? 'proof') !== 'proof')).map((scene) => scene.id),
      ),
    );
    let checked = 0;
    for (const entry of bodies) {
      const sceneId = entry.segments[2]!;
      if (entry.segments[2] === 'exercises') continue;
      if (taggedSceneIds.has(sceneId)) continue;
      expect(entry.body, `scene ${sceneId}`).not.toContain('kind-badge');
      checked += 1;
    }
    expect(checked).toBeGreaterThan(0);
  });
});
