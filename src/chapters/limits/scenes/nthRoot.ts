import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { nthRootModel, type NthRootData, type NthRootSample } from '../models/nthRoot';

/**
 * Tao, Analysis I, Lemma 5.6.5, live. The curve y = x^n (accent) rises from
 * the origin; the shaded region under it left of the root is the set
 * E = { x >= 0 : x^n < a } whose supremum is the n-th root. The horizontal
 * dashed line marks y = a, the vertical dashed line marks s = sup E. The
 * readout compares the bisection value against Math.pow(a, 1/n).
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: NthRootData, lang: Lang): string {
  const diff = Math.abs(data.root - data.mathRoot);
  return localize(
    {
      ko: String.raw`\(a = ${fmt(data.a, 1)}\), \(n = ${data.n}\): 이분법 \(s \approx ${fmt(data.root, 8)}\), \(a^{1/n} \approx ${fmt(data.mathRoot, 8)}\), \(|\text{차이}| \approx ${fmt(diff, 2)}\).`,
      en: String.raw`\(a = ${fmt(data.a, 1)}\), \(n = ${data.n}\): bisection \(s \approx ${fmt(data.root, 8)}\), \(a^{1/n} \approx ${fmt(data.mathRoot, 8)}\), \(|\text{diff}| \approx ${fmt(diff, 2)}\).`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`회색 영역은 \(E = \{x \ge 0 : x^n < a\}\)입니다 — \(0 \in E\)이고 \(a + 1\)이 상계이므로, 상한 공리에 의해 \(s = \sup E\)가 존재합니다. 증명(아래 문제 1)은 \(s^n\)이 \(a\)보다 작을 수도 클 수도 없음을 보여, \(s^n = a\)를 강제합니다.`,
      en: String.raw`The shaded region is \(E = \{x \ge 0 : x^n < a\}\) — \(0 \in E\) and \(a + 1\) bounds it, so \(s = \sup E\) exists by the least-upper-bound axiom. The proof (problem 1 below) shows \(s^n\) can be neither below nor above \(a\), forcing \(s^n = a\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`상한 공리가 실수 직선의 "구멍"을 메웁니다: 유리수에서는 \(x^2 = 2\)인 \(s\)가 존재하지 않지만, 실수에서는 \(E\)의 상한이 정확히 그 구멍을 차지합니다.`,
      en: String.raw`The least-upper-bound axiom fills the "holes" of the real line: no rational \(s\) satisfies \(s^2 = 2\), but in the reals the supremum of \(E\) sits exactly in that hole.`,
    },
    lang,
  );
}

const curvePath = line<NthRootSample>()
  .x((d) => d.x)
  .y((d) => d.y);

const shadeArea = area<NthRootSample>()
  .x((d) => d.x)
  .y0((d) => d.y)
  .y1((d) => d.y);

function drawMain(chart: Chart, data: NthRootData, lang: Lang): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const yMax = Math.pow(data.xMax, data.n) * 1.06;
    const x = scaleLinear().domain([0, data.xMax]).range([0, width]);
    const y = scaleLinear().domain([0, yMax]).range([height, 0]);
    const px = curvePath.x((d) => x(d.x)).y((d) => y(d.y));
    const pa = shadeArea.x((d) => x(d.x)).y0(y(0)).y1((d) => y(d.y));

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
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
            ko: `y = x^${data.n} 곡선과 집합 E (회색 영역)의 상한`,
            en: `The curve y = x^${data.n} and the supremum of E (shaded)`,
          },
          lang,
        ),
      );

    // Shaded E: the region under the curve left of the root.
    g.append('path')
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.22)
      .attr('d', pa(data.eCurve) ?? '');
    // The curve itself.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.curve) ?? '');

    // Horizontal dashed line y = a (bound color).
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(data.xMax))
      .attr('y1', y(data.a))
      .attr('y2', y(data.a))
      .attr('stroke-dasharray', '5 4')
      .attr('stroke-width', 1.5)
      .style('stroke', 'var(--bound)');
    g.append('text')
      .attr('x', x(data.xMax))
      .attr('y', y(data.a) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(`y = a = ${fmt(data.a, 1)}`);

    // Vertical dashed line x = root (bound color).
    g.append('line')
      .attr('x1', x(data.root))
      .attr('x2', x(data.root))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke-dasharray', '4 3')
      .attr('stroke-width', 1.5)
      .style('stroke', 'var(--bound)');
    g.append('circle')
      .attr('cx', x(data.root))
      .attr('cy', y(data.a))
      .attr('r', 4.5)
      .style('fill', 'var(--bound)');
    g.append('text')
      .attr('x', x(data.root) + 6)
      .attr('y', 14)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: 's = sup E', en: 's = sup E' }, lang));
}

export default defineSimpleScene<NthRootData>({
  model: nthRootModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => explainText(lang), spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true }
  ],
});
