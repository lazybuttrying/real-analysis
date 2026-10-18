import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'natural-numbers': () => import('../limits/scenes/naturalNumbers').then((module) => module.default),
  'binomial': () => import('../limits/scenes/binomial').then((module) => module.default),
  'integers-rationals': () => import('../limits/scenes/integersRationals').then((module) => module.default),
  'sets': () => import('../limits/scenes/sets').then((module) => module.default),
  'supremum': () => import('../limits/scenes/supremum').then((module) => module.default),
  'countable': () => import('../limits/scenes/countable').then((module) => module.default),
  'groups-fields': () => import('../limits/scenes/groupsFields').then((module) => module.default),
  'vector-spaces': () => import('../limits/scenes/vectorSpaces').then((module) => module.default),
  'dimension-rank': () => import('../limits/scenes/dimensionRank').then((module) => module.default),
};
