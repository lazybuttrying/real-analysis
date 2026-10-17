import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  limsupLiminfModel,
  term,
  type LimsupLiminfData,
} from '../src/chapters/limits/models/limsupLiminf';

const compute = (state: ControlState): LimsupLiminfData => syncCompute(limsupLiminfModel, state);

describe('limsup-liminf: term values', () => {
  it('a_2 = 1.5 and a_3 = -4/3', () => {
    expect(term(2)).toBe(1.5);
    expect(term(3)).toBeCloseTo(-4 / 3, 12);
  });

  it('a_1 = -2', () => {
    expect(term(1)).toBe(-2);
  });
});

describe('limsup-liminf: model compute', () => {
  it('clamps n to [2, 60] and defaults to 24', () => {
    expect(compute({ n: 24 }).count).toBe(24);
    expect(compute({ n: 1 }).count).toBe(2);
    expect(compute({ n: 100 }).count).toBe(60);
    expect(compute({ n: 2.9 }).count).toBe(2);
    expect(compute({}).count).toBe(24);
    expect(compute({ n: NaN }).count).toBe(24);
  });

  it('returns limsup = 1 and liminf = -1', () => {
    const data = compute({ n: 24 });
    expect(data.limsup).toBe(1);
    expect(data.liminf).toBe(-1);
  });

  it('emits one point per term starting at n = 1', () => {
    const data = compute({ n: 24 });
    expect(data.points).toHaveLength(24);
    expect(data.points[0]).toEqual({ n: 1, value: term(1) });
    expect(data.points[23]).toEqual({ n: 24, value: term(24) });
  });

  it('tailSup[19] (tail from n = 20) is 1.05', () => {
    const data = compute({ n: 24 });
    // The largest even index >= 20 within 1..24 is 20, giving 1 + 1/20.
    expect(data.tailSup[19]).toBe(1 + 1 / 20);
    expect(data.tailSup[19]).toBeCloseTo(1.05, 12);
  });

  it('tailInf from n = 21 is -(1 + 1/21)', () => {
    const data = compute({ n: 24 });
    // tailInf[20] is the inf of { a_n : n >= 21 }; the smallest value is
    // the odd term -(1 + 1/21) at n = 21.
    expect(data.tailInf[20]).toBe(-(1 + 1 / 21));
    expect(data.tailInf[20]).toBeCloseTo(-1.0476, 4);
  });

  it('tailSup is nonincreasing in the start index', () => {
    const data = compute({ n: 60 });
    for (let i = 1; i < data.tailSup.length; i++) {
      const prev = data.tailSup[i - 1] as number;
      const curr = data.tailSup[i] as number;
      expect(curr).toBeLessThanOrEqual(prev);
    }
  });

  it('tailInf is nondecreasing in the start index', () => {
    const data = compute({ n: 60 });
    for (let i = 1; i < data.tailInf.length; i++) {
      const prev = data.tailInf[i - 1] as number;
      const curr = data.tailInf[i] as number;
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it('tail sup/inf agree with a brute-force scan', () => {
    const data = compute({ n: 37 });
    for (let start = 1; start <= 37; start++) {
      const tail = data.points.slice(start - 1).map((point) => point.value);
      expect(data.tailSup[start - 1]).toBe(Math.max(...tail));
      expect(data.tailInf[start - 1]).toBe(Math.min(...tail));
    }
  });
});
