import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { betaModel, type BetaData } from '../models/betaFunction';

/**
 * The beta function B(p, q) = ∫₀¹ t^{p-1}(1-t)^{q-1} dt: the shaded area under
 * the integrand curve. The p slider tips the mass toward t = 1, the q slider
 * toward t = 0; when p = q the curve is symmetric. The readout ties the slider
 * positions to the value through the bridge B(p,q) = Γ(p)Γ(q)/Γ(p+q).
 */

/** Top of the y domain: endpoint spikes for p or q below 1 are clipped here. */
const Y_MAX = 8;

function factsText(data: BetaData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`적분 정의 \(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\) — \(p, q > 0\)에서 수렴. 현재 \(p = ${fmt(data.p, 1)}\), \(q = ${fmt(data.q, 1)}\)에서 \(B(p,q) \approx ${fmt(data.value, 6)}\).`,
      en: String.raw`Defined by the integral \(B(p,q) = \int_0^1 t^{p-1}(1-t)^{q-1}\,dt\) — converges for \(p, q > 0\). At \(p = ${fmt(data.p, 1)}\), \(q = ${fmt(data.q, 1)}\): \(B(p,q) \approx ${fmt(data.value, 6)}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`대칭성 \(B(p,q) = B(q,p)\) — \(u = 1-t\) 치환의 결과. 그리고 \(B(p,q) = \Gamma(p)\Gamma(q)/\Gamma(p+q)\)가 감마함수와의 다리다.`,
      en: String.raw`Symmetry \(B(p,q) = B(q,p)\) — the result of the substitution \(u = 1-t\). And \(B(p,q) = \Gamma(p)\Gamma(q)/\Gamma(p+q)\) is the bridge to the gamma function.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: BetaData, lang: Lang): void {
  const { g, width, height } = chart;

  const x = scaleLinear().domain([0, 1.04]).range([0, width]);
  const y = scaleLinear().domain([0, Y_MAX]).range([height, 0]);

  g.selectAll('*').remove();

  g.append('g').call(axisLeft(y).ticks(5));
  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(10));

  const clippedY = (v: number): number => y(Math.min(Y_MAX, v));

  // Shaded area under the integrand curve: that area is B(p, q).
  const shade = area<BetaData['samples'][number]>()
    .x((s) => x(s.t))
    .y0(y(0))
    .y1((s) => clippedY(s.y));
  g.append('path')
    .attr('d', shade(data.samples) ?? '')
    .attr('fill', 'var(--accent)')
    .attr('opacity', 0.25);

  // The integrand curve, clipped at the top of the y domain.
  const curve = line<BetaData['samples'][number]>()
    .x((s) => x(s.t))
    .y((s) => clippedY(s.y));
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', curve(data.samples) ?? '');

  const readout = localize({ ko: '넓이', en: 'area' }, lang);
  g.append('text')
    .attr('x', Math.min(x(0.62) + 8, width - 4))
    .attr('y', 16)
    .attr('text-anchor', 'start')
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(
      `${readout}: B(${fmt(data.p, 1)}, ${fmt(data.q, 1)}) ≈ ${fmt(data.value, 6)}`,
    );
}

export default defineSimpleScene<BetaData>({
  model: betaModel,
  drawMain,
  slots: [{ text: factsText, bold: true }, { text: (_data, lang) => verdictText(lang), bold: true }],
});
