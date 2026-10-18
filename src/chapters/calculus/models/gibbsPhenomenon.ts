import type { SceneModel } from '../../../contracts';

/**
 * The Wilbraham–Gibbs constant, derived analytically.
 *
 * The square-wave partial sums S_N(x) = (4/pi) * sum_{k=1}^{N} sin((2k-1)x)/(2k-1)
 * satisfy the closed-form derivative identity
 *   S_N'(x) = (4/pi) * sum_{k=1}^{N} cos((2k-1)x) = (2/pi) * sin(2Nx)/sin(x)
 * (sum the geometric series of e^{i(2k-1)x}), so the first peak sits at
 * x_1 = pi/(2N). Integrating and rescaling t = 2Nx gives, in the limit,
 *   S_N(x) -> (2/pi) * Si(2Nx),   Si(t) = integral_0^t sin(u)/u du,
 * hence the peak height tends to (2/pi)*Si(pi). Si is strictly increasing on
 * (0, pi) and its alternating tail past pi stays negative, so Si(pi) is the
 * global maximum.
 *
 * The one honest analysis step is passing N -> infinity under the integral
 * (dominated convergence); everything else is algebra. The companion Fourier
 * scene (../fourier/) observes the same number numerically.
 *
 * Verified identities (tests/gibbs-phenomenon.test.ts):
 *   si(pi) = 1.85193705182 (1e-9),
 *   (2/pi)*si(pi) = 1.178979744472167... matches fourier.ts GIBBS_PEAK (1e-9),
 *   overshoot fraction ((2/pi)*Si(pi) - 1)/2 = 0.08948987 (1e-8),
 *   measured peak at N = 50 within 0.005 of the theoretical peak,
 *   numeric derivative of the partial sum matches (2/pi)*sin(2Nx)/sin(x)
 *   at x = 0.1, N = 8 (1e-6).
 *
 * Pure computation: no DOM, d3, or three.
 */

/** sin(u)/u with the removable singularity at 0 filled in. */
function sinc(u: number): number {
  return u === 0 ? 1 : Math.sin(u) / u;
}

/** Rescaled axis bound: t = 2Nx ranges over [0, 4*pi]. */
const T_MAX = 4 * Math.PI;

/**
 * Cumulative Si table on the even nodes of a fine grid (16384 even nodes,
 * composite Simpson). Si(t) is recovered by cubic Hermite interpolation,
 * accurate far beyond 1e-9. Built once at module load.
 */
const SI_EVEN_N = 16384;
const SI_H = T_MAX / (2 * SI_EVEN_N);
const siEvenTable: Float64Array = (() => {
  const table = new Float64Array(SI_EVEN_N + 1);
  let acc = 0;
  for (let m = 1; m <= SI_EVEN_N; m++) {
    const i = 2 * m;
    acc += (SI_H / 3) * (sinc((i - 2) * SI_H) + 4 * sinc((i - 1) * SI_H) + sinc(i * SI_H));
    table[m] = acc;
  }
  return table;
})();

/**
 * Si(t) = integral_0^t sin(u)/u du, for t in [0, 4*pi] (clamped).
 * Pure and fast: one Simpson table plus Hermite interpolation.
 */
export function si(t: number): number {
  if (!(t > 0)) return 0;
  const tt = Math.min(t, T_MAX);
  const s = tt / (2 * SI_H);
  const m = Math.floor(s);
  const frac = s - m;
  const y0 = siEvenTable[m] ?? 0;
  if (frac === 0) return y0;
  const m1 = Math.min(m + 1, SI_EVEN_N);
  const y1 = siEvenTable[m1] ?? y0;
  const h2 = 2 * SI_H;
  const d0 = h2 * sinc(2 * m * SI_H);
  const d1 = h2 * sinc(2 * m1 * SI_H);
  const f2 = frac * frac;
  const f3 = f2 * frac;
  return (
    (2 * f3 - 3 * f2 + 1) * y0 +
    (f3 - 2 * f2 + frac) * d0 +
    (-2 * f3 + 3 * f2) * y1 +
    (f3 - f2) * d1
  );
}

/**
 * The square-wave partial sum S_N(x), reimplemented locally (the calculus
 * chapter's fourier.ts model has its own copy; models never import across
 * chapter-internal model files).
 */
export function fourierPartialSum(x: number, n: number): number {
  let sum = 0;
  for (let k = 1; k <= n; k++) {
    const odd = 2 * k - 1;
    sum += Math.sin(odd * x) / odd;
  }
  return (4 / Math.PI) * sum;
}

export interface GibbsPoint {
  /** Rescaled coordinate t = 2Nx in [0, 4*pi]. */
  t: number;
  /** S_N(t/(2N)): the partial sum on the rescaled axis. */
  sN: number;
  /** (2/pi)*Si(t): the N-independent limit curve. */
  siLimit: number;
}

export interface GibbsData {
  n: number;
  points: GibbsPoint[];
  /** Max of S_N on a fine grid near t = pi (the first peak). */
  measuredPeak: number;
  /** The t where the measured peak was found. */
  measuredPeakT: number;
  /** (2/pi)*Si(pi): the theoretical limiting peak. */
  theoreticalPeak: number;
  /** Overshoot as a percentage of the jump (jump = 2). */
  overshootPct: number;
}

export const MIN_N = 2;
export const MAX_N = 60;
export const DEFAULT_N = 12;

/** Si(pi) = integral_0^pi sin(u)/u du. */
export const SI_PI = 1.85193705182;

/**
 * The Gibbs constant (2/pi)*Si(pi): the limiting height of the first peak.
 * Identical to the numerically observed GIBBS_PEAK in the Fourier scene's
 * model — that is the point of this scene.
 */
export const GIBBS_PEAK_THEORY = 1.178979744472167;

/** ((2/pi)*Si(pi) - 1)/2: overshoot as a fraction of the jump (jump = 2). */
export const OVERSHOOT_FRACTION = (GIBBS_PEAK_THEORY - 1) / 2;

export function gibbsData(n: number): GibbsData {
  const nn = Math.max(MIN_N, Math.min(MAX_N, Math.round(n)));
  const m = 480;
  const points: GibbsPoint[] = [];
  for (let i = 0; i <= m; i++) {
    const t = (T_MAX * i) / m;
    points.push({ t, sN: fourierPartialSum(t / (2 * nn), nn), siLimit: (2 / Math.PI) * si(t) });
  }
  // Measured first peak: fine scan of S_N in the window |t - pi| <= 1.
  let measuredPeak = -Infinity;
  let measuredPeakT = Math.PI;
  const g = 4000;
  for (let i = 1; i <= g; i++) {
    const t = (T_MAX * i) / g;
    if (t < Math.PI - 1 || t > Math.PI + 1) continue;
    const v = fourierPartialSum(t / (2 * nn), nn);
    if (v > measuredPeak) {
      measuredPeak = v;
      measuredPeakT = t;
    }
  }
  return {
    n: nn,
    points,
    measuredPeak,
    measuredPeakT,
    theoreticalPeak: GIBBS_PEAK_THEORY,
    overshootPct: OVERSHOOT_FRACTION * 100,
  };
}

export const gibbsModel: SceneModel<GibbsData> = {
  compute(state) {
    const raw = Number(state['N']);
    const n = Number.isFinite(raw) ? raw : DEFAULT_N;
    return gibbsData(n);
  },
};
