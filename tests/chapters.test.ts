import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize } from '../src/contracts.ts';
import { FULLY_RETIRED_CHAPTER_IDS, LEGACY_CHAPTER_IDS, LEGACY_SCENE_CHAPTER } from '../src/paths.ts';

/**
 * Integrity of the 10-chapter split:
 * - the catalog lists exactly the 10 logical chapters in order,
 * - no scene is lost or duplicated (93 unique),
 * - every chapter's scenes are ordered 1..N with 3 proven problems each,
 * - the legacy redirect map covers every scene exactly once.
 */

const EXPECTED_CHAPTERS = [
  'numbers',
  'sequences',
  'continuity',
  'topology',
  'approximation',
  'series',
  'power-series',
  'function-series',
  'differentiation',
  'integration',
] as const;

describe('catalog: the 10 chapters', () => {
  it('lists the 10 logical chapters in order', () => {
    expect(catalog.map((chapter) => chapter.id)).toEqual([...EXPECTED_CHAPTERS]);
  });

  it('has non-empty bilingual titles and summaries', () => {
    for (const chapter of catalog) {
      for (const lang of LANGS) {
        expect(localize(chapter.title, lang).trim().length, `${chapter.id} title (${lang})`).toBeGreaterThan(0);
        expect(localize(chapter.summary, lang).trim().length, `${chapter.id} summary (${lang})`).toBeGreaterThan(0);
      }
    }
  });

  it('covers 93 scenes with no loss or duplication', () => {
    const ids = catalog.flatMap((chapter) => chapter.scenes.map((scene) => scene.id));
    expect(ids).toHaveLength(93);
    expect(new Set(ids).size).toBe(93);
  });

  it('orders every chapter\'s scenes 1..N', () => {
    for (const chapter of catalog) {
      const orders = [...chapter.scenes].sort((a, b) => a.order - b.order).map((scene) => scene.order);
      expect(orders, chapter.id).toEqual(chapter.scenes.map((_, index) => index + 1));
    }
  });

  it('gives every scene a non-empty bilingual title and summary', () => {
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        for (const lang of LANGS) {
          expect(localize(scene.title, lang).trim().length, `${chapter.id}/${scene.id} title (${lang})`).toBeGreaterThan(0);
          expect(localize(scene.summary, lang).trim().length, `${chapter.id}/${scene.id} summary (${lang})`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('gives every scene exactly 3 problems with non-empty bilingual proofs', () => {
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        const problems = scene.problems ?? [];
        expect(problems).toHaveLength(3);
        const ids = problems.map((problem) => problem.id);
        expect(new Set(ids).size).toBe(3);
        for (const problem of problems) {
          expect(problem.proof.length, `${scene.id}/${problem.id}`).toBeGreaterThan(0);
          for (const step of problem.proof) {
            for (const lang of LANGS) {
              expect(localize(step.text, lang).trim().length, `${scene.id}/${problem.id} (${lang})`).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });

  it('uses only declared control keys in every problem preset', () => {
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        for (const problem of scene.problems ?? []) {
          for (const [key, value] of Object.entries(problem.preset)) {
            const spec = scene.controls.find((control) => control.key === key);
            expect(spec, `${scene.id}/${problem.id}: control '${key}' must be declared`).toBeDefined();
            if (spec?.kind === 'slider') {
              expect(typeof value).toBe('number');
            } else if (spec?.kind === 'toggle') {
              expect(typeof value).toBe('boolean');
            } else if (spec?.kind === 'select') {
              expect(spec.options).toContain(value);
            }
          }
        }
      }
    }
  });

  it('resolves every prerequisite to a real scene', () => {
    const sceneIds = new Set(catalog.flatMap((chapter) => chapter.scenes.map((scene) => scene.id)));
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        for (const prereq of scene.prerequisites ?? []) {
          expect(sceneIds.has(prereq), `${chapter.id}/${scene.id} prereq '${prereq}'`).toBe(true);
        }
      }
    }
  });
});

describe('legacy redirects', () => {
  it('retires limits and calculus fully; series keeps its id', () => {
    expect([...LEGACY_CHAPTER_IDS].sort()).toEqual(['calculus', 'limits', 'series']);
    expect([...FULLY_RETIRED_CHAPTER_IDS].sort()).toEqual(['calculus', 'limits']);
    expect(catalog.some((chapter) => chapter.id === 'series')).toBe(true);
  });

  it('maps every catalog scene to its chapter exactly once', () => {
    const catalogScenes = catalog.flatMap((chapter) =>
      chapter.scenes.map((scene) => [scene.id, chapter.id] as const),
    );
    expect(Object.keys(LEGACY_SCENE_CHAPTER)).toHaveLength(93);
    for (const [sceneId, chapterId] of catalogScenes) {
      expect(LEGACY_SCENE_CHAPTER[sceneId], sceneId).toBe(chapterId);
    }
  });

  it('gives every old scene URL a redirect target', () => {
    // Fully retired chapters: every scene that lived there redirects to its
    // new chapter. The pre-split homes are recovered from the split itself:
    // limits scenes are those now in the five ex-limits chapters, etc.
    const preSplitHome = (sceneId: string, chapterId: string): string => {
      if (['numbers', 'sequences', 'continuity', 'topology', 'approximation'].includes(chapterId)) return 'limits';
      if (
        chapterId === 'series' ||
        chapterId === 'power-series' ||
        ['m-test', 'dini', 'gamma', 'beta-function', 'bohr-mollerup', 'improper'].includes(sceneId)
      ) {
        return 'series';
      }
      return 'calculus';
    };
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        const home = preSplitHome(scene.id, chapter.id);
        const target = LEGACY_SCENE_CHAPTER[scene.id];
        expect(target, scene.id).toBe(chapter.id);
        if (home === 'series' && chapter.id === 'series') continue; // stayed: no redirect needed
        // Otherwise the old /<lang>/<home>/<scene>/ URL has target chapterId.
        expect(typeof target).toBe('string');
      }
    }
  });
});
