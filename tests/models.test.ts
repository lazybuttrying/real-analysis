import { describe, expect, it } from 'vitest';
import { expectCloseTo } from './helpers';
import { epsilonNTail, epsilonNModel, sequenceKey, type EpsilonNData } from '../src/chapters/limits/models/epsilonN';
import { babylonian, holesModel, type HolesData } from '../src/chapters/limits/models/holes';
import { bolzanoWeierstrass } from '../src/chapters/limits/models/bolzanoWeierstrass';
import { cantorModel, cantorStages, type CantorData } from '../src/chapters/limits/models/cantor';
import { ivtData } from '../src/chapters/limits/models/ivt';
import { uniformData, uniformModel, type UniformData } from '../src/chapters/limits/models/uniform';
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
    expectCloseTo(data.final.sum, data.final.asymptotic, 0.001);
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

describe('epsilon-n model', () => {
  it('finds the first N with the whole tail inside the epsilon band', () => {
    expect(epsilonNTail('inv', 0.1).firstN).toBe(10);
    expect(epsilonNTail('alt', 0.1).firstN).toBe(10);
    // In floating point |9/10 − 1| = 0.0999… < 0.1, so the computed tail fits from N = 8.
    expect(epsilonNTail('frac', 0.1).firstN).toBe(8);
  });

  it('reports null when 80 terms are not enough', () => {
    expect(epsilonNTail('inv', 0.001).firstN).toBeNull();
  });

  it('maps the select options to sequences and reads state', () => {
    expect(sequenceKey('n / (n+1)')).toBe('frac');
    expect(sequenceKey('(unknown)')).toBe('inv');
    const viaModel = epsilonNModel.compute({ seq: '1/n', epsilon: 0.1 }) as EpsilonNData;
    expect(viaModel.firstN).toBe(10);
    expect(viaModel.limit).toBe(0);
  });
});

describe('holes model', () => {
  it('converges quadratically to sqrt(2) with exact rational terms', () => {
    const steps = babylonian(5);
    expect(steps).toHaveLength(6);
    expect(steps[0]?.value).toBe(1);
    expect(steps[1]?.p).toBe(3n);
    expect(steps[1]?.q).toBe(2n);
    expect(steps[5]?.error).toBeLessThan(1e-8);
    expect(steps[5]?.value).toBeCloseTo(Math.SQRT2, 12);
  });

  it('compute() clamps the iteration count', () => {
    const viaModel = holesModel.compute({ n: 4 }) as HolesData;
    expect(viaModel.steps).toHaveLength(5);
    expect(viaModel.n).toBe(4);
  });
});

describe('bolzano-weierstrass model', () => {
  it('nests intervals of length 2^-k and keeps the subsequence inside', () => {
    const data = bolzanoWeierstrass(7, 4);
    expect(data.intervals).toHaveLength(5);
    data.intervals.forEach((interval, k) => {
      expect(interval.b - interval.a).toBeCloseTo(2 ** -k, 12);
    });
    const final = data.intervals[4];
    expect(final).toBeDefined();
    for (const x of data.subsequence) {
      expect(x).toBeGreaterThanOrEqual(final!.a);
      expect(x).toBeLessThanOrEqual(final!.b);
    }
    expect(data.subsequence.length).toBeGreaterThan(0);
  });
});

describe('cantor model', () => {
  it('has 2^n pieces of length 3^-n at stage n', () => {
    const stages = cantorStages(8);
    expect(stages[8]).toHaveLength(256);
    const viaModel = cantorModel.compute({ stage: 8 }) as CantorData;
    expect(viaModel.totalLength).toBeCloseTo((2 / 3) ** 8, 10);
    expect(viaModel.stages).toHaveLength(9);
  });
});

describe('ivt model', () => {
  it('locates the crossing by bisection', () => {
    const cubic = ivtData('cubic', 0.5);
    expect(cubic.c).toBe(0);
    expectCloseTo(cubic.xi, 0.6823278038280193, 1e-9);
    const sine = ivtData('sine', 0.5);
    expect(sine.c).toBe(0.5);
    expectCloseTo(sine.xi, Math.PI / 6, 1e-9);
  });

  it('maps the 0–100 slider onto [f(a), f(b)]', () => {
    const data = ivtData('cubic', 0.25);
    expect(data.c).toBeCloseTo(-0.5, 12);
  });
});

describe('uniform model', () => {
  it('keeps the sup norm at 1 while the tube is escaped near x = 1', () => {
    const data = uniformData(8, 0.2);
    expect(data.supNorm).toBeGreaterThan(0.97);
    expect(data.supNorm).toBeLessThanOrEqual(1);
    expect(data.escapeX).toBeCloseTo(0.8179, 3);
  });

  it('compute() reads state with sane defaults', () => {
    const viaModel = uniformModel.compute({ n: 8, eps: 0.2 }) as UniformData;
    expect(viaModel.n).toBe(8);
    expect(viaModel.epsilon).toBe(0.2);
  });
});

describe('problems: every number stated in the 18 proofs', () => {
  it('epsilon-n: the N values claimed in the proofs match the model', () => {
    // 1/n^2, eps = 0.01 -> N = ceil(1/sqrt(0.01)) = 10
    expect(epsilonNTail('sq', 0.01).firstN).toBe(10);
    // n/(n+1), eps = 0.05 -> N = 19 (1/20 = 0.05 is not < 0.05)
    expect(epsilonNTail('frac', 0.05).firstN).toBe(19);
    // (-1)^n/n, eps = 0.05 -> N = 20
    expect(epsilonNTail('alt', 0.05).firstN).toBe(20);
    expect(sequenceKey('1/n²')).toBe('sq');
  });

  it('holes: x_5 is the exact fraction claimed, in lowest terms', () => {
    const steps = babylonian(5);
    expect(steps[1]?.p).toBe(3n);
    expect(steps[1]?.q).toBe(2n);
    expect(steps[2]?.p).toBe(17n);
    expect(steps[2]?.q).toBe(12n);
    expect(steps[3]?.p).toBe(577n);
    expect(steps[3]?.q).toBe(408n);
    expect(steps[4]?.p).toBe(665857n);
    expect(steps[4]?.q).toBe(470832n);
    expect(steps[5]?.p).toBe(886731088897n);
    expect(steps[5]?.q).toBe(627013566048n);
    // The Pell identity behind the "lowest terms" claim: p^2 - 2q^2 = 1.
    for (let n = 1; n <= 5; n++) {
      const s = steps[n]!;
      expect(s.p * s.p - 2n * s.q * s.q).toBe(1n);
    }
  });

  it('holes: the error chain e_1..e_4 and the 1e-24 bound', () => {
    const steps = babylonian(5);
    const e = (n: number): number => steps[n]!.value ** 2 - 2;
    expect(e(1)).toBeCloseTo(1 / 4, 12);
    expect(e(2)).toBeCloseTo(1 / 144, 12);
    expect(e(3)).toBeCloseTo(1 / 166464, 12);
    expect(e(4)).toBeCloseTo(1 / 221682772224, 12);
    expect(e(4)).toBeLessThan(4.6e-12);
    // The proof's conclusion: |x_5 - sqrt(2)| < 1e-24.
    expect(steps[5]!.error).toBeLessThan(1e-24);
  });

  it('cantor: stage 3 has 8 intervals of total length 8/27', () => {
    const viaModel = cantorModel.compute({ stage: 3 }) as CantorData;
    expect(viaModel.stages[3]).toHaveLength(8);
    expect(viaModel.totalLength).toBeCloseTo(8 / 27, 12);
  });

  it('ivt: the crossing values claimed in the proofs', () => {
    const cubic = ivtData('cubic', 0.5);
    expect(cubic.c).toBe(0);
    expect(cubic.xi).toBeCloseTo(0.6823278038, 9);
    expectCloseTo(cubic.xi ** 3 + cubic.xi, 1, 1e-12);
    const sine = ivtData('sine', 0.5);
    expect(sine.c).toBe(0.5);
    expectCloseTo(sine.xi, Math.PI / 6, 1e-12);
  });

  it('uniform: the grid sup norm and the exact supremum distinction', () => {
    const data = uniformData(8, 0.2);
    // The chart samples a grid, so it reads just under the exact supremum 1.
    expect(data.supNorm).toBeCloseTo(0.9802, 3);
    expect(data.supNorm).toBeLessThan(1);
    expect(data.escapeX).toBeCloseTo(0.2 ** (1 / 8), 12);
  });

  it('bolzano-weierstrass: the sin(n) illustration values', () => {
    // Claimed in the proof as numerical illustration (not as proof).
    expect(Math.sin(35489)).toBeCloseTo(0.999999, 5);
    expect(Math.sin(36199)).toBeCloseTo(0.999999, 5);
    expect(Math.abs(Math.sin(35489))).toBeLessThanOrEqual(1);
  });
});

describe('series problems', () => {
  it('harmonic/oresme: S_{2^10} is above the Oresme bound 1 + 10/2', () => {
    const data = harmonicPartialSums(1024);
    expect(data.final.sum).toBeGreaterThanOrEqual(6);
    expect(data.final.sum).toBeCloseTo(7.5092, 3);
  });

  it('harmonic/p-series: the integral comparison bound holds for p = 2', () => {
    let s = 0;
    for (let k = 1; k <= 1000; k++) s += 1 / (k * k);
    expect(s).toBeLessThanOrEqual(1 + 1 / (2 - 1));
    expect(s).toBeCloseTo(1.6439, 3);
  });

  it('basel/tail-bound: R_20 < 1/20', () => {
    const data = baselPartialSums(20);
    const tail = data.limit - data.sum;
    expect(tail).toBeGreaterThan(0);
    expect(tail).toBeLessThan(1 / 20);
    expect(tail).toBeCloseTo(0.0488, 3);
  });

  it('basel/even-terms and odd-terms: the pi^2/24 and pi^2/8 identities', () => {
    let even = 0;
    for (let n = 1; n <= 2000; n++) even += 1 / (2 * n) ** 2;
    expect(even).toBeCloseTo((Math.PI * Math.PI) / 24, 3);
    let odd = 0;
    for (let k = 0; k < 2000; k++) odd += 1 / (2 * k + 1) ** 2;
    expect(odd).toBeCloseTo((Math.PI * Math.PI) / 8, 3);
  });

  it('leibniz/remainder: |S_12 - pi/4| <= 1/25', () => {
    const data = leibnizPartialSums(12);
    expect(Math.abs(data.sum - Math.PI / 4)).toBeLessThanOrEqual(1 / 25);
  });

  it('leibniz/three-decimals: the N >= 1000 threshold arithmetic', () => {
    expect(1 / 2001).toBeLessThan(0.0005);
    expect(1 / 1999).toBeGreaterThan(0.0005);
  });

  it('leibniz/arctan: the power series at x = 1 approaches pi/4', () => {
    let s = 0;
    for (let k = 0; k < 2000; k++) s += (k % 2 === 0 ? 1 : -1) / (2 * k + 1);
    expect(s).toBeCloseTo(Math.PI / 4, 3);
  });

  it('eseries/irrational: 2 < e < 3 from the series bounds', () => {
    const data = eSeriesRace(30);
    expect(data.seriesValue).toBeGreaterThan(2);
    expect(data.seriesValue).toBeLessThan(3);
  });

  it('eseries/remainder: R_10 < 1/(10 * 10!)', () => {
    const data = eSeriesRace(10);
    const remainder = Math.E - data.seriesValue;
    expect(remainder).toBeGreaterThan(0);
    expect(remainder).toBeLessThan(1 / (10 * 3628800));
    expect(remainder).toBeGreaterThan(2.7e-8);
    expect(remainder).toBeCloseTo(2.7312661e-8, 13);
  });

  it('eseries/compound: (1 + 1/30)^30 < series partial sum < e', () => {
    const data = eSeriesRace(30);
    expect(data.compoundValue).toBeLessThan(data.seriesValue);
    expectCloseTo(data.seriesValue, Math.E, 1e-12);
    expect(data.compoundValue).toBeLessThan(Math.E);
  });

  it('telescoping/partial-sums: S_24 = 24/25', () => {
    const data = telescopingPairs(24);
    expect(data.sum).toBeCloseTo(24 / 25, 12);
    expect(data.tail).toBeCloseTo(1 / 25, 12);
  });

  it('telescoping/shifted: the partial sums tend to 3/4', () => {
    let s = 0;
    for (let n = 1; n <= 5000; n++) s += 1 / (n * (n + 2));
    expect(s).toBeCloseTo(0.75, 3);
  });

  it('telescoping/sqrt-diverges: partial sums equal sqrt(N+1) - 1', () => {
    for (const N of [10, 100, 1000]) {
      let s = 0;
      for (let n = 1; n <= N; n++) s += Math.sqrt(n + 1) - Math.sqrt(n);
      expect(s).toBeCloseTo(Math.sqrt(N + 1) - 1, 6);
    }
  });

  it('geometric/finite-formula: (1 - r^{N+1})/(1 - r) matches direct summation', () => {
    const r = 0.5;
    const N = 12;
    let direct = 0;
    for (let k = 0; k <= N; k++) direct += r ** k;
    expect(direct).toBeCloseTo((1 - r ** (N + 1)) / (1 - r), 12);
  });

  it('geometric/nine-nines: 9 * (1/10)/(1 - 1/10) = 1', () => {
    expect(9 * ((1 / 10) / (1 - 1 / 10))).toBeCloseTo(1, 12);
  });

  it('geometric/n-over-2n: the partial sums tend to 2', () => {
    let s = 0;
    for (let n = 1; n <= 200; n++) s += n / 2 ** n;
    expect(s).toBeCloseTo(2, 6);
  });

  it('wallis/reduction: the recurrence gives I_2 = pi/4 and I_4 = 3pi/16', () => {
    const I: number[] = [Math.PI / 2, 1];
    const at = (n: number): number => {
      const v = I[n];
      if (v === undefined) throw new Error('missing I_n');
      return v;
    };
    for (let n = 2; n <= 13; n++) I[n] = ((n - 1) / n) * at(n - 2);
    expect(at(2)).toBeCloseTo(Math.PI / 4, 12);
    expect(at(4)).toBeCloseTo((3 * Math.PI) / 16, 12);
    // The recurrence reproduces direct numeric integration of sin^6.
    let numeric = 0;
    const steps = 200000;
    const h = Math.PI / 2 / steps;
    for (let i = 0; i < steps; i++) numeric += Math.sin((i + 0.5) * h) ** 6 * h;
    expect(at(6)).toBeCloseTo(numeric, 4);
  });

  it('wallis/to-wallis: (pi/2)/W_n equals I_{2n}/I_{2n+1} and tends to 1', () => {
    const I: number[] = [Math.PI / 2, 1];
    const at = (n: number): number => {
      const v = I[n];
      if (v === undefined) throw new Error('missing I_n');
      return v;
    };
    for (let n = 2; n <= 13; n++) I[n] = ((n - 1) / n) * at(n - 2);
    for (const n of [1, 3, 6]) {
      const W = wallisProduct(n).product;
      expect(Math.PI / 2 / W).toBeCloseTo(at(2 * n) / at(2 * n + 1), 12);
    }
    expect(at(12) / at(13)).toBeCloseTo(1, 1);
    expect(wallisProduct(12).product).toBeCloseTo(Math.PI / 2, 1);
  });

  it('wallis/numerics: P_5 is exactly 65536/43659', () => {
    let num = 1n;
    let den = 1n;
    for (let k = 1; k <= 5; k++) {
      const n = BigInt(k);
      num *= 2n * n * (2n * n);
      den *= (2n * n - 1n) * (2n * n + 1n);
    }
    expect(num * 43659n).toBe(65536n * den);
    expect(Number(num) / Number(den)).toBeCloseTo(1.50109, 4);
  });

  it('stirling/check-10: relative error near 1/120', () => {
    const data = stirlingTable(10);
    expect(data.fact).toBeCloseTo(3628800, 6);
    expect(data.relErr).toBeCloseTo(0.008296, 5);
    expectCloseTo(data.relErr, 1 / 120, 0.0001);
  });

  it('stirling/central-binomial: C(2n,n) is close to 4^n/sqrt(pi n)', () => {
    const choose = (n: number, k: number): number => {
      let c = 1;
      for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
      return c;
    };
    for (const n of [10, 20, 50]) {
      const exact = choose(2 * n, n);
      const approx = 4 ** n / Math.sqrt(Math.PI * n);
      expect(Math.abs(exact - approx) / exact).toBeLessThan(0.05);
    }
  });

  it('grandi/diverges: partial sums alternate 1, 0', () => {
    const data = grandiSums(16);
    data.sums.forEach((s, i) => {
      expect(s).toBe((i + 1) % 2 === 1 ? 1 : 0);
    });
  });

  it('grandi/cesaro: sigma_16 is exactly 1/2', () => {
    const data = grandiSums(16);
    expect(data.cesaroMean).toBe(0.5);
  });

  it('zeta4/odd-terms: the odd fourth powers sum to pi^4/96', () => {
    let odd = 0;
    for (let k = 0; k < 2000; k++) odd += 1 / (2 * k + 1) ** 4;
    expect(odd).toBeCloseTo(Math.PI ** 4 / 96, 3);
  });

  it('zeta4/tail-bound: R_8 < 1/1536', () => {
    const data = zeta4PartialSums(8);
    const tail = data.limit - data.sum;
    expect(tail).toBeGreaterThan(0);
    expect(tail).toBeLessThan(1 / 1536);
    expect(tail).toBeCloseTo(0.000539, 5);
  });

  it('zeta4/even-pattern: the Bernoulli formula gives the three values', () => {
    const factorial = (m: number): number => {
      let f = 1;
      for (let i = 2; i <= m; i++) f *= i;
      return f;
    };
    const bernoulli: Record<number, number> = { 2: 1 / 6, 4: -1 / 30, 6: 1 / 42 };
    const expected: Record<number, number> = { 2: Math.PI ** 2 / 6, 4: Math.PI ** 4 / 90, 6: Math.PI ** 6 / 945 };
    for (const p of [2, 4, 6]) {
      const n = p / 2;
      const b = bernoulli[p];
      const e = expected[p];
      if (b === undefined || e === undefined) throw new Error('test table incomplete');
      const value = (((-1) ** (n + 1) * b * (2 * Math.PI) ** p) / (2 * factorial(2 * n)));
      expect(value).toBeCloseTo(e, 9);
      expect(zetaEven(p).value).toBeCloseTo(e, 12);
    }
  });
});
