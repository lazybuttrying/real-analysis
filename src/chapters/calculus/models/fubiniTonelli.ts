import type { SceneModel } from '../../../contracts';

/**
 * Tonelli/Fubini on [0,1]^2: two modes, both with nonnegative continuous f
 * so the two iterated integrals must agree.
 *
 * - 'separable': f(x, y) = x * y. Row integral R(y) = y/2, column integral
 *   C(x) = x/2, and both iterated integrals are exactly 1/4.
 * - 'tent': f(x, y) = max(0, 1 - 3|x - y|), a ridge along the diagonal.
 *   By symmetry R = C as functions; the double integral is exactly 8/27
 *   (integrate the truncated tent row by row).
 *
 * The model evaluates f on the N x N midpoint grid, forms the row sums
 * R_j = (1/N) sum_i f(x_i, y_j) and column sums C_i = (1/N) sum_j f(x_i, y_j),
 * and integrates each once more. The two totals are the same double sum
 * accumulated in opposite orders — the discrete shadow of Tonelli's theorem.
 * Pure computation: no DOM, d3, or three.
 */

export const N_MIN = 8;
export const N_MAX = 64;
export const N_INIT = 32;

export const MODE_OPTIONS = ['separable', 'tent'] as const;
export type ModeKind = (typeof MODE_OPTIONS)[number];
export const MODE_INIT: ModeKind = 'separable';

export function fValue(mode: ModeKind, x: number, y: number): number {
  switch (mode) {
    case 'tent':
      return Math.max(0, 1 - 3 * Math.abs(x - y));
    default:
      return x * y;
  }
}

/** Exact double integral over [0,1]^2: 1/4 for separable, 8/27 for tent. */
export function exactDoubleIntegral(mode: ModeKind): number {
  return mode === 'tent' ? 8 / 27 : 1 / 4;
}

export interface FubiniTonelliData {
  mode: ModeKind;
  n: number;
  /** Midpoint grid points, length n. */
  xs: number[];
  ys: number[];
  /** Cell values row-major: cells[j * n + i] = f(x_i, y_j). Length n^2. */
  cells: number[];
  /** Row integrals R(y_j) = (1/n) sum_i f(x_i, y_j). Length n. */
  rowSums: number[];
  /** Column integrals C(x_i) = (1/n) sum_j f(x_i, y_j). Length n. */
  colSums: number[];
  /** (1/n) sum_j R_j: the iterated integral, x-inner. */
  totalRows: number;
  /** (1/n) sum_i C_i: the iterated integral, y-inner. */
  totalCols: number;
  exact: number;
}

export function fubiniTonelliData(mode: ModeKind, n: number): FubiniTonelliData {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  const xs: number[] = [];
  const ys: number[] = [];
  for (let k = 0; k < nn; k++) {
    const mid = (k + 0.5) / nn;
    xs.push(mid);
    ys.push(mid);
  }
  const cells: number[] = new Array(nn * nn);
  const rowSums: number[] = new Array(nn).fill(0);
  const colSums: number[] = new Array(nn).fill(0);
  for (let j = 0; j < nn; j++) {
    let row = 0;
    for (let i = 0; i < nn; i++) {
      const v = fValue(mode, xs[i]!, ys[j]!);
      cells[j * nn + i] = v;
      row += v;
      colSums[i]! += v;
    }
    rowSums[j] = row / nn;
  }
  for (let i = 0; i < nn; i++) colSums[i]! /= nn;
  const totalRows = rowSums.reduce((s, v) => s + v, 0) / nn;
  const totalCols = colSums.reduce((s, v) => s + v, 0) / nn;
  return { mode, n: nn, xs, ys, cells, rowSums, colSums, totalRows, totalCols, exact: exactDoubleIntegral(mode) };
}

export const fubiniTonelliModel: SceneModel<FubiniTonelliData> = {
  compute(state) {
    const rawMode = String(state['mode'] ?? '');
    const mode: ModeKind = (MODE_OPTIONS as readonly string[]).includes(rawMode)
      ? (rawMode as ModeKind)
      : MODE_INIT;
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN) ? rawN : N_INIT;
    return fubiniTonelliData(mode, n);
  },
};
