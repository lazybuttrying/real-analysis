import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { bernsteinModel, type BernsteinData, type BernsteinSample } from '../models/weierstrass-approx';

/**
 * The Weierstrass approximation theorem via Bernstein polynomials: every
 * continuous f on [0,1] is the uniform limit of polynomials B_n(f).
 * f is drawn dashed, the approximant B_n(f) solid accent; raising n squeezes
 * the gap shut. The full estimate proving uniform convergence is long, so the
 * scene states the theorem and sketches the idea (labeled): the basis
 * concentrates its mass near x, and uniform continuity of f does the rest.
 */

function factsText(lang: Lang): string {
  return localize(
    {
      ko: '1차 이하 다항식은 정확히 재현된다',
      en: String.raw`polynomials of degree \(\leq 1\) are reproduced exactly`,
    },
    lang,
  );
}

/** Idea-level sketch, explicitly labeled so nobody mistakes it for a proof. */
function ideaText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`아이디어 수준 설명 — \(B_n\) 기저의 질량은 \(n\)이 커질수록 \(x\) 근처에 모이고, \(f\)의 균등연속성이 나머지를 맡는다. 완전한 추정식은 길어 여기서 생략한다.`,
      en: String.raw`idea-level sketch — the basis mass of \(B_n\) concentrates near \(x\) as \(n\) grows, and uniform continuity of \(f\) does the rest. The full estimate is long, so it is omitted here.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(n \to \infty\)이면 \(\lVert B_n(f) - f\rVert_\infty \to 0\)`,
      en: String.raw`as \(n \to \infty\), \(\lVert B_n(f) - f\rVert_\infty \to 0\)`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: BernsteinData, lang: Lang): void {
    const { g, width, height } = chart;
    const { n, maxErr, samples } = data;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const yMin = Math.min(...samples.flatMap((p) => [p.y, p.p]));
    const yMax = Math.max(...samples.flatMap((p) => [p.y, p.p]));
    const pad = Math.max(0.1, (yMax - yMin) * 0.15);
    const y = scaleLinear()
      .domain([yMin - pad, yMax + pad])
      .range([height, 0]);

    const fLine = line<BernsteinSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));
    const pLine = line<BernsteinSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.p));

    g.selectAll('*').remove();
    g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('path').attr('fill', 'none').attr('stroke-width', 2).attr('stroke-dasharray', '5 4').attr('opacity', 0.65).attr('d', fLine(samples) ?? '');
    g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', pLine(samples) ?? '');

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`B_${n}(x)`);
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(`${localize({ ko: '[0, 1] 최대 오차', en: 'max error on [0, 1]' }, lang)} ≈ ${fmt(maxErr, 4)}`);
}

export default defineSimpleScene<BernsteinData>({
  model: bernsteinModel,
  drawMain,
  slots: [
    { text: (_data, lang) => factsText(lang), bold: true },
    { text: (_data, lang) => ideaText(lang), cssText: 'opacity: 0.75;' },
    { text: (_data, lang) => verdictText(lang), bold: true }
  ],
});
