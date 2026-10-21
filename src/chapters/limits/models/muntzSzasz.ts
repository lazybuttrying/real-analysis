import type { SceneModel } from '../../../contracts';

/**
 * Muntz-Szasz theorem, live: approximate f(x) = sqrt(x) on [0,1] by
 * discrete least squares on a 2001-point grid (normal equations + Gaussian
 * elimination with partial pivoting) under two exponent sequences:
 *
 *   dense  : lambda_n = n    -> basis {1, x, x^2, ..., x^N},
 *            sum 1/n = infty, so the span is dense in C[0,1];
 *   sparse : lambda_n = n^2  -> basis {1, x, x^4, ..., x^{N^2}},
 *            sum 1/n^2 = pi^2/6 < infty, so the span is NOT dense.
 *
 * The theorem: for 0 < lambda_1 < lambda_2 < ...,
 * span{1, x^{lambda_1}, x^{lambda_2}, ...} is dense in C[0,1]
 * iff sum 1/lambda_n = infty.
 *
 * Verified numbers (tests/muntz-szasz.test.ts): grid sup errors are
 *   N = 4: dense 0.10033833319576063, sparse 0.17916559886882302;
 *   N = 6: dense 0.070824540264560365, sparse 0.16755551521891757;
 *   N = 8: dense 0.054448551618730398, sparse 0.16164464290774713.
 * The dense error shrinks 0.1003 -> 0.0708 -> 0.0544 while the sparse
 * error barely moves 0.1792 -> 0.1676 -> 0.1616: the viz shows the
 * theorem in action. Reciprocal-sum witnesses:
 *   sum_{k=1}^{10000} 1/k^2 agrees with pi^2/6 ~ 1.64493406685 to < 1e-4;
 *   H_1000 ~ 7.4855 > ln(1001) ~ 6.9088, so sum 1/n diverges.
 * Monomial normal equations are ill-conditioned, but at N <= 8 double
 * precision is fine: the fit errors are ~1e-2, far above the ~1e-12
 * level of rounding noise.
 */

export interface MuntzSample {
  x: number;
  y: number;
}

export interface MuntzData {
  n: number;
  f: MuntzSample[];
  dense: MuntzSample[];
  sparse: MuntzSample[];
  /** sup|p_dense - f| on the grid. */
  supErrDense: number;
  /** sup|p_sparse - f| on the grid. */
  supErrSparse: number;
}

export const MIN_N = 2;
export const MAX_N = 8;
export const DEFAULT_N = 6;
/** Grid points on [0,1] for the discrete least-squares fit and sup errors. */
const GRID_POINTS = 2001;

/** The target function: f(x) = sqrt(x). */
export function targetFn(x: number): number {
  return Math.sqrt(x);
}

/** Exponents of the dense basis {1, x, x^2, ..., x^N}. */
export function denseExponents(n: number): number[] {
  const exps: number[] = [];
  for (let j = 0; j <= n; j++) exps.push(j);
  return exps;
}

/** Exponents of the sparse basis {1, x, x^4, ..., x^{N^2}}. */
export function sparseExponents(n: number): number[] {
  const exps: number[] = [];
  for (let j = 0; j <= n; j++) exps.push(j * j);
  return exps;
}

/** Partial sum of sum_{k=1}^{m} 1/k^2. */
export function recipSquarePartialSum(m: number): number {
  let s = 0;
  for (let k = 1; k <= m; k++) s += 1 / (k * k);
  return s;
}

/** Harmonic number H_m = sum_{k=1}^{m} 1/k. */
export function harmonicNumber(m: number): number {
  let s = 0;
  for (let k = 1; k <= m; k++) s += 1 / k;
  return s;
}

/**
 * Solve the square system A x = b by Gaussian elimination with partial
 * pivoting. Pure: copies the augmented matrix, never mutates its inputs.
 */
export function gaussSolve(a: number[][], b: number[]): number[] {
  const n = b.length;
  const m: number[][] = a.map((row, i) => [...row, b[i]!]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(m[r]![col]!) > Math.abs(m[piv]![col]!)) piv = r;
    }
    if (piv !== col) {
      const tmp = m[col]!;
      m[col] = m[piv]!;
      m[piv] = tmp;
    }
    const row = m[col]!;
    const diag = row[col]!;
    if (Math.abs(diag) < 1e-300) throw new Error('gaussSolve: singular matrix');
    for (let r = col + 1; r < n; r++) {
      const rrow = m[r]!;
      const f = rrow[col]! / diag;
      for (let c = col; c <= n; c++) rrow[c] = rrow[c]! - f * row[c]!;
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    const row = m[r]!;
    let s = row[n]!;
    for (let c = r + 1; c < n; c++) s -= row[c]! * x[c]!;
    x[r] = s / row[r]!;
  }
  return x;
}

/**
 * Discrete least-squares coefficients of the target on the grid in the
 * monomial basis {x^{e_0}, ..., x^{e_{m-1}}}, via the normal equations.
 */
export function leastSquaresCoeffs(
  exponents: number[],
  xs: number[],
  ys: number[],
): number[] {
  const m = exponents.length;
  const cols = exponents.map((e) => xs.map((x) => Math.pow(x, e)));
  const a: number[][] = Array.from({ length: m }, () => new Array<number>(m).fill(0));
  const b = new Array<number>(m).fill(0);
  for (let j = 0; j < m; j++) {
    const cj = cols[j]!;
    for (let k = 0; k < m; k++) {
      let s = 0;
      const ck = cols[k]!;
      for (let i = 0; i < xs.length; i++) s += cj[i]! * ck[i]!;
      a[j]![k] = s;
    }
    let s = 0;
    for (let i = 0; i < xs.length; i++) s += cj[i]! * ys[i]!;
    b[j] = s;
  }
  return gaussSolve(a, b);
}

/** Evaluate sum_j coeffs[j] * x^{exponents[j]}. */
function evalBasis(coeffs: number[], exponents: number[], x: number): number {
  let v = 0;
  for (let j = 0; j < exponents.length; j++) v += coeffs[j]! * Math.pow(x, exponents[j]!);
  return v;
}

/** Pure: no DOM, no d3. */
export function muntzData(n: number): MuntzData {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < GRID_POINTS; i++) {
    const x = i / (GRID_POINTS - 1);
    xs.push(x);
    ys.push(targetFn(x));
  }
  const denseExps = denseExponents(nn);
  const sparseExps = sparseExponents(nn);
  const denseCoeffs = leastSquaresCoeffs(denseExps, xs, ys);
  const sparseCoeffs = leastSquaresCoeffs(sparseExps, xs, ys);
  const f: MuntzSample[] = [];
  const dense: MuntzSample[] = [];
  const sparse: MuntzSample[] = [];
  let supErrDense = 0;
  let supErrSparse = 0;
  for (let i = 0; i < GRID_POINTS; i++) {
    const x = xs[i]!;
    const fv = ys[i]!;
    const dv = evalBasis(denseCoeffs, denseExps, x);
    const sv = evalBasis(sparseCoeffs, sparseExps, x);
    f.push({ x, y: fv });
    dense.push({ x, y: dv });
    sparse.push({ x, y: sv });
    const eD = Math.abs(dv - fv);
    const eS = Math.abs(sv - fv);
    if (eD > supErrDense) supErrDense = eD;
    if (eS > supErrSparse) supErrSparse = eS;
  }
  return { n: nn, f, dense, sparse, supErrDense, supErrSparse };
}

export const muntzSzaszModel: SceneModel<MuntzData> = {
  compute(state) {
    const raw = Number(state['N']);
    const n = Number.isFinite(raw) ? raw : DEFAULT_N;
    return muntzData(n);
  },
};
