import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import { squeezeData, squeezeModel, type SqueezeData } from '../src/chapters/limits/models/squeeze';
import { squeezeProblems } from '../src/chapters/limits/problems/squeeze';

const compute = (state: ControlState): SqueezeData => syncCompute(squeezeModel, state);

describe('squeeze: model', () => {
  it('middle is always trapped between the guards', () => {
    const d = compute({ n: 40 });
    for (const p of d.points) {
      expect(p.mid).toBeGreaterThanOrEqual(p.lower - 1e-12);
      expect(p.mid).toBeLessThanOrEqual(p.upper + 1e-12);
    }
  });

  it('guards close in: |lastMid| <= 1/terms', () => {
    const d = squeezeData(50);
    expect(Math.abs(d.lastMid)).toBeLessThanOrEqual(1 / 50 + 1e-12);
    expectCloseTo(d.lastUpper, 0.02, 1e-12);
  });
});

describe('squeeze: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(squeezeProblems);
  });
});
