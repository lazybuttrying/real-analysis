import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * The Banach fixed-point theorem: a contraction f with
 * |f(x) - f(y)| <= q|x - y|, q < 1, has exactly one fixed point x*, and
 * x_{n+1} = f(x_n) converges to it with |x_n - x*| <= q^n |x_0 - x*|.
 * Demo maps: x/2 + 1 (q = 1/2, fixed point 2, exact equality in the bound)
 * and cos on [0,1] (q = sin 1 by the MVT, fixed point = the Dottie number).
 * Pure computation: no DOM, d3, or three.
 */

export type BanachFunctionKey = 'affine' | 'cos';

export function banachFunctionKey(option: unknown): BanachFunctionKey {
  return option === 'cos' ? 'cos' : 'affine';
}

export interface BanachFunction {
  f: (x: number) => number;
  q: number;
  fixed: number;
  xMin: number;
  xMax: number;
}

/** The Dottie number: the unique fixed point of cos on [0,1], to ~1e-12. */
export function dottieNumber(): number {
  let x = 0.5;
  for (let i = 0; i < 200; i++) x = Math.cos(x);
  return x;
}

export function banachFunction(key: BanachFunctionKey): BanachFunction {
  return key === 'cos'
    ? {
        f: (x) => Math.cos(x),
        q: Math.sin(1),
        fixed: dottieNumber(),
        xMin: 0,
        xMax: 1,
      }
    : {
        f: (x) => x / 2 + 1,
        q: 1 / 2,
        fixed: 2,
        xMin: 0,
        xMax: 4,
      };
}

export interface BanachData {
  key: BanachFunctionKey;
  q: number;
  fixed: number;
  /** The iterates x_0 .. x_n. */
  xs: number[];
  /** |x_k - x*| for each iterate. */
  errors: number[];
  /** The a-priori bound q^k |x_0 - x*|. */
  bounds: number[];
  samples: Array<{ x: number; y: number }>;
}

export function banachData(key: BanachFunctionKey, x0: number, n: number): BanachData {
  const { f, q, fixed, xMin, xMax } = banachFunction(key);
  const count = Math.max(1, Math.min(24, Math.round(n)));
  const xs: number[] = [x0];
  for (let k = 0; k < count; k++) {
    const prev = xs[k];
    if (prev === undefined) break;
    xs.push(f(prev));
  }
  const errors = xs.map((x) => Math.abs(x - fixed));
  const bounds = xs.map((_, k) => Math.pow(q, k) * Math.abs(x0 - fixed));
  const samples: Array<{ x: number; y: number }> = [];
  const m = 200;
  for (let i = 0; i <= m; i++) {
    const x = xMin + ((xMax - xMin) * i) / m;
    samples.push({ x, y: f(x) });
  }
  return { key, q, fixed, xs, errors, bounds, samples };
}

export const banachModel: SceneModel<BanachData> = {
  compute(state) {
    const key = banachFunctionKey(state['fn']);
    const rawX0 = Number(state['x0']);
    const x0 = clampNumber(rawX0, 0, 1, 0.5);
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN) ? rawN : 6;
    return banachData(key, x0, n);
  },
};
