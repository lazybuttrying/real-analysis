import type { SceneModel } from '../../../contracts';

/**
 * Cantor's theorem (Tao, Thm 8.3.1): |X| < |P(X)| for every set X.
 *
 * The live picture: n "subsets" of {0, ..., n-1}, given by the characteristic
 * rows table[i][j] = (i+j) % 2. The diagonal is read off and flipped; the
 * flipped row provably differs from every listed row (row i differs at
 * column i, and in fact at the first column j with flipped[j] != table[i][j]),
 * so it is a "subset" equal to none of the n listed ones. This is the finite
 * shadow of the proof that no f: X -> P(X) can be surjective.
 *
 * Verified numbers (tests/cantor-theorem.test.ts):
 *   n = 5: diagonal = [0,0,0,0,0] (since (i+i) % 2 = 0 always),
 *     flipped = [1,1,1,1,1],
 *     diffColumn = [0,1,0,1,0] (first j with flipped[j] != table[i][j]);
 *   in general diffColumn(i) = 0 for even i, 1 for odd i, and column i itself
 *     always works because flipped[i] = 1 - table[i][i] != table[i][i].
 */

export const MIN_N = 3;
export const MAX_N = 8;
export const DEFAULT_N = 5;

/** Characteristic cell of "subset" i at element j: table[i][j] = (i+j) % 2. */
export function tableCell(i: number, j: number): number {
  return (i + j) % 2;
}

export interface CantorTheoremData {
  n: number;
  table: number[][];
  diagonal: number[];
  flipped: number[];
}

/**
 * First column j where the flipped diagonal differs from row i.
 * Always exists: j = i works, since flipped[i] = 1 - table[i][i].
 * Returns -1 only in the impossible case (kept total for safety).
 */
export function diffColumn(table: number[][], flipped: number[], i: number): number {
  const row = table[i] as number[];
  for (let j = 0; j < flipped.length; j++) {
    if ((flipped[j] as number) !== (row[j] as number)) return j;
  }
  return -1;
}

/** Pure: no DOM, no d3. */
export function cantorTheoremData(nRaw: number): CantorTheoremData {
  const n = Number.isFinite(nRaw)
    ? Math.min(MAX_N, Math.max(MIN_N, Math.round(nRaw)))
    : DEFAULT_N;
  const table: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) row.push(tableCell(i, j));
    table.push(row);
  }
  const diagonal = table.map((row, i) => row[i] as number);
  const flipped = diagonal.map((d) => 1 - d);
  return { n, table, diagonal, flipped };
}

export const cantorTheoremModel: SceneModel<CantorTheoremData> = {
  compute(state) {
    return cantorTheoremData(Number(state['n']));
  },
};
