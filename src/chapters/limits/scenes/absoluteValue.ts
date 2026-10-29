import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { absoluteValueModel, type AbsoluteValueData } from '../models/absoluteValue';

/**
 * The absolute value, live. Points x, y, and x + y sit on a number
 * line; bars above the line show |x|, |y|, and |x + y| as distances
 * from 0, so the triangle inequality |x + y| <= |x| + |y| is visible
 * as one bar never outgrowing the other two stacked.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: AbsoluteValueData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(|x| = ${fmt(data.absX, 4)}\), \(|y| = ${fmt(data.absY, 4)}\), \(|x+y| = ${fmt(data.absSum, 4)} \le ${fmt(data.ceiling, 4)} = |x| + |y|\). 여유 \(= ${fmt(data.gap, 4)}\).`,
      en: String.raw`\(|x| = ${fmt(data.absX, 4)}\), \(|y| = ${fmt(data.absY, 4)}\), \(|x+y| = ${fmt(data.absSum, 4)} \le ${fmt(data.ceiling, 4)} = |x| + |y|\). Slack \(= ${fmt(data.gap, 4)}\).`,
    },
    lang,
  );
}

function compareText(data: AbsoluteValueData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`곱도 절댓값이 나뉩니다: \(|xy| = ${fmt(data.absProduct, 4)} = ${fmt(data.productOfAbs, 4)} = |x| \, |y|\). 그리고 부호를 뒤집어도 길이는 같습니다: \(|-x| = |x|\).`,
      en: String.raw`Products split too: \(|xy| = ${fmt(data.absProduct, 4)} = ${fmt(data.productOfAbs, 4)} = |x| \, |y|\). And flipping the sign keeps the length: \(|-x| = |x|\).`,
    },
    lang,
  );
}

function explainText(_data: AbsoluteValueData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`절댓값 \(|x|\)는 수직선에서 \(x\)와 0 사이의 거리입니다. 양수면 그대로, 음수면 부호를 벗깁니다. 거리의 성질이 그대로 규칙이 됩니다: \(|x| \ge 0\), \(|x| = 0\)인 경우는 \(x = 0\)뿐, 그리고 삼각부등식 \(|x + y| \le |x| + |y|\). 반대 방향으로 걸으면 거리가 도로 줄어들기 때문입니다. \(\varepsilon\)-\(N\) 논법의 모든 식은 이 규칙 위에 서 있습니다.`,
      en: String.raw`The absolute value \(|x|\) is the distance between \(x\) and 0 on the number line. Positive numbers stay; negative numbers shed their sign. The properties of distance become the rules: \(|x| \ge 0\), \(|x| = 0\) only at \(x = 0\), and the triangle inequality \(|x + y| \le |x| + |y|\) — walking back toward 0 can only shorten the total distance. Every \(\varepsilon\)-\(N\) computation stands on these rules.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: AbsoluteValueData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([-6.5, 6.5]).range([0, width]);
  const lineY = height * 0.62;
  const barTop = height * 0.18;
  const barH = (v: number): number => (v / 6) * (lineY - barTop);

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '절댓값: 0으로부터의 거리', en: 'Absolute value: distance from 0' }, lang));

  // Bars showing |x|, |y|, |x + y| as heights above their points.
  const bars: { v: number; anchor: number; label: string; color: string }[] = [
    { v: data.absX, anchor: data.x, label: '|x|', color: 'currentColor' },
    { v: data.absY, anchor: data.y, label: '|y|', color: 'var(--bound)' },
    { v: data.absSum, anchor: data.sum, label: '|x+y|', color: 'var(--accent)' },
  ];
  for (const bar of bars) {
    const bx = x(bar.anchor);
    g.append('line')
      .attr('x1', bx)
      .attr('x2', bx)
      .attr('y1', lineY)
      .attr('y2', lineY - barH(bar.v))
      .attr('stroke', bar.color)
      .attr('stroke-width', 2.5);
    g.append('text')
      .attr('x', bx)
      .attr('y', lineY - barH(bar.v) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('fill', bar.color === 'currentColor' ? 'currentColor' : bar.color)
      .text(bar.label);
  }

  // The number line and the points.
  g.append('line')
    .attr('x1', x(-6.5))
    .attr('x2', x(6.5))
    .attr('y1', lineY)
    .attr('y2', lineY)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5);
  const points: { v: number; label: string; dy: number }[] = [
    { v: 0, label: '0', dy: 18 },
    { v: data.x, label: 'x', dy: 18 },
    { v: data.y, label: 'y', dy: 18 },
    { v: data.sum, label: 'x+y', dy: 18 },
  ];
  for (const pt of points) {
    g.append('circle').attr('cx', x(pt.v)).attr('cy', lineY).attr('r', 4.5).attr('fill', 'currentColor');
    g.append('text')
      .attr('x', x(pt.v))
      .attr('y', lineY + pt.dy)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(pt.label);
  }

  g.append('g').attr('transform', `translate(0,${height - 6})`).call(axisBottom(x).ticks(9));
}

export default defineSimpleScene<AbsoluteValueData>({
  model: absoluteValueModel,
  margin: MARGIN,
  fallbackHeight: 320,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: compareText, spaced: true },
    { text: explainText, spaced: true },
  ],
});
