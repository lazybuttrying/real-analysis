import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { improperModel, type ImproperData, type ImproperSample } from '../models/improper';

// The curve x^{-p} with the integrated area shaded. The readout reports the
// closed-form area on the current interval and the verdict: converges to a
// finite limit (accent) or diverges (bound).

const MARGIN = { top: 64, right: 20, bottom: 40, left: 64 };

function drawMain(chart: Chart, data: ImproperData, lang: Lang): void {
  const { g, width, height } = chart;
  const { kind, p, R, eps, samples, area: areaValue, limit, converges } = data;

  const x0 = kind === 'tail' ? 1 : eps;
  const x1 = kind === 'tail' ? R : 1;
  const maxY = Math.max(...samples.map((s) => s.y));

  const x = scaleLinear().domain([x0, x1]).range([0, width]);
  const y = scaleLinear().domain([0, maxY]).range([height, 0]);

  const verdictColor = converges ? 'var(--accent)' : 'var(--bound)';

  const curve = line<ImproperSample>()
    .x((s) => x(s.x))
    .y((s) => y(s.y));
  const shade = area<ImproperSample>()
    .x((s) => x(s.x))
    .y0(y(0))
    .y1((s) => y(s.y));

  g.selectAll('*').remove();

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
  g.append('g').call(axisLeft(y).ticks(5));

  // Shaded integrated area.
  g.append('path').attr('d', shade(samples) ?? '').attr('fill', verdictColor).attr('opacity', 0.25);

  // The curve itself.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'currentColor')
    .attr('d', curve(samples) ?? '');

  const intervalLabel =
    kind === 'tail'
      ? `R = ${R}`
      : localize({ ko: `ε = ${fmt(eps, 4)}`, en: `ε = ${fmt(eps, 4)}` }, lang);
  const verdict = converges
    ? localize(
        { ko: `수렴 (극한 ${fmt(limit ?? 0)})`, en: `converges (limit ${fmt(limit ?? 0)})` },
        lang,
      )
    : localize({ ko: '발산', en: 'diverges' }, lang);

  g.append('text')
    .attr('x', 0)
    .attr('y', -42)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(`p = ${fmt(p)}   ${intervalLabel}`);
  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .style('fill', verdictColor)
    .text(
      localize(
        { ko: `넓이 ≈ ${fmt(areaValue)} → ${verdict}`, en: `area ≈ ${fmt(areaValue)} → ${verdict}` },
        lang,
      ),
    );
  g.append('text')
    .attr('x', 0)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.75)
    .text(
      localize(
        {
          ko: kind === 'tail' ? '꼬리 적분 ∫₁ᴿ dx/xᵖ — p > 1일 때만 수렴' : '특이점 적분 ∫_ε¹ dx/xᵖ — p < 1일 때만 수렴',
          en: kind === 'tail' ? 'tail integral ∫₁ᴿ dx/xᵖ — converges only for p > 1' : 'singular integral ∫_ε¹ dx/xᵖ — converges only for p < 1',
        },
        lang,
      ),
    );
}

export default defineSimpleScene<ImproperData>({ model: improperModel, margin: MARGIN, drawMain });
