import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildSearchIndex } from '../src/search-index.ts';
import { decodeSearchVectors, rankSemantic, type SearchVectorsData } from '../src/search-vectors.ts';
import { clarifyOptions, isAmbiguousSemantic, mergeSearchHits, semanticSearchIndex } from '../src/shell/search.ts';

const BASE = '/lecture/real-analysis/';

function loadVectors(lang: 'ko' | 'en'): SearchVectorsData {
  return JSON.parse(
    readFileSync(new URL(`../public/search-vectors.${lang}.json`, import.meta.url), 'utf8'),
  ) as SearchVectorsData;
}

describe('search vectors: generated files stay in sync with the catalog', () => {
  for (const lang of ['ko', 'en'] as const) {
    it(`${lang}: counts match the search index and vectors are normalized`, () => {
      const data = loadVectors(lang);
      const index = buildSearchIndex(lang);
      expect(data.sceneCount).toBe(index.scenes.length);
      expect(data.termCount).toBe(index.terms.length);
      expect(data.dim).toBe(384);
      const vectors = decodeSearchVectors(data);
      expect(vectors.length).toBe(index.scenes.length + index.terms.length);
      const first = vectors[0];
      expect(first).toBeDefined();
      let norm = 0;
      for (const v of first ?? []) norm += v * v;
      expect(Math.sqrt(norm)).toBeGreaterThan(0.99);
      expect(Math.sqrt(norm)).toBeLessThan(1.01);
    });
  }
});

describe('search vectors: ranking math', () => {
  const vectors = [
    Float32Array.from([1, 0, 0]),
    Float32Array.from([0, 1, 0]),
    Float32Array.from([Math.SQRT1_2, Math.SQRT1_2, 0]),
  ];

  it('rankSemantic orders by cosine and applies the floor', () => {
    const ranked = rankSemantic(vectors, [1, 0, 0], 0.5, 8);
    expect(ranked.map((r) => r.index)).toEqual([0, 2]);
    expect(ranked[0]?.score).toBeCloseTo(1, 6);
    expect(rankSemantic(vectors, [1, 0, 0], 0.99, 8).map((r) => r.index)).toEqual([0]);
  });

  it('semanticSearchIndex maps positions to scenes then terms', () => {
    const index = buildSearchIndex('ko');
    const fake = index.scenes.map(() => Float32Array.from([0, 1]));
    for (const _term of index.terms) fake.push(Float32Array.from([0, 1]));
    const sceneZero = fake[0];
    if (sceneZero) {
      sceneZero[0] = 1;
      sceneZero[1] = 0;
    }
    const hits = semanticSearchIndex(index, fake, [1, 0], BASE, 'ko');
    expect(hits.length).toBe(1);
    expect(hits[0]?.kind).toBe('scene');
    expect(hits[0]?.score).toBeCloseTo(1, 6);
  });

  it('mergeSearchHits pins the first keyword hits, then semantic order, deduped', () => {
    const kw = [1, 2, 3, 4].map((n) => ({
      kind: 'scene' as const,
      label: `k${n}`,
      context: '',
      url: `/k${n}`,
    }));
    const sem = [
      { kind: 'term' as const, label: 's1', context: '', url: '/k2', score: 0.9 },
      { kind: 'scene' as const, label: 's2', context: '', url: '/s2', score: 0.85 },
    ];
    const merged = mergeSearchHits(kw, sem, 8);
    expect(merged.map((h) => h.url)).toEqual(['/k1', '/k2', '/k3', '/s2', '/k4']);
  });

  const hit = (label: string, chapterId: string, score: number) => ({
    kind: 'scene' as const,
    label,
    context: chapterId,
    url: `/${label}`,
    chapterId,
    score,
  });

  it('isAmbiguousSemantic: bunched scores across chapters are ambiguous', () => {
    expect(isAmbiguousSemantic([hit('a', 'topology', 0.86), hit('b', 'sequences', 0.855), hit('c', 'sequences', 0.85)])).toBe(true);
  });

  it('isAmbiguousSemantic: a coherent one-chapter cluster is not ambiguous', () => {
    expect(isAmbiguousSemantic([hit('a', 'series', 0.92), hit('b', 'series', 0.91), hit('c', 'series', 0.905)])).toBe(false);
  });

  it('isAmbiguousSemantic: a clear winner is not ambiguous', () => {
    expect(isAmbiguousSemantic([hit('a', 'series', 0.95), hit('b', 'topology', 0.9), hit('c', 'proofs', 0.88)])).toBe(false);
    expect(isAmbiguousSemantic([hit('a', 'series', 0.95)])).toBe(false);
  });

  it('clarifyOptions prefers one candidate per chapter', () => {
    const hits = [
      hit('s1', 'sequences', 0.87),
      hit('s2', 'sequences', 0.865),
      hit('t1', 'topology', 0.86),
      hit('p1', 'proofs', 0.85),
    ];
    expect(clarifyOptions(hits).map((h) => h.label)).toEqual(['s1', 't1', 'p1']);
  });
});
