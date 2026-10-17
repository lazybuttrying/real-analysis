import { catalog } from './catalog.ts';
import { learningPaths } from './learning-paths.ts';

/**
 * Concept-map graph data, derived (not hand-written) from two sources:
 *
 *  1. `prerequisites` fields in src/chapters/<chapter>/meta.ts — a scene id
 *     listed there resolves to another scene of the same chapter.
 *  2. `learningPaths` (src/learning-paths.ts) — consecutive steps of a
 *     curated path are linked in reading order.
 *
 * Pure data derivation: no DOM, no d3, safe to import from Node (build
 * scripts, tests) and from the client-side map page. Deterministic — the
 * same catalog always yields the same graph.
 */

/** One scene, addressed by chapter + scene id. */
export interface MapNode {
  chapterId: string;
  sceneId: string;
}

/** Directed edge: the source should be read before the target. */
export interface MapEdge {
  source: MapNode;
  target: MapNode;
  /** 'prereq': from SceneMeta.prerequisites; 'path': consecutive learning-path steps. */
  kind: 'prereq' | 'path';
}

export interface ConceptMap {
  nodes: readonly MapNode[];
  edges: readonly MapEdge[];
}

const nodeKey = (chapterId: string, sceneId: string): string => `${chapterId}/${sceneId}`;

/** Builds the full concept map. Every edge endpoint is a real scene; no self-loops; no duplicates. */
export function buildConceptMap(): ConceptMap {
  const sceneIds = new Set<string>();
  for (const chapter of catalog) {
    for (const scene of chapter.scenes) sceneIds.add(nodeKey(chapter.id, scene.id));
  }

  const nodes: MapNode[] = [];
  for (const chapter of catalog) {
    for (const scene of [...chapter.scenes].sort((a, b) => a.order - b.order)) {
      nodes.push({ chapterId: chapter.id, sceneId: scene.id });
    }
  }

  const edges: MapEdge[] = [];
  const seen = new Set<string>();
  const addEdge = (fromChapter: string, fromScene: string, toChapter: string, toScene: string, kind: MapEdge['kind']): void => {
    if (fromChapter === toChapter && fromScene === toScene) return;
    if (!sceneIds.has(nodeKey(fromChapter, fromScene)) || !sceneIds.has(nodeKey(toChapter, toScene))) return;
    const dedupKey = `${nodeKey(fromChapter, fromScene)}>${nodeKey(toChapter, toScene)}`;
    if (seen.has(dedupKey)) return;
    seen.add(dedupKey);
    edges.push({
      source: { chapterId: fromChapter, sceneId: fromScene },
      target: { chapterId: toChapter, sceneId: toScene },
      kind,
    });
  };

  // Prerequisite edges: prerequisite -> scene (read the prerequisite first).
  // All prerequisites in meta.ts are same-chapter scene ids.
  for (const chapter of catalog) {
    for (const scene of chapter.scenes) {
      for (const prereq of scene.prerequisites ?? []) {
        addEdge(chapter.id, prereq, chapter.id, scene.id, 'prereq');
      }
    }
  }

  // Learning-path edges: consecutive steps of each curated path, in reading order.
  for (const path of learningPaths) {
    for (let i = 0; i + 1 < path.scenes.length; i++) {
      const from = path.scenes[i];
      const to = path.scenes[i + 1];
      if (from === undefined || to === undefined) continue;
      addEdge(from.chapterId, from.sceneId, to.chapterId, to.sceneId, 'path');
    }
  }

  return { nodes, edges };
}
