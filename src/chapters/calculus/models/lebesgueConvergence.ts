import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis II (measure theory): three concrete sequences on the line
 * that separate the convergence theorems. Each is simple enough that every
 * number below is exact, not numerical.
 *
 * - 'escape': f_n = 1_[n,n+1]. Mass slides to infinity. int f_n = 1 for
 *   every n, but the pointwise limit is 0 everywhere, so int lim f_n = 0.
 *   No integrable dominating g exists on [0, infinity): any g >= f_n for
 *   all n satisfies g >= 1 on [1, infinity), so int g = infinity.
 * - 'spike': f_n = n * 1_[0,1/n]. Mass concentrates at one point.
 *   int f_n = 1 for every n; liminf_n f_n = 0 except at x = 0 (a null set),
 *   so int liminf f_n = 0 < 1 = liminf int f_n: Fatou is strict.
 * - 'monotone': f_n = 1_[0,1-1/n] increases to 1_[0,1).
 *   int f_n = 1 - 1/n rises to 1 = int lim f_n: MCT holds with equality.
 *
 * Integrals are over the line (the natural support of each f_n); the scene
 * only draws the [0, 2] window. Pure computation: no DOM, d3, or three.
 */

export const N_MIN = 1;
export const N_MAX = 40;
export const N_INIT = 10;

export const EXAMPLE_OPTIONS = ['escape', 'spike', 'monotone'] as const;
export type ExampleKind = (typeof EXAMPLE_OPTIONS)[number];
export const EXAMPLE_INIT: ExampleKind = 'escape';

/** The scene's drawing window. */
export const VIEW_MIN = 0;
export const VIEW_MAX = 2;

export interface FnRect {
  x0: number;
  x1: number;
  height: number;
}

/** Exact integral of f_n over the line. */
export function fnIntegral(example: ExampleKind, n: number): number {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  switch (example) {
    case 'escape':
      return 1;
    case 'spike':
      return 1;
    case 'monotone':
      return 1 - 1 / nn;
  }
}

/** Integral of the pointwise limit over the line (a.e. limit for 'spike'). */
export function limitIntegral(example: ExampleKind): number {
  switch (example) {
    case 'escape':
      return 0;
    case 'spike':
      return 0;
    case 'monotone':
      return 1;
  }
}

/** Rectangles drawing f_n, clipped to the [VIEW_MIN, VIEW_MAX] window. */
export function fnRects(example: ExampleKind, n: number): FnRect[] {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  switch (example) {
    case 'escape': {
      // 1_[n,n+1]; visible only while it overlaps [0, 2].
      const x0 = Math.max(nn, VIEW_MIN);
      const x1 = Math.min(nn + 1, VIEW_MAX);
      return x1 > x0 ? [{ x0, x1, height: 1 }] : [];
    }
    case 'spike':
      return [{ x0: 0, x1: 1 / nn, height: nn }];
    case 'monotone':
      return [{ x0: 0, x1: 1 - 1 / nn, height: 1 }];
  }
}

/** Rectangles drawing the pointwise limit, clipped to the window. */
export function limitRects(example: ExampleKind): FnRect[] {
  switch (example) {
    case 'escape':
      return [];
    case 'spike':
      return [];
    case 'monotone':
      return [{ x0: 0, x1: 1, height: 1 }];
  }
}

/** Tallest f_n value on the window: drives the y-axis scale. */
export function fnMaxHeight(example: ExampleKind, n: number): number {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  return example === 'spike' ? nn : 1;
}

function verdictText(example: ExampleKind, integral: number, limit: number): { ko: string; en: string } {
  const gap = integral - limit;
  switch (example) {
    case 'escape':
      return {
        ko: String.raw`\(\int f_n = 1\) (모든 \(n\))이지만 \(\int \lim f_n = 0\) — 질량이 무한대로 도망가서 극한에 남지 않습니다. \([0, \infty)\) 위에서 모든 \(f_n\)을 지배하는 적분 가능한 \(g\)는 존재하지 않으므로, 이 수열에는 DCT를 적용할 수 없습니다.`,
        en: String.raw`\(\int f_n = 1\) for every \(n\), but \(\int \lim f_n = 0\) — the mass escapes to infinity and nothing survives the limit. No integrable \(g\) on \([0, \infty)\) dominates every \(f_n\), so DCT does not apply to this sequence.`,
      };
    case 'spike':
      return {
        ko: String.raw`\(\int f_n = 1\) (모든 \(n\))이지만 \(\int \liminf f_n = 0\) — 파투 부등식이 엄격합니다 (\(\text{차이} = ${gap}\)). 질량이 한 점으로 모였다가 극한에서 사라집니다.`,
        en: String.raw`\(\int f_n = 1\) for every \(n\), but \(\int \liminf f_n = 0\) — Fatou's inequality is strict (\(\text{gap} = ${gap}\)). The mass concentrates at a single point and vanishes in the limit.`,
      };
    case 'monotone':
      return {
        ko: String.raw`\(\int f_n = ${integral}\)이 \(1\)로 증가하고 \(\int \lim f_n = ${limit}\) — 단조수렴정리가 등식으로 성립합니다. 질량이 도망가지도, 한 점으로 모이지도 않습니다.`,
        en: String.raw`\(\int f_n = ${integral}\) increases to \(1\), and \(\int \lim f_n = ${limit}\) — the monotone convergence theorem holds with equality. No mass escapes, none concentrates.`,
      };
  }
}

export interface LebesgueConvergenceData {
  example: ExampleKind;
  n: number;
  /** Exact integral of f_n over the line. */
  integral: number;
  /** Integral of the pointwise limit over the line. */
  limitIntegral: number;
  /** Signed integral - limitIntegral (negative for monotone: the limit captures more). */
  gap: number;
  rects: FnRect[];
  limitRects: FnRect[];
  maxHeight: number;
  verdict: { ko: string; en: string };
}

export function lebesgueConvergenceData(example: ExampleKind, n: number): LebesgueConvergenceData {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  const integral = fnIntegral(example, nn);
  const lim = limitIntegral(example);
  return {
    example,
    n: nn,
    integral,
    limitIntegral: lim,
    gap: integral - lim,
    rects: fnRects(example, nn),
    limitRects: limitRects(example),
    maxHeight: fnMaxHeight(example, nn),
    verdict: verdictText(example, integral, lim),
  };
}

export const lebesgueConvergenceModel: SceneModel<LebesgueConvergenceData> = {
  compute(state) {
    const rawExample = String(state['example'] ?? '');
    const example: ExampleKind = (EXAMPLE_OPTIONS as readonly string[]).includes(rawExample)
      ? (rawExample as ExampleKind)
      : EXAMPLE_INIT;
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN) ? rawN : N_INIT;
    return lebesgueConvergenceData(example, n);
  },
};
