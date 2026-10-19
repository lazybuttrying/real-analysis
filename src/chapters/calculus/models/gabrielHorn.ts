import type { SceneModel } from '../../../contracts';

/**
 * Gabriel's horn (Torricelli's trumpet): y = 1/x for x >= 1, rotated about
 * the x-axis. Volume of the horn truncated at R:
 *   V(R) = pi * integral_1^R x^{-2} dx = pi (1 - 1/R) -> pi (FINITE).
 * Surface area of the truncated horn:
 *   A(R) = 2 pi * integral_1^R (1/x) sqrt(1 + 1/x^4) dx,
 * and since sqrt(1 + 1/x^4) > 1,
 *   A(R) > 2 pi * integral_1^R dx/x = 2 pi ln R -> infinity (INFINITE).
 * Finite volume, infinite surface area: you can fill the horn with pi units
 * of paint, but you cannot paint its surface.
 * Pure computation: no DOM, d3, or three.
 */

export const GABRIEL_R_MIN = 1;
export const GABRIEL_R_MAX = 50;
export const GABRIEL_R_INIT = 5;

/** Grid points for the Simpson quadrature of the surface area. */
export const GABRIEL_QUAD_POINTS = 4000;

/** Sample points on the profile curve y = 1/x for drawing. */
export const GABRIEL_PROFILE_POINTS = 200;

export function clampR(r: number): number {
  if (!Number.isFinite(r)) return GABRIEL_R_INIT;
  return Math.max(GABRIEL_R_MIN, Math.min(GABRIEL_R_MAX, r));
}

/** Exact volume of the horn truncated at R: pi (1 - 1/R). */
export function gabrielVolume(r: number): number {
  const R = clampR(r);
  return Math.PI * (1 - 1 / R);
}

/**
 * Lower bound for the surface area truncated at R. Since
 * sqrt(1 + 1/x^4) > 1 on [1, R],
 *   A(R) > 2 pi * integral_1^R dx/x = 2 pi ln R.
 */
export function gabrielAreaLower(r: number): number {
  return 2 * Math.PI * Math.log(clampR(r));
}

/** Exact surface-area integrand: 2 pi (1/x) sqrt(1 + 1/x^4). */
export function gabrielAreaIntegrand(x: number): number {
  return (2 * Math.PI * Math.sqrt(1 + 1 / Math.pow(x, 4))) / x;
}

/**
 * Surface area on [1, R] by Simpson quadrature on a uniform grid.
 * The integrand is smooth on [1, R], so the quadrature converges to the
 * true area; it always stays above the 2 pi ln R lower bound.
 */
export function gabrielAreaNumeric(r: number): number {
  const R = clampR(r);
  if (R <= GABRIEL_R_MIN) return 0;
  const n = GABRIEL_QUAD_POINTS;
  const h = (R - GABRIEL_R_MIN) / n;
  let sum = gabrielAreaIntegrand(GABRIEL_R_MIN) + gabrielAreaIntegrand(R);
  for (let i = 1; i < n; i++) {
    const x = GABRIEL_R_MIN + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * gabrielAreaIntegrand(x);
  }
  return (sum * h) / 3;
}

export interface GabrielHornProfilePoint {
  x: number;
  y: number;
}

export interface GabrielHornData {
  r: number;
  /** Exact truncated volume pi (1 - 1/R). */
  volume: number;
  /** Exact limit of the volume as R -> infinity. */
  volumeLimit: number;
  /** Lower bound 2 pi ln R for the surface area. */
  areaLower: number;
  /** Surface area by Simpson quadrature (always above the lower bound). */
  areaNumeric: number;
  /** Profile points (x, 1/x) on [1, R] for drawing. */
  profile: GabrielHornProfilePoint[];
  /** x-stations for the fake-3D cross-section ellipses. */
  stations: number[];
}

export function gabrielHornData(r: number): GabrielHornData {
  const R = clampR(r);
  const profile: GabrielHornProfilePoint[] = [];
  for (let i = 0; i <= GABRIEL_PROFILE_POINTS; i++) {
    const x = 1 + ((R - 1) * i) / GABRIEL_PROFILE_POINTS;
    profile.push({ x, y: 1 / x });
  }
  // Station ellipses: cluster near x = 1 where the horn is wide.
  const stations: number[] = [];
  const N_STATIONS = 9;
  for (let i = 0; i < N_STATIONS; i++) {
    const t = i / (N_STATIONS - 1);
    stations.push(1 + (R - 1) * t * t);
  }
  return {
    r: R,
    volume: gabrielVolume(R),
    volumeLimit: Math.PI,
    areaLower: gabrielAreaLower(R),
    areaNumeric: gabrielAreaNumeric(R),
    profile,
    stations,
  };
}

export const gabrielHornModel: SceneModel<GabrielHornData> = {
  compute(state) {
    return gabrielHornData(Number(state['r']));
  },
};
