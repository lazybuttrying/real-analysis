import type { ProblemMeta } from '../../contracts.ts';
import { absoluteValueProblems } from '../limits/problems/absolute-value';
import { archimedeanProblems } from '../limits/problems/archimedean';
import { axiomOfChoiceProblems } from '../limits/problems/axiom-of-choice';
import { problems as binomialProblems } from '../limits/problems/binomial';
import { cantorTheoremProblems } from '../limits/problems/cantor-theorem';
import { complexNumbersProblems } from '../limits/problems/complex-numbers';
import { problems as countableProblems } from '../limits/problems/countable';
import { densityOfRationalsProblems } from '../limits/problems/density-of-rationals';
import { problems as dimensionRankProblems } from '../limits/problems/dimension-rank';
import { problems as groupsFieldsProblems } from '../limits/problems/groups-fields';
import { problems as integersRationalsProblems } from '../limits/problems/integers-rationals';
import { problems as naturalNumbersProblems } from '../limits/problems/natural-numbers';
import { nthRootProblems } from '../limits/problems/nth-root';
import { orderedFieldsProblems } from '../limits/problems/ordered-fields';
import { problems as setsProblems } from '../limits/problems/sets';
import { problems as supremumProblems } from '../limits/problems/supremum';
import { sqrt2IrrationalProblems } from '../limits/problems/sqrt2-irrational';
import { problems as vectorSpacesProblems } from '../limits/problems/vector-spaces';
import { zornLemmaProblems } from '../limits/problems/zorn-lemma';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'natural-numbers': naturalNumbersProblems,
  'binomial': binomialProblems,
  'integers-rationals': integersRationalsProblems,
  'absolute-value': absoluteValueProblems,
  'complex-numbers': complexNumbersProblems,
  'sqrt2-irrational': sqrt2IrrationalProblems,
  'density-of-rationals': densityOfRationalsProblems,
  'sets': setsProblems,
  'axiom-of-choice': axiomOfChoiceProblems,
  'zorn-lemma': zornLemmaProblems,
  'supremum': supremumProblems,
  'archimedean': archimedeanProblems,
  'nth-root': nthRootProblems,
  'countable': countableProblems,
  'cantor-theorem': cantorTheoremProblems,
  'groups-fields': groupsFieldsProblems,
  'ordered-fields': orderedFieldsProblems,
  'vector-spaces': vectorSpacesProblems,
  'dimension-rank': dimensionRankProblems,
};
