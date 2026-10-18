import type { LocalizedText } from './contracts.ts';

/**
 * Hand-authored learning paths: curated guided tours through the scenes,
 * grouped by theme. Pure data: no code, no DOM, no imports beyond types.
 * Read by the prerender script (Node) and the client-side paths pages.
 *
 * Conventions (same as meta.ts and glossary.ts): Korean lives only inside
 * `ko:` strings; inline math uses \(...\) delimiters (never $...$); every
 * step links to a real scene via chapterId + sceneId (verified by tests and
 * the prerender self-check). Steps are in the recommended reading order.
 */
export interface LearningPathStep {
  chapterId: string;
  sceneId: string;
}

export interface LearningPath {
  /** Stable kebab-case id, unique across paths. Used in /<lang>/paths/<id>/ URLs. */
  id: string;
  title: LocalizedText;
  /** One or two sentences. May embed \(...\) inline math. */
  description: LocalizedText;
  /** Ordered scenes of this path. */
  scenes: ReadonlyArray<LearningPathStep>;
}

export const learningPaths: readonly LearningPath[] = [
  {
    id: 'number-systems',
    title: { ko: '수 체계 완성하기', en: 'Building the Number Systems' },
    description: {
      ko: String.raw`자연수에서 칸토어 집합까지 — 수 체계를 하나씩 쌓아 올리는 여정. \(\mathbb{N} \to \mathbb{Z} \to \mathbb{Q} \to \mathbb{R}\)의 빈틈을 메우는 과정을 따라간다.`,
      en: String.raw`From natural numbers to the Cantor set — building the number systems one by one, filling the gaps from \(\mathbb{N}\) to \(\mathbb{R}\).`,
    },
    scenes: [
      { chapterId: 'numbers', sceneId: 'natural-numbers' },
      { chapterId: 'numbers', sceneId: 'binomial' },
      { chapterId: 'numbers', sceneId: 'integers-rationals' },
      { chapterId: 'numbers', sceneId: 'sets' },
      { chapterId: 'numbers', sceneId: 'supremum' },
      { chapterId: 'numbers', sceneId: 'countable' },
      { chapterId: 'sequences', sceneId: 'holes' },
      { chapterId: 'sequences', sceneId: 'construction' },
      { chapterId: 'topology', sceneId: 'cantor' },
      { chapterId: 'topology', sceneId: 'fat-cantor' },
    ],
  },
  {
    id: 'convergence-tests',
    title: { ko: '수렴 판정 정복', en: 'Mastering Convergence Tests' },
    description: {
      ko: '급수가 수렴하는지 판정하는 도구들을 순서대로 익힌다. 조화급수의 발산에서 시작해 정밀 판정법까지.',
      en: 'Master the convergence tests in order, from the divergence of the harmonic series to the delicate tests.',
    },
    scenes: [
      { chapterId: 'series', sceneId: 'harmonic' },
      { chapterId: 'series', sceneId: 'euler-mascheroni' },
      { chapterId: 'series', sceneId: 'tests' },
      { chapterId: 'series', sceneId: 'condensation' },
      { chapterId: 'series', sceneId: 'raabe-test' },
      { chapterId: 'series', sceneId: 'kummer-test' },
      { chapterId: 'series', sceneId: 'dirichlet-test' },
      { chapterId: 'series', sceneId: 'abel-test' },
      { chapterId: 'function-series', sceneId: 'm-test' },
      { chapterId: 'function-series', sceneId: 'dini' },
      { chapterId: 'power-series', sceneId: 'abel-theorem' },
      { chapterId: 'power-series', sceneId: 'tauber' },
      { chapterId: 'power-series', sceneId: 'riemann-rearrangement' },
    ],
  },
  {
    id: 'differentiation',
    title: { ko: '미분', en: 'Differentiation' },
    description: {
      ko: '엡실론-델타에서 시작해 미분의 핵심 정리들을 따라간다. 평균값 정리와 로피탈, 테일러까지.',
      en: "From epsilon-delta through the great theorems of differentiation: the mean value theorem, l'Hôpital, Taylor.",
    },
    scenes: [
      { chapterId: 'continuity', sceneId: 'epsdelta' },
      { chapterId: 'continuity', sceneId: 'continuity' },
      { chapterId: 'differentiation', sceneId: 'diffcont' },
      { chapterId: 'differentiation', sceneId: 'mvt' },
      { chapterId: 'differentiation', sceneId: 'cauchy-mvt' },
      { chapterId: 'differentiation', sceneId: 'darboux' },
      { chapterId: 'differentiation', sceneId: 'lhopital' },
      { chapterId: 'differentiation', sceneId: 'taylor-thm' },
      { chapterId: 'differentiation', sceneId: 'convex' },
    ],
  },
  {
    id: 'integration',
    title: { ko: '적분', en: 'Integration' },
    description: {
      ko: '리만 적분에서 르베그 적분까지 — 적분의 개념이 어떻게 확장되는지 따라간다.',
      en: 'From the Riemann integral to the Lebesgue integral — how the idea of integration expands.',
    },
    scenes: [
      { chapterId: 'integration', sceneId: 'riemann' },
      { chapterId: 'integration', sceneId: 'ftc' },
      { chapterId: 'integration', sceneId: 'improper' },
      { chapterId: 'integration', sceneId: 'gamma' },
      { chapterId: 'integration', sceneId: 'bohr-mollerup' },
      { chapterId: 'integration', sceneId: 'beta-function' },
      { chapterId: 'integration', sceneId: 'measure' },
      { chapterId: 'integration', sceneId: 'lebesgue' },
      { chapterId: 'integration', sceneId: 'absolute-continuity' },
    ],
  },
  {
    id: 'pathological',
    title: { ko: '병리적 함수들', en: 'Pathological Functions' },
    description: {
      ko: '직관을 깨뜨리는 함수들의 전시관. 연속이지만 미분 불가능하고, 기울기가 0인데 올라가는 함수들.',
      en: 'A gallery of intuition-breaking functions: continuous but nowhere differentiable, flat yet climbing.',
    },
    scenes: [
      { chapterId: 'topology', sceneId: 'cantor' },
      { chapterId: 'topology', sceneId: 'cantor-function' },
      { chapterId: 'differentiation', sceneId: 'weierstrass-function' },
      { chapterId: 'integration', sceneId: 'volterra-function' },
      { chapterId: 'integration', sceneId: 'bounded-variation' },
      { chapterId: 'integration', sceneId: 'jordan-decomposition' },
      { chapterId: 'differentiation', sceneId: 'darboux' },
      { chapterId: 'approximation', sceneId: 'weierstrass-approx' },
      { chapterId: 'continuity', sceneId: 'uniform' },
    ],
  },
  {
    id: 'completeness',
    title: { ko: '완비성과 컴팩트', en: 'Completeness and Compactness' },
    description: {
      ko: '완비성과 컴팩트성 — 해석학의 무대가 되는 공간들의 이야기. 축소사상부터 균등연속까지.',
      en: 'Completeness and compactness — the spaces where analysis happens, from contractions to uniform continuity.',
    },
    scenes: [
      { chapterId: 'topology', sceneId: 'metric-spaces' },
      { chapterId: 'topology', sceneId: 'contraction' },
      { chapterId: 'topology', sceneId: 'baire-category' },
      { chapterId: 'topology', sceneId: 'baire-1' },
      { chapterId: 'differentiation', sceneId: 'banach' },
      { chapterId: 'topology', sceneId: 'compact' },
      { chapterId: 'approximation', sceneId: 'arzela-ascoli' },
      { chapterId: 'sequences', sceneId: 'bolzano-weierstrass' },
      { chapterId: 'continuity', sceneId: 'evt' },
      { chapterId: 'continuity', sceneId: 'uniform-continuity' },
    ],
  },
];
