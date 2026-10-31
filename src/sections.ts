import type { ChapterMeta, ChapterSection, SceneMeta } from './contracts.ts';

export interface SceneGroup {
  /** Undefined for a chapter without sections: one flat group. */
  section: ChapterSection | undefined;
  scenes: SceneMeta[];
}

/**
 * Group a chapter's scenes (already sorted by order) under its declared
 * sections. Chapters without sections yield a single untitled group.
 * The data is validated by tests and the prerender checker, so a scene
 * missing from the sections simply does not render here; the build
 * fails there instead.
 */
export function sceneGroups(chapter: ChapterMeta, sortedScenes: readonly SceneMeta[]): SceneGroup[] {
  if (!chapter.sections || chapter.sections.length === 0) {
    return [{ section: undefined, scenes: [...sortedScenes] }];
  }
  const byId = new Map(sortedScenes.map((scene) => [scene.id, scene]));
  return chapter.sections.map((section) => ({
    section,
    scenes: section.sceneIds.map((id) => byId.get(id)).filter((scene): scene is SceneMeta => scene !== undefined),
  }));
}
