import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { orderedFieldModel, type OrderedFieldData } from '../models/ordered-fields';

/**
 * Ordered fields, live. Mode 'q': the positive cone of Q shaded on a
 * number line, with p, q, p + q, pq marked — sums, products, and
 * squares of positives stay positive. Mode 'z7': the +1 walk on a
 * 7-hour clock returns to 0, which no positive cone allows.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: OrderedFieldData, lang: Lang): string {
  if (data.mode === 'z7') {
    return localize(
      {
        ko: String.raw`\(\mathbb{Z}_7\)에서는 \(1\)을 양수로 정하는 순간 \(1, 2, \dots, 6\)이 모두 양수여야 하고, 한 번 더 더하면 \(0\)까지 양수가 됩니다. 모순이라 \(\mathbb{Z}_7\)에는 순서를 넣을 수 없습니다.`,
        en: String.raw`In \(\mathbb{Z}_7\), once \(1\) is declared positive, \(1, 2, \dots, 6\) must all be positive, and one more step makes \(0\) positive too. A contradiction — \(\mathbb{Z}_7\) admits no ordering.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(p = ${fmt(data.p, 2)}\), \(q = ${fmt(data.q, 2)}\)는 양수입니다. 합 \(p + q = ${fmt(data.sum, 2)}\)도, 곱 \(pq = ${fmt(data.product, 2)}\)도, 제곱 \(p^2 = ${fmt(data.pSquare, 2)}\)도 양수입니다. 양의 원뿔은 덧셈과 곱셈에 닫혀 있습니다.`,
      en: String.raw`\(p = ${fmt(data.p, 2)}\) and \(q = ${fmt(data.q, 2)}\) are positive. The sum \(p + q = ${fmt(data.sum, 2)}\), the product \(pq = ${fmt(data.product, 2)}\), and the square \(p^2 = ${fmt(data.pSquare, 2)}\) are positive too. The positive cone is closed under addition and multiplication.`,
    },
    lang,
  );
}

function explainText(_data: OrderedFieldData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`순서체는 체에 양의 원뿔 \(P\)를 얹은 것입니다. \(P\)는 덧셈과 곱셈에 닫혀 있고, 모든 원소는 \(P\)에 들거나 \(0\)이거나 그 음수가 \(P\)에 드는 삼분법을 따릅니다. \(a < b\)는 \(b - a \in P\)라는 뜻입니다. 유리수체와 실수체는 순서체이지만, 이 대수 규칙만으로는 실수가 완성되지 않습니다. 상한 공리, 즉 완비성은 대수가 아니라 해석학의 몫입니다.`,
      en: String.raw`An ordered field is a field plus a positive cone \(P\): closed under addition and multiplication, with trichotomy — every element is in \(P\), is \(0\), or its negative is in \(P\). And \(a < b\) means \(b - a \in P\). The rationals and the reals are ordered fields, but these algebraic rules alone do not complete the reals. The least-upper-bound axiom — completeness — belongs to analysis, not algebra.`,
    },
    lang,
  );
}

function drawQ(chart: Chart, data: OrderedFieldData, lang: Lang): void {
  const { g, width, height } = chart;
  const midY = height * 0.52;
  const x = scaleLinear().domain([-1, 7.5]).range([0, width]);

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '유리수: 양의 원뿔은 0보다 큰 쪽 전체', en: 'Rationals: the positive cone is everything above 0' }, lang));

  g.append('rect')
    .attr('x', x(0))
    .attr('y', midY - 16)
    .attr('width', x(7.5) - x(0))
    .attr('height', 32)
    .attr('fill', 'var(--bound)')
    .attr('opacity', 0.14);

  g.append('line')
    .attr('x1', x(-1))
    .attr('x2', x(7.5))
    .attr('y1', midY)
    .attr('y2', midY)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1);

  const marks: Array<{ v: number; label: string; dy: number; color: string }> = [
    { v: data.p, label: 'p', dy: -26, color: 'var(--accent)' },
    { v: data.q, label: 'q', dy: 34, color: 'var(--accent)' },
    { v: data.sum, label: 'p + q', dy: -26, color: 'var(--bound)' },
    { v: data.product, label: 'pq', dy: 34, color: 'var(--bound)' },
    { v: data.pSquare, label: 'p²', dy: -44, color: 'var(--bound)' },
  ];
  for (const m of marks) {
    g.append('circle')
      .attr('cx', x(m.v))
      .attr('cy', midY)
      .attr('r', 4.5)
      .attr('fill', m.color);
    g.append('text')
      .attr('x', x(m.v))
      .attr('y', midY + m.dy)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', m.color)
      .text(m.label);
  }
  g.append('text')
    .attr('x', x(0))
    .attr('y', midY + 34)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text('0');

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
}

function drawZ7(chart: Chart, data: OrderedFieldData, lang: Lang): void {
  const { g, width, height } = chart;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.36;

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: 'Z₇: 양수인 1을 계속 더하면 0으로 돌아온다', en: 'Z₇: adding the positive 1 walks back to 0' }, lang));

  const pos = (k: number): { px: number; py: number } => {
    const ang = -Math.PI / 2 + (k * 2 * Math.PI) / 7;
    return { px: cx + r * Math.cos(ang), py: cy + r * Math.sin(ang) };
  };

  for (let i = 0; i + 1 < data.walk.length; i++) {
    const a = pos(data.walk[i]!);
    const b = pos(data.walk[i + 1]!);
    g.append('line')
      .attr('x1', a.px)
      .attr('y1', a.py)
      .attr('x2', b.px)
      .attr('y2', b.py)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3');
  }
  for (let k = 0; k < 7; k++) {
    const { px, py } = pos(k);
    g.append('circle')
      .attr('cx', px)
      .attr('cy', py)
      .attr('r', 15)
      .attr('fill', k === 0 ? 'var(--danger, #c0392b)' : 'var(--accent)')
      .attr('opacity', k === 0 ? 0.9 : 0.65);
    g.append('text')
      .attr('x', px)
      .attr('y', py + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .attr('fill', '#fff')
      .text(String(k));
  }
  g.append('text')
    .attr('x', cx)
    .attr('y', cy + 4)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text('+1');
}

function drawMain(chart: Chart, data: OrderedFieldData, lang: Lang): void {
  chart.g.selectAll('*').remove();
  if (data.mode === 'z7') drawZ7(chart, data, lang);
  else drawQ(chart, data, lang);
}

export default defineSimpleScene<OrderedFieldData>({
  model: orderedFieldModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
  ],
});
