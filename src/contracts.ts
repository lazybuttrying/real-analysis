/**
 * 앱 전체가 공유하는 계약.
 *
 * 이 파일에는 타입과 defineScene 외의 런타임 코드를 두지 않는다.
 * meta.ts 와 scripts/ 가 Node에서 이 파일을 import 하므로 DOM, d3, three에 의존하면 안 된다.
 *
 * 데이터 흐름(단방향):
 *   ControlState → SceneModel.compute → 파생 데이터 D → Scene.render
 */

export type ControlSpec =
  | { kind: 'slider'; key: string; label: string; min: number; max: number; step: number; init: number }
  | { kind: 'toggle'; key: string; label: string; init: boolean }
  | { kind: 'select'; key: string; label: string; options: readonly string[]; init: string };

export type ControlValue = number | boolean | string;

/** 컨트롤 값 전체. 불변 객체로 다루고, 바뀔 때마다 새 객체를 만든다. */
export type ControlState = Readonly<Record<string, ControlValue>>;

/** 순수 계산. DOM, d3, three를 import 하지 않는다. 무거워지면 Worker로 옮길 수 있도록 Promise 반환을 허용한다. */
export interface SceneModel<D> {
  compute(state: ControlState): D | Promise<D>;
}

/** 렌더링 담당. 수명주기는 mount → (render | resize)* → dispose. */
export interface Scene<D> {
  mount(host: HTMLElement): void;
  render(data: D, state: ControlState): void;
  /** 호스트 크기가 바뀌면 호출된다. 다시 그리는 책임은 씬에 있다. */
  resize?(width: number, height: number): void;
  /** rAF, observer, WebGL 컨텍스트, DOM을 모두 해제한다. */
  dispose(): void;
}

export interface SceneModule<D> {
  model: SceneModel<D>;
  createScene(): Scene<D>;
}

/** 레지스트리 경계에서만 쓴다. 씬 파일 안에서는 defineScene<D>()로 타입을 유지한다. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySceneModule = SceneModule<any>;

export type SceneLoader = () => Promise<AnySceneModule>;

export function defineScene<D>(module: SceneModule<D>): SceneModule<D> {
  return module;
}

export interface SceneMeta {
  /** 챕터 안의 URL 슬러그. 페이지 경로는 /<챕터 id>/<씬 id>/ */
  id: string;
  title: string;
  order: number;
  /** meta description과 본문 첫 문단에 쓰인다. */
  summary: string;
  /** 프리렌더할 핵심 수식(TeX). */
  tex?: readonly string[];
  /** 먼저 보면 좋은 씬 id (같은 챕터 안). */
  prerequisites?: readonly string[];
  controls: readonly ControlSpec[];
}

export interface ChapterMeta {
  /** URL 경로이자 폴더 이름. 소문자, 숫자, 하이픈. */
  id: string;
  title: string;
  summary: string;
  scenes: readonly SceneMeta[];
}
