import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize } from '../src/contracts.ts';
import { exercises as proofsExercises } from '../src/chapters/proofs/exercises.ts';
import { exercises as numbersExercises } from '../src/chapters/numbers/exercises.ts';
import { exercises as sequencesExercises } from '../src/chapters/sequences/exercises.ts';
import { exercises as continuityExercises } from '../src/chapters/continuity/exercises.ts';
import { exercises as topologyExercises } from '../src/chapters/topology/exercises.ts';
import { exercises as approximationExercises } from '../src/chapters/approximation/exercises.ts';
import { exercises as seriesExercises } from '../src/chapters/series/exercises.ts';
import { exercises as powerSeriesExercises } from '../src/chapters/power-series/exercises.ts';
import { exercises as functionSeriesExercises } from '../src/chapters/function-series/exercises.ts';
import { exercises as differentiationExercises } from '../src/chapters/differentiation/exercises.ts';
import { exercises as integrationExercises } from '../src/chapters/integration/exercises.ts';

/**
 * Integrity of the chapter exercise data (src/chapters/<id>/exercises.ts):
 * unique kebab-case ids across all chapters, difficulties grouped easy -> hard
 * in file order, non-empty bilingual statement/solution,
 * \(...\) delimiters only (never $...$), topics pointing at real scenes of the
 * same chapter, and viz presets whose keys all exist in the target scene's
 * controls. Exercise counts per chapter are uneven by design (the 10-chapter
 * split redistributed the original 36 exercises by topic fit; the proofs
 * chapter added 6 of its own in 2026-10).
 */

const chapters = [
  { id: 'proofs', exercises: proofsExercises },
  { id: 'numbers', exercises: numbersExercises },
  { id: 'sequences', exercises: sequencesExercises },
  { id: 'continuity', exercises: continuityExercises },
  { id: 'topology', exercises: topologyExercises },
  { id: 'approximation', exercises: approximationExercises },
  { id: 'series', exercises: seriesExercises },
  { id: 'power-series', exercises: powerSeriesExercises },
  { id: 'function-series', exercises: functionSeriesExercises },
  { id: 'differentiation', exercises: differentiationExercises },
  { id: 'integration', exercises: integrationExercises },
] as const;

const KEBAB_CASE = /^[a-z][a-z0-9-]*$/;

const balancedInlineMath = (text: string): boolean => {
  const opens = (text.match(/\\\(/g) ?? []).length;
  const closes = (text.match(/\\\)/g) ?? []).length;
  return opens === closes;
};

describe('chapter exercises', () => {
  it('covers exactly the catalog chapters, in order', () => {
    expect(chapters.map(({ id }) => id)).toEqual(catalog.map((chapter) => chapter.id));
  });

  it('has globally unique ids across all chapters', () => {
    const ids = chapters.flatMap(({ exercises }) => exercises.map((exercise) => exercise.id));
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const { id, exercises } of chapters) {
    describe(id, () => {
      const chapter = catalog.find((candidate) => candidate.id === id);
      if (!chapter) throw new Error(`chapter '${id}' not found in catalog`);
      const sceneIds = new Set(chapter.scenes.map((scene) => scene.id));
      const controlsOf = new Map(
        chapter.scenes.map((scene) => [scene.id, new Set(scene.controls.map((control) => control.key))]),
      );

      it('has unique kebab-case ids', () => {
        const ids = exercises.map((exercise) => exercise.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const exerciseId of ids) expect(exerciseId).toMatch(KEBAB_CASE);
      });

      it('groups difficulties easy -> hard in file order', () => {
        let last = 1;
        exercises.forEach((exercise, index) => {
          expect(exercise.difficulty, `${exercise.id} at position ${index + 1}`).toBeGreaterThanOrEqual(last);
          last = exercise.difficulty;
        });
      });

      it('has a non-empty statement and solution in both languages', () => {
        for (const exercise of exercises) {
          for (const lang of LANGS) {
            expect(localize(exercise.statement, lang).trim().length, `${exercise.id} statement (${lang})`).toBeGreaterThan(0);
          }
          expect(exercise.solution.length, `${exercise.id} solution`).toBeGreaterThan(0);
          exercise.solution.forEach((step, stepIndex) => {
            for (const lang of LANGS) {
              expect(
                localize(step.text, lang).trim().length,
                `${exercise.id} solution step ${stepIndex} (${lang})`,
              ).toBeGreaterThan(0);
            }
          });
        }
      });

      it('uses \\(...\\) delimiters only, balanced', () => {
        const texts: string[] = [];
        for (const exercise of exercises) {
          for (const lang of LANGS) {
            texts.push(localize(exercise.statement, lang));
            if (exercise.viz) texts.push(localize(exercise.viz.presetCaption, lang));
            for (const step of exercise.solution) texts.push(localize(step.text, lang));
          }
          texts.push(...(exercise.display ?? []));
          for (const step of exercise.solution) texts.push(...(step.display ?? []));
        }
        for (const text of texts) {
          expect(text.includes('$'), text).toBe(false);
          expect(balancedInlineMath(text), text).toBe(true);
        }
      });

      it('links topics to real scenes of the same chapter', () => {
        for (const exercise of exercises) {
          expect(exercise.topics.length, `${exercise.id} topics`).toBeGreaterThan(0);
          for (const topicId of exercise.topics) {
            expect(sceneIds.has(topicId), `${exercise.id} topic '${topicId}'`).toBe(true);
          }
        }
      });

      it('points viz at a real scene with valid preset keys', () => {
        for (const exercise of exercises) {
          if (!exercise.viz) continue;
          const controlKeys = controlsOf.get(exercise.viz.sceneId);
          expect(controlKeys, `${exercise.id} viz scene '${exercise.viz.sceneId}'`).toBeDefined();
          for (const key of Object.keys(exercise.viz.preset)) {
            expect(controlKeys?.has(key), `${exercise.id} viz preset key '${key}'`).toBe(true);
          }
        }
      });
    });
  }
});
