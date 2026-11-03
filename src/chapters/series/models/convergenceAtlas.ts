import type { LocalizedText, SceneModel } from '../../../contracts';

/**
 * The convergence atlas: nine exemplar series on one 3 by 3 grid, in
 * the format of the wave-concepts poster. One card per series, each
 * card holding only a title, a sparkline of its partial sums, and a
 * one-line verdict. The point of the grid is comparison at a glance:
 * terms going to zero is not enough (the harmonic card grows forever),
 * a bounded sparkline is not enough (the Grandi card oscillates), and
 * convergence without absolute convergence is its own card.
 * Pure computation: no DOM, d3, or three.
 */

export interface AtlasCardDef {
  id: string;
  title: LocalizedText;
  /** Formula shown on the card as one inline TeX span, rendered inside the SVG via svgText. */
  formula: string;
  /** The test or idea this card stands for, one line. */
  criterion: LocalizedText;
  converges: boolean;
  /** The sum when it converges, otherwise null. */
  limit: number | null;
  term: (k: number) => number;
}

export const ATLAS_CARDS: readonly AtlasCardDef[] = [
  {
    id: 'geometric',
    title: { ko: '기하급수', en: 'Geometric' },
    formula: String.raw`\(\sum (1/2)^k\)`,
    criterion: { ko: '비율 판정', en: 'ratio test' },
    converges: true,
    limit: 1,
    term: (k) => Math.pow(1 / 2, k),
  },
  {
    id: 'harmonic',
    title: { ko: '조화급수', en: 'Harmonic' },
    formula: String.raw`\(\sum 1/k\)`,
    criterion: { ko: '항→0에도 발산', en: 'terms to 0, diverges' },
    converges: false,
    limit: null,
    term: (k) => 1 / k,
  },
  {
    id: 'basel',
    title: { ko: String.raw`\(p\)급수, \(p = 2\)`, en: String.raw`\(p\)-series, \(p = 2\)` },
    formula: String.raw`\(\sum 1/k^2\)`,
    criterion: { ko: '적분 판정', en: 'integral test' },
    converges: true,
    limit: (Math.PI * Math.PI) / 6,
    term: (k) => 1 / (k * k),
  },
  {
    id: 'leibniz',
    title: { ko: '교대 조화급수', en: 'Alternating harmonic' },
    formula: String.raw`\(\sum (-1)^{k+1}/k\)`,
    criterion: { ko: '라이프니츠, 조건부', en: 'Leibniz, conditional' },
    converges: true,
    limit: Math.LN2,
    term: (k) => ((k % 2 === 1 ? 1 : -1) * 1) / k,
  },
  {
    id: 'absolute',
    title: { ko: '절댓값 급수', en: 'Absolute version' },
    formula: String.raw`\(\sum |(-1)^{k+1}/k|\)`,
    criterion: { ko: '절댓값 = 조화급수', en: 'absolute = harmonic' },
    converges: false,
    limit: null,
    term: (k) => 1 / k,
  },
  {
    id: 'telescoping',
    title: { ko: '망원급수', en: 'Telescoping' },
    formula: String.raw`\(\sum 1/(k(k+1))\)`,
    criterion: { ko: '부분분수 상쇄', en: 'cancellation' },
    converges: true,
    limit: 1,
    term: (k) => 1 / (k * (k + 1)),
  },
  {
    id: 'factorial',
    title: { ko: '팩토리얼 급수', en: 'Factorial series' },
    formula: String.raw`\(\sum 1/k!\)`,
    criterion: { ko: '비율 판정', en: 'ratio test' },
    converges: true,
    limit: Math.E - 1,
    term: (k) => 1 / factorial(k),
  },
  {
    id: 'weighted',
    title: { ko: '가중 기하급수', en: 'Weighted geometric' },
    formula: String.raw`\(\sum k(2/3)^k\)`,
    criterion: { ko: '근 판정', en: 'root test' },
    converges: true,
    limit: 6,
    term: (k) => k * Math.pow(2 / 3, k),
  },
  {
    id: 'grandi',
    title: { ko: '그란디 급수', en: 'Grandi series' },
    formula: String.raw`\(1 - 1 + 1 - 1 + \cdots\)`,
    criterion: { ko: '부분합 진동', en: 'sums oscillate' },
    converges: false,
    limit: null,
    term: (k) => (k % 2 === 1 ? 1 : -1),
  },
];

function factorial(k: number): number {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return f;
}

export interface AtlasCardData {
  def: AtlasCardDef;
  /** Partial sums S_1 .. S_n. */
  partialSums: number[];
  last: number;
  min: number;
  max: number;
}

export interface ConvergenceAtlasData {
  n: number;
  focus: string;
  cards: AtlasCardData[];
  focused: AtlasCardData | null;
}

export function convergenceAtlasData(nRaw: number, focusRaw: string): ConvergenceAtlasData {
  const n = Math.max(5, Math.min(200, Math.round(Number.isFinite(nRaw) ? nRaw : 40)));
  const focus = ATLAS_CARDS.some((card) => card.id === focusRaw) ? focusRaw : 'all';
  const cards: AtlasCardData[] = ATLAS_CARDS.map((def) => {
    const partialSums: number[] = [];
    let s = 0;
    let min = Infinity;
    let max = -Infinity;
    for (let k = 1; k <= n; k++) {
      s += def.term(k);
      partialSums.push(s);
      if (s < min) min = s;
      if (s > max) max = s;
    }
    return { def, partialSums, last: s, min, max };
  });
  const focused = focus === 'all' ? null : (cards.find((card) => card.def.id === focus) ?? null);
  return { n, focus, cards, focused };
}

export const convergenceAtlasModel: SceneModel<ConvergenceAtlasData> = {
  compute(state) {
    const focus = typeof state['focus'] === 'string' ? state['focus'] : 'all';
    return convergenceAtlasData(Number(state['n']), focus);
  },
};
