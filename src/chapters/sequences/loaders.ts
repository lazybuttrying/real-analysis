import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'epsilon-n': () => import('../limits/scenes/epsilonN').then((module) => module.default),
  'squeeze': () => import('../limits/scenes/squeeze').then((module) => module.default),
  'standard-limits': () => import('../limits/scenes/standardLimits').then((module) => module.default),
  'norm': () => import('../limits/scenes/norm').then((module) => module.default),
  'inner-product': () => import('../limits/scenes/innerProduct').then((module) => module.default),
  'bounded': () => import('../limits/scenes/bounded').then((module) => module.default),
  'subsequence': () => import('../limits/scenes/subsequence').then((module) => module.default),
  'sequence-spaces': () => import('../limits/scenes/sequenceSpaces').then((module) => module.default),
  'cauchy-schwarz': () => import('../limits/scenes/cauchySchwarz').then((module) => module.default),
  'holder': () => import('../limits/scenes/holder').then((module) => module.default),
  'parallelogram-law': () => import('../limits/scenes/parallelogramLaw').then((module) => module.default),
  'holes': () => import('../limits/scenes/holes').then((module) => module.default),
  'construction': () => import('../limits/scenes/construction').then((module) => module.default),
  'bolzano-weierstrass': () => import('../limits/scenes/bolzanoWeierstrass').then((module) => module.default),
  'monotone-cauchy': () => import('../limits/scenes/monotoneCauchy').then((module) => module.default),
  'limsup-liminf': () => import('../limits/scenes/limsupLiminf').then((module) => module.default),
  'stolz-cesaro': () => import('../limits/scenes/stolzCesaro').then((module) => module.default),
  'double-sequences': () => import('../limits/scenes/doubleSequences').then((module) => module.default),
};
