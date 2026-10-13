import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Formal epsilon-delta limit of f(x) = 2x at a = 1 (L = 2).
 * The model computes delta = epsilon / 2 and samples f on a grid to check
 * that the implication |x - a| < delta => |f(x) - L| < epsilon really holds.
 * Pure computation: no DOM, d3, or three.
 */

export const EPS_DELTA_A = 1;
export const EPS_DELTA_L = 2;
export const EPS_DELTA_SLOPE = 2;

/** General linear rule delta = epsilon / |slope|, used by the proofs too. */
export function linearDelta(epsilon: number, slope: number): number {
  return epsilon / Math.abs(slope);
}

export function epsDeltaDelta(epsilon: number): number {
  return linearDelta(epsilon, EPS_DELTA_SLOPE);
}

export function epsDeltaF(x: number): number {
  return EPS_DELTA_SLOPE * x;
}

export interface EpsDeltaSample {
  x: number;
  fx: number;
  inDelta: boolean;
}

export interface EpsDeltaData {
  a: number;
  l: number;
  epsilon: number;
  delta: number;
  samples: EpsDeltaSample[];
  /** True when every sampled x with |x - a| < delta satisfies |f(x) - L| < epsilon. */
  gridPass: boolean;
}

export function epsDeltaData(epsilon: number): EpsDeltaData {
  const a = EPS_DELTA_A;
  const l = EPS_DELTA_L;
  const delta = epsDeltaDelta(epsilon);
  const span = delta * 1.75;
  const count = 201;
  const samples: EpsDeltaSample[] = [];
  for (let i = 0; i < count; i++) {
    const x = a - span + ((2 * span * i) / (count - 1));
    const fx = epsDeltaF(x);
    samples.push({ x, fx, inDelta: Math.abs(x - a) < delta });
  }
  const gridPass = samples.every((s) => !s.inDelta || Math.abs(s.fx - l) < epsilon);
  return { a, l, epsilon, delta, samples, gridPass };
}

function clampEpsilon(raw: number): number {
  if (!Number.isFinite(raw)) return 0.4;
  return Math.min(1, Math.max(0.05, raw));
}

export const epsdeltaModel: SceneModel<EpsDeltaData> = {
  compute(state: ControlState) {
    return epsDeltaData(clampEpsilon(Number(state['epsilon'] ?? 0.4)));
  },
};
