import { axisBottom, axisLeft, line, scaleLinear, type ScaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { dirichletTestModel, type DirichletTestData } from '../models/dirichletTest';

/**
 * Dirichlet's test on the series sum sin(nx)/n.
 * The raw partial sums of sin(kx) wobble inside the dashed +/-bound band
 * (bounded, never settling), while the 1/k-weighted partial sums glide
 * toward the limit (pi - x)/2: bounded oscillation tamed by a weight
 * decreasing to zero.
 */

const GOLD = '#d9930d';
const MARGIN = { top: 56, right: 20, bottom: 40, left: 56 };

function factsText(data: DirichletTestData, lang: Lang): string {
  const { x, bound, partialSums, weighted } = data;
  const maxAbs = partialSums.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  return localize(
    {
      ko: String.raw`\(x=${fmt(x, 2)}\): \(\left\lvert\sum_{k \le N}\sin(kx)\right\rvert \le ${fmt(bound, 4)}\) — 부분합은 \(|\cdot| \le ${fmt(maxAbs, 4)}\) 안에서만 흔들리고, \(1/n\)이 \(0\)으로 가라앉히면 \(T_N \to ${fmt(weighted[weighted.length - 1] ?? 0, 4)}\)로 안정된다.`,
      en: String.raw`\(x=${fmt(x, 2)}\): \(\left\lvert\sum_{k \le N}\sin(kx)\right\rvert \le ${fmt(bound, 4)}\) — the partial sums stay bounded, \(|\cdot| \le ${fmt(maxAbs, 4)}\), while the \(1/n\) weight drives \(T_N \to ${fmt(weighted[weighted.length - 1] ?? 0, 4)}\) to a limit.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`디리클레 판정법: \(\sum a_n\)의 부분합이 유계이고 \(b_n \downarrow 0\)이면 \(\sum a_n b_n\)은 수렴한다 — 여기서는 \(a_n = \sin(nx)\), \(b_n = 1/n\).`,
      en: String.raw`Dirichlet's test: if the partial sums of \(\sum a_n\) are bounded and \(b_n \downarrow 0\), then \(\sum a_n b_n\) converges — here \(a_n = \sin(nx)\), \(b_n = 1/n\).`,
    },
    lang,
  );
}

// One edge of the dashed +/-bound band: the trap the raw partial sums cannot escape.
function band(g: Chart['g'], y: number, n: number, xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): void {
  g.append('line')
    .attr('x1', xScale(1))
    .attr('x2', xScale(n))
    .attr('y1', yScale(y))
    .attr('y2', yScale(y))
    .attr('stroke-dasharray', '7 5')
    .attr('stroke-width', 1.5)
    .style('stroke', 'currentColor')
    .attr('opacity', 0.55);
}

function drawMain(chart: Chart, data: DirichletTestData, lang: Lang): void {
  const { g, width, height } = chart;
  const { n, x, bound, partialSums, weighted } = data;
  g.selectAll('*').remove();

  // The limit of the weighted series on (0, 2*pi): the sawtooth's Fourier series.
  const limit = (Math.PI - x) / 2;
  const yMax = bound * 1.12;

  const xScale = scaleLinear().domain([1, n]).range([0, width]);
  const yScale = scaleLinear().domain([-yMax, yMax]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(xScale).ticks(8));
  g.append('g').call(axisLeft(yScale).ticks(6));

  g.append('text')
    .attr('x', 0)
    .attr('y', -36)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `N = ${n}    x = ${fmt(x, 2)}    B = 1/|sin(x/2)| = ${fmt(bound, 4)}    T_N = ${fmt(weighted[weighted.length - 1] ?? 0, 4)} → ${fmt(limit, 4)}`,
          en: `N = ${n}    x = ${fmt(x, 2)}    B = 1/|sin(x/2)| = ${fmt(bound, 4)}    T_N = ${fmt(weighted[weighted.length - 1] ?? 0, 4)} → ${fmt(limit, 4)}`,
        },
        lang,
      ),
    );

  // Dashed +/-bound band: the trap the raw partial sums cannot escape.
  g.append('rect')
    .attr('x', xScale(1))
    .attr('y', yScale(bound))
    .attr('width', Math.max(0, xScale(n) - xScale(1)))
    .attr('height', Math.max(0, yScale(-bound) - yScale(bound)))
    .attr('fill', 'var(--accent)')
    .attr('opacity', 0.07);
  band(g, bound, n, xScale, yScale);
  band(g, -bound, n, xScale, yScale);
  g.append('text')
    .attr('x', xScale(n))
    .attr('y', yScale(bound) - 6)
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.7)
    .text(`±1/|sin(x/2)| = ±${fmt(bound, 3)}`);

  // Limit of the weighted series (gold dashed line).
  g.append('line')
    .attr('x1', xScale(1))
    .attr('x2', xScale(n))
    .attr('y1', yScale(limit))
    .attr('y2', yScale(limit))
    .attr('stroke-dasharray', '6 4')
    .attr('stroke-width', 2)
    .style('stroke', GOLD);
  g.append('text')
    .attr('x', xScale(n) - 4)
    .attr('y', yScale(limit) - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', GOLD)
    .text(`(π−x)/2 = ${fmt(limit, 3)}`);

  // Wobbling raw partial sums, trapped in the band.
  const wobble = line<{ k: number; v: number }>()
    .x((p) => xScale(p.k))
    .y((p) => yScale(p.v));
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--accent)')
    .attr('opacity', 0.85)
    .attr(
      'd',
      wobble(partialSums.map((v, i) => ({ k: i + 1, v }))) ?? '',
    );

  // Settling weighted partial sums (accent line of dots over a gold line).
  const settle = line<{ k: number; v: number }>()
    .x((p) => xScale(p.k))
    .y((p) => yScale(p.v));
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', GOLD)
    .attr(
      'd',
      settle(weighted.map((v, i) => ({ k: i + 1, v }))) ?? '',
    );
  weighted.forEach((v, i) => {
    g.append('circle')
      .attr('cx', xScale(i + 1))
      .attr('cy', yScale(v))
      .attr('r', i === weighted.length - 1 ? 5 : 2.6)
      .style('fill', GOLD)
      .attr('opacity', i === weighted.length - 1 ? 1 : 0.6);
  });

  g.append('text')
    .attr('x', 0)
    .attr('y', height - 6)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '파랑: A_N = Σ sin(kx) (유계, 진동)', en: 'Blue: A_N = Σ sin(kx) (bounded, oscillating)' }, lang));
  g.append('text')
    .attr('x', width)
    .attr('y', height - 6)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', GOLD)
    .text(localize({ ko: '금색: T_N = Σ sin(kx)/k (수렴)', en: 'Gold: T_N = Σ sin(kx)/k (converging)' }, lang));
}

export default defineSimpleScene<DirichletTestData>({
  model: dirichletTestModel,
  margin: MARGIN,
  drawMain,
  slots: [{ text: factsText, bold: true }, { text: (_data, lang) => verdictText(lang), bold: true }],
});
