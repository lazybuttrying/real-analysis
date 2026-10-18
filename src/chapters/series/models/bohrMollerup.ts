import type { SceneModel } from '../../../contracts';
import { gamma } from './gamma';

/**
 * Bohr-Mollerup playground: the impostor f_a(x) = Gamma(x) (1 + a sin(2 pi x)).
 *
 * The impostor satisfies the two algebraic fingerprints of Gamma:
 *   f_a(1) = 1                      (sin 2 pi = 0)
 *   f_a(x+1) = x f_a(x)             (sin is 2 pi-periodic)
 * and stays positive for |a| < 1. But log f_a = ln Gamma + ln(1 + a sin(2 pi x))
 * is NOT convex: the sine wobble breaks log-convexity. Log-convexity is the
 * fingerprint that only Gamma carries (the Bohr-Mollerup theorem), and this
 * scene lets the user see the impostor fail it.
 *
 * The secant test: at a probe point x0, the chord C(t) of log f over [x0, x0+1]
 * is compared with the graph on a fine grid. The violation
 *   violation = max(0, max_t (logF(t) - C(t)))
 * is positive exactly where the graph pokes ABOVE the chord, i.e. where the
 * chord dips below the graph and convexity fails. The same computation on
 * log Gamma stays at 0 (up to quadrature noise ~1e-9; negative values are
 * clamped to 0).
 *
 * Verified identities (tests/bohr-mollerup.test.ts):
 *   f_a(1) = 1 within 1e-9 for a in {0, 0.15, 0.3, 0.5}
 *   f_a(x+1) = x f_a(x) within 1e-9 (relative) for grid x in (0, 2]
 *   f_a(x) > 0 for all grid x in [0.05, 3] and |a| <= 0.5
 *   violationG = 0 (clamped; raw max ~4e-17)
 *   violationF(a = 0.3, probe = 0.6) ~ 0.297 (> 0: convexity fails)
 */

export const N_PTS = 240;
export const X_MIN = 0.05;
export const X_MAX = 3;
/**
 * Points on the secant-test grid over [x0, x0+1]. The graph is evaluated
 * exactly (via gamma) on this grid rather than interpolated from the coarse
 * plot grid: linear interpolation of the convex ln Gamma overshoots it by up
 * to ~1e-4 near x = 0.05, which would swamp the reference violation of 0.
 */
export const GRID_PTS = 160;

export const AMP_MIN = 0;
export const AMP_MAX = 0.5;
export const DEFAULT_AMP = 0.3;

export const PROBE_MIN = 0.2;
export const PROBE_MAX = 1.8;
export const DEFAULT_PROBE = 0.6;

/** The wobble factor w_a(x) = 1 + a sin(2 pi x); positive for |a| < 1. */
export function wobble(a: number, x: number): number {
  return 1 + a * Math.sin(2 * Math.PI * x);
}

/** The impostor f_a(x) = Gamma(x) (1 + a sin(2 pi x)). */
export function impostor(a: number, x: number): number {
  return gamma(x) * wobble(a, x);
}

export interface BohrMollerupData {
  amp: number;
  probe: number;
  /** 240 sample points on [0.05, 3]. */
  xs: number[];
  /** ln Gamma(x_i). */
  logG: number[];
  /** ln f_a(x_i). */
  logF: number[];
  /** Left end of the secant interval [x0, x0+1]. */
  probeLeft: number;
  /** Right end x0 + 1. */
  probeRight: number;
  /** Fine grid on [x0, x0+1] for the chord. */
  chordXs: number[];
  /** Chord C(t) of logF over [x0, x0+1] on chordXs. */
  chordF: number[];
  /** logF(t) on the fine grid chordXs (for shading the convexity gaps). */
  graphF: number[];
  /** Where the chord of logF dips below the graph: sample xs there. */
  belowXs: number[];
  /** Chord values at belowXs. */
  belowChord: number[];
  /** Graph (logF) values at belowXs. */
  belowGraph: number[];
  /** max(0, max_t (logF(t) - C(t))): > 0 means the graph rises above the chord, i.e. convexity fails for f_a. */
  violationF: number;
  /** Same for log Gamma: 0 up to quadrature noise (clamped). */
  violationG: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** ln f_a(t) = ln Gamma(t) + ln(1 + a sin(2 pi t)), evaluated exactly. */
export function logImpostor(a: number, t: number): number {
  return Math.log(gamma(t)) + Math.log(wobble(a, t));
}

/** ln Gamma(t), evaluated exactly. */
function logGamma(t: number): number {
  return Math.log(gamma(t));
}

export function bohrMollerupData(amp: number, probe: number): BohrMollerupData {
  const xs: number[] = [];
  const logG: number[] = [];
  const logF: number[] = [];
  for (let i = 0; i < N_PTS; i++) {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / (N_PTS - 1);
    const lg = logGamma(x);
    xs.push(x);
    logG.push(lg);
    logF.push(lg + Math.log(wobble(amp, x)));
  }
  const probeLeft = probe;
  const probeRight = probe + 1;
  const fL = logImpostor(amp, probeLeft);
  const fR = logImpostor(amp, probeRight);
  const gL = logGamma(probeLeft);
  const gR = logGamma(probeRight);

  const chordXs: number[] = [];
  const chordF: number[] = [];
  const graphF: number[] = [];
  const belowXs: number[] = [];
  const belowChord: number[] = [];
  const belowGraph: number[] = [];
  let rawF = -Infinity;
  let rawG = -Infinity;
  for (let i = 0; i < GRID_PTS; i++) {
    const s = i / (GRID_PTS - 1);
    const t = probeLeft + s * (probeRight - probeLeft);
    const lg = logGamma(t);
    const lf = lg + Math.log(wobble(amp, t));
    const cF = lerp(fL, fR, s);
    const cG = lerp(gL, gR, s);
    chordXs.push(t);
    chordF.push(cF);
    graphF.push(lf);
    rawF = Math.max(rawF, lf - cF);
    rawG = Math.max(rawG, lg - cG);
    if (lf - cF > 0) {
      belowXs.push(t);
      belowChord.push(cF);
      belowGraph.push(lf);
    }
  }
  return {
    amp,
    probe,
    xs,
    logG,
    logF,
    probeLeft,
    probeRight,
    chordXs,
    chordF,
    graphF,
    belowXs,
    belowChord,
    belowGraph,
    violationF: Math.max(0, rawF),
    violationG: Math.max(0, rawG),
  };
}

export const bohrMollerupModel: SceneModel<BohrMollerupData> = {
  compute(state) {
    const rawAmp = Number(state['amp']);
    const amp = Number.isFinite(rawAmp)
      ? Math.min(AMP_MAX, Math.max(AMP_MIN, rawAmp))
      : DEFAULT_AMP;
    const rawProbe = Number(state['probe']);
    const probe = Number.isFinite(rawProbe)
      ? Math.min(PROBE_MAX, Math.max(PROBE_MIN, rawProbe))
      : DEFAULT_PROBE;
    return bohrMollerupData(amp, probe);
  },
};
