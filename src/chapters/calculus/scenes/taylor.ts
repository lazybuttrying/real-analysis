import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { taylorModel, type TaylorData, type TaylorSample } from '../models/taylor';

function drawMain(chart: Chart, data: TaylorData, lang: Lang): void {
  const { g, width, height } = chart;
  const { n, maxErr, samples } = data;

  const x = scaleLinear().domain([-Math.PI, Math.PI]).range([0, width]);
  const allY = samples.flatMap((p) => [p.y, p.p]);
  const yMax = Math.max(2, ...allY.map(Math.abs));
  const y = scaleLinear().domain([-yMax, yMax]).range([height, 0]);

  const fLine = line<TaylorSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));
  const pLine = line<TaylorSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.p));

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(7));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('path').attr('fill', 'none').attr('stroke-width', 2).attr('stroke-dasharray', '5 4').attr('opacity', 0.65).attr('d', fLine(samples) ?? '');
  g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', pLine(samples) ?? '');

  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`T_${n}(x)`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(`${localize({ ko: '[−π, π] 최대 오차', en: 'max error on [−π, π]' }, lang)} ≈ ${fmt(maxErr, 4)}`);
}

export default defineSimpleScene<TaylorData>({
  model: taylorModel,
  drawMain,
});
