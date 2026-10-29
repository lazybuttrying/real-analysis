import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The Archimedean property, live: for any step a > 0 and any target
 * b, some number of steps passes the target: there is a natural n
 * with n a > b. The model computes the least such n = floor(b / a) + 1
 * and the multiples of a up to it. This is what guarantees a usable N
 * in every epsilon-N argument. Pure computation: no DOM, d3, or three.
 */

export interface ArchimedeanData {
  /** The step size a > 0. */
  a: number;
  /** The target b. */
  b: number;
  /** The least natural n with n * a > b. */
  n: number;
  /** n * a, the first multiple past b. */
  na: number;
  /** (n - 1) * a, the last multiple still <= b. */
  prevA: number;
  /** The multiples a, 2a, ..., n a. */
  multiples: readonly number[];
}

export function leastMultiple(a: number, b: number): number {
  if (!(a > 0)) return 1;
  const n = Math.floor(b / a) + 1;
  return Math.max(1, n);
}

function clampA(v: number): number {
  if (!Number.isFinite(v)) return 0.5;
  return Math.max(0.1, Math.min(2, v));
}

function clampB(v: number): number {
  if (!Number.isFinite(v)) return 5;
  return Math.max(0, Math.min(10, v));
}

export function archimedeanData(a: number, b: number): ArchimedeanData {
  const aa = clampA(a);
  const bb = clampB(b);
  const n = leastMultiple(aa, bb);
  const multiples: number[] = [];
  for (let k = 1; k <= n; k++) multiples.push(k * aa);
  return { a: aa, b: bb, n, na: n * aa, prevA: (n - 1) * aa, multiples };
}

export const archimedeanModel: SceneModel<ArchimedeanData> = {
  compute(state: ControlState): ArchimedeanData {
    return archimedeanData(Number(state['a']), Number(state['b']));
  },
};
