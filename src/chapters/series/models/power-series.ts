import type { SceneModel } from '../../../contracts';

/**
 * Power series toolbox: sum_{k=0}^{infty} a_k x^k at c = 0 for three
 * representative series, with the radius of convergence and a verdict for
 * the chosen x. Pure computation: no DOM, d3, or three.
 *
 *   exp:        a_k = 1/k!,   t_{k+1} = t_k * x / (k+1),  R = infinity
 *   factorial:  a_k = k!,     t_{k+1} = t_k * x * (k+1),  R = 0
 *   geom:       a_k = 1,      t_{k+1} = t_k * x,          R = 1
 *
 * Terms are built iteratively (t_0 = 1) so no raw factorial is ever
 * evaluated; every term and partial sum is a plain finite number until
 * genuine blow-up, which is reported as an overflow flag rather than
 * Infinity.
 */

export type PowerSeriesKind = 'exp' | 'factorial' | 'geom';

export type PowerVerdict = 'converge' | 'diverge' | 'boundary';

export interface PowerData {
  series: PowerSeriesKind;
  x: number;
  n: number;
  /** Radius of convergence: Infinity for exp, 0 for factorial, 1 for geom. */
  radius: number;
  /** S_N(x) = sum_{k=0}^{N} t_k, computed iteratively. */
  partialSum: number;
  /** |t_N|, the last term's magnitude. */
  lastTermAbs: number;
  verdict: PowerVerdict;
  /** True when |partialSum| blew past 1e15: reported as divergence instead of Infinity. */
  overflow: boolean;
}

/** Partial sums are kept up to 30 terms by the UI; the same bound applies here. */
export const MAX_N = 30;

/** Magnitude beyond which a partial sum is reported as overflow instead of being printed. */
export const OVERFLOW_MAGNITUDE = 1e15;

export function powerRadius(kind: PowerSeriesKind): number {
  if (kind === 'exp') return Infinity;
  if (kind === 'factorial') return 0;
  return 1;
}

/** Single term t_k = a_k x^k, reached by iterating the recurrence from t_0 = 1. */
export function powerTerm(kind: PowerSeriesKind, x: number, k: number): number {
  if (k < 0) return 0;
  let t = 1;
  for (let i = 1; i <= k; i++) {
    if (kind === 'exp') t = (t * x) / i;
    else if (kind === 'factorial') t = t * x * i;
    else t = t * x;
    if (!Number.isFinite(t)) return t;
  }
  return t;
}

/** S_n(x) = sum_{k=0}^{n} t_k via the iterative recurrence. */
export function powerPartialSum(kind: PowerSeriesKind, x: number, n: number): number {
  let t = 1;
  let sum = t;
  const steps = Math.max(0, Math.floor(n));
  for (let i = 1; i <= steps; i++) {
    if (kind === 'exp') t = (t * x) / i;
    else if (kind === 'factorial') t = t * x * i;
    else t = t * x;
    sum += t;
    if (!Number.isFinite(sum)) return sum;
  }
  return sum;
}

export function powerData(kind: PowerSeriesKind, x: number, n: number): PowerData {
  const radius = powerRadius(kind);
  const partialSum = powerPartialSum(kind, x, n);
  const lastTermAbs = Math.abs(powerTerm(kind, x, n));
  const overflow = Math.abs(partialSum) > OVERFLOW_MAGNITUDE || !Number.isFinite(partialSum);
  const absX = Math.abs(x);
  let verdict: PowerVerdict;
  if (overflow || absX > radius) verdict = 'diverge';
  else if (absX < radius) verdict = 'converge';
  else verdict = 'boundary';
  return { series: kind, x, n, radius, partialSum, lastTermAbs, verdict, overflow };
}

export const powerSeriesModel: SceneModel<PowerData> = {
  compute(state) {
    const raw = String(state['series'] ?? '');
    const series: PowerSeriesKind = raw === 'factorial' ? 'factorial' : raw === 'geom' ? 'geom' : 'exp';
    const xRaw = Number(state['x']);
    const x = Number.isFinite(xRaw) ? Math.min(3, Math.max(-3, xRaw)) : 1;
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? Math.min(MAX_N, Math.max(1, Math.floor(nRaw))) : 1;
    return powerData(series, x, n);
  },
};
