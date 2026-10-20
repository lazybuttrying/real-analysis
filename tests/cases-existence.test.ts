import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  casesData,
  casesExistenceModel,
  casesPart,
  signCase,
  CASES_EXISTENCE_PART_OPTIONS,
  CASES_X_INIT,
  CASES_X_MAX,
  CASES_X_MIN,
  CASES_Y_INIT,
  CASES_Y_MAX,
  CASES_Y_MIN,
  SQRT2_POW,
  SQRT2_POW_IDENTITY,
  type CasesExistenceData,
} from '../src/chapters/limits/models/casesExistence';
import { casesExistenceProblems } from '../src/chapters/limits/problems/cases-existence';

const compute = (state: ControlState): CasesExistenceData =>
  syncCompute(casesExistenceModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['part', 'x', 'y']);

/** Every value the x/y sliders can take. */
const GRID: number[] = [];
for (let t = -5; t <= 5.001; t += 0.5) GRID.push(Math.round(t * 2) / 2);

describe('cases-existence: |xy| = |x||y| over the whole slider grid', () => {
  it('equal holds and |xy| - |x||y| is 0 to 1e-12 for every grid point', () => {
    for (const x of GRID) {
      for (const y of GRID) {
        const d = casesData(x, y);
        expect(d.equal, `(x,y)=(${x},${y})`).toBe(true);
        expectCloseTo(d.absXY, d.absXabsY, 1e-12);
        expectCloseTo(d.absXY, Math.abs(x * y), 1e-12);
      }
    }
  });

  it('the headline preset (x, y) = (-2, 3): |xy| = 6 = |x||y|', () => {
    const d = casesData(-2, 3);
    expect(d.caseId).toBe('neg-pos');
    expect(d.xy).toBe(-6);
    expect(d.absXY).toBe(6);
    expect(d.absXabsY).toBe(6);
    expect(d.equal).toBe(true);
  });
});

describe('cases-existence: signCase quadrant classification', () => {
  it('classifies each quadrant and the zero case', () => {
    expect(signCase(2, 3)).toBe('pos-pos');
    expect(signCase(2, -3)).toBe('pos-neg');
    expect(signCase(-2, 3)).toBe('neg-pos');
    expect(signCase(-2, -3)).toBe('neg-neg');
    expect(signCase(0, 3)).toBe('zero');
    expect(signCase(2, 0)).toBe('zero');
    expect(signCase(0, 0)).toBe('zero');
  });

  it('matches the model caseId over the grid', () => {
    for (const x of GRID) {
      for (const y of GRID) {
        const expected =
          x === 0 || y === 0 ? 'zero' : (`${x > 0 ? 'pos' : 'neg'}-${y > 0 ? 'pos' : 'neg'}` as const);
        expect(casesData(x, y).caseId, `(x,y)=(${x},${y})`).toBe(expected);
      }
    }
  });
});

describe('cases-existence: the non-constructive existence constants', () => {
  it('sqrt(2)^sqrt(2) ≈ 1.6325269194381528', () => {
    expectCloseTo(SQRT2_POW, 1.6325269194381528, 1e-12);
  });

  it('(sqrt(2)^sqrt(2))^sqrt(2) = 2 to 1e-12', () => {
    expectCloseTo(SQRT2_POW_IDENTITY, 2, 1e-12);
  });
});

describe('cases-existence: model compute and control handling', () => {
  it('the model compute agrees with casesData and carries the part', () => {
    const d = compute({ part: 'cases', x: -2, y: 3 });
    expect(d.part).toBe('cases');
    expect(d.caseId).toBe('neg-pos');
    expect(d.absXY).toBe(6);
    const e = compute({ part: 'existence', x: -2, y: 3 });
    expect(e.part).toBe('existence');
    expect(e.absXY).toBe(6);
  });

  it('unknown part values fall back to cases', () => {
    expect(casesPart('bogus')).toBe('cases');
    expect(casesPart(undefined)).toBe('cases');
    expect(casesPart('existence')).toBe('existence');
    expect(compute({ part: 'bogus', x: 0, y: 0 }).part).toBe('cases');
  });

  it('out-of-range inputs are clamped to the slider ranges', () => {
    const d = compute({ part: 'cases', x: 99, y: -99 });
    expect(d.x).toBe(CASES_X_MAX);
    expect(d.y).toBe(CASES_Y_MIN);
  });

  it('non-finite inputs fall back to the slider inits', () => {
    const d = compute({ part: 'cases', x: NaN, y: Infinity });
    expect(d.x).toBe(CASES_X_INIT);
    expect(d.y).toBe(CASES_Y_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(CASES_X_MIN).toBe(-5);
    expect(CASES_X_MAX).toBe(5);
    expect(CASES_X_INIT).toBe(-2);
    expect(CASES_Y_MIN).toBe(-5);
    expect(CASES_Y_MAX).toBe(5);
    expect(CASES_Y_INIT).toBe(3);
    expect([...CASES_EXISTENCE_PART_OPTIONS]).toEqual(['cases', 'existence']);
  });
});

describe('cases-existence: problem presets use only declared control keys', () => {
  it('every preset key is in {part, x, y} and every preset value is valid', () => {
    expect(casesExistenceProblems).toHaveLength(3);
    for (const problem of casesExistenceProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const part = String(problem.preset['part']);
      expect(CASES_EXISTENCE_PART_OPTIONS, `${problem.id}: part must be a declared option`).toContain(part);
      const x = Number(problem.preset['x']);
      const y = Number(problem.preset['y']);
      expect(x, `${problem.id}: x in range`).toBeGreaterThanOrEqual(CASES_X_MIN);
      expect(x, `${problem.id}: x in range`).toBeLessThanOrEqual(CASES_X_MAX);
      expect(y, `${problem.id}: y in range`).toBeGreaterThanOrEqual(CASES_Y_MIN);
      expect(y, `${problem.id}: y in range`).toBeLessThanOrEqual(CASES_Y_MAX);
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = casesExistenceProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
