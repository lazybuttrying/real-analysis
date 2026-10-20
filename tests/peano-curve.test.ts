import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  peanoCurveModel,
  peanoGridN,
  peanoMaxStep,
  peanoPolyline,
  peanoSegmentCount,
  peanoTracePoint,
  PEANO_ORDER_INIT,
  PEANO_ORDER_MAX,
  PEANO_ORDER_MIN,
  PEANO_SHOW_GRID_INIT,
  PEANO_T_INIT,
  PEANO_T_MAX,
  PEANO_T_MIN,
  type PeanoData,
} from '../src/chapters/limits/models/peanoCurve';
import { peanoCurveProblems } from '../src/chapters/limits/problems/peano-curve';

const compute = (state: ControlState): PeanoData => syncCompute(peanoCurveModel, state);

describe('peano-curve: the polyline', () => {
  it('order k gives 9^k + 1 points from (0,0) to (1,0)', () => {
    for (const k of [1, 2, 3, 4]) {
      const pts = peanoPolyline(k);
      expect(pts).toHaveLength(Math.pow(9, k) + 1);
      expect(peanoSegmentCount(k)).toBe(Math.pow(9, k));
      expectCloseTo(pts[0]![0], 0, 1e-12);
      expectCloseTo(pts[0]![1], 0, 1e-12);
      const last = pts[pts.length - 1]!;
      expectCloseTo(last[0], 1, 1e-9);
      expectCloseTo(last[1], 0, 1e-9);
    }
  });

  it('order 1 snakes through the 9 subsquares in the documented order', () => {
    const pts = peanoPolyline(1);
    const expected: Array<[number, number]> = [
      [0, 0], [0, 1 / 3], [0, 2 / 3], [1 / 3, 2 / 3], [2 / 3, 2 / 3],
      [1, 2 / 3], [2 / 3, 2 / 3], [2 / 3, 1 / 3], [2 / 3, 0], [1, 0],
    ];
    expect(pts).toHaveLength(expected.length);
    for (let i = 0; i < expected.length; i++) {
      expectCloseTo(pts[i]![0], expected[i]![0], 1e-9);
      expectCloseTo(pts[i]![1], expected[i]![1], 1e-9);
    }
  });

  it('all points lie in [0,1]^2 and consecutive points are at most 3^-k apart', () => {
    for (const k of [1, 2, 3, 4]) {
      const pts = peanoPolyline(k);
      for (const p of pts) {
        expect(p[0]).toBeGreaterThanOrEqual(-1e-12);
        expect(p[0]).toBeLessThanOrEqual(1 + 1e-12);
        expect(p[1]).toBeGreaterThanOrEqual(-1e-12);
        expect(p[1]).toBeLessThanOrEqual(1 + 1e-12);
      }
      expect(peanoMaxStep(k)).toBeLessThanOrEqual(Math.pow(3, -k) * (1 + 1e-9) + 1e-12);
    }
  });

  it('the order-k curve visits every cell of the 3^k x 3^k grid', () => {
    for (const k of [1, 2]) {
      const n = peanoGridN(k);
      const pts = peanoPolyline(k);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const cx = (i + 0.5) / n;
          const cy = (j + 0.5) / n;
          const hit = pts.some(
            (p) => Math.abs(p[0] - cx) <= 0.5 / n + 1e-9 && Math.abs(p[1] - cy) <= 0.5 / n + 1e-9,
          );
          expect(hit).toBe(true);
        }
      }
    }
  });
});

describe('peano-curve: the trace point', () => {
  it('t = 0 gives the start, t = 1 the end', () => {
    const s = peanoTracePoint(2, 0);
    const e = peanoTracePoint(2, 1);
    expectCloseTo(s[0], 0, 1e-12);
    expectCloseTo(s[1], 0, 1e-12);
    expectCloseTo(e[0], 1, 1e-9);
    expectCloseTo(e[1], 0, 1e-9);
  });

  it('t = 0.5 at order 1 is the midpoint of the fifth segment: (5/6, 2/3)', () => {
    const p = peanoTracePoint(1, 0.5);
    expectCloseTo(p[0], 5 / 6, 1e-9);
    expectCloseTo(p[1], 2 / 3, 1e-9);
  });

  it('the trace stays in [0,1]^2 and moves continuously in t', () => {
    let prev = peanoTracePoint(3, 0);
    for (let i = 1; i <= 40; i++) {
      const cur = peanoTracePoint(3, i / 40);
      expect(cur[0]).toBeGreaterThanOrEqual(-1e-12);
      expect(cur[0]).toBeLessThanOrEqual(1 + 1e-12);
      expect(cur[1]).toBeGreaterThanOrEqual(-1e-12);
      expect(cur[1]).toBeLessThanOrEqual(1 + 1e-12);
      const step = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
      expect(step).toBeLessThanOrEqual(Math.pow(3, -3) * 40 * (1 + 1e-9) + 1e-9);
      prev = cur;
    }
  });
});

describe('peano-curve: model compute', () => {
  it('reads order, t, showGrid from the control state, clamps, defaults to init', () => {
    const d0 = compute({});
    expect(d0.order).toBe(PEANO_ORDER_INIT);
    expect(d0.t).toBe(PEANO_T_INIT);
    expect(d0.showGrid).toBe(PEANO_SHOW_GRID_INIT);
    expect(compute({ order: 100 }).order).toBe(PEANO_ORDER_MAX);
    expect(compute({ order: 0 }).order).toBe(PEANO_ORDER_MIN);
    expect(compute({ order: 2.6 }).order).toBe(3);
    expect(compute({ order: NaN }).order).toBe(PEANO_ORDER_INIT);
    expect(compute({ t: 2 }).t).toBe(PEANO_T_MAX);
    expect(compute({ t: -1 }).t).toBe(PEANO_T_MIN);
    expect(compute({ t: NaN }).t).toBe(PEANO_T_INIT);
    expect(compute({ showGrid: 'yes' }).showGrid).toBe(PEANO_SHOW_GRID_INIT);
  });

  it('data carries points, trace, segmentCount, gridN, maxStep', () => {
    const data = compute({ order: 2, t: 0.5, showGrid: true });
    expect(data.order).toBe(2);
    expect(data.t).toBe(0.5);
    expect(data.points).toHaveLength(82);
    expect(data.segmentCount).toBe(81);
    expect(data.gridN).toBe(9);
    expect(data.maxStep).toBeLessThanOrEqual(1 / 9 + 1e-9);
    expect(data.trace).toHaveLength(2);
  });

  it('exports the expected data keys', () => {
    const data = compute({ order: 2, t: 0.5, showGrid: true });
    for (const key of [
      'order', 't', 'showGrid', 'points', 'trace', 'segmentCount', 'gridN', 'maxStep',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('peano-curve: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(peanoCurveProblems);
  });

  it('the three ids are peano-uniform-limit, peano-surjective, peano-not-injective', () => {
    expect(peanoCurveProblems.map((p) => p.id)).toEqual([
      'peano-uniform-limit',
      'peano-surjective',
      'peano-not-injective',
    ]);
  });

  it('presets use order in [1, 4], t in [0, 1], and a boolean showGrid', () => {
    for (const p of peanoCurveProblems) {
      const order = Number(p.preset['order']);
      const t = Number(p.preset['t']);
      expect(order).toBeGreaterThanOrEqual(PEANO_ORDER_MIN);
      expect(order).toBeLessThanOrEqual(PEANO_ORDER_MAX);
      expect(Number.isInteger(order)).toBe(true);
      expect(t).toBeGreaterThanOrEqual(PEANO_T_MIN);
      expect(t).toBeLessThanOrEqual(PEANO_T_MAX);
      expect(typeof p.preset['showGrid']).toBe('boolean');
    }
  });
});
