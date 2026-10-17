import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { buildConceptMap } from '../src/concept-map.ts';
import { mapUrl, withLang } from '../src/paths.ts';

const BASE = '/real-analysis/';

const sceneKeys = new Set<string>();
for (const chapter of catalog) {
  for (const scene of chapter.scenes) sceneKeys.add(`${chapter.id}/${scene.id}`);
}

describe('concept map: graph integrity', () => {
  const { nodes, edges } = buildConceptMap();

  it('covers every scene exactly once', () => {
    const keys = nodes.map((node) => `${node.chapterId}/${node.sceneId}`);
    expect(nodes.length).toBe(sceneKeys.size);
    expect(new Set(keys).size).toBe(nodes.length);
    for (const key of sceneKeys) expect(keys).toContain(key);
  });

  it('has a useful number of edges', () => {
    expect(edges.length).toBeGreaterThan(40);
  });

  it('resolves every edge endpoint to a real scene', () => {
    for (const edge of edges) {
      expect(sceneKeys.has(`${edge.source.chapterId}/${edge.source.sceneId}`)).toBe(true);
      expect(sceneKeys.has(`${edge.target.chapterId}/${edge.target.sceneId}`)).toBe(true);
    }
  });

  it('has no self-loops and no duplicate edges', () => {
    const seen = new Set<string>();
    for (const edge of edges) {
      const from = `${edge.source.chapterId}/${edge.source.sceneId}`;
      const to = `${edge.target.chapterId}/${edge.target.sceneId}`;
      expect(from).not.toBe(to);
      const key = `${from}>${to}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('uses only known edge kinds', () => {
    for (const edge of edges) expect(['prereq', 'path']).toContain(edge.kind);
  });

  it('marks exactly one entry node per chapter: its order-0 scene', () => {
    const entries = nodes.filter((node) => node.isEntry);
    expect(entries.length).toBe(catalog.length);
    for (const chapter of catalog) {
      const first = [...chapter.scenes].sort((a, b) => a.order - b.order)[0];
      expect(entries.some((node) => node.chapterId === chapter.id && node.sceneId === first?.id)).toBe(true);
    }
  });

  it('is deterministic', () => {
    const again = buildConceptMap();
    expect(JSON.stringify(again)).toBe(JSON.stringify({ nodes, edges }));
  });
});

describe('concept map: URL helpers', () => {
  it('builds the map URL', () => {
    expect(mapUrl(BASE, 'ko')).toBe('/real-analysis/ko/map/');
    expect(mapUrl(BASE, 'en')).toBe('/real-analysis/en/map/');
  });

  it('withLang keeps the map route across languages', () => {
    expect(withLang(BASE, { lang: 'ko', chapterId: 'map', sceneId: undefined }, 'en')).toBe(mapUrl(BASE, 'en'));
  });
});
