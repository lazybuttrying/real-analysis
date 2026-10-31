import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { SCENE_ALIASES } from '../src/scene-aliases.ts';
import { buildSearchIndex } from '../src/search-index.ts';

/**
 * Metaphor-search support: every scene carries everyday-language aliases in
 * both languages, every alias key is a real scene, and the emitted search
 * index actually carries the alias text the vector builder embeds.
 */
describe('scene aliases', () => {
  const sceneIds = new Set(catalog.flatMap((chapter) => chapter.scenes.map((scene) => scene.id)));

  it('every alias key is a real scene id', () => {
    for (const key of Object.keys(SCENE_ALIASES)) expect(sceneIds.has(key), key).toBe(true);
  });

  it('every scene has non-empty aliases in both languages', () => {
    for (const id of sceneIds) {
      const alias = SCENE_ALIASES[id];
      expect(alias, id).toBeDefined();
      expect(alias!.ko.trim().length, id).toBeGreaterThan(0);
      expect(alias!.en.trim().length, id).toBeGreaterThan(0);
    }
  });

  it('the search index carries the aliases per language', () => {
    const ko = buildSearchIndex('ko');
    const bounded = ko.scenes.find((scene) => scene.sceneId === 'bounded');
    expect(bounded?.aliases).toContain('울타리');
    const en = buildSearchIndex('en');
    const arcLength = en.scenes.find((scene) => scene.sceneId === 'arc-length');
    expect(arcLength?.aliases).toContain('path');
  });
});
