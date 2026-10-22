import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'gamma': () => import('../series/scenes/gamma').then((module) => module.default),
  'beta-function': () => import('../series/scenes/betaFunction').then((module) => module.default),
  'bohr-mollerup': () => import('../series/scenes/bohrMollerup').then((module) => module.default),
  'improper': () => import('../series/scenes/improper').then((module) => module.default),
  'gabriel-horn': () => import('../calculus/scenes/gabrielHorn').then((module) => module.default),
  'riemann': () => import('../calculus/scenes/riemann').then((module) => module.default),
  'dirichlet-function': () => import('../calculus/scenes/dirichletFunction').then((module) => module.default),
  'volterra-function': () => import('../calculus/scenes/volterraFunction').then((module) => module.default),
  'ftc': () => import('../calculus/scenes/ftc').then((module) => module.default),
  'integration-by-parts': () => import('../calculus/scenes/integrationByParts').then((module) => module.default),
  'change-of-variables': () => import('../calculus/scenes/changeOfVariables').then((module) => module.default),
  'bounded-variation': () => import('../calculus/scenes/boundedVariation').then((module) => module.default),
  'arc-length': () => import('../calculus/scenes/arcLength').then((module) => module.default),
  'riemann-stieltjes': () => import('../calculus/scenes/riemannStieltjes').then((module) => module.default),
  'jordan-decomposition': () => import('../calculus/scenes/jordanDecomposition').then((module) => module.default),
  'measure': () => import('../calculus/scenes/measure').then((module) => module.default),
  'vitali': () => import('../calculus/scenes/vitali').then((module) => module.default),
  'borel-cantelli': () => import('../calculus/scenes/borelCantelli').then((module) => module.default),
  'lebesgue': () => import('../calculus/scenes/lebesgue').then((module) => module.default),
  'lebesgue-convergence': () => import('../calculus/scenes/lebesgueConvergence').then((module) => module.default),
  'fubini-tonelli': () => import('../calculus/scenes/fubiniTonelli').then((module) => module.default),
  'convolution': () => import('../calculus/scenes/convolution').then((module) => module.default),
  'egorov': () => import('../calculus/scenes/egorov').then((module) => module.default),
  'absolute-continuity': () => import('../calculus/scenes/absoluteContinuity').then((module) => module.default),
  'differentiation-under-integral': () => import('../calculus/scenes/differentiationUnderIntegral').then((module) => module.default),
  'minkowski': () => import('../calculus/scenes/minkowski').then((module) => module.default),
};
