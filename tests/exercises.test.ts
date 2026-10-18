import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize } from '../src/contracts.ts';
import { exercises as limitsExercises } from '../src/chapters/limits/exercises.ts';
import { exercises as seriesExercises } from '../src/chapters/series/exercises.ts';
import { exercises as calculusExercises } from '../src/chapters/calculus/exercises.ts';

/**
 * Integrity of the chapter exercise data (src/chapters/<id>/exercises.ts):
 * 12 exercises per chapter, unique kebab-case ids, the 4/5/3 difficulty split
 * in file order (easy first), non-empty bilingual statement/solution,
 * \(...\) delimiters only (never $...$), topics pointing at real scenes of the
 * same chapter, and viz presets whose keys all exist in the target scene's
 * controls.
 */

const chapters = [
  { id: 'limits', exercises: limitsExercises },
  { id: 'series', exercises: seriesExercises },
  { id: 'calculus', exercises: calculusExercises },
] as const;

const KEBAB_CASE = /^[a-z][a-z0-9-]*$/;

const balancedInlineMath = (text: string): boolean => {
  const opens = (text.match(/\\\(/g) ?? []).length;
  const closes = (text.match(/\\\)/g) ?? []).length;
  return opens === closes;
};

describe('chapter exercises', () => {
  for (const { id, exercises } of chapters) {
    describe(id, () => {
      const chapter = catalog.find((candidate) => candidate.id === id);
      if (!chapter) throw new Error(`chapter '${id}' not found in catalog`);
      const sceneIds = new Set(chapter.scenes.map((scene) => scene.id));
      const controlsOf = new Map(
        chapter.scenes.map((scene) => [scene.id, new Set(scene.controls.map((control) => control.key))]),
      );

      it('has exactly 12 exercises', () => {
        expect(exercises).toHaveLength(12);
      });

      it('has unique kebab-case ids', () => {
        const ids = exercises.map((exercise) => exercise.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const exerciseId of ids) expect(exerciseId).toMatch(KEBAB_CASE);
      });

      it('uses the 4/5/3 difficulty split in file order (easy first)', () => {
        exercises.forEach((exercise, index) => {
          const expected = index < 4 ? 1 : index < 9 ? 2 : 3;
          expect(exercise.difficulty, `${exercise.id} at position ${index + 1}`).toBe(expected);
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
