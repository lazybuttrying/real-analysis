import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Propositions 4.4.1 and 4.4.3: the rationals are dense in
 * the reals. Given x < y, put n = floor(1/(y-x)) + 1 (so 1/n < y - x by the
 * Archimedean property) and m = floor(n*x) + 1 (so m - 1 <= n*x < m by
 * Prop 4.4.1); then x < m/n < y. The model also lists every rational with
 * denominator <= denom inside (x, y) so the viz can show the ticks
 * multiplying as the denominator cap grows.
 *
 * Verified numbers (tests/density-of-rationals.test.ts):
 *   preset a (1, 2):     n = 2,  m = 3,   q = 3/2 = 1.5;
 *   preset b (0, 0.1):   n = 11, m = 1,   q = 1/11 = 0.090909...;
 *   preset c (-3.5, -3.4): n = 11, m = -38, q = -38/11 = -3.4545...;
 *   x < m/n < y holds (strict) for all three presets and for the
 *   (x, width) test grid; every listed grid point lies strictly inside
 *   (x, y) with denominator <= denom.
 */

const PRESET_IDS = ['a', 'b', 'c'] as const;
export type DensityPresetId = (typeof PRESET_IDS)[number];
export const PRESET_INIT: DensityPresetId = 'a';

export const PRESET_INTERVALS: Readonly<Record<DensityPresetId, { x: number; y: number }>> = {
  a: { x: 1, y: 2 },
  b: { x: 0, y: 0.1 },
  c: { x: -3.5, y: -3.4 },
};

export const DENOM_MIN = 1;
export const DENOM_MAX = 200;
export const DENOM_INIT = 24;

interface ConstructedRational {
  /**
   * The n from the Archimedean step: floor(1/(y-x)) + 1, stepped up if
   * needed so that x < m/n < y holds strictly in floating point.
   */
  n: number;
  /** The m from Prop 4.4.1: floor(n*x) + 1. */
  m: number;
  /** The constructed rational m/n. */
  value: number;
  /** Whether x < m/n < y holds (checked in floating point). */
  verified: boolean;
}

/**
 * Tao's construction: n = floor(1/(y-x)) + 1, m = floor(n*x) + 1.
 * In floating point the quotient m/n can round onto an endpoint for
 * unlucky intervals (e.g. (-3.5, -3.4): n = 10 gives q = -3.4 = y).
 * Since a larger n still satisfies 1/n < y - x, step n up until the
 * strict inequality holds; the Archimedean recipe stays intact.
 * Pure: no DOM, no d3.
 */
export function constructRational(x: number, y: number): ConstructedRational {
  let n = Math.floor(1 / (y - x)) + 1;
  for (let tries = 0; tries < 10000; tries++) {
    const m = Math.floor(n * x) + 1;
    const value = m / n;
    if (x < value && value < y) return { n, m, value, verified: true };
    n++;
  }
  const m = Math.floor(n * x) + 1;
  const value = m / n;
  return { n, m, value, verified: x < value && value < y };
}

interface RationalTick {
  p: number;
  q: number;
  value: number;
}

export interface DensityOfRationalsData {
  preset: DensityPresetId;
  x: number;
  y: number;
  /** Clamped denominator cap from the 'denom' control. */
  denom: number;
  constructed: ConstructedRational;
  /** Every rational p/q strictly inside (x, y) with 1 <= q <= denom. */
  grid: RationalTick[];
}

/**
 * Lists the rationals strictly inside (x, y) with denominator <= denom.
 * Pure: no DOM, no d3.
 */
export function rationalsInInterval(x: number, y: number, denom: number): RationalTick[] {
  const grid: RationalTick[] = [];
  for (let q = 1; q <= denom; q++) {
    const pMin = Math.floor(q * x) + 1;
    const pMax = Math.ceil(q * y) - 1;
    for (let p = pMin; p <= pMax; p++) {
      const value = p / q;
      // Strict check in floating point: excludes endpoints even when
      // q*x or q*y lands exactly on an integer (e.g. -34/10 = -3.4 = y).
      if (value > x && value < y) grid.push({ p, q, value });
    }
  }
  return grid;
}

export function densityOfRationalsData(
  preset: DensityPresetId,
  denom: number,
): DensityOfRationalsData {
  const { x, y } = PRESET_INTERVALS[preset];
  return {
    preset,
    x,
    y,
    denom,
    constructed: constructRational(x, y),
    grid: rationalsInInterval(x, y, denom),
  };
}

export const densityOfRationalsModel: SceneModel<DensityOfRationalsData> = {
  compute(state) {
    const rawPreset = String(state['preset'] ?? PRESET_INIT);
    const preset: DensityPresetId = (PRESET_IDS as readonly string[]).includes(rawPreset)
      ? (rawPreset as DensityPresetId)
      : PRESET_INIT;
    const rawDenom = Number(state['denom']);
    const denom = Number.isFinite(rawDenom)
      ? Math.round(Math.min(DENOM_MAX, Math.max(DENOM_MIN, rawDenom)))
      : DENOM_INIT;
    return densityOfRationalsData(preset, denom);
  },
};
