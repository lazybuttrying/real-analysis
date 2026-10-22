import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import { catalog } from '../src/catalog.ts';
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

const epsDeltaCompute = (state: ControlState): EpsDeltaData => syncCompute(epsdeltaModel, state);
const continuityCompute = (state: ControlState): ContinuityData => syncCompute(continuityModel, state);
const cauchyCompute = (state: ControlState): MonotoneCauchyData => syncCompute(monotoneCauchyModel, state);
const evtCompute = (state: ControlState): EvtData => syncCompute(evtModel, state);

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
      expectCloseTo(s.x, 1, data.delta);
      expectCloseTo(s.fx, 2, 0.4);
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

describe('split chapters: the five ex-limits chapters', () => {
  const byId = new Map(catalog.map((chapter) => [chapter.id, chapter]));
  const idsOf = (id: string): string[] =>
    [...(byId.get(id)?.scenes ?? [])].sort((a, b) => a.order - b.order).map((s) => s.id);

  it('assigns every ex-limits scene to its new chapter', () => {
    expect(idsOf('numbers')).toEqual([
      'natural-numbers',
      'binomial',
      'integers-rationals',
      'complex-numbers',
      'sqrt2-irrational',
      'density-of-rationals',
      'sets',
      'axiom-of-choice',
      'zorn-lemma',
      'supremum',
      'nth-root',
      'countable',
      'cantor-theorem',
      'groups-fields',
      'vector-spaces',
      'dimension-rank',
    ]);
    expect(idsOf('sequences')).toEqual([
      'epsilon-n',
      'standard-limits',
      'sequence-spaces',
      'cauchy-schwarz',
      'holder',
      'parallelogram-law',
      'holes',
      'construction',
      'bolzano-weierstrass',
      'monotone-cauchy',
      'limsup-liminf',
      'stolz-cesaro',
    ]);
    expect(idsOf('continuity')).toEqual([
      'epsdelta',
      'continuity',
      'thomae',
      'continuity-equivalences',
      'monotone-discontinuities',
      'uniform-continuity',
      'ivt',
      'evt',
      'uniform',
    ]);
    expect(idsOf('topology')).toEqual([
      'opensets',
      'clopen',
      'connected',
      'closure',
      'compact',
      'topologist-sine',
      'peano-curve',
      'metric-spaces',
      'contraction',
      'baire-category',
      'baire-1',
      'cantor',
      'fat-cantor',
      'cantor-function',
    ]);
    expect(idsOf('approximation')).toEqual(['arzela-ascoli', 'weierstrass-approx', 'stone-weierstrass', 'muntz-szasz']);
  });

  it('keeps the prerequisite chains across the split', () => {
    const byScene = new Map<string, (typeof catalog)[number]['scenes'][number]>();
    for (const chapter of catalog) for (const scene of chapter.scenes) byScene.set(scene.id, scene);
    expect(byScene.get('binomial')?.prerequisites).toEqual(['natural-numbers']);
    expect(byScene.get('integers-rationals')?.prerequisites).toEqual(['natural-numbers']);
    expect(byScene.get('weierstrass-approx')?.prerequisites).toEqual(['uniform']);
    expect(byScene.get('vector-spaces')?.prerequisites).toEqual(['groups-fields']);
    expect(byScene.get('dimension-rank')?.prerequisites).toEqual(['vector-spaces']);
    expect(byScene.get('epsdelta')?.prerequisites).toEqual(['epsilon-n']);
    expect(byScene.get('continuity')?.prerequisites).toEqual(['epsdelta']);
    expect(byScene.get('monotone-discontinuities')?.prerequisites).toEqual(['continuity']);
    expect(byScene.get('monotone-cauchy')?.prerequisites).toEqual(['bolzano-weierstrass']);
    expect(byScene.get('evt')?.prerequisites).toEqual(['ivt']);
    expect(byScene.get('compact')?.prerequisites).toEqual(['closure']);
    expect(byScene.get('contraction')?.prerequisites).toEqual(['metric-spaces', 'monotone-cauchy']);
    expect(byScene.get('uniform-continuity')?.prerequisites).toEqual(['continuity']);
    expect(byScene.get('opensets')?.prerequisites).toEqual(['continuity']);
    expect(byScene.get('closure')?.prerequisites).toEqual(['opensets']);
    expect(byScene.get('metric-spaces')?.prerequisites).toEqual(['closure']);
    expect(byScene.get('sequence-spaces')?.prerequisites).toEqual(['metric-spaces']);
    expect(byScene.get('construction')?.prerequisites).toEqual(['holes']);
  });
});
