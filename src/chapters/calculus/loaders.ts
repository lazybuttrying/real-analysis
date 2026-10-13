import type { SceneLoader } from '../../contracts';

/** Scene id → dynamic import. Scene code (including d3) is split into separate chunks at this boundary. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  diffcont: () => import('./scenes/diffCont').then((module) => module.default),
  mvt: () => import('./scenes/mvt').then((module) => module.default),
  'cauchy-mvt': () => import('./scenes/cauchyMvt').then((module) => module.default),
  taylor: () => import('./scenes/taylor').then((module) => module.default),
  'taylor-thm': () => import('./scenes/taylorThm').then((module) => module.default),
  riemann: () => import('./scenes/riemann').then((module) => module.default),
  ftc: () => import('./scenes/ftc').then((module) => module.default),
  newton: () => import('./scenes/newton').then((module) => module.default),
  banach: () => import('./scenes/banach').then((module) => module.default),
  fourier: () => import('./scenes/fourier').then((module) => module.default),
  lebesgue: () => import('./scenes/lebesgue').then((module) => module.default),
};
