import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { ERRATA_AS_OF, errata } from '../src/errata.ts';
import { errataUrl, parsePath, withLang } from '../src/paths.ts';

const BASE = '/lecture/real-analysis/';

describe('errata data', () => {
  it('has unique ids and ISO dates', () => {
    const ids = new Set<string>();
    for (const entry of errata) {
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(ERRATA_AS_OF).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('links only to scenes that exist, with both ids set together', () => {
    for (const entry of errata) {
      expect(entry.chapterId === undefined).toBe(entry.sceneId === undefined);
      if (entry.chapterId && entry.sceneId) {
        const chapter = catalog.find((c) => c.id === entry.chapterId);
        expect(chapter, entry.id).toBeDefined();
        expect(chapter?.scenes.some((s) => s.id === entry.sceneId), entry.id).toBe(true);
      }
    }
  });

  it('has non-empty text in both languages', () => {
    for (const entry of errata) {
      for (const lang of ['ko', 'en'] as const) {
        expect(entry.title[lang].trim().length, `${entry.id} title ${lang}`).toBeGreaterThan(0);
        expect(entry.detail[lang].trim().length, `${entry.id} detail ${lang}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('errata routing', () => {
  it('builds the errata URL and round-trips through parsePath and withLang', () => {
    expect(errataUrl(BASE, 'ko')).toBe(`${BASE}ko/errata/`);
    const parsed = parsePath(BASE, `${BASE}en/errata/`);
    expect(parsed).toEqual({ lang: 'en', chapterId: 'errata', sceneId: undefined });
    expect(withLang(BASE, parsed, 'ko')).toBe(`${BASE}ko/errata/`);
  });
});
