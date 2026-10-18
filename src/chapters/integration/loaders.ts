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
  'riemann': () => import('../calculus/scenes/riemann').then((module) => module.default),
  'volterra-function': () => import('../calculus/scenes/volterraFunction').then((module) => module.default),
  'ftc': () => import('../calculus/scenes/ftc').then((module) => module.default),
  'integration-by-parts': () => import('../calculus/scenes/integrationByParts').then((module) => module.default),
  'change-of-variables': () => import('../calculus/scenes/changeOfVariables').then((module) => module.default),
  'bounded-variation': () => import('../calculus/scenes/boundedVariation').then((module) => module.default),
  'jordan-decomposition': () => import('../calculus/scenes/jordanDecomposition').then((module) => module.default),
  'measure': () => import('../calculus/scenes/measure').then((module) => module.default),
  'lebesgue': () => import('../calculus/scenes/lebesgue').then((module) => module.default),
  'absolute-continuity': () => import('../calculus/scenes/absoluteContinuity').then((module) => module.default),
};
