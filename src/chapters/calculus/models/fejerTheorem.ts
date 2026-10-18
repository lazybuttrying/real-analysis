import type { SceneModel } from '../../../contracts';

/**
 * Fejer's theorem, live: the Cesaro means of the Fourier partial sums of the
 * 2pi-periodic triangle wave f(x) = 1 - |x|/pi on [-pi, pi].
 *
 * Fourier coefficients (f even, continuous):
 *   f(x) = 1/2 + sum_{k>=1} a_k cos(kx),
 *   a_k = (1/pi) int_{-pi}^{pi} f(t) cos(kt) dt
 *       = (2/pi) int_0^{pi} (1 - t/pi) cos(kt) dt
 *       = (2/(pi^2 k^2))(1 - (-1)^k),
 * so a_k = 4/(pi^2 k^2) for odd k and 0 for even k. Derivation: the int_0^pi
 * cos(kt) part vanishes; int_0^pi t cos(kt) dt = ((cos(k pi)) - 1)/k^2.
 *
 * S_N(x) = 1/2 + sum_{k=1}^{N} a_k cos(kx) (only odd k survive).
 * sigma_N(x) = (S_0 + ... + S_{N-1})/N
 *            = 1/2 + sum_{1<=k<N} a_k (1 - k/N) cos(kx)   (exact identity:
 *              a_k cos(kx) appears in S_j for j >= k, i.e. N - k of the N terms).
 * Also sigma_N(f) = (f * K_N)/(2pi) with the Fejer kernel
 *   K_N(t) = (1/N)(sin(Nt/2)/sin(t/2))^2 (t != 0 mod 2pi), K_N(0) = N,
 * and K_N >= 0, (1/2pi) int_{-pi}^{pi} K_N = 1.
 *
 * Verified identities (tests/fejer-theorem.test.ts):
 *   triCoeff(k) matches Simpson integration of (1/pi) int f(t) cos(kt) dt to
 *   1e-9 for k = 1..10; triCoeff(even k) = 0 exactly.
 *   fejerKernel(n, t) >= 0 on a 1001-point grid for n = 1, 8, 40;
 *   Simpson int_{-pi}^{pi} K_N = 2pi to 4e-15 (tol 1e-6 in tests).
 *   The model's damped-coefficient sigma_N equals the literal Cesaro average
 *   (S_0+...+S_{N-1})/N to 1e-15 on the grid, and equals the convolution
 *   (f * K_N)/(2pi) (Simpson, 4000 intervals) to 2e-10.
 *   N = 8: sup|S_8 - f| = 0.0252011218, sup|sigma_8 - f| = 0.1101179234.
 *   Note the honest direction: on this smooth f, S_N wins the sup-norm race
 *   (its coefficients are absolutely summable, so S_N converges uniformly
 *   and fast); the Cesaro means converge uniformly too but more slowly —
 *   their virtue is smoothness (no wiggles) and Fejer's theorem, which holds
 *   for every continuous f, even where S_N misbehaves.
 *   sup|sigma_N - f| decreases: 0.1101179234 (N=8) -> 0.0638615489 (N=16)
 *   -> 0.0363232411 (N=32).
 */

export interface FejerSample {
  x: number;
  y: number;
}

export interface FejerData {
  n: number;
  f: FejerSample[];
  sN: FejerSample[];
  sigmaN: FejerSample[];
  /** sup|S_N - f| on the grid. */
  supErrS: number;
  /** sup|sigma_N - f| on the grid. */
  supErrSigma: number;
  /** The Fejer kernel K_N sampled on [-pi, pi]. */
  kernel: FejerSample[];
}

export const MIN_N = 1;
export const MAX_N = 40;
export const DEFAULT_N = 8;
/** Samples on [-pi, pi]: 1441 points, well above the 720-point minimum. */
export const GRID_POINTS = 1441;

/** The 2pi-periodic triangle wave, on [-pi, pi]: f(x) = 1 - |x|/pi. */
export function triWave(x: number): number {
  return 1 - Math.abs(x) / Math.PI;
}

/**
 * Fourier cosine coefficient a_k = (1/pi) int_{-pi}^{pi} f(t) cos(kt) dt.
 * Closed form: 4/(pi^2 k^2) for odd k, 0 for even k.
 */
export function triCoeff(k: number): number {
  if (k < 1 || !Number.isInteger(k)) return 0;
  if (k % 2 === 0) return 0;
  return 4 / (Math.PI * Math.PI * k * k);
}

/**
 * Fejer kernel K_N(t) = (1/N)(sin(Nt/2)/sin(t/2))^2, with K_N(0) = N
 * (continuous extension; the limit of the quotient as t -> 0 is N).
 */
export function fejerKernel(n: number, t: number): number {
  const s = Math.sin(t / 2);
  if (Math.abs(s) < 1e-13) return n;
  const r = Math.sin((n * t) / 2) / s;
  return (r * r) / n;
}

/** The N-th Fourier partial sum S_N(x). S_0 = 1/2. */
export function fourierPartialSum(x: number, n: number): number {
  let sum = 0.5;
  for (let k = 1; k <= n; k++) {
    const a = triCoeff(k);
    if (a !== 0) sum += a * Math.cos(k * x);
  }
  return sum;
}

/**
 * The N-th Cesaro mean sigma_N(x) = (S_0 + ... + S_{N-1})/N, computed via
 * the equivalent damped-coefficient form (exact, O(N) per point).
 */
export function cesaroMean(x: number, n: number): number {
  let sum = 0.5;
  for (let k = 1; k < n; k++) {
    const a = triCoeff(k);
    if (a !== 0) sum += a * (1 - k / n) * Math.cos(k * x);
  }
  return sum;
}

/** Pure: no DOM, no d3. */
export function fejerData(n: number): FejerData {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const f: FejerSample[] = [];
  const sN: FejerSample[] = [];
  const sigmaN: FejerSample[] = [];
  const kernel: FejerSample[] = [];
  let supErrS = 0;
  let supErrSigma = 0;
  for (let i = 0; i < GRID_POINTS; i++) {
    const x = -Math.PI + ((2 * Math.PI) * i) / (GRID_POINTS - 1);
    const fv = triWave(x);
    const sv = fourierPartialSum(x, nn);
    const cv = cesaroMean(x, nn);
    f.push({ x, y: fv });
    sN.push({ x, y: sv });
    sigmaN.push({ x, y: cv });
    kernel.push({ x, y: fejerKernel(nn, x) });
    const eS = Math.abs(sv - fv);
    const eC = Math.abs(cv - fv);
    if (eS > supErrS) supErrS = eS;
    if (eC > supErrSigma) supErrSigma = eC;
  }
  return { n: nn, f, sN, sigmaN, supErrS, supErrSigma, kernel };
}

export const fejerModel: SceneModel<FejerData> = {
  compute(state) {
    const raw = Number(state['N']);
    const n = Number.isFinite(raw) ? raw : DEFAULT_N;
    return fejerData(n);
  },
};
