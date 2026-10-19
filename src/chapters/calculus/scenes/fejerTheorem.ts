import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { fejerModel, type FejerData, type FejerSample } from '../models/fejerTheorem';

/**
 * Fejer's theorem, live. The triangle wave f is drawn in gray, its raw
 * Fourier partial sum S_N (bound color) visibly wiggles while the Cesaro
 * mean sigma_N (accent color) is already smooth — the smoothing that Fejer's
 * theorem guarantees for every continuous 2pi-periodic f. The readout quotes
 * both sup errors honestly: on this smooth f the raw partial sums actually
 * win the sup-norm race; the strips below describe the Fejer kernel K_N, the
 * nonnegative approximate identity doing the smoothing.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: FejerData, lang: Lang): string {
  const { n, supErrS, supErrSigma } = data;
  return localize(
    {
      ko: String.raw`\(N = ${n}\): \(\lVert S_N - f \rVert_\infty \approx ${fmt(supErrS, 4)}\), \(\lVert \sigma_N - f \rVert_\infty \approx ${fmt(supErrSigma, 4)}\). 이 매끄러운 \(f\)에서는 sup 노름 경주에서 \(S_N\)이 이깁니다 — 하지만 그림을 보세요. \(S_N\)은 여전히 물결치고, \(\sigma_N\)은 벌써 매끈합니다.`,
      en: String.raw`\(N = ${n}\): \(\lVert S_N - f \rVert_\infty \approx ${fmt(supErrS, 4)}\), \(\lVert \sigma_N - f \rVert_\infty \approx ${fmt(supErrSigma, 4)}\). On this smooth \(f\) the raw partial sum wins the sup-norm race — but look: \(S_N\) still wiggles while \(\sigma_N\) is already smooth.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`Cesàro 평균이 울림을 매끈하게 다림질합니다 — Fejér 정리: 연속인 \(2\pi\)-주기 함수 \(f\)라면 원시 부분합이 말썽을 부려도 \(\sigma_N(f) \to f\)가 균등수렴합니다.`,
      en: String.raw`Cesàro means iron out the ringing — Fejér's theorem: for every continuous \(2\pi\)-periodic \(f\), \(\sigma_N(f) \to f\) uniformly, even when the raw partial sums misbehave.`,
    },
    lang,
  );
}

function kernelNoteText(data: FejerData, lang: Lang): string {
  const { n } = data;
  return localize(
    {
      ko: String.raw`Fejér 핵 \(K_${n}\) — 음이 아닌 뾰족한 봉우리(\(K_${n}(0) = ${n}\)), 총 질량 \(\frac{1}{2\pi}\int K_${n} = 1\). \(\sigma_N(f) = \frac{1}{2\pi}(f * K_${n})\): 평균을 취한다는 것은 이 핵과 합성곱하는 것과 같습니다.`,
      en: String.raw`The Fejér kernel \(K_${n}\) — a nonnegative spike (\(K_${n}(0) = ${n}\)) of total mass \(\frac{1}{2\pi}\int K_${n} = 1\). \(\sigma_N(f) = \frac{1}{2\pi}(f * K_${n})\): taking Cesàro means is convolution with this kernel.`,
    },
    lang,
  );
}

const path = line<FejerSample>()
  .x((d) => d.x)
  .y((d) => d.y);

function drawMain(chart: Chart, data: FejerData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();
  const x = scaleLinear().domain([-Math.PI, Math.PI]).range([0, width]);
  const y = scaleLinear().domain([-0.15, 1.25]).range([height, 0]);
  const px = path.x((d) => x(d.x)).y((d) => y(d.y));

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
          ko: `삼각파 f와 그 근사: S_${data.n} (물결) vs σ_${data.n} (매끈)`,
          en: `Triangle wave f and its approximations: S_${data.n} (wiggly) vs σ_${data.n} (smooth)`,
        },
        lang,
      ),
    );

  // f, dashed gray.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6 4')
    .attr('opacity', 0.55)
    .attr('stroke', 'currentColor')
    .attr('d', px(data.f) ?? '');
  // S_N, bound color: visibly wiggly.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)')
    .attr('d', px(data.sN) ?? '');
  // sigma_N, accent: smooth.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.sigmaN) ?? '');

  // Legend.
  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '┄ f (삼각파)', en: '┄ f (triangle wave)' }, lang));
  g.append('text')
    .attr('x', width * 0.34)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: `— S_${data.n} (부분합)`, en: `— S_${data.n} (partial sum)` }, lang));
  g.append('text')
    .attr('x', width * 0.64)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: `— σ_${data.n} (Cesàro 평균)`, en: `— σ_${data.n} (Cesàro mean)` }, lang));
}

export default defineSimpleScene<FejerData>({
  model: fejerModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true },
    { text: kernelNoteText, spaced: true },
  ],
  mountExtra: (strips, lang) => {
    // Cross-link: the square-wave scene this one deepens (Gibbs ringing
    // that Cesaro means smooth out).
    const seeAlso = document.createElement('div');
    seeAlso.style.marginTop = '4px';
    const fourierLink = document.createElement('a');
    fourierLink.href = '../fourier/';
    fourierLink.textContent = localize(
      {
        ko: '푸리에 정사각파 씬 — 울림이 죽지 않는 경우',
        en: 'Fourier square-wave scene — when the ringing never dies',
      },
      lang,
    );
    seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), fourierLink);
    strips.append(seeAlso);
  },
});
