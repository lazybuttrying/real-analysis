import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * Wallis product for pi/2. Each factor pair swings the running product
 * past pi/2 - first above, then below - with ever-smaller swings.
 */

const MAX_PAIRS = 40;

export const LIMIT = Math.PI / 2;

interface ProductPoint {
  /** How many individual factors have been multiplied in so far */
  step: number;
  value: number;
}

export interface WallisData {
  pairs: number;
  /** Running product after every single factor, starting from 1 at step 0 */
  points: ProductPoint[];
  product: number;
  /** Total number of factors multiplied in, 2 * pairs */
  factors: number;
  limit: number;
  error: number;
}

export function wallisProduct(pairs: number): WallisData {
  const points: ProductPoint[] = [{ step: 0, value: 1 }];
  let p = 1;
  let step = 0;
  for (let n = 1; n <= pairs; n++) {
    p *= (2 * n) / (2 * n - 1);
    step += 1;
    points.push({ step, value: p });
    p *= (2 * n) / (2 * n + 1);
    step += 1;
    points.push({ step, value: p });
  }
  return {
    pairs,
    points,
    product: p,
    factors: step,
    limit: LIMIT,
    error: Math.abs(p - LIMIT),
  };
}

export const wallisModel: SceneModel<WallisData> = {
  compute(state) {
    const raw = Number(state['n']);
    const pairs = Number.isFinite(raw) ? Math.min(MAX_PAIRS, Math.max(1, Math.floor(raw))) : 1;
    return wallisProduct(pairs);
  },
};
