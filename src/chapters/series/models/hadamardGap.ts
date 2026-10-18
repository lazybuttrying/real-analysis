import type { SceneModel } from '../../../contracts';

/**
 * Hadamard gap theorem, live: S_N(z) = sum_{k=0}^{N} z^{2^k}.
 *
 * The exponents n_k = 2^k satisfy the Hadamard gap condition
 * n_{k+1} / n_k = 2 >= q > 1 (exactly 2, for every k >= 0). The power
 * series f(z) = sum_{k>=0} z^{2^k} has radius of convergence exactly 1:
 * writing f(z) = sum_{n>=0} a_n z^n with a_n = 1 at n = 2^k and 0
 * elsewhere, limsup |a_n|^{1/n} = 1 (the subsequence at n = 2^k gives 1,
 * and |a_n|^{1/n} <= 1 for all n), so 1/R = 1 by Cauchy-Hadamard.
 *
 * Hadamard's gap theorem: a power series with Hadamard gaps and radius
 * exactly 1 has every point of |z| = 1 as a singular point -- the unit
 * circle is a natural boundary. The scene plots |S_N(r e^{i theta})|
 * for r in {0.90, 0.95, 0.99}: as N grows, spikes erupt at more and more
 * angles (near dyadic rationals 2 pi m / 2^K, a dense set), suggesting
 * the blow-up becomes dense on the boundary. The dashed gray contrast
 * curve is T_N(z) = sum_{k=0}^{N} z^k/(k+1)^2 (no gaps): by the
 * Weierstrass M-test with M_k = 1/(k+1)^2 (sum pi^2/6) it converges
 * uniformly on the closed disc, hence extends continuously -- calm.
 *
 * Computation uses repeated squaring: with w_k = z^{2^k},
 * w_{k+1} = w_k^2, so each S_N costs O(N) complex multiplications.
 * N = 12 reaches z^{4096}; cheap.
 *
 * Verified numbers (tests/hadamard-gap.test.ts):
 *   gapRatio(k) = 2 exactly for k = 0..11 (n_k = 2^k by construction).
 *   lacunaryReal(0.5, 5) = 0.81642150902189314; the repeated-squaring
 *   evaluator agrees with direct summation sum 0.5^{2^k} to 1e-15 for
 *   N = 0..12, and with direct complex powers (r e^{i theta})^{2^k}
 *   via Math.pow to 1e-12 on spot checks.
 *   On the 720-point theta grid at r = 0.99, max|S_N| (attained at
 *   theta = 0) for N = 1..12:
 *     1.970100000, 2.930696010, 3.853440704, 4.704898476, 5.429878811,
 *     5.955475299, 6.231726967, 6.308041951, 6.313865927, 6.313899846,
 *     6.313899847, 6.313899847
 *   (monotone growth, saturating: the tail terms r^{2^k} -> 0).
 *   Local-maximum (spike) counts on the r = 0.99 curve for N = 1..12:
 *     1, 3, 7, 14, 28, 60, 88, 108, 106, 106, 106, 106.
 *   Contrast: max_theta |T_200(0.99 e^{i theta})| = 1.604490074
 *   (< 1.65, and < pi^2/6 = 1.644934067); max|T_12| = 1.555125142.
 */

export interface HadamardPoint {
  theta: number;
  y: number;
}

interface HadamardCurve {
  r: number;
  points: HadamardPoint[];
}

export interface HadamardData {
  n: number;
  /** |S_N(r e^{i theta})| for each radius in RADII. */
  curves: HadamardCurve[];
  /** |T_N(0.99 e^{i theta})|, the gap-free contrast curve. */
  contrast: HadamardPoint[];
  /** max over the theta grid of |S_N(0.99 e^{i theta})|. */
  maxS: number;
  /** max over the theta grid of |T_N(0.99 e^{i theta})|. */
  maxT: number;
  /** Local maxima on the r = 0.99 curve (cyclic grid). */
  spikeCount: number;
}

export const MIN_N = 1;
export const MAX_N = 12;
export const DEFAULT_N = 6;
/** Theta grid: 720 points on [0, 2 pi). */
export const GRID_POINTS = 720;
export const RADII: readonly number[] = [0.9, 0.95, 0.99];
export const CONTRAST_R = 0.99;

/** The gap exponents n_k = 2^k. */
export function gapExponent(k: number): number {
  return 2 ** k;
}

/** The gap ratio n_{k+1} / n_k: exactly 2 for every k >= 0. */
export function gapRatio(k: number): number {
  return gapExponent(k + 1) / gapExponent(k);
}

/**
 * |S_N(r e^{i theta})| with S_N(z) = sum_{k=0}^{N} z^{2^k},
 * evaluated by repeated squaring: w_0 = z, w_{k+1} = w_k^2.
 */
export function lacunaryPartialModulus(r: number, theta: number, n: number): number {
  let wr = r * Math.cos(theta);
  let wi = r * Math.sin(theta);
  let sr = 0;
  let si = 0;
  for (let k = 0; k <= n; k++) {
    sr += wr;
    si += wi;
    const nr = wr * wr - wi * wi;
    const ni = 2 * wr * wi;
    wr = nr;
    wi = ni;
  }
  return Math.hypot(sr, si);
}

/** S_N(x) for real x (used to pin the inside-the-disc behavior). */
export function lacunaryReal(x: number, n: number): number {
  let w = x;
  let s = 0;
  for (let k = 0; k <= n; k++) {
    s += w;
    w *= w;
  }
  return s;
}

/** |T_N(r e^{i theta})| with T_N(z) = sum_{k=0}^{N} z^k/(k+1)^2. */
export function contrastPartialModulus(r: number, theta: number, n: number): number {
  const zr = r * Math.cos(theta);
  const zi = r * Math.sin(theta);
  let pr = 1;
  let pi = 0;
  let sr = 0;
  let si = 0;
  for (let k = 0; k <= n; k++) {
    const d = (k + 1) * (k + 1);
    sr += pr / d;
    si += pi / d;
    const nr = pr * zr - pi * zi;
    const ni = pr * zi + pi * zr;
    pr = nr;
    pi = ni;
  }
  return Math.hypot(sr, si);
}

function thetaOf(i: number): number {
  return (2 * Math.PI * i) / GRID_POINTS;
}

/** Pure: no DOM, no d3. */
function hadamardData(n: number): HadamardData {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const curves: HadamardCurve[] = RADII.map((r) => {
    const points: HadamardPoint[] = [];
    for (let i = 0; i < GRID_POINTS; i++) {
      const theta = thetaOf(i);
      points.push({ theta, y: lacunaryPartialModulus(r, theta, nn) });
    }
    return { r, points };
  });
  const contrast: HadamardPoint[] = [];
  let maxT = 0;
  for (let i = 0; i < GRID_POINTS; i++) {
    const theta = thetaOf(i);
    const y = contrastPartialModulus(CONTRAST_R, theta, nn);
    contrast.push({ theta, y });
    if (y > maxT) maxT = y;
  }
  const top = curves[curves.length - 1];
  const vals = top ? top.points.map((p) => p.y) : [];
  let maxS = 0;
  for (const v of vals) if (v > maxS) maxS = v;
  let spikeCount = 0;
  for (let i = 0; i < vals.length; i++) {
    const prev = vals[(i - 1 + vals.length) % vals.length] ?? 0;
    const cur = vals[i] ?? 0;
    const next = vals[(i + 1) % vals.length] ?? 0;
    if (cur > prev && cur >= next) spikeCount++;
  }
  return { n: nn, curves, contrast, maxS, maxT, spikeCount };
}

export const hadamardGapModel: SceneModel<HadamardData> = {
  compute(state) {
    const raw = Number(state['N']);
    const n = Number.isFinite(raw) ? raw : DEFAULT_N;
    return hadamardData(n);
  },
};
