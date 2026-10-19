import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { createRichSlot, setRichText } from '../../../view/richslot';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { continuityModel, type ContinuityData, type ContinuitySample } from '../models/continuity';

/**
 * Continuity of x^2 at a movable point a. In broken mode the function value
 * jumps to a^2 + 1 while the limit stays a^2, so the epsilon band around the
 * limit no longer captures the marked point: the definition fails.
 */

function verdictText(data: ContinuityData, lang: Lang): string {
  const { a, limitV, funcV, continuous } = data;
  if (continuous) {
    return localize(
      {
        ko: String.raw`\(a = ${fmt(a)}\)에서 연속: \(\lim_{x \to a} x^2 = ${fmt(limitV)} = f(a)\)`,
        en: String.raw`continuous at \(a = ${fmt(a)}\): \(\lim_{x \to a} x^2 = ${fmt(limitV)} = f(a)\)`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`정의 깨짐: \(\lim_{x \to ${fmt(a)}} g(x) = ${fmt(limitV)} \neq ${fmt(funcV)} = g(${fmt(a)})\)`,
      en: String.raw`definition fails: \(\lim_{x \to ${fmt(a)}} g(x) = ${fmt(limitV)} \neq ${fmt(funcV)} = g(${fmt(a)})\)`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: ContinuityData): void {
    const { g, width, height } = chart;
    const { a, broken, limitV, funcV, eps, curve, continuous } = data;

    const x = scaleLinear().domain([-2.4, 2.4]).range([0, width]);
    const y = scaleLinear().domain([-1, 6.2]).range([height, 0]);

    g.selectAll('*').remove();

    // The epsilon band around the limit.
    g.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', y(limitV + eps))
      .attr('height', Math.max(0, y(limitV - eps) - y(limitV + eps)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.12);

    const path = line<ContinuitySample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));
    g.append('path').attr('d', path(curve)).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2);

    // The limit line and the point a.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(limitV))
      .attr('y2', y(limitV))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');
    g.append('line')
      .attr('x1', x(a))
      .attr('x2', x(a))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '4 3');

    if (broken) {
      // The curve's missing point: an open circle at (a, a^2).
      g.append('circle')
        .attr('cx', x(a))
        .attr('cy', y(limitV))
        .attr('r', 6)
        .attr('fill', 'var(--bg)')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2);
    }
    // The actual function value at a.
    g.append('circle').attr('cx', x(a)).attr('cy', y(funcV)).attr('r', 5).attr('fill', continuous ? 'var(--accent)' : 'var(--bound)');

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));
}

export default defineSimpleScene<ContinuityData>({
  model: continuityModel,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: verdictText, bold: true }
  ],
  mountExtra: (strips, lang) => {
    const legend = document.createElement('div');
    legend.style.cssText = 'font-size: 12px; color: var(--muted);';
    strips.prepend(legend);
    setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`밴드 = 극한 \(\pm 0.5\), 채운 점 = \(f(a)\) (broken 모드에서는 빈 동그라미가 극한 지점)`,
            en: String.raw`band = limit \(\pm 0.5\); the filled dot is \(f(a)\) (in broken mode the open circle marks the limit point)`,
          },
          lang,
        ),
      );
  },
});
