import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_EXAMPLE,
  DEFAULT_N,
  MAX_N,
  MIN_N,
  raabeData,
  raabeFormulaCentral,
  raabeModel,
  type RaabeData,
} from '../src/chapters/series/models/raabeTest';

const compute = (state: ControlState): RaabeData => syncCompute(raabeModel, state);

describe('raabe: central R_k matches the closed form k(6k+5)/(4k^2+4k+1)', () => {
  it('R_1 = 11/9 and R_10 = 650/441 exactly (recurrence vs formula vs exact fraction)', () => {
    const data = raabeData('central', 10);
    expect(data.raabe[0]).toBeCloseTo(11 / 9, 13);
    expect(data.raabe[9]).toBeCloseTo(650 / 441, 13);
    expect(raabeFormulaCentral(1)).toBeCloseTo(11 / 9, 15);
    expect(raabeFormulaCentral(10)).toBeCloseTo(650 / 441, 15);
  });

  it('numeric recurrence agrees with the closed form for k = 1..200', () => {
    const data = raabeData('central', 200);
    for (let k = 1; k <= 200; k++) {
      expect(data.raabe[k - 1]).toBeCloseTo(raabeFormulaCentral(k), 12);
    }
  });

  it('R_k -> 3/2: |R_1000 - 1.5| < 0.01', () => {
    const data = raabeData('central', 1000);
    expectCloseTo((data.raabe[999] ?? 0), 1.5, 0.01);
    expect(data.limit).toBe(1.5);
  });
});

describe('raabe: ordinary ratios hover near 1 (ratio test inconclusive)', () => {
  it('r_k -> 1: |ratio_1000 - 1| < 0.01, and r_1 = 9/20', () => {
    const data = raabeData('central', 1000);
    expectCloseTo((data.ratios[999] ?? 0), 1, 0.01);
    expect(data.ratios[0]).toBeCloseTo(9 / 20, 15);
  });

  it('ratios increase toward 1 (monotone on the computed range)', () => {
    const data = raabeData('central', 100);
    for (let i = 1; i < data.ratios.length; i++) {
      expect(data.ratios[i]).toBeGreaterThan(data.ratios[i - 1] ?? 0);
    }
  });
});

describe('raabe: log example converges to the boundary 1 for both p', () => {
  it('|R_500 - 1| < 0.4 for p = 2 (numerically R_500 ~ 1.3222)', () => {
    const data = raabeData('log', 500);
    expectCloseTo((data.raabe[499] ?? 0), 1, 0.4);
    expect(data.limit).toBe(1);
  });

  it('|R_500 - 1| < 0.2 for p = 1 (numerically R_500 ~ 1.1611)', () => {
    const data = raabeData('log', 500);
    expect(data.raabeP1).not.toBeNull();
    expectCloseTo(((data.raabeP1 ?? [])[499] ?? 0), 1, 0.2);
  });

  it('the log k range starts at k = 2 (ln 1 = 0 is excluded)', () => {
    const data = raabeData('log', 10);
    expect(data.kStart).toBe(2);
    expect(data.raabe.length).toBe(10);
    expect(data.raabeP1?.length).toBe(10);
  });

  it('the two p curves sit on opposite sides of their shared limit early on', () => {
    const data = raabeData('log', 200);
    expect(data.raabe[0]).toBeGreaterThan(1);
    expect(data.raabeP1?.[0]).toBeGreaterThan(1);
    expect(data.raabe[199]).toBeGreaterThan(data.raabeP1?.[199] ?? 0);
  });
});

describe('raabe: model.compute reads and clamps the controls', () => {
  it('returns n points per array for both examples', () => {
    const central = compute({ example: 'central', n: 100 });
    expect(central.kStart).toBe(1);
    expect(central.n).toBe(100);
    expect(central.raabe.length).toBe(100);
    expect(central.ratios.length).toBe(100);
    expect(central.raabeP1).toBeNull();
    const log = compute({ example: 'log', n: 100 });
    expect(log.raabe.length).toBe(100);
    expect(log.ratios.length).toBe(100);
    expect(log.raabeP1?.length).toBe(100);
  });

  it('clamps n below 10 to 10 and above 500 to 500', () => {
    expect(compute({ example: 'central', n: -3 }).n).toBe(MIN_N);
    expect(compute({ example: 'central', n: 3 }).n).toBe(MIN_N);
    expect(compute({ example: 'central', n: 10000 }).n).toBe(MAX_N);
    expect(compute({ example: 'central', n: 10000 }).raabe.length).toBe(MAX_N);
  });

  it('defaults to example central and n 100 on missing/invalid input', () => {
    expect(compute({}).example).toBe(DEFAULT_EXAMPLE);
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ example: 'bogus', n: NaN }).example).toBe(DEFAULT_EXAMPLE);
    expect(compute({ example: 'bogus', n: NaN }).n).toBe(DEFAULT_N);
    expect(compute({ example: 'log', n: 50 }).example).toBe('log');
  });
});
