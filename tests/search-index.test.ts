import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { glossary } from '../src/glossary.ts';
import { buildSearchIndex } from '../src/search-index.ts';
import { filterSearchIndex } from '../src/shell/search.ts';

const BASE = '/real-analysis/';
const totalScenes = catalog.reduce((n, chapter) => n + chapter.scenes.length, 0);

describe('search index: buildSearchIndex', () => {
  it('covers every scene in both languages', () => {
    for (const lang of ['ko', 'en'] as const) {
      const index = buildSearchIndex(lang);
      expect(index.scenes).toHaveLength(totalScenes);
      expect(totalScenes).toBe(65);
      for (const scene of index.scenes) {
        expect(scene.title.trim().length).toBeGreaterThan(0);
        expect(scene.summary.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('covers every glossary term in both languages', () => {
    for (const lang of ['ko', 'en'] as const) {
      const index = buildSearchIndex(lang);
      expect(index.terms).toHaveLength(glossary.length);
      const ids = new Set(index.terms.map((term) => term.id));
      expect(ids.size).toBe(glossary.length);
    }
  });
});

describe('search: filterSearchIndex', () => {
  const ko = buildSearchIndex('ko');
  const en = buildSearchIndex('en');

  it('returns nothing for an empty query', () => {
    expect(filterSearchIndex(ko, '   ', BASE, 'ko')).toEqual([]);
  });

  it('finds a glossary term by its Korean name', () => {
    const hits = filterSearchIndex(ko, '상한', BASE, 'ko');
    const term = hits.find((hit) => hit.kind === 'term' && hit.url.includes('#term-supremum'));
    expect(term).toBeDefined();
  });

  it('finds a scene by a word in its title', () => {
    const hits = filterSearchIndex(ko, '감마함수', BASE, 'ko');
    const scene = hits.find((hit) => hit.kind === 'scene' && hit.url.includes('/series/gamma/'));
    expect(scene).toBeDefined();
  });

  it('matches case-insensitively in English', () => {
    const hits = filterSearchIndex(en, 'GAMMA', BASE, 'en');
    expect(hits.some((hit) => hit.url.includes('/series/gamma/'))).toBe(true);
  });

  it('matches inside summaries and definitions, not just titles', () => {
    const hits = filterSearchIndex(ko, '팩토리얼', BASE, 'ko');
    expect(hits.length).toBeGreaterThan(0);
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(filterSearchIndex(ko, 'zzzqqq', BASE, 'ko')).toEqual([]);
  });

  it('ranks title/term hits above summary/definition hits', () => {
    // "수렴" appears in many summaries but is the head word of the tests scene family.
    const hits = filterSearchIndex(ko, '균등수렴', BASE, 'ko');
    expect(hits[0]?.kind).toBe('term');
    expect(hits[0]?.url).toContain('#term-uniform-convergence');
  });

  it('builds glossary deep links with term anchors', () => {
    const hits = filterSearchIndex(ko, '동형', BASE, 'ko');
    const term = hits.find((hit) => hit.kind === 'term');
    expect(term?.url).toBe(`${BASE}ko/glossary/#term-isomorphism`);
  });
});
