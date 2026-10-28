import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { normModel, type NormData, type Vec2 } from '../models/norm';

/**
 * The norm, live. Two vectors x and y are drawn with their sum, against
 * the l^p unit sphere for the chosen p: a diamond at p = 1, a circle at
 * p = 2, a square at p = inf. The readout checks the triangle
 * inequality ||x + y||_p <= ||x||_p + ||y||_p with live numbers, and
 * compares the three norms of x side by side.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: NormData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(p = ${data.p}\): \(\\|x\\| = ${fmt(data.normX, 4)}\\), \(\\|y\\| = ${fmt(data.normY, 4)}\\), \(\\|x+y\\| = ${fmt(data.normSum, 4)} \le ${fmt(data.ceiling, 4)} = \\|x\\| + \\|y\\|\\). 여유 \(= ${fmt(data.gap, 4)}\).`,
      en: String.raw`\(p = ${data.p}\): \(\\|x\\| = ${fmt(data.normX, 4)}\\), \(\\|y\\| = ${fmt(data.normY, 4)}\\), \(\\|x+y\\| = ${fmt(data.normSum, 4)} \le ${fmt(data.ceiling, 4)} = \\|x\\| + \\|y\\|\\). Slack \(= ${fmt(data.gap, 4)}\).`,
    },
    lang,
  );
}

function compareText(data: NormData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`같은 벡터 \(x\)를 세 자로 재면: \(\\|x\\|_1 = ${fmt(data.normX1, 4)}\\), \(\\|x\\|_2 = ${fmt(data.normX2, 4)}\\), \(\\|x\\|_\infty = ${fmt(data.normXInf, 4)}\\). 자가 바뀌면 길이가 바뀝니다.`,
      en: String.raw`The same vector \(x\) measured by three rulers: \(\\|x\\|_1 = ${fmt(data.normX1, 4)}\\), \(\\|x\\|_2 = ${fmt(data.normX2, 4)}\\), \(\\|x\\|_\infty = ${fmt(data.normXInf, 4)}\\). Change the ruler and the length changes.`,
    },
    lang,
  );
}

function explainText(data: NormData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`노름은 길이를 재는 규칙입니다. 세 가지 약속을 지킵니다: 길이는 음수가 아니고 0인 벡터만 길이가 0입니다. 벡터를 \(a\\)배 하면 길이가 \(|a|\\)배가 됩니다. 그리고 두 벡터를 합친 길이는 각 길이의 합을 넘지 않습니다 — 삼각부등식입니다. 노름이 있으면 거리도 따라옵니다: \(d(x, y) = \\|x - y\\|\). 단위구는 \(p = ${data.p}\)에서 ${data.p === '2' ? '보통의 원' : data.p === '1' ? '마름모' : '정사각형'}이 됩니다.`,
      en: String.raw`A norm is a rule for measuring length. It keeps three promises: a length is never negative, and only the zero vector has length 0. Scaling a vector by \(a\) scales its length by \(|a|\). And the length of a sum never exceeds the sum of the lengths — the triangle inequality. A norm brings a metric with it: \(d(x, y) = \\|x - y\\|\). The unit sphere at \(p = ${data.p}\) is ${data.p === '2' ? 'an ordinary circle' : data.p === '1' ? 'a diamond' : 'a square'}.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: NormData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  // One shared pixels-per-unit for both axes (centered square plot), so
  // the l^2 unit sphere is a true circle and the l^p spheres are not
  // stretched by the wide chart.
  const extent = 2.6;
  const unit = Math.min(width, height) / (2 * extent);
  const cx = width / 2;
  const cy = height / 2;
  const x = scaleLinear()
    .domain([-extent, extent])
    .range([cx - extent * unit, cx + extent * unit]);
  const y = scaleLinear()
    .domain([-extent, extent])
    .range([cy + extent * unit, cy - extent * unit]);
  const px = (v: Vec2): number => x(v.x);
  const py = (v: Vec2): number => y(v.y);
  const origin: Vec2 = { x: 0, y: 0 };

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: `노름: p = ${data.p}`, en: `The norm: p = ${data.p}` },
        lang,
      ),
    );

  // The l^p unit sphere through the sample points.
  if (data.samples.length > 0) {
    const path = data.samples
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${fmt(px(pt), 3)} ${fmt(py(pt), 3)}`)
      .join(' ');
    g.append('path')
      .attr('d', `${path} Z`)
      .attr('fill', 'var(--accent)')
      .attr('fill-opacity', 0.08)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 3')
      .attr('opacity', 0.85);
    g.append('text')
      .attr('x', px({ x: -0.8, y: -0.68 }))
      .attr('y', py({ x: -0.8, y: -0.68 }))
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text(localize({ ko: '단위구', en: 'unit sphere' }, lang));
  }

  // The parallelogram 0 -> x -> x + y -> y -> 0.
  const verts: Vec2[] = [origin, data.x, data.sum, data.y];
  const poly = verts.map((v) => `${fmt(px(v), 3)},${fmt(py(v), 3)}`).join(' ');
  g.append('polygon')
    .attr('points', poly)
    .attr('fill', 'currentColor')
    .attr('fill-opacity', 0.06)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2);

  const arrow = (a: Vec2, b: Vec2, stroke: string): void => {
    g.append('line')
      .attr('x1', px(a))
      .attr('x2', px(b))
      .attr('y1', py(a))
      .attr('y2', py(b))
      .attr('stroke', stroke)
      .attr('stroke-width', 2);
  };
  arrow(origin, data.x, 'currentColor');
  arrow(origin, data.y, 'var(--bound)');
  arrow(origin, data.sum, 'var(--accent)');

  const labelled: { v: Vec2; label: string; dx: number; dy: number }[] = [
    { v: origin, label: '0', dx: -14, dy: 14 },
    { v: data.x, label: 'x', dx: 6, dy: 16 },
    { v: data.y, label: 'y', dx: -18, dy: -6 },
    { v: data.sum, label: 'x+y', dx: 8, dy: -6 },
  ];
  for (const item of labelled) {
    g.append('circle')
      .attr('cx', px(item.v))
      .attr('cy', py(item.v))
      .attr('r', 4)
      .attr('fill', 'currentColor');
    g.append('text')
      .attr('x', px(item.v) + item.dx)
      .attr('y', py(item.v) + item.dy)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(item.label);
  }

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(6));
  g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(5));
}

export default defineSimpleScene<NormData>({
  model: normModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: compareText, spaced: true },
    { text: explainText, spaced: true },
  ],
});
