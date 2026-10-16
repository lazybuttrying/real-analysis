import type { SceneModel } from '../../../contracts';

/**
 * The gamma function Gamma(x) = integral_0^infinity t^{x-1} e^{-t} dt,
 * the continuous extension of the factorial. Values are computed with
 * composite Simpson's rule (4000 even subintervals) applied to the
 * square-root-substituted integral
 *
 *   Gamma(x) = integral_0^sqrt(40) 2 u^{2x-1} e^{-u^2} du    (t = u^2)
 *
 * The direct integrand t^{x-1} e^{-t} has a singular derivative at t = 0
 * for non-integer x, which caps uniform Simpson at ~1e-4; the substituted
 * integrand is smooth on [1, 2] for x in [1, 2] and reaches ~1e-8
 * (Richardson check against 16000 panels). The tail past t = 40 is
 * below 1e-16. Extended to [0.1, 4] by Gamma(x+1) = x * Gamma(x).
 * Pure computation: no DOM, d3, or three.
 */

/** Composite Simpson's rule with an even number of subintervals. */
export function simpson(f: (t: number) => number, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (sum * h) / 3;
}

/** Gamma on [1, 2] by quadrature of the substituted integral. */
export function gammaUnit(x: number): number {
  // u = 0 is a single point (measure zero); the limit of the integrand is 0 for x > 1/2.
  const f = (u: number): number => (u === 0 ? 0 : 2 * Math.pow(u, 2 * x - 1) * Math.exp(-u * u));
  return simpson(f, 0, Math.sqrt(40), 4000);
}

/** Gamma for x > 0, via the recurrence Gamma(x+1) = x * Gamma(x). */
export function gamma(x: number): number {
  if (x < 1) return gamma(x + 1) / x;
  if (x > 2) return (x - 1) * gamma(x - 1);
  return gammaUnit(x);
}

export interface GammaSample {
  x: number;
  y: number;
}

export interface GammaData {
  x: number;
  value: number;
  samples: GammaSample[];
  dots: Array<{ x: number; y: number }>;
}

export function gammaData(x: number): GammaData {
  const samples: GammaSample[] = [];
  for (let i = 0; i < 200; i++) {
    const sx = 0.05 + (i / 199) * 3.95;
    samples.push({ x: sx, y: gamma(sx) });
  }
  return {
    x,
    value: gamma(x),
    samples,
    dots: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 6 },
    ],
  };
}

export const gammaModel: SceneModel<GammaData> = {
  compute(state) {
    const raw = Number(state['x']);
    const x = Number.isFinite(raw) ? Math.min(4, Math.max(0.1, raw)) : 2;
    return gammaData(x);
  },
};
