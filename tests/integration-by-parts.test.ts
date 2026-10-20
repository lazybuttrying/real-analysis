import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  B_MAX,
  B_MIN,
  boundaryTerm,
  closedForm,
  DEFAULT_B,
  DEFAULT_PAIR,
  integrand,
  integrationByPartsData,
  integrationByPartsModel,
  simpson,
  subIntegrand,
  type IntegrationByPartsData,
} from '../src/chapters/calculus/models/integrationByParts';
import { integrationByPartsProblems } from '../src/chapters/calculus/problems/integration-by-parts';

const compute = (state: ControlState): IntegrationByPartsData =>
  syncCompute(integrationByPartsModel, state);

describe('integration-by-parts: Simpson sanity', () => {
  it('Simpson is exact for cubics: int_0^1 x^3 dx = 1/4', () => {
    expectCloseTo(simpson((x) => x * x * x, 0, 1, 100), 0.25, 1e-12);
  });

  it('Simpson handles a non-polynomial: int_0^1 e^x dx = e - 1', () => {
    expectCloseTo(simpson((x) => Math.exp(x), 0, 1, 2000), Math.E - 1, 1e-9);
  });
});

describe('integration-by-parts: the identity holds numerically', () => {
  it('x*e^x, b = 2: lhs = rhs = closed form 8.38905609893065 to 1e-9', () => {
    const data = integrationByPartsData('x·e^x', 2);
    expectCloseTo(data.lhs, 8.389056098930839, 1e-9);
    expectCloseTo(data.rhs, 8.389056098930617, 1e-9);
    expectCloseTo(data.closedForm, (2 - 1) * Math.exp(2) + 1, 1e-12);
    expectCloseTo(data.closedForm, 8.38905609893065, 1e-9);
    expect(data.maxErr).toBeLessThan(1e-9);
  });

  it('x*sin x, b = 2: lhs = rhs = sin b - b cos b to 1e-9', () => {
    const data = integrationByPartsData('x·sin x', 2);
    expectCloseTo(data.lhs, 1.7415910999199549, 1e-9);
    expectCloseTo(data.rhs, 1.7415910999199686, 1e-9);
    expectCloseTo(data.closedForm, Math.sin(2) - 2 * Math.cos(2), 1e-12);
    expectCloseTo(data.closedForm, 1.7415910999199666, 1e-9);
    expect(data.maxErr).toBeLessThan(1e-9);
  });

  it('boundary - sub = rhs, by construction, for both pairs', () => {
    for (const pair of ['x·e^x', 'x·sin x']) {
      const data = integrationByPartsData(pair, 2.5);
      expectCloseTo(data.rhs, data.boundary - data.sub, 1e-12);
      expect(data.maxErr).toBeLessThan(1e-9);
    }
  });

  it('identity holds across the slider range', () => {
    for (const pair of ['x·e^x', 'x·sin x']) {
      for (const b of [B_MIN, 1, 2, B_MAX]) {
        const data = integrationByPartsData(pair, b);
        expect(Math.abs(data.lhs - data.rhs)).toBeLessThan(1e-9);
        expect(Math.abs(data.lhs - data.closedForm)).toBeLessThan(1e-9);
      }
    }
  });
});

describe('integration-by-parts: the pieces', () => {
  it('boundary term: b e^b for x*e^x, -b cos b for x*sin x', () => {
    expectCloseTo(boundaryTerm('x·e^x', 2), 2 * Math.exp(2), 1e-15);
    expectCloseTo(boundaryTerm('x·sin x', 2), -2 * Math.cos(2), 1e-15);
  });

  it('closed forms match the textbook antiderivatives at sample points', () => {
    expectCloseTo(closedForm('x·e^x', 1), 1, 1e-12); // (1-1)e^1 + 1
    expectCloseTo(closedForm('x·sin x', Math.PI), Math.PI, 1e-12); // sin pi - pi cos pi
  });

  it('integrand and subIntegrand agree with u v prime and v u prime', () => {
    expectCloseTo(integrand('x·e^x', 2), 2 * Math.exp(2), 1e-15);
    expectCloseTo(subIntegrand('x·e^x', 2), Math.exp(2), 1e-15);
    expectCloseTo(integrand('x·sin x', 1), Math.sin(1), 1e-15);
    expectCloseTo(subIntegrand('x·sin x', 1), -Math.cos(1), 1e-15);
  });

  it('curve samples span [0, b] and match the integrand', () => {
    const data = integrationByPartsData('x·e^x', 2);
    expect(data.curve[0]?.x).toBe(0);
    expect(data.curve[data.curve.length - 1]?.x).toBe(2);
    for (const p of data.curve) {
      expectCloseTo(p.y, integrand('x·e^x', p.x), 1e-15);
    }
    for (const p of data.subCurve) {
      expectCloseTo(p.y, subIntegrand('x·e^x', p.x), 1e-15);
    }
  });
});

describe('integration-by-parts: model compute', () => {
  it('reads pair and b from the control state, clamps b', () => {
    const data = compute({ pair: 'x·sin x', b: 1.5 });
    expect(data.pair).toBe('x·sin x');
    expect(data.b).toBe(1.5);
    expect(compute({ pair: 'x·e^x', b: 500 }).b).toBe(B_MAX);
    expect(compute({ pair: 'x·e^x', b: -500 }).b).toBe(B_MIN);
    expect(compute({}).pair).toBe(DEFAULT_PAIR);
    expect(compute({}).b).toBe(DEFAULT_B);
    expect(compute({ pair: 'bogus', b: 2 }).pair).toBe(DEFAULT_PAIR);
  });

  it('exports the expected data keys', () => {
    const data = compute({ pair: 'x·e^x', b: 2 });
    for (const key of [
      'pair',
      'b',
      'lhs',
      'rhs',
      'boundary',
      'sub',
      'closedForm',
      'maxErr',
      'curve',
      'subCurve',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('integration-by-parts: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(integrationByPartsProblems);
  });

  it('the three ids are ibp-proof, ibp-xex, ibp-reduction with valid presets', () => {
    expect(integrationByPartsProblems.map((p) => p.id)).toEqual([
      'ibp-proof',
      'ibp-xex',
      'ibp-reduction',
    ]);
    for (const p of integrationByPartsProblems) {
      expect(['x·e^x', 'x·sin x']).toContain(p.preset['pair']);
      const b = Number(p.preset['b']);
      expect(b).toBeGreaterThanOrEqual(B_MIN);
      expect(b).toBeLessThanOrEqual(B_MAX);
    }
  });
});
