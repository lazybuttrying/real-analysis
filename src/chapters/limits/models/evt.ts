import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The Extreme Value Theorem and its two sharpness witnesses.
 *  - closed:        f(x) = x^3 - 3x on [-2, 2]; max 2 at x = -1 and x = 2,
 *                   min -2 at x = -2 and x = 1 (both attained).
 *  - open-interval: f(x) = 1/x on (0, 1]; unbounded above, no maximum.
 *  - discontinuous: f(x) = x on [0, 1), f(1) = 0; sup 1 is never attained.
 * Pure computation: no DOM, d3, or three.
 */

export type EvtMode = 'closed' | 'open-interval' | 'discontinuous';

export function evtMode(raw: unknown): EvtMode {
  return raw === 'open-interval' || raw === 'discontinuous' ? raw : 'closed';
}

export function cubicEvt(x: number): number {
  return x ** 3 - 3 * x;
}

export function reciprocalEvt(x: number): number {
  return 1 / x;
}

/** For any M, x = 1/(M+1) lies in (0,1] and f(x) = M+1 > M: no maximum. */
export function unboundedWitness(m: number): number {
  return 1 / (m + 1);
}

export function discontinuousEvt(x: number): number {
  return x < 1 ? x : 0;
}

export interface EvtSample {
  x: number;
  y: number;
}

export interface EvtExtremum {
  value: number;
  /** Points where the extreme is attained (exact candidates); empty when not attained. */
  at: number[];
  attained: boolean;
}

export type EvtVerdict = 'attained' | 'unbounded' | 'not-attained';

export interface EvtData {
  mode: EvtMode;
  samples: EvtSample[];
  xLo: number;
  xHi: number;
  max: EvtExtremum;
  min: EvtExtremum;
  verdict: EvtVerdict;
}

/** Endpoints plus the critical points of x^3 - 3x (f' = 3x^2 - 3). */
const CLOSED_CANDIDATES = [-2, -1, 1, 2];

function closedExtrema(samples: EvtSample[]): { max: EvtExtremum; min: EvtExtremum } {
  let maxValue = -Infinity;
  let minValue = Infinity;
  for (const s of samples) {
    if (s.y > maxValue) maxValue = s.y;
    if (s.y < minValue) minValue = s.y;
  }
  for (const x of CLOSED_CANDIDATES) {
    const y = cubicEvt(x);
    if (y > maxValue) maxValue = y;
    if (y < minValue) minValue = y;
  }
  const tolerance = 1e-9;
  return {
    max: {
      value: maxValue,
      at: CLOSED_CANDIDATES.filter((x) => Math.abs(cubicEvt(x) - maxValue) < tolerance),
      attained: true,
    },
    min: {
      value: minValue,
      at: CLOSED_CANDIDATES.filter((x) => Math.abs(cubicEvt(x) - minValue) < tolerance),
      attained: true,
    },
  };
}

export function evtData(mode: EvtMode): EvtData {
  if (mode === 'open-interval') {
    const samples: EvtSample[] = [];
    const lo = 0.005;
    const hi = 1;
    const count = 200;
    for (let i = 0; i < count; i++) {
      const x = lo + (((hi - lo) * i) / (count - 1));
      samples.push({ x, y: reciprocalEvt(x) });
    }
    return {
      mode,
      samples,
      xLo: 0,
      xHi: 1,
      max: { value: reciprocalEvt(lo), at: [lo], attained: false },
      min: { value: 1, at: [1], attained: true },
      verdict: 'unbounded',
    };
  }
  if (mode === 'discontinuous') {
    const samples: EvtSample[] = [];
    const count = 401;
    for (let i = 0; i < count; i++) {
      const x = i / (count - 1);
      samples.push({ x, y: discontinuousEvt(x) });
    }
    return {
      mode,
      samples,
      xLo: 0,
      xHi: 1,
      max: { value: 1, at: [], attained: false },
      min: { value: 0, at: [0], attained: true },
      verdict: 'not-attained',
    };
  }
  const samples: EvtSample[] = [];
  const count = 401;
  for (let i = 0; i < count; i++) {
    const x = -2 + ((4 * i) / (count - 1));
    samples.push({ x, y: cubicEvt(x) });
  }
  const { max, min } = closedExtrema(samples);
  return { mode, samples, xLo: -2, xHi: 2, max, min, verdict: 'attained' };
}

export const evtModel: SceneModel<EvtData> = {
  compute(state: ControlState) {
    return evtData(evtMode(state['mode']));
  },
};
