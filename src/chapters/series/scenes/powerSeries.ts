import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { powerSeriesModel, type PowerData, type PowerSeriesKind } from '../models/power-series';

// A number line from -3 to 3 showing the interval of convergence (-R, R)
// shaded: R = infinity shades the whole visible range, R = 0 collapses to a
// single dot, R = 1 shades (-1, 1) with open circles at the endpoints. A
// dashed marker shows x; the strip below states R, the partial sum S_N(x),
// and the verdict: |x| < R means absolute convergence, |x| > R means the
// terms do not even tend to 0, and |x| = R is decided case by case.

const MARGIN = { top: 64, right: 20, bottom: 44, left: 56 };
const X_MIN = -3;
const X_MAX = 3;

function seriesLabel(series: PowerSeriesKind, lang: Lang): string {
  if (series === 'factorial') return localize({ ko: 'Σ k!x^k', en: 'Σ k!x^k' }, lang);
  if (series === 'geom') return localize({ ko: 'Σ x^k', en: 'Σ x^k' }, lang);
  return localize({ ko: 'Σ x^k/k!', en: 'Σ x^k/k!' }, lang);
}

function radiusText(radius: number): string {
  return radius === Infinity ? '∞' : String(radius);
}

function subDigits(n: number): string {
  const map: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  return String(n)
    .split('')
    .map((d) => map[d] ?? d)
    .join('');
}

function readoutText(data: PowerData, lang: Lang): string {
  if (data.overflow) {
    return localize(
      {
        ko: String.raw`\(S_{${data.n}}(${data.x})\)의 크기가 \(10^{15}\)을 넘었습니다 — 수치 범위를 벗어난 발산`,
        en: String.raw`\(S_{${data.n}}(${data.x})\) exceeded \(10^{15}\) in magnitude — overflow, treated as divergence`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(R = ${radiusText(data.radius)}\), \(x = ${data.x}\), \(S_{${data.n}}(${data.x}) \approx ${fmt(data.partialSum)}\)`,
      en: String.raw`\(R = ${radiusText(data.radius)}\), \(x = ${data.x}\), \(S_{${data.n}}(${data.x}) \approx ${fmt(data.partialSum)}\)`,
    },
    lang,
  );
}

function verdictText(data: PowerData, lang: Lang): string {
  if (data.verdict === 'converge') {
    return localize(
      {
        ko: String.raw`\(\lvert x\rvert < R\) — 절대 수렴: 항이 충분히 빨리 작아져 부분합이 한 값으로 모입니다.`,
        en: String.raw`\(\lvert x\rvert < R\) — absolute convergence: the terms shrink fast enough that the partial sums settle to one value.`,
      },
      lang,
    );
  }
  if (data.verdict === 'diverge') {
    return localize(
      {
        ko: String.raw`\(\lvert x\rvert > R\) — 발산: 항이 \(0\)으로 가지 않으므로 급수는 어떤 값으로도 모일 수 없습니다.`,
        en: String.raw`\(\lvert x\rvert > R\) — divergence: the terms do not even tend to \(0\), so the series cannot settle anywhere.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(\lvert x\rvert = R\) — 경계선: 안과 밖의 규칙이 통하지 않으므로 점마다 따로 판정합니다.`,
      en: String.raw`\(\lvert x\rvert = R\) — the boundary: the inside/outside rules do not apply, so decide each point on its own.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: PowerData, lang: Lang): void {
  const { g, width, height } = chart;
  const { radius, x } = data;

  g.selectAll('*').remove();

  const cy = height / 2;
  const xScale = scaleLinear().domain([X_MIN, X_MAX]).range([0, width]);

  const header1 = g.append('text').attr('x', 0).attr('y', -48).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
  const header2 = g.append('text').attr('x', 0).attr('y', -26).attr('font-size', 12).attr('fill', 'currentColor').attr('opacity', 0.75);

  header1.text(
    localize(
      {
        ko: `${seriesLabel(data.series, lang)} — 수렴반경 R = ${radiusText(radius)}`,
        en: `${seriesLabel(data.series, lang)} — radius of convergence R = ${radiusText(radius)}`,
      },
      lang,
    ),
  );
  header2.text(
    localize(
      {
        ko: `x = ${fmt(data.x)}, 항의 개수 N = ${data.n}, S${subDigits(data.n)}(${fmt(data.x)}) = ${data.overflow ? '10¹⁵ 초과' : fmt(data.partialSum)}`,
        en: `x = ${fmt(data.x)}, terms N = ${data.n}, S${subDigits(data.n)}(${fmt(data.x)}) = ${data.overflow ? 'beyond 10¹⁵' : fmt(data.partialSum)}`,
      },
      lang,
    ),
  );

  // Axis.
  g.append('line')
    .attr('x1', xScale(X_MIN))
    .attr('x2', xScale(X_MAX))
    .attr('y1', cy)
    .attr('y2', cy)
    .attr('stroke-width', 2)
    .style('stroke', 'currentColor');
  g.append('g')
    .attr('transform', `translate(0,${cy})`)
    .call(axisBottom(xScale).ticks(7));

  // Shaded interval of convergence (-R, R).
  const lo = xScale(Math.max(X_MIN, -radius));
  const hi = xScale(Math.min(X_MAX, radius));
  if (radius === 0) {
    // R = 0: the interval collapses to the single point x = 0.
    g.append('circle')
      .attr('cx', xScale(0))
      .attr('cy', cy)
      .attr('r', 6)
      .style('fill', 'var(--accent)');
  } else if (hi > lo) {
    g.append('rect')
      .attr('x', lo)
      .attr('y', cy - 26)
      .attr('width', Math.max(0, hi - lo))
      .attr('height', 52)
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.18);
    g.append('text')
      .attr('x', (lo + hi) / 2)
      .attr('y', cy - 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '수렴 구간 (−R, R)', en: 'interval of convergence (−R, R)' }, lang));
  }

  // Open circles at finite endpoints ±R inside the visible range.
  if (Number.isFinite(radius) && radius > 0) {
    for (const end of [-radius, radius]) {
      if (end < X_MIN || end > X_MAX) continue;
      g.append('circle')
        .attr('cx', xScale(end))
        .attr('cy', cy)
        .attr('r', 6)
        .attr('fill', 'none')
        .attr('stroke-width', 2.5)
        .style('stroke', 'var(--accent)');
    }
  }

  // Marker at x.
  const mx = xScale(x);
  g.append('line')
    .attr('x1', mx)
    .attr('x2', mx)
    .attr('y1', cy - 30)
    .attr('y2', cy + 30)
    .attr('stroke-dasharray', '5 4')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)');
  g.append('path')
    .attr('d', `M ${mx - 7} ${cy - 44} L ${mx + 7} ${cy - 44} L ${mx} ${cy - 34} Z`)
    .style('fill', 'var(--bound)');
  g.append('text')
    .attr('x', mx + 8)
    .attr('y', cy - 38)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .style('fill', 'var(--bound)')
    .text(`x = ${fmt(x)}`);
}

export default defineSimpleScene<PowerData>({
  model: powerSeriesModel,
  margin: MARGIN,
  drawMain,
  slots: [{ text: readoutText }, { text: verdictText, bold: true, spaced: true }],
});
