import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { sceneGroups } from '../src/sections.ts';

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
