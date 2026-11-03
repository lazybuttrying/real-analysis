import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog.ts';
import { APPLICATIONS, buildApplicationMap, type ApplicationDefinition } from '../src/application-map.ts';
import { LANGS, localize } from '../src/contracts.ts';

const chapterOfScene = new Map<string, string>();
const sceneKeys = new Set<string>();
for (const chapter of catalog) {
  for (const scene of chapter.scenes) {
    chapterOfScene.set(scene.id, chapter.id);
    sceneKeys.add(`${chapter.id}/${scene.id}`);
  }
}

const EXPECTED_APPS: ReadonlyArray<{ id: string; sceneIds: readonly string[] }> = [
  { id: 'app-stacking', sceneIds: ['fourier', 'gibbs-phenomenon', 'parseval', 'taylor', 'weierstrass-approx', 'fourier-epicycles'] },
  { id: 'app-deformation', sceneIds: ['change-of-variables', 'inverse-function-theorem', 'arc-length', 'fubini-tonelli', 'jacobian-grid'] },
  { id: 'app-envelope', sceneIds: ['limsup-liminf', 'squeeze', 'uniform', 'topologist-sine'] },
  { id: 'app-peano', sceneIds: ['peano-curve'] },
  { id: 'app-convolution', sceneIds: ['convolution'] },
  { id: 'app-gabriel-horn', sceneIds: ['gabriel-horn'] },
];

describe('application map: graph integrity', () => {
  const { apps, sceneNodes, edges, dependencyEdges } = buildApplicationMap();

  it('defines exactly the six decided applications, in order', () => {
    expect(APPLICATIONS.map((app) => app.id)).toEqual(EXPECTED_APPS.map((app) => app.id));
    expect(apps.map((app) => app.id)).toEqual(EXPECTED_APPS.map((app) => app.id));
  });

  it('has unique application ids that collide with no scene id', () => {
    const ids = APPLICATIONS.map((app) => app.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(chapterOfScene.has(id)).toBe(false);
  });

  it('gives every application a title and description in both languages', () => {
    for (const app of APPLICATIONS) {
      for (const lang of LANGS) {
        expect(localize(app.title, lang).trim()).not.toBe('');
        expect(localize(app.description, lang).trim()).not.toBe('');
      }
    }
  });

  it('keeps the three mechanism bundles bundled and the three exceptions individual', () => {
    const byId = new Map(APPLICATIONS.map((app) => [app.id, app]));
    expect(byId.get('app-stacking')?.mechanism).toBe('stacking');
    expect(byId.get('app-deformation')?.mechanism).toBe('deformation');
    expect(byId.get('app-envelope')?.mechanism).toBe('envelope');
    for (const id of ['app-peano', 'app-convolution', 'app-gabriel-horn']) {
      expect(byId.get(id)?.mechanism).toBe('individual');
      expect(byId.get(id)?.sceneIds.length).toBe(1);
    }
    for (const id of ['app-stacking', 'app-deformation', 'app-envelope']) {
      expect((byId.get(id)?.sceneIds.length ?? 0)).toBeGreaterThan(1);
    }
  });

  it('references exactly the decided basic scenes, each resolving to its owning chapter', () => {
    for (const expected of EXPECTED_APPS) {
      const app = apps.find((candidate) => candidate.id === expected.id);
      expect(app).toBeDefined();
      expect(app?.scenes.map((ref) => ref.sceneId)).toEqual(expected.sceneIds);
      for (const ref of app?.scenes ?? []) {
        expect(ref.chapterId).toBe(chapterOfScene.get(ref.sceneId));
        expect(sceneKeys.has(`${ref.chapterId}/${ref.sceneId}`)).toBe(true);
      }
    }
  });

  it('covers every referenced basic scene exactly once as a scene node', () => {
    const expectedCount = EXPECTED_APPS.reduce((sum, app) => sum + app.sceneIds.length, 0);
    expect(sceneNodes.length).toBe(expectedCount);
    const keys = sceneNodes.map((ref) => `${ref.chapterId}/${ref.sceneId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('emits one applies edge per constituent scene, with no duplicates', () => {
    const expectedCount = EXPECTED_APPS.reduce((sum, app) => sum + app.sceneIds.length, 0);
    expect(edges.length).toBe(expectedCount);
    const seen = new Set<string>();
    for (const edge of edges) {
      expect(edge.kind).toBe('applies');
      const key = `${edge.source.chapterId}/${edge.source.sceneId}>${edge.targetAppId}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('resolves every edge endpoint: source is a real scene, target is a real application', () => {
    const appIds = new Set(APPLICATIONS.map((app) => app.id));
    for (const edge of edges) {
      expect(sceneKeys.has(`${edge.source.chapterId}/${edge.source.sceneId}`)).toBe(true);
      expect(appIds.has(edge.targetAppId)).toBe(true);
    }
  });

  it('is deterministic', () => {
    const again = buildApplicationMap();
    expect(JSON.stringify(again)).toBe(JSON.stringify({ apps, sceneNodes, edges, dependencyEdges }));
  });

  it('ships no app-to-app dependencies in the decided set', () => {
    for (const app of APPLICATIONS) expect(app.buildsOn).toBeUndefined();
    const { dependencyEdges } = buildApplicationMap();
    expect(dependencyEdges).toEqual([]);
  });
});

describe('application map: buildsOn dependency edges (fixtures)', () => {
  const fixtureDef = (
    id: string,
    sceneIds: readonly string[],
    buildsOn?: readonly string[],
  ): ApplicationDefinition => ({
    id,
    mechanism: 'individual',
    title: { ko: id, en: id },
    description: { ko: id, en: id },
    sceneIds,
    ...(buildsOn === undefined ? {} : { buildsOn }),
  });

  // dep-a builds on dep-b; dep-b builds on dep-c plus an unknown id;
  // dep-c builds on itself; dep-d and dep-e build on each other (a cycle).
  const FIXTURE: readonly ApplicationDefinition[] = [
    fixtureDef('dep-a', ['fourier'], ['dep-b']),
    fixtureDef('dep-b', ['parseval'], ['dep-c', 'dep-missing']),
    fixtureDef('dep-c', ['taylor'], ['dep-c']),
    fixtureDef('dep-d', [], ['dep-e']),
    fixtureDef('dep-e', [], ['dep-d']),
  ];

  it('emits one builds-on edge per valid buildsOn entry, named app first', () => {
    const { dependencyEdges } = buildApplicationMap(FIXTURE);
    expect(dependencyEdges).toContainEqual({ sourceAppId: 'dep-b', targetAppId: 'dep-a', kind: 'builds-on' });
    expect(dependencyEdges).toContainEqual({ sourceAppId: 'dep-c', targetAppId: 'dep-b', kind: 'builds-on' });
    for (const edge of dependencyEdges) expect(edge.kind).toBe('builds-on');
  });

  it('skips unknown application ids in buildsOn', () => {
    const { dependencyEdges } = buildApplicationMap(FIXTURE);
    for (const edge of dependencyEdges) {
      expect(edge.sourceAppId).not.toBe('dep-missing');
      expect(edge.targetAppId).not.toBe('dep-missing');
    }
  });

  it('emits no self loops', () => {
    const { dependencyEdges } = buildApplicationMap(FIXTURE);
    for (const edge of dependencyEdges) expect(edge.sourceAppId).not.toBe(edge.targetAppId);
    expect(dependencyEdges.some((edge) => edge.sourceAppId === 'dep-c' && edge.targetAppId === 'dep-c')).toBe(false);
  });

  it('rejects the edge that would close a cycle, keeping the graph acyclic', () => {
    const { dependencyEdges } = buildApplicationMap(FIXTURE);
    const pair = dependencyEdges.filter(
      (edge) =>
        (edge.sourceAppId === 'dep-d' && edge.targetAppId === 'dep-e') ||
        (edge.sourceAppId === 'dep-e' && edge.targetAppId === 'dep-d'),
    );
    // Exactly one direction survives: the first in definition order
    // (dep-d builds on dep-e). The reverse edge would close the cycle.
    expect(pair).toEqual([{ sourceAppId: 'dep-e', targetAppId: 'dep-d', kind: 'builds-on' }]);
    expect(dependencyEdges.length).toBe(3);
  });

  it('deduplicates repeated buildsOn entries', () => {
    const { dependencyEdges } = buildApplicationMap([
      fixtureDef('dup-a', [], ['dup-b', 'dup-b']),
      fixtureDef('dup-b', []),
    ]);
    expect(dependencyEdges).toEqual([{ sourceAppId: 'dup-b', targetAppId: 'dup-a', kind: 'builds-on' }]);
  });

  it('keeps applies edges independent of the dependency edges', () => {
    const { apps, edges, dependencyEdges } = buildApplicationMap(FIXTURE);
    expect(apps.map((app) => app.id)).toEqual(['dep-a', 'dep-b', 'dep-c', 'dep-d', 'dep-e']);
    expect(edges.map((edge) => `${edge.source.sceneId}>${edge.targetAppId}`)).toEqual([
      'fourier>dep-a',
      'parseval>dep-b',
      'taylor>dep-c',
    ]);
    expect(dependencyEdges.length).toBe(3);
  });
});
