import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import { limits } from '../src/chapters/limits/meta';
import {
  epsDeltaData,
  epsDeltaDelta,
  epsdeltaModel,
  linearDelta,
  type EpsDeltaData,
} from '../src/chapters/limits/models/epsdelta';
import {
  continuityData,
  continuityLimit,
  continuityModel,
  continuityValue,
  type ContinuityData,
} from '../src/chapters/limits/models/continuity';
import {
  cauchyTerm,
  geometricPartialSum,
  monotoneCauchyData,
  monotoneCauchyModel,
  partialSumDiff,
  type MonotoneCauchyData,
} from '../src/chapters/limits/models/monotoneCauchy';
import {
  cubicEvt,
  discontinuousEvt,
  evtData,
  evtMode,
  evtModel,
  reciprocalEvt,
  unboundedWitness,
  type EvtData,
} from '../src/chapters/limits/models/evt';

const epsDeltaCompute = (state: ControlState): EpsDeltaData => epsdeltaModel.compute(state) as EpsDeltaData;
const continuityCompute = (state: ControlState): ContinuityData => continuityModel.compute(state) as ContinuityData;
const cauchyCompute = (state: ControlState): MonotoneCauchyData => monotoneCauchyModel.compute(state) as MonotoneCauchyData;
const evtCompute = (state: ControlState): EvtData => evtModel.compute(state) as EvtData;

describe('epsdelta: delta = epsilon / 2 mapping', () => {
  it('epsDeltaDelta(0.4) = 0.2', () => {
    expect(epsDeltaDelta(0.4)).toBe(0.2);
  });

  it('the general linear rule gives the proof numbers: delta = epsilon/3 for slope 3', () => {
    expect(linearDelta(0.3, 3)).toBeCloseTo(0.1, 15);
    expect(linearDelta(0.03, 3)).toBeCloseTo(0.01, 15);
    expect(linearDelta(0.4, 2)).toBe(0.2);
  });

  it('grid check passes for the whole slider range', () => {
    for (const epsilon of [0.05, 0.1, 0.3, 0.4, 0.7, 1]) {
      const data = epsDeltaData(epsilon);
      expect(data.delta).toBe(epsilon / 2);
      expect(data.gridPass).toBe(true);
      expect(data.a).toBe(1);
      expect(data.l).toBe(2);
    }
  });

  it('every in-delta sample satisfies |f(x) - L| < epsilon, verified point by point', () => {
    const data = epsDeltaData(0.4);
    const inDelta = data.samples.filter((s) => s.inDelta);
    expect(inDelta.length).toBeGreaterThan(0);
    for (const s of inDelta) {
      expect(Math.abs(s.x - 1)).toBeLessThan(data.delta);
      expect(Math.abs(s.fx - 2)).toBeLessThan(0.4);
    }
  });

  it('the squared-limit proof numbers: delta = min(1, 0.3/3) = 0.1 and 3 * delta = epsilon', () => {
    const epsilon = 0.3;
    const delta = Math.min(1, epsilon / 3);
    expect(delta).toBeCloseTo(0.1, 15);
    expect(3 * delta).toBeCloseTo(epsilon, 15);
  });

  it('the uniqueness proof numbers: epsilon/2 + epsilon/2 = epsilon', () => {
    const epsilon = 0.1;
    expect(epsilon / 2 + epsilon / 2).toBeCloseTo(epsilon, 15);
  });

  it('compute() accepts every epsdelta problem preset', () => {
    expect(epsDeltaCompute({ epsilon: 0.3 }).epsilon).toBe(0.3);
    expect(epsDeltaCompute({ epsilon: 0.6 }).delta).toBeCloseTo(0.3, 15);
    expect(epsDeltaCompute({ epsilon: 0.1 }).gridPass).toBe(true);
  });
});

describe('continuity: the broken-mode verdict', () => {
  it('intact mode: limit and value agree, verdict continuous', () => {
    const data = continuityData(1, false);
    expect(continuityLimit(1)).toBe(1);
    expect(continuityValue(1, false)).toBe(1);
    expect(data.limitV).toBe(1);
    expect(data.funcV).toBe(1);
    expect(data.continuous).toBe(true);
  });

  it('broken mode at a = 1: limit 1, value 2, definition fails', () => {
    const data = continuityData(1, true);
    expect(data.limitV).toBe(1);
    expect(data.funcV).toBe(2);
    expect(data.continuous).toBe(false);
  });

  it('broken mode at a = -1.5: limit 2.25, value 3.25', () => {
    const data = continuityData(-1.5, true);
    expect(data.limitV).toBe(2.25);
    expect(data.funcV).toBe(3.25);
    expect(data.continuous).toBe(false);
  });

  it('the |x|-at-0 proof numbers: delta = epsilon and ||x| - 0| = |x|', () => {
    const epsilon = 0.05;
    const delta = epsilon;
    expect(delta).toBe(0.05);
    for (const x of [-0.04, -0.001, 0, 0.02, 0.049]) {
      expect(Math.abs(Math.abs(x) - 0)).toBe(Math.abs(x));
      if (Math.abs(x) < delta) expect(Math.abs(x)).toBeLessThan(epsilon);
    }
  });

  it('the composition proof numbers: the epsilon <- eta <- delta chain', () => {
    const epsilon = 0.4;
    const eta = epsilon / 2;
    const delta = eta / 2;
    expect(eta).toBe(0.2);
    expect(delta).toBeCloseTo(0.1, 15);
    expect(delta).toBeCloseTo(epsilon / 4, 15);
  });

  it('compute() accepts every continuity problem preset', () => {
    expect(continuityCompute({ a: 1, broken: false }).continuous).toBe(true);
    expect(continuityCompute({ a: 0, broken: false }).limitV).toBe(0);
    expect(continuityCompute({ a: -1, broken: false }).limitV).toBe(1);
  });
});

describe('monotone-cauchy: terms and tail diameter', () => {
  it('a_8 = 1 - 2^(-8) = 0.99609375', () => {
    expect(cauchyTerm(8)).toBe(0.99609375);
    expect(monotoneCauchyData(8, 4).aN).toBe(0.99609375);
  });

  it('tail diameter for tailN = 4 over indices <= 12 is 2^(-4) - 2^(-12)', () => {
    const expected = 0.0625 - 0.000244140625;
    expect(expected).toBe(0.062255859375);
    expect(monotoneCauchyData(8, 4).tailDiameter).toBe(expected);
  });

  it('tail diameter shrinks as the tail starts later', () => {
    const d4 = monotoneCauchyData(8, 4).tailDiameter;
    const d8 = monotoneCauchyData(12, 8).tailDiameter;
    const d10 = monotoneCauchyData(12, 10).tailDiameter;
    expect(d8).toBeLessThan(d4);
    expect(d10).toBeLessThan(d8);
    expect(d10).toBe(2 ** -10 - 2 ** -12);
  });

  it('partial sums equal the scene sequence: s_N = 1 - 2^(-N)', () => {
    for (const n of [1, 4, 8, 12]) {
      expect(geometricPartialSum(n)).toBe(cauchyTerm(n));
    }
  });

  it('the s_m - s_n formula: |s_10 - s_4| = 2^(-4) - 2^(-10)', () => {
    expect(partialSumDiff(10, 4)).toBe(0.0625 - 0.0009765625);
    expect(partialSumDiff(10, 4)).toBe(0.0615234375);
    const s = (n: number): number => {
      let total = 0;
      for (let k = 1; k <= n; k++) total += 2 ** -k;
      return total;
    };
    expect(Math.abs(s(10) - s(4))).toBeCloseTo(partialSumDiff(10, 4), 15);
  });

  it('the MCT proof numbers: a_40 = 1 - 1/40 = 0.975', () => {
    expect(1 - 1 / 40).toBe(0.975);
  });

  it('the Cauchy-bounded proof numbers: M = |a_1| + 1 = 1.5 for the scene sequence', () => {
    expect(cauchyTerm(1)).toBe(0.5);
    expect(cauchyTerm(1) + 1).toBe(1.5);
  });

  it('compute() accepts every monotone-cauchy problem preset', () => {
    expect(cauchyCompute({ n: 8, tailN: 4 }).aN).toBe(0.99609375);
    expect(cauchyCompute({ n: 12, tailN: 6 }).terms).toHaveLength(12);
    expect(cauchyCompute({ n: 8, tailN: 4 }).tailDiameter).toBe(0.062255859375);
  });
});

describe('evt: the cubic values and the counterexamples', () => {
  it('f(-2) = -2, f(-1) = 2, f(1) = -2, f(2) = 2 for f(x) = x^3 - 3x', () => {
    expect(cubicEvt(-2)).toBe(-2);
    expect(cubicEvt(-1)).toBe(2);
    expect(cubicEvt(1)).toBe(-2);
    expect(cubicEvt(2)).toBe(2);
  });

  it('closed mode: max 2 at x = -1 and 2, min -2 at x = -2 and 1, both attained', () => {
    const data = evtData('closed');
    expect(data.verdict).toBe('attained');
    expect(data.max.value).toBe(2);
    expect(data.max.at).toEqual([-1, 2]);
    expect(data.max.attained).toBe(true);
    expect(data.min.value).toBe(-2);
    expect(data.min.at).toEqual([-2, 1]);
    expect(data.min.attained).toBe(true);
  });

  it('open-interval mode: unbounded above, no maximum; min 1 at x = 1', () => {
    const data = evtData('open-interval');
    expect(data.verdict).toBe('unbounded');
    expect(data.max.attained).toBe(false);
    expect(data.min.value).toBe(1);
    expect(data.min.at).toEqual([1]);
    expect(data.min.attained).toBe(true);
  });

  it('the 1/(M+1) witness: x = 1/6 gives f(x) = 6 > 5', () => {
    expect(unboundedWitness(5)).toBeCloseTo(1 / 6, 15);
    expect(reciprocalEvt(unboundedWitness(5))).toBeCloseTo(6, 12);
  });

  it('discontinuous mode: sup 1 never attained, min 0 at x = 0', () => {
    const data = evtData('discontinuous');
    expect(data.verdict).toBe('not-attained');
    expect(data.max.value).toBe(1);
    expect(data.max.at).toEqual([]);
    expect(data.max.attained).toBe(false);
    expect(data.min.value).toBe(0);
    expect(data.min.at).toEqual([0]);
    expect(data.min.attained).toBe(true);
    expect(discontinuousEvt(1)).toBe(0);
    expect(discontinuousEvt(0.7)).toBe(0.7);
  });

  it('the sup = 1 proof numbers: x = (u+1)/2 lands in [0,1) above u', () => {
    const u = 0.6;
    const x = (u + 1) / 2;
    expect(x).toBe(0.8);
    expect(x).toBeGreaterThan(u);
    expect(x).toBeLessThan(1);
  });

  it('the x^2-on-[0,1] proof numbers: max 1 at x = 1, min 0 at x = 0', () => {
    expect(0 ** 2).toBe(0);
    expect(1 ** 2).toBe(1);
    expect(0.5 ** 2).toBe(0.25);
  });

  it('evtMode falls back to closed for unknown input', () => {
    expect(evtMode('bogus')).toBe('closed');
    expect(evtMode('open-interval')).toBe('open-interval');
  });

  it('compute() accepts every evt problem preset', () => {
    expect(evtCompute({ mode: 'closed' }).verdict).toBe('attained');
    expect(evtCompute({ mode: 'open-interval' }).verdict).toBe('unbounded');
    expect(evtCompute({ mode: 'discontinuous' }).verdict).toBe('not-attained');
  });
});

describe('limits chapter meta: order, prerequisites, presets', () => {
  it('has the final 29-scene order sequence', () => {
    const ids = limits.scenes.map((s) => s.id);
    expect(ids).toEqual([
      'natural-numbers',
      'binomial',
      'integers-rationals',
      'sets',
      'supremum',
      'countable',
      'groups-fields',
      'vector-spaces',
      'dimension-rank',
      'epsilon-n',
      'epsdelta',
      'continuity',
      'uniform-continuity',
      'opensets',
      'closure',
      'compact',
      'metric-spaces',
      'contraction',
      'sequence-spaces',
      'holes',
      'construction',
      'bolzano-weierstrass',
      'monotone-cauchy',
      'limsup-liminf',
      'stolz-cesaro',
      'cantor',
      'ivt',
      'evt',
      'uniform',
      'weierstrass-approx',
    ]);
    expect(limits.scenes.map((s) => s.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  });

  it('sets the new scenes prerequisites', () => {
    const byId = Object.fromEntries(limits.scenes.map((s) => [s.id, s]));
    expect(byId['binomial']?.prerequisites).toEqual(['natural-numbers']);
    expect(byId['integers-rationals']?.prerequisites).toEqual(['natural-numbers']);
    expect(byId['weierstrass-approx']?.prerequisites).toEqual(['uniform']);
    expect(byId['vector-spaces']?.prerequisites).toEqual(['groups-fields']);
    expect(byId['dimension-rank']?.prerequisites).toEqual(['vector-spaces']);
    expect(byId['epsdelta']?.prerequisites).toEqual(['epsilon-n']);
    expect(byId['continuity']?.prerequisites).toEqual(['epsdelta']);
    expect(byId['monotone-cauchy']?.prerequisites).toEqual(['bolzano-weierstrass']);
    expect(byId['evt']?.prerequisites).toEqual(['ivt']);
    expect(byId['compact']?.prerequisites).toEqual(['closure']);
    expect(byId['contraction']?.prerequisites).toEqual(['metric-spaces', 'monotone-cauchy']);
  });

  it('gives each new scene exactly 3 problems', () => {
    for (const id of ['epsdelta', 'continuity', 'monotone-cauchy', 'evt']) {
      const scene = limits.scenes.find((s) => s.id === id);
      expect(scene?.problems).toHaveLength(3);
    }
  });

  it('uses only declared control keys with valid values in every new problem preset', () => {
    for (const id of ['epsdelta', 'continuity', 'monotone-cauchy', 'evt']) {
      const scene = limits.scenes.find((s) => s.id === id);
      expect(scene).toBeDefined();
      for (const problem of scene?.problems ?? []) {
        for (const [key, value] of Object.entries(problem.preset)) {
          const spec = scene?.controls.find((c) => c.key === key);
          expect(spec, `${id}/${problem.id}: control '${key}' must be declared`).toBeDefined();
          if (spec?.kind === 'slider') {
            expect(typeof value).toBe('number');
            expect(value as number).toBeGreaterThanOrEqual(spec.min);
            expect(value as number).toBeLessThanOrEqual(spec.max);
            const steps = ((value as number) - spec.min) / spec.step;
            expect(Math.abs(steps - Math.round(steps))).toBeLessThan(1e-9);
          } else if (spec?.kind === 'toggle') {
            expect(typeof value).toBe('boolean');
          } else if (spec?.kind === 'select') {
            expect(spec.options).toContain(value);
          }
        }
      }
    }
  });
});
