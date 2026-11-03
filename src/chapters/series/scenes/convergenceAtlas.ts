import { line, scaleLinear } from 'd3';
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
 * The 3 by 3 atlas grid. Every card gets the same layout: title,
 * formula, a sparkline of the partial sums up to n, and a one-line
 * verdict in green or red. The focused card (select control) gets a
 * bold border so one card can be talked about at a time.
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
    const plotH = Math.max(24, cellH - 42 - 34);
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
      .attr('y', cellH - 20)
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('fill', verdictColor)
      .call(svgText, verdict);
    cell
      .append('text')
      .attr('x', 10)
      .attr('y', cellH - 6)
      .attr('font-size', 10)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(localize(card.def.criterion, lang));
  });
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
  slots: [{ text: readoutText, bold: true }],
});
