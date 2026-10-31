import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  orderedFieldData,
  orderedFieldModel,
  type OrderedFieldData,
} from '../src/chapters/limits/models/ordered-fields';
import { orderedFieldsProblems } from '../src/chapters/limits/problems/ordered-fields';

const compute = (state: ControlState): OrderedFieldData => syncCompute(orderedFieldModel, state);

describe('ordered-fields: model', () => {
  it('cone arithmetic on the rationals', () => {
    const d = compute({ mode: 'q', p: 1.25, q: 0.75 });
    expectCloseTo(d.sum, 2, 1e-12);
    expectCloseTo(d.product, 0.9375, 1e-12);
    expectCloseTo(d.pSquare, 1.5625, 1e-12);
    expect(d.sum).toBeGreaterThan(0);
    expect(d.product).toBeGreaterThan(0);
  });

  it('the Z_7 walk returns to 0 after 7 steps', () => {
    const d = orderedFieldData('z7', 1, 1);
    expect(d.walk.length).toBe(8);
    expect(d.walk[0]).toBe(0);
    expect(d.walk[7]).toBe(0);
    expect(d.walk.slice(1, 7)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('ordered-fields: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(orderedFieldsProblems);
  });
});
