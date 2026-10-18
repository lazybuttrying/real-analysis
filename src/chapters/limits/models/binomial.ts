import type { SceneModel } from '../../../contracts';

/**
 * Pascal's triangle and the binomial theorem.
 *
 * The model computes exact integer binomial coefficients, the rows of
 * Pascal's triangle up to a selected row n, and a numeric check of the
 * binomial theorem (x + y)^n = sum_{k=0}^{n} C(n,k) x^{n-k} y^k.
 * Pure computation: no DOM, d3, or three.
 */

const MIN_ROW = 0;
const MAX_ROW = 8;
const DEFAULT_ROW = 4;

/**
 * Exact binomial coefficient C(n, k).
 * Uses the multiplicative formula with the symmetry C(n,k) = C(n,n-k);
 * every division is exact, so the result is an integer. Returns 0 for
 * k < 0 or k > n (the coefficient of a nonexistent entry).
 */
export function binom(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k)) return 0;
  if (n < 0 || k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= m; i++) {
    result = (result * (n - m + i)) / i;
  }
  return Math.round(result);
}

/** Row n of Pascal's triangle: C(n,0), C(n,1), ..., C(n,n). */
export function pascalRow(n: number): number[] {
  const row: number[] = [];
  for (let k = 0; k <= n; k++) {
    row.push(binom(n, k));
  }
  return row;
}

/** Sum of row n: sum_{k=0}^{n} C(n,k), which equals 2^n. */
export function rowSum(n: number): number {
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    sum += binom(n, k);
  }
  return sum;
}

interface ExpandCheck {
  /** (x + y)^n */
  lhs: number;
  /** sum_{k=0}^{n} C(n,k) x^{n-k} y^k */
  rhs: number;
}

/** Numeric check of the binomial theorem for given x, y, n. */
export function expandCheck(x: number, y: number, n: number): ExpandCheck {
  let rhs = 0;
  for (let k = 0; k <= n; k++) {
    rhs += binom(n, k) * x ** (n - k) * y ** k;
  }
  return { lhs: (x + y) ** n, rhs };
}

export interface BinomialData {
  /** Selected row of Pascal's triangle. */
  n: number;
  /** Rows 0..n of Pascal's triangle. */
  rows: number[][];
  /** The highlighted row (always n). */
  highlight: number;
  /** Sum of row n, equal to 2^n. */
  rowSum: number;
}

export const binomialModel: SceneModel<BinomialData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_ROW, Math.max(MIN_ROW, Math.floor(raw))) : DEFAULT_ROW;
    const rows: number[][] = [];
    for (let r = 0; r <= n; r++) {
      rows.push(pascalRow(r));
    }
    return { n, rows, highlight: n, rowSum: rowSum(n) };
  },
};
