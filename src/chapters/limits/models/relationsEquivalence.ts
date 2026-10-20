import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Congruence modulo n on the universe U = {0, 1, ..., 3n - 1}:
 *   a ~ b  <=>  n divides (a - b)  <=>  a and b leave the same remainder.
 *
 * The model builds the n classes class r = { r, r + n, r + 2n } and then
 * brute-forces the three equivalence-relation axioms over every element,
 * pair, and triple of U, plus the partition property (classes pairwise
 * disjoint, union equal to U). Every reported claim is therefore verified
 * by exhaustion, not by argument.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const EQUIVALENCE_N_MIN = 2;
export const EQUIVALENCE_N_MAX = 8;
export const EQUIVALENCE_N_INIT = 4;

export interface CongruenceData {
  n: number;
  /** Classes, one per remainder r: the sorted triple [r, r + n, r + 2n]. */
  classes: number[][];
  /** Axiom check results (all true for congruence, verified by brute force). */
  reflexive: boolean;
  symmetric: boolean;
  transitive: boolean;
  /** Number of element checks passed: |U| = 3n. */
  reflexiveCount: number;
  /** Number of pair checks passed: (3n)^2. */
  symmetricPairs: number;
  /** Number of triple checks passed: (3n)^3. */
  transitiveTriples: number;
  /** The classes are pairwise disjoint (brute-force verified). */
  disjoint: boolean;
  /** Every element of U lies in some class (brute-force verified). */
  coversAll: boolean;
  /** One size per class (always 3 for congruence on U). */
  classSizes: number[];
}

/**
 * Mathematical mod: ((a - b) mod n == 0) for possibly negative differences.
 */
export function relatedMod(a: number, b: number, n: number): boolean {
  return (((a - b) % n) + n) % n === 0;
}

/**
 * The congruence data for a modulus n (no clamping): used by the scene
 * model (n in [2, 8]) and directly by tests.
 */
export function congruenceData(n: number): CongruenceData {
  const m = 3 * n;
  const classes: number[][] = [];
  for (let r = 0; r < n; r++) {
    classes.push([r, r + n, r + 2 * n]);
  }

  // Reflexivity: a ~ a for every a in U.
  let reflexive = true;
  for (let a = 0; a < m; a++) {
    if (!relatedMod(a, a, n)) reflexive = false;
  }

  // Symmetry: a ~ b implies b ~ a, for every pair in U x U.
  let symmetric = true;
  for (let a = 0; a < m; a++) {
    for (let b = 0; b < m; b++) {
      if (relatedMod(a, b, n) && !relatedMod(b, a, n)) symmetric = false;
    }
  }

  // Transitivity: a ~ b and b ~ c imply a ~ c, for every triple.
  let transitive = true;
  for (let a = 0; a < m; a++) {
    for (let b = 0; b < m; b++) {
      for (let c = 0; c < m; c++) {
        if (relatedMod(a, b, n) && relatedMod(b, c, n) && !relatedMod(a, c, n)) {
          transitive = false;
        }
      }
    }
  }

  // Partition: the classes are pairwise disjoint.
  let disjoint = true;
  for (let r = 0; r < n; r++) {
    for (let s = r + 1; s < n; s++) {
      for (const x of classes[r] as number[]) {
        if ((classes[s] as number[]).includes(x)) disjoint = false;
      }
    }
  }

  // Partition: every element of U sits in exactly one class.
  const seen = new Set<number>();
  let coversAll = true;
  for (const cls of classes) {
    for (const x of cls) {
      if (x < 0 || x >= m) coversAll = false;
      seen.add(x);
    }
  }
  if (seen.size !== m) coversAll = false;

  return {
    n,
    classes,
    reflexive,
    symmetric,
    transitive,
    reflexiveCount: m,
    symmetricPairs: m * m,
    transitiveTriples: m * m * m,
    disjoint,
    coversAll,
    classSizes: classes.map((cls) => cls.length),
  };
}

export const relationsEquivalenceModel: SceneModel<CongruenceData> = {
  compute(state) {
    const n = clampNumber(
      Number(state['n']),
      EQUIVALENCE_N_MIN,
      EQUIVALENCE_N_MAX,
      EQUIVALENCE_N_INIT,
    );
    return congruenceData(Math.round(n));
  },
};
