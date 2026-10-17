import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize } from '../src/contracts.ts';
import { learningPaths } from '../src/learning-paths.ts';
import { pathDetailUrl, pathsUrl, withLang } from '../src/paths.ts';

const BASE = '/real-analysis/';

const sceneKeys = new Set<string>();
for (const chapter of catalog) {
  for (const scene of chapter.scenes) sceneKeys.add(`${chapter.id}/${scene.id}`);
}

describe('learning paths: data integrity', () => {
  it('has unique kebab-case ids', () => {
    const ids = learningPaths.map((path) => path.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it('has a non-empty title and description in both languages', () => {
    expect(learningPaths.length).toBeGreaterThan(0);
    for (const path of learningPaths) {
      for (const lang of LANGS) {
        expect(localize(path.title, lang).trim().length).toBeGreaterThan(0);
        expect(localize(path.description, lang).trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('uses only \(...\) math delimiters, never $...$', () => {
    for (const path of learningPaths) {
      for (const lang of LANGS) {
        for (const text of [localize(path.title, lang), localize(path.description, lang)]) {
          expect(text).not.toContain('$');
          const opens = (text.match(/\\\(/g) ?? []).length;
          const closes = (text.match(/\\\)/g) ?? []).length;
          expect(opens).toBe(closes);
        }
      }
    }
  });

  it('links every step to a real scene', () => {
    for (const path of learningPaths) {
      expect(path.scenes.length).toBeGreaterThan(0);
      for (const step of path.scenes) {
        expect(sceneKeys.has(`${step.chapterId}/${step.sceneId}`)).toBe(true);
      }
    }
  });

  it('has no duplicate scenes within a path', () => {
    for (const path of learningPaths) {
      const keys = path.scenes.map((step) => `${step.chapterId}/${step.sceneId}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe('learning paths: URL helpers', () => {
  it('builds the index and detail URLs', () => {
    expect(pathsUrl(BASE, 'ko')).toBe('/real-analysis/ko/paths/');
    expect(pathsUrl(BASE, 'en')).toBe('/real-analysis/en/paths/');
    expect(pathDetailUrl(BASE, 'ko', 'convergence-tests')).toBe('/real-analysis/ko/paths/convergence-tests/');
  });

  it('withLang keeps the paths route across languages', () => {
    expect(withLang(BASE, { lang: 'ko', chapterId: 'paths', sceneId: undefined }, 'en')).toBe(pathsUrl(BASE, 'en'));
    expect(withLang(BASE, { lang: 'ko', chapterId: 'paths', sceneId: 'dini' }, 'en')).toBe(
      pathDetailUrl(BASE, 'en', 'dini'),
    );
  });
});
