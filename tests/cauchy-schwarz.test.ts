import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  cauchySchwarzModel,
  dot,
  EPS,
  norm,
  type CauchySchwarzData,
} from '../src/chapters/limits/models/cauchySchwarz';

const compute = (state: ControlState): CauchySchwarzData => syncCompute(cauchySchwarzModel, state);

describe('cauchy-schwarz: helpers', () => {
  it('dot((1, 2), (3, 4)) = 11', () => {
    expect(dot({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(11);
  });

  it('norm((3, 4)) = 5 and norm of the fixed x is 3', () => {
    expect(norm({ x: 3, y: 4 })).toBe(5);
    expect(compute({}).normX).toBe(3);
  });
});

describe('cauchy-schwarz: angle clamping and toggle default', () => {
  it('defaults to angle 0 and clamps to [0, 2pi]', () => {
    expect(compute({}).theta).toBe(0);
    expect(compute({ angle: NaN }).theta).toBe(0);
    expect(compute({ angle: -1 }).theta).toBe(0);
    expect(compute({ angle: 100 }).theta).toBe(2 * Math.PI);
    expect(compute({ angle: Math.PI }).theta).toBe(Math.PI);
  });

  it('showProjection defaults to true and obeys an explicit false', () => {
    expect(compute({}).showProjection).toBe(true);
    expect(compute({ angle: 0, showProjection: true }).showProjection).toBe(true);
    expect(compute({ angle: 0, showProjection: false }).showProjection).toBe(false);
  });
});

describe('cauchy-schwarz: equality case at angle 0', () => {
  const data = compute({ angle: 0, showProjection: true });

  it('y = (1, 0) is parallel to x = (3, 0)', () => {
    expect(data.y).toEqual({ x: 1, y: 0 });
    expect(data.isParallel).toBe(true);
    expect(data.isOrthogonal).toBe(false);
  });

  it('dot = 3 and |dot| = ||x|| ||y|| = 3 (gap 0)', () => {
    expect(data.dot).toBe(3);
    expect(data.absDot).toBe(3);
    expect(data.normX).toBe(3);
    expect(data.normY).toBe(1);
    expect(data.product).toBe(3);
    expect(data.gap).toBe(0);
  });

  it('projection of x onto y is (3, 0) with length 3', () => {
    expect(data.projection).toEqual({ x: 3, y: 0 });
    expect(data.projectionLength).toBe(3);
  });

  it('||x + y|| = 4', () => {
    expect(data.sumVec).toEqual({ x: 4, y: 0 });
    expect(data.sumNorm).toBe(4);
  });
});

describe('cauchy-schwarz: orthogonal case at angle pi/2', () => {
  const data = compute({ angle: Math.PI / 2, showProjection: true });

  it('dot product is ~0', () => {
    // 3 * cos(pi/2) = 1.8369701987210297e-16.
    expect(data.dot).toBeCloseTo(0, 12);
    expect(data.absDot).toBeCloseTo(0, 12);
  });

  it('flags orthogonal, not parallel', () => {
    expect(data.isOrthogonal).toBe(true);
    expect(data.isParallel).toBe(false);
  });

  it('projection collapses to ~0 while the product stays 3', () => {
    expect(data.projectionLength).toBeCloseTo(0, 12);
    expect(data.projection.x).toBeCloseTo(0, 12);
    expect(data.projection.y).toBeCloseTo(0, 12);
    expect(data.product).toBe(3);
    expect(data.gap).toBeCloseTo(3, 12);
  });

  it('||x + y|| = sqrt(10) < 4', () => {
    expect(data.sumNorm).toBeCloseTo(Math.sqrt(10), 12);
    expect(data.sumNorm).toBeLessThan(data.normX + data.normY);
  });
});

describe('cauchy-schwarz: interior case at angle pi/4', () => {
  const data = compute({ angle: Math.PI / 4, showProjection: true });

  it('dot = 3*sqrt(2)/2', () => {
    expect(data.dot).toBe(3 * Math.SQRT2 * 0.5);
    expect(data.dot).toBeCloseTo(2.121320343559643, 12);
  });

  it('projection is (1.5, 1.5) with length |dot|', () => {
    expect(data.projection.x).toBeCloseTo(1.5, 12);
    expect(data.projection.y).toBeCloseTo(1.5, 12);
    expect(data.projectionLength).toBe(data.absDot);
  });

  it('the slack is strictly positive', () => {
    expect(data.gap).toBeCloseTo(0.8786796564403572, 12);
    expect(data.gap).toBeGreaterThan(0);
    expect(data.isParallel).toBe(false);
    expect(data.isOrthogonal).toBe(false);
  });

  it('triangle inequality is strict: ||x + y|| ~ 3.7739 < 4', () => {
    expect(data.sumNorm).toBeCloseTo(3.773942326946622, 12);
    expect(data.sumNorm).toBeLessThan(data.normX + data.normY);
  });
});

describe('cauchy-schwarz: antiparallel case at angle pi', () => {
  const data = compute({ angle: Math.PI, showProjection: true });

  it('equality also holds (|sin pi| < EPS)', () => {
    expect(data.dot).toBe(-3);
    expect(data.absDot).toBe(3);
    expect(data.gap).toBe(0);
    expect(data.isParallel).toBe(true);
    expect(data.isOrthogonal).toBe(false);
  });

  it('||x + y|| = 2', () => {
    expect(data.sumNorm).toBe(2);
  });
});

describe('cauchy-schwarz: inequality holds for a full sweep', () => {
  it('|dot| <= product + tolerance at 48 angles', () => {
    for (let k = 0; k < 48; k++) {
      const data = compute({ angle: (k * 2 * Math.PI) / 48 });
      expect(data.absDot).toBeLessThanOrEqual(data.product + 1e-12);
      expect(data.gap).toBeGreaterThanOrEqual(-1e-12);
    }
  });

  it('EPS tolerance is tighter than the floating-point error at pi', () => {
    expect(Math.abs(Math.sin(Math.PI))).toBeLessThan(EPS);
    expect(Math.abs(3 * Math.cos(Math.PI / 2))).toBeLessThan(EPS);
  });
});
