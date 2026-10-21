import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Proof by contrapositive, worked example: if n^2 is even then n is even.
 * The proof runs through the contrapositive "if n is odd then n^2 is odd",
 * where the odd case n = 2k + 1 expands to
 *   n^2 = 4k^2 + 4k + 1 = 2 * (2k^2 + 2k) + 1,
 * visibly odd. This model tabulates n, n^2 and both parities for n = 1..12
 * and evaluates the implication (n^2 even => n even) for the current n.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const CONTRAPOSITIVE_N_MIN = 1;
export const CONTRAPOSITIVE_N_MAX = 50;
export const CONTRAPOSITIVE_N_INIT = 7;

export type Parity = 'even' | 'odd';

type ContrapositiveView = 'statement' | 'contrapositive';

interface ParityRow {
  n: number;
  n2: number;
  parityN: Parity;
  parityN2: Parity;
}

export interface ContrapositiveData {
  n: number;
  n2: number;
  parityN: Parity;
  parityN2: Parity;
  /** k in n = 2k (n even) or n = 2k + 1 (n odd). */
  k: number;
  /** The view control's current value (the model carries it for the slots). */
  view: ContrapositiveView;
  /** Odd-case expansion 4k^2 + 4k + 1 (equals n^2 when n is odd). */
  oddExpansion: number;
  /** Odd-case regrouping 2 * (2k^2 + 2k) + 1 (equals n^2 when n is odd). */
  oddFactored: number;
  /** The inner term 2k^2 + 2k of the regrouping. */
  oddInner: number;
  /** (n^2 even) implies (n even), evaluated for this n. */
  implicationCheck: boolean;
  /** The n = 1..12 grid rows. */
  table: ParityRow[];
}

export function parityOf(n: number): Parity {
  return n % 2 === 0 ? 'even' : 'odd';
}

/** The contrapositive data for an arbitrary positive integer n (no clamping). */
export function contrapositiveData(n: number, view: ContrapositiveView = 'statement'): ContrapositiveData {
  const n2 = n * n;
  const parityN = parityOf(n);
  const parityN2 = parityOf(n2);
  const k = parityN === 'even' ? n / 2 : (n - 1) / 2;
  const oddInner = 2 * k * k + 2 * k;
  const oddExpansion = 4 * k * k + 4 * k + 1;
  const oddFactored = 2 * oddInner + 1;
  const implicationCheck = parityN2 !== 'even' || parityN === 'even';
  const table: ParityRow[] = [];
  for (let m = 1; m <= 12; m++) {
    table.push({ n: m, n2: m * m, parityN: parityOf(m), parityN2: parityOf(m * m) });
  }
  return {
    n,
    n2,
    parityN,
    parityN2,
    k,
    view,
    oddExpansion,
    oddFactored,
    oddInner,
    implicationCheck,
    table,
  };
}

export const contrapositiveModel: SceneModel<ContrapositiveData> = {
  compute(state) {
    const n = Math.round(
      clampNumber(Number(state['n']), CONTRAPOSITIVE_N_MIN, CONTRAPOSITIVE_N_MAX, CONTRAPOSITIVE_N_INIT),
    );
    const view: ContrapositiveView = state['view'] === 'contrapositive' ? 'contrapositive' : 'statement';
    return contrapositiveData(n, view);
  },
};
