import type { SceneModel } from '../../../contracts';

/**
 * The Arzela-Ascoli theorem, live: the family
 *   f_a(x) = a * sin(2x),  |a| <= 3/4,
 * on K = [0, 1] is uniformly bounded (by 3/4) and uniformly
 * 3/2-Lipschitz — hence equicontinuous — so by Arzela-Ascoli it is
 * relatively compact in C([0, 1]). The demo subsequence
 *   a_k = 1/2 + (-1)^k / (k + 2)  ->  1/2
 * converges uniformly to f* = (1/2) sin(2x); the sup-norm error is
 * exact: ||f_{a_k} - f*||_inf = |a_k - 1/2| = 1/(k + 2), because
 * |sin(2x)| attains 1 at x = pi/4 in [0, 1].
 *
 * NOTE on the family range: the demo sequence leaves [-1/2, 1/2]
 * (a_2 = 3/4), so the family is taken as |a| <= 3/4 — the smallest
 * symmetric interval containing every a_k — with uniform Lipschitz
 * constant 3/2 and uniform bound 3/4. The theorem's content is
 * unchanged.
 *
 * The contrast family g_n(x) = x^n is not equicontinuous at 1; its
 * pointwise limit jumps (0 on [0, 1), 1 at 1), so no subsequence can
 * converge uniformly — a uniform limit of continuous functions is
 * continuous. Pairwise sup distances on the sample grid stay large.
 *
 * Verified identities (tests/arzela-ascoli.test.ts):
 *   seqA(1) = 1/6, seqA(2) = 3/4, seqA(12) = 1/2 + 1/14;
 *   supErrors[k] = 1/(k + 2) exactly for k = 1..12, strictly
 *     decreasing, supErrors[11] = 1/14 = 0.071428... < 0.08;
 *   max lipBound over k = 1..12 is 1.5, attained at k = 2;
 *   contrastPairDist on the 401-point grid is 0.472470..., attained
 *     at the pairs (2, 8) and (8, 32), hence >= 0.2.
 */

interface ArzelaCurve {
  /** 1-based member index k. */
  k: number;
  /** Amplitude a_k. */
  a: number;
  /** f_{a_k} sampled on the shared grid. */
  samples: number[];
  /** Uniform Lipschitz constant 2|a_k|. */
  lip: number;
}

export interface ArzelaData {
  members: number;
  /** Shared grid on [0, 1]. */
  xs: number[];
  /** The subsequence members f_{a_k}, k = 1..members. */
  curves: ArzelaCurve[];
  /** Limit amplitude 1/2. */
  limitA: number;
  /** f* = (1/2) sin(2x) sampled on the grid. */
  limit: number[];
  /** ||f_{a_k} - f*||_inf = 1/(k + 2), k = 1..members. */
  supErrors: number[];
  /** Contrast exponents. */
  contrastNs: readonly number[];
  /** x^n sampled on the grid, one array per exponent. */
  contrast: number[][];
  /** Min over exponent pairs of the grid sup norm of the difference. */
  contrastPairDist: number;
}

export const MIN_MEMBERS = 2;
export const MAX_MEMBERS = 12;
export const DEFAULT_MEMBERS = 6;
export const GRID_N = 401;
/** Limit amplitude: a_k -> LIMIT_A. */
export const LIMIT_A = 1 / 2;
/** Family bound: |a| <= FAMILY_B. */
export const FAMILY_B = 3 / 4;
/** Uniform Lipschitz constant: |f_a'| = 2|a||cos 2x| <= 2 * FAMILY_B. */
export const LIP_UNIFORM = 3 / 2;
export const CONTRAST_NS: readonly number[] = [2, 8, 32];

/** Demo subsequence amplitude: a_k = 1/2 + (-1)^k / (k + 2), k >= 1. */
export function seqA(k: number): number {
  return LIMIT_A + (k % 2 === 0 ? 1 : -1) / (k + 2);
}

/** Family member: f_a(x) = a * sin(2x). */
export function familyF(a: number, x: number): number {
  return a * Math.sin(2 * x);
}

/** Uniform Lipschitz constant of f_a: sup |f_a'| = 2|a|. */
export function lipBound(a: number): number {
  return 2 * Math.abs(a);
}

/** Exact sup-norm error: ||f_{a_k} - f*||_inf = |a_k - 1/2| = 1/(k+2). */
export function supError(k: number): number {
  return Math.abs(seqA(k) - LIMIT_A);
}

function gridXs(): number[] {
  const xs: number[] = new Array(GRID_N);
  for (let j = 0; j < GRID_N; j++) xs[j] = j / (GRID_N - 1);
  return xs;
}

/** Grid sup norm of the difference of two contrast powers. */
function pairDist(n: number, m: number, xs: number[]): number {
  let mx = 0;
  for (const x of xs) {
    const d = Math.abs(Math.pow(x, n) - Math.pow(x, m));
    if (d > mx) mx = d;
  }
  return mx;
}

/**
 * Build the Arzela-Ascoli demo data for the first `members` subsequence
 * members. Pure: no DOM, no d3.
 */
export function buildArzela(members: number): ArzelaData {
  const xs = gridXs();
  const curves: ArzelaCurve[] = [];
  const supErrors: number[] = [];
  for (let k = 1; k <= members; k++) {
    const a = seqA(k);
    const samples = xs.map((x) => familyF(a, x));
    curves.push({ k, a, samples, lip: lipBound(a) });
    supErrors.push(supError(k));
  }
  const limit = xs.map((x) => familyF(LIMIT_A, x));
  const contrast = CONTRAST_NS.map((n) => xs.map((x) => Math.pow(x, n)));
  let contrastPairDist = Infinity;
  for (let i = 0; i < CONTRAST_NS.length; i++) {
    for (let j = i + 1; j < CONTRAST_NS.length; j++) {
      const d = pairDist(CONTRAST_NS[i] ?? 0, CONTRAST_NS[j] ?? 0, xs);
      if (d < contrastPairDist) contrastPairDist = d;
    }
  }
  return {
    members,
    xs,
    curves,
    limitA: LIMIT_A,
    limit,
    supErrors,
    contrastNs: CONTRAST_NS,
    contrast,
    contrastPairDist,
  };
}

export const arzelaAscoliModel: SceneModel<ArzelaData> = {
  compute(state) {
    const raw = Number(state['members']);
    const members = Number.isFinite(raw)
      ? Math.min(MAX_MEMBERS, Math.max(MIN_MEMBERS, Math.floor(raw)))
      : DEFAULT_MEMBERS;
    return buildArzela(members);
  },
};
