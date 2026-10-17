import type { SceneModel } from '../../../contracts';

/**
 * The Euler-Mascheroni constant gamma = lim (H_n - ln n) ~ 0.5772.
 *
 * The harmonic numbers H_n grow like ln n, but their difference
 * gamma_n = H_n - ln n settles: it decreases to gamma because
 * gamma_n - gamma_{n+1} = ln(1 + 1/n) - 1/(n+1) > 0, and the
 * telescoping sum of d_n = 1/n - ln(1 + 1/n) equals gamma.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Slider range for n; controls must match meta.ts. */
export const MIN_N = 1;
export const MAX_N = 200;
export const DEFAULT_N = 50;

/** Euler-Mascheroni constant, for the dashed asymptote line. */
export const GAMMA_TRUE = 0.5772156649015329;

export interface GammaTerm {
  /** Index k, 1-based. */
  k: number;
  /** H_k = sum_{j=1}^{k} 1/j. */
  h: number;
  /** ln k. */
  ln: number;
  /** gamma_k = H_k - ln k. */
  gamma: number;
  /** d_k = 1/k - ln(1 + 1/k), the telescoping term; always positive. */
  delta: number;
}

export interface EulerMascheroniData {
  /** Number of terms, clamped to [MIN_N, MAX_N]. */
  n: number;
  /** Terms 1..n. */
  terms: GammaTerm[];
  /** H_n. */
  hN: number;
  /** ln n. */
  lnN: number;
  /** gamma_n = H_n - ln n. */
  gammaN: number;
  /** sum_{k=1}^{n} d_k = H_n - ln(n+1), the telescoping partial sum. */
  deltaPartial: number;
}

/** The n-th harmonic number, by direct summation. */
export function harmonicNumber(n: number): number {
  let sum = 0;
  for (let k = 1; k <= n; k++) sum += 1 / k;
  return sum;
}

/** d_n = 1/n - ln(1 + 1/n) > 0 (since ln(1 + 1/n) < 1/n). */
export function deltaTerm(n: number): number {
  return 1 / n - Math.log(1 + 1 / n);
}

export const eulerMascheroniModel: SceneModel<EulerMascheroniData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw)
      ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(raw)))
      : DEFAULT_N;
    const terms: GammaTerm[] = [];
    let h = 0;
    let deltaPartial = 0;
    for (let k = 1; k <= n; k++) {
      h += 1 / k;
      const delta = deltaTerm(k);
      deltaPartial += delta;
      terms.push({ k, h, ln: Math.log(k), gamma: h - Math.log(k), delta });
    }
    const last = terms[terms.length - 1] ?? { h: 0, ln: 0, gamma: 0 };
    return { n, terms, hN: last.h, lnN: last.ln, gammaN: last.gamma, deltaPartial };
  },
};
