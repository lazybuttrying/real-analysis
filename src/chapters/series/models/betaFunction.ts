import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';
import { gamma } from './gamma';

/**
 * The beta function B(p, q) = integral_0^1 t^{p-1} (1-t)^{q-1} dt for p, q > 0.
 *
 * Values are computed through the Gamma relation B(p,q) = Gamma(p) Gamma(q) /
 * Gamma(p+q), with Gamma evaluated by the shared Simpson-quadrature
 * implementation in ./gamma (the Lanczos copy that used to live here was
 * removed; the shared implementation is validated to ~1e-12 on the values
 * the tests pin, e.g. B(1,1) = 1). Direct composite Simpson on [0, 1] would
 * lose accuracy for p or q below 1 because the integrand then has a singular
 * derivative at the endpoint, so the Gamma relation is the more honest
 * numeric route here.
 *
 * Pure computation: no DOM, d3, or three.
 */

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

interface BetaSample {
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
    const clamp = (raw: unknown, fallback: number): number =>
      clampNumber(raw, 0.2, 5, fallback);
    return betaData(clamp(state['p'], 2), clamp(state['q'], 3));
  },
};
