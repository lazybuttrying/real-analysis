import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'diffcont': () => import('../calculus/scenes/diffCont').then((module) => module.default),
  'discontinuous-derivative': () => import('../calculus/scenes/discontinuousDerivative').then((module) => module.default),
  'mvt': () => import('../calculus/scenes/mvt').then((module) => module.default),
  'derivative-monotonicity': () => import('../calculus/scenes/derivativeMonotonicity').then((module) => module.default),
  'inverse-function-theorem': () => import('../calculus/scenes/inverseFunctionTheorem').then((module) => module.default),
  'cauchy-mvt': () => import('../calculus/scenes/cauchyMvt').then((module) => module.default),
  'lhopital': () => import('../calculus/scenes/lhopital').then((module) => module.default),
  'darboux': () => import('../calculus/scenes/darboux').then((module) => module.default),
  'weierstrass-function': () => import('../calculus/scenes/weierstrassFunction').then((module) => module.default),
  'taylor': () => import('../calculus/scenes/taylor').then((module) => module.default),
  'taylor-thm': () => import('../calculus/scenes/taylorThm').then((module) => module.default),
  'convex': () => import('../calculus/scenes/convex').then((module) => module.default),
  'newton': () => import('../calculus/scenes/newton').then((module) => module.default),
  'banach': () => import('../calculus/scenes/banach').then((module) => module.default),
};
