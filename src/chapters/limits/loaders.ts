import type { SceneLoader } from '../../contracts';

/** Scene id → dynamic import. Scene code (including d3) is split into separate chunks at this boundary. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  sets: () => import('./scenes/sets').then((module) => module.default),
  supremum: () => import('./scenes/supremum').then((module) => module.default),
  countable: () => import('./scenes/countable').then((module) => module.default),
  'groups-fields': () => import('./scenes/groupsFields').then((module) => module.default),
  'vector-spaces': () => import('./scenes/vectorSpaces').then((module) => module.default),
  'dimension-rank': () => import('./scenes/dimensionRank').then((module) => module.default),
  'epsilon-n': () => import('./scenes/epsilonN').then((module) => module.default),
  epsdelta: () => import('./scenes/epsdelta').then((module) => module.default),
  continuity: () => import('./scenes/continuity').then((module) => module.default),
  'uniform-continuity': () => import('./scenes/uniformContinuity').then((module) => module.default),
  opensets: () => import('./scenes/opensets').then((module) => module.default),
  closure: () => import('./scenes/closure').then((module) => module.default),
  'metric-spaces': () => import('./scenes/metricSpaces').then((module) => module.default),
  'sequence-spaces': () => import('./scenes/sequenceSpaces').then((module) => module.default),
  holes: () => import('./scenes/holes').then((module) => module.default),
  construction: () => import('./scenes/construction').then((module) => module.default),
  'bolzano-weierstrass': () => import('./scenes/bolzanoWeierstrass').then((module) => module.default),
  'monotone-cauchy': () => import('./scenes/monotoneCauchy').then((module) => module.default),
  cantor: () => import('./scenes/cantor').then((module) => module.default),
  ivt: () => import('./scenes/ivt').then((module) => module.default),
  evt: () => import('./scenes/evt').then((module) => module.default),
  uniform: () => import('./scenes/uniform').then((module) => module.default),
};
