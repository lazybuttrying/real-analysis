import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  EPICYCLE_PRESETS,
  epicyclePoint,
  fourierEpicyclesData,
  fourierEpicyclesModel,
  type FourierEpicyclesData,
} from '../src/chapters/calculus/models/fourierEpicycles';
import { fourierEpicyclesProblems } from '../src/chapters/calculus/problems/fourier-epicycles';

const compute = (state: ControlState): FourierEpicyclesData => syncCompute(fourierEpicyclesModel, state);

describe('fourier epicycles: presets mirror the reference photos', () => {
  it('pair is L ratio 7:5 with frequency gap 8', () => {
    const pair = EPICYCLE_PRESETS['pair'] ?? [];
    expect(pair).toHaveLength(2);
    expectCloseTo((pair[0]?.amp ?? 0) / (pair[1]?.amp ?? 1), 7 / 5, 1e-12);
    expect((pair[1]?.freq ?? 0) - (pair[0]?.freq ?? 0)).toBe(8);
  });

  it('trio lengths sum to exactly 3.00', () => {
    const trio = EPICYCLE_PRESETS['trio'] ?? [];
    expect(trio.map((t) => t.freq)).toEqual([-21, 35, 3]);
    expectCloseTo(trio.reduce((s, t) => s + t.amp, 0), 3, 1e-12);
  });
});

describe('fourier epicycles: the chain math', () => {
  it('at t = 0 every arm aligns and the endpoint is the length sum', () => {
    const data = fourierEpicyclesData('pair', 2, 0);
    expectCloseTo(data.endpoint.x, 2.4, 1e-12);
    expectCloseTo(data.endpoint.y, 0, 1e-12);
    expectCloseTo(data.radiusSum, 2.4, 1e-12);
  });

  it('integer frequencies make the curve close with period 2 pi', () => {
    for (const preset of ['pair', 'trio', 'wave']) {
      const terms = EPICYCLE_PRESETS[preset] ?? [];
      for (const t of [0, 0.3, 1.7, 4.2]) {
        const a = epicyclePoint(terms, t);
        const b = epicyclePoint(terms, t + 2 * Math.PI);
        expectCloseTo(a.x, b.x, 1e-9);
        expectCloseTo(a.y, b.y, 1e-9);
      }
    }
  });

  it('the endpoint never leaves the length-sum disk', () => {
    const data = compute({ preset: 'trio', arms: 3, phase: 1.1 });
    for (const p of data.trace) {
      expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(data.radiusSum + 1e-9);
    }
  });

  it('one arm draws a circle of its length', () => {
    const data = fourierEpicyclesData('wave', 1, 0);
    for (const p of data.trace) expectCloseTo(Math.hypot(p.x, p.y), 1, 1e-9);
  });

  it('arms clamps to the preset length and joints match the endpoint', () => {
    const data = compute({ preset: 'pair', arms: 5, phase: 0.8 });
    expect(data.terms).toHaveLength(2);
    expect(data.joints).toHaveLength(3);
    const last = data.joints[data.joints.length - 1];
    expectCloseTo(last?.x ?? 0, data.endpoint.x, 1e-15);
    expectCloseTo(last?.y ?? 0, data.endpoint.y, 1e-15);
  });

  it('unknown preset falls back to pair', () => {
    expect(compute({ preset: 'nope', arms: 2, phase: 0 }).preset).toBe('pair');
  });
});

describe('fourier epicycles: problems', () => {
  it('has exactly 3 well-formed problems', () => {
    checkProblemsShape(fourierEpicyclesProblems);
  });
});
