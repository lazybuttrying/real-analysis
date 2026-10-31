import type { Lang } from './contracts.ts';

/**
 * Example questions shown under the home hero search and offered as
 * suggestions when a query looks unrelated to real analysis: short,
 * deliberately title-distant phrasings the semantic search handles well.
 */
export const SEARCH_EXAMPLES: Record<Lang, readonly string[]> = {
  ko: ['급수가 수렴하는지 판정하는 방법', '가장 작은 상계', '울타리처럼 가두는 수열'],
  en: [
    'how to test whether a series converges',
    'the smallest upper bound',
    'a sequence fenced in on both sides',
  ],
};
