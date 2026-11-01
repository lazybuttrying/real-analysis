import type { ProblemMeta } from '../../contracts.ts';
import { absoluteContinuityProblems } from '../calculus/problems/absolute-continuity';
import { arcLengthProblems } from '../calculus/problems/arc-length';
import { convolutionProblems } from '../calculus/problems/convolution';
import { bohrMollerupProblems } from '../series/problems/bohr-mollerup';
import { borelCantelliProblems } from '../calculus/problems/borel-cantelli';
import { boundedVariationProblems } from '../calculus/problems/bounded-variation';
import { jordanDecompositionProblems } from '../calculus/problems/jordan-decomposition';
import { problems as betaFunctionProblems } from '../series/problems/beta-function';
import { problems as ftcProblems } from '../calculus/problems/ftc';
import { changeOfVariablesProblems } from '../calculus/problems/change-of-variables';
import { dirichletFunctionProblems } from '../calculus/problems/dirichlet-function';
import { differentiationUnderIntegralProblems } from '../calculus/problems/differentiation-under-integral';
import { minkowskiProblems } from '../calculus/problems/minkowski';
import { egorovProblems } from '../calculus/problems/egorov';
import { fubiniTonelliProblems } from '../calculus/problems/fubini-tonelli';
import { gabrielHornProblems } from '../calculus/problems/gabriel-horn';
import { riemannStieltjesProblems } from '../calculus/problems/riemann-stieltjes';
import { integrationByPartsProblems } from '../calculus/problems/integration-by-parts';
import { problems as gammaProblems } from '../series/problems/gamma';
import { problems as improperProblems } from '../series/problems/improper';
import { problems as lebesgueProblems } from '../calculus/problems/lebesgue';
import { lebesgueConvergenceProblems } from '../calculus/problems/lebesgue-convergence';
import { problems as measureProblems } from '../calculus/problems/measure';
import { problems as riemannProblems } from '../calculus/problems/riemann';
import { vitaliProblems } from '../calculus/problems/vitali';
import { volterraFunctionProblems } from '../calculus/problems/volterra-function';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'gamma': gammaProblems,
  'beta-function': betaFunctionProblems,
  'bohr-mollerup': bohrMollerupProblems,
  'improper': improperProblems,
  'gabriel-horn': gabrielHornProblems,
  'riemann': riemannProblems,
  'dirichlet-function': dirichletFunctionProblems,
  'volterra-function': volterraFunctionProblems,
  'ftc': ftcProblems,
  'integration-by-parts': integrationByPartsProblems,
  'change-of-variables': changeOfVariablesProblems,
  'bounded-variation': boundedVariationProblems,
  'arc-length': arcLengthProblems,
  'riemann-stieltjes': riemannStieltjesProblems,
  'jordan-decomposition': jordanDecompositionProblems,
  'measure': measureProblems,
  'vitali': vitaliProblems,
  'borel-cantelli': borelCantelliProblems,
  'lebesgue': lebesgueProblems,
  'lebesgue-convergence': lebesgueConvergenceProblems,
  'fubini-tonelli': fubiniTonelliProblems,
  'convolution': convolutionProblems,
  'egorov': egorovProblems,
  'absolute-continuity': absoluteContinuityProblems,
  'differentiation-under-integral': differentiationUnderIntegralProblems,
  'minkowski': minkowskiProblems,
};
