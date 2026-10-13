import type { SceneModel } from '../../../contracts';

/**
 * f_n(x) = x^n on [0,1]: converges pointwise (to 0 on [0,1), to 1 at x = 1)
 * but not uniformly, because sup|f_n − f| = 1 never shrinks. The scene shows
 * the ε-tube around the limit and the point where the curve escapes it.
 * Pure computation: no DOM, d3, or three.
 */

export const GRID_POINTS = 400;
export const MAX_N = 60;

export interface UniformSample {
  x: number;
  y: number;
}

export interface UniformData {
  n: number;
  epsilon: number;
  samples: UniformSample[];
  /** Max over the grid of |x^n − f(x)|, where f is the pointwise limit. */
  supNorm: number;
  /** Smallest x with x^n > ε: the tube is escaped just right of this point. */
  escapeX: number;
}

export function uniformData(n: number, epsilon: number, m: number = GRID_POINTS): UniformData {
  const samples: UniformSample[] = [];
  let supNorm = 0;
  for (let i = 0; i <= m; i++) {
    const x = i / m;
    const y = Math.pow(x, n);
    samples.push({ x, y });
    const diff = x < 1 ? y : 0;
    if (diff > supNorm) supNorm = diff;
  }
  return { n, epsilon, samples, supNorm, escapeX: Math.pow(epsilon, 1 / n) };
}

export const uniformModel: SceneModel<UniformData> = {
  compute(state) {
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? Math.min(MAX_N, Math.max(1, Math.floor(nRaw))) : 8;
    const eRaw = Number(state['eps']);
    const epsilon = Number.isFinite(eRaw) ? Math.min(0.9, Math.max(0.01, eRaw)) : 0.2;
    return uniformData(n, epsilon);
  },
};
