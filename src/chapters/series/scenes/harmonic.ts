import { axisBottom, axisLeft, line, scaleLinear, scaleLog, type ScaleContinuousNumeric } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { harmonicModel, type HarmonicData, type HarmonicPoint } from '../models/harmonic';

function drawMain(chart: Chart, data: HarmonicData, lang: Lang): void {
  const { g, width, height } = chart;
  const logX = data.logX;

  const x: ScaleContinuousNumeric<number, number> = logX ? scaleLog() : scaleLinear();
  x.domain([1, Math.max(2, data.n)]).range([0, width]);
  const yMax = Math.max(data.final.sum, data.final.asymptotic) * 1.08;
  const y = scaleLinear().domain([0, yMax]).range([height, 0]);

  const sumLine = line<HarmonicPoint>()
    .x((p) => x(p.k))
    .y((p) => y(p.sum));
  const asymptoticLine = line<HarmonicPoint>()
    .x((p) => x(p.k))
    .y((p) => y(p.asymptotic));

  g.selectAll('*').remove();

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6, '~s'));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--accent)')
    .attr('d', sumLine(data.points) ?? '');
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 4')
    .style('stroke', 'var(--bound)')
    .attr('d', asymptoticLine(data.points) ?? '');

  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('fill', 'currentColor')
    .attr('font-size', 12)
    .text(`n = ${data.n.toLocaleString()}   S_n = ${data.final.sum.toFixed(6)}   ln n + γ = ${data.final.asymptotic.toFixed(6)}`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '— 부분합 S_n', en: '— partial sums S_n' }, lang));
  g.append('text').attr('x', 8).attr('y', 48).attr('font-size', 12).style('fill', 'var(--bound)').text('- - ln n + γ');
}

export default defineSimpleScene<HarmonicData>({ model: harmonicModel, drawMain });
