import type { SceneModel } from '../../../contracts';

/**
 * The Weierstrass function, live:
 *   W(x) = sum_{n=0}^{infty} a^n cos(b^n pi x),   a = 1/2, b = 13.
 *
 * Continuous everywhere by the Weierstrass M-test (M_n = a^n, sum M_n = 2),
 * since each term is continuous and the series converges uniformly. With
 * a*b = 6.5 > 1 + 3*pi/2 ~= 5.712 and b odd, the classical
 * Weierstrass-Hardy condition holds: W is differentiable at no point.
 *
 * The scene samples the partial sum W_N on [0, 1]. Note that the
 * highest-frequency terms (b^8 ~= 8.2e8 cycles over [0, 1]) alias on any
 * fixed grid; the visible jaggedness at every scale is the point.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Geometric ratio of the Weierstrass series. */
export const A = 0.5;
/** Frequency base (odd); a*b = 6.5 > 1 + 3*pi/2. */
export const B = 13;

export const N_MIN = 0;
export const N_MAX = 8;
export const N_INIT = 4;

/** Grid resolution for the sampled polyline of W_N over [0, 1]. */
export const N_POINTS = 2001;

export function clampN(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return N_INIT;
  return Math.min(N_MAX, Math.max(N_MIN, Math.floor(n)));
}

/** The partial sum W_N(x) = sum_{k=0}^{N} a^k cos(b^k pi x). */
export function weierstrassPartial(x: number, n: number): number {
  const terms = clampN(n);
  let s = 0;
  let ak = 1;
  let bk = 1;
  for (let k = 0; k <= terms; k++) {
    s += ak * Math.cos(bk * Math.PI * x);
    ak *= A;
    bk *= B;
  }
  return s;
}

/**
 * M-test tail bound, uniform in x:
 *   |W(x) - W_N(x)| <= sum_{k=N+1}^{infty} a^k = a^{N+1} / (1 - a).
 */
export function tailBound(n: number): number {
  const t = clampN(n);
  return Math.pow(A, t + 1) / (1 - A);
}

/** M-test majorant of the last included term: max_x |a^N cos(b^N pi x)| <= a^N. */
export function lastTermBound(n: number): number {
  return Math.pow(A, clampN(n));
}

export interface WeierstrassData {
  n: number;
  xs: number[];
  vals: number[];
  yMin: number;
  yMax: number;
  /** Uniform tail bound: |W(x) - W_N(x)| <= tailBound for every x. */
  tailBound: number;
  /** M-test majorant of the last included term. */
  lastTermBound: number;
}

export function weierstrassData(n: number): WeierstrassData {
  const t = clampN(n);
  const xs: number[] = new Array<number>(N_POINTS);
  const vals: number[] = new Array<number>(N_POINTS);
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < N_POINTS; i++) {
    const x = i / (N_POINTS - 1);
    const v = weierstrassPartial(x, t);
    xs[i] = x;
    vals[i] = v;
    if (v < yMin) yMin = v;
    if (v > yMax) yMax = v;
  }
  return {
    n: t,
    xs,
    vals,
    yMin,
    yMax,
    tailBound: tailBound(t),
    lastTermBound: lastTermBound(t),
  };
}

export const weierstrassModel: SceneModel<WeierstrassData> = {
  compute(state) {
    return weierstrassData(clampN(state['n']));
  },
};
