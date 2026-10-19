import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { banachFunction, banachModel, type BanachData } from '../models/banach';

function drawMain(chart: Chart, data: BanachData, lang: Lang): void {
  const { g, width, height } = chart;
  const { key, q, fixed, xs, errors, bounds, samples } = data;
  const { xMin, xMax } = banachFunction(key);

  const x = scaleLinear().domain([xMin, xMax]).range([0, width]);
  const allY = [...samples.map((p) => p.y), xMin, xMax];
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const pad = 0.08 * (yMax - yMin || 1);
  const y = scaleLinear()
    .domain([yMin - pad, yMax + pad])
    .range([height, 0]);

  const curve = line<{ x: number; y: number }>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
  g.append('g').call(axisLeft(y).ticks(5));

  // The diagonal y = x.
  g.append('line')
    .attr('x1', x(xMin))
    .attr('x2', x(xMax))
    .attr('y1', y(xMin))
    .attr('y2', y(xMax))
    .attr('stroke', 'var(--bound)')
    .attr('stroke-dasharray', '6 4');

  g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).attr('stroke', 'currentColor').attr('d', curve(samples) ?? '');

  // The cobweb: (x_k, x_k) -> (x_k, f(x_k)) -> (x_{k+1}, x_{k+1}).
  const web: Array<[number, number]> = [];
  for (let k = 0; k < xs.length - 1; k++) {
    const xk = xs[k];
    const xNext = xs[k + 1];
    if (xk === undefined || xNext === undefined) continue;
    web.push([xk, xk]);
    web.push([xk, xNext]);
    web.push([xNext, xNext]);
  }
  const webLine = line<[number, number]>()
    .x((p) => x(p[0]))
    .y((p) => y(p[1]));
  g.append('path').attr('fill', 'none').attr('stroke-width', 1.8).style('stroke', 'var(--accent)').attr('d', webLine(web) ?? '');
  for (let k = 0; k < xs.length; k++) {
    const xk = xs[k];
    if (xk === undefined) continue;
    g.append('circle').attr('cx', x(xk)).attr('cy', y(xk)).attr('r', 3.5).style('fill', 'var(--accent)').attr('opacity', 0.8);
  }

  g.append('circle').attr('cx', x(fixed)).attr('cy', y(fixed)).attr('r', 6).attr('fill', 'none').attr('stroke', 'var(--bound)').attr('stroke-width', 2);
  g.append('text')
    .attr('x', x(fixed))
    .attr('y', y(fixed) - 12)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(`x* ≈ ${fmt(fixed, 5)}`);

  const n = xs.length - 1;
  const errN = errors[n] ?? 0;
  const boundN = bounds[n] ?? 0;
  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`n = ${n} · |x_n − x*| ≈ ${fmt(errN, 4)}`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(`${localize({ ko: '상한', en: 'bound' }, lang)} qⁿ|x₀−x*| = ${fmt(boundN, 4)} (q = ${fmt(q, 4)})`);
}

export default defineSimpleScene<BanachData>({
  model: banachModel,
  drawMain,
});
