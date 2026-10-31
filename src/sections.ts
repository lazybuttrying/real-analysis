import type { ChapterMeta, ChapterSection, ExerciseMeta, SceneMeta } from './contracts.ts';

/** The section a scene belongs to, or undefined when the chapter has none. */
export function sectionOfScene(chapter: ChapterMeta, sceneId: string): ChapterSection | undefined {
  return chapter.sections?.find((section) => section.sceneIds.includes(sceneId));
}

export interface ExerciseSectionGroup {
  /** Undefined only for the trailing group of exercises that map to no section. */
  section: ChapterSection | undefined;
  exercises: ExerciseMeta[];
}

/**
 * Group a chapter's exercises under its sections, in section order.
 * An exercise belongs to the section of its first topic scene. Returns
 * undefined when the chapter declares no sections (callers then fall
 * back to their default grouping). Exercises that map to no section
 * land in one trailing untitled group; the test suite fails on those,
 * so the group exists only as a rendering safety net.
 */
export function groupExercisesBySection(
  chapter: ChapterMeta,
  exercises: readonly ExerciseMeta[],
): ExerciseSectionGroup[] | undefined {
  if (!chapter.sections || chapter.sections.length === 0) return undefined;
  const groups = new Map<ChapterSection | undefined, ExerciseMeta[]>();
  for (const section of chapter.sections) groups.set(section, []);
  for (const exercise of exercises) {
    const firstTopic = exercise.topics[0];
    const section = firstTopic ? sectionOfScene(chapter, firstTopic) : undefined;
    const bucket = groups.get(section) ?? [];
    bucket.push(exercise);
    groups.set(section, bucket);
  }
  return [...groups.entries()]
    .filter(([, items]) => items.length > 0)
    .map(([section, items]) => ({ section, exercises: items }));
}

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
