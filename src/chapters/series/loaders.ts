import type { SceneLoader } from '../../contracts';

/** Scene id → dynamic import. Scene code (including d3 and three) is split into separate chunks at this boundary. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  harmonic: () => import('./scenes/harmonic').then((module) => module.default),
  basel: () => import('./scenes/basel').then((module) => module.default),
  leibniz: () => import('./scenes/leibniz').then((module) => module.default),
  tests: () => import('./scenes/tests').then((module) => module.default),
  'power-series': () => import('./scenes/powerSeries').then((module) => module.default),
  eseries: () => import('./scenes/eseries').then((module) => module.default),
  telescoping: () => import('./scenes/telescoping').then((module) => module.default),
  geometric: () => import('./scenes/geometric').then((module) => module.default),
  wallis: () => import('./scenes/wallis').then((module) => module.default),
  stirling: () => import('./scenes/stirling').then((module) => module.default),
  gamma: () => import('./scenes/gamma').then((module) => module.default),
  grandi: () => import('./scenes/grandi').then((module) => module.default),
  zeta4: () => import('./scenes/zeta4').then((module) => module.default),
  rearrangement: () => import('./scenes/rearrangement').then((module) => module.default),
  absolute: () => import('./scenes/absolute').then((module) => module.default),
  improper: () => import('./scenes/improper').then((module) => module.default),
};
