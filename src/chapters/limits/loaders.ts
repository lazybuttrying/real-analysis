import type { SceneLoader } from '../../contracts';

/** Scene id → dynamic import. Scene code (including d3) is split into separate chunks at this boundary. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'epsilon-n': () => import('./scenes/epsilonN').then((module) => module.default),
  holes: () => import('./scenes/holes').then((module) => module.default),
  'bolzano-weierstrass': () => import('./scenes/bolzanoWeierstrass').then((module) => module.default),
  cantor: () => import('./scenes/cantor').then((module) => module.default),
  ivt: () => import('./scenes/ivt').then((module) => module.default),
  uniform: () => import('./scenes/uniform').then((module) => module.default),
};
