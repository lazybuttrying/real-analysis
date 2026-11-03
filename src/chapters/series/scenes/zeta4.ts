import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { svgText } from '../../../view/svgtext';
import { zeta4Model, LIMIT, type Zeta4Data } from '../models/zeta4';

// Tiny bars for 1/n^4, a staircase of partial sums rising to pi^4/90,
// and a pattern strip: even zetas are pi powers over striking
// denominators, while odd zeta(3) refuses the pattern entirely.

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 84, left: 56 };
function drawMain(chart: Chart, data: Zeta4Data, lang: Lang): void {
  const { g, width, height } = chart;
  const n = data.n;

  const x = scaleLinear().domain([0.4, n + 0.6]).range([0, width]);
  const y = scaleLinear().domain([0, 1.15]).range([height, 0]);

  g.selectAll('*').remove();

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(n));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('text')
    .attr('x', 0)
    .attr('y', -42)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .call(
      svgText,
      localize(
        {
          ko: String.raw`\(N = ${n}\)    \(S_N = ${fmt(data.sum)}\)    극한 \(\pi^4/90 = ${fmt(LIMIT)}\)    |오차| \(= ${fmt(data.error)}\)`,
          en: String.raw`\(N = ${n}\)    \(S_N = ${fmt(data.sum)}\)    limit \(\pi^4/90 = ${fmt(LIMIT)}\)    |error| \(= ${fmt(data.error)}\)`,
        },
        lang,
      ),
    );
  g.append('text')
    .attr('x', 0)
    .attr('y', -22)
    .attr('font-size', 12)
    .style('fill', 'var(--muted)')
    .text(
      localize(
        {
          ko: '네제곱 항들은 너무 빨리 작아져서 첫째 항이 이미 대부분의 일을 합니다',
          en: 'fourth powers collapse so fast that the first term already does most of the work',
        },
        lang,
      ),
    );

  // Bars for the terms 1/i^4.
  const bw = Math.min(30, (width / n) * 0.5);
  data.heights.forEach((h, i) => {
    g.append('rect')
      .attr('x', x(i + 1) - bw / 2)
      .attr('y', y(h))
      .attr('width', bw)
      .attr('height', y(0) - y(h))
      .attr('opacity', 0.9)
      .style('fill', 'var(--accent)');
  });

  // Limit line and the partial-sum staircase.
  g.append('line')
    .attr('x1', x(0.4))
    .attr('x2', x(n + 0.6))
    .attr('y1', y(LIMIT))
    .attr('y2', y(LIMIT))
    .attr('stroke-dasharray', '6 4')
    .attr('stroke-width', 2)
    .attr('stroke', GOLD);
  g.append('text')
    .attr('x', x(n + 0.6) - 2)
    .attr('y', y(LIMIT) - 10)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', GOLD)
    .call(svgText, String.raw`\(\pi^4/90\)`);

  const path = line<{ k: number; v: number }>()
    .x((p) => x(p.k))
    .y((p) => y(p.v));
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .attr('stroke', GOLD)
    .attr('d', path(data.sums.map((s, i) => ({ k: i + 1, v: s }))) ?? '');
  data.sums.forEach((s, i) => {
    g.append('circle').attr('cx', x(i + 1)).attr('cy', y(s)).attr('r', 4).attr('fill', GOLD);
  });
  g.append('text')
    .attr('x', x(2) + bw)
    .attr('y', y(0.9))
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '첫째 항: 1', en: 'first term: 1' }, lang));

  // Pattern strip under the axis: even zetas are pi powers; zeta(3) is not.
  const evens = data.pattern.filter((p) => !p.odd);
  const odd = data.pattern.find((p) => p.odd);
  g.append('text')
    .attr('x', 0)
    .attr('y', height + 38)
    .attr('font-size', 12.5)
    .attr('fill', GOLD)
    .call(svgText, evens.map((p) => String.raw`\(\zeta(${p.p}) = \pi^{${p.p}}/${p.denom} = ${fmt(p.value)}\)`).join('      '));
  if (odd) {
    g.append('text')
      .attr('x', 0)
      .attr('y', height + 60)
      .attr('font-size', 12.5)
      .style('fill', 'var(--accent)')
      .call(
        svgText,
        localize(
          {
            ko: String.raw`\(\zeta(3) = ${fmt(odd.value)}\) — \(\pi\) 거듭제곱 패턴 없음 (아페리 상수; 여기서 직접 합산으로 추정)`,
            en: String.raw`\(\zeta(3) = ${fmt(odd.value)}\) — no \(\pi\)-power pattern (Apéry's constant; estimated here by direct summation)`,
          },
          lang,
        ),
      );
  }
}

export default defineSimpleScene<Zeta4Data>({ model: zeta4Model, margin: MARGIN, drawMain });
