import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  lebesgueConvergenceModel,
  VIEW_MAX,
  VIEW_MIN,
  type LebesgueConvergenceData,
} from '../models/lebesgueConvergence';

/**
 * Tao, Analysis II, live. One panel: f_n on [0, 2] (filled bars) against its
 * pointwise limit (dashed outline). The readouts compare the integral of f_n
 * with the integral of the limit: they agree for the monotone example and
 * differ by a full unit of "lost mass" for the escaping spike (no integrable
 * dominating g exists) and the concentrating spike (Fatou, strict).
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

const EXAMPLE_NAME: Record<string, { ko: string; en: string }> = {
  escape: { ko: '이탈: f_n = 1_[n,n+1]', en: 'escape: f_n = 1_[n,n+1]' },
  spike: { ko: '뾰족: f_n = n·1_[0,1/n]', en: 'spike: f_n = n·1_[0,1/n]' },
  monotone: { ko: '단조: f_n = 1_[0,1-1/n]', en: 'monotone: f_n = 1_[0,1-1/n]' },
};

function exampleName(example: string, lang: Lang): string {
  return localize(
    (EXAMPLE_NAME[example] ?? EXAMPLE_NAME['escape']) as { ko: string; en: string },
    lang,
  );
}

function readoutText(data: LebesgueConvergenceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(n = ${data.n}\): \(\int f_n = ${fmt(data.integral, 6)}\) (직선 위 적분), \(\int(\lim f_n) = ${fmt(data.limitIntegral, 6)}\), 차이 \(= ${fmt(data.gap, 6)}\).`,
      en: String.raw`\(n = ${data.n}\): \(\int f_n = ${fmt(data.integral, 6)}\) (integral over the line), \(\int(\lim f_n) = ${fmt(data.limitIntegral, 6)}\), gap \(= ${fmt(data.gap, 6)}\).`,
    },
    lang,
  );
}

function explainText(data: LebesgueConvergenceData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`채운 막대는 \(f_n\), 점선 테두리는 점별 극한입니다. 적분값은 화면 \([0, 2]\)가 아니라 직선 전체에서 잰 엄밀값입니다.`,
      en: String.raw`Filled bars are \(f_n\); the dashed outline is the pointwise limit. The integrals are exact values over the whole line, not just the \([0, 2]\) window.`,
    },
    lang,
  );
  const escapeNote =
    data.example === 'escape' && data.rects.length === 0
      ? localize(
          {
            ko: String.raw` 스파이크는 이미 \([0, 2]\) 창을 벗어나 오른쪽으로 도망갔습니다 — 질량이 "무한대로 탈출"한다는 뜻이 바로 이것입니다.`,
            en: String.raw` The spike has already left the \([0, 2]\) window to the right — this is exactly what "mass escapes to infinity" means.`,
          },
          lang,
        )
      : '';
  return body + escapeNote;
}

function drawMain(chart: Chart, data: LebesgueConvergenceData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([VIEW_MIN, VIEW_MAX]).range([0, width]);
  const y = scaleLinear().domain([0, data.maxHeight * 1.15]).range([height, 0]);

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: `${exampleName(data.example, 'ko')}: f_n (채움) vs 점별 극한 (점선)`, en: `${exampleName(data.example, 'en')}: f_n (filled) vs pointwise limit (dashed)` },
        lang,
      ),
    );

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(5));

  // Pointwise limit, dashed outline.
  for (const r of data.limitRects) {
    g.append('rect')
      .attr('x', x(r.x0))
      .attr('width', Math.max(0, x(r.x1) - x(r.x0)))
      .attr('y', y(r.height))
      .attr('height', Math.max(0, y(0) - y(r.height)))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.8);
  }

  // f_n, filled bars.
  for (const r of data.rects) {
    g.append('rect')
      .attr('x', x(r.x0))
      .attr('width', Math.max(0, x(r.x1) - x(r.x0) - 0.5))
      .attr('y', y(r.height))
      .attr('height', Math.max(0, y(0) - y(r.height)))
      .style('fill', 'var(--accent)')
      .attr('opacity', 0.65);
  }

  if (data.rects.length === 0) {
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-style', 'italic')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text(localize({ ko: '스파이크가 [0, 2] 창 밖에 있습니다 →', en: 'the spike is outside the [0, 2] window →' }, lang));
  }

  // Readout numbers on the chart.
  g.append('text')
    .attr('x', width)
    .attr('y', 14)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(`n = ${data.n} · ∫f_n = ${fmt(data.integral, 4)} · ∫lim = ${fmt(data.limitIntegral, 4)} · gap = ${fmt(data.gap, 4)}`);
}

export default defineSimpleScene<LebesgueConvergenceData>({
  model: lebesgueConvergenceModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: (data, lang) => localize(data.verdict, lang), bold: true, spaced: true },
  ],
});
