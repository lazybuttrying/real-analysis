import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  vectorSpacesData,
  vectorSpacesModel,
  type VectorSpacesData,
} from '../src/chapters/limits/models/vector-spaces';
import { problems } from '../src/chapters/limits/problems/vector-spaces';

const compute = (state: ControlState): VectorSpacesData =>
  vectorSpacesModel.compute(state) as VectorSpacesData;

describe('vector-spaces: compute clamps and defaults', () => {
  it('defaults to a = 1, b = 0.5 on empty state', () => {
    const d = compute({});
    expect(d.a).toBe(1);
    expect(d.b).toBe(0.5);
  });

  it('clamps coefficients into [-2, 2]', () => {
    expect(compute({ a: 5, b: -9 }).a).toBe(2);
    expect(compute({ a: 5, b: -9 }).b).toBe(-2);
    expect(compute({ a: -2, b: 2 }).a).toBe(-2);
    expect(compute({ a: -2, b: 2 }).b).toBe(2);
  });

  it('falls back to defaults on non-numeric input', () => {
    expect(compute({ a: 'x', b: true }).a).toBe(1);
    expect(compute({ a: 'x', b: true }).b).toBe(0.5);
    expect(compute({ a: NaN, b: Infinity }).a).toBe(1);
    expect(compute({ a: NaN, b: Infinity }).b).toBe(0.5);
  });
});

describe('vector-spaces: line samples', () => {
  it('produces exactly 41 samples on [-1, 1]', () => {
    const d = vectorSpacesData(1, 0.5);
    expect(d.line).toHaveLength(41);
    expect(d.line[0]?.[0]).toBe(-1);
    expect(d.line[20]?.[0]).toBe(0);
    expect(d.line[40]?.[0]).toBe(1);
  });

  it('satisfies y = a + bx at the first, middle, and last samples', () => {
    const d = vectorSpacesData(1, 0.5);
    expect(d.line[0]).toEqual([-1, 0.5]);
    expect(d.line[20]).toEqual([0, 1]);
    expect(d.line[40]).toEqual([1, 1.5]);
  });

  it('satisfies y = a + bx at every sample', () => {
    const d = vectorSpacesData(1.3, -0.7);
    for (const [x, y] of d.line) {
      expect(y).toBeCloseTo(1.3 + -0.7 * x, 12);
    }
  });
});

describe('vector-spaces: the coefficient point', () => {
  it('exposes point [a, b]', () => {
    expect(vectorSpacesData(1, -1).point).toEqual([1, -1]);
    expect(vectorSpacesData(0, 1).point).toEqual([0, 1]);
    expect(compute({ a: 0, b: 1 }).point).toEqual([0, 1]);
  });

  it('clamps the point together with the coefficients', () => {
    expect(compute({ a: 7, b: 7 }).point).toEqual([2, 2]);
  });
});

describe('vector-spaces: presets from the problems file', () => {
  it('has exactly 3 problems', () => {
    expect(problems).toHaveLength(3);
    expect(problems.map((p) => p.id)).toEqual([
      'sequence-space-axioms',
      'r2-c-iso',
      'iso-preserves-independence',
    ]);
  });

  it('accepts every preset via the model', () => {
    for (const p of problems) {
      const d = compute(p.preset);
      expect(d.a).toBe(p.preset['a']);
      expect(d.b).toBe(p.preset['b']);
    }
  });
});

describe('vector-spaces: numbers used in the problem captions', () => {
  it('preset {a:1, b:0.5}: the line y = 1 + 0.5x passes through (-1, 0.5), (0, 1), (1, 1.5)', () => {
    const d = compute({ a: 1, b: 0.5 });
    expect(d.line[0]).toEqual([-1, 0.5]);
    expect(d.line[20]).toEqual([0, 1]);
    expect(d.line[40]).toEqual([1, 1.5]);
  });

  it('preset {a:0, b:1}: Phi(0, 1) = i, and the line y = x passes through (-1, -1), (0, 0), (1, 1)', () => {
    const d = compute({ a: 0, b: 1 });
    expect(d.point).toEqual([0, 1]);
    expect(d.line[0]).toEqual([-1, -1]);
    expect(d.line[20]).toEqual([0, 0]);
    expect(d.line[40]).toEqual([1, 1]);
  });

  it('preset {a:1, b:-1}: the line y = 1 - x passes through (-1, 2), (0, 1), (1, 0)', () => {
    const d = compute({ a: 1, b: -1 });
    expect(d.point).toEqual([1, -1]);
    expect(d.line[0]).toEqual([-1, 2]);
    expect(d.line[20]).toEqual([0, 1]);
    expect(d.line[40]).toEqual([1, 0]);
  });
});
