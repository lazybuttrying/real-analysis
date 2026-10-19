import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  topologistSineModel,
  TS_N_PTS,
  TS_SHOW_SEGMENT_INIT,
  TS_SHOW_SEQ_INIT,
  TS_XMAX,
  TS_XMIN_INIT,
  TS_XMIN_MAX,
  TS_XMIN_MIN,
  type TopologistSineData,
} from '../src/chapters/limits/models/topologistSine';
import { topologistSineProblems } from '../src/chapters/limits/problems/topologist-sine';

const compute = (state: ControlState): TopologistSineData => syncCompute(topologistSineModel, state);

describe('topologist-sine: the model values', () => {
  it('samples sin(1/x) on [xMin, 2], x ascending, |y| <= 1', () => {
    const data = compute({ xMin: 0.05, showSegment: true, showSeq: true });
    expect(data.pts).toHaveLength(TS_N_PTS + 1);
    expectCloseTo(data.pts[0]![0], 0.05, 1e-12);
    expect(data.pts[data.pts.length - 1]![0]).toBe(TS_XMAX);
    for (let i = 1; i < data.pts.length; i++) {
      expect(data.pts[i]![0]).toBeGreaterThan(data.pts[i - 1]![0]);
    }
    for (const p of data.pts) {
      expect(Math.abs(p[1])).toBeLessThanOrEqual(1 + 1e-12);
      expectCloseTo(p[1], Math.sin(1 / p[0]), 1e-12);
    }
  });

  it('the witness sequences converge to (0, 1), (0, -1), (0, 0)', () => {
    const data = compute({ xMin: 0.05, showSegment: true, showSeq: true });
    expect(data.seqPlus.length).toBeGreaterThan(0);
    expect(data.seqMinus.length).toBeGreaterThan(0);
    expect(data.seqZero.length).toBeGreaterThan(0);
    for (const p of data.seqPlus) expectCloseTo(p[1], 1, 1e-9);
    for (const p of data.seqMinus) expectCloseTo(p[1], -1, 1e-9);
    for (const p of data.seqZero) expectCloseTo(p[1], 0, 1e-9);
    // x_n = 1/(pi/2 + 2 pi n): the first plus-point is (2/pi, 1).
    expectCloseTo(data.seqPlus[0]![0], 2 / Math.PI, 1e-12);
    expectCloseTo(data.seqPlus[0]![1], 1, 1e-12);
    // x decreasing along each sequence, all inside [xMin, 2].
    for (const seq of [data.seqPlus, data.seqMinus, data.seqZero]) {
      for (let i = 1; i < seq.length; i++) {
        expect(seq[i]![0]).toBeLessThan(seq[i - 1]![0]);
      }
      for (const p of seq) {
        expect(p[0]).toBeGreaterThanOrEqual(0.05);
        expect(p[0]).toBeLessThanOrEqual(TS_XMAX);
      }
    }
  });

  it('flags are read from the control state', () => {
    const data = compute({ xMin: 0.05, showSegment: false, showSeq: false });
    expect(data.showSegment).toBe(false);
    expect(data.showSeq).toBe(false);
    expect(data.xMin).toBe(0.05);
  });
});

describe('topologist-sine: sweep over xMin', () => {
  it('for xMin in {0.005, 0.05, 0.5, 1} the curve stays in [xMin, 2] x [-1, 1]', () => {
    for (const xMin of [0.005, 0.05, 0.5, 1]) {
      const data = compute({ xMin, showSegment: true, showSeq: true });
      expect(data.xMin).toBe(xMin);
      for (const p of data.pts) {
        expect(p[0]).toBeGreaterThanOrEqual(xMin * (1 - 1e-9));
        expect(p[0]).toBeLessThanOrEqual(TS_XMAX);
        expect(Math.abs(p[1])).toBeLessThanOrEqual(1 + 1e-12);
      }
      for (const seq of [data.seqPlus, data.seqMinus, data.seqZero]) {
        for (const p of seq) {
          expect(p[0]).toBeGreaterThanOrEqual(xMin * (1 - 1e-9));
          expect(p[0]).toBeLessThanOrEqual(TS_XMAX);
        }
      }
    }
  });

  it('zooming in adds witness points: seqPlus grows as xMin shrinks', () => {
    const wide = compute({ xMin: 1, showSegment: true, showSeq: true });
    const mid = compute({ xMin: 0.05, showSegment: true, showSeq: true });
    const narrow = compute({ xMin: 0.005, showSegment: true, showSeq: true });
    expect(wide.seqPlus.length).toBe(0); // 2/pi < 1: outside the plotted domain
    expect(mid.seqPlus.length).toBeGreaterThan(0);
    expect(narrow.seqPlus.length).toBeGreaterThan(mid.seqPlus.length);
  });
});

describe('topologist-sine: model compute', () => {
  it('reads xMin and the toggles from the control state, clamps, defaults to init', () => {
    expect(compute({}).xMin).toBe(TS_XMIN_INIT);
    expect(compute({}).showSegment).toBe(TS_SHOW_SEGMENT_INIT);
    expect(compute({}).showSeq).toBe(TS_SHOW_SEQ_INIT);
    expect(compute({ xMin: 100 }).xMin).toBe(TS_XMIN_MAX);
    expect(compute({ xMin: 0 }).xMin).toBe(TS_XMIN_MIN);
    expect(compute({ xMin: 0.5 }).xMin).toBe(0.5);
    expect(compute({ xMin: NaN }).xMin).toBe(TS_XMIN_INIT);
    expect(compute({ showSegment: 'yes' }).showSegment).toBe(TS_SHOW_SEGMENT_INIT);
  });

  it('exports the expected data keys', () => {
    const data = compute({ xMin: 0.05, showSegment: true, showSeq: true });
    for (const key of [
      'xMin', 'showSegment', 'showSeq', 'pts', 'seqPlus', 'seqMinus', 'seqZero',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('topologist-sine: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(topologistSineProblems).toHaveLength(3);
    for (const p of topologistSineProblems) {
      expect(p.id).toBeTruthy();
      expect(p.statement.ko).toBeTruthy();
      expect(p.statement.en).toBeTruthy();
      expect(p.presetCaption.ko).toBeTruthy();
      expect(p.presetCaption.en).toBeTruthy();
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko).toBeTruthy();
        expect(step.text.en).toBeTruthy();
      }
    }
  });

  it('the three ids are topologist-sine-connected, topologist-sine-closure, topologist-sine-no-path', () => {
    expect(topologistSineProblems.map((p) => p.id)).toEqual([
      'topologist-sine-connected',
      'topologist-sine-closure',
      'topologist-sine-no-path',
    ]);
  });

  it('presets use xMin in [0.005, 1] and boolean toggles', () => {
    for (const p of topologistSineProblems) {
      const xMin = Number(p.preset['xMin']);
      expect(xMin).toBeGreaterThanOrEqual(TS_XMIN_MIN);
      expect(xMin).toBeLessThanOrEqual(TS_XMIN_MAX);
      expect(typeof p.preset['showSegment']).toBe('boolean');
      expect(typeof p.preset['showSeq']).toBe('boolean');
    }
  });
});
