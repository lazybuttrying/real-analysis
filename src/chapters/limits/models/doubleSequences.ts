import type { SceneModel } from '../../../contracts';

/**
 * Double sequences, live: a grid of values a_{m,n} for four examples,
 * with the two iterated limits and the Pringsheim double limit kept
 * apart. The analytic facts encoded below:
 *   ratio:     a = m/(m+n). lim_n a = 0 for each m, lim_m a = 1 for
 *              each n, so the iterated limits are 0 and 1; the diagonal
 *              is constantly 1/2, and a(k, k^2) = 1/(1+k) -> 0, so no
 *              double limit exists.
 *   difference: a = (m-n)/(m+n). lim_n a = -1, lim_m a = 1; iterated
 *              limits -1 and 1; diagonal constantly 0; no double limit.
 *   product:   a = mn/(m^2+n^2). Both inner limits are 0, so both
 *              iterated limits are 0 -- yet the diagonal is constantly
 *              1/2, so there is no double limit: agreement of the
 *              iterated limits does not create a double limit.
 *   vanishing: a = (-1)^n / m. |a| = 1/m, so the double limit is 0.
 *              lim_m a = 0 for each n (one iterated limit is 0), but
 *              lim_n a does not exist for any fixed m (the row
 *              oscillates between -1/m and 1/m), so the other iterated
 *              limit does not exist.
 * The row/column limit functions below are those analytic values; the
 * tests cross-check them against doubleValue at large indices.
 * Pure computation: no DOM, d3, or three.
 */

export type DoubleExampleId = 'ratio' | 'difference' | 'product' | 'vanishing';

export const DOUBLE_EXAMPLES: readonly DoubleExampleId[] = [
  'ratio',
  'difference',
  'product',
  'vanishing',
];

export const DOUBLE_EXAMPLE_INIT: DoubleExampleId = 'ratio';

export const DOUBLE_K_MIN = 4;
export const DOUBLE_K_MAX = 24;
export const DOUBLE_K_INIT = 12;

/** The value a_{m,n} of the selected example (m, n >= 1). */
export function doubleValue(example: DoubleExampleId, m: number, n: number): number {
  switch (example) {
    case 'ratio':
      return m / (m + n);
    case 'difference':
      return (m - n) / (m + n);
    case 'product':
      return (m * n) / (m * m + n * n);
    case 'vanishing':
      return (n % 2 === 0 ? 1 : -1) / m;
  }
}

/** lim_{n -> infinity} a_{m,n} for fixed m, or null when it does not exist. */
export function rowLimit(example: DoubleExampleId, _m: number): number | null {
  switch (example) {
    case 'ratio':
      return 0;
    case 'difference':
      return -1;
    case 'product':
      return 0;
    case 'vanishing':
      return null;
  }
}

/** lim_{m -> infinity} a_{m,n} for fixed n, or null when it does not exist. */
export function colLimit(example: DoubleExampleId, _n: number): number | null {
  switch (example) {
    case 'ratio':
      return 1;
    case 'difference':
      return 1;
    case 'product':
      return 0;
    case 'vanishing':
      return 0;
  }
}

/** lim_{m -> infinity} (lim_{n -> infinity} a_{m,n}), or null when undefined. */
export function iteratedNFirst(example: DoubleExampleId): number | null {
  switch (example) {
    case 'ratio':
      return 0;
    case 'difference':
      return -1;
    case 'product':
      return 0;
    case 'vanishing':
      return null;
  }
}

/** lim_{n -> infinity} (lim_{m -> infinity} a_{m,n}), or null when undefined. */
export function iteratedMFirst(example: DoubleExampleId): number | null {
  switch (example) {
    case 'ratio':
      return 1;
    case 'difference':
      return 1;
    case 'product':
      return 0;
    case 'vanishing':
      return 0;
  }
}

/** The Pringsheim double limit, or null when it does not exist. */
export function doubleLimit(example: DoubleExampleId): number | null {
  return example === 'vanishing' ? 0 : null;
}

/** lim_{k -> infinity} a_{k,k}, the diagonal limit. */
export function diagonalLimit(example: DoubleExampleId): number {
  switch (example) {
    case 'ratio':
      return 1 / 2;
    case 'difference':
      return 0;
    case 'product':
      return 1 / 2;
    case 'vanishing':
      return 0;
  }
}

/** Color scale range for the example's values. */
export function colorRange(example: DoubleExampleId): readonly [number, number] {
  switch (example) {
    case 'ratio':
      return [0, 1];
    case 'difference':
      return [-1, 1];
    case 'product':
      return [0, 1 / 2];
    case 'vanishing':
      return [-1, 1];
  }
}

export interface DoubleSequencesData {
  readonly example: DoubleExampleId;
  /** Grid extent: indices run over 1..k in both directions. */
  readonly k: number;
  /** grid[m - 1][n - 1] = a_{m,n}. */
  readonly grid: readonly (readonly number[])[];
  /** rowLimits[m - 1] = lim_n a_{m,n} (null = does not exist). */
  readonly rowLimits: readonly (number | null)[];
  /** colLimits[n - 1] = lim_m a_{m,n} (null = does not exist). */
  readonly colLimits: readonly (number | null)[];
  /** lim_m lim_n a_{m,n} (null = undefined or nonexistent). */
  readonly iteratedNFirst: number | null;
  /** lim_n lim_m a_{m,n} (null = undefined or nonexistent). */
  readonly iteratedMFirst: number | null;
  /** The Pringsheim double limit (null = does not exist). */
  readonly doubleLimit: number | null;
  /** The diagonal value a_{k,k} at the current grid corner. */
  readonly diagonal: number;
  /** lim_k a_{k,k}. */
  readonly diagonalLimit: number;
  readonly colorLo: number;
  readonly colorHi: number;
}

function clampK(k: number): number {
  if (!Number.isFinite(k)) return DOUBLE_K_INIT;
  return Math.max(DOUBLE_K_MIN, Math.min(DOUBLE_K_MAX, Math.floor(k)));
}

function doubleSequencesData(exampleRaw: string, kRaw: number): DoubleSequencesData {
  const example: DoubleExampleId = (DOUBLE_EXAMPLES as readonly string[]).includes(exampleRaw)
    ? (exampleRaw as DoubleExampleId)
    : DOUBLE_EXAMPLE_INIT;
  const k = clampK(kRaw);
  const grid: number[][] = [];
  const rowLimits: (number | null)[] = [];
  const colLimits: (number | null)[] = [];
  for (let m = 1; m <= k; m++) {
    const row: number[] = [];
    for (let n = 1; n <= k; n++) row.push(doubleValue(example, m, n));
    grid.push(row);
    rowLimits.push(rowLimit(example, m));
    colLimits.push(colLimit(example, m));
  }
  const [colorLo, colorHi] = colorRange(example);
  return {
    example,
    k,
    grid,
    rowLimits,
    colLimits,
    iteratedNFirst: iteratedNFirst(example),
    iteratedMFirst: iteratedMFirst(example),
    doubleLimit: doubleLimit(example),
    diagonal: doubleValue(example, k, k),
    diagonalLimit: diagonalLimit(example),
    colorLo,
    colorHi,
  };
}

export const doubleSequencesModel: SceneModel<DoubleSequencesData> = {
  compute(state) {
    const raw = state['example'];
    const example = typeof raw === 'string' ? raw : DOUBLE_EXAMPLE_INIT;
    return doubleSequencesData(example, Number(state['k']));
  },
};
