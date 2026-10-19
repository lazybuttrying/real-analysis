import { line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { convexFn, convexModel, type ConvexData } from '../models/convex';

/**
 * Convex functions through the chord test: the curve f and the chord
 * between (a, f(a)) and (b, f(b)). The chord floating above the graph is
 * convexity itself, f(tx + (1-t)y) <= t f(x) + (1-t) f(y). The readout
 * reports the max chord-minus-graph gap (always >= 0 for a convex f),
 * and the verdict strip records the differentiable characterization:
 * f convex iff f' increasing.
 */

function readoutText(data: ConvexData, lang: Lang): string {
  const label = localize({ ko: '현 − 그래프 최대 간격', en: 'max chord−graph gap' }, lang);
  const tail = localize({ ko: ' ≥ 0 — 볼록', en: ' ≥ 0 — convex' }, lang);
  return `${label} ${fmt(data.maxGap, 4)}${tail}`;
}

function factsText(data: ConvexData, lang: Lang): string {
  void data;
  return localize(
    {
      ko: '현이 그래프 위에 뜨면 볼록',
      en: 'convex when the chord floats above the graph',
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`미분 가능하면 \(f\) 볼록 \(\iff\) \(f'\) 증가`,
      en: String.raw`if differentiable, \(f\) convex \(\iff\) \(f'\) increasing`,
    },
    lang,
  );
}

const X_MIN = -2.5;
const X_MAX = 2.5;

function drawMain(chart: Chart, data: ConvexData, lang: Lang): void {
  const { g, width, height } = chart;

  const x = scaleLinear().domain([X_MIN, X_MAX]).range([0, width]);
  let yMax = 3;
  for (const p of data.samples) {
    const m = Math.abs(p.y);
    if (m > yMax) yMax = m;
  }
  const y = scaleLinear().domain([-yMax, yMax]).range([height, 0]);

  g.selectAll('*').remove();

  // Faint axes through the origin.
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.25)
    .attr('stroke-width', 1);
  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.25)
    .attr('stroke-width', 1);

  // The function curve.
  const curve = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  g.append('path')
    .attr('d', curve(data.samples) ?? '')
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2);

  // The chord between (a, f(a)) and (b, f(b)).
  const ya = convexFn(data.key, data.a);
  const yb = convexFn(data.key, data.b);
  g.append('line')
    .attr('x1', x(data.a))
    .attr('x2', x(data.b))
    .attr('y1', y(ya))
    .attr('y2', y(yb))
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 2.5);
  for (const [px, py] of [
    [data.a, ya],
    [data.b, yb],
  ] as const) {
    g.append('circle')
      .attr('cx', x(px))
      .attr('cy', y(py))
      .attr('r', 4)
      .attr('fill', 'var(--accent)');
  }

  // Readout: max chord-minus-graph gap.
  g.append('text')
    .attr('x', 8)
    .attr('y', 18)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(readoutText(data, lang));
}

export default defineSimpleScene<ConvexData>({
  model: convexModel,
  drawMain,
  slots: [
    { text: factsText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true },
  ],
});
