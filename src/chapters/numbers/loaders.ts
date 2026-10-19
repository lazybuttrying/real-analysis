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
  'sqrt2-irrational': () => import('../limits/scenes/sqrt2Irrational').then((module) => module.default),
  'density-of-rationals': () => import('../limits/scenes/densityOfRationals').then((module) => module.default),
  'sets': () => import('../limits/scenes/sets').then((module) => module.default),
  'supremum': () => import('../limits/scenes/supremum').then((module) => module.default),
  'countable': () => import('../limits/scenes/countable').then((module) => module.default),
  'cantor-theorem': () => import('../limits/scenes/cantorTheorem').then((module) => module.default),
  'axiom-of-choice': () => import('../limits/scenes/axiomOfChoice').then((module) => module.default),
  'zorn-lemma': () => import('../limits/scenes/zornLemma').then((module) => module.default),
  'nth-root': () => import('../limits/scenes/nthRoot').then((module) => module.default),
  'groups-fields': () => import('../limits/scenes/groupsFields').then((module) => module.default),
  'vector-spaces': () => import('../limits/scenes/vectorSpaces').then((module) => module.default),
  'dimension-rank': () => import('../limits/scenes/dimensionRank').then((module) => module.default),
};
