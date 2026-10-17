import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  clampLevel,
  clampZoom,
  darbouxF,
  darbouxFp,
  darbouxModel,
  diffQuot,
  gridPoints,
  halfWidth,
  LEVEL_INIT,
  LEVEL_MAX,
  LEVEL_MIN,
  parseShowF,
  SHOWF_INIT,
  ZOOM_INIT,
  ZOOM_MAX,
  ZOOM_MIN,
  type DarbouxData,
} from '../src/chapters/calculus/models/darboux';
import { problems } from '../src/chapters/calculus/problems/darboux';

const compute = (state: ControlState): DarbouxData => syncCompute(darbouxModel, state);

describe('darboux: the witness function f(x) = x^2 sin(1/x), f(0) = 0', () => {
  it('f(0) = 0', () => {
    expect(darbouxF(0)).toBe(0);
  });

  it("f'(0) = 0 by the definition (the difference quotient h sin(1/h) -> 0)", () => {
    expect(darbouxFp(0)).toBe(0);
    // |h sin(1/h)| <= |h|: squeeze values used in the proof.
    expect(diffQuot(0.01)).toBeCloseTo(-0.00506, 5);
    expect(diffQuot(1e-6)).toBeCloseTo(-3.4999e-7, 10);
    for (const h of [0.1, 0.01, 1e-3, 1e-6]) {
      expect(Math.abs(diffQuot(h))).toBeLessThanOrEqual(Math.abs(h));
    }
  });

  it("f'(1/(2pi)) = 2(1/2pi) sin(2pi) - cos(2pi) = -1", () => {
    expect(darbouxFp(1 / (2 * Math.PI))).toBe(-1);
  });

  it("f'(1/pi) = 2(1/pi) sin(pi) - cos(pi) = 1", () => {
    expect(darbouxFp(1 / Math.PI)).toBe(1);
  });

  it('the -cos(1/x) term forces lim f\'(x) not to exist: sequences to -1 and 1', () => {
    for (const k of [5, 10, 20]) {
      const a = 1 / (2 * k * Math.PI);
      const b = 1 / ((2 * k + 1) * Math.PI);
      expect(a).toBeLessThan(0.1);
      expect(b).toBeLessThan(0.1);
      expect(darbouxFp(a)).toBeCloseTo(-1, 6);
      expect(darbouxFp(b)).toBeCloseTo(1, 6);
    }
  });

  it('f is squeezed by the +-x^2 envelope', () => {
    for (let i = 0; i <= 40; i++) {
      const x = -0.5 + i * 0.025;
      expect(Math.abs(darbouxF(x))).toBeLessThanOrEqual(x * x + 1e-15);
    }
  });
});

describe('darboux: IVP sampling — f\' spans [-1, 1] between x = 1/(2pi) and x = 1/pi', () => {
  it('min/max of f\' on a fine grid cover the whole interval [-1, 1]', () => {
    const lo = 1 / (2 * Math.PI);
    const hi = 1 / Math.PI;
    const n = 20001;
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < n; i++) {
      const x = lo + ((hi - lo) * i) / (n - 1);
      const v = darbouxFp(x);
      if (v < min) min = v;
      if (v > max) max = v;
    }
    // The grid endpoints hit f' = -1 and f' = 1 exactly; a fine grid in
    // between attains everything across.
    // The grid endpoints hit f' = -1 (x = 1/(2pi)) and f' = 1 (x = 1/pi)
    // exactly, so the sampled range covers [-1, 1]; the 2x sin(1/x) term
    // pushes the extremes slightly beyond.
    expect(min).toBeLessThanOrEqual(-1);
    expect(max).toBeGreaterThanOrEqual(1);
  });
});

describe('darboux: zoom and level parsing', () => {
  it('halfWidth is 0.5 at zoom 0 and 5e-4 at zoom 100 (log zoom)', () => {
    expect(halfWidth(ZOOM_MIN)).toBeCloseTo(0.5, 12);
    expect(halfWidth(ZOOM_MAX)).toBeCloseTo(5e-4, 12);
    expect(halfWidth(70)).toBeCloseTo(0.00397, 5);
  });

  it('zoom decreases strictly: equal slider travel, equal relative zoom-in', () => {
    let prev = Infinity;
    for (let z = 0; z <= 100; z += 10) {
      const h = halfWidth(z);
      expect(h).toBeLessThan(prev);
      prev = h;
    }
  });

  it('grid resolution grows with zoom', () => {
    expect(gridPoints(0)).toBe(801);
    expect(gridPoints(100)).toBe(2801);
    expect(gridPoints(70)).toBe(2201);
  });

  it('clamps and floors zoom, clamps level, parses showF', () => {
    expect(clampZoom(-5)).toBe(ZOOM_MIN);
    expect(clampZoom(500)).toBe(ZOOM_MAX);
    expect(clampZoom(70.9)).toBe(70);
    expect(clampZoom(NaN)).toBe(ZOOM_INIT);
    expect(clampLevel(-5)).toBe(LEVEL_MIN);
    expect(clampLevel(5)).toBe(LEVEL_MAX);
    expect(clampLevel(NaN)).toBe(LEVEL_INIT);
    expect(parseShowF(undefined)).toBe(SHOWF_INIT);
    expect(parseShowF(true)).toBe(true);
    expect(parseShowF(false)).toBe(false);
  });
});

describe('darboux: model.compute parses state', () => {
  it('defaults to zoom 40, level 0.4, showF true on empty state', () => {
    const d = compute({});
    expect(d.zoom).toBe(ZOOM_INIT);
    expect(d.level).toBe(LEVEL_INIT);
    expect(d.showF).toBe(true);
    expect(d.halfWidth).toBeCloseTo(halfWidth(ZOOM_INIT), 12);
  });

  it('reads the real control keys', () => {
    const d = compute({ zoom: 70, level: 0.4, showF: false });
    expect(d.zoom).toBe(70);
    expect(d.level).toBe(0.4);
    expect(d.showF).toBe(false);
  });

  it('grid spans [-h, h] with consistent f, f\' and envelope values', () => {
    const d = compute({ zoom: 70, level: 0.4, showF: true });
    const n = d.xs.length;
    expect(n).toBe(gridPoints(70));
    expect(d.xs[0]).toBeCloseTo(-d.halfWidth, 12);
    expect(d.xs[n - 1]).toBeCloseTo(d.halfWidth, 12);
    for (let i = 0; i < n; i += 137) {
      const x = d.xs[i] ?? 0;
      expect(d.fVals[i]).toBeCloseTo(darbouxF(x), 15);
      expect(d.fpVals[i]).toBeCloseTo(darbouxFp(x), 15);
      expect(d.envPos[i]).toBeCloseTo(x * x, 15);
      expect(d.envNeg[i]).toBeCloseTo(-x * x, 15);
    }
  });

  it('crossings are actual sign changes of f\' - level', () => {
    const d = compute({ zoom: 70, level: 0.4, showF: true });
    expect(d.crossings.length).toBeGreaterThan(100);
    // Every reported crossing sits between two grid points straddling the level.
    for (const cx of d.crossings.slice(0, 50)) {
      let i = 0;
      while (i < d.xs.length - 1 && (d.xs[i + 1] ?? 0) < cx) i++;
      const a = (d.fpVals[i] ?? 0) - d.level;
      const b = (d.fpVals[i + 1] ?? 0) - d.level;
      expect(a * b).toBeLessThanOrEqual(0);
    }
  });

  it('preset crossing counts are deterministic', () => {
    expect(compute({ zoom: 70, level: 0.4, showF: true }).crossings.length).toBe(704);
    expect(compute({ zoom: 100, level: 0, showF: true }).crossings.length).toBe(1579);
    expect(compute({ zoom: 0, level: 0.5, showF: true }).crossings.length).toBe(46);
  });
});

describe('darboux: problems data is complete and captions match the model', () => {
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
    expect(problems[0]?.preset).toEqual({ zoom: 70, level: 0.4, showF: true });
    expect(problems[1]?.preset).toEqual({ zoom: 100, level: 0, showF: true });
    expect(problems[2]?.preset).toEqual({ zoom: 0, level: 0.5, showF: true });
    for (const p of problems) {
      const zoom = Number(p.preset['zoom']);
      const level = Number(p.preset['level']);
      expect(zoom).toBeGreaterThanOrEqual(ZOOM_MIN);
      expect(zoom).toBeLessThanOrEqual(ZOOM_MAX);
      expect(level).toBeGreaterThanOrEqual(LEVEL_MIN);
      expect(level).toBeLessThanOrEqual(LEVEL_MAX);
      expect(typeof p.preset['showF']).toBe('boolean');
    }
  });

  it('problem ids are the darboux-* ids', () => {
    expect(problems.map((p) => p.id)).toEqual([
      'darboux-theorem-proof',
      'darboux-discontinuous-derivative',
      'darboux-no-heaviside-derivative',
    ]);
  });

  it('caption numbers match the model', () => {
    const [p1, p2, p3] = problems;
    expect(p1?.presetCaption.ko).toContain('0.004');
    expect(p1?.presetCaption.ko).toContain('704');
    expect(p2?.presetCaption.ko).toContain('0.0005');
    expect(p2?.presetCaption.ko).toContain('1579');
    expect(p3?.presetCaption.ko).toContain('0.5');
    expect(p3?.presetCaption.ko).toContain('46');
    // en captions carry the same numbers.
    expect(p1?.presetCaption.en).toContain('704');
    expect(p2?.presetCaption.en).toContain('1579');
    expect(p3?.presetCaption.en).toContain('46');
  });
});
