import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { riemannModel, type RiemannData } from '../models/riemann';

function drawMain(chart: Chart, data: RiemannData, lang: Lang): void {
  const { g, width, height } = chart;
  const { n, lower, upper, gap, limit, bars } = data;

  const x = scaleLinear().domain([0, 1]).range([0, width]);
  const y = scaleLinear().domain([0, 1.1]).range([height, 0]);

  const curve = line<{ x: number; y: number }>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));
  const curvePts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= 100; i++) {
    const px = i / 100;
    curvePts.push({ x: px, y: px * px });
  }

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
  g.append('g').call(axisLeft(y).ticks(5));

  // Upper rectangles (light): the visible light band above the accent fill is the gap.
  for (const bar of bars) {
    g.append('rect')
      .attr('x', x(bar.x0))
      .attr('width', Math.max(0, x(bar.x1) - x(bar.x0) - 0.5))
      .attr('y', y(bar.hi))
      .attr('height', Math.max(0, y(0) - y(bar.hi)))
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.25);
  }
  // Lower rectangles (accent): what is certainly under the curve.
  for (const bar of bars) {
    g.append('rect')
      .attr('x', x(bar.x0))
      .attr('width', Math.max(0, x(bar.x1) - x(bar.x0) - 0.5))
      .attr('y', y(bar.lo))
      .attr('height', Math.max(0, y(0) - y(bar.lo)))
      .style('fill', 'var(--accent)')
      .attr('opacity', 0.55);
  }
  g.append('path').attr('fill', 'none').attr('stroke-width', 2).attr('stroke', 'currentColor').attr('d', curve(curvePts) ?? '');

  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`n = ${n} · L = ${fmt(lower, 4)} · U = ${fmt(upper, 4)}`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(
      `${localize({ ko: '틈', en: 'gap' }, lang)} U − L = ${fmt(gap, 4)} → ${localize({ ko: '적분', en: 'integral' }, lang)} ${fmt(limit, 4)}`,
    );
}

export default defineSimpleScene<RiemannData>({
  model: riemannModel,
  drawMain,
});
