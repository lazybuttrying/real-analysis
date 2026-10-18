import type { SceneModel } from '../../../contracts';

/**
 * The Babylonian (Heron) iteration for sqrt(2): x_{n+1} = (x_n + 2/x_n) / 2
 * from x_0 = 1. Every term is rational; the limit sqrt(2) is not.
 * The exact fraction p/q is tracked with BigInt so the "all terms are
 * rational" claim is literally visible. Pure computation: no DOM, d3, or three.
 */

const MAX_ITERATIONS = 8;

interface BabylonianStep {
  n: number;
  /** Exact numerator/denominator of x_n */
  p: bigint;
  q: bigint;
  value: number;
  /** |x_n − √2| */
  error: number;
}

export function babylonian(iterations: number): BabylonianStep[] {
  const steps: BabylonianStep[] = [];
  let p = 1n;
  let q = 1n;
  const push = (n: number): void => {
    const value = Number(p) / Number(q);
    steps.push({ n, p, q, value, error: Math.abs(value - Math.SQRT2) });
  };
  push(0);
  for (let n = 1; n <= iterations; n++) {
    // (p/q + 2q/p) / 2 = (p^2 + 2q^2) / (2pq)
    const nextP = p * p + 2n * q * q;
    const nextQ = 2n * p * q;
    p = nextP;
    q = nextQ;
    push(n);
  }
  return steps;
}

export interface HolesData {
  n: number;
  steps: BabylonianStep[];
}

export const holesModel: SceneModel<HolesData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_ITERATIONS, Math.max(0, Math.floor(raw))) : 4;
    return { n, steps: babylonian(n) };
  },
};
