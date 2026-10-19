import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  gcd,
  thomaeData,
  thomaeDots,
  thomaeModel,
  THOMAE_CENTER_INIT,
  THOMAE_CENTER_MAX,
  THOMAE_CENTER_MIN,
  THOMAE_EPS_INIT,
  THOMAE_EPS_MAX,
  THOMAE_EPS_MIN,
  THOMAE_Q_INIT,
  THOMAE_Q_MAX,
  THOMAE_Q_MIN,
  THOMAE_ZOOM_INIT,
  THOMAE_ZOOM_MAX,
  THOMAE_ZOOM_MIN,
  type ThomaeData,
} from '../src/chapters/limits/models/thomae';
import { problems } from '../src/chapters/limits/problems/thomae';

const compute = (state: ControlState): ThomaeData => syncCompute(thomaeModel, state);

describe('thomae: the model values', () => {
  it('dots are (p/q, 1/q) in lowest terms: Q = 5 gives 11 dots from (0, 1) to (1, 1)', () => {
    const dots = thomaeDots(5);
    expect(dots).toHaveLength(11);
    expect(dots[0]).toEqual({ x: 0, q: 1, y: 1 });
    expect(dots[dots.length - 1]).toEqual({ x: 1, q: 1, y: 1 });
    for (const d of dots) {
      expectCloseTo(d.y, 1 / d.q, 1e-15);
      expect(gcd(Math.round(d.x * d.q), d.q)).toBe(1);
    }
    // Sorted by x.
    for (let i = 1; i < dots.length; i++) {
      expect(dots[i]!.x).toBeGreaterThanOrEqual(dots[i - 1]!.x);
    }
  });

  it('Q = 30 gives 279 dots (sum of phi over q <= 30)', () => {
    expect(thomaeDots(30)).toHaveLength(279);
  });

  it('tall dots are exactly the rationals with q <= 1/epsilon: epsilon = 0.4 keeps q = 1, 2', () => {
    const data = compute({ Q: 5, eps: 0.4, center: 0.618034, zoom: 0.1 });
    expect(data.tallDots).toHaveLength(3);
    expect(data.tallDots.map((d) => d.q).sort()).toEqual([1, 1, 2]);
    for (const d of data.tallDots) expect(d.y).toBeGreaterThanOrEqual(0.4 - 1e-12);
  });

  it('delta is the min distance from the center to the tall dots', () => {
    const data = compute({ Q: 5, eps: 0.2, center: 0.618034, zoom: 0.1 });
    expect(data.tallDots).toHaveLength(11);
    // Nearest tall dot is 3/5 = 0.6: |0.618034 - 0.6| = 0.018034.
    expectCloseTo(data.delta, 0.018034, 1e-9);
    expect(data.centerIsTallRational).toBe(false);
  });

  it('a rational center that is itself tall gives delta = 0', () => {
    const data = compute({ Q: 5, eps: 0.2, center: 0.5, zoom: 0.1 });
    expect(data.centerIsTallRational).toBe(true);
    expect(data.delta).toBe(0);
  });

  it('delta for center = 0.7, eps = 0.2, Q = 5: nearest tall dot is 2/3', () => {
    const data = compute({ Q: 5, eps: 0.2, center: 0.7, zoom: 0.1 });
    expectCloseTo(data.delta, Math.abs(0.7 - 2 / 3), 1e-12);
  });
});

describe('thomae: the finiteness picture holds on a sweep', () => {
  it('tallDots is finite and every dot has y = 1/q with q <= Q', () => {
    for (const qMax of [1, 5, 12, 30]) {
      for (const eps of [0.02, 0.1, 0.5]) {
        const data = thomaeData(qMax, eps, 0.618034, 0.1);
        expect(data.tallDots.length).toBeLessThanOrEqual(data.dots.length);
        for (const d of data.tallDots) {
          expect(d.q).toBeLessThanOrEqual(1 / eps + 1e-9);
        }
        expect(data.delta).toBeGreaterThanOrEqual(0);
        // At an irrational center, delta is strictly positive.
        if (!data.centerIsTallRational) expect(data.delta).toBeGreaterThan(0);
      }
    }
  });

  it('shrinking epsilon grows the tall set monotonically', () => {
    const small = compute({ Q: 12, eps: 0.05, center: 0.618034, zoom: 0.1 });
    const large = compute({ Q: 12, eps: 0.2, center: 0.618034, zoom: 0.1 });
    expect(small.tallDots.length).toBeGreaterThan(large.tallDots.length);
  });
});

describe('thomae: model compute', () => {
  it('reads Q, eps, center, zoom from the control state, clamps, defaults to init', () => {
    expect(compute({}).qMax).toBe(THOMAE_Q_INIT);
    expect(compute({}).epsilon).toBe(THOMAE_EPS_INIT);
    expect(compute({}).center).toBe(THOMAE_CENTER_INIT);
    expect(compute({}).zoom).toBe(THOMAE_ZOOM_INIT);
    expect(compute({ Q: 100 }).qMax).toBe(THOMAE_Q_MAX);
    expect(compute({ Q: 0 }).qMax).toBe(THOMAE_Q_MIN);
    expect(compute({ Q: 7.6 }).qMax).toBe(8);
    expect(compute({ eps: 2 }).epsilon).toBe(THOMAE_EPS_MAX);
    expect(compute({ eps: 0.001 }).epsilon).toBe(THOMAE_EPS_MIN);
    expect(compute({ center: 2 }).center).toBe(THOMAE_CENTER_MAX);
    expect(compute({ center: -1 }).center).toBe(THOMAE_CENTER_MIN);
    expect(compute({ zoom: 5 }).zoom).toBe(THOMAE_ZOOM_MAX);
    expect(compute({ zoom: 0.001 }).zoom).toBe(THOMAE_ZOOM_MIN);
  });

  it('exports the expected data keys', () => {
    const data = compute({});
    for (const key of [
      'qMax', 'epsilon', 'center', 'zoom', 'dots', 'tallDots', 'delta', 'centerIsTallRational',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('thomae: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(problems).toHaveLength(3);
    for (const p of problems) {
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

  it('the three ids are thomae-discontinuous-at-rationals, thomae-continuous-at-irrationals, thomae-baire-1', () => {
    expect(problems.map((p) => p.id)).toEqual([
      'thomae-discontinuous-at-rationals',
      'thomae-continuous-at-irrationals',
      'thomae-baire-1',
    ]);
  });

  it('presets use Q in [1, 30], eps in [0.02, 0.5], center in [0, 1], zoom in [0.02, 0.5]', () => {
    for (const p of problems) {
      const qq = Number(p.preset['Q']);
      const eps = Number(p.preset['eps']);
      const center = Number(p.preset['center']);
      const zoom = Number(p.preset['zoom']);
      expect(qq).toBeGreaterThanOrEqual(THOMAE_Q_MIN);
      expect(qq).toBeLessThanOrEqual(THOMAE_Q_MAX);
      expect(eps).toBeGreaterThanOrEqual(THOMAE_EPS_MIN);
      expect(eps).toBeLessThanOrEqual(THOMAE_EPS_MAX);
      expect(center).toBeGreaterThanOrEqual(THOMAE_CENTER_MIN);
      expect(center).toBeLessThanOrEqual(THOMAE_CENTER_MAX);
      expect(zoom).toBeGreaterThanOrEqual(THOMAE_ZOOM_MIN);
      expect(zoom).toBeLessThanOrEqual(THOMAE_ZOOM_MAX);
    }
  });
});
