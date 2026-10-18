import type { SceneModel } from '../../../contracts';

/**
 * Tauber's theorem, live: the contrast between two alternating series.
 *
 * Series G (Grandi): a_n = (-1)^n, n >= 0. Its Abel sum is the closed form
 *   A_G(r) = sum_{n>=0} (-1)^n r^n = 1/(1+r) -> 1/2  (r -> 1^-),
 * but its partial sums oscillate 1, 0, 1, 0, ... forever (diverges), and
 * |n a_n| = n -> infinity: the hypothesis a_n = o(1/n) FAILS.
 *
 * Series D: d_n = (-1)^n / ((n+1) ln(n+2)), n >= 0. Then
 *   |n d_n| = n / ((n+1) ln(n+2)) -> 0  (o(1/n) holds),
 * sum d_n converges (conditionally) by the alternating series test, and its
 * Abel sum equals its ordinary sum (both Abel's and Tauber's theorem agree).
 *
 * Verified numbers (tests/tauber.test.ts):
 *   abelGrandi(0.9) = 1/1.9 = 0.5263157894736842 (exact in IEEE doubles);
 *   abelGrandi(0.999) = 1/1.999 = 0.5002501250625312;
 *   Grandi partial sums: 1, 0, 1, 0, ... exactly;
 *   |n d_n|: 0.21407671998787478 (n=100), 0.1445783891669132 (n=1000),
 *     0.1085604070758102 (n=10000) -- decreasing, below 0.5 / 0.15 / 0.11;
 *   S_2000 = 1.1364157756120048, |S_4000 - S_2000| = 1.7808884543211467e-5;
 *   A_D(0.999) = 1.1366605889895591, |A_D(0.999) - S_4000| = 2.270024930111081e-4;
 *   S_D (N=20000) = 1.1364461306959979.
 */

export const MIN_R = 50;
export const MAX_R = 99;
export const DEFAULT_R = 90;
/** Terms used for the Abel curve A_D(r) and the partial-sum readouts. */
export const ABEL_TERMS = 4000;
/** Terms for the horizontal dashed line marking the ordinary sum S_D. */
export const SUM_TERMS = 20000;
/** r-grid domain of the chart. */
export const R_MIN = 0.5;
export const R_MAX = 0.999;
export const GRID_R = 121;
/** Probe indices for the o(1/n) check. */
export const N_PROBES = [100, 1000, 10000] as const;

/** The n-th term of series D: d_n = (-1)^n / ((n+1) ln(n+2)). */
export function dTerm(n: number): number {
  const sign = n % 2 === 0 ? 1 : -1;
  return sign / ((n + 1) * Math.log(n + 2));
}

/** Closed form of Grandi's Abel sum: A_G(r) = 1/(1+r). */
export function abelGrandi(r: number): number {
  return 1 / (1 + r);
}

/** Grandi's N-th partial sum: 1 for even N, 0 for odd N. */
export function grandiPartial(n: number): number {
  return n % 2 === 0 ? 1 : 0;
}

/** |n a_n| for Grandi's a_n = (-1)^n: exactly n -- never tends to 0. */
export function grandiTermCheck(n: number): number {
  return n;
}

/** |n d_n| = n / ((n+1) ln(n+2)) -- the o(1/n) check for series D. */
export function nTimesDN(n: number): number {
  return n / ((n + 1) * Math.log(n + 2));
}

/** Abel sum of series D with ABEL_TERMS terms: A_D(r) = sum d_n r^n. */
export function abelD(r: number): number {
  let sum = 0;
  let rn = 1;
  for (let n = 0; n < ABEL_TERMS; n++) {
    sum += dTerm(n) * rn;
    rn *= r;
  }
  return sum;
}

/** Partial sum of series D with n terms: S_n = sum_{k=0}^{n-1} d_k. */
export function partialSumD(n: number): number {
  let s = 0;
  for (let k = 0; k < n; k++) s += dTerm(k);
  return s;
}

/**
 * The ordinary sum of D, approximated with SUM_TERMS terms. Deterministic,
 * hence safe to memoize at module level.
 */
let cachedSumD: number | undefined;
export function sumD(): number {
  if (cachedSumD === undefined) cachedSumD = partialSumD(SUM_TERMS);
  return cachedSumD;
}

export interface TauberSample {
  r: number;
  y: number;
}

export interface TauberData {
  /** r = R/100, the slider position. */
  r: number;
  /** A_G on the r-grid (closed form). */
  grandiCurve: TauberSample[];
  /** A_D on the r-grid (computed). */
  dCurve: TauberSample[];
  /** A_G(r) at the slider. */
  abelGrandiAtR: number;
  /** A_D(r) at the slider. */
  abelDAtR: number;
  /** Ordinary sum S_D (SUM_TERMS terms): the dashed level for D. */
  sumD: number;
  /** Partial sum S_4000 of D. */
  partialSumD4000: number;
  /** |n d_n| at the probe indices -- the o(1/n) check that holds. */
  ndProbes: { n: number; value: number }[];
  /** |n a_n| for Grandi at the probe indices -- the check that fails. */
  grandiProbes: { n: number; value: number }[];
}

/** Pure: no DOM, no d3. */
export function tauberData(rPercent: number): TauberData {
  const r = Math.min(MAX_R, Math.max(MIN_R, Math.round(rPercent))) / 100;
  const grandiCurve: TauberSample[] = [];
  const dCurve: TauberSample[] = [];
  for (let i = 0; i < GRID_R; i++) {
    const rr = R_MIN + ((R_MAX - R_MIN) * i) / (GRID_R - 1);
    grandiCurve.push({ r: rr, y: abelGrandi(rr) });
    dCurve.push({ r: rr, y: abelD(rr) });
  }
  return {
    r,
    grandiCurve,
    dCurve,
    abelGrandiAtR: abelGrandi(r),
    abelDAtR: abelD(r),
    sumD: sumD(),
    partialSumD4000: partialSumD(ABEL_TERMS),
    ndProbes: N_PROBES.map((n) => ({ n, value: nTimesDN(n) })),
    grandiProbes: N_PROBES.map((n) => ({ n, value: grandiTermCheck(n) })),
  };
}

export const tauberModel: SceneModel<TauberData> = {
  compute(state) {
    const raw = Number(state['R']);
    const rPercent = Number.isFinite(raw) ? raw : DEFAULT_R;
    return tauberData(rPercent);
  },
};
