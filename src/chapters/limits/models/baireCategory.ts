import type { SceneModel } from '../../../contracts';

/**
 * Baire category, witnessed on [0,1]: the rationals of [0,1] are countable,
 * yet [0,1] is not a countable union of points.
 *
 * Enumerate Q cap [0,1] in lowest-terms denominator order:
 *   d = 1: 0/1, 1/1;  d = 2: 1/2;  d = 3: 1/3, 2/3;  d = 4: 1/4, 3/4; ...
 * (non-coprime pairs are skipped, so every rational appears exactly once).
 *
 * I_0 = [0,1]. For k = 1..n let [a,b] = I_{k-1} and q = q_k.
 * If q < a or q > b the k-th rational already misses: I_k = I_{k-1}.
 * Otherwise, with delta = (b - a)/4:
 *   if q - delta > a: I_k = [a, a + (b - a)/4]      (left quarter)
 *   else:            I_k = [b - (b - a)/4, b]      (right quarter)
 * In the left branch q > a + delta = a + (b-a)/4 keeps q out of I_k; in the
 * right branch q <= a + delta < b - (b-a)/4 (since (b-a) > 0) keeps q out.
 * Either way q_k not in I_k and length(I_k) = (b - a)/4 > 0.
 *
 * The survivor x in cap_{k<=n} I_k dodges q_1..q_n (a rational outside
 * I_{k-1} can never enter a later subinterval). Lengths shrink to 0: every
 * positive-length interval holds a rational, so some later q_m must hit it.
 * Hence cap_n I_n = {x} with x != q_k for all k: an irrational exists.
 *
 * Pure computation: no DOM, d3, or three.
 *
 * Verified identities (tests/baire-category.test.ts):
 *   enumeration: q_1 = 0, q_2 = 1, q_3 = 1/2, q_4 = 1/3, q_5 = 2/3,
 *                q_6 = 1/4, q_7 = 3/4, q_8 = 1/5, q_14 = 1/7
 *   stage 6: hits at k = 1, 2; I_6 = [0.75, 0.8125], survivor = 0.78125
 *   stage 14: hits at k = 1, 2, 7, 11; I_14 = [0.80859375, 0.8125],
 *             survivor = 0.810546875
 */

export interface BaireStage {
  /** 1-based enumeration index. */
  k: number;
  /** q_k, the k-th rational of the enumeration. */
  q: number;
  /** Lowest-terms numerator / denominator of q_k (for labels). */
  num: number;
  den: number;
  /** Endpoints of I_k (after q_k has been processed). */
  a: number;
  b: number;
  /** True when q_k landed inside I_{k-1}, so I_k is a strict quarter. */
  hit: boolean;
}

export interface BaireData {
  /** Number of stages (the slider). */
  stage: number;
  /** Per-stage records for k = 1..stage. */
  stages: BaireStage[];
  /** Midpoint of I_stage: a point of the intersection, dodging q_1..q_stage. */
  survivor: number;
  /** Endpoints of the final interval I_stage. */
  finalA: number;
  finalB: number;
}

export const MIN_STAGE = 1;
export const MAX_STAGE = 14;
export const DEFAULT_STAGE = 6;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export interface RationalTerm {
  num: number;
  den: number;
  value: number;
}

/** First `count` rationals of [0,1] in lowest-terms denominator order. */
export function rationalEnumeration(count: number): RationalTerm[] {
  const out: RationalTerm[] = [];
  for (let d = 1; out.length < count; d++) {
    for (let n = 0; n <= d && out.length < count; n++) {
      if (gcd(n, d) !== 1) continue;
      out.push({ num: n, den: d, value: n / d });
    }
  }
  return out;
}

/**
 * One step of the construction: given [a,b] = I_{k-1} and q = q_k, return
 * the new interval. Exported so tests can verify the quartering rule
 * directly against the documented identities.
 */
export function baireStep(a: number, b: number, q: number): { a: number; b: number; hit: boolean } {
  if (q < a || q > b) return { a, b, hit: false };
  const delta = (b - a) / 4;
  if (q - delta > a) return { a, b: a + delta, hit: true };
  return { a: b - delta, b, hit: true };
}

export function baireData(stage: number): BaireData {
  const qs = rationalEnumeration(stage);
  const stages: BaireStage[] = [];
  let a = 0;
  let b = 1;
  qs.forEach((qk, i) => {
    const next = baireStep(a, b, qk.value);
    a = next.a;
    b = next.b;
    stages.push({ k: i + 1, q: qk.value, num: qk.num, den: qk.den, a, b, hit: next.hit });
  });
  return { stage, stages, survivor: (a + b) / 2, finalA: a, finalB: b };
}

export const baireModel: SceneModel<BaireData> = {
  compute(state) {
    const raw = Number(state['stage']);
    const stage = Number.isFinite(raw)
      ? Math.min(MAX_STAGE, Math.max(MIN_STAGE, Math.floor(raw)))
      : DEFAULT_STAGE;
    return baireData(stage);
  },
};
