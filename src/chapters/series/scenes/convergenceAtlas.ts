import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { svgText } from '../../../view/svgtext';
import {
  convergenceAtlasModel,
  type AtlasCardData,
  type ConvergenceAtlasData,
} from '../models/convergenceAtlas';

/**
 * Two stacked graph sections (the engine's extraCharts support). The top
 * section is one series drawn large: its terms as stems from the zero
 * line and its partial sums as a curve settling onto (or never reaching)
 * the limit, so the shape of the convergence is visible before the grid
 * is read. The main section is the 3 by 3 atlas grid: every card gets
 * the same layout (title, formula, a sparkline of the partial sums up to
 * n, and a one-line verdict in green or red), and the focused card gets
 * a bold border so one card can be talked about at a time.
 */

const CONVERGE_COLOR = '#59a14f';
const DIVERGE_COLOR = '#e15759';

function drawMain(chart: Chart, data: ConvergenceAtlasData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const cols = 3;
  const rows = 3;
  const gapX = 12;
  const gapY = 12;
  const cellW = (width - gapX * (cols - 1)) / cols;
  const cellH = (height - gapY * (rows - 1)) / rows;

  data.cards.forEach((card, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const ox = col * (cellW + gapX);
    const oy = row * (cellH + gapY);
    const cell = g.append('g').attr('transform', `translate(${ox},${oy})`);
    const isFocus = data.focus === card.def.id;
    const verdictColor = card.def.converges ? CONVERGE_COLOR : DIVERGE_COLOR;

    cell
      .append('rect')
      .attr('width', cellW)
      .attr('height', cellH)
      .attr('rx', 8)
      .attr('fill', 'none')
      .attr('stroke', isFocus ? 'var(--accent)' : 'currentColor')
      .attr('stroke-width', isFocus ? 2.5 : 1)
      .attr('opacity', isFocus ? 1 : 0.55);

    cell
      .append('text')
      .attr('x', 10)
      .attr('y', 18)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .call(svgText, localize(card.def.title, lang));
    cell
      .append('text')
      .attr('x', 10)
      .attr('y', 34)
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .call(svgText, card.def.formula);

    // Sparkline of the partial sums, with the limit line when it converges.
    const plotX = 10;
    const plotW = cellW - 20;
    const plotTop = 42;
    const plotH = Math.max(24, cellH - 42 - 42);
    const lo = Math.min(card.min, card.def.limit ?? Infinity);
    const hi = Math.max(card.max, card.def.limit ?? -Infinity);
    const pad = (hi - lo) * 0.12 + 0.02;
    const x = scaleLinear().domain([1, Math.max(2, data.n)]).range([plotX, plotX + plotW]);
    const y = scaleLinear().domain([lo - pad, hi + pad]).range([plotTop + plotH, plotTop]);

    if (card.def.limit !== null) {
      cell
        .append('line')
        .attr('x1', plotX)
        .attr('x2', plotX + plotW)
        .attr('y1', y(card.def.limit))
        .attr('y2', y(card.def.limit))
        .attr('stroke', verdictColor)
        .attr('stroke-dasharray', '4 3')
        .attr('opacity', 0.7);
    }
    const spark = line<number>()
      .x((_, i) => x(i + 1))
      .y((v) => y(v));
    cell
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', verdictColor)
      .attr('stroke-width', 1.8)
      .attr('d', spark(card.partialSums) ?? '');

    const verdict = card.def.converges
      ? String.raw`${localize({ ko: '수렴', en: 'converges' }, lang)} \(\to ${fmt(card.def.limit ?? 0, 4)}\)`
      : localize({ ko: '발산', en: 'diverges' }, lang);
    cell
      .append('text')
      .attr('x', 10)
      .attr('y', cellH - 24)
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('fill', verdictColor)
      .call(svgText, verdict);
    cell
      .append('text')
      .attr('x', 10)
      .attr('y', cellH - 7)
      .attr('font-size', 10)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(localize(card.def.criterion, lang));
  });
}

/**
 * The top section: the focused series (the first card while the focus
 * control is on 'all') drawn at full width. Stems show the terms
 * themselves, the curve shows the partial sums approaching the dashed
 * limit line, so both halves of a convergence test stay visible.
 */
function drawFocus(chart: Chart, data: ConvergenceAtlasData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();
  const card = data.focused ?? (data.cards[0] as AtlasCardData);
  const color = card.def.converges ? CONVERGE_COLOR : DIVERGE_COLOR;
  const sums = card.partialSums;
  const n = data.n;

  g.append('text')
    .attr('x', 0)
    .attr('y', -12)
    .attr('font-size', 13)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .call(svgText, localize(card.def.title, lang));
  g.append('text')
    .attr('x', width)
    .attr('y', -12)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.8)
    .call(svgText, card.def.formula);

  const limit = card.def.limit;
  const lo = Math.min(0, card.min, limit ?? Infinity);
  const hi = Math.max(0, card.max, limit ?? -Infinity);
  const pad = (hi - lo) * 0.1 + 0.02;
  const x = scaleLinear()
    .domain([1, Math.max(2, n)])
    .range([0, width]);
  const y = scaleLinear()
    .domain([lo - pad, hi + pad])
    .range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
  g.append('g').call(axisLeft(y).ticks(4));

  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.35);

  if (limit !== null) {
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(limit))
      .attr('y2', y(limit))
      .attr('stroke', color)
      .attr('stroke-dasharray', '5 4')
      .attr('opacity', 0.75);
    g.append('text')
      .attr('x', width - 4)
      .attr('y', y(limit) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('fill', color)
      .text(fmt(limit, 4));
  }

  const step = Math.max(1, Math.floor(n / 60));
  for (let i = 0; i < sums.length; i += step) {
    const term = (sums[i] as number) - (i > 0 ? (sums[i - 1] as number) : 0);
    g.append('line')
      .attr('x1', x(i + 1))
      .attr('x2', x(i + 1))
      .attr('y1', y(0))
      .attr('y2', y(term))
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.45);
  }

  const curve = line<number>()
    .x((_, i) => x(i + 1))
    .y((v) => y(v));
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2.4)
    .attr('d', curve(sums) ?? '');
}

function readoutText(data: ConvergenceAtlasData, lang: Lang): string {
  if (data.focused) {
    const card: AtlasCardData = data.focused;
    return localize(
      {
        ko: String.raw`주목 카드: ${localize(card.def.title, 'ko')}의 부분합은 \(n = ${data.n}\)에서 ${fmt(card.last, 4)}입니다. ${card.def.converges ? String.raw`극한 ${fmt(card.def.limit ?? 0, 4)}에 붙고 있습니다.` : '극한에 붙지 않습니다.'}`,
        en: String.raw`Focused card: the ${localize(card.def.title, 'en')} partial sum at \(n = ${data.n}\) is ${fmt(card.last, 4)}. ${card.def.converges ? String.raw`It is settling onto the limit ${fmt(card.def.limit ?? 0, 4)}.` : 'It is not settling onto any limit.'}`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`아홉 장의 카드를 한눈에 비교하세요. 초록은 수렴, 빨강은 발산입니다. 항이 0으로 가는 것만으로는 부족하다는 것이 조화 카드와 절댓값 카드의 자리입니다.`,
      en: String.raw`Compare all nine cards at a glance. Green converges, red diverges. The harmonic and absolute cards are there to show that terms going to zero is not enough.`,
    },
    lang,
  );
}

export default defineSimpleScene<ConvergenceAtlasData>({
  model: convergenceAtlasModel,
  drawMain,
  chartWrapHeight: 'min(82vh, 680px)',
  extraCharts: [
    {
      before: true,
      draw: drawFocus,
      margin: { top: 30, right: 16, bottom: 24, left: 46 },
      fallbackHeight: 200,
      wrapCss: 'flex: 0 0 216px; min-height: 0; position: relative;',
      label: (lang) =>
        localize(
          { ko: '선택한 급수의 모양, 항과 부분합', en: 'Shape of the selected series, terms and partial sums' },
          lang,
        ),
    },
  ],
  slots: [{ text: readoutText, bold: true }],
});
