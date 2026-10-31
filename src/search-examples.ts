import type { Lang } from './contracts.ts';

/**
 * Example questions shown under the home hero search and offered as
 * suggestions when a query looks unrelated to real analysis: short,
 * deliberately title-distant phrasings the semantic search handles well.
 */
/**
 * Math-term chips offered on the off-topic state: measured 2026-10-31, a
 * trailing math noun lifts a metaphor query over the off-topic score line
 * (도미노 0.846 -> 도미노 증명 0.872) by anchoring it in the math region,
 * so one tap on the term the user had in mind revives the search.
 */
export const SEARCH_MATH_TERMS: Record<Lang, readonly string[]> = {
  ko: ['수열', '함수', '집합', '극한', '곡선', '구간', '급수', '벡터'],
  en: ['sequence', 'function', 'set', 'limit', 'curve', 'interval', 'series', 'vector'],
};

export const SEARCH_EXAMPLES: Record<Lang, readonly string[]> = {
  ko: ['급수가 수렴하는지 판정하는 방법', '가장 작은 상계', '울타리처럼 가두는 수열'],
  en: [
    'how to test whether a series converges',
    'the smallest upper bound',
    'a sequence fenced in on both sides',
  ],
};
