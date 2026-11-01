import type { ProblemMeta } from '../../contracts.ts';
import { baireCategoryProblems } from '../limits/problems/baire-category';
import { baireOneProblems } from '../limits/problems/baire-1';
import { clopenProblems } from '../limits/problems/clopen';
import { connectedProblems } from '../limits/problems/connected';
import { fatCantorProblems } from '../limits/problems/fat-cantor';
import { peanoCurveProblems } from '../limits/problems/peano-curve';
import { topologistSineProblems } from '../limits/problems/topologist-sine';
import { problems as cantorFunctionProblems } from '../limits/problems/cantor-function';
import { problems as cantorProblems } from '../limits/problems/cantor';
import { problems as closureProblems } from '../limits/problems/closure';
import { problems as compactProblems } from '../limits/problems/compact';
import { problems as contractionProblems } from '../limits/problems/contraction';
import { problems as metricSpacesProblems } from '../limits/problems/metric-spaces';
import { problems as opensetsProblems } from '../limits/problems/opensets';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'opensets': opensetsProblems,
  'clopen': clopenProblems,
  'connected': connectedProblems,
  'closure': closureProblems,
  'compact': compactProblems,
  'topologist-sine': topologistSineProblems,
  'peano-curve': peanoCurveProblems,
  'metric-spaces': metricSpacesProblems,
  'contraction': contractionProblems,
  'baire-category': baireCategoryProblems,
  'baire-1': baireOneProblems,
  'cantor': cantorProblems,
  'fat-cantor': fatCantorProblems,
  'cantor-function': cantorFunctionProblems,
};
