import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  baireData,
  baireModel,
  baireStep,
  DEFAULT_STAGE,
  MAX_STAGE,
  MIN_STAGE,
  rationalEnumeration,
  type BaireData,
} from '../src/chapters/limits/models/baireCategory';
import { baireCategoryProblems } from '../src/chapters/limits/problems/baire-category';

const compute = (state: ControlState): BaireData => syncCompute(baireModel, state);

describe('baire-category: rational enumeration in lowest-terms denominator order', () => {
  it('q_1..q_8 match the documented order', () => {
    const qs = rationalEnumeration(8);
    const pairs = qs.map((t) => [t.num, t.den]);
    expect(pairs).toEqual([
      [0, 1],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
    ]);
  });

  it('q_14 = 1/7 and every rational appears exactly once, in lowest terms', () => {
    const qs = rationalEnumeration(14);
    expect(qs[13]).toEqual({ num: 1, den: 7, value: 1 / 7 });
    const seen = new Set(qs.map((t) => t.value));
    expect(seen.size).toBe(14);
    for (const t of qs) {
      expect(Math.abs(t.value - t.num / t.den)).toBeLessThan(1e-15);
      // lowest terms: no smaller denominator represents the same value
      for (let d = 1; d < t.den; d++) {
        expect(Math.abs(t.value * d - Math.round(t.value * d))).toBeGreaterThan(1e-12);
      }
    }
  });
});

describe('baire-category: the quartering step', () => {
  it('q = 0 in [0,1] takes the right quarter [0.75, 1]', () => {
    expect(baireStep(0, 1, 0)).toEqual({ a: 0.75, b: 1, hit: true });
  });

  it('q = 1 in [0.75,1] takes the left quarter [0.75, 0.8125]', () => {
    expect(baireStep(0.75, 1, 1)).toEqual({ a: 0.75, b: 0.8125, hit: true });
  });

  it('a rational outside the interval keeps it unchanged', () => {
    expect(baireStep(0.75, 0.8125, 0.5)).toEqual({ a: 0.75, b: 0.8125, hit: false });
    expect(baireStep(0.75, 0.8125, 0.9)).toEqual({ a: 0.75, b: 0.8125, hit: false });
  });

  it('after a hit q is outside the new interval and the length is quartered', () => {
    for (const [a, b, q] of [
      [0, 1, 0],
      [0, 1, 0.5],
      [0.75, 1, 1],
      [0.75, 0.8125, 0.75],
      [0.796875, 0.8125, 0.8],
    ] as const) {
      const next = baireStep(a, b, q);
      expect(next.hit).toBe(true);
      expect(q < next.a || q > next.b).toBe(true);
      expectCloseTo(next.b - next.a, (b - a) / 4, 1e-15);
      expect(next.a).toBeGreaterThanOrEqual(a);
      expect(next.b).toBeLessThanOrEqual(b);
    }
  });
});

describe('baire-category: documented stage identities', () => {
  it('stage 6: hits at k = 1, 2; I_6 = [0.75, 0.8125]; survivor 0.78125', () => {
    const data = compute({ stage: 6 });
    expect(data.stages.length).toBe(6);
    expect(data.stages.filter((s) => s.hit).map((s) => s.k)).toEqual([1, 2]);
    expect(data.finalA).toBe(0.75);
    expect(data.finalB).toBe(0.8125);
    expect(data.survivor).toBe(0.78125);
  });

  it('stage 7: extra hit at k = 7 (q_7 = 3/4); I_7 = [0.796875, 0.8125]', () => {
    const data = compute({ stage: 7 });
    expect(data.stages.filter((s) => s.hit).map((s) => s.k)).toEqual([1, 2, 7]);
    expect(data.stages[6]?.q).toBe(3 / 4);
    expect(data.finalA).toBe(0.796875);
    expect(data.finalB).toBe(0.8125);
    expect(data.survivor).toBe(0.8046875);
  });

  it('stage 14: hits at k = 1, 2, 7, 11; I_14 = [0.80859375, 0.8125]; survivor 0.810546875', () => {
    const data = compute({ stage: 14 });
    expect(data.stages.filter((s) => s.hit).map((s) => s.k)).toEqual([1, 2, 7, 11]);
    expect(data.finalA).toBe(0.80859375);
    expect(data.finalB).toBe(0.8125);
    expectCloseTo(data.finalB - data.finalA, 1 / 256, 1e-15);
    expect(data.survivor).toBe(0.810546875);
  });
});

describe('baire-category: structural invariants for every stage 1..14', () => {
  for (let n = MIN_STAGE; n <= MAX_STAGE; n++) {
    it(`stage ${n}: nesting, dodging, quartering, and survivor inside`, () => {
      const data = compute({ stage: n });
      expect(data.stages.length).toBe(n);
      let hits = 0;
      data.stages.forEach((s, i) => {
        // interval nests inside the previous one
        const prev = i === 0 ? { a: 0, b: 1 } : (data.stages[i - 1] as { a: number; b: number });
        expect(s.a).toBeGreaterThanOrEqual(prev.a);
        expect(s.b).toBeLessThanOrEqual(prev.b);
        // q_k is dodged: never inside I_k
        expect(s.q < s.a || s.q > s.b).toBe(true);
        if (s.hit) {
          hits++;
          expectCloseTo(s.b - s.a, (prev.b - prev.a) / 4, 1e-14);
        } else {
          expect(s.a).toBe(prev.a);
          expect(s.b).toBe(prev.b);
        }
      });
      // length = 4^{-hits}
      expectCloseTo(data.finalB - data.finalA, Math.pow(0.25, hits), 1e-14);
      // survivor is the midpoint of the final interval, dodging every q_k
      expect(data.survivor).toBe((data.finalA + data.finalB) / 2);
      for (const s of data.stages) {
        expect(data.survivor).not.toBe(s.q);
      }
    });
  }
});

describe('baire-category: model compute clamps the stage', () => {
  it('clamps below 1 and above 14, defaults on garbage', () => {
    expect(compute({ stage: 0 }).stage).toBe(MIN_STAGE);
    expect(compute({ stage: 99 }).stage).toBe(MAX_STAGE);
    expect(compute({ stage: 6.7 }).stage).toBe(6);
    expect(compute({}).stage).toBe(DEFAULT_STAGE);
    expect(compute({ stage: 'x' }).stage).toBe(DEFAULT_STAGE);
  });

  it('baireData agrees with the model', () => {
    const viaModel = compute({ stage: 10 });
    const direct = baireData(10);
    expect(viaModel).toEqual(direct);
    expect(direct.finalA).toBe(0.796875);
    expect(direct.survivor).toBe(0.8046875);
  });
});

describe('baire-category: problems metadata', () => {
  it('has exactly 3 problems with unique ids', () => {
    expect(baireCategoryProblems.length).toBe(3);
    const ids = baireCategoryProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).toEqual(['baire-proof', 'irrationals', 'typical-nondiff']);
  });

  it('every preset is valid for the scene controls (stage in [1, 14])', () => {
    for (const p of baireCategoryProblems) {
      const stage = Number(p.preset['stage']);
      expect(Number.isInteger(stage)).toBe(true);
      expect(stage).toBeGreaterThanOrEqual(MIN_STAGE);
      expect(stage).toBeLessThanOrEqual(MAX_STAGE);
      expect(Object.keys(p.preset)).toEqual(['stage']);
    }
  });

  it('preset captions match the model output', () => {
    const d6 = compute({ stage: 6 });
    expect(d6.finalA).toBe(0.75);
    expect(d6.survivor).toBe(0.78125);
    const d14 = compute({ stage: 14 });
    expect(d14.finalB - d14.finalA).toBeCloseTo(1 / 256, 15);
    expect(d14.survivor).toBe(0.810546875);
    const d10 = compute({ stage: 10 });
    expect(d10.finalA).toBe(0.796875);
    expect(d10.survivor).toBe(0.8046875);
  });

  it('the typical-nondiff problem is explicitly marked as a sketch', () => {
    const sketch = baireCategoryProblems.find((p) => p.id === 'typical-nondiff');
    expect(sketch).toBeDefined();
    const allText = [
      sketch?.statement.ko,
      sketch?.statement.en,
      ...(sketch?.proof.flatMap((s) => [s.text.ko, s.text.en]) ?? []),
    ].join(' ');
    expect(allText.toLowerCase()).toContain('sketch');
  });
});
