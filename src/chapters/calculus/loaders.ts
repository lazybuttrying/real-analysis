import type { SceneLoader } from '../../contracts';

/** Scene id → dynamic import. Scene code (including d3) is split into separate chunks at this boundary. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  diffcont: () => import('./scenes/diffCont').then((module) => module.default),
  mvt: () => import('./scenes/mvt').then((module) => module.default),
  'cauchy-mvt': () => import('./scenes/cauchyMvt').then((module) => module.default),
  lhopital: () => import('./scenes/lhopital').then((module) => module.default),
  darboux: () => import('./scenes/darboux').then((module) => module.default),
  'weierstrass-function': () => import('./scenes/weierstrassFunction').then((module) => module.default),
  taylor: () => import('./scenes/taylor').then((module) => module.default),
  'taylor-thm': () => import('./scenes/taylorThm').then((module) => module.default),
  convex: () => import('./scenes/convex').then((module) => module.default),
  riemann: () => import('./scenes/riemann').then((module) => module.default),
  'volterra-function': () => import('./scenes/volterraFunction').then((module) => module.default),
  ftc: () => import('./scenes/ftc').then((module) => module.default),
  'bounded-variation': () => import('./scenes/boundedVariation').then((module) => module.default),
  newton: () => import('./scenes/newton').then((module) => module.default),
  banach: () => import('./scenes/banach').then((module) => module.default),
  fourier: () => import('./scenes/fourier').then((module) => module.default),
  'fejer-theorem': () => import('./scenes/fejerTheorem').then((module) => module.default),
  'gibbs-phenomenon': () => import('./scenes/gibbsPhenomenon').then((module) => module.default),
  measure: () => import('./scenes/measure').then((module) => module.default),
  lebesgue: () => import('./scenes/lebesgue').then((module) => module.default),
  'absolute-continuity': () => import('./scenes/absoluteContinuity').then((module) => module.default),
};
