import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, fmtSci, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  analyticF,
  DIX_MAX,
  DIX_MIN,
  differentiationUnderIntegralModel,
  type DifferentiationUnderIntegralData,
} from '../models/differentiationUnderIntegral';

/**
 * Differentiation under the integral sign, live. F(x) = integral_0^1 t^x dt
 * is drawn with the tangent at the slider position; the readouts compare the
 * three numerical estimates (quadrature of t^x, quadrature of t^x ln t, and
 * numerical differentiation of the quadrature) against the analytic values
 * 1/(x+1) and -1/(x+1)^2. Raising n drives all three errors to zero together.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

function compareText(data: DifferentiationUnderIntegralData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(x = ${fmt(data.x, 2)}\), \(n = ${data.n}\):
수치적분 \(\int_0^1 t^x\,dt = ${fmt(data.numF, 8)}\) (해석값 \(\frac{1}{x+1} = ${fmt(data.analyticF, 8)}\))
적분기호 아래 미분 \(\int_0^1 t^x \ln t\,dt = ${fmt(data.numG, 8)}\), 수치미분 \(= ${fmt(data.numFp, 8)}\) (해석값 \(-\frac{1}{(x+1)^2} = ${fmt(data.analyticFp, 8)}\))`,
      en: String.raw`\(x = ${fmt(data.x, 2)}\), \(n = ${data.n}\):
quadrature \(\int_0^1 t^x\,dt = ${fmt(data.numF, 8)}\) (analytic \(\frac{1}{x+1} = ${fmt(data.analyticF, 8)}\))
under-integral derivative \(\int_0^1 t^x \ln t\,dt = ${fmt(data.numG, 8)}\), numerical derivative \(= ${fmt(data.numFp, 8)}\) (analytic \(-\frac{1}{(x+1)^2} = ${fmt(data.analyticFp, 8)}\))`,
    },
    lang,
  );
}

function errorText(data: DifferentiationUnderIntegralData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`오차: \(|F_{\mathrm{num}} - F| = ${fmtSci(data.errF, 2)}\), \(|G_{\mathrm{num}} - F'| = ${fmtSci(data.errG, 2)}\), \(|F'_{\mathrm{num}} - F'| = ${fmtSci(data.errFp, 2)}\)
\(n\)을 키우면 세 오차가 함께 0으로 갑니다 — 미분과 적분의 순서교환이 수치적으로 성립하는 모습입니다.`,
      en: String.raw`Errors: \(|F_{\mathrm{num}} - F| = ${fmtSci(data.errF, 2)}\), \(|G_{\mathrm{num}} - F'| = ${fmtSci(data.errG, 2)}\), \(|F'_{\mathrm{num}} - F'| = ${fmtSci(data.errFp, 2)}\)
Raising \(n\) drives all three errors to zero together — the interchange of differentiation and integration, numerically.`,
    },
    lang,
  );
}

function explainText(_data: DifferentiationUnderIntegralData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`곡선은 \(F(x) = \int_0^1 t^x\,dt = \frac{1}{x+1}\), 점선은 \(x\)에서의 접선(기울기 \(F'(x) = -\frac{1}{(x+1)^2}\))입니다.
\(t^x\)를 \(x\)로 편미분하면 \(t^x \ln t\) — 적분기호 안에서 미분한 것을 적분해도 같은 접선 기울기가 나옵니다 (아래 문제 1·2).
\(n\)은 심슨 공식의 구간 수입니다.`,
      en: String.raw`The curve is \(F(x) = \int_0^1 t^x\,dt = \frac{1}{x+1}\); the dashed line is the tangent at \(x\) (slope \(F'(x) = -\frac{1}{(x+1)^2}\)).
Differentiating \(t^x\) in \(x\) gives \(t^x \ln t\) — integrating the inside-differentiated integrand yields the same tangent slope (problems 1–2 below).
\(n\) is the Simpson panel count.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: DifferentiationUnderIntegralData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `적분기호 아래에서의 미분: F(x) = ∫₀¹ tˣ dt = 1/(x+1)`,
          en: `Differentiation under the integral sign: F(x) = ∫₀¹ tˣ dt = 1/(x+1)`,
        },
        lang,
      ),
    );

  const x = scaleLinear().domain([DIX_MIN, DIX_MAX]).range([0, width]);
  const yMax = analyticF(DIX_MIN) * 1.12;
  const y = scaleLinear().domain([0, yMax]).range([height, 0]);

  // Clip everything to the plot rectangle (the tangent may exit below y = 0).
  const clipId = 'dix-clip';
  g.append('clipPath')
    .attr('id', clipId)
    .append('rect')
    .attr('width', width)
    .attr('height', height);
  const plot = g.append('g').attr('clip-path', `url(#${clipId})`);

  const curveLine = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  plot
    .append('path')
    .datum(data.curve)
    .attr('d', curveLine)
    .attr('fill', 'none')
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 2.5);

  // Tangent at the current x.
  const t = data.tangent;
  plot
    .append('line')
    .attr('x1', x(t.x1))
    .attr('y1', y(t.y1))
    .attr('x2', x(t.x2))
    .attr('y2', y(t.y2))
    .attr('stroke', 'var(--bound)')
    .attr('stroke-width', 1.8)
    .attr('stroke-dasharray', '6 4')
    .attr('opacity', 0.9);

  // The point (x, F(x)).
  plot
    .append('circle')
    .attr('cx', x(data.x))
    .attr('cy', y(data.analyticF))
    .attr('r', 5)
    .attr('fill', 'var(--accent)');

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('text')
    .attr('x', width)
    .attr('y', 14)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `접선 기울기 = ${fmt(data.analyticFp, 4)} = ∫₀¹ tˣ ln t dt ≈ ${fmt(data.numG, 4)}`,
          en: `tangent slope = ${fmt(data.analyticFp, 4)} = ∫₀¹ tˣ ln t dt ≈ ${fmt(data.numG, 4)}`,
        },
        lang,
      ),
    );
}

export default defineSimpleScene<DifferentiationUnderIntegralData>({
  model: differentiationUnderIntegralModel,
  margin: MARGIN,
  fallbackHeight: 320,
  drawMain,
  slots: [
    { text: compareText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: errorText, cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
    { text: explainText, cssText: 'white-space: pre-line; margin-top: 4px;' },
  ],
});
