import type { SceneModel } from '../../../contracts';

/**
 * Fourier epicycles: a curve drawn by a chain of rotating arms.
 * Each arm is one complex exponential term L * e^{i f t}: the arm has
 * length L, turns at integer frequency f, and the next arm rides on its
 * tip. The endpoint traces P(t) = sum_k L_k e^{i f_k t}. The ladder is
 * the lesson: one arm draws a circle, two arms already draw a flower,
 * three arms draw the star patterns from the reference photos, and more
 * arms approximate any closed curve (the Fourier series in disguise).
 * Presets mirror the photos: 'pair' is P(t) = 1.4 e^{-it} + 1.0 e^{7it}
 * (length ratio 7:5, frequency gap 8), 'trio' uses frequencies
 * -21, 35, 3 with lengths 1.38, 0.99, 0.63 summing to exactly 3.
 * Pure computation: no DOM, d3, or three.
 */

export interface EpicycleTerm {
  freq: number;
  amp: number;
}

/** Fixed color per arm index: the same color in the formula, the arm, and its circle. */
export const EPICYCLE_COLORS: readonly string[] = [
  '#4e79a7',
  '#e15759',
  '#f28e2b',
  '#76b7b2',
  '#59a14f',
  '#b07aa1',
];

export const EPICYCLE_PRESETS: Readonly<Record<string, readonly EpicycleTerm[]>> = {
  pair: [
    { freq: -1, amp: 1.4 },
    { freq: 7, amp: 1.0 },
  ],
  trio: [
    { freq: -21, amp: 1.38 },
    { freq: 35, amp: 0.99 },
    { freq: 3, amp: 0.63 },
  ],
  wave: [
    { freq: 1, amp: 1.0 },
    { freq: 2, amp: 0.5 },
    { freq: 3, amp: 1 / 3 },
    { freq: 4, amp: 0.25 },
    { freq: 5, amp: 0.2 },
  ],
};

export const EPICYCLE_PRESET_NAMES: readonly string[] = Object.keys(EPICYCLE_PRESETS);

export interface Point {
  x: number;
  y: number;
}

/** The endpoint of the chain with the given terms at parameter t. */
export function epicyclePoint(terms: readonly EpicycleTerm[], t: number): Point {
  let x = 0;
  let y = 0;
  for (const term of terms) {
    const a = term.freq * t;
    x += term.amp * Math.cos(a);
    y += term.amp * Math.sin(a);
  }
  return { x, y };
}

/** Joint positions at parameter t: joints[0] is the origin, joints[k] the tip of arm k. */
export function epicycleJoints(terms: readonly EpicycleTerm[], t: number): Point[] {
  const joints: Point[] = [{ x: 0, y: 0 }];
  let x = 0;
  let y = 0;
  for (const term of terms) {
    const a = term.freq * t;
    x += term.amp * Math.cos(a);
    y += term.amp * Math.sin(a);
    joints.push({ x, y });
  }
  return joints;
}

export interface FourierEpicyclesData {
  preset: string;
  terms: readonly EpicycleTerm[];
  /** Parameter value at which the chain is drawn. */
  phase: number;
  joints: Point[];
  endpoint: Point;
  /** Sum of arm lengths: the endpoint never leaves this disk (triangle inequality). */
  radiusSum: number;
  /** The full traced curve, sampled over t in [0, 2 pi]. */
  trace: Point[];
}

export function fourierEpicyclesData(presetRaw: string, armsRaw: number, phaseRaw: number): FourierEpicyclesData {
  const preset = EPICYCLE_PRESETS[presetRaw] ? presetRaw : 'pair';
  const all = EPICYCLE_PRESETS[preset] as readonly EpicycleTerm[];
  const arms = Math.max(1, Math.min(all.length, Math.round(Number.isFinite(armsRaw) ? armsRaw : 2)));
  const terms = all.slice(0, arms);
  const phase = Number.isFinite(phaseRaw) ? phaseRaw : 0.8;
  const joints = epicycleJoints(terms, phase);
  const endpoint = joints[joints.length - 1] as Point;
  const radiusSum = terms.reduce((s, term) => s + term.amp, 0);
  const trace: Point[] = [];
  const m = 900;
  for (let i = 0; i <= m; i++) {
    trace.push(epicyclePoint(terms, (2 * Math.PI * i) / m));
  }
  return { preset, terms, phase, joints, endpoint, radiusSum, trace };
}

export const fourierEpicyclesModel: SceneModel<FourierEpicyclesData> = {
  compute(state) {
    const preset = typeof state['preset'] === 'string' ? state['preset'] : 'pair';
    const arms = Number(state['arms']);
    const phase = Number(state['phase']);
    return fourierEpicyclesData(preset, arms, phase);
  },
};
