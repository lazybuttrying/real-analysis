import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { taylorThmModel, type TaylorThmData, type TaylorThmSample } from '../models/taylorThm';

/**
 * sin x against its Maclaurin polynomial T_n(x), with the Lagrange
 * remainder envelope T_n(x) +/- |x|^{n+1}/(n+1)! shaded. The readout compares
 * the envelope at pi (the worst point on [-pi, pi]) with the actual maximum
 * error on the grid: the actual error always sits inside the envelope.
 */

function readoutText(data: TaylorThmData, lang: Lang): string {
  const ko = String.raw`상한 \(\frac{\pi^{n+1}}{(n+1)!} \approx ${fmt(data.maxBound, 4)}\), 실제 최대 오차 \(\approx ${fmt(
    data.maxActualErr,
    4,
  )}\) — 오차가 띠 안에 들어갑니다.`;
  const en = String.raw`Bound \(\frac{\pi^{n+1}}{(n+1)!} \approx ${fmt(data.maxBound, 4)}\), actual max error \(\approx ${fmt(
    data.maxActualErr,
    4,
  )}\) — the error sits inside the envelope.`;
  return localize({ ko, en }, lang);
}

function drawMain(chart: Chart, data: TaylorThmData, _lang: Lang): void {
  const { g, width, height } = chart;
  const { n, samples } = data;

  const x = scaleLinear().domain([-Math.PI, Math.PI]).range([0, width]);
  const allY = samples.flatMap((p) => [p.y, p.p, p.p + p.bound, p.p - p.bound]);
  const yMax = Math.max(2, ...allY.map(Math.abs));
  const y = scaleLinear().domain([-yMax, yMax]).range([height, 0]);

  const fLine = line<TaylorThmSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));
  const pLine = line<TaylorThmSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.p));
  const band = area<TaylorThmSample>()
    .x((p) => x(p.x))
    .y0((p) => y(p.p - p.bound))
    .y1((p) => y(p.p + p.bound));

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(7));
  g.append('g').call(axisLeft(y).ticks(5));

  // The Lagrange envelope T_n +/- bound.
  g.append('path').attr('d', band(samples) ?? '').attr('fill', 'var(--bound)').attr('opacity', 0.22);
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5 4')
    .attr('opacity', 0.65)
    .attr('d', fLine(samples) ?? '');
  g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', pLine(samples) ?? '');

  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`T_${n}(x)  ±  |x|^${n + 1}/${n + 1}!`);
}

export default defineSimpleScene<TaylorThmData>({
  model: taylorThmModel,
  drawMain,
  slots: [{ text: readoutText, bold: true }],
});
