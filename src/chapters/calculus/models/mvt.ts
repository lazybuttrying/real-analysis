import type { SceneModel } from '../../../contracts';

/**
 * The Mean Value Theorem: for f continuous on [a,b] and differentiable on
 * (a,b), some interior point xi has f'(xi) equal to the secant slope
 * (f(b)-f(a))/(b-a). The demo functions are chosen so the MVT points are
 * computable in closed form; the model also locates them numerically by
 * scanning for sign changes of f'(x) - secantSlope.
 * Pure computation: no DOM, d3, or three.
 */

export type MVTFunctionKey = 'cubic' | 'square' | 'rolle' | 'constant';

/** Map the meta.ts select option value to the function key. */
export function mvtFunctionKey(option: unknown): MVTFunctionKey {
  return option === 'x^2'
    ? 'square'
    : option === 'x^3-3x'
      ? 'rolle'
      : option === 'const'
        ? 'constant'
        : 'cubic';
}

export interface MVTFunction {
  f: (x: number) => number;
  fp: (x: number) => number;
  a: number;
  b: number;
}

export function mvtFunction(key: MVTFunctionKey): MVTFunction {
  switch (key) {
    case 'square':
      return { f: (x) => x * x, fp: (x) => 2 * x, a: 0, b: 2 };
    case 'rolle':
      return { f: (x) => x * x * x - 3 * x, fp: (x) => 3 * x * x - 3, a: -1, b: 2 };
    case 'constant':
      return {
        f: () => 2,
        fp: () => 0,
        a: 0,
        b: 2,
      };
    case 'cubic':
    default:
      return { f: (x) => x * x * x, fp: (x) => 3 * x * x, a: 0, b: 2 };
  }
}

export interface MVTSample {
  x: number;
  y: number;
}

export interface MVTData {
  key: MVTFunctionKey;
  a: number;
  b: number;
  secantSlope: number;
  /** Slider position (0..1 mapped onto [a,b]). */
  xi: number;
  tangentSlope: number;
  /** Numerically located MVT points in (a,b). */
  mvtPoints: number[];
  samples: MVTSample[];
}

/** Locate interior points with f'(x) = secantSlope via sign-change scan + bisection. */
export function findMVTPoints(key: MVTFunctionKey): number[] {
  const { fp, a, b } = mvtFunction(key);
  const { f } = mvtFunction(key);
  const secant = (f(b) - f(a)) / (b - a);
  const h = (x: number): number => fp(x) - secant;
  const m = 400;
  // Degenerate case (e.g. a constant function): every point qualifies, so
  // marking them is meaningless — report none.
  let maxAbs = 0;
  for (let i = 0; i <= m; i++) {
    const v = Math.abs(h(a + ((b - a) * i) / m));
    if (v > maxAbs) maxAbs = v;
  }
  if (maxAbs < 1e-12) return [];
  const points: number[] = [];
  let prevX = a;
  let prevH = h(a);
  for (let i = 1; i <= m; i++) {
    const x = a + ((b - a) * i) / m;
    const hx = h(x);
    if (hx === 0) {
      points.push(x);
    } else if (prevH * hx < 0) {
      let lo = prevX;
      let hi = x;
      for (let j = 0; j < 100; j++) {
        const mid = (lo + hi) / 2;
        if (h(lo) * h(mid) <= 0) hi = mid;
        else lo = mid;
      }
      points.push((lo + hi) / 2);
    }
    prevX = x;
    prevH = hx;
  }
  // Dedupe: an exact-zero grid hit can coincide with a neighboring sign change.
  const deduped: number[] = [];
  for (const p of points) {
    if (!deduped.some((q) => Math.abs(q - p) < 1e-9)) deduped.push(p);
  }
  return deduped.filter((p) => p > a && p < b);
}

export function mvtData(key: MVTFunctionKey, t: number): MVTData {
  const { f, fp, a, b } = mvtFunction(key);
  const clamped = Math.min(1, Math.max(0, t));
  const xi = a + (b - a) * clamped;
  const samples: MVTSample[] = [];
  const m = 200;
  for (let i = 0; i <= m; i++) {
    const x = a + ((b - a) * i) / m;
    samples.push({ x, y: f(x) });
  }
  return {
    key,
    a,
    b,
    secantSlope: (f(b) - f(a)) / (b - a),
    xi,
    tangentSlope: fp(xi),
    mvtPoints: findMVTPoints(key),
    samples,
  };
}

export const mvtModel: SceneModel<MVTData> = {
  compute(state) {
    const key = mvtFunctionKey(state['fn']);
    const raw = Number(state['xi']);
    const t = Number.isFinite(raw) ? raw / 100 : 0.4;
    return mvtData(key, t);
  },
};
