import { describe, expect, it } from 'vitest';
import { diffContData, diffContHalfWidth, diffContModel } from '../src/chapters/calculus/models/diffCont';

describe('diffCont model', () => {
  it('half-width is 2^{1-zoom}: w(1)=1, w(8)=2^-7', () => {
    expect(diffContHalfWidth(1)).toBe(1);
    expect(diffContHalfWidth(8)).toBe(2 ** -7);
    expect(diffContData(1).w).toBe(1);
    expect(diffContData(8).w).toBe(2 ** -7);
    // Geometric halving between consecutive zoom levels.
    for (let z = 1; z < 8; z++) {
      expect(diffContHalfWidth(z + 1)).toBe(diffContHalfWidth(z) / 2);
    }
  });

  it('difference quotients at the corner are exactly -1 (left) and +1 (right)', () => {
    // P2 proof claim: |h|/h = 1 for h>0, -1 for h<0.
    for (let zoom = 1; zoom <= 8; zoom++) {
      const d = diffContData(zoom);
      expect(d.leftQuotient).toBe(-1);
      expect(d.rightQuotient).toBe(1);
    }
  });

  it('samples trace |x| on [-w, w]: 200 points, y >= 0, y(-w) = w', () => {
    for (const zoom of [1, 4, 8]) {
      const d = diffContData(zoom);
      expect(d.samples).toHaveLength(200);
      const first = d.samples[0];
      const lastSample = d.samples[d.samples.length - 1];
      expect(first?.x).toBe(-d.w);
      expect(first?.y).toBe(d.w);
      expect(lastSample?.x).toBe(d.w);
      expect(lastSample?.y).toBe(d.w);
      for (const s of d.samples) {
        expect(s.y).toBe(Math.abs(s.x));
        expect(s.y).toBeGreaterThanOrEqual(0);
        expect(s.x).toBeGreaterThanOrEqual(-d.w);
        expect(s.x).toBeLessThanOrEqual(d.w);
      }
    }
  });

  it('compute() accepts the problem presets', async () => {
    const p1 = await diffContModel.compute({ zoom: 1 });
    expect(p1.zoom).toBe(1);
    expect(p1.w).toBe(1);

    const p2 = await diffContModel.compute({ zoom: 4 });
    expect(p2.zoom).toBe(4);
    expect(p2.w).toBe(2 ** -3);
    expect(p2.leftQuotient).toBe(-1);
    expect(p2.rightQuotient).toBe(1);

    const p3 = await diffContModel.compute({ zoom: 8 });
    expect(p3.zoom).toBe(8);
    expect(p3.w).toBe(2 ** -7);
  });

  it('compute() falls back to init 1 on missing/non-finite input and clamps to [1, 8]', async () => {
    expect((await diffContModel.compute({})).zoom).toBe(1);
    expect((await diffContModel.compute({ zoom: NaN })).zoom).toBe(1);
    expect((await diffContModel.compute({ zoom: 99 })).zoom).toBe(8);
    expect((await diffContModel.compute({ zoom: -3 })).zoom).toBe(1);
    expect((await diffContModel.compute({ zoom: 3.4 })).zoom).toBe(3);
  });
});
