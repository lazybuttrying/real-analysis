/**
 * Contracts shared across the whole app.
 *
 * This file holds no runtime code other than types, defineScene, and the small
 * pure language helpers below. meta.ts and scripts/ import this file from Node,
 * so it must not depend on the DOM, d3, or three.
 *
 * Data flow (one-way):
 *   ControlState → SceneModel.compute → derived data D → Scene.render
 */

/** Languages the site is published in. The language is a URL path segment (see paths.ts). */
export type Lang = 'ko' | 'en';

export const LANGS: readonly Lang[] = ['ko', 'en'];

export const DEFAULT_LANG: Lang = 'ko';

/** A user-visible text in every language. Content data (meta.ts) is stored in this shape. */
export type LocalizedText = Readonly<Record<Lang, string>>;

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang];
}

/**
 * A piece of a rich-text string (summaries): either plain prose, or TeX source
 * that appeared between \( and \) delimiters.
 */
type RichTextSegment = { kind: 'text'; text: string } | { kind: 'math'; tex: string };

const INLINE_MATH_PATTERN = /\\\(([\s\S]*?)\\\)/g;

/**
 * Splits a summary into plain-text and inline-math segments. Text without
 * delimiters yields a single text segment; an unmatched \( stays plain text.
 */
export function splitInlineMath(text: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_MATH_PATTERN)) {
    if (match.index > last) segments.push({ kind: 'text', text: text.slice(last, match.index) });
    segments.push({ kind: 'math', tex: match[1] ?? '' });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ kind: 'text', text: text.slice(last) });
  return segments;
}

/**
 * Plain-text form of a summary for places that cannot render math (meta
 * descriptions): the \( \) delimiters are removed, the TeX source stays.
 */
export function stripInlineMath(text: string): string {
  return splitInlineMath(text)
    .map((segment) => (segment.kind === 'math' ? segment.tex : segment.text))
    .join('');
}

export type ControlSpec =
  | { kind: 'slider'; key: string; label: LocalizedText; min: number; max: number; step: number; init: number }
  | { kind: 'toggle'; key: string; label: LocalizedText; init: boolean }
  | { kind: 'select'; key: string; label: LocalizedText; options: readonly string[]; init: string };

export type ControlValue = number | boolean | string;

/** All control values. Treated as an immutable object; a new object is created whenever it changes. */
export type ControlState = Readonly<Record<string, ControlValue>>;

/** Pure computation. Does not import the DOM, d3, or three. Returning a Promise is allowed so it can be moved to a Worker if it gets heavy. */
export interface SceneModel<D> {
  compute(state: ControlState): D | Promise<D>;
}

/** Handles rendering. Lifecycle: mount → (render | resize)* → dispose. */
export interface Scene<D> {
  /** The page language is fixed for the lifetime of a page (switching languages is a full navigation), so it is handed over once at mount. */
  mount(host: HTMLElement, lang: Lang): void;
  render(data: D, state: ControlState): void;
  /** Called when the host size changes. Redrawing is the scene's responsibility. */
  resize?(width: number, height: number): void;
  /** Releases everything: rAF, observers, the WebGL context, and DOM. */
  dispose(): void;
}

interface SceneModule<D> {
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

/** One step of a rigorous proof: prose (with \(...\) inline TeX) plus optional display formulas. */
interface ProofStep {
  text: LocalizedText;
  display?: readonly string[];
}

/**
 * An example/exercise attached to a scene. The mini visualization reuses the
 * scene's own model and renderer with the fixed `preset` control state
 * (non-interactive); `presetCaption` describes that preset in one line.
 * The proof is bilingual data; renderers show it behind a toggle.
 */
export interface ProblemMeta {
  /** Unique within the scene; used for element ids. */
  id: string;
  /** Problem statement; prose may embed \(...\) inline TeX. */
  statement: LocalizedText;
  /** Display formulas shown under the statement. */
  display?: readonly string[];
  /** Fixed control values for the mini visualization. Must be valid for the scene's controls. */
  preset: ControlState;
  /** One-line caption describing the preset. Prose may embed \(...\) inline TeX. */
  presetCaption: LocalizedText;
  /** The rigorous proof, shown behind a toggle. */
  proof: readonly ProofStep[];
  /**
   * True when the steps are a hint/sketch rather than a complete proof.
   * Renderers show "Show hint" instead of "Show proof".
   */
  isHint?: boolean;
}

/** Difficulty of a chapter exercise: 1 = easy, 2 = medium, 3 = hard. */
export type ExerciseDifficulty = 1 | 2 | 3;

/**
 * An end-of-chapter exercise. Chapter-level (not attached to a scene), so
 * statements are fully self-contained and must be original compositions, not
 * restatements of scene examples. `topics` lists scene ids in the same chapter
 * for cross-linking. `viz` optionally reuses one of the chapter's own scene
 * models with a fixed preset for a compact, non-interactive mini
 * visualization (same pattern as ProblemMeta.preset). The solution is
 * bilingual data; renderers show it behind a toggle.
 */
export interface ExerciseMeta {
  /** Unique within the chapter; used for element ids and URL anchors. */
  id: string;
  difficulty: ExerciseDifficulty;
  /** Scene ids in the same chapter that this exercise draws on. */
  topics: readonly string[];
  /** Problem statement; prose may embed \(...\) inline TeX. */
  statement: LocalizedText;
  /** Display formulas shown under the statement. */
  display?: readonly string[];
  /** The rigorous solution, shown behind a toggle. */
  solution: readonly ProofStep[];
  /** Optional mini visualization reusing a scene of the same chapter. */
  viz?: {
    /** Scene id within the same chapter whose model/renderer is reused. */
    sceneId: string;
    /** Fixed control values for the mini visualization. Must be valid for the scene's controls. */
    preset: ControlState;
    /** One-line caption describing the preset. Prose may embed \(...\) inline TeX. */
    presetCaption: LocalizedText;
  };
}

export interface SceneMeta {
  /** URL slug within the chapter. The page path is /<lang>/<chapter id>/<scene id>/ */
  id: string;
  title: LocalizedText;
  order: number;
  /**
   * Used in the meta description and the first paragraph of the body.
   * May embed inline TeX between \( and \); renderers turn those spans into
   * KaTeX, and plain-text contexts strip the delimiters (see stripInlineMath).
   */
  summary: LocalizedText;
  /** Key formulas (TeX) to prerender. */
  tex?: readonly string[];
  /** Scene ids worth viewing first (within the same chapter). */
  prerequisites?: readonly string[];
  controls: readonly ControlSpec[];
  /** Examples/exercises with mini visualizations and proofs. Optional; scenes without it are untouched. */
  problems?: readonly ProblemMeta[];
}

export interface ChapterMeta {
  /** URL path and folder name. Lowercase letters, digits, and hyphens. */
  id: string;
  title: LocalizedText;
  /** Same inline-TeX convention as SceneMeta.summary. */
  summary: LocalizedText;
  scenes: readonly SceneMeta[];
}
