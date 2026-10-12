import type { SceneLoader } from '../../contracts';

/** Scene id → dynamic import. Scene code (including d3 and three) is split into separate chunks at this boundary. */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  harmonic: () => import('./scenes/harmonic').then((module) => module.default),
};
