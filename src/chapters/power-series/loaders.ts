import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'power-series': () => import('../series/scenes/powerSeries').then((module) => module.default),
  'hadamard-gap': () => import('../series/scenes/hadamardGap').then((module) => module.default),
  'abel-theorem': () => import('../series/scenes/abelTheorem').then((module) => module.default),
  'tauber': () => import('../series/scenes/tauber').then((module) => module.default),
  'eseries': () => import('../series/scenes/eseries').then((module) => module.default),
  'zeta4': () => import('../series/scenes/zeta4').then((module) => module.default),
  'rearrangement': () => import('../series/scenes/rearrangement').then((module) => module.default),
  'absolute': () => import('../series/scenes/absolute').then((module) => module.default),
  'riemann-rearrangement': () => import('../series/scenes/riemannRearrangement').then((module) => module.default),
  'cauchy-product': () => import('../series/scenes/cauchyProduct').then((module) => module.default),
};
