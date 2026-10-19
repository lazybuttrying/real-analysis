import type { SceneModel } from '../../../contracts';

/**
 * Thomae's popcorn function: f(x) = 1/q when x = p/q in lowest terms
 * (q >= 1), f(x) = 0 when x is irrational. Continuous at every
 * irrational, discontinuous at every rational. The scene plots the
 * popcorn dots (p/q, 1/q) for q <= Q and highlights the finitely many
 * dots with height >= epsilon, which drive the epsilon-delta proof of
 * continuity at an irrational center. Pure computation: no DOM, d3, or
 * three.
 */

export const THOMAE_Q_MIN = 1;
export const THOMAE_Q_MAX = 30;
export const THOMAE_Q_INIT = 12;

export const THOMAE_EPS_MIN = 0.02;
export const THOMAE_EPS_MAX = 0.5;
export const THOMAE_EPS_INIT = 0.1;

export const THOMAE_CENTER_MIN = 0;
export const THOMAE_CENTER_MAX = 1;
export const THOMAE_CENTER_INIT = 0.618034;

export const THOMAE_ZOOM_MIN = 0.02;
export const THOMAE_ZOOM_MAX = 0.5;
export const THOMAE_ZOOM_INIT = 0.1;

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export interface ThomaeDot {
  /** x = p/q in lowest terms. */
  x: number;
  /** Denominator in lowest terms. */
  q: number;
  /** f(x) = 1/q. */
  y: number;
}

export interface ThomaeData {
  qMax: number;
  epsilon: number;
  center: number;
  zoom: number;
  /** All popcorn dots with denominator q <= qMax, sorted by x. */
  dots: ThomaeDot[];
  /** The finitely many dots with f(x) >= epsilon: exactly those with q <= 1/epsilon. */
  tallDots: ThomaeDot[];
  /**
   * min |x - center| over the tall dots. This is the delta for the
   * epsilon-delta proof of continuity at an irrational center; 0 when
   * the center is itself one of the tall rationals.
   */
  delta: number;
  /**
   * True when the center is (numerically) one of the tall dots: the
   * epsilon-delta continuity argument for irrationals does not apply
   * at such a center.
   */
  centerIsTallRational: boolean;
}

function clampQ(q: number): number {
  if (!Number.isFinite(q)) return THOMAE_Q_INIT;
  return Math.max(THOMAE_Q_MIN, Math.min(THOMAE_Q_MAX, Math.round(q)));
}

function clampEps(e: number): number {
  if (!Number.isFinite(e)) return THOMAE_EPS_INIT;
  return Math.max(THOMAE_EPS_MIN, Math.min(THOMAE_EPS_MAX, e));
}

function clampCenter(c: number): number {
  if (!Number.isFinite(c)) return THOMAE_CENTER_INIT;
  return Math.max(THOMAE_CENTER_MIN, Math.min(THOMAE_CENTER_MAX, c));
}

function clampZoom(z: number): number {
  if (!Number.isFinite(z)) return THOMAE_ZOOM_INIT;
  return Math.max(THOMAE_ZOOM_MIN, Math.min(THOMAE_ZOOM_MAX, z));
}

/** All (p/q, 1/q) with 1 <= q <= qMax and p/q in lowest terms, sorted by x. */
export function thomaeDots(qMax: number): ThomaeDot[] {
  const qq = clampQ(qMax);
  const dots: ThomaeDot[] = [];
  for (let q = 1; q <= qq; q++) {
    for (let p = 0; p <= q; p++) {
      if (gcd(p, q) !== 1) continue;
      dots.push({ x: p / q, q, y: 1 / q });
    }
  }
  dots.sort((a, b) => a.x - b.x);
  return dots;
}

export function thomaeData(qMax: number, epsilon: number, center: number, zoom: number): ThomaeData {
  const qq = clampQ(qMax);
  const eps = clampEps(epsilon);
  const c = clampCenter(center);
  const z = clampZoom(zoom);
  const dots = thomaeDots(qq);
  const tallDots = dots.filter((d) => d.y >= eps);
  let delta = Infinity;
  let centerIsTallRational = false;
  for (const d of tallDots) {
    const dist = Math.abs(d.x - c);
    if (dist < 1e-12) {
      centerIsTallRational = true;
      delta = 0;
      break;
    }
    if (dist < delta) delta = dist;
  }
  return {
    qMax: qq,
    epsilon: eps,
    center: c,
    zoom: z,
    dots,
    tallDots,
    delta: centerIsTallRational ? 0 : delta,
    centerIsTallRational,
  };
}

export const thomaeModel: SceneModel<ThomaeData> = {
  compute(state) {
    return thomaeData(Number(state['Q']), Number(state['eps']), Number(state['center']), Number(state['zoom']));
  },
};
