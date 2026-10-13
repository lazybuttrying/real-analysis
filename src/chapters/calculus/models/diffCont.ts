import type { SceneModel } from '../../../contracts';

/**
 * Differentiable implies continuous. The demo function is f(x) = |x|: its
 * difference quotients at the corner x = 0 are exactly -1 (left) and +1
 * (right), and the corner survives every zoom of the viewing window.
 * Pure computation: no DOM, d3, or three.
 */

export interface DiffContSample {
  x: number;
  y: number;
}

export interface DiffContData {
  /** Slider position: 1 (widest window) to 8 (deepest zoom). */
  zoom: number;
  /** Half-width of the viewing window: 2^{1-zoom}. */
  w: number;
  /** 200 samples of |x| on [-w, w]. */
  samples: DiffContSample[];
  /** [f(0+h)-f(0)]/h at h = -w/2: exactly -1. */
  leftQuotient: number;
  /** [f(0+h)-f(0)]/h at h = +w/2: exactly +1. */
  rightQuotient: number;
}

/** Half-width of the viewing window for a zoom level: 2^{1-zoom}. */
export function diffContHalfWidth(zoom: number): number {
  return Math.pow(2, 1 - zoom);
}

export function diffContData(zoom: number): DiffContData {
  const clamped = Math.min(8, Math.max(1, Math.round(zoom)));
  const w = diffContHalfWidth(clamped);
  const samples: DiffContSample[] = [];
  const n = 200;
  for (let i = 0; i < n; i++) {
    const x = -w + (2 * w * i) / (n - 1);
    samples.push({ x, y: Math.abs(x) });
  }
  // w is an exact power of two, so these divisions are exact: -1 and +1.
  const hL = -w / 2;
  const hR = w / 2;
  return {
    zoom: clamped,
    w,
    samples,
    leftQuotient: (Math.abs(hL) - 0) / hL,
    rightQuotient: (Math.abs(hR) - 0) / hR,
  };
}

export const diffContModel: SceneModel<DiffContData> = {
  compute(state) {
    const raw = Number(state['zoom']);
    const zoom = Number.isFinite(raw) ? raw : 1;
    return diffContData(zoom);
  },
};
