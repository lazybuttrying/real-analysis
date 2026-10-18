import type { SceneModel } from '../../../contracts';

/**
 * Fubini for infinite sums (Tao, Thm 8.2.2): for a_{m,n} >= 0,
 *   sum_m sum_n a_{m,n} = sum_n sum_m a_{m,n}
 * (both equal the supremum of sums over finite rectangles), and the same
 * holds for absolutely convergent series via the a = a^+ - a^- decomposition.
 *
 * Model: a(m,n) = 1/(m^2 n^2) or (-1)^{m+n}/(m^2 n^2), 1 <= m,n <= N.
 * Row sums sit at the right, column sums below; summing either way gives the
 * same total. In the limit N -> infinity:
 *   product series: total -> (sum_m 1/m^2)^2 = (pi^2/6)^2 = pi^4/36;
 *   alternating: total -> (sum_m (-1)^m/m^2)^2 = (-pi^2/12)^2 = pi^4/144.
 *
 * Verified numbers (tests/double-series.test.ts, N = 5):
 *   product total = 2.1421574845679006, limit pi^4/36 = 2.705808084277845;
 *   alternating total = 0.7032685956790126, limit pi^4/144 = 0.6764520210694612;
 *   sum of row sums = sum of column sums = total (both series);
 *   for the product series, row sums equal column sums by symmetry.
 */

export const MIN_N = 2;
export const MAX_N = 8;
export const DEFAULT_N = 5;
export const SERIES_PRODUCT = '1/(m^2 n^2)';
export const SERIES_ALTERNATING = '(-1)^(m+n)/(m^2 n^2)';
export const DEFAULT_SERIES = SERIES_PRODUCT;
export const SERIES_OPTIONS: readonly string[] = [SERIES_PRODUCT, SERIES_ALTERNATING];

/** a(m,n) for the selected series, 1-indexed in both m and n. */
export function term(m: number, n: number, series: string): number {
  const base = 1 / (m * m * n * n);
  if (series === SERIES_ALTERNATING) {
    return (m + n) % 2 === 0 ? base : -base;
  }
  return base;
}

/** The N -> infinity limit of the total for the selected series. */
export function seriesLimit(series: string): number {
  const pi4 = Math.pow(Math.PI, 4);
  return series === SERIES_ALTERNATING ? pi4 / 144 : pi4 / 36;
}

export interface DoubleSeriesData {
  N: number;
  series: string;
  /** grid[m][n] = a(m+1, n+1). */
  grid: number[][];
  /** rowSums[m] = sum_n a(m+1, n+1). */
  rowSums: number[];
  /** colSums[n] = sum_m a(m+1, n+1). */
  colSums: number[];
  total: number;
  limit: number;
}

/** Pure: no DOM, no d3. */
export function doubleSeriesData(nRaw: number, seriesRaw: string): DoubleSeriesData {
  const N = Number.isFinite(nRaw)
    ? Math.min(MAX_N, Math.max(MIN_N, Math.round(nRaw)))
    : DEFAULT_N;
  const series = SERIES_OPTIONS.includes(seriesRaw) ? seriesRaw : DEFAULT_SERIES;
  const grid: number[][] = [];
  for (let m = 1; m <= N; m++) {
    const row: number[] = [];
    for (let n = 1; n <= N; n++) row.push(term(m, n, series));
    grid.push(row);
  }
  const rowSums = grid.map((row) => row.reduce((a, b) => a + b, 0));
  const colSums: number[] = [];
  for (let n = 0; n < N; n++) {
    let s = 0;
    for (let m = 0; m < N; m++) s += (grid[m] as number[])[n] as number;
    colSums.push(s);
  }
  const total = rowSums.reduce((a, b) => a + b, 0);
  return { N, series, grid, rowSums, colSums, total, limit: seriesLimit(series) };
}

export const doubleSeriesModel: SceneModel<DoubleSeriesData> = {
  compute(state) {
    const raw = state['series'];
    return doubleSeriesData(Number(state['N']), typeof raw === 'string' ? raw : DEFAULT_SERIES);
  },
};
