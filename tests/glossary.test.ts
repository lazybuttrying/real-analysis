import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize, type Lang } from '../src/contracts.ts';
import { glossary } from '../src/glossary.ts';

const sceneKeys = new Set<string>();
for (const chapter of catalog) {
  for (const scene of chapter.scenes) sceneKeys.add(`${chapter.id}/${scene.id}`);
}

const totalScenes = catalog.reduce((n, chapter) => n + chapter.scenes.length, 0);

describe('glossary: entry integrity', () => {
  it('has unique ids', () => {
    const ids = glossary.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links every entry to a real chapter/scene in the catalog', () => {
    for (const entry of glossary) {
      expect(sceneKeys.has(`${entry.chapterId}/${entry.sceneId}`), entry.id).toBe(true);
    }
  });

  it('covers every scene with at least one term', () => {
    const covered = new Set(glossary.map((entry) => `${entry.chapterId}/${entry.sceneId}`));
    expect(covered.size).toBe(totalScenes);
  });

  it('has a non-empty term and definition in both languages', () => {
    for (const entry of glossary) {
      for (const lang of LANGS) {
        expect(localize(entry.term, lang as Lang).trim().length, `${entry.id} term ${lang}`).toBeGreaterThan(0);
        expect(localize(entry.definition, lang as Lang).trim().length, `${entry.id} definition ${lang}`).toBeGreaterThan(0);
      }
    }
  });

  it('uses \\(...\\) delimiters only: no $ and balanced parens', () => {
    for (const entry of glossary) {
      for (const lang of LANGS) {
        for (const [field, text] of [
          ['term', localize(entry.term, lang as Lang)],
          ['definition', localize(entry.definition, lang as Lang)],
        ] as const) {
          expect(text.includes('$'), `${entry.id} ${field} ${lang} has a $`).toBe(false);
          const opens = (text.match(/\\\(/g) ?? []).length;
          const closes = (text.match(/\\\)/g) ?? []).length;
          expect(opens, `${entry.id} ${field} ${lang} unbalanced`).toBe(closes);
        }
      }
    }
  });
});
