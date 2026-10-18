import type { SceneModel } from '../../../contracts';

/**
 * Cauchy's mean value theorem, demoed on f(t) = t^2 and g(t) = t^3 over [1, 2].
 * The parametric curve (g(t), f(t)) has the chord from (1, 1) to (8, 4) of
 * slope (f(2)-f(1))/(g(2)-g(1)) = 3/7; the tangent at t has slope
 * f'(t)/g'(t) = 2t/(3t^2) = 2/(3t), which equals 3/7 at t = 14/9.
 * Pure computation: no DOM, d3, or three.
 */

export const CAUCHY_A = 1;
export const CAUCHY_B = 2;

function cauchyF(t: number): number {
  return t * t;
}

function cauchyG(t: number): number {
  return t * t * t;
}

function cauchyFp(t: number): number {
  return 2 * t;
}

function cauchyGp(t: number): number {
  return 3 * t * t;
}

/** The chord slope (f(b)-f(a))/(g(b)-g(a)) = (4-1)/(8-1) = 3/7. */
export function cauchyChordSlope(): number {
  return (cauchyF(CAUCHY_B) - cauchyF(CAUCHY_A)) / (cauchyG(CAUCHY_B) - cauchyG(CAUCHY_A));
}

/** The slope ratio f'(t)/g'(t) = 2/(3t): the dy/dx of the parametric curve. */
export function cauchySlopeRatio(t: number): number {
  return cauchyFp(t) / cauchyGp(t);
}

/**
 * Closed-form theorem point: 2/(3t) = 3/7 solves to t = 14/9.
 * Derived, not hardcoded as a decimal.
 */
export function cauchyTheoremXi(): number {
  return 14 / 9;
}

interface CauchyMVTSample {
  /** x = g(t). */
  x: number;
  /** y = f(t). */
  y: number;
}

export interface CauchyMVTData {
  a: number;
  b: number;
  /** Slider value: the parameter where the tangent is drawn. */
  xi: number;
  chordSlope: number;
  /** f'(xi)/g'(xi): the slope of the tangent to the parametric curve at xi. */
  tangentSlopeRatio: number;
  /** The exact theorem point 14/9, where the ratio equals the chord slope. */
  theoremXi: number;
  /** Points (g(t), f(t)) for t in [a, b]. */
  curve: CauchyMVTSample[];
}

export function cauchyMVTData(xi: number): CauchyMVTData {
  const clamped = Math.min(CAUCHY_B, Math.max(CAUCHY_A, xi));
  const curve: CauchyMVTSample[] = [];
  const m = 200;
  for (let i = 0; i <= m; i++) {
    const t = CAUCHY_A + ((CAUCHY_B - CAUCHY_A) * i) / m;
    curve.push({ x: cauchyG(t), y: cauchyF(t) });
  }
  return {
    a: CAUCHY_A,
    b: CAUCHY_B,
    xi: clamped,
    chordSlope: cauchyChordSlope(),
    tangentSlopeRatio: cauchySlopeRatio(clamped),
    theoremXi: cauchyTheoremXi(),
    curve,
  };
}

export const cauchyMvtModel: SceneModel<CauchyMVTData> = {
  compute(state) {
    const raw = Number(state['xi']);
    return cauchyMVTData(Number.isFinite(raw) ? raw : 1.56);
  },
};
