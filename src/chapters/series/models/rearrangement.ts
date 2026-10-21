import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 *
 * The alternating harmonic series S_k = sum_{j=1..k} (-1)^{j+1}/j tends to ln 2.
 * Its (+,+,-) rearrangement takes two positive (odd-denominator) terms, then one
 * negative (even-denominator) term: 1, 1/3, -1/2, 1/5, 1/7, -1/4, ...
 * The rearranged partial sums tend to (3/2) ln 2 instead.
 */

const MAX_N = 300;
const MIN_N = 6;

export const ORIG_LIMIT = Math.LN2;
export const REARR_LIMIT = 1.5 * Math.LN2;

export interface RearrangementData {
  n: number;
  /** Partial sums S_k of the original term order, for k = 1..n. */
  original: number[];
  /** Partial sums T_k of the (+,+,-) rearrangement, for k = 1..n. */
  rearranged: number[];
  /** ln 2 */
  origLimit: number;
  /** (3/2) ln 2 */
  rearrLimit: number;
}

export function rearrangementSums(n: number): RearrangementData {
  const original: number[] = [];
  let s = 0;
  for (let k = 1; k <= n; k++) {
    s += (k % 2 === 1 ? 1 : -1) / k;
    original.push(s);
  }
  const rearranged: number[] = [];
  let t = 0;
  let oddD = 1;
  let evenD = 2;
  for (let m = 0; m < n; m++) {
    if (m % 3 === 2) {
      t -= 1 / evenD;
      evenD += 2;
    } else {
      t += 1 / oddD;
      oddD += 2;
    }
    rearranged.push(t);
  }
  return { n, original, rearranged, origLimit: ORIG_LIMIT, rearrLimit: REARR_LIMIT };
}

export const rearrangementModel: SceneModel<RearrangementData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(raw))) : 60;
    return rearrangementSums(n);
  },
};
