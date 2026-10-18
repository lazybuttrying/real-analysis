import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Axiom 8.1 (axiom of choice): given any family of nonempty
 * sets, there is a choice function picking one element from each set.
 *
 * The model is a concrete finite family where no axiom is needed: m bins,
 * bin i (0-indexed) holding k_i = 2 + ((seed*i + 1) mod 4) balls (so 2..5),
 * with the deterministic "choice" c_i = (seed*(i+2)) mod k_i. The scene draws
 * the bins and highlights the chosen ball in each; the problems prove the
 * finite case by hand and the classic equivalences (nonempty products,
 * right inverses of surjections).
 *
 * Verified numbers (tests/axiom-of-choice.test.ts):
 *   (m, seed) = (3, 1): bins [3, 4, 5], choices [2, 3, 4];
 *   (m, seed) = (5, 5): bins [3, 4, 5, 2, 3], choices [1, 3, 0, 1, 0];
 *   (m, seed) = (4, 2): bins [3, 5, 3, 5], choices [1, 1, 2, 0];
 *   every bin size is in [2, 5] and every choice index satisfies
 *     0 <= c_i < k_i, for all m in 2..5 and seed in 1..5.
 */

export const M_MIN = 2;
export const M_MAX = 5;
export const M_INIT = 3;
export const SEED_MIN = 1;
export const SEED_MAX = 5;
export const SEED_INIT = 1;

/**
 * Ball count of bin i (0-indexed): k_i = 2 + ((seed*i + 1) mod 4).
 * Always in [2, 5].
 */
export function binSize(i: number, seed: number): number {
  return 2 + ((seed * i + 1) % 4);
}

/**
 * The chosen ball index in bin i: c_i = (seed*(i+2)) mod k_i.
 * Always satisfies 0 <= c_i < k_i.
 */
export function choiceIndex(i: number, seed: number): number {
  return (seed * (i + 2)) % binSize(i, seed);
}

export interface AxiomOfChoiceData {
  /** Number of bins (sets in the family). */
  m: number;
  /** Seed driving the deterministic family and choices. */
  seed: number;
  /** Ball counts per bin. */
  bins: number[];
  /** Chosen ball index per bin. */
  choices: number[];
}

/** Pure: no DOM, no d3. */
export function axiomOfChoiceData(m: number, seed: number): AxiomOfChoiceData {
  const bins: number[] = [];
  const choices: number[] = [];
  for (let i = 0; i < m; i++) {
    bins.push(binSize(i, seed));
    choices.push(choiceIndex(i, seed));
  }
  return { m, seed, bins, choices };
}

export const axiomOfChoiceModel: SceneModel<AxiomOfChoiceData> = {
  compute(state) {
    const rawM = Number(state['m']);
    const rawSeed = Number(state['seed']);
    const m = Number.isFinite(rawM)
      ? Math.round(Math.min(M_MAX, Math.max(M_MIN, rawM)))
      : M_INIT;
    const seed = Number.isFinite(rawSeed)
      ? Math.round(Math.min(SEED_MAX, Math.max(SEED_MIN, rawSeed)))
      : SEED_INIT;
    return axiomOfChoiceData(m, seed);
  },
};
