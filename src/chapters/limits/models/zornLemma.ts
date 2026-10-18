import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Lemma 8.5.15 (Zorn's lemma): every nonempty partially
 * ordered set in which every chain has an upper bound has a maximal element.
 *
 * The model is the concrete finite poset of divisors of 12,
 *   { 1, 2, 3, 4, 6, 12 }, ordered by divisibility,
 * with its cover relations for the Hasse diagram and three maximal chains.
 * Every chain here has an upper bound (in a finite poset every chain has a
 * greatest element), and the unique maximal element is 12. The problems prove
 * the finite-poset case directly and Zorn => AC via partial choice functions
 * (the converse, AC => Zorn, is stated as idea-level only).
 *
 * Verified numbers (tests/zorn-lemma.test.ts):
 *   upperBounds([1, 2, 4, 12]) = [12];
 *   upperBounds([1, 2]) = [2, 4, 6, 12];
 *   upperBounds([1, 3]) = [3, 6, 12];
 *   upperBounds([1]) = [1, 2, 3, 4, 6, 12];
 *   maximalElements() = [12];
 *   each of the three chains is a genuine chain (consecutive divisibility)
 *     and each has exactly one upper bound, 12.
 */

export const CHAIN_MIN = 0;
export const CHAIN_MAX = 2;
export const CHAIN_INIT = 0;

/** The poset: divisors of 12, ordered by divisibility. */
export const ELEMENTS: readonly number[] = [1, 2, 3, 4, 6, 12];

/**
 * Cover relations a < b (a divides b, b/a prime): the Hasse diagram edges.
 */
export const COVERS: ReadonlyArray<readonly [number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 6],
  [3, 6],
  [4, 12],
  [6, 12],
];

/** Three maximal chains, one per selectable slider position. */
export const CHAINS: ReadonlyArray<readonly number[]> = [
  [1, 2, 4, 12],
  [1, 2, 6, 12],
  [1, 3, 6, 12],
];

/**
 * Upper bounds of a chain inside the poset:
 * { x in elements : every c in chain divides x }.
 */
export function upperBounds(
  chain: readonly number[],
  elements: readonly number[] = ELEMENTS,
): number[] {
  return elements.filter((x) => chain.every((c) => x % c === 0));
}

/**
 * Maximal elements of the poset: elements that are the lower end of no cover
 * relation (in a finite poset these are exactly the elements with nothing
 * strictly above them).
 */
export function maximalElements(
  covers: ReadonlyArray<readonly [number, number]> = COVERS,
  elements: readonly number[] = ELEMENTS,
): number[] {
  const hasStrictlyAbove = new Set(covers.map(([a]) => a));
  return elements.filter((x) => !hasStrictlyAbove.has(x));
}

export interface ZornLemmaData {
  elements: readonly number[];
  covers: ReadonlyArray<readonly [number, number]>;
  chains: ReadonlyArray<readonly number[]>;
  /** The selected chain index (0..2). */
  selected: number;
  /** The selected chain itself. */
  selectedChain: readonly number[];
  /** Upper bounds of the selected chain. */
  upperBounds: number[];
  /** Maximal elements of the poset. */
  maximal: number[];
}

/** Pure: no DOM, no d3. */
export function zornLemmaData(selected: number): ZornLemmaData {
  const clamped = Math.round(Math.min(CHAIN_MAX, Math.max(CHAIN_MIN, selected)));
  const selectedChain = CHAINS[clamped] ?? CHAINS[CHAIN_INIT] ?? [];
  return {
    elements: ELEMENTS,
    covers: COVERS,
    chains: CHAINS,
    selected: clamped,
    selectedChain,
    upperBounds: upperBounds(selectedChain),
    maximal: maximalElements(),
  };
}

export const zornLemmaModel: SceneModel<ZornLemmaData> = {
  compute(state) {
    const raw = Number(state['chain']);
    const selected = Number.isFinite(raw) ? raw : CHAIN_INIT;
    return zornLemmaData(selected);
  },
};
