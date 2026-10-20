import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { directProofModel, type RationalSumData } from '../models/directProof';

/**
 * Direct proof, live: assume the hypothesis, compute, arrive at the
 * conclusion. The worked example shows the sum of two rational numbers
 * r1 = p1/q1, r2 = p2/q2 on a number line, with the common-denominator
 * form (p1 q2 + p2 q1) / (q1 q2) reduced to lowest terms.
 */

const MARGIN = { top: 56, right: 24, bottom: 52, left: 24 };

function readoutText(data: RationalSumData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`가정: \(r_1 = \frac{${data.p1}}{${data.q1}} = ${fmt(data.r1, 4)}\), \(r_2 = \frac{${data.p2}}{${data.q2}} = ${fmt(data.r2, 4)}\) — \(p\)와 \(q\)는 정수, \(q \ne 0\).
수직선 위에 세 점 \(r_1\), \(r_2\), \(r_1 + r_2\)가 표시됩니다.`,
      en: String.raw`Assume: \(r_1 = \frac{${data.p1}}{${data.q1}} = ${fmt(data.r1, 4)}\), \(r_2 = \frac{${data.p2}}{${data.q2}} = ${fmt(data.r2, 4)}\) — \(p\) and \(q\) are integers, \(q \ne 0\).
The number line marks the three points \(r_1\), \(r_2\) and \(r_1 + r_2\).`,
    },
    lang,
  );
}

function stepText(data: RationalSumData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`통분하면
\[r_1 + r_2 = \frac{(${data.p1})(${data.q2}) + (${data.p2})(${data.q1})}{(${data.q1})(${data.q2})} = \frac{${data.num}}{${data.den}}\]
약분하면 \(\frac{${data.reducedNum}}{${data.reducedDen}} \approx ${fmt(data.sum, 6)}\). 모든 칸이 정수 연산 — 소수 근사는 마지막에 확인용으로만 씁니다.`,
      en: String.raw`Putting the sum over a common denominator,
\[r_1 + r_2 = \frac{(${data.p1})(${data.q2}) + (${data.p2})(${data.q1})}{(${data.q1})(${data.q2})} = \frac{${data.num}}{${data.den}}\]
reducing gives \(\frac{${data.reducedNum}}{${data.reducedDen}} \approx ${fmt(data.sum, 6)}\). Every step is integer arithmetic — the decimal is only a final check.`,
    },
    lang,
  );
}

function verdictText(data: RationalSumData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`결론: 분자 \((${data.p1})(${data.q2}) + (${data.p2})(${data.q1}) = ${data.num})\)와 분모 \((${data.q1})(${data.q2}) = ${data.den})\)는 정수이고 분모 \(\ne 0\)이므로, \(r_1 + r_2\)는 유리수.
이것이 직접증명: \(P \Rightarrow Q\)를 증명하기 위해 \(P\)를 가정하고, 정당화된 단계들의 사슬로 \(Q\)에 곧바로 이른다 — 우회가 없습니다.`,
      en: String.raw`Conclusion: the numerator \((${data.p1})(${data.q2}) + (${data.p2})(${data.q1}) = ${data.num})\) and the denominator \((${data.q1})(${data.q2}) = ${data.den})\) are integers, and the denominator is \(\ne 0\), so \(r_1 + r_2\) is rational.
That is a direct proof: to prove \(P \Rightarrow Q\), assume \(P\) and follow a chain of justified steps straight to \(Q\) — no detour.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: RationalSumData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const points = [
    {
      x: data.r1,
      label: 'r₁',
      tex: 'r_1',
      color: 'var(--accent)',
      value: data.r1,
      frac: `\\frac{${data.p1}}{${data.q1}}`,
    },
    {
      x: data.r2,
      label: 'r₂',
      tex: 'r_2',
      color: 'var(--bound)',
      value: data.r2,
      frac: `\\frac{${data.p2}}{${data.q2}}`,
    },
    {
      x: data.sum,
      label: 'r₁+r₂',
      tex: 'r_1 + r_2',
      color: 'var(--good)',
      value: data.sum,
      frac: `\\frac{${data.reducedNum}}{${data.reducedDen}}`,
    },
  ];

  const lo = Math.min(data.r1, data.r2, data.sum);
  const hi = Math.max(data.r1, data.r2, data.sum);
  const span = hi - lo;
  const pad = span < 1e-9 ? 1 : span * 0.25;
  const x = scaleLinear().domain([lo - pad, hi + pad]).range([0, width]);
  const mid = height * 0.5;

  g.append('text')
    .attr('x', 0)
    .attr('y', -34)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: '직접증명: r₁ + r₂ = (p₁q₂ + p₂q₁)/(q₁q₂)', en: 'Direct proof: r₁ + r₂ = (p₁q₂ + p₂q₁)/(q₁q₂)' },
        lang,
      ),
    );

  // The axis.
  g.append('g').attr('transform', `translate(0,${mid})`).call(axisBottom(x).ticks(9));
  g.append('line')
    .attr('x1', x(lo - pad))
    .attr('x2', x(hi + pad))
    .attr('y1', mid)
    .attr('y2', mid)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2);

  // Mark the three points, staggering the labels so nearby points do not collide.
  const order = [...points].sort((a, b) => a.x - b.x);
  order.forEach((p, i) => {
    const px = x(p.x);
    g.append('circle')
      .attr('cx', px)
      .attr('cy', mid)
      .attr('r', 7)
      .attr('fill', p.color)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5);
    const dy = i === 0 ? -42 : i === 1 ? -30 : -18;
    g.append('text')
      .attr('x', px)
      .attr('y', mid + dy)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', p.color)
      .text(p.label);
    g.append('text')
      .attr('x', px)
      .attr('y', mid + 34)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(fmt(p.value, 4));
  });
}

export default defineSimpleScene<RationalSumData>({
  model: directProofModel,
  margin: MARGIN,
  fallbackHeight: 260,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: stepText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: verdictText, cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
  ],
});
