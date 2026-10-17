import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  GRID_POINTS,
  lhopitalData,
  lhopitalModel,
  PAIR_LOG,
  PAIR_SIN,
  parsePair,
  POS_INIT,
  POS_MAX,
  POS_MIN,
  sliderX,
  xLogX,
  xLogXDerivRatio,
  type LHopitalData,
} from '../src/chapters/calculus/models/lhopital';
import { problems } from '../src/chapters/calculus/problems/lhopital';

const compute = (state: ControlState): LHopitalData => syncCompute(lhopitalModel, state);

describe('lhopital: sliderX maps pos to a log-uniform x', () => {
  it('sin pair: pos 0 is far (1.5), pos 100 is at the limit point (0.0015)', () => {
    expect(sliderX('sin', POS_MIN)).toBeCloseTo(1.5, 12);
    expect(sliderX('sin', POS_MAX)).toBeCloseTo(0.0015, 12);
  });

  it('log pair: pos 0 is far (10), pos 100 is at the limit point (1000)', () => {
    expect(sliderX('log', POS_MIN)).toBeCloseTo(10, 12);
    expect(sliderX('log', POS_MAX)).toBeCloseTo(1000, 12);
  });

  it('pos 60 gives the caption x values', () => {
    expect(sliderX('sin', 60)).toBeCloseTo(0.0238, 4);
    expect(sliderX('log', 60)).toBeCloseTo(158.5, 1);
  });

  it('sin is strictly decreasing in pos, log strictly increasing', () => {
    let prevSin = Infinity;
    let prevLog = -Infinity;
    for (let pos = 0; pos <= 100; pos += 5) {
      const xs = sliderX('sin', pos);
      const xl = sliderX('log', pos);
      expect(xs).toBeLessThan(prevSin);
      expect(xl).toBeGreaterThan(prevLog);
      prevSin = xs;
      prevLog = xl;
    }
  });

  it('clamps pos outside [0, 100]', () => {
    expect(sliderX('sin', -50)).toBe(sliderX('sin', POS_MIN));
    expect(sliderX('sin', 500)).toBe(sliderX('sin', POS_MAX));
  });
});

describe('lhopital: model.compute parses state', () => {
  it('defaults to the sin pair at pos 55 on empty/invalid state', () => {
    const d = compute({});
    expect(d.pair).toBe('sin');
    expect(d.pos).toBe(POS_INIT);
    expect(d.x).toBeCloseTo(sliderX('sin', POS_INIT), 12);
  });

  it('selects the log pair', () => {
    const d = compute({ pair: PAIR_LOG, pos: 60 });
    expect(d.pair).toBe('log');
    expect(d.pos).toBe(60);
    expect(d.x).toBeCloseTo(158.5, 1);
  });

  it('falls back to sin for unknown pair labels', () => {
    expect(parsePair('nope')).toBe('sin');
    expect(parsePair(PAIR_SIN)).toBe('sin');
    expect(parsePair(undefined)).toBe('sin');
  });

  it('clamps and floors pos', () => {
    expect(compute({ pair: PAIR_SIN, pos: 250 }).pos).toBe(POS_MAX);
    expect(compute({ pair: PAIR_SIN, pos: -3 }).pos).toBe(POS_MIN);
    expect(compute({ pair: PAIR_SIN, pos: 60.9 }).pos).toBe(60);
  });

  it('grid has 161 log-spaced points spanning the domain', () => {
    const d = compute({ pair: PAIR_SIN, pos: 60 });
    expect(d.xs.length).toBe(GRID_POINTS);
    expect(d.fVals.length).toBe(GRID_POINTS);
    expect(d.xs[0]).toBeCloseTo(0.0015, 12);
    expect(d.xs[GRID_POINTS - 1]).toBeCloseTo(1.5, 12);
    // Log-spaced: constant ratio between consecutive points.
    const r1 = (d.xs[1] ?? 0) / (d.xs[0] ?? 1);
    const r2 = (d.xs[2] ?? 0) / (d.xs[1] ?? 1);
    expect(r1).toBeCloseTo(r2, 12);
  });

  it('ratio curves are consistent with f/g and fp/gp on the grid', () => {
    for (const pair of [PAIR_SIN, PAIR_LOG] as const) {
      const d = compute({ pair, pos: 60 });
      for (let i = 0; i < GRID_POINTS; i += 17) {
        expect(d.ratioVals[i]).toBeCloseTo((d.fVals[i] ?? 0) / (d.gVals[i] ?? 1), 12);
      }
      expect(d.ratio).toBeCloseTo(d.f / d.g, 12);
      expect(d.derivRatio).toBeCloseTo(d.fp / d.gp, 12);
    }
  });
});

describe('lhopital: problem 1 numbers (sin x / x at pos 60)', () => {
  const d = lhopitalData('sin', 60);
  it('x ~= 0.0238', () => {
    expect(d.x).toBeCloseTo(0.0238, 4);
  });
  it('sin x / x ~= 0.9999', () => {
    expect(d.ratio).toBeCloseTo(0.9999, 4);
  });
  it("cos x ~= 0.9997 (the derivative ratio)", () => {
    expect(d.derivRatio).toBeCloseTo(0.9997, 4);
  });
  it('both ratios converge to 1 at the limit point', () => {
    const end = lhopitalData('sin', 100);
    expect(end.ratio).toBeCloseTo(1, 5);
    expect(end.derivRatio).toBeCloseTo(1, 5);
    expect(end.limit).toBe(1);
  });
});

describe('lhopital: problem 2 numbers (ln x / x at pos 60)', () => {
  const d = lhopitalData('log', 60);
  it('x ~= 158.5', () => {
    expect(d.x).toBeCloseTo(158.5, 1);
  });
  it('ln x ~= 5.0657', () => {
    expect(d.f).toBeCloseTo(5.0657, 4);
  });
  it('(ln x)/x ~= 0.0320', () => {
    expect(d.ratio).toBeCloseTo(0.032, 4);
  });
  it('1/x ~= 0.00631 (the derivative ratio)', () => {
    expect(d.derivRatio).toBeCloseTo(0.00631, 4);
  });
  it('both ratios converge to 0 at the limit point', () => {
    const end = lhopitalData('log', 100);
    expect(end.ratio).toBeCloseTo(0.00691, 5);
    expect(end.derivRatio).toBeCloseTo(0.001, 6);
    expect(end.limit).toBe(0);
  });
});

describe('lhopital: problem 3 numbers (x ln x rewritten)', () => {
  it('(ln x)/(1/x) has derivative ratio -x', () => {
    for (const x of [0.5, 0.1, 0.01, 0.001]) {
      // (ln x)'/(1/x)' = (1/x)/(-1/x^2) = -x, checked algebraically here.
      expect(xLogXDerivRatio(x)).toBe(-x);
    }
  });

  it('x = 0.01: x ln x ~= -0.0461 and -x = -0.01', () => {
    expect(xLogX(0.01)).toBeCloseTo(-0.0461, 4);
    expect(xLogXDerivRatio(0.01)).toBe(-0.01);
  });

  it('x ln x -> 0 as x -> 0+', () => {
    expect(xLogX(1e-6)).toBeCloseTo(0, 4);
    expect(xLogX(1e-3)).toBeLessThan(0);
  });
});

describe('lhopital: problems data is complete and captions match the model', () => {
  it('has the three required problems with bilingual text and full proofs', () => {
    expect(problems.length).toBe(3);
    for (const p of problems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.presetCaption.ko.length).toBeGreaterThan(0);
      expect(p.presetCaption.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      expect(p.display?.length).toBeGreaterThan(0);
    }
  });

  it('presets use the real control keys and valid values', () => {
    expect(problems[0]?.preset).toEqual({ pair: 'sin x / x', pos: 60 });
    expect(problems[1]?.preset).toEqual({ pair: 'ln x / x', pos: 60 });
    expect(problems[2]?.preset).toEqual({ pair: 'ln x / x', pos: 100 });
  });

  it('problem 1 caption numbers match the model', () => {
    const caption = problems[0]?.presetCaption.ko ?? '';
    expect(caption).toContain('0.0238');
    expect(caption).toContain('0.9999');
    expect(caption).toContain('0.9997');
  });

  it('problem 2 caption numbers match the model', () => {
    const caption = problems[1]?.presetCaption.ko ?? '';
    expect(caption).toContain('158.5');
    expect(caption).toContain('0.0320');
    expect(caption).toContain('0.00631');
  });

  it('problem 3 caption numbers match the model', () => {
    const caption = problems[2]?.presetCaption.ko ?? '';
    expect(caption).toContain('0.00691');
    expect(caption).toContain('0.001');
    expect(caption).toContain('-0.0461');
    expect(caption).toContain('-0.01');
  });
});
