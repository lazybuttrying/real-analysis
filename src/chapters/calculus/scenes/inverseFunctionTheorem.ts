import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  curveDomain,
  inverseFunctionTheoremModel,
  type InverseFunctionTheoremData,
  type InverseSample,
} from '../models/inverseFunctionTheorem';

/**
 * Inverse function theorem, live (1D). The curve of f and its reflection
 * across the dashed diagonal y = x (the inverse g) share a point pair
 * (a, b) <-> (b, a); the two tangent lines there have slopes f'(a) and
 * g'(b), and the theorem says they multiply to 1.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function fLabel(fn: string, lang: Lang): string {
  const name = fn === 'e^x' ? 'e^x' : 'x^3+x';
  return localize({ ko: `f(x) = ${name}`, en: `f(x) = ${name}` }, lang);
}

function readoutText(data: InverseFunctionTheoremData, lang: Lang): string {
  const fname = data.fn === 'e^x' ? 'e^x' : 'x^3+x';
  return localize(
    {
      ko: String.raw`\(f(x) = ${fname}\), \(a = ${fmt(data.a, 1)}\): \(f'(a) \approx ${fmt(data.fpA, 6)}\), \(g'(b) \approx ${fmt(data.gpB, 6)}\), 곱은 \(f'(a)\,g'(b) \approx ${fmt(data.slopeProduct, 6)} = 1\). 두 접선의 기울기는 서로의 역수입니다.`,
      en: String.raw`\(f(x) = ${fname}\), \(a = ${fmt(data.a, 1)}\): \(f'(a) \approx ${fmt(data.fpA, 6)}\), \(g'(b) \approx ${fmt(data.gpB, 6)}\), and their product \(f'(a)\,g'(b) \approx ${fmt(data.slopeProduct, 6)} = 1\). The two tangent slopes are reciprocals.`,
    },
    lang,
  );
}

function verdictText(data: InverseFunctionTheoremData, lang: Lang): string {
  const fname = data.fn === 'e^x' ? 'e^x' : 'x^3+x';
  return localize(
    {
      ko: String.raw`1차원 역함수 정리: \(f\)가 \(x_0\) 근처에서 \(C^1\)이고 \(f'(x_0) \ne 0\)이면, \(f\)는 \(x_0\) 근처에서 국소 역함수 \(g\)를 갖고 \(g'(f(x_0)) = \frac{1}{f'(x_0)}\)입니다. 그림에서 \(f(x) = ${fname}\)의 접선 기울기 \(${fmt(data.fpA, 4)}\)와 역함수 접선 기울기 \(${fmt(data.gpB, 4)}\)의 곱이 1이 됩니다.`,
      en: String.raw`Inverse function theorem (1D): if \(f\) is \(C^1\) near \(x_0\) and \(f'(x_0) \ne 0\), then \(f\) has a local inverse \(g\) near \(x_0\) with \(g'(f(x_0)) = \frac{1}{f'(x_0)}\). Here \(f(x) = ${fname}\): the tangent slope \(${fmt(data.fpA, 4)}\) on \(f\) times the tangent slope \(${fmt(data.gpB, 4)}\) on the inverse equals 1.`,
    },
    lang,
  );
}

const path = line<InverseSample>()
  .x((d) => d.x)
  .y((d) => d.y);

function drawMain(chart: Chart, data: InverseFunctionTheoremData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const { xMin, xMax } = curveDomain(data.fn);
  // The g curve lives on the y-axis of f, so widen the x domain to fit it.
  const gMaxX = Math.max(...data.gCurve.map((p) => p.x));
  const domX = [Math.min(xMin, 0), Math.max(xMax, gMaxX * 1.05)];
  const allY = [...data.fCurve.map((p) => p.y), ...data.gCurve.map((p) => p.y)];
  const domY = [Math.min(...allY, 0) - 0.5, Math.max(...allY) + 0.5];

  const x = scaleLinear().domain(domX as [number, number]).range([0, width]);
  const y = scaleLinear().domain(domY as [number, number]).range([height, 0]);
  const px = path.x((d) => x(d.x)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(8));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(fLabel(data.fn, lang) + localize({ ko: ' 와 역함수 (대각선 대칭)', en: ' and its inverse (diagonal reflection)' }, lang));

  // Diagonal y = x, dashed.
  const dLo = Math.max(domX[0] as number, domY[0] as number);
  const dHi = Math.min(domX[1] as number, domY[1] as number);
  g.append('line')
    .attr('x1', x(dLo))
    .attr('x2', x(dHi))
    .attr('y1', y(dLo))
    .attr('y2', y(dHi))
    .attr('stroke-dasharray', '5 4')
    .attr('stroke-width', 1.5)
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.5);
  g.append('text')
    .attr('x', x(dHi) - 6)
    .attr('y', y(dHi) + 16)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.7)
    .text('y = x');

  // f curve (accent) and g curve (bound).
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.fCurve) ?? '');
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--bound)')
    .attr('d', px(data.gCurve) ?? '');

  // Tangent lines: dashed, in each curve's color.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-dasharray', '6 3')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.fTangent) ?? '');
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-dasharray', '6 3')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)')
    .attr('d', px(data.gTangent) ?? '');

  // The paired points (a, b) on f and (b, a) on g.
  g.append('circle').attr('cx', x(data.a)).attr('cy', y(data.b)).attr('r', 5).style('fill', 'var(--accent)');
  g.append('circle').attr('cx', x(data.b)).attr('cy', y(data.a)).attr('r', 5).style('fill', 'var(--bound)');
  g.append('text')
    .attr('x', x(data.a) + 8)
    .attr('y', y(data.b) - 8)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: `(a, f(a)) 기울기 ${fmt(data.fpA, 3)}`, en: `(a, f(a)) slope ${fmt(data.fpA, 3)}` }, lang));
  g.append('text')
    .attr('x', x(data.b) + 8)
    .attr('y', y(data.a) - 8)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: `(b, g(b)) 기울기 ${fmt(data.gpB, 4)}`, en: `(b, g(b)) slope ${fmt(data.gpB, 4)}` }, lang));

  // Legend.
  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '— f (실선) · 접선 (점선)', en: '— f (solid) · tangent (dashed)' }, lang));
  g.append('text')
    .attr('x', width * 0.45)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: '— g = f⁻¹ (실선) · 접선 (점선)', en: '— g = f⁻¹ (solid) · tangent (dashed)' }, lang));
}

export default defineSimpleScene<InverseFunctionTheoremData>({
  model: inverseFunctionTheoremModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
