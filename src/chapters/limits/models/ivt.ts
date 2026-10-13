import type { SceneModel } from '../../../contracts';

/**
 * The Intermediate Value Theorem: a continuous f on [a,b] must take every
 * value between f(a) and f(b). The target level c is driven by a 0–100%
 * slider; the crossing ξ is located by bisection. Both demo functions are
 * strictly increasing, so the crossing is unique.
 * Pure computation: no DOM, d3, or three.
 */

export type IVTFunctionKey = 'cubic' | 'sine';

export function ivtFunctionKey(option: unknown): IVTFunctionKey {
  return option === 'sine' ? 'sine' : 'cubic';
}

export interface IVTFunction {
  f: (x: number) => number;
  a: number;
  b: number;
}

export function ivtFunction(key: IVTFunctionKey): IVTFunction {
  return key === 'sine'
    ? { f: (x) => Math.sin(x), a: 0, b: Math.PI / 2 }
    : { f: (x) => x * x * x + x - 1, a: 0, b: 1 };
}

/** Bisection for the crossing of f(x) = c. */
export function findCrossing(key: IVTFunctionKey, c: number): number {
  const { f, a, b } = ivtFunction(key);
  let lo = a;
  let hi = b;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < c) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface IVTSample {
  x: number;
  y: number;
}

export interface IVTData {
  key: IVTFunctionKey;
  a: number;
  b: number;
  fa: number;
  fb: number;
  c: number;
  xi: number;
  samples: IVTSample[];
}

export function ivtData(key: IVTFunctionKey, t: number): IVTData {
  const { f, a, b } = ivtFunction(key);
  const fa = f(a);
  const fb = f(b);
  const clamped = Math.min(1, Math.max(0, t));
  const c = fa + (fb - fa) * clamped;
  const samples: IVTSample[] = [];
  const m = 200;
  for (let i = 0; i <= m; i++) {
    const x = a + ((b - a) * i) / m;
    samples.push({ x, y: f(x) });
  }
  return { key, a, b, fa, fb, c, xi: findCrossing(key, c), samples };
}

export const ivtModel: SceneModel<IVTData> = {
  compute(state) {
    const key = ivtFunctionKey(state['fn']);
    const raw = Number(state['t']);
    const t = Number.isFinite(raw) ? raw / 100 : 0.5;
    return ivtData(key, t);
  },
};
