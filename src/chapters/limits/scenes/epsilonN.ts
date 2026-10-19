import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { epsilonNModel, type EpsilonNData } from '../models/epsilonN';


function drawMain(chart: Chart, data: EpsilonNData, lang: Lang): void {
    const { g, width, height } = chart;
    const { limit: L, epsilon, terms, firstN } = data;

    const x = scaleLinear().domain([0, terms.length + 1]).range([0, width]);
    const values = terms.map((t) => t.value);
    const y = scaleLinear()
      .domain([Math.min(L - epsilon, ...values) - 0.08, Math.max(L + epsilon, ...values) + 0.08])
      .range([height, 0]);

    g.selectAll('*').remove();

    // The epsilon band around the limit.
    g.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', y(L + epsilon))
      .attr('height', Math.max(0, y(L - epsilon) - y(L + epsilon)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.12);
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(L))
      .attr('y2', y(L))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8, '~s'));
    g.append('g').call(axisLeft(y).ticks(5));

    // Sequence points: the tail past N glows, the head stays gray.
    for (const term of terms) {
      const inTail = firstN !== null && term.k > firstN;
      g.append('circle')
        .attr('cx', x(term.k))
        .attr('cy', y(term.value))
        .attr('r', inTail ? 3.2 : 2.2)
        .attr('fill', inTail ? 'var(--accent)' : 'currentColor')
        .attr('opacity', inTail ? 1 : 0.45);
    }

    if (firstN !== null) {
      g.append('line')
        .attr('x1', x(firstN))
        .attr('x2', x(firstN))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '4 3');
    }

    const readout =
      firstN !== null
        ? `N = ${firstN}`
        : localize({ ko: '80항 안에 없음', en: 'not within 80 terms' }, lang);
    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`ε = ${fmt(epsilon)}   ${readout}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '— ε 띠 안의 꼬리', en: '— the tail inside the ε-band' }, lang));
}

export default defineSimpleScene<EpsilonNData>({
  model: epsilonNModel,
  drawMain,
});
