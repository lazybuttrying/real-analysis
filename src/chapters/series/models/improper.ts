import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 *
 * Two families of improper integrals of x^{-p}:
 *   tail:     int_1^R x^{-p} dx, extended as R -> infinity;
 *             converges iff p > 1, with limit 1/(p-1).
 *   singular: int_eps^1 x^{-p} dx, extended as eps -> 0+;
 *             converges iff p < 1, with limit 1/(1-p).
 */

export type ImproperKind = 'tail' | 'singular';

export interface ImproperSample {
  x: number;
  y: number;
}

export interface ImproperData {
  kind: ImproperKind;
  p: number;
  R: number;
  eps: number;
  /** Curve samples of x^{-p} over the integration interval. */
  samples: ImproperSample[];
  /** Closed-form area over the current finite interval. */
  area: number;
  /** Limit of the area as the interval extends, or null when it diverges. */
  limit: number | null;
  converges: boolean;
}

export const SAMPLE_COUNT = 240;

function nearOne(p: number): boolean {
  return Math.abs(p - 1) < 1e-9;
}

export function improperArea(
  kind: ImproperKind,
  p: number,
  R: number,
  eps: number,
): { area: number; limit: number | null; converges: boolean } {
  if (kind === 'tail') {
    const converges = p > 1;
    const area = nearOne(p) ? Math.log(R) : (Math.pow(R, 1 - p) - 1) / (1 - p);
    const limit = p > 1 ? 1 / (p - 1) : null;
    return { area, limit, converges };
  }
  const converges = p < 1;
  const area = nearOne(p) ? -Math.log(eps) : (1 - Math.pow(eps, 1 - p)) / (1 - p);
  const limit = p < 1 ? 1 / (1 - p) : null;
  return { area, limit, converges };
}

export function improperData(kind: ImproperKind, p: number, R: number, eps: number): ImproperData {
  const samples: ImproperSample[] = [];
  if (kind === 'tail') {
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = 1 + ((R - 1) * i) / (SAMPLE_COUNT - 1);
      samples.push({ x, y: Math.pow(x, -p) });
    }
  } else {
    // Geometric spacing resolves the spike near the singularity at x = eps.
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = eps * Math.pow(1 / eps, i / (SAMPLE_COUNT - 1));
      samples.push({ x, y: Math.pow(x, -p) });
    }
  }
  const { area, limit, converges } = improperArea(kind, p, R, eps);
  return { kind, p, R, eps, samples, area, limit, converges };
}

export const improperModel: SceneModel<ImproperData> = {
  compute(state) {
    const kind: ImproperKind = String(state['kind']) === 'singular' ? 'singular' : 'tail';
    const pRaw = Number(state['p']);
    const p = Number.isFinite(pRaw) ? Math.min(2, Math.max(0.5, pRaw)) : 1;
    const rRaw = Number(state['R']);
    const R = Number.isFinite(rRaw) ? Math.min(50, Math.max(2, Math.floor(rRaw))) : 10;
    const eRaw = Number(state['eps']);
    const eps = Number.isFinite(eRaw) ? Math.min(0.5, Math.max(0.001, eRaw)) : 0.01;
    return improperData(kind, p, R, eps);
  },
};
