import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Outer measure by countable interval covers: m*(A) is the infimum of the
 * total lengths of countable interval covers of A. Three witnesses:
 * a singleton (one interval of length eps), the rationals in [0,1]
 * (the eps/2^{k+1} cover, total eps(1 - 2^{-K}) < eps), and the whole
 * interval [0,1] (cover total 1; m*([0,1]) = 1 is stated as a known fact).
 * Pure computation: no DOM, d3, or three.
 */

type TargetKey = 'singleton' | 'rationals' | 'interval';

interface MeasureCover {
  /** Interval center. */
  c: number;
  /** Interval width (length). */
  w: number;
}

export interface MeasureData {
  target: TargetKey;
  eps: number;
  K: number;
  covers: MeasureCover[];
  /** Sum of the cover widths; the cover witnesses m*(target) <= totalLength. */
  totalLength: number;
  /** The outer-measure bound this cover establishes. */
  outerBound: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

/**
 * First K rationals in [0,1]: denominator q = 1, 2, ...; numerator p = 0..q,
 * kept in lowest terms (gcd(p, q) = 1). Lowest terms make every value
 * distinct, so 0 appears exactly once (only 0/1 qualifies).
 */
export function rationalsUpTo(K: number): number[] {
  const count = Math.max(1, Math.min(64, Math.round(K)));
  const out: number[] = [];
  for (let q = 1; out.length < count; q++) {
    for (let p = 0; p <= q && out.length < count; p++) {
      if (gcd(p, q) !== 1) continue;
      out.push(p / q);
    }
  }
  return out;
}

/** Total cover length for the rationals: eps * (1 - 2^{-K}), always below eps. */
export function coverTotal(eps: number, K: number): number {
  const count = Math.max(1, Math.min(64, Math.round(K)));
  return eps * (1 - Math.pow(2, -count));
}

/** The singleton cover: one interval centered at 1/2 with width eps. */
export function singletonCover(eps: number): MeasureCover {
  return { c: 0.5, w: eps };
}

export function targetKey(value: unknown): TargetKey {
  return value === 'rationals' || value === 'interval' ? value : 'singleton';
}

export function measureData(target: TargetKey, eps: number, K: number): MeasureData {
  const e = Math.min(0.5, Math.max(0.01, eps));
  const count = Math.max(1, Math.min(64, Math.round(K)));
  let covers: MeasureCover[];
  let outerBound: number;
  if (target === 'singleton') {
    covers = [singletonCover(e)];
    outerBound = e;
  } else if (target === 'rationals') {
    // The k-th rational (0-based) gets an interval of length eps / 2^{k+1}.
    covers = rationalsUpTo(count).map((r, k) => {
      const w = e / Math.pow(2, k + 1);
      return { c: r, w };
    });
    outerBound = coverTotal(e, count);
  } else {
    covers = [{ c: 0.5, w: 1 }];
    outerBound = 1;
  }
  const totalLength = covers.reduce((s, cover) => s + cover.w, 0);
  return { target, eps: e, K: count, covers, totalLength, outerBound };
}

export const measureModel: SceneModel<MeasureData> = {
  compute(state: ControlState) {
    const rawE = Number(state['eps']);
    const rawK = Number(state['K']);
    return measureData(
      targetKey(state['target']),
      Number.isFinite(rawE) ? rawE : 0.1,
      Number.isFinite(rawK) ? rawK : 16,
    );
  },
};
