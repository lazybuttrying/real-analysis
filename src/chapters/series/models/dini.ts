import type { SceneModel } from '../../../contracts';

/**
 * Dini's theorem: on a compact set, a monotone sequence of continuous
 * functions converging pointwise to a continuous limit converges uniformly.
 *
 * Compact domain [0,1]: f_n(x) = n*x/(n+1) increases pointwise to f(x) = x.
 * Every f_n and f is continuous on the compact set [0,1], so Dini's theorem
 * gives uniform convergence. The worst-case gap is exact and easy to read:
 *   max_{x in [0,1]} |f(x) - f_n(x)| = 1/(n+1), attained at x = 1.
 *
 * Non-compact domain (0,1]: g_n(x) = x^n decreases pointwise to g(x) = 0 on
 * (0,1) (and g(1) = 1, so the limit is discontinuous at 1). Every g_n is
 * continuous, but the domain is not compact, and the sup gap stays stuck:
 *   sup_{x in (0,1]} |g(x) - g_n(x)| = 1 for every n (take x -> 1-).
 * The same monotone setup, with compactness missing, fails to be uniform.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Grid points per curve. */
export const GRID_POINTS = 241;
export const MIN_N = 1;
export const MAX_N = 60;
export const DEFAULT_N = 8;

const DOMAINS = ['compact', 'noncompact'] as const;
type Domain = (typeof DOMAINS)[number];

/** A sequence term on the compact domain: f_n(x) = n*x/(n+1), increasing in n. */
export function compactTerm(n: number, x: number): number {
  return (n * x) / (n + 1);
}

/** The limit on the compact domain: f(x) = x, continuous. */
export function compactLimit(x: number): number {
  return x;
}

/** Exact max gap on [0,1]: max_x |f(x) - f_n(x)| = 1/(n+1), attained at x = 1. */
export function compactMaxGap(n: number): number {
  return 1 / (n + 1);
}

/** A sequence term on the non-compact domain: g_n(x) = x^n, decreasing in n. */
export function noncompactTerm(n: number, x: number): number {
  return x ** n;
}

/** The candidate continuous limit on the non-compact domain: g(x) = 0. */
export function noncompactLimit(): number {
  return 0;
}

/** Sup gap on (0,1]: sup_x |g(x) - g_n(x)| = 1 for every n (x -> 1-). */
export function noncompactSupGap(): number {
  return 1;
}

function compactGrid(): number[] {
  const xs: number[] = [];
  for (let i = 0; i < GRID_POINTS; i++) {
    xs.push(i / (GRID_POINTS - 1));
  }
  return xs;
}

/** (0,1] sampled from 1/241 up to 1. */
function noncompactGrid(): number[] {
  const xs: number[] = [];
  for (let i = 0; i < GRID_POINTS; i++) {
    xs.push((i + 1) / GRID_POINTS);
  }
  return xs;
}

export interface DiniData {
  /** Sequence index shown (clamped to [1, 60]). */
  n: number;
  /** 'compact' = [0,1] (works), 'noncompact' = (0,1] (fails). */
  domain: Domain;
  /** Grid points x. */
  xs: number[];
  /** curves[k] = the (k+1)-th curve sampled on xs. */
  curves: number[][];
  /** Pointwise limit sampled on xs. */
  limit: number[];
  /** Exact uniform gap: 1/(n+1) on [0,1], 1 on (0,1]. */
  maxGap: number;
}

function parseDomain(raw: unknown): Domain {
  return raw === 'noncompact' ? 'noncompact' : 'compact';
}

export const diniModel: SceneModel<DiniData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw)
      ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(raw)))
      : DEFAULT_N;
    const domain = parseDomain(state['domain']);
    const xs = domain === 'compact' ? compactGrid() : noncompactGrid();
    const curves: number[][] = new Array<number[]>(n);
    const limit: number[] = new Array<number>(GRID_POINTS);
    for (let k = 1; k <= n; k++) {
      const row: number[] = new Array<number>(GRID_POINTS);
      for (let i = 0; i < GRID_POINTS; i++) {
        const x = xs[i] ?? 0;
        row[i] = domain === 'compact' ? compactTerm(k, x) : noncompactTerm(k, x);
      }
      curves[k - 1] = row;
    }
    for (let i = 0; i < GRID_POINTS; i++) {
      const x = xs[i] ?? 0;
      limit[i] = domain === 'compact' ? compactLimit(x) : noncompactLimit();
    }
    return {
      n,
      domain,
      xs,
      curves,
      limit,
      maxGap: domain === 'compact' ? compactMaxGap(n) : noncompactSupGap(),
    };
  },
};
