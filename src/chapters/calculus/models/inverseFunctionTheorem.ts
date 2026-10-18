import type { SceneModel } from '../../../contracts';

/**
 * Inverse function theorem, 1D version: if f is C^1 near x0 and f'(x0) != 0,
 * the local inverse g satisfies g'(y0) = 1/f'(x0), i.e. the two tangent
 * slopes multiply to 1.
 *
 * Supported functions:
 *   'x^3+x': f(x) = x^3 + x, f'(x) = 3x^2 + 1. Strictly increasing, so the
 *            inverse is computed numerically by bisection on [-2, 4]
 *            (f(-2) = -10, f(4) = 68 covers b = f(a) for a in [-1, 2]).
 *   'e^x':   f(x) = e^x, f'(x) = e^x. The inverse is Math.log (y > 0 always).
 *
 * Verified numbers (tests/inverse-function-theorem.test.ts):
 *   a = 1, 'x^3+x': b = 2, g(2) = 1 exactly (bisection), f'(1) = 4,
 *     g'(2) = 1/4, slopeProduct = 4 * 0.25 = 1 exactly;
 *   a = 1, 'e^x': b = e, g(e) = 1 (Math.log(Math.E) === 1 in IEEE doubles),
 *     f'(1) = e, g'(e) = 1/e, slopeProduct = 1 exactly;
 *   a = -1, 'x^3+x': b = -2, f'(-1) = 4, product = 1 to < 1e-12;
 *   gCurve is the pointwise reflection of fCurve across y = x.
 */

export const IFT_FN_OPTIONS = ['x^3+x', 'e^x'] as const;
export const DEFAULT_FN = 'x^3+x';
export const DEFAULT_A = 1;
export const A_MIN = -1;
export const A_MAX = 2;

/** f(x) for the selected function. */
export function fEval(fn: string, x: number): number {
  return fn === 'e^x' ? Math.exp(x) : x * x * x + x;
}

/** f'(x) for the selected function. */
export function fpEval(fn: string, x: number): number {
  return fn === 'e^x' ? Math.exp(x) : 3 * x * x + 1;
}

/**
 * Numerical inverse g(y): for 'e^x' this is Math.log; for 'x^3+x' bisection
 * on [-2, 4] (200 iterations, strictly increasing f).
 */
export function inverseEval(fn: string, y: number): number {
  if (fn === 'e^x') return Math.log(y);
  let lo = -2;
  let hi = 4;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (mid * mid * mid + mid < y) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** g'(y) = 1 / f'(g(y)). */
export function gpEval(fn: string, y: number): number {
  return 1 / fpEval(fn, inverseEval(fn, y));
}

/** x-domain used for the f curve, per function. */
export function curveDomain(fn: string): { xMin: number; xMax: number } {
  return fn === 'e^x' ? { xMin: -2, xMax: 1.5 } : { xMin: -2, xMax: 2 };
}

export interface InverseSample {
  x: number;
  y: number;
}

export interface InverseFunctionTheoremData {
  fn: string;
  /** The point a where the theorem is probed. */
  a: number;
  /** b = f(a). */
  b: number;
  /** f'(a). */
  fpA: number;
  /** g'(b) = 1 / f'(g(b)). */
  gpB: number;
  /** f'(a) * g'(b): the theorem says this equals 1. */
  slopeProduct: number;
  /** Samples of f over the curve domain. */
  fCurve: InverseSample[];
  /** Reflection of fCurve across y = x: samples of the inverse g. */
  gCurve: InverseSample[];
  /** Tangent line to f at (a, b): y = b + f'(a)(x - a). */
  fTangent: InverseSample[];
  /** Tangent line to g at (b, a): y = a + g'(b)(x - b). */
  gTangent: InverseSample[];
}

/** Pure: no DOM, no d3. */
export function inverseFunctionTheoremData(fn: string, a: number): InverseFunctionTheoremData {
  const b = fEval(fn, a);
  const fpA = fpEval(fn, a);
  const gpB = gpEval(fn, b);
  const { xMin, xMax } = curveDomain(fn);

  const fCurve: InverseSample[] = [];
  const samples = 121;
  for (let i = 0; i < samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / (samples - 1);
    fCurve.push({ x, y: fEval(fn, x) });
  }
  // Reflection across y = x swaps coordinates: the inverse graph.
  const gCurve: InverseSample[] = fCurve.map((p) => ({ x: p.y, y: p.x }));

  const tan = (x0: number, y0: number, slope: number, cx: number): InverseSample[] => {
    const pts: InverseSample[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = cx - 0.75 + (1.5 * i) / 40;
      pts.push({ x, y: y0 + slope * (x - x0) });
    }
    return pts;
  };

  return {
    fn,
    a,
    b,
    fpA,
    gpB,
    slopeProduct: fpA * gpB,
    fCurve,
    gCurve,
    fTangent: tan(a, b, fpA, a),
    gTangent: tan(b, a, gpB, b),
  };
}

function clampA(raw: number): number {
  if (!Number.isFinite(raw)) return DEFAULT_A;
  return Math.min(A_MAX, Math.max(A_MIN, raw));
}

export const inverseFunctionTheoremModel: SceneModel<InverseFunctionTheoremData> = {
  compute(state) {
    const rawFn = state['fn'];
    const fn = typeof rawFn === 'string' && (IFT_FN_OPTIONS as readonly string[]).includes(rawFn)
      ? rawFn
      : DEFAULT_FN;
    return inverseFunctionTheoremData(fn, clampA(Number(state['a'])));
  },
};
