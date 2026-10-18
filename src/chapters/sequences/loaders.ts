import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'epsilon-n': () => import('../limits/scenes/epsilonN').then((module) => module.default),
  'sequence-spaces': () => import('../limits/scenes/sequenceSpaces').then((module) => module.default),
  'cauchy-schwarz': () => import('../limits/scenes/cauchySchwarz').then((module) => module.default),
  'holes': () => import('../limits/scenes/holes').then((module) => module.default),
  'construction': () => import('../limits/scenes/construction').then((module) => module.default),
  'bolzano-weierstrass': () => import('../limits/scenes/bolzanoWeierstrass').then((module) => module.default),
  'monotone-cauchy': () => import('../limits/scenes/monotoneCauchy').then((module) => module.default),
  'limsup-liminf': () => import('../limits/scenes/limsupLiminf').then((module) => module.default),
  'stolz-cesaro': () => import('../limits/scenes/stolzCesaro').then((module) => module.default),
};
