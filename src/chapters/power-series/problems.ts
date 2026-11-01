import type { ProblemMeta } from '../../contracts.ts';
import { hadamardGapProblems } from '../series/problems/hadamard-gap';
import { problems as abelTheoremProblems } from '../series/problems/abel-theorem';
import { problems as absoluteProblems } from '../series/problems/absolute';
import { problems as cauchyProductProblems } from '../series/problems/cauchy-product';
import { problems as eseriesProblems } from '../series/problems/eseries';
import { problems as powerSeriesProblems } from '../series/problems/power-series';
import { problems as rearrangementProblems } from '../series/problems/rearrangement';
import { problems as zeta4Problems } from '../series/problems/zeta4';
import { riemannRearrangementProblems } from '../series/problems/riemann-rearrangement';
import { tauberProblems } from '../series/problems/tauber';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'power-series': powerSeriesProblems,
  'hadamard-gap': hadamardGapProblems,
  'abel-theorem': abelTheoremProblems,
  'tauber': tauberProblems,
  'eseries': eseriesProblems,
  'zeta4': zeta4Problems,
  'rearrangement': rearrangementProblems,
  'absolute': absoluteProblems,
  'riemann-rearrangement': riemannRearrangementProblems,
  'cauchy-product': cauchyProductProblems,
};
