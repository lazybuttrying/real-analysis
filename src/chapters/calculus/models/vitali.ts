import type { SceneModel } from '../../../contracts';

/**
 * The Vitali non-measurable set, illustrated with a finite mock.
 *
 * The real construction: x ~ y iff x - y in Q. By the axiom of choice, pick
 * one representative from each ~-class meeting [0,1]; call the set of
 * representatives V, so V is a subset of [0,1]. The translates
 * {V + q : q in Q cap [-1,1]} are pairwise disjoint and
 * [0,1] is a subset of their union, which is a subset of [-1,2].
 * If V were Lebesgue measurable with measure m, countable additivity gives
 * m(union) = sum_q m = (countably many copies of m): m > 0 forces the sum to
 * infinity, contradicting m(union) <= 3; m = 0 forces m(union) = 0,
 * contradicting m(union) >= 1. So V is not measurable. AC is used exactly
 * once: to choose the representatives. There is no formula for V, so V
 * itself cannot be drawn; this model draws only a finite mock of the
 * translate structure (labeled as such everywhere it appears).
 *
 * Pure computation: no DOM, d3, or three.
 */

export const VITALI_D_MIN = 1;
export const VITALI_D_MAX = 6;
export const VITALI_D_INIT = 3;

/**
 * A finite mock of the Vitali set: fixed "representative" dots in [0,1].
 * ILLUSTRATION ONLY: the real V is given by AC with no explicit formula,
 * so no finite point set can stand in for it. These dots only suggest what
 * "one representative per rational-difference class" looks like.
 */
export const VITALI_MOCK_V: readonly number[] = [
  0.07, 0.19, 0.31, 0.43, 0.57, 0.69, 0.83, 0.95,
];

/** The interval the mock translates are drawn inside: [-1, 2]. */
export const VITALI_DRAW_MIN = -1;
export const VITALI_DRAW_MAX = 2;

function clampD(d: number): number {
  if (!Number.isFinite(d)) return VITALI_D_INIT;
  return Math.max(VITALI_D_MIN, Math.min(VITALI_D_MAX, Math.round(d)));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * The rationals in [-1, 1] with denominator at most d, in lowest terms,
 * sorted ascending. This finite set stands in for Q cap [-1,1] in the mock.
 */
export function vitaliRationals(d: number): number[] {
  const dd = clampD(d);
  const rationals: number[] = [];
  for (let q = 1; q <= dd; q++) {
    for (let p = -q; p <= q; p++) {
      if (gcd(Math.abs(p), q) === 1) rationals.push(p / q);
    }
  }
  rationals.sort((a, b) => a - b);
  return rationals;
}

interface VitaliMockTranslate {
  /** The rational shift q. */
  q: number;
  /** The mock translate points v + q lying inside [VITALI_DRAW_MIN, VITALI_DRAW_MAX]. */
  points: number[];
}

export interface VitaliData {
  d: number;
  /** Finite mock of Q cap [-1,1]: rationals with denominator at most d. */
  rationals: number[];
  /** The mock representative set (ILLUSTRATION ONLY, see VITALI_MOCK_V). */
  mockV: readonly number[];
  /** Mock translates of the mock set, clipped to [VITALI_DRAW_MIN, VITALI_DRAW_MAX]. */
  translates: VitaliMockTranslate[];
  /** Number of rationals shown. */
  rationalCount: number;
  /**
   * The counting argument, finite form. The real union is over countably
   * many disjoint translates: if m(V) = m > 0, the total measure is the
   * infinite sum m + m + ... = infinity, exceeding the length-3 bound of
   * [-1, 2]; if m = 0 the total is 0, below the length-1 bound of [0, 1].
   * `positiveCaseFinite` is n * 1 for the n shown rationals (m = 1 case);
   * `zeroCaseTotal` is the m = 0 total. `exceedsThree` flags when even the
   * finite shown family already outgrows the length-3 container for m = 1.
   */
  positiveCaseFinite: number;
  zeroCaseTotal: number;
  exceedsThree: boolean;
  /** Length of [0, 1]: the lower bound the zero case must clear. */
  unitLength: number;
  /** Length of [-1, 2]: the container the positive case must fit in. */
  containerLength: number;
}

export function vitaliData(d: number): VitaliData {
  const dd = clampD(d);
  const rationals = vitaliRationals(dd);
  const translates: VitaliMockTranslate[] = rationals.map((q) => ({
    q,
    points: VITALI_MOCK_V.filter(
      (v) => v + q >= VITALI_DRAW_MIN && v + q <= VITALI_DRAW_MAX,
    ),
  }));
  return {
    d: dd,
    rationals,
    mockV: VITALI_MOCK_V,
    translates,
    rationalCount: rationals.length,
    positiveCaseFinite: rationals.length,
    zeroCaseTotal: 0,
    exceedsThree: rationals.length > 3,
    unitLength: 1,
    containerLength: VITALI_DRAW_MAX - VITALI_DRAW_MIN,
  };
}

export const vitaliModel: SceneModel<VitaliData> = {
  compute(state) {
    return vitaliData(Number(state['d']));
  },
};
