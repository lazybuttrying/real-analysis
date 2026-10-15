import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  DISCRETE_POINTS,
  discreteBall,
  discreteDist,
  metricKindOf,
  metricSpacesData,
  metricSpacesModel,
  METRIC_KINDS,
  type MetricSpacesData,
} from '../src/chapters/limits/models/metric-spaces';

const compute = (state: ControlState): MetricSpacesData => metricSpacesModel.compute(state) as MetricSpacesData;

describe('metric-spaces: the fixed point set', () => {
  it('has exactly 6 points at the specified coordinates', () => {
    expect(DISCRETE_POINTS).toHaveLength(6);
    const coords = DISCRETE_POINTS.map((p) => [p.x, p.y]);
    expect(coords).toEqual([
      [0, 0],
      [1, 0],
      [0.3, 0.8],
      [1.2, 0.9],
      [-0.5, 0.4],
      [0.6, -0.6],
    ]);
  });
});

describe('metric-spaces: discreteDist', () => {
  it('is 0 on equal indices and 1 otherwise', () => {
    for (let i = 0; i < 6; i++) {
      expect(discreteDist(i, i)).toBe(0);
    }
    expect(discreteDist(0, 1)).toBe(1);
    expect(discreteDist(1, 0)).toBe(1);
    expect(discreteDist(2, 5)).toBe(1);
    expect(discreteDist(4, 3)).toBe(1);
  });

  it('satisfies the triangle inequality over all sample triples', () => {
    for (let a = 0; a < 6; a++) {
      for (let b = 0; b < 6; b++) {
        for (let c = 0; c < 6; c++) {
          expect(discreteDist(a, c)).toBeLessThanOrEqual(discreteDist(a, b) + discreteDist(b, c));
        }
      }
    }
  });

  it('matches the case analysis used in the axioms proof', () => {
    // x != z: LHS = 1; the RHS cases are 0+1 = 1, 1+0 = 1, 1+1 = 2.
    const x = 0;
    const z = 1;
    expect(discreteDist(x, z)).toBe(1);
    expect(discreteDist(x, x) + discreteDist(x, z)).toBe(1); // y equals x
    expect(discreteDist(x, z) + discreteDist(z, z)).toBe(1); // y equals z
    expect(discreteDist(x, 2) + discreteDist(2, z)).toBe(2); // y equals neither
    // x == z: LHS = 0, trivially satisfied.
    expect(discreteDist(x, x)).toBe(0);
  });
});

describe('metric-spaces: discreteBall', () => {
  it('is {p0} for r <= 1 (the boundary r = 1 stays single)', () => {
    expect(discreteBall(0, 0.5)).toEqual([0]);
    expect(discreteBall(0, 1)).toEqual([0]);
  });

  it('is all 6 indices for r > 1', () => {
    expect(discreteBall(0, 1.5)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(discreteBall(0, 2)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('works around any center index', () => {
    expect(discreteBall(3, 0.5)).toEqual([3]);
    expect(discreteBall(5, 1.2)).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe('metric-spaces: model compute', () => {
  it('recognizes the three metric kinds', () => {
    expect(METRIC_KINDS).toEqual(['euclid', 'discrete', 'maxnorm']);
    expect(metricKindOf('euclid')).toBe('euclid');
    expect(metricKindOf('discrete')).toBe('discrete');
    expect(metricKindOf('maxnorm')).toBe('maxnorm');
    expect(metricKindOf('bogus')).toBe('euclid');
  });

  it('computes discrete ball membership for the problem presets', () => {
    const half = compute({ metric: 'discrete', r: 0.5 });
    expect(half.metric).toBe('discrete');
    expect(half.r).toBe(0.5);
    expect(half.inBall).toEqual([true, false, false, false, false, false]);
    const past = compute({ metric: 'discrete', r: 1.5 });
    expect(past.inBall).toEqual([true, true, true, true, true, true]);
  });

  it('clamps r into [0.2, 2] and defaults the metric to euclid', () => {
    expect(compute({ metric: 'euclid', r: 5 }).r).toBe(2);
    expect(compute({ metric: 'euclid', r: 0.05 }).r).toBe(0.2);
    expect(compute({}).metric).toBe('euclid');
    expect(compute({}).r).toBe(1);
  });

  it('accepts the exact presets from the problems file', () => {
    expect(metricSpacesData('discrete', 0.5).inBall).toEqual([true, false, false, false, false, false]);
    expect(metricSpacesData('discrete', 1.5).inBall).toEqual([true, true, true, true, true, true]);
  });
});

describe('metric-spaces: every number used in the proofs', () => {
  it('B(x, 1/2) = {x}: distances below 1/2 force equality', () => {
    // From the discrete-open proof: d(x,y) < 1/2 forces d(x,y) = 0, i.e. y = x.
    for (let y = 0; y < 6; y++) {
      expect(discreteDist(0, y) < 0.5).toBe(y === 0);
    }
  });

  it('d(x_n, x) < 1/2 implies x_n = x (discrete-convergent proof)', () => {
    for (let n = 0; n < 6; n++) {
      if (discreteDist(n, 0) < 0.5) expect(n).toBe(0);
    }
  });

  it('only the values 0 and 1 occur as distances', () => {
    const values = new Set<number>();
    for (let a = 0; a < 6; a++) {
      for (let b = 0; b < 6; b++) values.add(discreteDist(a, b));
    }
    expect(values).toEqual(new Set([0, 1]));
  });
});
