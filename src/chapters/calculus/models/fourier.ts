import type { SceneModel } from '../../../contracts';

/**
 * The Fourier partial sums of the square wave on (-pi, pi):
 *   S_N(x) = (4/pi) * sum_{k=1}^{N} sin((2k-1) x) / (2k-1).
 * They converge to +/-1 away from the jumps, but near each jump the sums
 * overshoot by a fixed amount: the Gibbs phenomenon. The overshoot tends to
 * 2*Si(pi)/pi - 1 ≈ 0.17898, i.e. about 8.95% of the jump of size 2.
 * Pure computation: no DOM, d3, or three.
 */

/** The Gibbs constant: the limiting peak of the partial sums near the jump. */
export const GIBBS_PEAK = 1.178979744472167;

/** Jump size of the square wave (from -1 to 1). */
const SQUARE_JUMP = 2;

function squareWave(x: number): number {
  const s = Math.sin(x);
  if (s > 1e-12) return 1;
  if (s < -1e-12) return -1;
  return 0;
}

export function fourierPartialSum(x: number, n: number): number {
  let sum = 0;
  for (let k = 1; k <= n; k++) {
    const odd = 2 * k - 1;
    sum += Math.sin(odd * x) / odd;
  }
  return (4 / Math.PI) * sum;
}

export interface FourierSample {
  x: number;
  y: number;
  target: number;
}

export interface FourierData {
  n: number;
  /** Peak of S_N just right of the jump at 0 (numerical). */
  gibbsMax: number;
  /** Overshoot as a fraction of the jump size. */
  overshootFraction: number;
  samples: FourierSample[];
}

export function fourierData(n: number): FourierData {
  const nn = Math.max(1, Math.min(60, Math.round(n)));
  const samples: FourierSample[] = [];
  const m = 1200;
  for (let i = 0; i <= m; i++) {
    const x = -Math.PI + ((2 * Math.PI) * i) / m;
    samples.push({ x, y: fourierPartialSum(x, nn), target: squareWave(x) });
  }
  // Peak just right of the jump: the first lobe sits near x = pi/(2N).
  let gibbsMax = 0;
  const g = 4000;
  for (let i = 1; i <= g; i++) {
    const x = (0.8 * i) / g;
    const v = fourierPartialSum(x, nn);
    if (v > gibbsMax) gibbsMax = v;
  }
  return {
    n: nn,
    gibbsMax,
    overshootFraction: (gibbsMax - 1) / SQUARE_JUMP,
    samples,
  };
}

export const fourierModel: SceneModel<FourierData> = {
  compute(state) {
    const raw = Number(state['N']);
    const n = Number.isFinite(raw) ? raw : 8;
    return fourierData(n);
  },
};
