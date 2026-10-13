import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  inclusionExclusion,
  isInjectiveMap,
  isSurjectiveMap,
  setsActiveRegions,
  setsArrowMap,
  setsData,
  setsModel,
  type SetsData,
} from '../src/chapters/limits/models/sets';

const compute = (state: ControlState): SetsData => setsModel.compute(state) as SetsData;

describe('sets: Venn region mapping', () => {
  it('maps each set operation to the correct active regions', () => {
    expect(setsActiveRegions('union')).toEqual(['aOnly', 'both', 'bOnly']);
    expect(setsActiveRegions('intersection')).toEqual(['both']);
    expect(setsActiveRegions('complement')).toEqual(['bOnly', 'neither']);
    expect(setsActiveRegions('difference')).toEqual(['aOnly']);
    expect(setsActiveRegions('symdiff')).toEqual(['aOnly', 'bOnly']);
  });

  it('falls back to union for unknown operations', () => {
    expect(setsActiveRegions('bogus')).toEqual(['aOnly', 'both', 'bOnly']);
  });
});

describe('sets: arrow diagrams and injectivity/surjectivity', () => {
  it('injective mode: D = [1,2,3], C = [a,b,c,d], one unhit codomain dot', () => {
    const map = setsArrowMap('injective');
    expect(map.domain).toEqual(['1', '2', '3']);
    expect(map.codomain).toEqual(['a', 'b', 'c', 'd']);
    expect(map.arrows).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
    expect(isInjectiveMap(map.arrows)).toBe(true);
    expect(isSurjectiveMap(map.arrows, map.codomain.length)).toBe(false);
  });

  it('surjective mode: D = [1,2,3,4], C = [a,b,c], collision on c', () => {
    const map = setsArrowMap('surjective');
    expect(map.domain).toEqual(['1', '2', '3', '4']);
    expect(map.codomain).toEqual(['a', 'b', 'c']);
    expect(map.arrows).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 2],
    ]);
    expect(isInjectiveMap(map.arrows)).toBe(false);
    expect(isSurjectiveMap(map.arrows, map.codomain.length)).toBe(true);
  });

  it('bijective mode: every dot hit exactly once', () => {
    const map = setsArrowMap('bijective');
    expect(map.domain).toEqual(['1', '2', '3']);
    expect(map.codomain).toEqual(['a', 'b', 'c']);
    expect(isInjectiveMap(map.arrows)).toBe(true);
    expect(isSurjectiveMap(map.arrows, map.codomain.length)).toBe(true);
  });

  it('neither mode: collision on a and c unhit', () => {
    const map = setsArrowMap('neither');
    expect(map.domain).toEqual(['1', '2', '3']);
    expect(map.codomain).toEqual(['a', 'b', 'c']);
    expect(map.arrows).toEqual([
      [0, 0],
      [1, 0],
      [2, 1],
    ]);
    expect(isInjectiveMap(map.arrows)).toBe(false);
    expect(isSurjectiveMap(map.arrows, map.codomain.length)).toBe(false);
  });
});

describe('sets: inclusion-exclusion', () => {
  it('|A cup B| = |A| + |B| - |A cap B| = 5 + 4 - 2 = 7', () => {
    expect(inclusionExclusion(5, 4, 2)).toBe(7);
  });

  it('is consistent with the disjoint decomposition', () => {
    // |A \ B| = 3, |B \ A| = 2, |A cap B| = 2: union has 3 + 2 + 2 = 7 dots.
    const aOnly = 3;
    const bOnly = 2;
    const both = 2;
    expect(aOnly + both).toBe(5);
    expect(bOnly + both).toBe(4);
    expect(inclusionExclusion(5, 4, 2)).toBe(aOnly + bOnly + both);
  });
});

describe('sets: compute() accepts every problem preset', () => {
  it('demorgan preset {op: union, fnmode: bijective}', () => {
    const data = compute({ op: 'union', fnmode: 'bijective' });
    expect(data.op).toBe('union');
    expect(data.activeRegions).toEqual(['aOnly', 'both', 'bOnly']);
    expect(data.isInjective).toBe(true);
    expect(data.isSurjective).toBe(true);
  });

  it('bijective-inverse preset {op: intersection, fnmode: bijective}', () => {
    const data = compute({ op: 'intersection', fnmode: 'bijective' });
    expect(data.op).toBe('intersection');
    expect(data.activeRegions).toEqual(['both']);
  });

  it('inclusion-exclusion preset {op: union, fnmode: injective}', () => {
    const data = compute({ op: 'union', fnmode: 'injective' });
    expect(data.fnmode).toBe('injective');
    expect(data.isInjective).toBe(true);
    expect(data.isSurjective).toBe(false);
    expect(data.codomain).toHaveLength(4);
  });

  it('unknown keys fall back to union / bijective', () => {
    const data = compute({ op: '??', fnmode: '??' });
    expect(data.op).toBe('union');
    expect(data.fnmode).toBe('bijective');
  });

  it('exported raw data function matches compute()', () => {
    expect(setsData('symdiff', 'neither')).toEqual(compute({ op: 'symdiff', fnmode: 'neither' }));
  });
});
