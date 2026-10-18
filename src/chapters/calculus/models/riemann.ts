import type { SceneModel } from '../../../contracts';

/**
 * Riemann integrability of f(x) = x^2 on [0,1]: with the uniform partition
 * into n subintervals, the lower sum uses left endpoints and the upper sum
 * uses right endpoints (f is increasing). Both squeeze the integral 1/3.
 * Closed forms: L_n = (n-1)n(2n-1)/(6n^3), U_n = (n+1)n(2n+1)/(6n^3).
 * Pure computation: no DOM, d3, or three.
 */

const RIEMANN_LIMIT = 1 / 3;

interface RiemannBar {
  x0: number;
  x1: number;
  /** Lower rectangle height (left endpoint). */
  lo: number;
  /** Upper rectangle height (right endpoint). */
  hi: number;
}

export interface RiemannData {
  n: number;
  lower: number;
  upper: number;
  gap: number;
  limit: number;
  bars: RiemannBar[];
}

/** Sum of squares 1^2 + ... + m^2, exact integer arithmetic for small m. */
function sumOfSquares(m: number): number {
  return (m * (m + 1) * (2 * m + 1)) / 6;
}

export function riemannSums(n: number): { lower: number; upper: number } {
  const nn = Math.max(1, Math.round(n));
  const lower = sumOfSquares(nn - 1) / (nn * nn * nn);
  const upper = sumOfSquares(nn) / (nn * nn * nn);
  return { lower, upper };
}

function riemannData(n: number): RiemannData {
  const nn = Math.max(1, Math.min(64, Math.round(n)));
  const { lower, upper } = riemannSums(nn);
  const bars: RiemannBar[] = [];
  for (let k = 0; k < nn; k++) {
    const x0 = k / nn;
    const x1 = (k + 1) / nn;
    bars.push({ x0, x1, lo: x0 * x0, hi: x1 * x1 });
  }
  return { n: nn, lower, upper, gap: upper - lower, limit: RIEMANN_LIMIT, bars };
}

export const riemannModel: SceneModel<RiemannData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? raw : 12;
    return riemannData(n);
  },
};
