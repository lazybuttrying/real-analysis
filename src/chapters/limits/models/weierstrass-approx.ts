import type { SceneModel } from '../../../contracts';

/**
 * The Weierstrass approximation theorem via Bernstein polynomials:
 * B_n(f)(x) = sum_{k=0}^{n} f(k/n) * C(n,k) x^k (1-x)^{n-k}.
 * For every continuous f on [0,1], B_n(f) -> f uniformly as n -> oo.
 * The basis mass concentrates near x as n grows; uniform continuity of
 * f does the rest. Pure computation: no DOM, d3, or three.
 */

export type BernsteinFnKey = 'one' | 'id' | 'abs' | 'square' | 'sin';

export function bernsteinFnKey(option: unknown): BernsteinFnKey {
  return option === 'id'
    ? 'id'
    : option === 'abs'
      ? 'abs'
      : option === 'square'
        ? 'square'
        : option === 'sin'
          ? 'sin'
          : 'one';
}

export function bernsteinFn(key: BernsteinFnKey, x: number): number {
  switch (key) {
    case 'one':
      return 1;
    case 'id':
      return x;
    case 'abs':
      return Math.abs(x - 0.5);
    case 'square':
      return x * x;
    case 'sin':
      return Math.sin(2 * Math.PI * x);
  }
}

/** Bernstein basis b_{k,n}(x) by forward recurrence; exact at x=0 and x=1. */
export function bernsteinBasis(k: number, n: number, x: number): number {
  if (x <= 0) return k === 0 ? 1 : 0;
  if (x >= 1) return k === n ? 1 : 0;
  let b = Math.pow(1 - x, n);
  for (let j = 1; j <= k; j++) b *= ((n - j + 1) / j) * (x / (1 - x));
  return b;
}

/** The Bernstein polynomial B_n(f)(x). */
export function bernstein(key: BernsteinFnKey, n: number, x: number): number {
  let sum = 0;
  for (let k = 0; k <= n; k++) sum += bernsteinFn(key, k / n) * bernsteinBasis(k, n, x);
  return sum;
}

export interface BernsteinSample {
  x: number;
  y: number;
  p: number;
}

export interface BernsteinData {
  key: BernsteinFnKey;
  n: number;
  /** Maximum |f - B_n| on [0,1] (sampled at 401 points). */
  maxErr: number;
  samples: BernsteinSample[];
}

/** 400 samples on [0,1]; maxErr = max |f - B_n|. */
export function bernsteinData(key: BernsteinFnKey, n: number): BernsteinData {
  const samples: BernsteinSample[] = [];
  const m = 400;
  let maxErr = 0;
  for (let i = 0; i <= m; i++) {
    const x = i / m;
    const y = bernsteinFn(key, x);
    const p = bernstein(key, n, x);
    const err = Math.abs(y - p);
    if (err > maxErr) maxErr = err;
    samples.push({ x, y, p });
  }
  return { key, n, maxErr, samples };
}

export const bernsteinModel: SceneModel<BernsteinData> = {
  compute(state) {
    const key = bernsteinFnKey(state['fn']);
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(60, Math.max(1, Math.round(raw))) : 10;
    return bernsteinData(key, n);
  },
};
