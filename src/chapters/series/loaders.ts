import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * this chapter’s own scenes/ directory (a legacy scene store shared with the retired wiring).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'harmonic': () => import('./scenes/harmonic').then((module) => module.default),
  'euler-mascheroni': () => import('./scenes/eulerMascheroni').then((module) => module.default),
  'basel': () => import('./scenes/basel').then((module) => module.default),
  'euler-product': () => import('./scenes/eulerProduct').then((module) => module.default),
  'leibniz': () => import('./scenes/leibniz').then((module) => module.default),
  'tests': () => import('./scenes/tests').then((module) => module.default),
  'raabe-test': () => import('./scenes/raabeTest').then((module) => module.default),
  'kummer-test': () => import('./scenes/kummerTest').then((module) => module.default),
  'condensation': () => import('./scenes/condensation').then((module) => module.default),
  'telescoping': () => import('./scenes/telescoping').then((module) => module.default),
  'geometric': () => import('./scenes/geometric').then((module) => module.default),
  'wallis': () => import('./scenes/wallis').then((module) => module.default),
  'stirling': () => import('./scenes/stirling').then((module) => module.default),
  'grandi': () => import('./scenes/grandi').then((module) => module.default),
  'dirichlet-test': () => import('./scenes/dirichletTest').then((module) => module.default),
  'abel-test': () => import('./scenes/abelTest').then((module) => module.default),
};
