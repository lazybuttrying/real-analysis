import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene stores (../{limits,series,calculus}/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'arzela-ascoli': () => import('../limits/scenes/arzelaAscoli').then((module) => module.default),
  'weierstrass-approx': () => import('../limits/scenes/weierstrassApprox').then((module) => module.default),
  'stone-weierstrass': () => import('../limits/scenes/stoneWeierstrass').then((module) => module.default),
  'muntz-szasz': () => import('../limits/scenes/muntzSzasz').then((module) => module.default),
};
