import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { dirichletFunctionModel, type DirichletData } from '../models/dirichletFunction';

/**
 * Tao, Analysis I, Section 11.7, live. Two combs over [0,1]: the blue
 * baseline y = 0 carries the lower rectangles (they are zero-height, drawn
 * thin), and the red line y = 1 carries the upper rectangles (full height,
 * light red) plus the rational dots. Every subinterval contains a rational
 * (sup = 1) and an irrational (inf = 0), so refining P_n never closes the
 * gap: U(f, P_n) = 1 and L(f, P_n) = 0 for every n.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 56 };

function readoutText(data: DirichletData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`분할 수 \(n = ${data.n}\): 위합 \(U(f, P_n) = ${fmt(data.upper, 4)}\), 아래합 \(L(f, P_n) = ${fmt(data.lower, 4)}\), 틈 \(U - L = ${fmt(data.gap, 4)}\). 분할을 잘게 쪼개도 틈은 영원히 닫히지 않습니다.`,
      en: String.raw`\(n = ${data.n}\) subdivisions: upper sum \(U(f, P_n) = ${fmt(data.upper, 4)}\), lower sum \(L(f, P_n) = ${fmt(data.lower, 4)}\), gap \(U - L = ${fmt(data.gap, 4)}\). Refining the partition never closes the gap.`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`빨간 점은 유리수 \(p/q\) (분모 \(\le 12\)) — 구간의 어느 부분에도 유리수가 있으므로 각 부분구간의 상한은 \(1\)입니다. 유리수 사이의 "틈"에는 무리수가 숨어 있으므로 하한은 \(0\)입니다. 위쪽 직사각형(연한 빨강, 높이 1)과 아래쪽 얇은 막대(파랑, 높이 0)가 모든 분할에서 똑같이 그려집니다.`,
      en: String.raw`The red dots are rationals \(p/q\) (denominator \(\le 12\)) — every part of every subinterval holds a rational, so the supremum on each subinterval is \(1\). The "gaps" between the rationals hide irrationals, so the infimum is \(0\). The upper rectangles (light red, height 1) and the thin lower bars (blue, height 0) draw identically for every partition.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(U(f, P) = 1\), \(L(f, P) = 0\)이 모든 분할 \(P\)에 성립하므로 \(\overline{\int} f \ne \underline{\int} f\) — 디리클레 함수는 리만 적분 불가능합니다 (아래 문제 1–2).`,
      en: String.raw`Since \(U(f, P) = 1\) and \(L(f, P) = 0\) for every partition \(P\), \(\overline{\int} f \ne \underline{\int} f\) — the Dirichlet function is not Riemann integrable (problems 1–2 below).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: DirichletData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, 1]).range([0, width]);
  const y = scaleLinear().domain([0, 1.15]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(3));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: '디리클레 함수 빗살: 위합은 항상 1, 아래합은 항상 0', en: 'The Dirichlet comb: the upper sum is always 1, the lower sum always 0' },
        lang,
      ),
    );

  // Upper rectangles (light red, height 1) for every subinterval.
  for (const seg of data.partition) {
    g.append('rect')
      .attr('x', x(seg.x0))
      .attr('width', Math.max(0, x(seg.x1) - x(seg.x0) - 0.5))
      .attr('y', y(1))
      .attr('height', Math.max(0, y(0) - y(1)))
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.18);
  }
  // Lower bars (thin blue, height 0) for every subinterval.
  for (const seg of data.partition) {
    g.append('rect')
      .attr('x', x(seg.x0))
      .attr('width', Math.max(0, x(seg.x1) - x(seg.x0) - 0.5))
      .attr('y', y(0) - 1.5)
      .attr('height', 3)
      .style('fill', 'var(--accent)')
      .attr('opacity', 0.7);
  }

  // Constant lines y = 1 (red) and y = 0 (blue).
  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(1))
    .attr('y1', y(1))
    .attr('y2', y(1))
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)');
  g.append('text')
    .attr('x', x(1))
    .attr('y', y(1) - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: 'y = 1 (유리수 위)', en: 'y = 1 (over the rationals)' }, lang));
  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(1))
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke-width', 2)
    .style('stroke', 'var(--accent)');
  g.append('text')
    .attr('x', x(1))
    .attr('y', y(0) - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: 'y = 0 (무리수 위)', en: 'y = 0 (over the irrationals)' }, lang));

  // Rational dots on the red line.
  for (const dot of data.dots) {
    g.append('circle')
      .attr('cx', x(dot.x))
      .attr('cy', y(1))
      .attr('r', 2.4)
      .style('fill', 'var(--bound)');
  }

  // Partition lines.
  for (const seg of data.partition) {
    if (seg.x0 === 0) continue;
    g.append('line')
      .attr('x1', x(seg.x0))
      .attr('x2', x(seg.x0))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-width', 1)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.35);
  }

  g.append('text')
    .attr('x', 8)
    .attr('y', 16)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(`n = ${data.n} · U = ${fmt(data.upper, 4)} · L = ${fmt(data.lower, 4)}`);
}

export default defineSimpleScene<DirichletData>({
  model: dirichletFunctionModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => explainText(lang), spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
});
