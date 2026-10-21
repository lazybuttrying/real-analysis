import type { SceneModel } from '../../../contracts';
import { simpson } from './simpson';

export { simpson };

/**
 * Integration by parts, live: LHS = int_0^b u v' dx against
 * RHS = [u v]_0^b - int_0^b v u' dx, plus the closed form.
 *
 * Pairs:
 *   'x·e^x':  u = x, dv = e^x dx, v = e^x.
 *             boundary = b e^b - 0, sub = int_0^b e^x dx,
 *             closed form: (b - 1) e^b + 1.
 *   'x·sin x': u = x, dv = sin x dx, v = -cos x.
 *             boundary = -b cos b, sub = int_0^b (-cos x) dx,
 *             closed form: sin b - b cos b.
 *
 * All integrals are composite Simpson with 2000 panels.
 *
 * Verified numbers (tests/integration-by-parts.test.ts):
 *   'x·e^x', b = 2: lhs = 8.389056098930839, rhs = 8.389056098930617,
 *     closed = (b-1)e^b + 1 = 8.38905609893065, maxErr < 1e-12;
 *   'x·sin x', b = 2: lhs = 1.7415910999199549, rhs = 1.7415910999199686,
 *     closed = sin b - b cos b = 1.7415910999199666, maxErr < 1e-12;
 *   Simpson(f, 0, b, n) is symmetric in (a, b) up to sign, and exact for
 *   polynomials of degree <= 3.
 */

const IBP_PAIR_OPTIONS = ['x·e^x', 'x·sin x'] as const;
export const DEFAULT_PAIR = 'x·e^x';
export const DEFAULT_B = 2;
export const B_MIN = 0.5;
export const B_MAX = 3;
const SIMPSON_PANELS = 2000;

/** The integrand u * v'. */
export function integrand(pair: string, x: number): number {
  return pair === 'x·sin x' ? x * Math.sin(x) : x * Math.exp(x);
}

/** v * u' (the integrand subtracted in the decomposition). */
export function subIntegrand(pair: string, x: number): number {
  return pair === 'x·sin x' ? -Math.cos(x) : Math.exp(x);
}

/** [u v]_0^b, the boundary term. */
export function boundaryTerm(pair: string, b: number): number {
  return pair === 'x·sin x' ? -b * Math.cos(b) : b * Math.exp(b);
}

/** Closed form of int_0^b u v' dx. */
export function closedForm(pair: string, b: number): number {
  return pair === 'x·sin x' ? Math.sin(b) - b * Math.cos(b) : (b - 1) * Math.exp(b) + 1;
}

export interface IbpSample {
  x: number;
  y: number;
}

export interface IntegrationByPartsData {
  pair: string;
  b: number;
  /** int_0^b u v' dx (Simpson). */
  lhs: number;
  /** [u v]_0^b - int_0^b v u' dx (Simpson). */
  rhs: number;
  /** [u v]_0^b. */
  boundary: number;
  /** int_0^b v u' dx (Simpson). */
  sub: number;
  /** Closed form of the LHS. */
  closedForm: number;
  /** max(|lhs - rhs|, |lhs - closedForm|): the theorem's numerical shadow. */
  maxErr: number;
  /** Samples of u v' on [0, b]: the shaded area. */
  curve: IbpSample[];
  /** Samples of v u' on [0, b]: the subtracted piece. */
  subCurve: IbpSample[];
}

/** Pure: no DOM, no d3. */
export function integrationByPartsData(pair: string, b: number): IntegrationByPartsData {
  const lhs = simpson((x) => integrand(pair, x), 0, b, SIMPSON_PANELS);
  const sub = simpson((x) => subIntegrand(pair, x), 0, b, SIMPSON_PANELS);
  const boundary = boundaryTerm(pair, b);
  const rhs = boundary - sub;
  const closed = closedForm(pair, b);

  const samples = 121;
  const curve: IbpSample[] = [];
  const subCurve: IbpSample[] = [];
  for (let i = 0; i < samples; i++) {
    const x = (b * i) / (samples - 1);
    curve.push({ x, y: integrand(pair, x) });
    subCurve.push({ x, y: subIntegrand(pair, x) });
  }

  return {
    pair,
    b,
    lhs,
    rhs,
    boundary,
    sub,
    closedForm: closed,
    maxErr: Math.max(Math.abs(lhs - rhs), Math.abs(lhs - closed)),
    curve,
    subCurve,
  };
}

function clampB(raw: number): number {
  if (!Number.isFinite(raw)) return DEFAULT_B;
  return Math.min(B_MAX, Math.max(B_MIN, raw));
}

export const integrationByPartsModel: SceneModel<IntegrationByPartsData> = {
  compute(state) {
    const rawPair = state['pair'];
    const pair = typeof rawPair === 'string' && (IBP_PAIR_OPTIONS as readonly string[]).includes(rawPair)
      ? rawPair
      : DEFAULT_PAIR;
    return integrationByPartsData(pair, clampB(Number(state['b'])));
  },
};
