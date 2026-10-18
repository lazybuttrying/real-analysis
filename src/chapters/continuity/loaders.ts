import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'epsdelta': () => import('../limits/scenes/epsdelta').then((module) => module.default),
  'continuity': () => import('../limits/scenes/continuity').then((module) => module.default),
  'monotone-discontinuities': () => import('../limits/scenes/monotoneDiscontinuities').then((module) => module.default),
  'uniform-continuity': () => import('../limits/scenes/uniformContinuity').then((module) => module.default),
  'ivt': () => import('../limits/scenes/ivt').then((module) => module.default),
  'evt': () => import('../limits/scenes/evt').then((module) => module.default),
  'uniform': () => import('../limits/scenes/uniform').then((module) => module.default),
};
