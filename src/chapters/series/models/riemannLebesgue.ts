import type { SceneModel } from '../../../contracts';

/**
 * Riemann-Lebesgue lemma, live: the Fourier coefficients of an integrable
 * function on [0, 2pi] tend to 0. Three modes:
 *   step   f = 1_[0, pi]            b_n = (1 - (-1)^n) / (n pi) -> 0, a_n = 0
 *   tent   f = max(0, 1 - |x-pi|/pi)  a_n = 4/(pi^2 n^2) for odd n, 0 for
 *            even n (decay 1/n^2: smoother means faster decay), b_n = 0
 *   smooth f = sin^2 x              a_2 = -1/2, every other coeff is 0
 * Coefficients are computed by fine-grid Simpson quadrature of
 *   a_n = (1/pi) int_0^{2pi} f(x) cos(nx) dx,
 *   b_n = (1/pi) int_0^{2pi} f(x) sin(nx) dx.
 * Pure computation: no DOM, d3, or three.
 */

export const RL_N_MIN = 1;
export const RL_N_MAX = 40;
export const RL_N_INIT = 12;

export const RL_MODES = ['step', 'tent', 'smooth'] as const;
export type RlMode = (typeof RL_MODES)[number];
export const RL_MODE_INIT: RlMode = 'step';

export const RL_KINDS = ['a', 'b'] as const;
export type CoeffKind = (typeof RL_KINDS)[number];
export const RL_KIND_INIT: CoeffKind = 'b';

/** Simpson panels over [0, 2pi]; even, so x = pi is a grid point. */
const RL_PANELS = 16384;

export const RL_TWO_PI = 2 * Math.PI;

function rlFunction(mode: RlMode): (x: number) => number {
  switch (mode) {
    case 'tent':
      return (x) => Math.max(0, 1 - Math.abs(x - Math.PI) / Math.PI);
    case 'smooth':
      return (x) => {
        const s = Math.sin(x);
        return s * s;
      };
    default:
      return (x) => (x < Math.PI ? 1 : 0);
  }
}

/** Closed forms used by tests to validate the quadrature. */
export function rlExactA(mode: RlMode, n: number): number {
  if (n < 1) return 0;
  switch (mode) {
    case 'tent':
      // Negative: cos(nx) is ~(-1)^n near the bump at x = pi, and the bump
      // is positive, so a_n has the sign of (-1)^n * (1 - (-1)^n) <= 0.
      return n % 2 === 1 ? -4 / (Math.PI * Math.PI * n * n) : 0;
    case 'smooth':
      return n === 2 ? -0.5 : 0;
    default:
      return 0;
  }
}

export function rlExactB(mode: RlMode, n: number): number {
  if (n < 1) return 0;
  if (mode === 'step') {
    const negOnePowN = n % 2 === 0 ? 1 : -1;
    return (1 - negOnePowN) / (n * Math.PI);
  }
  return 0;
}

interface RiemannLebesgueCoeff {
  n: number;
  a: number;
  b: number;
}

export interface RiemannLebesgueData {
  mode: RlMode;
  kind: CoeffKind;
  nMax: number;
  /** The probe frequency shown in the integrand panel (tracks N). */
  probeN: number;
  coeffs: RiemannLebesgueCoeff[];
  /** |coeff| of the selected kind for n = 1..nMax. */
  shown: number[];
  maxShown: number;
  probeXs: number[];
  /** f(x) * cos(probeN x) for kind 'a', f(x) * sin(probeN x) for kind 'b'. */
  probeYs: number[];
  /** Signed integral of the probe integrand: ~0 by Riemann-Lebesgue. */
  probeIntegral: number;
  /** Positive and negative lobe areas: large, and canceling. */
  positiveArea: number;
  negativeArea: number;
}

function clampN(n: number): number {
  if (!Number.isFinite(n)) return RL_N_INIT;
  return Math.max(RL_N_MIN, Math.min(RL_N_MAX, Math.round(n)));
}

export function riemannLebesgueData(mode: RlMode, nMax: number, kind: CoeffKind): RiemannLebesgueData {
  const nn = clampN(nMax);
  const f = rlFunction(mode);
  const h = RL_TWO_PI / RL_PANELS;
  const norm = h / (3 * Math.PI);

  const coeffs: RiemannLebesgueCoeff[] = [];
  for (let n = 1; n <= nn; n++) {
    // One Simpson pass accumulates both the cosine and sine moments.
    let sa = f(0) * 1 + f(RL_TWO_PI) * Math.cos(n * RL_TWO_PI);
    let sb = 0 + f(RL_TWO_PI) * Math.sin(n * RL_TWO_PI);
    for (let j = 1; j < RL_PANELS; j++) {
      const x = j * h;
      const fx = f(x);
      const w = j % 2 === 1 ? 4 : 2;
      sa += w * fx * Math.cos(n * x);
      sb += w * fx * Math.sin(n * x);
    }
    coeffs.push({ n, a: sa * norm, b: sb * norm });
  }

  const shown = coeffs.map((c) => Math.abs(kind === 'a' ? c.a : c.b));
  const maxShown = shown.reduce((m, v) => Math.max(m, v), 0);

  // Probe integrand on a dense grid (enough points per oscillation).
  const probeN = nn;
  const pts = Math.max(1501, 48 * probeN);
  const probeXs: number[] = new Array(pts);
  const probeYs: number[] = new Array(pts);
  for (let i = 0; i < pts; i++) {
    const x = (i * RL_TWO_PI) / (pts - 1);
    const trig = kind === 'a' ? Math.cos(probeN * x) : Math.sin(probeN * x);
    probeXs[i] = x;
    probeYs[i] = f(x) * trig;
  }
  // Trapezoid rule on the positive and negative parts separately.
  const dx = RL_TWO_PI / (pts - 1);
  let positiveArea = 0;
  let negativeArea = 0;
  for (let i = 0; i < pts - 1; i++) {
    const p0 = Math.max(probeYs[i]!, 0);
    const p1 = Math.max(probeYs[i + 1]!, 0);
    const q0 = Math.min(probeYs[i]!, 0);
    const q1 = Math.min(probeYs[i + 1]!, 0);
    positiveArea += ((p0 + p1) / 2) * dx;
    negativeArea += ((q0 + q1) / 2) * dx;
  }

  return {
    mode,
    kind,
    nMax: nn,
    probeN,
    coeffs,
    shown,
    maxShown,
    probeXs,
    probeYs,
    probeIntegral: positiveArea + negativeArea,
    positiveArea,
    negativeArea,
  };
}

export const riemannLebesgueModel: SceneModel<RiemannLebesgueData> = {
  compute(state) {
    const rawMode = String(state['mode'] ?? '');
    const mode: RlMode = (RL_MODES as readonly string[]).includes(rawMode)
      ? (rawMode as RlMode)
      : RL_MODE_INIT;
    const rawKind = String(state['kind'] ?? '');
    const kind: CoeffKind = (RL_KINDS as readonly string[]).includes(rawKind)
      ? (rawKind as CoeffKind)
      : RL_KIND_INIT;
    const rawN = Number(state['n']);
    return riemannLebesgueData(mode, rawN, kind);
  },
};
