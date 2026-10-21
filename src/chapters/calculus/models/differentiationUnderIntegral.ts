import type { SceneModel } from '../../../contracts';

/**
 * Differentiation under the integral sign, live: F(x) = integral_0^1 t^x dt.
 *
 * Direct computation gives F(x) = 1/(x+1) and F'(x) = -1/(x+1)^2, while
 * differentiating under the integral sign gives F'(x) = integral_0^1 t^x ln t dt.
 * The scene compares three numerical estimates against the analytic values:
 *   numF  = Simpson quadrature of t^x            (-> F(x)),
 *   numG  = Simpson quadrature of t^x ln t        (-> F'(x), the under-integral derivative),
 *   numFp = central difference of numF           (-> F'(x), numerical differentiation).
 * As the panel count n grows, all three errors shrink to zero together --
 * the picture of the theorem from Chapter 8 of Haeseok-gaeron (Kim-Kim-Gye).
 *
 * The file also exports the bump counterexample used in problem 3:
 *   bumpF(x, t) = 30 (t/x)^2 (1 - t/x)^2 for x > 0 and 0 < t < x, else 0.
 * Its integral over t is exactly x on (0, 1), so the right derivative at 0
 * is 1, while bumpFx(0, t) = 0 for every t, so the under-integral formula
 * fails at 0. The hypotheses fail too: bumpF is discontinuous at (0, 0)
 * (bumpF(x, x/2) = 15/8) and bumpFx is unbounded near (0, 0).
 * Pure computation: no DOM, d3, or three.
 */

export const DIX_MIN = 0.2;
export const DIX_MAX = 4;
export const DIX_INIT = 1;

export const DIN_MIN = 8;
export const DIN_MAX = 2000;
export const DIN_INIT = 200;

/** Step for the central difference behind numFp. */
const DIX_DIFF_H = 1e-4;

/** Number of samples for the F curve. */
const DIX_CURVE_SAMPLES = 120;

export interface DifferentiationUnderIntegralData {
  x: number;
  n: number;
  /** 1/(x+1). */
  analyticF: number;
  /** -1/(x+1)^2. */
  analyticFp: number;
  /** Simpson quadrature of t^x on [0,1]. */
  numF: number;
  /** Simpson quadrature of t^x ln t on [0,1] (the under-integral derivative). */
  numG: number;
  /** Central difference of numF. */
  numFp: number;
  errF: number;
  errG: number;
  errFp: number;
  curve: ReadonlyArray<{ x: number; y: number }>;
  /** Tangent line to F at x, as a segment across the chart domain. */
  tangent: { x1: number; y1: number; x2: number; y2: number };
}

/** F(x) = integral_0^1 t^x dt = 1/(x+1), x > 0. */
export function analyticF(x: number): number {
  return 1 / (x + 1);
}

/** F'(x) = -1/(x+1)^2, also equal to integral_0^1 t^x ln t dt. */
export function analyticFp(x: number): number {
  return -1 / ((x + 1) * (x + 1));
}

function clampX(x: number): number {
  if (!Number.isFinite(x)) return DIX_INIT;
  return Math.max(DIX_MIN, Math.min(DIX_MAX, x));
}

function clampN(n: number): number {
  if (!Number.isFinite(n)) return DIN_INIT;
  let m = Math.round(n);
  m = Math.max(DIN_MIN, Math.min(DIN_MAX, m));
  if (m % 2 === 1) m += 1;
  return Math.min(m, DIN_MAX);
}

/** t^x on [0,1]; defined as 0 at t = 0 (the limit for x > 0). */
function integrandF(t: number, x: number): number {
  if (t <= 0) return 0;
  return Math.pow(t, x);
}

/** d/dx t^x = t^x ln t; defined as 0 at t = 0 (the limit for x > 0). */
function integrandG(t: number, x: number): number {
  if (t <= 0) return 0;
  return Math.pow(t, x) * Math.log(t);
}

export function simpson(f: (t: number) => number, a: number, b: number, n: number): number {
  let m = Math.max(2, Math.round(n));
  if (m % 2 === 1) m += 1;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i++) {
    s += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  }
  return (s * h) / 3;
}

function numFraw(x: number, n: number): number {
  return simpson((t) => integrandF(t, x), 0, 1, n);
}

export function differentiationUnderIntegralData(x: number, n: number): DifferentiationUnderIntegralData {
  const xx = clampX(x);
  const nn = clampN(n);
  const aF = analyticF(xx);
  const aFp = analyticFp(xx);
  const numF = numFraw(xx, nn);
  const numG = simpson((t) => integrandG(t, xx), 0, 1, nn);
  const h = DIX_DIFF_H;
  const numFp = (numFraw(xx + h, nn) - numFraw(xx - h, nn)) / (2 * h);

  const curve: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= DIX_CURVE_SAMPLES; i++) {
    const cx = DIX_MIN + ((DIX_MAX - DIX_MIN) * i) / DIX_CURVE_SAMPLES;
    curve.push({ x: cx, y: analyticF(cx) });
  }
  // Tangent segment across the visible domain, clipped at y = 0 below.
  const raw1 = aF + aFp * (DIX_MIN - xx);
  const raw2 = aF + aFp * (DIX_MAX - xx);
  const y1 = Math.max(0, raw1);
  const y2 = Math.max(0, raw2);
  const x1 = raw1 >= 0 ? DIX_MIN : xx - aF / aFp;
  const x2 = raw2 >= 0 ? DIX_MAX : xx - aF / aFp;

  return {
    x: xx,
    n: nn,
    analyticF: aF,
    analyticFp: aFp,
    numF,
    numG,
    numFp,
    errF: Math.abs(numF - aF),
    errG: Math.abs(numG - aFp),
    errFp: Math.abs(numFp - aFp),
    curve,
    tangent: { x1, y1, x2, y2 },
  };
}

export const differentiationUnderIntegralModel: SceneModel<DifferentiationUnderIntegralData> = {
  compute(state) {
    const rawX = Number(state['x']);
    const rawN = Number(state['n']);
    return differentiationUnderIntegralData(rawX, rawN);
  },
};

/* ------------------------------------------------------------------ */
/* The bump counterexample for problem 3.                              */
/* ------------------------------------------------------------------ */

/** phi(u) = 30 u^2 (1-u)^2: a smooth bump with integral 1 over [0,1]. */
export function bumpPhi(u: number): number {
  if (u <= 0 || u >= 1) return 0;
  return 30 * u * u * (1 - u) * (1 - u);
}

/**
 * f(x, t) = phi(t/x) for x > 0 and 0 < t < x, else 0.
 * integral_0^1 f(x, t) dt = x for 0 < x < 1 (exactly).
 */
export function bumpF(x: number, t: number): number {
  if (x > 0 && t > 0 && t < x) return bumpPhi(t / x);
  return 0;
}

/**
 * d/dx f(x, t) for x > 0 and 0 < t < x:
 *   -60 u^2 (1-u) (1-2u) / x with u = t/x.
 * At x = 0 the partial derivative is 0 for every t (including t = 0).
 * Near (0, 0) it is unbounded (e.g. -45/(32x) along t = x/4), hence
 * discontinuous there -- the failed hypothesis behind problem 3.
 */
export function bumpFx(x: number, t: number): number {
  if (x === 0) return 0;
  if (x > 0 && t > 0 && t < x) {
    const u = t / x;
    return (-60 * u * u * (1 - u) * (1 - 2 * u)) / x;
  }
  return 0;
}
