import type { SceneModel } from '../../../contracts';

/**
 * The topologist's sine curve, live: S = {(x, sin(1/x)) : x > 0} plotted on
 * [xMin, 2], the limit segment {0} x [-1, 1] (the rest of the closure), and
 * the three witness sequences x_n -> 0 with sin(1/x_n) = 1, -1, 0.
 * The curve is sampled uniformly in t = 1/x so the oscillations near 0 are
 * rendered faithfully. Pure computation: no DOM, d3, or three.
 */

export const TS_XMIN_MIN = 0.005;
export const TS_XMIN_MAX = 1;
export const TS_XMIN_INIT = 0.05;

export const TS_XMAX = 2;

export const TS_SHOW_SEGMENT_INIT = true;
export const TS_SHOW_SEQ_INIT = true;

/** Number of curve samples (uniform in t = 1/x). */
export const TS_N_PTS = 4000;

export type Pt2 = readonly [number, number];

export interface TopologistSineData {
  readonly xMin: number;
  readonly showSegment: boolean;
  readonly showSeq: boolean;
  /** The graph of sin(1/x) on [xMin, 2], x ascending. */
  readonly pts: Pt2[];
  /** (x_n, 1) with x_n = 1/(pi/2 + 2 pi n), converging to (0, 1). */
  readonly seqPlus: Pt2[];
  /** (x_n, -1) with x_n = 1/(3 pi/2 + 2 pi n), converging to (0, -1). */
  readonly seqMinus: Pt2[];
  /** (x_n, 0) with x_n = 1/(pi n), converging to (0, 0). */
  readonly seqZero: Pt2[];
}

function clampXMin(xMin: number): number {
  if (!Number.isFinite(xMin)) return TS_XMIN_INIT;
  return Math.max(TS_XMIN_MIN, Math.min(TS_XMIN_MAX, xMin));
}

function clampToggle(v: unknown, init: boolean): boolean {
  return typeof v === 'boolean' ? v : init;
}

function topologistSineData(
  xMin: number,
  showSegment: boolean,
  showSeq: boolean,
): TopologistSineData {
  const xm = clampXMin(xMin);
  const pts: Pt2[] = new Array(TS_N_PTS + 1);
  const tLo = 1 / TS_XMAX;
  const tHi = 1 / xm;
  for (let i = 0; i <= TS_N_PTS; i++) {
    // i = 0 gives t = tHi (x = xMin); i = TS_N_PTS gives t = tLo (x = 2):
    // x ascending.
    const t = tHi - ((tHi - tLo) * i) / TS_N_PTS;
    pts[i] = [1 / t, Math.sin(t)];
  }
  const seqPlus: Pt2[] = [];
  const seqMinus: Pt2[] = [];
  const seqZero: Pt2[] = [];
  for (let n = 0; ; n++) {
    const t = Math.PI / 2 + 2 * Math.PI * n;
    const x = 1 / t;
    if (x < xm) break;
    if (x <= TS_XMAX) seqPlus.push([x, Math.sin(t)]);
  }
  for (let n = 0; ; n++) {
    const t = (3 * Math.PI) / 2 + 2 * Math.PI * n;
    const x = 1 / t;
    if (x < xm) break;
    if (x <= TS_XMAX) seqMinus.push([x, Math.sin(t)]);
  }
  for (let n = 1; ; n++) {
    const t = Math.PI * n;
    const x = 1 / t;
    if (x < xm) break;
    if (x <= TS_XMAX) seqZero.push([x, Math.sin(t)]);
  }
  return { xMin: xm, showSegment, showSeq, pts, seqPlus, seqMinus, seqZero };
}

export const topologistSineModel: SceneModel<TopologistSineData> = {
  compute(state) {
    return topologistSineData(
      Number(state['xMin']),
      clampToggle(state['showSegment'], TS_SHOW_SEGMENT_INIT),
      clampToggle(state['showSeq'], TS_SHOW_SEQ_INIT),
    );
  },
};
