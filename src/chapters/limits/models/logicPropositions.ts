import type { SceneModel } from '../../../contracts';

/**
 * Truth tables for the four basic connectives.
 *
 * Rows are the (P, Q) assignments in the canonical order
 * (T,T), (T,F), (F,T), (F,F). For each row we compute the selected
 * connective, the contrapositive ((not Q) -> (not P)) and the converse
 * (Q -> P). The two agreement flags are computed honestly by brute force
 * over the four rows: only 'implies' agrees row-by-row with its
 * contrapositive, while 'and', 'or' and 'iff' agree row-by-row with
 * their converse (symmetry), and 'implies' does not.
 *
 * Pure computation: no DOM, d3, or three.
 */

export type Connective = 'and' | 'or' | 'implies' | 'iff';

export const CONNECTIVE_OPTIONS: readonly Connective[] = ['and', 'or', 'implies', 'iff'];
export const CONNECTIVE_INIT: Connective = 'implies';
export const CONTRAPOSITIVE_INIT = true;

export interface TruthRow {
  p: boolean;
  q: boolean;
  notP: boolean;
  notQ: boolean;
  /** P <op> Q for the selected connective. */
  main: boolean;
  /** (not Q) -> (not P): the contrapositive of the implication. */
  contrapositive: boolean;
  /** Q -> P: the converse of the implication. */
  converse: boolean;
}

export interface LogicPropositionsData {
  connective: Connective;
  showContrapositive: boolean;
  rows: readonly TruthRow[];
  /** Honest row-by-row check: main vs. the contrapositive column. True only for 'implies'. */
  allRowsMainEqualsContrapositive: boolean;
  /** Honest row-by-row check: main vs. the converse column. False for every connective. */
  mainEqualsConverseAllRows: boolean;
}

function applyConnective(connective: Connective, p: boolean, q: boolean): boolean {
  switch (connective) {
    case 'and':
      return p && q;
    case 'or':
      return p || q;
    case 'implies':
      return !p || q;
    case 'iff':
      return p === q;
  }
}

/** The full 4-row truth table for one connective. Usable by tests without the model wrapper. */
export function truthTable(connective: Connective): readonly TruthRow[] {
  const assignments: ReadonlyArray<readonly [boolean, boolean]> = [
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ];
  return assignments.map(([p, q]) => {
    const notP = !p;
    const notQ = !q;
    return {
      p,
      q,
      notP,
      notQ,
      main: applyConnective(connective, p, q),
      // (notQ) -> (notP) = ¬(¬Q) ∨ (¬P) = Q ∨ (¬P).
      contrapositive: q || notP,
      // Q -> P = (¬Q) ∨ P.
      converse: notQ || p,
    };
  });
}

function isConnective(value: unknown): value is Connective {
  return value === 'and' || value === 'or' || value === 'implies' || value === 'iff';
}

export function logicPropositionsValues(
  connective: Connective,
  showContrapositive: boolean,
): LogicPropositionsData {
  const rows = truthTable(connective);
  return {
    connective,
    showContrapositive,
    rows,
    allRowsMainEqualsContrapositive: rows.every((row) => row.main === row.contrapositive),
    mainEqualsConverseAllRows: rows.every((row) => row.main === row.converse),
  };
}

export const logicPropositionsModel: SceneModel<LogicPropositionsData> = {
  compute(state) {
    const connective = isConnective(state['connective']) ? state['connective'] : CONNECTIVE_INIT;
    const toggle = state['contrapositive'];
    const showContrapositive = typeof toggle === 'boolean' ? toggle : CONTRAPOSITIVE_INIT;
    return logicPropositionsValues(connective, showContrapositive);
  },
};
