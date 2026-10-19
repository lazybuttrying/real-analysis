import { axisBottom, axisLeft, area, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { ftcModel, type FTCData, type FTCSample } from '../models/ftc';

function drawMain(chart: Chart, data: FTCData, lang: Lang): void {
  const { g, width, height } = chart;
  const { a, b, x, area: areaValue, numericDerivative, fAtX, samples } = data;

  const xScale = scaleLinear().domain([a, b]).range([0, width]);
  const yMax = Math.max(...samples.map((p) => Math.abs(p.y)), 0.5) * 1.15;
  const y = scaleLinear().domain([-0.1 * yMax, yMax]).range([height, 0]);

  const curve = line<FTCSample>()
    .x((p) => xScale(p.x))
    .y((p) => y(p.y));
  const shade = area<FTCSample>()
    .x((p) => xScale(p.x))
    .y0(y(0))
    .y1((p) => y(p.y));

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(xScale).ticks(6));
  g.append('g').call(axisLeft(y).ticks(5));

  // The accumulated area from a to x.
  g.append('path')
    .datum(samples.filter((p) => p.x <= x))
    .attr('fill', 'var(--accent)')
    .attr('opacity', 0.3)
    .attr('d', shade);
  g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).attr('stroke', 'currentColor').attr('d', curve(samples) ?? '');

  // The moving wall at x.
  g.append('line')
    .attr('x1', xScale(x))
    .attr('x2', xScale(x))
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', 'var(--bound)')
    .attr('stroke-dasharray', '5 4');
  g.append('circle').attr('cx', xScale(x)).attr('cy', y(fAtX)).attr('r', 5).attr('fill', 'var(--accent)');

  const match = Math.abs(numericDerivative - fAtX) < 1e-4 * (Math.abs(fAtX) + 1);
  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`A(${fmt(x, 3)}) = ${fmt(areaValue, 5)}`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', match ? 'var(--accent)' : 'var(--bound)')
    .text(
      `A′(${fmt(x, 3)}) ≈ ${fmt(numericDerivative, 5)} · f(${fmt(x, 3)}) = ${fmt(fAtX, 5)} — ${localize({ ko: '일치!', en: 'match!' }, lang)}`,
    );
}

export default defineSimpleScene<FTCData>({
  model: ftcModel,
  drawMain,
});
