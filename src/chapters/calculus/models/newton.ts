import type { SceneModel } from '../../../contracts';

/**
 * Newton's method: x_{n+1} = x_n - f(x_n)/f'(x_n). For f(x) = x^2 - 2 the
 * iteration is exactly the Babylonian method, converging quadratically to
 * sqrt(2) with asymptotic error ratio f''(x*)/(2 f'(x*)) = 1/(2 sqrt(2)).
 * The second demo function f(x) = x^3 - 2x + 2 cycles 0 -> 1 -> 0 forever
 * from x_0 = 0, showing the method can fail.
 * Pure computation: no DOM, d3, or three.
 */

type NewtonFunctionKey = 'sqrt2' | 'bad';

/** Map the meta.ts select option value to the function key. */
export function newtonFunctionKey(option: unknown): NewtonFunctionKey {
  return option === 'x^3-2x+2' ? 'bad' : 'sqrt2';
}

interface NewtonFunction {
  f: (x: number) => number;
  fp: (x: number) => number;
  /** Known root, when the iteration targets one (null for the cycling demo). */
  root: number | null;
  xMin: number;
  xMax: number;
}

export function newtonFunction(key: NewtonFunctionKey): NewtonFunction {
  return key === 'bad'
    ? {
        f: (x) => x * x * x - 2 * x + 2,
        fp: (x) => 3 * x * x - 2,
        root: null,
        xMin: -1,
        xMax: 2,
      }
    : {
        f: (x) => x * x - 2,
        fp: (x) => 2 * x,
        root: Math.SQRT2,
        xMin: 0,
        xMax: 3,
      };
}

interface NewtonStep {
  x: number;
  fx: number;
  fpx: number;
  /** The x-intercept of the tangent at this step (the next iterate). */
  next: number;
}

export interface NewtonData {
  key: NewtonFunctionKey;
  steps: NewtonStep[];
  /** |x_n - root| for each iterate (empty when the root is unknown). */
  errors: number[];
  samples: Array<{ x: number; y: number }>;
}

export function newtonIterate(key: NewtonFunctionKey, x0: number, n: number): NewtonData {
  const { f, fp, root, xMin, xMax } = newtonFunction(key);
  const steps: NewtonStep[] = [];
  const errors: number[] = [];
  let x = x0;
  const count = Math.max(1, Math.min(10, Math.round(n)));
  for (let k = 0; k < count; k++) {
    const fx = f(x);
    const fpx = fp(x);
    const next = fpx === 0 ? x : x - fx / fpx;
    steps.push({ x, fx, fpx, next });
    if (root !== null) errors.push(Math.abs(x - root));
    x = next;
  }
  if (root !== null) errors.push(Math.abs(x - root));
  const samples: Array<{ x: number; y: number }> = [];
  const m = 200;
  for (let i = 0; i <= m; i++) {
    const sx = xMin + ((xMax - xMin) * i) / m;
    samples.push({ x: sx, y: f(sx) });
  }
  return { key, steps, errors, samples };
}

export const newtonModel: SceneModel<NewtonData> = {
  compute(state) {
    const key = newtonFunctionKey(state['fn']);
    const rawX0 = Number(state['x0']);
    const x0 = Number.isFinite(rawX0) ? Math.min(3, Math.max(0, rawX0)) : 1.5;
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN) ? rawN : 4;
    return newtonIterate(key, x0, n);
  },
};
