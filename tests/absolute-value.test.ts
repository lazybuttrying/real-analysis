import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  absoluteValueData,
  absoluteValueModel,
  type AbsoluteValueData,
} from '../src/chapters/limits/models/absoluteValue';
import { absoluteValueProblems } from '../src/chapters/limits/problems/absolute-value';

const compute = (state: ControlState): AbsoluteValueData => syncCompute(absoluteValueModel, state);

describe('absolute-value: model', () => {
  it('triangle inequality holds with slack for opposite signs', () => {
    const d = compute({ x: 1.5, y: -0.5 });
    expectCloseTo(d.absX, 1.5, 1e-12);
    expectCloseTo(d.absY, 0.5, 1e-12);
    expectCloseTo(d.absSum, 1, 1e-12);
    expectCloseTo(d.gap, 1, 1e-12);
  });

  it('product rule |xy| = |x| |y|', () => {
    const d = absoluteValueData(-2, 3);
    expectCloseTo(d.absProduct, 6, 1e-12);
    expectCloseTo(d.productOfAbs, 6, 1e-12);
  });

  it('gap is never negative over a grid', () => {
    for (const x of [-3, -1.2, 0, 0.7, 3]) {
      for (const y of [-3, -0.4, 0, 1.1, 3]) {
        expect(absoluteValueData(x, y).gap).toBeGreaterThanOrEqual(-1e-12);
      }
    }
  });
});

describe('absolute-value: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(absoluteValueProblems);
  });
});
