import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Proposition 10.3.3: if f is continuous on [a, b] and
 * differentiable on (a, b), then f' >= 0 on (a, b) implies f is increasing
 * on [a, b], and f' > 0 on (a, b) implies f is strictly increasing.
 *
 * The model tabulates f and f' on a viewing interval, classifies the sign
 * of f' at the dragged point, shades the intervals where f' > 0 / f' < 0,
 * and compares the central-difference secant slope over a small window
 * [x0 - h, x0 + h] against the derivative sign — the MVT intuition behind
 * the theorem: a secant slope is always some tangent slope.
 * Pure computation: no DOM, d3, or three.
 */

type MonotonicityFunctionKey = 'cubic' | 'sine' | 'exp';

/** Map the meta.ts select option value to the function key. */
export function monotonicityFunctionKey(option: unknown): MonotonicityFunctionKey {
  if (option === 'sine') return 'sine';
  if (option === 'exp') return 'exp';
  return 'cubic';
}

interface MonotonicityFunction {
  f: (x: number) => number;
  fp: (x: number) => number;
  a: number;
  b: number;
  /** Interior points where f' = 0 exactly (critical points), analytic. */
  criticalPoints: number[];
}

export function monotonicityFunction(key: MonotonicityFunctionKey): MonotonicityFunction {
  switch (key) {
    case 'sine':
      return {
        f: (x) => Math.sin(x),
        fp: (x) => Math.cos(x),
        a: -Math.PI,
        b: Math.PI,
        criticalPoints: [-Math.PI / 2, Math.PI / 2],
      };
    case 'exp':
      return {
        f: (x) => Math.exp(x),
        fp: (x) => Math.exp(x),
        a: -2.5,
        b: 2.5,
        criticalPoints: [],
      };
    case 'cubic':
    default:
      return {
        f: (x) => x * x * x - 3 * x,
        fp: (x) => 3 * x * x - 3,
        a: -2.5,
        b: 2.5,
        criticalPoints: [-1, 1],
      };
  }
}

export interface MonotonicitySample {
  x: number;
  y: number;
}

interface MonotonicityBand {
  x0: number;
  x1: number;
  sign: -1 | 0 | 1;
}

export interface MonotonicityData {
  key: MonotonicityFunctionKey;
  a: number;
  b: number;
  /** Slider position mapped onto [a, b]. */
  x0: number;
  /** f'(x0). */
  fp0: number;
  /** Sign of f'(x0): -1 decreasing, 0 flat, 1 increasing. */
  fpSign: -1 | 0 | 1;
  /** Interior critical points (f' = 0), marked on the curve. */
  criticalPoints: number[];
  /** f sampled on [a, b]. */
  fSamples: MonotonicitySample[];
  /** f' sampled on [a, b]. */
  fpSamples: MonotonicitySample[];
  /** Maximal subintervals of constant f' sign (background shading). */
  bands: MonotonicityBand[];
  /** Half-width of the secant window [x0 - h, x0 + h]. */
  secantH: number;
  /** (f(x0 + h) - f(x0 - h)) / (2h), clamped inside [a, b]. */
  secantSlope: number;
  secantSign: -1 | 0 | 1;
  /** Whether the secant slope sign matches the derivative sign. */
  secantAgrees: boolean;
}

/** Curve sample count for f and f'. */
export const CURVE_SAMPLES = 240;
/** |f'| below this counts as flat (zero). */
const ZERO_TOL = 1e-9;
/** Secant half-width, relative to the interval width. */
const SECANT_H_REL = 0.02;

export function signOf(v: number): -1 | 0 | 1 {
  if (v > ZERO_TOL) return 1;
  if (v < -ZERO_TOL) return -1;
  return 0;
}

export function monotonicityData(key: MonotonicityFunctionKey, t: number): MonotonicityData {
  const { f, fp, a, b, criticalPoints } = monotonicityFunction(key);
  const clamped = Math.min(1, Math.max(0, t));
  const x0 = a + (b - a) * clamped;
  const fp0 = fp(x0);
  const fpSign = signOf(fp0);

  const fSamples: MonotonicitySample[] = [];
  const fpSamples: MonotonicitySample[] = [];
  const bands: MonotonicityBand[] = [];
  let bandStart = a;
  let bandSign = signOf(fp(a));
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const x = a + ((b - a) * i) / CURVE_SAMPLES;
    fSamples.push({ x, y: f(x) });
    const v = fp(x);
    fpSamples.push({ x, y: v });
    const s = signOf(v);
    if (s !== bandSign && i > 0) {
      bands.push({ x0: bandStart, x1: x, sign: bandSign });
      bandStart = x;
      bandSign = s;
    }
  }
  bands.push({ x0: bandStart, x1: b, sign: bandSign });

  const secantH = SECANT_H_REL * (b - a);
  const xl = Math.max(a, x0 - secantH);
  const xr = Math.min(b, x0 + secantH);
  const secantSlope = xr > xl ? (f(xr) - f(xl)) / (xr - xl) : 0;
  const secantSign = signOf(secantSlope);
  // At a flat point both are 0; agreement means no contradiction. Note that
  // at a critical point the central difference is f'(x0) + f'''(x0) h^2/6,
  // which can exceed ZERO_TOL (e.g. cubic at x = 1), so agreement is not
  // guaranteed there.
  const secantAgrees = secantSign === fpSign;

  return {
    key,
    a,
    b,
    x0,
    fp0,
    fpSign,
    criticalPoints: criticalPoints.filter((c) => c > a && c < b),
    fSamples,
    fpSamples,
    bands,
    secantH,
    secantSlope,
    secantSign,
    secantAgrees,
  };
}

export const monotonicityModel: SceneModel<MonotonicityData> = {
  compute(state) {
    const key = monotonicityFunctionKey(state['fn']);
    const raw = Number(state['x']);
    const t = Number.isFinite(raw) ? raw / 100 : 0;
    return monotonicityData(key, t);
  },
};
