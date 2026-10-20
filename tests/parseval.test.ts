import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  parsevalA0,
  parsevalCoeff,
  parsevalData,
  parsevalExactNorm2,
  parsevalModel,
  parsevalNumericNorm2,
  PARSEVAL_MODES,
  PARSEVAL_MODE_INIT,
  PARSEVAL_N_INIT,
  PARSEVAL_N_MAX,
  PARSEVAL_N_MIN,
  type ParsevalData,
  type ParsevalMode,
} from '../src/chapters/series/models/parseval';
import { parsevalProblems } from '../src/chapters/series/problems/parseval';

const compute = (state: ControlState): ParsevalData => syncCompute(parsevalModel, state);

describe('parseval: closed-form coefficients', () => {
  it('square wave: b_n = 4/(pi n) for odd n, 0 for even n', () => {
    expectCloseTo(parsevalCoeff('square', 1).b, 4 / Math.PI, 1e-15);
    expectCloseTo(parsevalCoeff('square', 3).b, 4 / (3 * Math.PI), 1e-15);
    expect(parsevalCoeff('square', 2).b).toBe(0);
    expect(parsevalCoeff('square', 40).b).toBe(0);
    expect(parsevalCoeff('square', 5).a).toBe(0);
  });

  it('sawtooth: b_n = 2(-1)^{n+1}/n', () => {
    expectCloseTo(parsevalCoeff('sawtooth', 1).b, 2, 1e-15);
    expectCloseTo(parsevalCoeff('sawtooth', 2).b, -1, 1e-15);
    expectCloseTo(parsevalCoeff('sawtooth', 3).b, 2 / 3, 1e-15);
    expect(parsevalCoeff('sawtooth', 4).a).toBe(0);
  });

  it('parabola: a_0 = 2 pi^2/3, a_n = 4(-1)^n/n^2', () => {
    expectCloseTo(parsevalA0('parabola'), (2 * Math.PI * Math.PI) / 3, 1e-15);
    expect(parsevalA0('square')).toBe(0);
    expect(parsevalA0('sawtooth')).toBe(0);
    expectCloseTo(parsevalCoeff('parabola', 1).a, -4, 1e-15);
    expectCloseTo(parsevalCoeff('parabola', 2).a, 1, 1e-15);
    expect(parsevalCoeff('parabola', 7).b).toBe(0);
  });
});

describe('parseval: the L^2 norm', () => {
  it('exact norms are 2, 2 pi^2/3, 2 pi^4/5', () => {
    expect(parsevalExactNorm2('square')).toBe(2);
    expectCloseTo(parsevalExactNorm2('sawtooth'), (2 * Math.PI * Math.PI) / 3, 1e-12);
    expectCloseTo(parsevalExactNorm2('parabola'), (2 * Math.pow(Math.PI, 4)) / 5, 1e-9);
  });

  it('quadrature agrees with the exact norm', () => {
    for (const mode of PARSEVAL_MODES as readonly ParsevalMode[]) {
      expectCloseTo(parsevalNumericNorm2(mode), parsevalExactNorm2(mode), 1e-3);
    }
  });
});

describe('parseval: partial energies rise to the norm', () => {
  it('S_N is non-decreasing and never exceeds the norm (Bessel)', () => {
    for (const mode of PARSEVAL_MODES as readonly ParsevalMode[]) {
      const data = parsevalData(mode, PARSEVAL_N_MAX);
      for (let i = 1; i < data.terms.length; i++) {
        // Even-n terms are exactly 0 for the square wave, so S_N can plateau.
        expect(data.terms[i]!.partial).toBeGreaterThanOrEqual(data.terms[i - 1]!.partial);
      }
      expect(data.captured).toBeLessThanOrEqual(data.norm2 + 1e-9);
      expect(data.fraction).toBeLessThanOrEqual(1 + 1e-9);
      expect(data.fraction).toBeGreaterThan(0);
    }
  });

  it('square wave S_N reaches ~99% of 2 at N = 40', () => {
    const data = parsevalData('square', 40);
    expectCloseTo(data.captured, 1.9797, 1e-3);
    expect(data.fraction).toBeGreaterThan(0.985);
  });

  it('sawtooth S_20 is below 2 pi^2/3 (the problem-2 preset)', () => {
    const data = parsevalData('sawtooth', 20);
    expectCloseTo(data.captured, 6.3847, 1e-3);
    expect(data.captured).toBeLessThan(data.norm2);
  });

  it('parabola converges fast: fraction > 0.9999 at N = 12', () => {
    const data = parsevalData('parabola', 12);
    expect(data.fraction).toBeGreaterThan(0.9999);
  });

  it('partial equals a_0^2/2 + sum of energies', () => {
    const data = parsevalData('parabola', 9);
    let acc = (data.a0 * data.a0) / 2;
    for (const t of data.terms) {
      acc += t.energy;
      expectCloseTo(t.partial, acc, 1e-12);
    }
    expectCloseTo(data.captured, acc, 1e-12);
  });
});

describe('parseval: model compute', () => {
  it('reads mode and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).mode).toBe(PARSEVAL_MODE_INIT);
    expect(compute({}).nMax).toBe(PARSEVAL_N_INIT);
    expect(compute({ mode: 'nope' }).mode).toBe(PARSEVAL_MODE_INIT);
    expect(compute({ mode: 'parabola' }).mode).toBe('parabola');
    expect(compute({ n: 100 }).nMax).toBe(PARSEVAL_N_MAX);
    expect(compute({ n: -3 }).nMax).toBe(PARSEVAL_N_MIN);
    expect(compute({ n: 2.4 }).nMax).toBe(2);
  });

  it('terms has one entry per n = 1..nMax with cumulative partials', () => {
    const data = compute({ mode: 'square', n: 6 });
    expect(data.terms).toHaveLength(6);
    expect(data.terms.map((t) => t.n)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('exports the expected data keys', () => {
    const data = compute({ mode: 'square', n: 6 });
    for (const key of ['mode', 'nMax', 'a0', 'terms', 'captured', 'norm2', 'fraction'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('parseval: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(parsevalProblems);
  });

  it('the three ids are parseval-square, parseval-bessel, parseval-l2-convergence', () => {
    expect(parsevalProblems.map((p) => p.id)).toEqual([
      'parseval-square',
      'parseval-bessel',
      'parseval-l2-convergence',
    ]);
  });

  it('presets use valid modes and n in range', () => {
    for (const p of parsevalProblems) {
      expect(PARSEVAL_MODES as readonly string[]).toContain(String(p.preset['mode']));
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(PARSEVAL_N_MIN);
      expect(n).toBeLessThanOrEqual(PARSEVAL_N_MAX);
    }
  });
});
