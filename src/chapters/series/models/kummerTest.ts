import type { SceneModel } from '../../../contracts';

/**
 * Kummer's test playground: the Kummer quotient
 *   K_k = p_k (a_k/a_{k+1}) - p_{k+1}
 * for the Gauss example a_k = k!/((a+1)(a+2)...(a+k)), where the ordinary
 * ratio test is stuck at 1: a_k/a_{k+1} = (k+a+1)/(k+1) -> 1.
 *
 * p_k choices: 1 (ratio-test shape), k (Raabe-test shape), k ln(k+1)
 * (a finer probe; ln(k+1) avoids the ln 1 = 0 problem at k = 1).
 * a choices: 2 (convergent, Gauss h = 2 > 1) and 1/2 (divergent,
 * Gauss h = 1/2 < 1).
 *
 * Verified identities (tests/kummer-test.test.ts):
 *   a = 2: a_n = 2/((n+1)(n+2)) (telescoping sum = 1); with p_n = n,
 *          K_n = (n-1)/(n+1), so K_1 = 0, K_2 = 1/3, K_100 = 99/101.
 *   a = 1/2: with p_n = n, K_n = (-0.5n-1)/(n+1), so K_1 = -0.75,
 *          K_100 = -51/101 ~= -0.505 < 0 while sum 1/n diverges.
 */

export type PKind = 'p1' | 'pn' | 'pnlogn';
export type ASel = 'a2' | 'ahalf';

export interface KummerData {
  pKind: PKind;
  a: number;
  aSel: ASel;
  /** Number of K_k points. */
  n: number;
  /** k = 1..n. */
  ks: number[];
  /** K_k = p_k (a_k/a_{k+1}) - p_{k+1} for k = 1..n. */
  kummer: number[];
  /**
   * Theoretical limit of K_n: a - 1 for p_n = n, 0 for p_n = 1.
   * For p_n = n ln(n+1) the empirical trend is +Infinity when a > 1
   * and -Infinity when a < 1 (no closed form is stated).
   */
  limit: number;
}

export const MIN_N = 10;
export const MAX_N = 500;
export const DEFAULT_N = 100;
export const DEFAULT_P: PKind = 'pn';
export const DEFAULT_ASEL: ASel = 'a2';

export function aValue(sel: ASel): number {
  return sel === 'ahalf' ? 0.5 : 2;
}

export function pTerm(kind: PKind, k: number): number {
  if (kind === 'p1') return 1;
  if (kind === 'pn') return k;
  return k * Math.log(k + 1);
}

/**
 * The Gauss example terms a_k = k!/((a+1)(a+2)...(a+k)), built by the
 * recurrence a_{k+1} = a_k (k+1)/(k+a+1) with a_1 = 1/(a+1).
 */
export function gaussTerms(a: number, count: number): number[] {
  const terms: number[] = [];
  let t = 1 / (a + 1); // a_1
  for (let k = 1; k <= count; k++) {
    terms.push(t);
    t = (t * (k + 1)) / (k + a + 1);
  }
  return terms;
}

/**
 * Closed-form ratio a_k/a_{k+1} = (k+a+1)/(k+1) = 1 + a/(k+1) -> 1,
 * so the ordinary ratio test is inconclusive. Also 1 + a/(k+1)
 * = 1 + a/k + O(1/k^2), i.e. Gauss's h = a.
 */
export function gaussRatio(a: number, k: number): number {
  return (k + a + 1) / (k + 1);
}

/**
 * Closed-form Kummer quotient for p_n = n:
 * K_n = n(n+a+1)/(n+1) - (n+1) = ((a-1)n - 1)/(n+1) -> a - 1.
 */
export function kummerFormulaPN(a: number, k: number): number {
  return (((a - 1) * k - 1) / (k + 1));
}

export function kummerData(pKind: PKind, aSel: ASel, n: number): KummerData {
  const a = aValue(aSel);
  const terms = gaussTerms(a, n + 1); // one extra term so K_n is defined
  const ks: number[] = [];
  const kummer: number[] = [];
  for (let k = 1; k <= n; k++) {
    const aK = terms[k - 1] ?? 0;
    const aNext = terms[k] ?? 1;
    ks.push(k);
    kummer.push(pTerm(pKind, k) * (aK / aNext) - pTerm(pKind, k + 1));
  }
  const limit = pKind === 'p1' ? 0 : pKind === 'pn' ? a - 1 : a > 1 ? Infinity : -Infinity;
  return { pKind, a, aSel, n, ks, kummer, limit };
}

export const kummerModel: SceneModel<KummerData> = {
  compute(state) {
    const rawP = String(state['pKind'] ?? '');
    const pKind: PKind = rawP === 'p1' || rawP === 'pnlogn' ? rawP : DEFAULT_P;
    const rawA = String(state['aSel'] ?? '');
    const aSel: ASel = rawA === 'ahalf' ? 'ahalf' : DEFAULT_ASEL;
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(nRaw))) : DEFAULT_N;
    return kummerData(pKind, aSel, n);
  },
};
