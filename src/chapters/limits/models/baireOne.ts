import type { SceneModel } from '../../../contracts';

/**
 * Baire class 1, live: Thomae's function as a pointwise limit of continuous
 * tent-sum approximants.
 *
 * Thomae's function T on [0, 1]: T(p/q) = 1/q for p/q in lowest terms,
 * T(x) = 0 for irrational x (with T(0) = T(1) = 1, i.e. 0/1 and 1/1).
 * The approximant is
 *   f_n(x) = sum_{1<=q<=n} sum_{0<=p<=q, gcd(p,q)=1} (1/q) tri(n^3 (x - p/q)),
 *   tri(t) = max(0, 1 - |t|).
 *
 * HONEST DEVIATION (spec correction, verified numerically): a naive double
 * sum over ALL pairs (p, q) counts every rational many times (1/2 = 2/4 =
 * 3/6 = ...), stacking heights 1/2 + 1/4 + 1/6 + ... which diverges at 1/2,
 * so it cannot converge to Thomae. The model sums over REDUCED fractions
 * only (the Farey set of order n); then f_n(1/2) = 0.5 exactly for n >= 2.
 *
 * Why it works. Each tent has half-width 1/n^3 (support width 2/n^3).
 * Distinct reduced fractions with denominators <= n differ by >= 1/(n(n-1))
 * (if p/q != r/s are reduced with q,s <= n, then |p/q - r/s| = |ps-qr|/(qs)
 * >= 1/(qs); qs <= n(n-1) unless q = s = n, in which case |ps - qr| >= n so
 * the quotient is >= 1/n >= 1/(n(n-1))), and 2/n^3 < 1/(n(n-1)) for every
 * n >= 2 since 2(n-1) < n^2. Hence the tents are pairwise disjoint: f_n is a
 * finite sum of continuous tents, hence continuous, and at most one tent is
 * nonzero at any x.
 * At x = a/b reduced, for n >= b the tent at (a,b) contributes exactly 1/b
 * and no other tent touches x, so f_n(a/b) = 1/b = T(a/b) eventually.
 * At irrational x: given eps > 0 pick Q0 > 1/eps; the finitely many reduced
 * rationals with q <= Q0 stay >= c > 0 away from x, so for n^3 c > 1 those
 * tents miss x, while every other tent has height <= 1/Q0 < eps; thus
 * f_n(x) -> 0 = T(x).
 *
 * Verified identities (tests/baire-1.test.ts):
 *   max over an 8001-point grid of (number of tents with tri(n^3(x-p/q)) > 0)
 *   is 1 for every n = 2..12 (pairwise disjoint tents);
 *   min spacing of the Farey set of order n equals 1/(n(n-1)) for n = 2..12,
 *   strictly larger than the tent width 2/n^3;
 *   f_n(1/2) = 0.5 exactly for n >= 2; f_n(1/3) = 1/3 exactly for n >= 3
 *   (f_2(1/3) = 0: no tent reaches 1/3 yet);
 *   f_12(sqrt(2)/2) = 0 and f_12(pi/4) = 0 (both < 0.05);
 *   f_n >= 0 everywhere on the grid;
 *   bump counts: n = 5 -> 11 tents, n = 12 -> 47 tents.
 */

export interface BaireOneSample {
  x: number;
  y: number;
}

interface BaireOneProbe {
  /** Display label, e.g. '1/2'. */
  label: string;
  x: number;
  /** Exact value of Thomae's function at x. */
  exact: number;
  /** Value of the approximant f_n at x. */
  approx: number;
}

export interface BaireOneData {
  n: number;
  /** f_n sampled on [0, 1]. */
  curve: BaireOneSample[];
  /** f_n vs Thomae at the probe points 1/2, sqrt(2)/2, 1/3. */
  probes: BaireOneProbe[];
  /** Number of disjoint tents in the sum. */
  bumpCount: number;
  /** Max of f_n on the grid (attained at x = 0 and x = 1). */
  peak: number;
}

export const MIN_N = 2;
export const MAX_N = 12;
export const DEFAULT_N = 5;
/** Samples on [0, 1]: 4001 points. */
export const GRID_POINTS = 4001;

/** The tent function tri(t) = max(0, 1 - |t|). */
export function tri(t: number): number {
  return Math.max(0, 1 - Math.abs(t));
}

/** Greatest common divisor of two integers. */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x;
}

interface ReducedRational {
  p: number;
  q: number;
}

/**
 * The Farey set of order n: reduced fractions p/q in [0, 1] with
 * 1 <= q <= n. Includes 0 = 0/1 and 1 = 1/1 (Thomae gives 1 there).
 */
export function reducedRationals(n: number): ReducedRational[] {
  const out: ReducedRational[] = [];
  for (let q = 1; q <= n; q++) {
    for (let p = 0; p <= q; p++) {
      if (gcd(p, q) === 1) out.push({ p, q });
    }
  }
  return out;
}

/**
 * Thomae's approximant f_n(x): sum of (1/q) tri(n^3 (x - p/q)) over the
 * Farey set of order n. The tents are disjoint, so at most one term is
 * nonzero.
 */
export function thomaeApprox(x: number, n: number): number {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const w = nn * nn * nn;
  let sum = 0;
  for (const { p, q } of reducedRationals(nn)) {
    const v = tri(w * (x - p / q));
    if (v > 0) sum += v / q;
  }
  return sum;
}

/**
 * Number of tents with tri(n^3 (x - p/q)) > 0 at x. Pure; the tests use it
 * to verify the tents are pairwise disjoint (max <= 1 on a fine grid).
 */
export function activeBumpCount(x: number, n: number): number {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const w = nn * nn * nn;
  let count = 0;
  for (const { p, q } of reducedRationals(nn)) {
    if (tri(w * (x - p / q)) > 0) count++;
  }
  return count;
}

/** Pure: no DOM, no d3. */
export function baireOneData(n: number): BaireOneData {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const curve: BaireOneSample[] = [];
  let peak = 0;
  for (let i = 0; i < GRID_POINTS; i++) {
    const x = i / (GRID_POINTS - 1);
    const y = thomaeApprox(x, nn);
    curve.push({ x, y });
    if (y > peak) peak = y;
  }
  const probeDefs = [
    { label: '1/2', x: 0.5, exact: 0.5 },
    { label: '√2/2', x: Math.SQRT2 / 2, exact: 0 },
    { label: '1/3', x: 1 / 3, exact: 1 / 3 },
  ];
  const probes: BaireOneProbe[] = probeDefs.map((d) => ({
    ...d,
    approx: thomaeApprox(d.x, nn),
  }));
  return { n: nn, curve, probes, bumpCount: reducedRationals(nn).length, peak };
}

export const baireOneModel: SceneModel<BaireOneData> = {
  compute(state) {
    const raw = Number(state['N']);
    const n = Number.isFinite(raw) ? raw : DEFAULT_N;
    return baireOneData(n);
  },
};
