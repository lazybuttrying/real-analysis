import { describe, expect, it } from 'vitest';
import { baselModel, baselPartialSums, LIMIT as BASEL_LIMIT } from '../src/chapters/series/models/basel';
import { eSeriesRace, eseriesModel } from '../src/chapters/series/models/eseries';
import { geometricFill } from '../src/chapters/series/models/geometric';
import { grandiSums } from '../src/chapters/series/models/grandi';
import { harmonicPartialSums } from '../src/chapters/series/models/harmonic';
import { leibnizPartialSums } from '../src/chapters/series/models/leibniz';
import { stirlingTable } from '../src/chapters/series/models/stirling';
import { telescopingPairs } from '../src/chapters/series/models/telescoping';
import { wallisProduct } from '../src/chapters/series/models/wallis';
import { zeta3Approx, zeta4PartialSums, zetaEven } from '../src/chapters/series/models/zeta4';
import { EULER_GAMMA } from '../src/math/constants';

describe('basel model', () => {
  it('matches the known partial sum and error at n = 14', () => {
    const data = baselPartialSums(14);
    expect(data.sum).toBeCloseTo(1.575996, 5);
    expect(data.limit).toBeCloseTo((Math.PI * Math.PI) / 6, 12);
    expect(data.error).toBeCloseTo(0.0689, 3);
    expect(data.heights).toHaveLength(14);
    expect(data.sums[13]).toBe(data.sum);
  });

  it('compute() reads the state and clamps to the model range', () => {
    const viaModel = baselModel.compute({ n: 14 }) as ReturnType<typeof baselPartialSums>;
    expect(viaModel.sum).toBeCloseTo(1.575996, 5);
    expect(viaModel.limit).toBe(BASEL_LIMIT);
  });
});

describe('leibniz model', () => {
  it('brackets pi/4 between consecutive partial sums, within the next-term bound', () => {
    const data = leibnizPartialSums(12);
    const limit = Math.PI / 4;
    expect(data.limit).toBeCloseTo(limit, 15);
    expect(Math.sign(data.sum - limit)).toBe(-Math.sign(data.next - limit));
    expect(data.error).toBeLessThanOrEqual(data.bound);
    expect(data.bound).toBeCloseTo(1 / 25, 12);
    expect(data.error).toBeCloseTo(0.0208, 3);
  });
});

describe('eseries model', () => {
  it('the factorial series is dramatically closer to e than compound growth at n = 10', () => {
    const data = eSeriesRace(10);
    expect(data.seriesError).toBeLessThan(1e-7);
    expect(data.seriesError).toBeCloseTo(2.73e-8, 9);
    expect(data.compoundError).toBeCloseTo(0.1245, 3);
    expect(data.compoundError).toBeGreaterThan(data.seriesError * 1000);
    expect(data.limit).toBe(Math.E);
  });

  it('compute() agrees with the pure function', () => {
    const viaModel = eseriesModel.compute({ n: 10 }) as ReturnType<typeof eSeriesRace>;
    expect(viaModel.seriesValue).toBe(eSeriesRace(10).seriesValue);
  });
});

describe('telescoping model', () => {
  it('S_N equals 1 - 1/(N+1) exactly', () => {
    for (const n of [1, 2, 10, 24]) {
      const data = telescopingPairs(n);
      expect(data.sum).toBeCloseTo(1 - 1 / (n + 1), 12);
      expect(data.tail).toBeCloseTo(1 / (n + 1), 15);
      expect(data.error).toBeCloseTo(1 / (n + 1), 12);
    }
  });
});

describe('geometric model', () => {
  it('the gap is exactly (1/2)^steps and sum + gap is exactly 1', () => {
    for (const steps of [1, 6, 12]) {
      const data = geometricFill(steps);
      expect(data.gapValue).toBe(Math.pow(2, -steps));
      expect(data.sum).toBe(1 - Math.pow(2, -steps));
      expect(data.sum + data.gapValue).toBe(1);
      expect(data.pieces).toHaveLength(steps);
    }
  });
});

describe('harmonic model', () => {
  it('every Oresme group still totals at least 1/2 (the guaranteed halves)', () => {
    const at = (n: number): number => harmonicPartialSums(n).final.sum;
    const groupEnds = [1, 3, 7, 15, 31];
    for (let g = 1; g < groupEnds.length; g++) {
      const groupSum = at(groupEnds[g]!) - at(groupEnds[g - 1]!);
      expect(groupSum).toBeGreaterThanOrEqual(0.5);
    }
    expect(at(1)).toBe(1);
  });

  it('tracks ln n + gamma closely', () => {
    const data = harmonicPartialSums(1000);
    expect(data.final.asymptotic).toBeCloseTo(Math.log(1000) + EULER_GAMMA, 12);
    expect(Math.abs(data.final.sum - data.final.asymptotic)).toBeLessThan(0.001);
  });
});

describe('wallis model', () => {
  it('oscillates around pi/2: odd steps above, even steps below', () => {
    const data = wallisProduct(10);
    const limit = Math.PI / 2;
    data.points.forEach((point) => {
      if (point.step === 0) return;
      if (point.step % 2 === 1) expect(point.value).toBeGreaterThan(limit);
      else expect(point.value).toBeLessThan(limit);
    });
  });

  it('the error at pair ends shrinks toward pi/2', () => {
    const e1 = wallisProduct(1).error;
    const e5 = wallisProduct(5).error;
    const e40 = wallisProduct(40).error;
    expect(e5).toBeLessThan(e1);
    expect(e40).toBeLessThan(e5);
    expect(e40).toBeLessThan(0.02);
    expect(wallisProduct(40).limit).toBeCloseTo(Math.PI / 2, 15);
  });
});

describe('stirling model', () => {
  it('relative error falls from about 7.8% at n = 1 to under 1% at n = 10', () => {
    const e1 = stirlingTable(1).relErr;
    const e10 = stirlingTable(10).relErr;
    const e20 = stirlingTable(20).relErr;
    expect(e1).toBeCloseTo(0.0779, 3);
    expect(e10).toBeLessThan(0.01);
    expect(e10).toBeCloseTo(0.0083, 3);
    expect(e20).toBeLessThan(e10);
    expect(e20).toBeCloseTo(0.0042, 3);
  });
});

describe('grandi model', () => {
  it('partial sums bounce 1, 0 forever and never settle', () => {
    const data = grandiSums(40);
    data.sums.forEach((s, i) => {
      expect(s).toBe(i % 2 === 0 ? 1 : 0);
      if (i > 0) expect(Math.abs(s - data.sums[i - 1]!)).toBe(1);
    });
    expect(data.sum).toBe(0);
  });

  it('the Cesaro mean tends to 1/2, which is not a sum of the series', () => {
    expect(grandiSums(16).cesaroMean).toBe(0.5);
    expect(grandiSums(15).cesaroMean).toBeCloseTo(8 / 15, 12);
    expect(grandiSums(40).cesaroLimit).toBe(0.5);
    expect(Math.abs(grandiSums(40).cesaroMean - 0.5)).toBeLessThanOrEqual(1 / 40);
  });
});

describe('zeta4 model', () => {
  it('partial sums converge to pi^4/90', () => {
    const data = zeta4PartialSums(20);
    expect(data.limit).toBeCloseTo(Math.pow(Math.PI, 4) / 90, 12);
    expect(data.sum).toBeCloseTo(1.082285, 5);
    expect(data.error).toBeLessThan(1e-4);
    expect(data.error).toBeCloseTo(Math.pow(Math.PI, 4) / 90 - data.sum, 12);
  });

  it('the even-zeta pattern holds and zeta(3) is estimated by summation', () => {
    expect(zetaEven(2).value).toBeCloseTo((Math.PI * Math.PI) / 6, 12);
    expect(zetaEven(6).denom).toBe(945);
    expect(zeta3Approx()).toBeCloseTo(1.2020569, 6);
    const pattern = zeta4PartialSums(4).pattern;
    expect(pattern.find((entry) => entry.odd)?.value).toBeCloseTo(1.2020569, 6);
  });
});
