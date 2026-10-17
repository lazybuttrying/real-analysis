import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Pure model for the P1 -> R^2 coefficient isomorphism visualization.
 * A polynomial a + b*x is drawn as a line (left panel) and as the
 * coefficient point (a, b) (right panel): same object, two packagings.
 * Pure computation: no DOM, d3, or three.
 */

export interface VectorSpacesData {
  /** Intercept a of the line y = a + b*x. */
  a: number;
  /** Slope b of the line y = a + b*x. */
  b: number;
  /** 41 samples [x, a + b*x] with x ranging over [-1, 1]. */
  line: Array<[number, number]>;
  /** The coefficient point [a, b] in the plane. */
  point: [number, number];
}

const SAMPLE_COUNT = 41;
const X_MIN = -1;
const X_MAX = 1;
const COEFF_MIN = -2;
const COEFF_MAX = 2;

function clampCoeff(value: unknown, fallback: number): number {
  if (typeof value !== 'number') return fallback;
  return clampNumber(value, COEFF_MIN, COEFF_MAX, fallback);
}

export function vectorSpacesData(a: number, b: number): VectorSpacesData {
  const ca = clampCoeff(a, 1);
  const cb = clampCoeff(b, 0.5);
  const line: Array<[number, number]> = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / (SAMPLE_COUNT - 1);
    line.push([x, ca + cb * x]);
  }
  return { a: ca, b: cb, line, point: [ca, cb] };
}

export const vectorSpacesModel: SceneModel<VectorSpacesData> = {
  compute(state) {
    return vectorSpacesData(state['a'] as number, state['b'] as number);
  },
};
