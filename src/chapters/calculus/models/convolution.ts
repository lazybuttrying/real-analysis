import type { SceneModel } from '../../../contracts';

/**
 * Convolution, live: (f * g)(x) = int f(t) g(x - t) dt, in two modes.
 *
 * Mode 'tent': f = g = 1_[0,1]. As a function of t, the flipped factor
 * g(x - t) is 1 exactly on [x - 1, x], so the product f(t) g(x - t) is 1
 * exactly on the overlap [0,1] cap [x-1, x] = [max(0, x-1), min(1, x)]
 * and 0 elsewhere. Hence (f * g)(x) is the overlap length:
 *   0 for x outside [0, 2], x on [0, 1], 2 - x on [1, 2]
 * -- the tent function. The trace uses this exact formula on a grid of
 * step 0.005; overlapLength computes the same value from the interval
 * endpoints, and the tests assert the two agree to 1e-9.
 *
 * Mode 'smooth': f is the step function 1_{t >= 0} and the kernel is the
 * tent phi(t) = max(0, 1 - |t|) on [-1, 1], rescaled to
 * phi_eps(t) = (1/eps) phi(t/eps), supported on [-eps, eps]. The
 * integral of phi is the area of a triangle of base 2 and height 1,
 * exactly 1, so phi_eps is an approximate identity. Substituting
 * u = x - t in int_0^infty phi_eps(x - t) dt gives
 *   (f * phi_eps)(x) = int_{-inf}^{x} phi_eps(u) du,
 * the CDF of phi_eps at x. With v = x / eps that CDF is
 *   0 for v <= -1, (v + 1)^2 / 2 for -1 <= v <= 0,
 *   1 - (1 - v)^2 / 2 for 0 <= v <= 1, 1 for v >= 1.
 * The model exposes both this closed form and a fine trapezoid
 * evaluation of the defining product integral (step at most 0.001);
 * the tests assert they agree to 1e-3, and the scene displays the
 * trapezoid value. As eps shrinks, (f * phi_eps)(x) tends to f(x) at
 * every continuity point x != 0 of the step.
 * Pure computation: no DOM, d3, or three.
 */

export interface ConvolutionSample {
  readonly x: number;
  readonly y: number;
}

export const CONVOLUTION_MODE_INIT = 'tent';
export const CONVOLUTION_MODES: readonly string[] = ['tent', 'smooth'];

export const CONVOLUTION_X_MIN = -0.5;
export const CONVOLUTION_X_MAX = 2.5;
export const CONVOLUTION_X_INIT = 0.7;

export const CONVOLUTION_EPS_MIN = 0.05;
export const CONVOLUTION_EPS_MAX = 1;
export const CONVOLUTION_EPS_INIT = 0.3;

/** Grid step for both traces. */
export const CONVOLUTION_GRID_STEP = 0.005;

/** The indicator of [0, 1] (endpoint conventions are measure-zero). */
export function indicator01(t: number): number {
  return t >= 0 && t <= 1 ? 1 : 0;
}

/** The step function of smooth mode: 0 for t < 0, 1 for t >= 0. */
export function stepFunction(t: number): number {
  return t >= 0 ? 1 : 0;
}

/**
 * The overlap interval [0,1] cap [x-1, x], as endpoints
 * [max(0, x-1), min(1, x)]. When hi < lo the overlap is empty.
 */
export function overlapInterval(x: number): readonly [number, number] {
  return [Math.max(0, x - 1), Math.min(1, x)];
}

/** Length of the overlap interval: the numeric (f * g)(x) in tent mode. */
export function overlapLength(x: number): number {
  const [lo, hi] = overlapInterval(x);
  return Math.max(0, hi - lo);
}

/** Exact tent value: 0 outside [0, 2], x on [0, 1], 2 - x on [1, 2]. */
export function tentConvolution(x: number): number {
  if (x <= 0 || x >= 2) return 0;
  return x <= 1 ? x : 2 - x;
}

/** Tent kernel phi(t) = max(0, 1 - |t|), supported on [-1, 1]. */
export function tentKernel(t: number): number {
  return Math.max(0, 1 - Math.abs(t));
}

/** Rescaled kernel phi_eps(t) = (1/eps) phi(t/eps), supported on [-eps, eps]. */
export function phiEps(t: number, eps: number): number {
  return (1 / eps) * tentKernel(t / eps);
}

/** The tent-kernel CDF at v: int_{-inf}^{v} phi(u) du. */
export function tentCdf(v: number): number {
  if (v <= -1) return 0;
  if (v <= 0) return ((v + 1) * (v + 1)) / 2;
  if (v <= 1) return 1 - ((1 - v) * (1 - v)) / 2;
  return 1;
}

/** Closed form of (f * phi_eps)(x) for the step f: tentCdf(x / eps). */
export function smoothConvolutionClosed(x: number, eps: number): number {
  return tentCdf(x / eps);
}

/**
 * Trapezoid evaluation of the defining integral
 * int f(t) phi_eps(x - t) dt on a grid of step at most 0.001.
 * The integrand is nonzero only for t in [max(0, x - eps), x + eps],
 * so the integration is restricted to that interval.
 */
export function smoothConvolutionNumeric(x: number, eps: number): number {
  const lo = Math.max(0, x - eps);
  const hi = x + eps;
  if (hi <= lo) return 0;
  const n = Math.max(1, Math.ceil((hi - lo) / 0.001));
  const h = (hi - lo) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const t = lo + i * h;
    const w = i === 0 || i === n ? 0.5 : 1;
    sum += w * stepFunction(t) * phiEps(x - t, eps);
  }
  return sum * h;
}

/**
 * Trapezoid integral of the unscaled tent kernel phi over [-1, 1]
 * (step 0.001, breakpoints -1, 0, 1 on the grid, so this is exact).
 * The value is 1: phi is an approximate-identity kernel.
 */
export function tentKernelIntegralNumeric(): number {
  const n = 2000;
  const h = 2 / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const t = -1 + i * h;
    const w = i === 0 || i === n ? 0.5 : 1;
    sum += w * tentKernel(t);
  }
  return sum * h;
}

function trace(lo: number, hi: number, fn: (s: number) => number): ConvolutionSample[] {
  const out: ConvolutionSample[] = [];
  const n = Math.round((hi - lo) / CONVOLUTION_GRID_STEP);
  for (let i = 0; i <= n; i++) {
    const s = lo + i * CONVOLUTION_GRID_STEP;
    out.push({ x: s, y: fn(s) });
  }
  return out;
}

export interface ConvolutionData {
  readonly mode: string;
  readonly x: number;
  readonly eps: number;
  /** The displayed (f * g)(x): overlap length in tent mode, trapezoid value in smooth mode. */
  readonly value: number;
  /** The exact value: tent formula in tent mode, tent-CDF closed form in smooth mode. */
  readonly exactValue: number;
  /** The numeric value: overlap length in tent mode, trapezoid integral in smooth mode. */
  readonly numericValue: number;
  /** Overlap interval endpoints (tent mode; still computed in smooth mode). */
  readonly overlapLo: number;
  readonly overlapHi: number;
  /** Exact tent trace (f * g)(s) for s in [-0.5, 2.5], step 0.005. */
  readonly tentTrace: readonly ConvolutionSample[];
  /** Smoothed step (f * phi_eps)(s) for s in [-1, 2] via the closed form, step 0.005. */
  readonly smoothTrace: readonly ConvolutionSample[];
}

function clampX(x: number): number {
  if (!Number.isFinite(x)) return CONVOLUTION_X_INIT;
  return Math.max(CONVOLUTION_X_MIN, Math.min(CONVOLUTION_X_MAX, x));
}

function clampEps(eps: number): number {
  if (!Number.isFinite(eps)) return CONVOLUTION_EPS_INIT;
  return Math.max(CONVOLUTION_EPS_MIN, Math.min(CONVOLUTION_EPS_MAX, eps));
}

export function convolutionData(modeRaw: string, xRaw: number, epsRaw: number): ConvolutionData {
  const mode = CONVOLUTION_MODES.includes(modeRaw) ? modeRaw : CONVOLUTION_MODE_INIT;
  const x = clampX(xRaw);
  const eps = clampEps(epsRaw);
  const [overlapLo, overlapHi] = overlapInterval(x);
  const tentExact = tentConvolution(x);
  const tentNumeric = overlapLength(x);
  const smoothExact = smoothConvolutionClosed(x, eps);
  const smoothNumeric = smoothConvolutionNumeric(x, eps);
  const isTent = mode === 'tent';
  return {
    mode,
    x,
    eps,
    value: isTent ? tentNumeric : smoothNumeric,
    exactValue: isTent ? tentExact : smoothExact,
    numericValue: isTent ? tentNumeric : smoothNumeric,
    overlapLo,
    overlapHi,
    tentTrace: trace(CONVOLUTION_X_MIN, CONVOLUTION_X_MAX, tentConvolution),
    smoothTrace: trace(-1, 2, (s) => smoothConvolutionClosed(s, eps)),
  };
}

export const convolutionModel: SceneModel<ConvolutionData> = {
  compute(state) {
    const raw = state['mode'];
    const mode = typeof raw === 'string' ? raw : CONVOLUTION_MODE_INIT;
    return convolutionData(mode, Number(state['x']), Number(state['eps']));
  },
};
