import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { fourierModel, type FourierData, type FourierSample } from '../models/fourier';

function drawMain(chart: Chart, data: FourierData, lang: Lang): void {
  const { g, width, height } = chart;
  const { n, gibbsMax, overshootFraction, samples } = data;

  const x = scaleLinear().domain([-Math.PI, Math.PI]).range([0, width]);
  const y = scaleLinear().domain([-1.6, 1.6]).range([height, 0]);

  const sumLine = line<FourierSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));
  const targetLine = line<FourierSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.target));

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(7));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 4')
    .attr('opacity', 0.6)
    .attr('d', targetLine(samples) ?? '');
  g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', sumLine(samples) ?? '');

  // The Gibbs overshoot marker near the jump.
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(1))
    .attr('y2', y(1))
    .style('stroke', 'var(--bound)')
    .attr('stroke-dasharray', '4 3')
    .attr('opacity', 0.6);

  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`N = ${n} · ${localize({ ko: '점프 옆 최대값', en: 'peak near the jump' }, lang)} ≈ ${fmt(gibbsMax, 4)}`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(
      `${localize({ ko: '울림', en: 'overshoot' }, lang)} ≈ ${(overshootFraction * 100).toFixed(2)}% ${localize({ ko: '— N을 키워도 사라지지 않음', en: '— never dies out' }, lang)}`,
    );
}

export default defineSimpleScene<FourierData>({
  model: fourierModel,
  drawMain,
});
