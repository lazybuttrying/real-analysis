import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The squeeze theorem, live: b_n = sin(n) / n is trapped between
 * a_n = -1 / n and c_n = 1 / n, and both guards tend to 0, so b_n
 * must tend to 0 as well. Pure computation: no DOM, d3, or three.
 */

export interface SeqPoint {
  n: number;
  lower: number;
  mid: number;
  upper: number;
}

export interface SqueezeData {
  /** Number of terms shown. */
  terms: number;
  points: readonly SeqPoint[];
  /** The last shown middle value, b_terms = sin(terms) / terms. */
  lastMid: number;
  /** The last shown upper value, 1 / terms. */
  lastUpper: number;
}

export function squeezePoints(terms: number): SeqPoint[] {
  const out: SeqPoint[] = [];
  for (let n = 1; n <= terms; n++) {
    out.push({ n, lower: -1 / n, mid: Math.sin(n) / n, upper: 1 / n });
  }
  return out;
}

function clampTerms(v: number): number {
  if (!Number.isFinite(v)) return 30;
  return Math.max(5, Math.min(60, Math.round(v)));
}

export function squeezeData(terms: number): SqueezeData {
  const t = clampTerms(terms);
  const points = squeezePoints(t);
  const last = points[points.length - 1]!;
  return { terms: t, points, lastMid: last.mid, lastUpper: last.upper };
}

export const squeezeModel: SceneModel<SqueezeData> = {
  compute(state: ControlState): SqueezeData {
    return squeezeData(Number(state['n']));
  },
};
