import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'm-test': () => import('../series/scenes/mTest').then((module) => module.default),
  'dini': () => import('../series/scenes/dini').then((module) => module.default),
  'fourier': () => import('../calculus/scenes/fourier').then((module) => module.default),
  'fejer-theorem': () => import('../calculus/scenes/fejerTheorem').then((module) => module.default),
  'gibbs-phenomenon': () => import('../calculus/scenes/gibbsPhenomenon').then((module) => module.default),
};
