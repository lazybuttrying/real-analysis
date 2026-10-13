import type { SceneModel } from '../../../contracts';

/**
 * The Fundamental Theorem of Calculus, part 1: for A(x) = integral_a^x f(t) dt
 * we have A'(x) = f(x). The area function is known in closed form here
 * (x^2 -> x^3/3, sin -> 1 - cos x on [0, pi]), and the model differentiates it
 * numerically so the page can watch the derivative land exactly on f(x).
 * Pure computation: no DOM, d3, or three.
 */

export type FTCFunctionKey = 'square' | 'sin';

export function ftcFunctionKey(option: unknown): FTCFunctionKey {
  return option === 'sin' ? 'sin' : 'square';
}

export interface FTCFunction {
  f: (x: number) => number;
  /** Closed-form area A(x) = integral_a^x f(t) dt. */
  area: (x: number) => number;
  a: number;
  b: number;
}

export function ftcFunction(key: FTCFunctionKey): FTCFunction {
  return key === 'sin'
    ? {
        f: (x) => Math.sin(x),
        area: (x) => 1 - Math.cos(x),
        a: 0,
        b: Math.PI,
      }
    : {
        f: (x) => x * x,
        area: (x) => (x * x * x) / 3,
        a: 0,
        b: 2,
      };
}

export interface FTCSample {
  x: number;
  y: number;
}

export interface FTCData {
  key: FTCFunctionKey;
  a: number;
  b: number;
  x: number;
  area: number;
  /** Central-difference derivative of the area function at x. */
  numericDerivative: number;
  fAtX: number;
  samples: FTCSample[];
}

export function ftcData(key: FTCFunctionKey, t: number): FTCData {
  const { f, area, a, b } = ftcFunction(key);
  const clamped = Math.min(1, Math.max(0, t));
  const x = a + (b - a) * clamped;
  const h = 1e-5;
  const samples: FTCSample[] = [];
  const m = 200;
  for (let i = 0; i <= m; i++) {
    const sx = a + ((b - a) * i) / m;
    samples.push({ x: sx, y: f(sx) });
  }
  return {
    key,
    a,
    b,
    x,
    area: area(x),
    numericDerivative: (area(x + h) - area(x - h)) / (2 * h),
    fAtX: f(x),
    samples,
  };
}

export const ftcModel: SceneModel<FTCData> = {
  compute(state) {
    const key = ftcFunctionKey(state['fn']);
    const raw = Number(state['x']);
    const t = Number.isFinite(raw) ? raw / 100 : 0.6;
    return ftcData(key, t);
  },
};
