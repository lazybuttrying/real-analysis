import type { SceneModel } from '../../../contracts';

/**
 * Jordan decomposition, live. The function
 *   f(x) = x^2 sin(1/x) for x > 0, f(0) = 0,
 * on [0,1] is of bounded variation, and the scene draws the canonical
 * decomposition f = g - h with g the (grid) variation function and h = g - f.
 *
 * Why this f: f'(x) = 2x sin(1/x) - cos(1/x) is bounded on (0,1], so
 *   int_0^1 |f'| <= int_0^1 2x dx + int_0^1 |cos(1/x)| dx <= 1 + 1 = 2 < infinity,
 * (the second integral is int_1^infinity |cos u|/u^2 du <= int_1^infinity du/u^2 = 1
 * under u = 1/x). Hence f is absolutely continuous, hence BV — yet sin(1/x)
 * oscillates infinitely often near 0, so the decomposition is non-trivial:
 * g accumulates variation forever as x -> 0+.
 *
 * The honest approximation: the true variation function V_0^x(f) is a
 * supremum over ALL partitions, which no machine can compute. We compute the
 * variation over the uniform 2001-point grid instead — a lower bound of the
 * true variation. The grid is too coarse to catch the near-zero
 * micro-oscillations (period 2 pi x^2 << 5e-4 there), so the grid g(1)
 * understates the true total variation. Crucially, the algebra f = g - h and
 * the monotonicity of BOTH g and h hold EXACTLY on the grid, for any grid:
 * with G_k = sum_{j<=k} |f(x_j) - f(x_{j-1})|, G is nondecreasing, and
 *   H_k - H_{k-1} = |Delta f| - Delta f >= 0.
 * The scene labels g as grid variation in a strip note.
 *
 * Verified identities (tests/jordan-decomposition.test.ts):
 *   g is nondecreasing on the 2001-point grid (tol 1e-12);
 *   h = g - f is nondecreasing on the grid (tol 1e-12);
 *   f = g - h pointwise to 1e-12 on the grid;
 *   grid g(1) = 1.0340625694793135 >= |f(1) - f(0)| = sin(1);
 *   f(1) = sin(1) = 0.8414709848078965 (closed form);
 *   model clamps X0 to [0, 1]; default X0 = 0.7.
 */

export interface JordanSample {
  x: number;
  y: number;
}

export interface JordanData {
  /** Probe point, clamped to [0, 1]. */
  x0: number;
  f: JordanSample[];
  /** Grid variation of f on [0, x_i] — nondecreasing, a lower bound of V_0^{x_i}(f). */
  g: JordanSample[];
  /** h = g - f, nondecreasing on the grid. */
  h: JordanSample[];
  /** Grid variation on the whole [0, 1], i.e. g(1). */
  V: number;
}

const MIN_X0 = 0;
const MAX_X0 = 1;
export const DEFAULT_X0 = 0.7;
/** Uniform grid points on [0, 1]. */
export const GRID_POINTS = 2001;

/** f(x) = x^2 sin(1/x) for x > 0, f(0) = 0. */
export function jordanF(x: number): number {
  return x === 0 ? 0 : x * x * Math.sin(1 / x);
}

/** Pure: no DOM, no d3. */
export function jordanData(x0: number): JordanData {
  const clamped = Math.min(MAX_X0, Math.max(MIN_X0, x0));
  const f: JordanSample[] = [];
  const g: JordanSample[] = [];
  const h: JordanSample[] = [];
  let running = 0;
  let prev = jordanF(0);
  for (let i = 0; i < GRID_POINTS; i++) {
    const x = i / (GRID_POINTS - 1);
    const fv = jordanF(x);
    if (i > 0) running += Math.abs(fv - prev);
    prev = fv;
    f.push({ x, y: fv });
    g.push({ x, y: running });
    h.push({ x, y: running - fv });
  }
  return { x0: clamped, f, g, h, V: running };
}

export const jordanDecompositionModel: SceneModel<JordanData> = {
  compute(state) {
    const raw = Number(state['X0']);
    const x0 = Number.isFinite(raw) ? raw : DEFAULT_X0;
    return jordanData(x0);
  },
};
