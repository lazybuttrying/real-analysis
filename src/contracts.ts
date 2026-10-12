/**
 * Contracts shared across the whole app.
 *
 * This file holds no runtime code other than types and defineScene.
 * meta.ts and scripts/ import this file from Node, so it must not depend on the DOM, d3, or three.
 *
 * Data flow (one-way):
 *   ControlState → SceneModel.compute → derived data D → Scene.render
 */

export type ControlSpec =
  | { kind: 'slider'; key: string; label: string; min: number; max: number; step: number; init: number }
  | { kind: 'toggle'; key: string; label: string; init: boolean }
  | { kind: 'select'; key: string; label: string; options: readonly string[]; init: string };

export type ControlValue = number | boolean | string;

/** All control values. Treated as an immutable object; a new object is created whenever it changes. */
export type ControlState = Readonly<Record<string, ControlValue>>;

/** Pure computation. Does not import the DOM, d3, or three. Returning a Promise is allowed so it can be moved to a Worker if it gets heavy. */
export interface SceneModel<D> {
  compute(state: ControlState): D | Promise<D>;
}

/** Handles rendering. Lifecycle: mount → (render | resize)* → dispose. */
export interface Scene<D> {
  mount(host: HTMLElement): void;
  render(data: D, state: ControlState): void;
  /** Called when the host size changes. Redrawing is the scene's responsibility. */
  resize?(width: number, height: number): void;
  /** Releases everything: rAF, observers, the WebGL context, and DOM. */
  dispose(): void;
}

export interface SceneModule<D> {
  model: SceneModel<D>;
  createScene(): Scene<D>;
}

/** Used only at the registry boundary. Inside scene files, types are kept with defineScene<D>(). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySceneModule = SceneModule<any>;

export type SceneLoader = () => Promise<AnySceneModule>;

export function defineScene<D>(module: SceneModule<D>): SceneModule<D> {
  return module;
}

export interface SceneMeta {
  /** URL slug within the chapter. The page path is /<chapter id>/<scene id>/ */
  id: string;
  title: string;
  order: number;
  /** Used in the meta description and the first paragraph of the body. */
  summary: string;
  /** Key formulas (TeX) to prerender. */
  tex?: readonly string[];
  /** Scene ids worth viewing first (within the same chapter). */
  prerequisites?: readonly string[];
  controls: readonly ControlSpec[];
}

export interface ChapterMeta {
  /** URL path and folder name. Lowercase letters, digits, and hyphens. */
  id: string;
  title: string;
  summary: string;
  scenes: readonly SceneMeta[];
}
