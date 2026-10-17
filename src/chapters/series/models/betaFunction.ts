import type { SceneModel } from '../../../contracts';

/**
 * The beta function B(p, q) = integral_0^1 t^{p-1} (1-t)^{q-1} dt for p, q > 0.
 *
 * Values are computed through the Gamma relation B(p,q) = Gamma(p) Gamma(q) /
 * Gamma(p+q), with Gamma evaluated by the Lanczos approximation (g = 7, nine
 * coefficients), accurate to ~1e-12 over the control range [0.2, 5]. Direct
 * composite Simpson on [0, 1] would lose accuracy for p or q below 1 because
 * the integrand then has a singular derivative at the endpoint, so the
 * Gamma relation is the more honest numeric route here.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Lanczos coefficients for g = 7 (standard nine-coefficient set). */
const LANCZOS_COEFFICIENTS: readonly number[] = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

/** Gamma(x) for x > 0 via the Lanczos approximation, with reflection below 1/2. */
export function gamma(x: number): number {
  if (x < 0.5) {
    // Reflection formula: keeps the approximation valid for any positive x.
    return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  }
  const z = x - 1;
  let sum = LANCZOS_COEFFICIENTS[0] ?? 1;
  for (let i = 1; i < LANCZOS_COEFFICIENTS.length; i++) {
    sum += (LANCZOS_COEFFICIENTS[i] ?? 0) / (z + i);
  }
  const t = z + 7.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * sum;
}

/** The beta value through the Gamma relation. */
export function beta(p: number, q: number): number {
  return (gamma(p) * gamma(q)) / gamma(p + q);
}

/** Clamp radius at the endpoints: for p or q below 1 the integrand is singular at 0 or 1. */
const T_CLAMP = 1e-9;

/** The integrand t^{p-1} (1-t)^{q-1}, with t kept inside (0, 1) so samples stay finite. */
export function integrand(p: number, q: number, t: number): number {
  const tc = Math.min(1 - T_CLAMP, Math.max(T_CLAMP, t));
  return Math.pow(tc, p - 1) * Math.pow(1 - tc, q - 1);
}

/** Number of integrand samples on [0, 1]. */
export const SAMPLE_COUNT = 121;

export interface BetaSample {
  t: number;
  y: number;
}

export interface BetaData {
  p: number;
  q: number;
  value: number;
  samples: BetaSample[];
}

export function betaData(p: number, q: number): BetaData {
  const samples: BetaSample[] = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = i / (SAMPLE_COUNT - 1);
    samples.push({ t, y: integrand(p, q, t) });
  }
  return { p, q, value: beta(p, q), samples };
}

export const betaModel: SceneModel<BetaData> = {
  compute(state) {
    const clamp = (raw: unknown, fallback: number): number => {
      const value = Number(raw);
      return Number.isFinite(value) ? Math.min(5, Math.max(0.2, value)) : fallback;
    };
    return betaData(clamp(state['p'], 2), clamp(state['q'], 3));
  },
};
