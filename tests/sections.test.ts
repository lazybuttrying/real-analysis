import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { exercises as approximationExercises } from '../src/chapters/approximation/exercises.ts';
import { exercises as continuityExercises } from '../src/chapters/continuity/exercises.ts';
import { exercises as differentiationExercises } from '../src/chapters/differentiation/exercises.ts';
import { exercises as functionSeriesExercises } from '../src/chapters/function-series/exercises.ts';
import { exercises as integrationExercises } from '../src/chapters/integration/exercises.ts';
import { exercises as numbersExercises } from '../src/chapters/numbers/exercises.ts';
import { exercises as powerSeriesExercises } from '../src/chapters/power-series/exercises.ts';
import { exercises as proofsExercises } from '../src/chapters/proofs/exercises.ts';
import { exercises as sequencesExercises } from '../src/chapters/sequences/exercises.ts';
import { exercises as seriesExercises } from '../src/chapters/series/exercises.ts';
import { exercises as topologyExercises } from '../src/chapters/topology/exercises.ts';
import type { ExerciseMeta } from '../src/contracts.ts';
import { groupExercisesBySection, sceneGroups, sectionOfScene } from '../src/sections.ts';

const exercisesByChapterId = new Map<string, readonly ExerciseMeta[]>([
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

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe('chapter sections', () => {
  it('partition each chapter scenes exactly, in scene order', () => {
    for (const chapter of catalog) {
      if (!chapter.sections) continue;
      const orderedIds = [...chapter.scenes].sort((a, b) => a.order - b.order).map((s) => s.id);
      const grouped = chapter.sections.flatMap((section) => section.sceneIds);
      expect(grouped, chapter.id).toEqual(orderedIds);
    }
  });

  it('have unique kebab-case ids and non-empty titles in both languages', () => {
    for (const chapter of catalog) {
      const seen = new Set<string>();
      for (const section of chapter.sections ?? []) {
        expect(KEBAB.test(section.id), `${chapter.id}/${section.id}`).toBe(true);
        expect(seen.has(section.id), `${chapter.id}/${section.id}`).toBe(false);
        seen.add(section.id);
        expect(section.sceneIds.length, `${chapter.id}/${section.id}`).toBeGreaterThan(0);
        for (const lang of ['ko', 'en'] as const) {
          expect(section.title[lang].trim().length, `${chapter.id}/${section.id} ${lang}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('sceneGroups returns one flat group for a chapter without sections', () => {
    const chapter = catalog.find((c) => !c.sections);
    expect(chapter).toBeDefined();
    if (!chapter) return;
    const sorted = [...chapter.scenes].sort((a, b) => a.order - b.order);
    const groups = sceneGroups(chapter, sorted);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.section).toBeUndefined();
    expect(groups[0]?.scenes.map((s) => s.id)).toEqual(sorted.map((s) => s.id));
  });

  it('every exercise of a sectioned chapter maps to a section via its first topic', () => {
    for (const chapter of catalog) {
      const exercises = exercisesByChapterId.get(chapter.id) ?? [];
      if (!chapter.sections) {
        expect(groupExercisesBySection(chapter, exercises), chapter.id).toBeUndefined();
        continue;
      }
      for (const exercise of exercises) {
        expect(exercise.topics.length, `${chapter.id}/${exercise.id}`).toBeGreaterThan(0);
        const firstTopic = exercise.topics[0];
        expect(firstTopic && sectionOfScene(chapter, firstTopic), `${chapter.id}/${exercise.id}`).toBeDefined();
      }
      const groups = groupExercisesBySection(chapter, exercises);
      expect(groups?.flatMap((g) => g.exercises.map((e) => e.id)).sort(), chapter.id).toEqual(exercises.map((e) => e.id).sort());
      for (const group of groups ?? []) expect(group.section, chapter.id).toBeDefined();
    }
  });

  it('sceneGroups covers every scene of a sectioned chapter', () => {
    for (const chapter of catalog) {
      if (!chapter.sections) continue;
      const sorted = [...chapter.scenes].sort((a, b) => a.order - b.order);
      const groups = sceneGroups(chapter, sorted);
      expect(groups.map((g) => g.section?.id), chapter.id).toEqual(chapter.sections.map((s) => s.id));
      expect(groups.flatMap((g) => g.scenes.map((s) => s.id)), chapter.id).toEqual(sorted.map((s) => s.id));
    }
  });
});
