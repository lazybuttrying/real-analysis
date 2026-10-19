import type { SceneModel } from '../../../contracts';

/**
 * Parseval's identity, live: the partial Fourier energy
 *   S_N = a_0^2 / 2 + sum_{n <= N} (a_n^2 + b_n^2)
 * rises to the L^2 norm (1/pi) int_{-pi}^{pi} f^2. Three modes on [-pi, pi]:
 *   square   odd square wave, b_n = 4/(pi n) for odd n, 0 for even n
 *   sawtooth f(x) = x,        b_n = 2 (-1)^{n+1} / n
 *   parabola f(x) = x^2,      a_0 = 2 pi^2 / 3, a_n = 4 (-1)^n / n^2
 * Coefficients use the exact closed forms; the L^2 norm is computed by
 * fine-grid Simpson quadrature as an independent check.
 * Pure computation: no DOM, d3, or three.
 */

export const PARSEVAL_N_MIN = 1;
export const PARSEVAL_N_MAX = 40;
export const PARSEVAL_N_INIT = 12;

export const PARSEVAL_MODES = ['square', 'sawtooth', 'parabola'] as const;
export type ParsevalMode = (typeof PARSEVAL_MODES)[number];
export const PARSEVAL_MODE_INIT: ParsevalMode = 'square';

export function parsevalFunction(mode: ParsevalMode): (x: number) => number {
  switch (mode) {
    case 'sawtooth':
      return (x) => x;
    case 'parabola':
      return (x) => x * x;
    default:
      return (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
  }
}

/** Exact a_0 for the mode (0 except the parabola). */
export function parsevalA0(mode: ParsevalMode): number {
  return mode === 'parabola' ? (2 * Math.PI * Math.PI) / 3 : 0;
}

/** Exact closed-form coefficients, n >= 1. */
export function parsevalCoeff(mode: ParsevalMode, n: number): { a: number; b: number } {
  if (n < 1) return { a: 0, b: 0 };
  switch (mode) {
    case 'square':
      return { a: 0, b: n % 2 === 1 ? 4 / (Math.PI * n) : 0 };
    case 'sawtooth': {
      const negOnePowNp1 = n % 2 === 1 ? 1 : -1;
      return { a: 0, b: (2 * negOnePowNp1) / n };
    }
    default: {
      const negOnePowN = n % 2 === 0 ? 1 : -1;
      return { a: (4 * negOnePowN) / (n * n), b: 0 };
    }
  }
}

/** Exact (1/pi) int_{-pi}^{pi} f^2. */
export function parsevalExactNorm2(mode: ParsevalMode): number {
  switch (mode) {
    case 'sawtooth':
      return (2 * Math.PI * Math.PI) / 3;
    case 'parabola':
      return (2 * Math.pow(Math.PI, 4)) / 5;
    default:
      return 2;
  }
}

/** Independent check of the L^2 norm by Simpson quadrature. */
export function parsevalNumericNorm2(mode: ParsevalMode): number {
  const f = parsevalFunction(mode);
  const panels = 4096;
  const h = (2 * Math.PI) / panels;
  let sum = f(-Math.PI) * f(-Math.PI) + f(Math.PI) * f(Math.PI);
  for (let j = 1; j < panels; j++) {
    const v = f(-Math.PI + j * h);
    sum += (j % 2 === 1 ? 4 : 2) * v * v;
  }
  return (sum * h) / (3 * Math.PI);
}

export interface ParsevalTerm {
  n: number;
  a: number;
  b: number;
  /** a_n^2 + b_n^2: the marginal energy of this harmonic. */
  energy: number;
  /** S_n: cumulative captured energy. */
  partial: number;
}

export interface ParsevalData {
  mode: ParsevalMode;
  nMax: number;
  a0: number;
  terms: ParsevalTerm[];
  /** S_N at the current N. */
  captured: number;
  /** L^2 norm (1/pi) int f^2 from quadrature. */
  norm2: number;
  /** S_N / norm2: the captured-energy fraction. */
  fraction: number;
}

function clampN(n: number): number {
  if (!Number.isFinite(n)) return PARSEVAL_N_INIT;
  return Math.max(PARSEVAL_N_MIN, Math.min(PARSEVAL_N_MAX, Math.round(n)));
}

export function parsevalData(mode: ParsevalMode, nMax: number): ParsevalData {
  const nn = clampN(nMax);
  const a0 = parsevalA0(mode);
  const terms: ParsevalTerm[] = [];
  let partial = (a0 * a0) / 2;
  for (let n = 1; n <= nn; n++) {
    const { a, b } = parsevalCoeff(mode, n);
    const energy = a * a + b * b;
    partial += energy;
    terms.push({ n, a, b, energy, partial });
  }
  const norm2 = parsevalNumericNorm2(mode);
  return {
    mode,
    nMax: nn,
    a0,
    terms,
    captured: partial,
    norm2,
    fraction: norm2 > 0 ? partial / norm2 : 0,
  };
}

export const parsevalModel: SceneModel<ParsevalData> = {
  compute(state) {
    const rawMode = String(state['mode'] ?? '');
    const mode: ParsevalMode = (PARSEVAL_MODES as readonly string[]).includes(rawMode)
      ? (rawMode as ParsevalMode)
      : PARSEVAL_MODE_INIT;
    const rawN = Number(state['n']);
    return parsevalData(mode, rawN);
  },
};
