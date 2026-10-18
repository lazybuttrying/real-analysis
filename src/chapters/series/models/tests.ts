import type { SceneModel } from '../../../contracts';

/**
 * Convergence tests toolbox: the ratio test on two series and the
 * comparison test on a third. Pure computation: no DOM, d3, or three.
 *
 *   factorial:        a_k = 1/k!,        r_k = a_{k+1}/a_k = 1/(k+1) -> 0
 *   n-over-2n:        a_k = k/2^k,       r_k = (k+1)/(2k) -> 1/2
 *   inv-square-plus:  a_k = 1/(k^2+1) <= 1/k^2, compared with the Basel p-series
 */

type TestsSeries = 'factorial' | 'n-over-2n' | 'inv-square-plus';

type TestsVerdict = 'ratio-converges' | 'comparison-converges';

export interface TestsData {
  series: TestsSeries;
  n: number;
  /** a_k for k = 1..n */
  terms: number[];
  /** r_k = a_{k+1}/a_k for k = 1..n (ratio-test series only; null for the comparison series) */
  ratios: number[] | null;
  /** The limit L of r_k (ratio-test series only; null for the comparison series) */
  limit: number | null;
  /** Majorant b_k = 1/k^2 (comparison series only; null for the ratio-test series) */
  majors: number[] | null;
  verdict: TestsVerdict;
}

export const MAX_N = 30;

function factorial(k: number): number {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return f;
}

function termOf(series: TestsSeries, k: number): number {
  if (series === 'factorial') return 1 / factorial(k);
  if (series === 'n-over-2n') return k / 2 ** k;
  return 1 / (k * k + 1);
}

export function testsData(series: TestsSeries, n: number): TestsData {
  if (series === 'inv-square-plus') {
    const terms: number[] = [];
    const majors: number[] = [];
    for (let k = 1; k <= n; k++) {
      terms.push(termOf(series, k));
      majors.push(1 / (k * k));
    }
    return { series, n, terms, ratios: null, limit: null, majors, verdict: 'comparison-converges' };
  }
  // One extra term so that r_n = a_{n+1}/a_n is defined.
  const terms: number[] = [];
  for (let k = 1; k <= n + 1; k++) terms.push(termOf(series, k));
  const ratios: number[] = [];
  for (let k = 1; k <= n; k++) ratios.push((terms[k] ?? 0) / (terms[k - 1] ?? 1));
  return {
    series,
    n,
    terms: terms.slice(0, n),
    ratios,
    limit: series === 'factorial' ? 0 : 0.5,
    majors: null,
    verdict: 'ratio-converges',
  };
}

export const testsModel: SceneModel<TestsData> = {
  compute(state) {
    const raw = String(state['series'] ?? '');
    const series: TestsSeries =
      raw === 'n-over-2n' ? 'n-over-2n' : raw === 'inv-square-plus' ? 'inv-square-plus' : 'factorial';
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? Math.min(MAX_N, Math.max(1, Math.floor(nRaw))) : 1;
    return testsData(series, n);
  },
};
