import { catalogLight as catalog } from './catalog-light.ts';
import type { LocalizedText } from './contracts.ts';

/**
 * Application-map graph data: the roadmap layer that sits after the basic
 * scenes in the concept map. Application scenes are additions that follow
 * the basics, never replacements: each application node bundles the basic
 * scenes that share one working mechanism (stacking layers, deforming a
 * grid, reading an envelope), except the signature cases whose mechanism
 * is the concept itself, which stay individual.
 *
 * The application scenes do not exist yet. This module reserves their ids
 * and records which basic scenes each one builds on, so the future scenes
 * attach here without restructuring. An application may also declare
 * buildsOn: the ids of other applications that should be read before it.
 * The builder emits those as a separate 'builds-on' edge set and keeps
 * that set acyclic: a buildsOn entry naming an unknown application, the
 * application itself, or one whose edge would close a cycle is skipped
 * here and caught by the integrity tests. Pure data: no DOM, no d3,
 * safe to import from Node (build scripts, tests) and from the client
 * map page. Deterministic, mirroring src/concept-map.ts.
 */

/** The shared working mechanism of a bundled application, or 'individual'. */
export type ApplicationMechanism = 'stacking' | 'deformation' | 'envelope' | 'individual';

/** Localized label for each mechanism, shown in the application panel. */
export const MECHANISM_LABELS: Readonly<Record<ApplicationMechanism, LocalizedText>> = {
  stacking: { ko: '쌓기', en: 'Stacking' },
  deformation: { ko: '변형', en: 'Deformation' },
  envelope: { ko: '포락선', en: 'Envelope' },
  individual: { ko: '개별 응용', en: 'Standalone' },
};

/** One application stop on the roadmap. Not a scene: it has no page yet. */
export interface ApplicationDefinition {
  /** Reserved scene id for the future application scene. */
  id: string;
  mechanism: ApplicationMechanism;
  title: LocalizedText;
  description: LocalizedText;
  /** Ids of the basic scenes this application builds on, in reading order. */
  sceneIds: readonly string[];
  /**
   * Ids of other applications this one builds on, in reading order: the
   * named applications should be read before this one. Optional; most
   * applications build only on basic scenes and leave this unset.
   */
  buildsOn?: readonly string[];
}

/** A basic scene resolved to its owning chapter. */
export interface ApplicationSceneRef {
  chapterId: string;
  sceneId: string;
}

/** An application node with its constituent basic scenes resolved. */
export interface ApplicationNode extends ApplicationDefinition {
  scenes: readonly ApplicationSceneRef[];
}

/** Directed edge: the basic scene is read first, the application applies it. */
export interface ApplicationEdge {
  source: ApplicationSceneRef;
  targetAppId: string;
  kind: 'applies';
}

/**
 * Directed edge between applications: the source application is built
 * upon by (read before) the target application. Kept apart from the
 * applies edges because both endpoints are applications, not scenes.
 * The emitted set is always acyclic: the builder drops any buildsOn
 * entry whose edge would close a cycle (documented on buildApplicationMap).
 */
export interface ApplicationDependencyEdge {
  sourceAppId: string;
  targetAppId: string;
  kind: 'builds-on';
}

export interface ApplicationMap {
  apps: readonly ApplicationNode[];
  sceneNodes: readonly ApplicationSceneRef[];
  edges: readonly ApplicationEdge[];
  dependencyEdges: readonly ApplicationDependencyEdge[];
}

/**
 * The decided application set: three mechanism bundles plus three
 * individual applications. Order here is the display order on the map.
 */
export const APPLICATIONS: readonly ApplicationDefinition[] = [
  {
    id: 'app-stacking',
    mechanism: 'stacking',
    title: { ko: '층으로 쌓기', en: 'Stacking Layers' },
    description: {
      ko: '단순한 조각을 한 층씩 쌓아 복잡한 대상을 만드는 응용이다. 고조파를 쌓으면 사각파가 되고, 다항식 항을 쌓으면 원래 함수에 붙는다. 쌓는 손동작은 같고 대상만 바뀐다.',
      en: 'An application that builds a complicated object by stacking simple pieces one layer at a time. Stack harmonics and a square wave appears; stack polynomial terms and they cling to the target function. The stacking motion stays the same, only the target changes.',
    },
    sceneIds: ['fourier', 'gibbs-phenomenon', 'parseval', 'taylor', 'weierstrass-approx'],
  },
  {
    id: 'app-deformation',
    mechanism: 'deformation',
    title: { ko: '격자 변형', en: 'Deforming the Grid' },
    description: {
      ko: '좌표 격자를 늘이고 뒤집고 펴면서 적분과 길이를 다시 보는 응용이다. 칸이 위치마다 다르게 늘어나면 그 비율이 곧 도함수다. 변형된 칸에서도 넓이와 길이를 세는 법을 익힌다.',
      en: 'An application that revisits integrals and length by stretching, flipping, and unrolling a coordinate grid. When a cell stretches by a different factor at each position, that factor is the derivative. You learn to count area and length on the deformed grid.',
    },
    sceneIds: ['change-of-variables', 'inverse-function-theorem', 'arc-length', 'fubini-tonelli'],
  },
  {
    id: 'app-envelope',
    mechanism: 'envelope',
    title: { ko: '포락선으로 보기', en: 'Reading the Envelope' },
    description: {
      ko: '위아래에서 감싸는 두 곡선만으로 진동의 운명을 읽는 응용이다. 포락선이 좁혀지면 극한이 정해지고, 한 점에서 부풀면 균등수렴이 깨진다. 가운데 대상은 직접 보지 않고 경계만으로 판단한다.',
      en: 'An application that reads the fate of an oscillation from the two curves wrapping it above and below. When the envelope tightens, the limit is decided; where it bulges at one point, uniform convergence breaks. The middle object is judged by its boundaries alone.',
    },
    sceneIds: ['limsup-liminf', 'squeeze', 'uniform', 'topologist-sine'],
  },
  {
    id: 'app-peano',
    mechanism: 'individual',
    title: { ko: '채우는 선', en: 'The Filling Line' },
    description: {
      ko: '한 가닥 선이 단계마다 격자를 더 촘촘히 채워 마침내 정사각형 전체를 덮는 응용이다. 채우는 과정 자체가 개념이라 다른 개념과 묶지 않고 따로 다룬다.',
      en: 'An application where a single line fills a grid more densely at each stage until it covers the whole square. The filling process is the concept itself, so it stands alone instead of bundling with others.',
    },
    sceneIds: ['peano-curve'],
  },
  {
    id: 'app-convolution',
    mechanism: 'individual',
    title: { ko: '미끄러지는 겹침', en: 'The Sliding Overlap' },
    description: {
      ko: '함수 하나가 다른 함수 위를 미끄러져 지나가며 겹친 넓이를 쌓는 응용이다. 미끄러지는 상호작용 자체가 합성곱의 정의라 따로 다룬다.',
      en: 'An application where one function slides across another and accumulates the overlapping area. The sliding interaction is the definition of convolution itself, so it stands alone.',
    },
    sceneIds: ['convolution'],
  },
  {
    id: 'app-gabriel-horn',
    mechanism: 'individual',
    title: { ko: '회전으로 만드는 나팔', en: 'The Horn Built by Rotation' },
    description: {
      ko: '곡선을 축 둘레로 회전시켜 3차원 나팔을 만드는 응용이다. 부피는 유한한데 겉넓이는 끝없이 커지는 모습을 두 관점으로 나눠 본다.',
      en: 'An application that builds a three-dimensional horn by rotating a curve around an axis. The volume stays finite while the surface area grows without bound, seen from two viewpoints.',
    },
    sceneIds: ['gabriel-horn'],
  },
];

/**
 * Builds the application map from the given definitions (the decided
 * APPLICATIONS set by default; tests pass small fixtures instead). Each
 * declared basic scene id resolves to its owning chapter the same way
 * the concept map resolves prerequisites; unknown ids are skipped here
 * and caught by the integrity tests. Every application node is emitted
 * even if a constituent scene is missing.
 *
 * buildsOn entries become 'builds-on' edges pointing from the named
 * application to the dependent one. An entry is skipped when it names
 * an unknown application, the application itself, a duplicate, or an
 * application whose edge would close a cycle in the edges emitted so
 * far (definitions are processed in order, so for a cycle exactly the
 * edges that keep the graph acyclic survive). The dependency graph the
 * builder returns is therefore always a DAG; the integrity tests pin
 * this behavior down with fixtures.
 */
export function buildApplicationMap(
  definitions: readonly ApplicationDefinition[] = APPLICATIONS,
): ApplicationMap {
  const chapterOfScene = new Map<string, string>();
  for (const chapter of catalog) {
    for (const scene of chapter.scenes) chapterOfScene.set(scene.id, chapter.id);
  }

  const apps: ApplicationNode[] = [];
  const sceneNodes: ApplicationSceneRef[] = [];
  const edges: ApplicationEdge[] = [];
  const seenScenes = new Set<string>();
  const seenEdges = new Set<string>();

  for (const definition of definitions) {
    const scenes: ApplicationSceneRef[] = [];
    for (const sceneId of definition.sceneIds) {
      const chapterId = chapterOfScene.get(sceneId);
      if (chapterId === undefined) continue;
      const ref: ApplicationSceneRef = { chapterId, sceneId };
      scenes.push(ref);
      const sceneKey = `${chapterId}/${sceneId}`;
      if (!seenScenes.has(sceneKey)) {
        seenScenes.add(sceneKey);
        sceneNodes.push(ref);
      }
      const edgeKey = `${sceneKey}>${definition.id}`;
      if (!seenEdges.has(edgeKey)) {
        seenEdges.add(edgeKey);
        edges.push({ source: ref, targetAppId: definition.id, kind: 'applies' });
      }
    }
    apps.push({ ...definition, scenes });
  }

  // App-to-app dependency edges. Adding an edge from the named
  // application to the dependent one closes a cycle exactly when the
  // dependent application already reaches the named one through the
  // edges emitted so far; such an edge is skipped, so the emitted set
  // stays acyclic. The graph is tiny, so a plain DFS per candidate
  // edge is enough and keeps the check obviously correct.
  const dependencyEdges: ApplicationDependencyEdge[] = [];
  const knownAppIds = new Set(definitions.map((definition) => definition.id));
  const seenDependencies = new Set<string>();
  const outgoing = new Map<string, Set<string>>();
  const reaches = (from: string, goal: string): boolean => {
    const stack = [from];
    const visited = new Set<string>();
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) break;
      if (current === goal) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const next of outgoing.get(current) ?? []) stack.push(next);
    }
    return false;
  };
  for (const definition of definitions) {
    for (const dependencyId of definition.buildsOn ?? []) {
      if (dependencyId === definition.id) continue;
      if (!knownAppIds.has(dependencyId)) continue;
      const edgeKey = `${dependencyId}>${definition.id}`;
      if (seenDependencies.has(edgeKey)) continue;
      if (reaches(definition.id, dependencyId)) continue;
      seenDependencies.add(edgeKey);
      dependencyEdges.push({ sourceAppId: dependencyId, targetAppId: definition.id, kind: 'builds-on' });
      let targets = outgoing.get(dependencyId);
      if (!targets) {
        targets = new Set<string>();
        outgoing.set(dependencyId, targets);
      }
      targets.add(definition.id);
    }
  }

  return { apps, sceneNodes, edges, dependencyEdges };
}
