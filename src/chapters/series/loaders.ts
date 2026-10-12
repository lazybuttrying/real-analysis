import type { SceneLoader } from '../../contracts';

/** 씬 id → 동적 import. 씬 코드(d3, three 포함)는 이 경계에서 별도 청크로 분리된다. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  harmonic: () => import('./scenes/harmonic').then((module) => module.default),
};
