import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  convolutionModel,
  phiEps,
  stepFunction,
  type ConvolutionData,
  type ConvolutionSample,
} from '../models/convolution';

/**
 * Convolution, live. Tent mode: f = g = 1_[0,1] on the t axis, the flipped
 * window g(x - t) slides with x, and the shaded product is their overlap --
 * its length is (f * g)(x), traced by the faint tent curve behind. Smooth
 * mode: f is the step function and phi_eps is a tent bump of mass 1
 * centered (in t) at the evaluation point; the shaded area under the
 * product is (f * phi_eps)(x), and the accent curve is the smoothed step,
 * which tends to f as eps shrinks, away from the jump at 0.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: ConvolutionData, lang: Lang): string {
  if (data.mode === 'tent') {
    return localize(
      {
        ko: String.raw`\(x = ${fmt(data.x, 2)}\): 겹침 구간 \([${fmt(data.overlapLo, 2)},\, ${fmt(data.overlapHi, 2)}]\)의 길이가 곧 \((f * g)(x) = ${fmt(data.value, 4)}\)입니다.`,
        en: String.raw`\(x = ${fmt(data.x, 2)}\): the length of the overlap interval \([${fmt(data.overlapLo, 2)},\, ${fmt(data.overlapHi, 2)}]\) is \((f * g)(x) = ${fmt(data.value, 4)}\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(x = ${fmt(data.x, 2)}\), \(\varepsilon = ${fmt(data.eps, 2)}\): \((f * \varphi_{\varepsilon})(x) \approx ${fmt(data.value, 4)}\) (닫힌 형태 값 \( ${fmt(data.exactValue, 4)}\)와 일치).`,
      en: String.raw`\(x = ${fmt(data.x, 2)}\), \(\varepsilon = ${fmt(data.eps, 2)}\): \((f * \varphi_{\varepsilon})(x) \approx ${fmt(data.value, 4)}\) (closed form \( ${fmt(data.exactValue, 4)}\)).`,
    },
    lang,
  );
}

function explainText(data: ConvolutionData, lang: Lang): string {
  if (data.mode === 'tent') {
    return localize(
      {
        ko: String.raw`합성곱은 슬라이딩 가중 평균입니다: \(g\)를 뒤집어 \(x\)만큼 밀고, \(f\)와 겹치는 넓이를 잽니다. 여기서 두 지시함수의 곱은 겹친 구간에서만 \(1\)이라 넓이가 곧 길이입니다.`,
        en: String.raw`Convolution is a sliding weighted average: flip \(g\), shift it by \(x\), and measure the overlap with \(f\). Here the product of the two indicators is \(1\) exactly on the overlap, so the area is just its length.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`합성곱은 슬라이딩 가중 평균입니다: 너비 \(\varepsilon\)인 텐트 봉우리 \(\varphi_{\varepsilon}\) (전체 질량 \(1\))가 \(x\) 근처 \(f\)의 값들을 가중 평균합니다. 봉우리가 좁아질수록 평균은 \(x\) 한 점의 값에 가까워집니다.`,
      en: String.raw`Convolution is a sliding weighted average: the tent bump \(\varphi_{\varepsilon}\) of width \(\varepsilon\) and total mass \(1\) averages the values of \(f\) near \(x\). The narrower the bump, the closer the average is to the value at the single point \(x\).`,
    },
    lang,
  );
}

function verdictText(data: ConvolutionData, lang: Lang): string {
  if (data.mode === 'tent') {
    return localize(
      {
        ko: String.raw`판정: \((f * g)(x)\)는 텐트 공식과 같습니다 -- \([0,1]\)에서 \(x\), \([1,2]\)에서 \(2 - x\), 밖에서는 \(0\). 지금 값 \(${fmt(data.value, 4)}\)도 정확히 그 공식 값입니다.`,
        en: String.raw`Verdict: \((f * g)(x)\) equals the tent formula -- \(x\) on \([0,1]\), \(2 - x\) on \([1,2]\), \(0\) outside. The current value ${fmt(data.value, 4)} is exactly that formula value.`,
      },
      lang,
    );
  }
  if (data.x === 0) {
    return localize(
      {
        ko: String.raw`판정: \(x = 0\)은 점프점입니다. 대칭인 봉우리가 양쪽을 절반씩 받으므로 모든 \(\varepsilon\)에 대해 값이 \(1/2\)로 머뭅니다 -- 수렴 보장은 연속점 \(x \ne 0\)에서만 성립합니다.`,
        en: String.raw`Verdict: \(x = 0\) is the jump point. The symmetric bump takes half its mass from each side, so the value stays at \(1/2\) for every \(\varepsilon\) -- convergence is guaranteed only at continuity points \(x \ne 0\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`판정: \(\varepsilon\)이 줄면 \((f * \varphi_{\varepsilon})(x) \to f(x)\)입니다 -- 연속점 \(x \ne 0\)에서는요. 지금 \(f(${fmt(data.x, 2)}) = ${fmt(stepFunction(data.x), 0)}\)이고 부드럽게 된 값은 \( ${fmt(data.value, 4)}\)입니다.`,
      en: String.raw`Verdict: as \(\varepsilon\) shrinks, \((f * \varphi_{\varepsilon})(x) \to f(x)\) -- at continuity points \(x \ne 0\). Here \(f(${fmt(data.x, 2)}) = ${fmt(stepFunction(data.x), 0)}\) and the smoothed value is \( ${fmt(data.value, 4)}\).`,
    },
    lang,
  );
}

const samplePath = line<ConvolutionSample>()
  .x((d) => d.x)
  .y((d) => d.y);

function drawTent(chart: Chart, data: ConvolutionData, lang: Lang): void {
  const { g, width, height } = chart;
  const x = scaleLinear().domain([-0.5, 2.5]).range([0, width]);
  const y = scaleLinear().domain([0, 1.3]).range([height, 0]);
  const px = samplePath.x((d) => x(d.x)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(7));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: 'f(t) (고정), 뒤집힌 창 g(x - t), 겹침 = 곱, 흔적 = 텐트 곡선',
          en: 'f(t) (fixed), flipped window g(x - t), overlap = product, trace = tent curve',
        },
        lang,
      ),
    );

  // The traced tent curve (f * g)(s), faint, with the current point marked.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('opacity', 0.35)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.tentTrace as ConvolutionSample[]) ?? '');

  const top = y(1);
  const bottom = y(0);
  // f: the fixed block on [0, 1].
  g.append('rect')
    .attr('x', x(0))
    .attr('width', Math.max(0, x(1) - x(0)))
    .attr('y', top)
    .attr('height', bottom - top)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.12)
    .attr('stroke', 'currentColor')
    .attr('stroke-dasharray', '6 4');
  // The flipped window g(x - t): the block on [x - 1, x].
  g.append('rect')
    .attr('x', x(data.x - 1))
    .attr('width', Math.max(0, x(data.x) - x(data.x - 1)))
    .attr('y', top)
    .attr('height', bottom - top)
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)');
  // The product: shading over the overlap interval only.
  if (data.overlapHi > data.overlapLo) {
    g.append('rect')
      .attr('x', x(data.overlapLo))
      .attr('width', Math.max(0, x(data.overlapHi) - x(data.overlapLo)))
      .attr('y', top)
      .attr('height', bottom - top)
      .style('fill', 'var(--accent)')
      .attr('opacity', 0.5);
  }

  // Current point on the tent trace.
  g.append('circle')
    .attr('cx', x(data.x))
    .attr('cy', y(data.exactValue))
    .attr('r', 5)
    .style('fill', 'var(--accent)')
    .attr('stroke', 'currentColor');

  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '┄ f(t) = 1_[0,1]', en: '┄ f(t) = 1_[0,1]' }, lang));
  g.append('text')
    .attr('x', width * 0.36)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: '— 창 [x-1, x]', en: '— window [x-1, x]' }, lang));
  g.append('text')
    .attr('x', width * 0.64)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '■ 곱 / 텐트 흔적', en: '■ product / tent trace' }, lang));
}

function drawSmooth(chart: Chart, data: ConvolutionData, lang: Lang): void {
  const { g, width, height } = chart;
  const x = scaleLinear().domain([-1, 2.5]).range([0, width]);
  const yMax = Math.max(1.3, (1 / data.eps) * 1.15);
  const y = scaleLinear().domain([0, yMax]).range([height, 0]);
  const px = samplePath.x((d) => x(d.x)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(7));
  g.append('g').call(axisLeft(y).ticks(5));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `계단 f, t = x에 중심을 둔 봉우리, 부드럽게 된 곡선 (봉우리 높이 1/ε = ${fmt(1 / data.eps, 2)})`,
          en: `Step f, bump centered at t = x, smoothed curve (bump height 1/eps = ${fmt(1 / data.eps, 2)})`,
        },
        lang,
      ),
    );

  // Product shading: area under phi_eps(x - t) for t >= 0 (where f = 1).
  const prodLo = Math.max(0, data.x - data.eps);
  const prodHi = Math.min(2.5, data.x + data.eps);
  if (prodHi > prodLo) {
    const pts: ConvolutionSample[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = prodLo + ((prodHi - prodLo) * i) / steps;
      pts.push({ x: t, y: phiEps(data.x - t, data.eps) });
    }
    const areaPath =
      `M${x(prodLo)},${y(0)}` +
      pts.map((p) => `L${x(p.x)},${y(p.y)}`).join('') +
      `L${x(prodHi)},${y(0)}Z`;
    g.append('path').attr('d', areaPath).style('fill', 'var(--accent)').attr('opacity', 0.35);
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)')
      .attr('d', px(pts) ?? '');
  }

  // f: the step, faint dashed.
  const stepPts: ConvolutionSample[] = [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 2.5, y: 1 },
  ];
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6 4')
    .attr('opacity', 0.55)
    .attr('stroke', 'currentColor')
    .attr('d', px(stepPts) ?? '');

  // The smoothed curve (f * phi_eps)(s), accent, current point marked.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.smoothTrace as ConvolutionSample[]) ?? '');
  g.append('circle')
    .attr('cx', x(data.x))
    .attr('cy', y(data.value))
    .attr('r', 5)
    .style('fill', 'var(--accent)')
    .attr('stroke', 'currentColor');

  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '┄ f (계단)', en: '┄ f (step)' }, lang));
  g.append('text')
    .attr('x', width * 0.3)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: '— 봉우리 φ_ε(x - t)', en: '— bump phi_eps(x - t)' }, lang));
  g.append('text')
    .attr('x', width * 0.66)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '— 부드럽게 된 곡선', en: '— smoothed curve' }, lang));
}

function drawMain(chart: Chart, data: ConvolutionData, lang: Lang): void {
  chart.g.selectAll('*').remove();
  if (data.mode === 'tent') drawTent(chart, data, lang);
  else drawSmooth(chart, data, lang);
}

export default defineSimpleScene<ConvolutionData>({
  model: convolutionModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
