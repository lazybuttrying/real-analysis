import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  SERIES_ALTERNATING,
  doubleSeriesModel,
  type DoubleSeriesData,
} from '../models/doubleSeries';

/**
 * Fubini for infinite sums, live (Tao, Thm 8.2.2). The N x N heatmap shows
 * a(m,n) = 1/(m^2 n^2) -- or (-1)^{m+n}/(m^2 n^2) for the alternating
 * series, where negative cells take the bound hue and carry a minus sign.
 * Row sums sit at the right, column sums below; the strips report both
 * iterated sums and the common limit: pi^4/36 for the product series,
 * pi^4/144 for the alternating one. Summing by rows or by columns gives the
 * same total -- order does not matter when the terms are nonnegative
 * (or absolutely convergent).
 */

const MARGIN = { top: 64, right: 110, bottom: 64, left: 56 };
const CELL = 44;
const GAP = 4;

function readoutText(data: DoubleSeriesData, lang: Lang): string {
  const rowTotal = data.rowSums.reduce((a, b) => a + b, 0);
  const colTotal = data.colSums.reduce((a, b) => a + b, 0);
  const limitTex =
    data.series === SERIES_ALTERNATING ? String.raw`\frac{\pi^4}{144}` : String.raw`\frac{\pi^4}{36}`;
  return localize(
    {
      ko: String.raw`행별 합 \(= ${fmt(rowTotal, 4)}\), 열별 합 \(= ${fmt(colTotal, 4)}\) — 둘 다 \((${limitTex} \approx ${fmt(data.limit, 4)})\)로 갑니다.`,
      en: String.raw`Sum by rows \(= ${fmt(rowTotal, 4)}\), sum by columns \(= ${fmt(colTotal, 4)}\) — both head to \((${limitTex} \approx ${fmt(data.limit, 4)})\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`푸비니 정리(무한합): \(a_{m,n} \ge 0\)이면 \(\sum_m\sum_n a_{m,n} = \sum_n\sum_m a_{m,n}\) — 어느 쪽으로 먼저 더해도 같은 값입니다. 절댓값이 수렴하면 부호가 있어도 성립합니다 (\(a = a^+ - a^-\)로 쪼개기).`,
      en: String.raw`Fubini for infinite sums: if \(a_{m,n} \ge 0\) then \(\sum_m\sum_n a_{m,n} = \sum_n\sum_m a_{m,n}\) — summing in either order gives the same value. It also holds with signs when the series converges absolutely (split \(a = a^+ - a^-\)).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: DoubleSeriesData, lang: Lang): void {
  const { g } = chart;
  g.selectAll('*').remove();

  const n = data.N;
  const left = MARGIN.left;
  const top = 8;
  const step = CELL + GAP;
  const cx = (j: number) => left + j * step + CELL / 2;
  const cy = (i: number) => top + i * step + CELL / 2;

  let maxAbs = 0;
  for (const row of data.grid) for (const v of row) maxAbs = Math.max(maxAbs, Math.abs(v));
  if (maxAbs === 0) maxAbs = 1;

  const seriesLabel =
    data.series === SERIES_ALTERNATING
      ? localize({ ko: '(-1)^(m+n)/(m²n²)', en: '(-1)^(m+n)/(m²n²)' }, lang)
      : localize({ ko: '1/(m²n²)', en: '1/(m²n²)' }, lang);

  g.append('text')
    .attr('x', 0)
    .attr('y', -40)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `a(m,n) = ${seriesLabel} — 진할수록 절댓값이 큼${data.series === SERIES_ALTERNATING ? ' (bound 색은 음수)' : ''}`,
          en: `a(m,n) = ${seriesLabel} — darker means larger |a|${data.series === SERIES_ALTERNATING ? ' (bound hue is negative)' : ''}`,
        },
        lang,
      ),
    );

  // Column headers.
  for (let j = 0; j < n; j++) {
    g.append('text')
      .attr('x', cx(j))
      .attr('y', top - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.65)
      .text(fmt(j + 1, 0));
  }
  g.append('text')
    .attr('x', left - 12)
    .attr('y', top - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text('m\n');

  for (let i = 0; i < n; i++) {
    // Row header.
    g.append('text')
      .attr('x', left - 10)
      .attr('y', cy(i) + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(fmt(i + 1, 0));
    for (let j = 0; j < n; j++) {
      const v = (data.grid[i] as number[])[j] as number;
      const intensity = Math.abs(v) / maxAbs;
      const color = v < 0 ? 'var(--bound)' : 'var(--accent)';
      g.append('rect')
        .attr('x', left + j * step)
        .attr('y', top + i * step)
        .attr('width', CELL)
        .attr('height', CELL)
        .attr('rx', 6)
        .attr('fill', color)
        .attr('fill-opacity', 0.12 + 0.78 * intensity)
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.25)
        .attr('stroke-width', 1);
      if (v < 0) {
        g.append('text')
          .attr('x', cx(j))
          .attr('y', cy(i) + 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', 16)
          .attr('font-weight', 700)
          .attr('fill', '#fff')
          .text('−');
      } else if (data.series === SERIES_ALTERNATING) {
        g.append('text')
          .attr('x', cx(j))
          .attr('y', cy(i) + 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', 14)
          .attr('font-weight', 700)
          .attr('fill', '#fff')
          .text('+');
      }
    }
    // Row sum at the right.
    g.append('text')
      .attr('x', left + n * step + 6)
      .attr('y', cy(i) + 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(fmt(data.rowSums[i] as number, 4));
  }

  // Column sums below.
  const sumY = top + n * step + 22;
  for (let j = 0; j < n; j++) {
    g.append('text')
      .attr('x', cx(j))
      .attr('y', sumY)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(fmt(data.colSums[j] as number, 4));
  }
  g.append('text')
    .attr('x', left - 10)
    .attr('y', sumY)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '열합', en: 'col sums' }, lang));
  g.append('text')
    .attr('x', left + n * step + 6)
    .attr('y', sumY)
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text(fmt(data.total, 4));
  g.append('text')
    .attr('x', left + n * step + 6)
    .attr('y', cy(0) - CELL / 2 - 8)
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.65)
    .text(localize({ ko: '행합', en: 'row sums' }, lang));
}

export default defineSimpleScene<DoubleSeriesData>({
  model: doubleSeriesModel,
  margin: MARGIN,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
  sizeFromData: (data, container) => ({
    width: Math.max(container.width || 640, MARGIN.left + data.N * (CELL + GAP) + MARGIN.right),
    height: 8 + data.N * (CELL + GAP) + 44,
  }),
});
