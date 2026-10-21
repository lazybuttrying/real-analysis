import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Strong induction, worked example: every integer n >= 2 is a product of
 * primes. The induction hypothesis at n may use P(k) for ALL 2 <= k < n,
 * not just P(n - 1) — and it needs to: if n = a * b is composite, its
 * factors a and b can both be far smaller than n - 1.
 *
 * The model splits n repeatedly by its smallest prime factor:
 * factorTree(n) = { value: n, children: [factorTree(a), factorTree(n / a)] }
 * where a is the smallest prime factor of n; a prime node has no children.
 * The leaves are the prime factorization of n, in nondecreasing order.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const STRONG_N_MIN = 2;
export const STRONG_N_MAX = 60;
export const STRONG_N_INIT = 30;

/** True iff m is prime (trial division up to sqrt(m)). */
export function isPrime(m: number): boolean {
  if (!Number.isInteger(m) || m < 2) return false;
  for (let d = 2; d * d <= m; d++) {
    if (m % d === 0) return false;
  }
  return true;
}

/** The smallest prime factor of m >= 2 (m itself when m is prime). */
export function smallestPrimeFactor(m: number): number {
  for (let d = 2; d * d <= m; d++) {
    if (m % d === 0) return d;
  }
  return m;
}

/**
 * The prime factors of n with multiplicity, in nondecreasing order:
 * factorize(30) = [2, 3, 5], factorize(36) = [2, 2, 3, 3].
 */
export function factorize(n: number): number[] {
  const factors: number[] = [];
  let m = n;
  while (m >= 2) {
    const a = smallestPrimeFactor(m);
    factors.push(a);
    m = m / a;
  }
  return factors;
}

export interface FactorNode {
  value: number;
  isPrime: boolean;
  /** Empty for primes; otherwise [factorTree(a), factorTree(n / a)]. */
  children: FactorNode[];
}

export function factorTree(n: number): FactorNode {
  if (isPrime(n)) return { value: n, isPrime: true, children: [] };
  const a = smallestPrimeFactor(n);
  return { value: n, isPrime: false, children: [factorTree(a), factorTree(n / a)] };
}

/** The values of the leaves of a factor tree, left to right. */
export function treeLeaves(node: FactorNode): number[] {
  if (node.children.length === 0) return [node.value];
  return node.children.flatMap(treeLeaves);
}

/** Number of nodes in a factor tree. */
function treeNodeCount(node: FactorNode): number {
  return 1 + node.children.reduce((sum, c) => sum + treeNodeCount(c), 0);
}

export interface StrongInductionData {
  n: number;
  nIsPrime: boolean;
  /** Prime factorization with multiplicity, nondecreasing. */
  factors: number[];
  /** Product of the factors (equals n). */
  factorsProduct: number;
  /** The recursive splitting tree rooted at n. */
  tree: FactorNode;
  /** Leaves of the tree, equal to `factors`. */
  leaves: number[];
  /** Product of the leaves (equals n). */
  leavesProduct: number;
  /** For composite n: the first split n = a * b. For prime n: null. */
  split: { a: number; b: number } | null;
  /** Total node count of the tree (used by the viz for layout). */
  nodeCount: number;
}

/** The strong-induction data for an arbitrary integer n >= 2 (no clamping). */
export function strongInductionValues(n: number): StrongInductionData {
  const factors = factorize(n);
  const tree = factorTree(n);
  const leaves = treeLeaves(tree);
  return {
    n,
    nIsPrime: isPrime(n),
    factors,
    factorsProduct: factors.reduce((acc, f) => acc * f, 1),
    tree,
    leaves,
    leavesProduct: leaves.reduce((acc, f) => acc * f, 1),
    split: isPrime(n) ? null : { a: smallestPrimeFactor(n), b: n / smallestPrimeFactor(n) },
    nodeCount: treeNodeCount(tree),
  };
}

export const strongInductionModel: SceneModel<StrongInductionData> = {
  compute(state) {
    const n = Math.round(
      clampNumber(Number(state['n']), STRONG_N_MIN, STRONG_N_MAX, STRONG_N_INIT),
    );
    return strongInductionValues(n);
  },
};
