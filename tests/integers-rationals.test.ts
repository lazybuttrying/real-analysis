import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  equivClass,
  intEquiv,
  intRepr,
  integersRationalsModel,
  midpoint,
  ratEquiv,
  ratValue,
  reducedFractions,
  type IntegersRationalsData,
} from '../src/chapters/limits/models/integers-rationals';

const compute = (state: ControlState): IntegersRationalsData =>
  integersRationalsModel.compute(state) as IntegersRationalsData;

describe('integers-rationals: intEquiv detects the integer a-b', () => {
  it('intEquiv(3,1,5,3) is true (both mean 2), intEquiv(3,1,4,3) is false', () => {
    expect(intEquiv(3, 1, 5, 3)).toBe(true);
    expect(intEquiv(3, 1, 4, 3)).toBe(false);
    expect(intRepr(3, 1)).toBe(2);
    expect(intRepr(5, 3)).toBe(2);
    expect(intRepr(1, 4)).toBe(-3);
  });
});

describe('integers-rationals: addition is well-defined on classes (proof 1 numbers)', () => {
  // each entry: (a,b)~(a',b'), (c,d)~(c',d') ==> (a+c,b+d)~(a'+c',b'+d')
  const cases: Array<[number, number, number, number, number, number, number, number]> = [
    [3, 1, 5, 3, 1, 1, 2, 2],
    [3, 1, 5, 3, 0, 2, 1, 3],
    [5, 1, 7, 3, 2, 3, 0, 1],
    [1, 4, 0, 3, 6, 2, 4, 0],
    [2, 2, 3, 3, 4, 5, 5, 6],
  ];
  it.each(cases)('(%i,%i)+(%i,%i) agrees with (%i,%i)+(%i,%i)', (a, b, ap, bp, c, d, cp, dp) => {
    expect(intEquiv(a, b, ap, bp)).toBe(true);
    expect(intEquiv(c, d, cp, dp)).toBe(true);
    expect(intEquiv(a + c, b + d, ap + cp, bp + dp)).toBe(true);
  });
});

describe('integers-rationals: rationals are dense (proof 2 numbers)', () => {
  it('midpoint of 1/3 and 1/2 is 5/12, strictly between as floats', () => {
    const m = midpoint(1, 3, 1, 2);
    expect(m).toEqual({ p: 5, q: 12 });
    const lo = ratValue(1, 3);
    const mid = ratValue(m.p, m.q);
    const hi = ratValue(1, 2);
    expect(lo).toBeLessThan(mid);
    expect(mid).toBeLessThan(hi);
  });
});

describe('integers-rationals: every nonzero rational has an inverse (proof 3 numbers)', () => {
  it('ratValue(p,q) * ratValue(q,p) is 1 for sample nonzero p, q', () => {
    const samples: Array<[number, number]> = [
      [1, 2],
      [2, 3],
      [3, 7],
      [-2, 5],
      [5, 1],
    ];
    for (const [p, q] of samples) {
      expect(ratValue(p, q)).not.toBe(0);
      expect(ratValue(p, q) * ratValue(q, p)).toBeCloseTo(1, 15);
    }
  });

  it('ratEquiv detects the rational a/b', () => {
    expect(ratEquiv(1, 2, 2, 4)).toBe(true);
    expect(ratEquiv(1, 2, 3, 5)).toBe(false);
  });
});

describe('integers-rationals: reducedFractions enumerates the drawn dots', () => {
  it('gives 25 reduced fractions in [-2, 2] for denom 4', () => {
    const fs = reducedFractions(4);
    expect(fs).toHaveLength(25);
    for (const f of fs) {
      expect(f.value).toBeGreaterThanOrEqual(-2);
      expect(f.value).toBeLessThanOrEqual(2);
      expect(f.p / f.q).toBe(f.value);
    }
  });

  it('is sorted by value', () => {
    const fs = reducedFractions(8);
    for (let i = 1; i < fs.length; i++) {
      expect((fs[i]?.value ?? 0) >= (fs[i - 1]?.value ?? 0)).toBe(true);
    }
  });
});

describe('integers-rationals: equivClass(1,2,4) is the stacked class', () => {
  it('contains (1,2) and (2,4), all with value 0.5', () => {
    const members = equivClass(1, 2, 4);
    expect(members).toHaveLength(2);
    expect(members).toContainEqual({ r: 1, s: 2 });
    expect(members).toContainEqual({ r: 2, s: 4 });
    for (const { r, s } of members) {
      expect(ratValue(r, s)).toBe(0.5);
    }
  });

  it('grows to (3,6) and (4,8) with denom 8', () => {
    const members = equivClass(1, 2, 8);
    expect(members).toHaveLength(4);
    expect(members).toContainEqual({ r: 3, s: 6 });
    expect(members).toContainEqual({ r: 4, s: 8 });
  });
});

describe('integers-rationals: model compute clamps state', () => {
  it('defaults set to rationals and clamps denom into [1, 8]', () => {
    expect(compute({ set: 'bogus' }).set).toBe('rationals');
    expect(compute({}).set).toBe('rationals');
    expect(compute({ denom: 99 }).denom).toBe(8);
    expect(compute({ denom: 0 }).denom).toBe(1);
    expect(compute({}).denom).toBe(4);
    expect(compute({ set: 'integers' }).set).toBe('integers');
    expect(compute({ set: 'naturals' }).set).toBe('naturals');
  });

  it('only computes fractions and class12 in rationals mode', () => {
    const r = compute({ set: 'rationals', denom: 4 });
    expect(r.fractions).toHaveLength(25);
    expect(r.class12).toHaveLength(2);
    const i = compute({ set: 'integers' });
    expect(i.fractions).toHaveLength(0);
    expect(i.class12).toHaveLength(0);
  });
});
