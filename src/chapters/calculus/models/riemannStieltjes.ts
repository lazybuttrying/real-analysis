import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Section 11.8: the Riemann-Stieltjes integral of f(x) = x
 * on [0,1] with respect to a monotone increasing alpha. The RS upper/lower
 * sums use the stretched increments Delta alpha_i = alpha(x_i) - alpha(x_{i-1});
 * f is increasing on [0,1], so M_i = f(x_i) and m_i = f(x_{i-1}) on each
 * subinterval of the uniform partition P_n.
 *
 * Exact integrals: identity alpha(x) = x gives 1/2; square alpha(x) = x^2
 * gives int_0^1 x * 2x dx = 2/3; step alpha (0 for x < 0.5, 1 for x >= 0.5)
 * gives f(0.5) * 1 = 0.5 (a single jump).
 * Pure computation: no DOM, d3, or three.
 */

export const N_MIN = 1;
export const N_MAX = 24;
export const N_INIT = 6;

export const ALPHA_OPTIONS = ['identity', 'square', 'step'] as const;
export type AlphaKind = (typeof ALPHA_OPTIONS)[number];
export const ALPHA_INIT: AlphaKind = 'identity';
/** The single jump point of the 'step' integrator. */
export const STEP_POINT = 0.5;

function alphaFn(kind: AlphaKind): (x: number) => number {
  switch (kind) {
    case 'square':
      return (x) => x * x;
    case 'step':
      return (x) => (x < STEP_POINT ? 0 : 1);
    default:
      return (x) => x;
  }
}

export function exactIntegral(kind: AlphaKind): number {
  switch (kind) {
    case 'square':
      return 2 / 3;
    case 'step':
      return 0.5;
    default:
      return 0.5;
  }
}

interface RiemannStieltjesInterval {
  /** Uniform partition endpoints. */
  x0: number;
  x1: number;
  /** alpha-mapped endpoints: the strip's position on the stretched axis. */
  a0: number;
  a1: number;
  /** alpha(x1) - alpha(x0): the stretched width of the strip. */
  dAlpha: number;
  /** inf/sup of f(x) = x on [x0, x1]. */
  lo: number;
  hi: number;
}

export interface RiemannStieltjesData {
  alpha: AlphaKind;
  n: number;
  intervals: RiemannStieltjesInterval[];
  upper: number;
  lower: number;
  gap: number;
  exact: number;
}

export function riemannStieltjesData(alpha: AlphaKind, n: number): RiemannStieltjesData {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  const alphaAt = alphaFn(alpha);
  const intervals: RiemannStieltjesInterval[] = [];
  let upper = 0;
  let lower = 0;
  for (let i = 0; i < nn; i++) {
    const x0 = i / nn;
    const x1 = (i + 1) / nn;
    const a0 = alphaAt(x0);
    const a1 = alphaAt(x1);
    const dAlpha = a1 - a0;
    // f(x) = x is increasing, so the inf/sup are the endpoint values.
    const lo = x0;
    const hi = x1;
    upper += hi * dAlpha;
    lower += lo * dAlpha;
    intervals.push({ x0, x1, a0, a1, dAlpha, lo, hi });
  }
  return {
    alpha,
    n: nn,
    intervals,
    upper,
    lower,
    gap: upper - lower,
    exact: exactIntegral(alpha),
  };
}

export const riemannStieltjesModel: SceneModel<RiemannStieltjesData> = {
  compute(state) {
    const rawAlpha = String(state['alpha'] ?? '');
    const alpha: AlphaKind = (ALPHA_OPTIONS as readonly string[]).includes(rawAlpha)
      ? (rawAlpha as AlphaKind)
      : ALPHA_INIT;
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN) ? rawN : N_INIT;
    return riemannStieltjesData(alpha, n);
  },
};
