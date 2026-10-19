import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { jordanDecompositionModel, type JordanData, type JordanSample } from '../models/jordanDecomposition';

/**
 * Jordan decomposition, live. The gray curve f(x) = x^2 sin(1/x) wiggles
 * infinitely often near 0, yet splits pointwise into two increasing
 * functions: the (grid) variation g (accent) and h = g - f (bound color).
 * The X0 probe draws a vertical marker with the four-decimal identity
 * f(X0) = g(X0) - h(X0); the strips state the theorem and the honest caveat
 * that g is a grid variation, not the true supremum variation function.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

/** Linear interpolation on the uniform grid (preserves f = g - h exactly). */
function atX0(samples: JordanSample[], x0: number): number {
  const last = samples.length - 1;
  if (last < 0) return 0;
  const t = x0 * last;
  const i = Math.min(Math.floor(t), last - 1);
  const a = samples[i];
  const b = samples[i + 1];
  if (!a || !b) return samples[last]?.y ?? 0;
  const frac = t - i;
  return a.y + (b.y - a.y) * frac;
}

function readoutText(data: JordanData, lang: Lang): string {
  const { x0, f, g, h } = data;
  const fv = atX0(f, x0);
  const gv = atX0(g, x0);
  const hv = atX0(h, x0);
  return localize(
    {
      ko: String.raw`\(x_0 = ${fmt(x0, 3)}\)에서: \(f = ${fmt(fv, 4)}\), \(g = ${fmt(gv, 4)}\), \(h = ${fmt(hv, 4)}\) — \(f(x_0) = g(x_0) - h(x_0) = ${fmt(gv, 4)} - ${fmt(hv, 4)}\)가 정확히 성립합니다.`,
      en: String.raw`At \(x_0 = ${fmt(x0, 3)}\): \(f = ${fmt(fv, 4)}\), \(g = ${fmt(gv, 4)}\), \(h = ${fmt(hv, 4)}\) — \(f(x_0) = g(x_0) - h(x_0) = ${fmt(gv, 4)} - ${fmt(hv, 4)}\) holds exactly.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`조르당 분해: \(f\)가 \([a,b]\)에서 유계변동 ⟺ \(f = g - h\) ( \(g, h\) 단조증가). 한 방향은 \(g(x) = V_a^x(f)\) (변동함수), \(h = g - f\)로 두면 됩니다.`,
      en: String.raw`Jordan decomposition: \(f\) is BV on \([a,b]\) ⟺ \(f = g - h\) with \(g, h\) increasing. One direction is \(g(x) = V_a^x(f)\) (the variation function) and \(h = g - f\).`,
    },
    lang,
  );
}

function gridNoteText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`정직한 근사: 이 \(g\)는 2001점 격자 위의 격자 변동으로, 진짜 \(V_0^x(f)\)의 하한입니다 (0 근처 미세 진동은 격자보다 촘촘해서 과소평가됨). \(f = g - h\)와 단조성은 격자 위에서 정확히 성립합니다.`,
      en: String.raw`Honest approximation: this \(g\) is the grid variation on a 2001-point grid — a lower bound of the true \(V_0^x(f)\) (near-zero micro-oscillations are finer than the grid, so it understates). \(f = g - h\) and monotonicity hold exactly on the grid.`,
    },
    lang,
  );
}

function bvNoteText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`왜 이 \(f\)인가: \(f^{\prime}\)이 유계이므로 \(\int_0^1\lvert f^{\prime}\rvert < \infty\) — \(f\)는 절대연속, 따라서 유계변동. 그런데 \(\sin\frac{1}{x}\)의 무한 진동 탓에 분해가 자명하지 않습니다 (단조 조각들의 뻔한 합이 아님).`,
      en: String.raw`Why this \(f\): \(f^{\prime}\) is bounded, so \(\int_0^1\lvert f^{\prime}\rvert < \infty\) — \(f\) is absolutely continuous, hence BV. Yet \(\sin\frac{1}{x}\) oscillates infinitely often near 0, so the decomposition is non-trivial.`,
    },
    lang,
  );
}

const path = line<JordanSample>()
  .x((d) => d.x)
  .y((d) => d.y);

function drawMain(chart: Chart, data: JordanData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, 1]).range([0, width]);
  let ymin = Infinity;
  let ymax = -Infinity;
  for (const s of data.f) {
    if (s.y < ymin) ymin = s.y;
    if (s.y > ymax) ymax = s.y;
  }
  for (const s of data.g) {
    if (s.y > ymax) ymax = s.y;
  }
  const pad = (ymax - ymin) * 0.06;
  const y = scaleLinear()
    .domain([ymin - pad, ymax + pad])
    .range([height, 0]);
  const px = path.x((d) => x(d.x)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(10));
  g.append('g').call(axisLeft(y).ticks(6));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: 'f(x) = x²·sin(1/x)의 조르당 분해 — f(회색) = g(악센트) − h(테두리 색)',
          en: 'Jordan decomposition of f(x) = x²·sin(1/x) — f (gray) = g (accent) − h (bound color)',
        },
        lang,
      ),
    );

  // f, dashed gray.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6 4')
    .attr('opacity', 0.6)
    .attr('stroke', 'currentColor')
    .attr('d', px(data.f) ?? '');
  // g, accent: increasing.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.g) ?? '');
  // h, bound color: increasing.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)')
    .attr('d', px(data.h) ?? '');

  // X0 marker: vertical dashed line plus dots on the three curves.
  const { x0 } = data;
  g.append('line')
    .attr('x1', x(x0))
    .attr('x2', x(x0))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4 3')
    .attr('opacity', 0.7);
  const mark = (samples: JordanSample[], color: string): void => {
    g.append('circle')
      .attr('cx', x(x0))
      .attr('cy', y(atX0(samples, x0)))
      .attr('r', 4.5)
      .style('fill', color)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1);
  };
  mark(data.g, 'var(--accent)');
  mark(data.h, 'var(--bound)');
  mark(data.f, 'currentColor');

  // Legend.
  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '┄ f (x²·sin(1/x))', en: '┄ f (x²·sin(1/x))' }, lang));
  g.append('text')
    .attr('x', width * 0.32)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '— g (격자 변동, 단조증가)', en: '— g (grid variation, increasing)' }, lang));
  g.append('text')
    .attr('x', width * 0.66)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: '— h = g − f (단조증가)', en: '— h = g − f (increasing)' }, lang));
}

export default defineSimpleScene<JordanData>({
  model: jordanDecompositionModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true },
    { text: (_data, lang) => gridNoteText(lang), spaced: true },
    { text: (_data, lang) => bvNoteText(lang), spaced: true },
  ],
  mountExtra: (strips, lang) => {
    // Cross-link: the BV scene this decomposition deepens.
    const seeAlso = document.createElement('div');
    seeAlso.style.marginTop = '4px';
    const bvLink = document.createElement('a');
    bvLink.href = '../bounded-variation/';
    bvLink.textContent = localize(
      {
        ko: '유계변동 함수 씬 — 분해가 필요한 함수들',
        en: 'Bounded variation scene — the functions that need this decomposition',
      },
      lang,
    );
    seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), bvLink);
    strips.append(seeAlso);
  },
});
