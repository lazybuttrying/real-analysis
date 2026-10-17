import type { ControlState, SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Sequence spaces: the bridge between vector spaces and metric spaces.
 * l^1 = { x : sum |x_n| < infinity }, l^2 = { x : sum |x_n|^2 < infinity },
 * l^infinity = { x : sup |x_n| < infinity } (bounded sequences), and C[0,1]
 * with the sup norm. Each is a vector space under pointwise operations (the
 * vector-spaces scene) and a metric space via d(x, y) = ||x - y|| (the
 * metric-spaces scene) — a normed space is both at once.
 * The counterintuitive inclusion l^1 subset l^2 subset l^infinity is made
 * visible through x_n = 1/n^alpha: memberships drop out one by one as
 * alpha shrinks (l^1 needs alpha > 1, l^2 needs alpha > 1/2, l^infinity
 * always holds).
 * Pure computation: no DOM, d3, or three.
 */

export const VIEW_KINDS = ['balls', 'sequence'] as const;
export type ViewKind = (typeof VIEW_KINDS)[number];

export const P_KINDS = ['1', '2', 'inf'] as const;
export type PKind = (typeof P_KINDS)[number];

/** Number of terms used for the partial-sum norm readouts. */
export const TERMS = 200;

export interface LpMembership {
  inL1: boolean;
  inL2: boolean;
  inLInf: boolean;
}

export interface SequenceSpacesData {
  view: ViewKind;
  p: PKind;
  alpha: number;
  /** Points of the unit sphere { (x, y) : |x|^p + |y|^p = 1 }, counterclockwise. */
  ballCurve: ReadonlyArray<readonly [number, number]>;
  /** Membership of (1/n^alpha) in the three sequence spaces. */
  membership: LpMembership;
  /** Partial sums of |x_n| and x_n^2 for x_n = 1/n^alpha, n = 1..TERMS. */
  sumAbs: number;
  sumSq: number;
}

export function viewKindOf(raw: unknown): ViewKind {
  return raw === 'sequence' ? 'sequence' : 'balls';
}

export function pKindOf(raw: unknown): PKind {
  return raw === '1' || raw === 'inf' ? raw : '2';
}

/** x_n = 1 / n^alpha. */
export function term(alpha: number, n: number): number {
  return 1 / Math.pow(n, alpha);
}

/** Membership of (1/n^alpha) in l^1, l^2, l^infinity. */
export function lpMembership(alpha: number): LpMembership {
  return { inL1: alpha > 1, inL2: alpha > 0.5, inLInf: true };
}

/** Partial sum of |x_n| = 1/n^alpha over n = 1..terms. */
export function partialSumAbs(alpha: number, terms: number): number {
  let sum = 0;
  for (let n = 1; n <= terms; n++) sum += term(alpha, n);
  return sum;
}

/** Partial sum of x_n^2 = 1/n^(2 alpha) over n = 1..terms. */
export function partialSumSq(alpha: number, terms: number): number {
  let sum = 0;
  for (let n = 1; n <= terms; n++) {
    const t = term(alpha, n);
    sum += t * t;
  }
  return sum;
}

/** Sup-norm distance between two finite sequences (for the metric-axiom checks). */
export function supDist(a: readonly number[], b: readonly number[]): number {
  let max = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = Math.abs((a[i] ?? 0) - (b[i] ?? 0));
    if (d > max) max = d;
  }
  return max;
}

/**
 * Points of the p-unit sphere, counterclockwise.
 * For p = 1 (diamond) and p = 2 (circle): (sign(cos t)|cos t|^(2/p),
 * sign(sin t)|sin t|^(2/p)). For p = infinity: the square max(|x|,|y|) = 1,
 * walked edge by edge.
 */
export function unitBallCurve(p: PKind, segments: number): Array<readonly [number, number]> {
  const pts: Array<readonly [number, number]> = [];
  if (p === 'inf') {
    const corners: Array<readonly [number, number]> = [
      [1, -1],
      [1, 1],
      [-1, 1],
      [-1, -1],
    ];
    const per = Math.max(1, Math.floor(segments / 4));
    for (let k = 0; k < 4; k++) {
      const a = corners[k] ?? [1, -1];
      const b = corners[(k + 1) % 4] ?? [1, 1];
      for (let i = 0; i < per; i++) {
        const t = i / per;
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    pts.push([1, -1]);
    return pts;
  }
  const exp = 2 / Number(p);
  for (let i = 0; i <= segments; i++) {
    const t = (2 * Math.PI * i) / segments;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pts.push([Math.sign(c) * Math.pow(Math.abs(c), exp), Math.sign(s) * Math.pow(Math.abs(s), exp)]);
  }
  return pts;
}

function clampAlpha(raw: number): number {
  return clampNumber(raw, 0.2, 2, 1);
}

export function sequenceSpacesData(view: ViewKind, p: PKind, alpha: number): SequenceSpacesData {
  return {
    view,
    p,
    alpha,
    ballCurve: unitBallCurve(p, 128),
    membership: lpMembership(alpha),
    sumAbs: partialSumAbs(alpha, TERMS),
    sumSq: partialSumSq(alpha, TERMS),
  };
}

export const sequenceSpacesModel: SceneModel<SequenceSpacesData> = {
  compute(state: ControlState) {
    return sequenceSpacesData(viewKindOf(state['view']), pKindOf(state['p']), clampAlpha(Number(state['alpha'] ?? 1)));
  },
};
