import type { SceneModel } from '../../../contracts';

/**
 * Change of variables (substitution rule), live: two different original
 * integrals both collapse to int_0^1 e^u du = e - 1.
 *
 * Substitutions:
 *   'u=x^2':   phi(x) = x^2 on [0, 1]:  int_0^1 2x e^{x^2} dx -> int_0^1 e^u du.
 *   'u=sin x': phi(x) = sin x on [0, pi/2]: int_0^{pi/2} cos x e^{sin x} dx -> int_0^1 e^u du.
 *
 * All integrals are composite Simpson with N panels (N from the slider,
 * forced even). The two forms target the same closed form e - 1: that is the
 * point of the scene.
 *
 * Verified numbers (tests/change-of-variables.test.ts):
 *   N = 50, 'u=x^2':  original = 1.7182820012734081,
 *     substituted = 1.7182818299863347, closed = e - 1 = 1.718281828459045,
 *     diff = |original - substituted| = 1.7128707341385052e-7 < 1e-6;
 *   N = 50, 'u=sin x': original = 1.7182819035868118,
 *     substituted = 1.7182818299863347,
 *     diff = 7.360047704629835e-8 < 1e-6;
 *   phiTick mapping: phi(x_i) with x_i = i/8 (resp. i*pi/16) gives
 *     u in [0, 1], monotone increasing, with density clustering toward 1
 *     for x^2 and toward the right end for sin x.
 */

export const COV_SUB_OPTIONS = ['u=x^2', 'u=sin x'] as const;
export const DEFAULT_SUB = 'u=x^2';
export const DEFAULT_N = 50;
export const N_MIN = 4;
export const N_MAX = 200;

/** Composite Simpson's rule; forces an even panel count. */
export function simpson(
  f: (x: number) => number,
  a: number,
  b: number,
  panels: number,
): number {
  const n = panels % 2 === 0 ? panels : panels + 1;
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (sum * h) / 3;
}

/** The substitution map phi: x |-> u. */
export function phi(sub: string, x: number): number {
  return sub === 'u=sin x' ? Math.sin(x) : x * x;
}

/** Left endpoint of the x-domain: 0 for both maps. */
export function xMin(): number {
  return 0;
}

/** Right endpoint of the x-domain: 1 for x^2, pi/2 for sin x. */
export function xMax(sub: string): number {
  return sub === 'u=sin x' ? Math.PI / 2 : 1;
}

/** The original integrand f(phi(x)) * phi'(x). */
export function originalIntegrand(sub: string, x: number): number {
  return sub === 'u=sin x'
    ? Math.cos(x) * Math.exp(Math.sin(x))
    : 2 * x * Math.exp(x * x);
}

/** Tick positions on the x-axis (8 ticks), mapped through phi to u-ticks. */
export function phiTicks(sub: string): { x: number; u: number }[] {
  const ticks: { x: number; u: number }[] = [];
  const upper = xMax(sub);
  for (let i = 0; i <= 8; i++) {
    const x = (upper * i) / 8;
    ticks.push({ x, u: phi(sub, x) });
  }
  return ticks;
}

export interface CovSample {
  x: number;
  y: number;
}

export interface ChangeOfVariablesData {
  sub: string;
  /** Simpson panel count (even). */
  N: number;
  /** int over x of f(phi(x)) phi'(x): the original form. */
  original: number;
  /** int_0^1 e^u du: the substituted form. */
  substituted: number;
  /** e - 1: the shared closed form. */
  closed: number;
  /** |original - substituted|. */
  diff: number;
  /** Samples of the original integrand. */
  origCurve: CovSample[];
  /** Samples of e^u on [0, 1]: the substituted integrand. */
  substCurve: CovSample[];
  /** The map phi sampled over the x-domain: the stretching curve. */
  phiCurve: CovSample[];
}

/** Pure: no DOM, no d3. */
export function changeOfVariablesData(sub: string, n: number): ChangeOfVariablesData {
  const N = n % 2 === 0 ? n : n + 1;
  const upper = xMax(sub);
  const original = simpson((x) => originalIntegrand(sub, x), 0, upper, N);
  const substituted = simpson((u) => Math.exp(u), 0, 1, N);
  const closed = Math.E - 1;

  const samples = 121;
  const origCurve: CovSample[] = [];
  const substCurve: CovSample[] = [];
  const phiCurve: CovSample[] = [];
  for (let i = 0; i < samples; i++) {
    const x = (upper * i) / (samples - 1);
    origCurve.push({ x, y: originalIntegrand(sub, x) });
    const u = i / (samples - 1);
    substCurve.push({ x: u, y: Math.exp(u) });
    phiCurve.push({ x, y: phi(sub, x) });
  }

  return {
    sub,
    N,
    original,
    substituted,
    closed,
    diff: Math.abs(original - substituted),
    origCurve,
    substCurve,
    phiCurve,
  };
}

function clampN(raw: number): number {
  if (!Number.isFinite(raw)) return DEFAULT_N;
  const r = Math.round(raw);
  return Math.min(N_MAX, Math.max(N_MIN, r));
}

export const changeOfVariablesModel: SceneModel<ChangeOfVariablesData> = {
  compute(state) {
    const rawSub = state['sub'];
    const sub = typeof rawSub === 'string' && (COV_SUB_OPTIONS as readonly string[]).includes(rawSub)
      ? rawSub
      : DEFAULT_SUB;
    return changeOfVariablesData(sub, clampN(Number(state['N'])));
  },
};
