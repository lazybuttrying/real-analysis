import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { minkowskiModel, type MinkowskiData } from '../models/minkowski';

/**
 * Minkowski's inequality (integral version), live: ||f + g||_p <= ||f||_p + ||g||_p
 * on [0,1] with f(t) = t^a, g(t) = (1 - t)^b. Two bars — the left side against
 * the right side — with the slack (gap) shaded between their tops. Sliding p
 * opens and closes the gap; p = 1 collapses it to 0 (linearity of the integral),
 * and a = b = 1 makes f + g identically 1, so the left bar freezes at 1.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

function readoutText(data: MinkowskiData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(p = ${fmt(data.p, 2)}\), \(f(t) = t^{${fmt(data.a, 1)}}\), \(g(t) = (1-t)^{${fmt(data.b, 1)}}\):
좌변 \(\|f+g\|_p = ${fmt(data.lhs, 6)}\)
우변 \(\|f\|_p + \|g\|_p = ${fmt(data.normF, 6)} + ${fmt(data.normG, 6)} = ${fmt(data.rhs, 6)}\)
틈새 \(= ${fmt(data.gap, 6)} \ge 0\)`,
      en: String.raw`\(p = ${fmt(data.p, 2)}\), \(f(t) = t^{${fmt(data.a, 1)}}\), \(g(t) = (1-t)^{${fmt(data.b, 1)}}\):
left side \(\|f+g\|_p = ${fmt(data.lhs, 6)}\)
right side \(\|f\|_p + \|g\|_p = ${fmt(data.normF, 6)} + ${fmt(data.normG, 6)} = ${fmt(data.rhs, 6)}\)
gap \(= ${fmt(data.gap, 6)} \ge 0\)`,
    },
    lang,
  );
}

function explainText(data: MinkowskiData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`왼쪽 막대가 \(\|f+g\|_p\), 오른쪽 막대가 \(\|f\|_p + \|g\|_p\)입니다.
두 막대 꼭대기 사이 음영이 부등식의 틈새 — \(p \ge 1\)에서는 항상 0 이상입니다 (아래 문제 1).
\(p\)를 움직이면 틈새가 벌어졌다 좁아졌다 합니다.`,
      en: String.raw`The left bar is \(\|f+g\|_p\); the right bar is \(\|f\|_p + \|g\|_p\).
The shaded band between their tops is the inequality's slack — always nonnegative for \(p \ge 1\) (problem 1 below).
Sliding \(p\) opens and closes the gap.`,
    },
    lang,
  );
  const pOneNote =
    data.p <= 1 + 1e-9
      ? localize(
          {
            ko: String.raw` 지금 \(p = 1\) — 적분의 선형성 \(\int (f+g) = \int f + \int g\) 때문에 틈새가 정확히 0으로 닫힙니다.`,
            en: String.raw` Right now \(p = 1\) — linearity of the integral, \(\int (f+g) = \int f + \int g\), closes the gap to exactly 0.`,
          },
          lang,
        )
      : localize(
          {
            ko: String.raw` \(a = b = 1\)로 두면 \(f + g \equiv 1\)이라 왼쪽 막대가 1에 고정되고, \(p\)를 키우면 오른쪽 막대만 내려와 틈새가 벌어집니다.`,
            en: String.raw` Set \(a = b = 1\): then \(f + g \equiv 1\), freezing the left bar at 1, and raising \(p\) lowers only the right bar, widening the gap.`,
          },
          lang,
        );
  return body + pOneNote;
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`모든 \(1 \le p < \infty\)에서 \(\|f+g\|_p \le \|f\|_p + \|g\|_p\) — 이것이 적분 버전 민코프스키 부등식, 곧 \(L^p\) 삼각부등식입니다.`,
      en: String.raw`For every \(1 \le p < \infty\), \(\|f+g\|_p \le \|f\|_p + \|g\|_p\) — Minkowski's inequality in integral form, the \(L^p\) triangle inequality.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: MinkowskiData, lang: Lang): void {
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
          ko: `민코프스키 부등식: ‖f+g‖ₚ ≤ ‖f‖ₚ + ‖g‖ₚ (f(t) = tᵃ, g(t) = (1-t)ᵇ)`,
          en: `Minkowski's inequality: ‖f+g‖ₚ ≤ ‖f‖ₚ + ‖g‖ₚ (f(t) = tᵃ, g(t) = (1-t)ᵇ)`,
        },
        lang,
      ),
    );

  const bars = [
    { label: localize({ ko: '좌변 ‖f+g‖ₚ', en: 'left ‖f+g‖ₚ' }, lang), value: data.lhs, fill: 'var(--accent)' },
    { label: localize({ ko: '우변 ‖f‖ₚ+‖g‖ₚ', en: 'right ‖f‖ₚ+‖g‖ₚ' }, lang), value: data.rhs, fill: 'var(--bound)' },
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

  // The two summands under the right bar.
  g.append('text')
    .attr('x', x(1.5))
    .attr('y', height + 30)
    .attr('dy', 16)
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.75)
    .text(`= ${fmt(data.normF, 4)} + ${fmt(data.normG, 4)}`);

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

  // Readout numbers on the chart.
  g.append('text')
    .attr('x', width)
    .attr('y', 14)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(`p = ${fmt(data.p, 2)} · a = ${fmt(data.a, 1)} · b = ${fmt(data.b, 1)}`);
}

export default defineSimpleScene<MinkowskiData>({
  model: minkowskiModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: explainText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: (_data, lang) => verdictText(lang), cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
  ],
});
