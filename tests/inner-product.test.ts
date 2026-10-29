import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  dotProduct,
  innerProductData,
  innerProductModel,
  type InnerProductData,
} from '../src/chapters/limits/models/innerProduct';
import { innerProductProblems } from '../src/chapters/limits/problems/inner-product';

const compute = (state: ControlState): InnerProductData => syncCompute(innerProductModel, state);

describe('inner-product: model', () => {
  it('<(1, 2), (3, -1)> = 1 with cos = 1/sqrt(50)', () => {
    expectCloseTo(dotProduct({ x: 1, y: 2 }, { x: 3, y: -1 }), 1, 1e-12);
    const d = compute({ x1: 1, x2: 2, y1: 3, y2: -1 });
    expectCloseTo(d.cosTheta, 1 / Math.sqrt(50), 1e-12);
    expect(d.orthogonal).toBe(false);
  });

  it('perpendicular vectors have dot 0', () => {
    const d = innerProductData(1, 0, 0, 1);
    expectCloseTo(d.dot, 0, 1e-12);
    expect(d.orthogonal).toBe(true);
    expectCloseTo(d.angleDeg, 90, 1e-9);
  });

  it('<x, x> = ||x||^2 and projection of x onto itself is x', () => {
    const d = innerProductData(1.5, -0.5, 1.5, -0.5);
    expectCloseTo(d.dot, d.normX * d.normX, 1e-12);
    expectCloseTo(d.proj.x, 1.5, 1e-12);
    expectCloseTo(d.proj.y, -0.5, 1e-12);
  });
});

describe('inner-product: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(innerProductProblems);
  });
});
