import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { holderModel, type HolderData } from '../models/holder';

/**
 * Holder's inequality, live. Two bars: the left side sum |a_k b_k| against
 * the right side ||a||_p ||b||_q, with the slack (gap) shaded between their
 * tops. Sliding p shows the gap widening and closing; p = 2 is marked as the
 * Cauchy-Schwarz case.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

function readoutText(data: HolderData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(p = ${fmt(data.p, 1)}\), \(q = \frac{p}{p-1} = ${fmt(data.q, 4)}\): 좌변 \(\sum |a_k b_k| = ${fmt(data.lhs, 6)}\), 우변 \(\|a\|_p\|b\|_q = ${fmt(data.rhsA, 6)} \times ${fmt(data.rhsB, 6)} = ${fmt(data.rhs, 6)}\), 틈새 \(= ${fmt(data.gap, 6)} \ge 0\).`,
      en: String.raw`\(p = ${fmt(data.p, 1)}\), \(q = \frac{p}{p-1} = ${fmt(data.q, 4)}\): left side \(\sum |a_k b_k| = ${fmt(data.lhs, 6)}\), right side \(\|a\|_p\|b\|_q = ${fmt(data.rhsA, 6)} \times ${fmt(data.rhsB, 6)} = ${fmt(data.rhs, 6)}\), gap \(= ${fmt(data.gap, 6)} \ge 0\).`,
    },
    lang,
  );
}

function explainText(data: HolderData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`왼쪽 막대가 \(\sum |a_k b_k|\) (여기서는 조화수 \(H_n\)), 오른쪽 막대가 \(\|a\|_p\|b\|_q\)입니다. 두 막대 꼭대기 사이 음영이 부등식의 틈새 — 항상 0 이상입니다 (아래 문제 2). \(p\)를 움직이면 틈새가 벌어졌다 좁아졌다 합니다.`,
      en: String.raw`The left bar is \(\sum |a_k b_k|\) (the harmonic number \(H_n\) here); the right bar is \(\|a\|_p\|b\|_q\). The shaded band between their tops is the inequality's slack — always nonnegative (problem 2 below). Sliding \(p\) opens and closes the gap.`,
    },
    lang,
  );
  const csNote = data.isCauchySchwarz
    ? localize(
        {
          ko: String.raw` 지금 \(p = 2\) (\(q = 2\)) — 코시-슈바르츠 부등식 \(|\langle a, b\rangle| \le \|a\|_2\|b\|_2\) 그 자체입니다.`,
          en: String.raw` Right now \(p = 2\) (\(q = 2\)) — the Cauchy–Schwarz inequality \(|\langle a, b\rangle| \le \|a\|_2\|b\|_2\) itself.`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw` \(p \to 1^+\)로 보내면 우변이 \((\sum |a_k|)\max|b_k|\)로 붕괴해 틈새가 0으로 닫힙니다 — 직접 확인해 보세요.`,
          en: String.raw` Push \(p \to 1^+\) and the right side collapses to \((\sum |a_k|)\max|b_k|\), closing the gap to 0 — try it.`,
        },
        lang,
      );
  return body + csNote;
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`모든 \(1 < p < \infty\)에서 \(\sum |a_k b_k| \le \|a\|_p\|b\|_q\) — 이것이 횔더 부등식이며, \(p = q = 2\)가 코시-슈바르츠입니다.`,
      en: String.raw`For every \(1 < p < \infty\), \(\sum |a_k b_k| \le \|a\|_p\|b\|_q\) — that is Hölder's inequality, and \(p = q = 2\) is Cauchy–Schwarz.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: HolderData, lang: Lang): void {
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
            ko: `횔더 부등식: Σ|aₖbₖ| ≤ ‖a‖ₚ‖b‖ₚ (aₖ = 1/k, bₖ = 1)${data.isCauchySchwarz ? ' — p = 2: 코시-슈바르츠' : ''}`,
            en: `Hölder's inequality: Σ|aₖbₖ| ≤ ‖a‖ₚ‖b‖ₚ (aₖ = 1/k, bₖ = 1)${data.isCauchySchwarz ? ' — p = 2: Cauchy–Schwarz' : ''}`,
          },
          lang,
        ),
      );

    const bars = [
      { label: localize({ ko: '좌변 Σ|aₖbₖ|', en: 'left Σ|aₖbₖ|' }, lang), value: data.lhs, fill: 'var(--accent)' },
      { label: localize({ ko: '우변 ‖a‖ₚ‖b‖ₚ', en: 'right ‖a‖ₚ‖b‖ₚ' }, lang), value: data.rhs, fill: 'var(--bound)' },
    ];
    const x = scaleLinear().domain([0, 2]).range([0, width]);
    const y = scaleLinear().domain([0, data.rhs * 1.12]).range([height, 0]);
    const barW = Math.min(120, (width / 2) * 0.5);

    // The shaded gap between the two bar tops.
    g.append('rect')
      .attr('x', x(0.5) - barW / 2)
      .attr('width', x(1.5) - x(0.5) + barW)
      .attr('y', y(data.rhs))
      .attr('height', Math.max(0, y(data.lhs) - y(data.rhs)))
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.25);

    bars.forEach((bar, i) => {
      const cx = x(i + 0.5);
      g.append('rect')
        .attr('x', cx - barW / 2)
        .attr('width', barW)
        .attr('y', y(bar.value))
        .attr('height', Math.max(0, y(0) - y(bar.value)))
        .attr('fill', bar.fill)
        .attr('opacity', 0.7);
      g.append('text')
        .attr('x', cx)
        .attr('y', y(bar.value) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', 600)
        .attr('fill', 'currentColor')
        .text(fmt(bar.value, 4));
      g.append('text')
        .attr('x', cx)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .text(bar.label);
    });

    // Dashed connector marking the gap height.
    g.append('line')
      .attr('x1', x(0.5) - barW / 2)
      .attr('x2', x(0.5) + barW / 2)
      .attr('y1', y(data.rhs))
      .attr('y2', y(data.rhs))
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 3')
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.7);
    g.append('text')
      .attr('x', x(1.5) + barW / 2 + 6)
      .attr('y', (y(data.lhs) + y(data.rhs)) / 2 + 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: `틈새 = ${fmt(data.gap, 4)}`, en: `gap = ${fmt(data.gap, 4)}` },
          lang,
        ),
      );

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(0));
    g.append('g').call(axisLeft(y).ticks(5));

    // p = 2 marker.
    if (data.isCauchySchwarz) {
      g.append('text')
        .attr('x', width)
        .attr('y', 14)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 700)
        .attr('fill', 'var(--accent)')
        .text(localize({ ko: 'p = 2: 코시-슈바르츠', en: 'p = 2: Cauchy–Schwarz' }, lang));
    }

    // Readout numbers on the chart.
    g.append('text')
      .attr('x', width)
      .attr('y', data.isCauchySchwarz ? 30 : 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`p = ${fmt(data.p, 1)} · q = ${fmt(data.q, 3)} · n = ${data.n}`);
  };

export default defineSimpleScene<HolderData>({
  model: holderModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
});
