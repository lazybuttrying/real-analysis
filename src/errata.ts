import type { LocalizedText } from './contracts.ts';

/**
 * Errata: the public correction log for the site content.
 *
 * One entry per correction, newest first by convention (renderers sort by
 * date descending anyway). An entry with no chapterId is a site-wide fix.
 * Entries are added in the same change that fixes the content, so the log
 * and the content never drift apart.
 */
export interface ErrataEntry {
  id: string;
  /** ISO date (YYYY-MM-DD) the correction landed. */
  date: string;
  kind: 'content' | 'display';
  chapterId?: string;
  sceneId?: string;
  title: LocalizedText;
  detail: LocalizedText;
}

/** The date the current edition of the site content is stated as of. */
export const ERRATA_AS_OF = '2026-10-31';

/** Where readers report errors they find. */
export const ERRATA_REPORT_URL = 'https://github.com/lazybuttrying/real-analysis/issues';

export const errata: readonly ErrataEntry[] = [
  {
    id: 'chart-height-bounce',
    date: '2026-10-29',
    kind: 'display',
    title: {
      ko: '차트 높이가 아래 글에 따라 들썩이던 문제 수정',
      en: 'Chart height no longer bounces with the text below it',
    },
    detail: {
      ko: '차트와 아래 설명이 한 박스의 높이를 나눠 써서, 설명이 한 줄 늘면 차트가 줄고 글이 따라 움직였다. 차트 높이를 화면 높이의 60퍼센트, 최대 480px로 고정하고 박스는 글만큼만 늘어나게 바꿨다.',
      en: 'The chart and the readout below it shared one fixed-height box, so a readout wrapping to one more line shrank the chart and dragged the text with it. The chart height is now fixed at 60 percent of the viewport height, capped at 480px, and the box grows only with the text.',
    },
  },
];
