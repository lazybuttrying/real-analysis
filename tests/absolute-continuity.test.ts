import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  absoluteContinuityModel,
  DEFAULT_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  type AbsoluteContinuityData,
} from '../src/chapters/calculus/models/absoluteContinuity';
import { absoluteContinuityProblems } from '../src/chapters/calculus/problems/absolute-continuity';

const compute = (state: ControlState): AbsoluteContinuityData => syncCompute(absoluteContinuityModel, state);

describe('absolute-continuity: x^2 satisfies the exact AC identity', () => {
  it('totalLen = delta = scale/20 and varSum = 2*delta - delta^2 for every scale 1..10', () => {
    for (let scale = 1; scale <= 10; scale++) {
      const data = compute({ func: 'square', scale });
      const delta = scale / 20;
      expect(data.detail).toBeCloseTo(delta, 15);
      expect(data.totalLen).toBeCloseTo(delta, 15);
      // Exact closed form: 1 - (1 - delta)^2 = 2 delta - delta^2.
      expect(data.varSum).toBeCloseTo(2 * delta - delta * delta, 15);
      expect(data.varSum).toBeCloseTo(1 - (1 - delta) * (1 - delta), 15);
    }
  });

  it('scale = 4 gives the documented numbers delta = 0.2, varSum = 0.36', () => {
    const data = compute({ func: 'square', scale: 4 });
    expect(data.totalLen).toBeCloseTo(0.2, 15);
    expect(data.varSum).toBeCloseTo(0.36, 15);
  });

  it('both bars go to 0 as delta -> 0', () => {
    const vars = [10, 5, 2, 1].map((scale) => compute({ func: 'square', scale }));
    for (let i = 1; i < vars.length; i++) {
      expect(vars[i]?.totalLen).toBeLessThan(vars[i - 1]?.totalLen ?? Infinity);
      expect(vars[i]?.varSum).toBeLessThan(vars[i - 1]?.varSum ?? Infinity);
    }
    const last = vars[vars.length - 1];
    expect(last?.totalLen).toBeCloseTo(0.05, 15);
    expect(last?.varSum).toBeCloseTo(2 * 0.05 - 0.0025, 15);
  });
});

describe('absolute-continuity: the Cantor function fails the "absolute" condition', () => {
  it('totalLen = (2/3)^stage and varSum = 1 for every stage 1..10', () => {
    for (let stage = 1; stage <= 10; stage++) {
      const data = compute({ func: 'cantor', scale: stage });
      expect(data.totalLen).toBeCloseTo(Math.pow(2 / 3, stage), 15);
      expect(data.varSum).toBe(1);
    }
  });

  it('stage = 4 gives the documented numbers (2/3)^4 = 16/81 ~= 0.1975, varSum = 1', () => {
    const data = compute({ func: 'cantor', scale: 4 });
    expect(data.totalLen).toBeCloseTo(16 / 81, 15);
    expect(data.totalLen).toBeCloseTo(0.1975, 4);
    expect(data.varSum).toBe(1);
  });

  it('total length vanishes while the variation stays frozen at 1', () => {
    const lens = [1, 4, 7, 10].map((stage) => compute({ func: 'cantor', scale: stage }));
    for (let i = 1; i < lens.length; i++) {
      expect(lens[i]?.totalLen).toBeLessThan(lens[i - 1]?.totalLen ?? Infinity);
      expect(lens[i]?.varSum).toBe(1);
    }
    expect(lens[lens.length - 1]?.totalLen).toBeLessThan(0.02);
  });
});

describe('absolute-continuity: model defaults and clamping', () => {
  it('empty state falls back to the square defaults', () => {
    const data = compute({});
    expect(data.func).toBe('square');
    expect(data.scale).toBe(DEFAULT_SCALE);
  });

  it('scale is clamped to [MIN_SCALE, MAX_SCALE]', () => {
    expect(compute({ func: 'square', scale: 0 }).scale).toBe(MIN_SCALE);
    expect(compute({ func: 'square', scale: 99 }).scale).toBe(MAX_SCALE);
    expect(compute({ func: 'cantor', scale: 0 }).detail).toBe(MIN_SCALE);
  });

  it('unknown func falls back to square', () => {
    expect(compute({ func: 'bogus', scale: 4 }).func).toBe('square');
  });
});

describe('absolute-continuity: problems metadata', () => {
  it('has exactly the three required problems with valid presets', () => {
    expect(absoluteContinuityProblems).toHaveLength(3);
    expect(absoluteContinuityProblems.map((p) => p.id)).toEqual(['integral-ac', 'cantor-not-ac', 'lipschitz-ac']);
    for (const problem of absoluteContinuityProblems) {
      const func = String(problem.preset['func']);
      expect(['square', 'cantor']).toContain(func);
      const scale = Number(problem.preset['scale']);
      expect(Number.isInteger(scale)).toBe(true);
      expect(scale).toBeGreaterThanOrEqual(MIN_SCALE);
      expect(scale).toBeLessThanOrEqual(MAX_SCALE);
      expect(problem.presetCaption.ko.length).toBeGreaterThan(0);
      expect(problem.presetCaption.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThan(0);
    }
  });

  it('preset captions match the model values', () => {
    const square = compute({ func: 'square', scale: 4 });
    expect(square.varSum).toBeCloseTo(0.36, 15);
    const cantor = compute({ func: 'cantor', scale: 4 });
    expect(cantor.totalLen).toBeCloseTo(16 / 81, 15);
    expect(cantor.varSum).toBe(1);
  });
});
