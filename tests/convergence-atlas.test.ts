import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  ATLAS_CARDS,
  convergenceAtlasData,
  convergenceAtlasModel,
  type ConvergenceAtlasData,
} from '../src/chapters/series/models/convergenceAtlas';
import { convergenceAtlasProblems } from '../src/chapters/series/problems/convergence-atlas';

const compute = (state: ControlState): ConvergenceAtlasData => syncCompute(convergenceAtlasModel, state);

describe('convergence atlas: the nine cards', () => {
  it('has exactly 9 cards, 6 converging and 3 diverging', () => {
    expect(ATLAS_CARDS).toHaveLength(9);
    expect(ATLAS_CARDS.filter((c) => c.converges)).toHaveLength(6);
    expect(ATLAS_CARDS.filter((c) => !c.converges)).toHaveLength(3);
    expect(new Set(ATLAS_CARDS.map((c) => c.id)).size).toBe(9);
  });

  it('converging cards approach their stated limits at n = 200', () => {
    const data = convergenceAtlasData(200, 'all');
    for (const card of data.cards) {
      if (card.def.limit === null) continue;
      // The alternating harmonic card converges only like 1/n, so allow 0.01 there.
      const tol = card.def.id === 'leibniz' ? 0.01 : 0.005;
      expect(Math.abs(card.last - card.def.limit), card.def.id).toBeLessThan(tol);
    }
  });

  it('harmonic partial sums pass 5 by n = 200 and keep growing', () => {
    const data = convergenceAtlasData(200, 'all');
    const harmonic = data.cards.find((c) => c.def.id === 'harmonic');
    expect(harmonic?.last).toBeGreaterThan(5);
    const shorter = convergenceAtlasData(50, 'all');
    expect(shorter.cards.find((c) => c.def.id === 'harmonic')?.last).toBeLessThan(harmonic?.last ?? 0);
  });

  it('grandi partial sums only ever hit 0 or 1', () => {
    const data = convergenceAtlasData(37, 'all');
    const grandi = data.cards.find((c) => c.def.id === 'grandi');
    for (const s of grandi?.partialSums ?? []) expect(s === 0 || s === 1).toBe(true);
  });

  it('telescoping partial sum at n is exactly n/(n+1)', () => {
    const data = convergenceAtlasData(40, 'all');
    expectCloseTo(data.cards.find((c) => c.def.id === 'telescoping')?.last ?? 0, 40 / 41, 1e-12);
  });

  it('absolute and harmonic cards are the same sums with opposite verdicts to leibniz', () => {
    const data = convergenceAtlasData(60, 'all');
    const abs = data.cards.find((c) => c.def.id === 'absolute');
    const harm = data.cards.find((c) => c.def.id === 'harmonic');
    expectCloseTo(abs?.last ?? 0, harm?.last ?? 1, 1e-12);
    expect(abs?.def.converges).toBe(false);
  });
});

describe('convergence atlas: controls', () => {
  it('focus selects one card and unknown focus falls back to all', () => {
    expect(compute({ n: 40, focus: 'basel' }).focused?.def.id).toBe('basel');
    const all = compute({ n: 40, focus: 'nope' });
    expect(all.focus).toBe('all');
    expect(all.focused).toBeNull();
  });

  it('n clamps into [5, 200]', () => {
    expect(compute({ n: 1, focus: 'all' }).n).toBe(5);
    expect(compute({ n: 9999, focus: 'all' }).n).toBe(200);
  });
});

describe('convergence atlas: problems', () => {
  it('has exactly 3 well-formed problems', () => {
    checkProblemsShape(convergenceAtlasProblems);
  });
});
