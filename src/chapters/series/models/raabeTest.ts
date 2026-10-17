import type { SceneModel } from '../../../contracts';

/**
 * Raabe's test playground: the Raabe quotient R_k = k (a_k/a_{k+1} - 1)
 * and the ordinary ratio r_k = a_{k+1}/a_k for two series where the
 * ratio test is stuck near 1.
 *
 *   central: a_k = u_k/(2k+1) with u_k = C(2k,k)/4^k, k >= 1.
 *            R_k = k(6k+5)/(4k^2+4k+1) -> 3/2 > 1, so the series
 *            converges even though r_k -> 1 (ratio test inconclusive).
 *   log:     a_k = 1/(k (ln k)^p), k >= 2. The main curve uses p = 2
 *            (convergent), and a second curve uses p = 1 (divergent):
 *            both have R_k -> 1, the genuinely inconclusive boundary.
 */

export type RaabeExample = 'central' | 'log';

export interface RaabeData {
  example: RaabeExample;
  /** First index k in the arrays (1 for central, 2 for log since ln 1 = 0). */
  kStart: number;
  /** Number of R_k points. */
  n: number;
  /** R_k = k (a_k/a_{k+1} - 1), k = kStart .. kStart+n-1. */
  raabe: number[];
  /** r_k = a_{k+1}/a_k over the same k range; hovers near 1 in both examples. */
  ratios: number[];
  /**
   * For the log example, R_k with p = 1 (divergent series) over the same
   * k range; the main raabe curve uses p = 2 (convergent). Null for central.
   */
  raabeP1: number[] | null;
  /** The limit of R_k: 3/2 for central, 1 for log. */
  limit: number;
}

export const MIN_N = 10;
export const MAX_N = 500;
export const DEFAULT_EXAMPLE: RaabeExample = 'central';
export const DEFAULT_N = 100;

/**
 * Closed form of the Raabe quotient for the central-binomial example:
 * a_k/a_{k+1} = 2(k+1)(2k+3)/(2k+1)^2, so
 * R_k = k(a_k/a_{k+1} - 1) = k(6k+5)/(4k^2+4k+1) -> 6/4 = 3/2.
 */
export function raabeFormulaCentral(k: number): number {
  return (k * (6 * k + 5)) / (4 * k * k + 4 * k + 1);
}

/** a_k = u_k/(2k+1) for k = 1..count, with u_k = C(2k,k)/4^k built by recurrence. */
function centralTerms(count: number): number[] {
  const a: number[] = [];
  let u = 1 / 2; // u_1 = C(2,1)/4
  for (let k = 1; k <= count; k++) {
    a.push(u / (2 * k + 1));
    u = (u * (2 * k + 1)) / (2 * (k + 1)); // u_{k+1} = u_k (2k+1)/(2k+2)
  }
  return a;
}

function logTerm(k: number, p: number): number {
  return 1 / (k * Math.log(k) ** p);
}

export function raabeData(example: RaabeExample, n: number): RaabeData {
  if (example === 'log') {
    const kStart = 2;
    const raabe: number[] = [];
    const raabeP1: number[] = [];
    const ratios: number[] = [];
    for (let k = kStart; k < kStart + n; k++) {
      const a2 = logTerm(k, 2);
      const b2 = logTerm(k + 1, 2);
      raabe.push(k * (a2 / b2 - 1));
      const a1 = logTerm(k, 1);
      const b1 = logTerm(k + 1, 1);
      raabeP1.push(k * (a1 / b1 - 1));
      ratios.push(b2 / a2);
    }
    return { example, kStart, n, raabe, ratios, raabeP1, limit: 1 };
  }
  const kStart = 1;
  const terms = centralTerms(n + 1); // one extra term so R_n and r_n are defined
  const raabe: number[] = [];
  const ratios: number[] = [];
  for (let k = 1; k <= n; k++) {
    const aK = terms[k - 1] ?? 0;
    const aNext = terms[k] ?? 1;
    raabe.push(k * (aK / aNext - 1));
    ratios.push(aNext / aK);
  }
  return { example, kStart, n, raabe, ratios, raabeP1: null, limit: 1.5 };
}

export const raabeModel: SceneModel<RaabeData> = {
  compute(state) {
    const raw = String(state['example'] ?? '');
    const example: RaabeExample = raw === 'log' ? 'log' : DEFAULT_EXAMPLE;
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(nRaw))) : DEFAULT_N;
    return raabeData(example, n);
  },
};
