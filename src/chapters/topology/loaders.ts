import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'opensets': () => import('../limits/scenes/opensets').then((module) => module.default),
  'closure': () => import('../limits/scenes/closure').then((module) => module.default),
  'compact': () => import('../limits/scenes/compact').then((module) => module.default),
  'metric-spaces': () => import('../limits/scenes/metricSpaces').then((module) => module.default),
  'contraction': () => import('../limits/scenes/contraction').then((module) => module.default),
  'baire-category': () => import('../limits/scenes/baireCategory').then((module) => module.default),
  'baire-1': () => import('../limits/scenes/baireOne').then((module) => module.default),
  'cantor': () => import('../limits/scenes/cantor').then((module) => module.default),
  'fat-cantor': () => import('../limits/scenes/fatCantor').then((module) => module.default),
  'cantor-function': () => import('../limits/scenes/cantorFunction').then((module) => module.default),
};
