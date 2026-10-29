import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { innerProductModel, type InnerProductData, type Vec2 } from '../models/innerProduct';

/**
 * The inner product, live. Two vectors with the projection of x onto
 * y drawn dashed: the foot of the perpendicular from x's tip to the
 * y line. The readout shows <x, y> = ||x|| ||y|| cos(theta) with live
 * numbers.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: InnerProductData, lang: Lang): string {
  const angle = Number.isNaN(data.angleDeg) ? '—' : `${fmt(data.angleDeg, 4)}°`;
  return localize(
    {
      ko: String.raw`\(\langle x, y \rangle = ${fmt(data.dot, 4)}\) \(= \|x\| \, \|y\| \cos\theta = ${fmt(data.normX, 4)} \times ${fmt(data.normY, 4)} \times ${fmt(data.cosTheta, 4)}\). 각도 \(\theta = ${angle}\).`,
      en: String.raw`\(\langle x, y \rangle = ${fmt(data.dot, 4)}\) \(= \|x\| \, \|y\| \cos\theta = ${fmt(data.normX, 4)} \times ${fmt(data.normY, 4)} \times ${fmt(data.cosTheta, 4)}\). Angle \(\theta = ${angle}\).`,
    },
    lang,
  );
}

function explainText(_data: InnerProductData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`내적은 두 벡터가 얼마나 같은 방향을 향하는지 재는 규칙입니다. 약속은 셋입니다: 자리를 바꿔도 같습니다. 한쪽에 합과 상수배가 들어오면 그대로 풀립니다. 자기 자신과의 내적은 길이의 제곱이라, 0인 벡터만 0이 됩니다. 그래서 내적이 있으면 노름이 따라옵니다: \(\|x\| = \sqrt{\langle x, x \rangle}\). 점선은 \(x\)를 \(y\) 위에 비춘 그림자, 즉 사영입니다.`,
      en: String.raw`An inner product measures how much two vectors point the same way. It keeps three promises: swapping the two sides changes nothing. Sums and scalings on one side pull straight through. And the inner product of a vector with itself is the square of its length, zero only for the zero vector. So an inner product brings a norm with it: \(\|x\| = \sqrt{\langle x, x \rangle}\). The dashed piece is the shadow of \(x\) cast onto \(y\): its projection.`,
    },
    lang,
  );
}

function verdictText(data: InnerProductData, lang: Lang): string {
  if (data.orthogonal) {
    return localize(
      {
        ko: String.raw`판정: \(\langle x, y \rangle = 0\) — 두 벡터는 수직입니다. 겹침이 없습니다.`,
        en: String.raw`Verdict: \(\langle x, y \rangle = 0\) — the vectors are perpendicular. No overlap at all.`,
      },
      lang,
    );
  }
  if (data.dot > 0) {
    return localize(
      {
        ko: String.raw`판정: 내적이 양수 — 두 벡터는 예각을 이룹니다. 같은 쪽을 향합니다.`,
        en: String.raw`Verdict: positive inner product — the vectors form an acute angle. They lean the same way.`,
      },
      lang,
    );
  }
  if (data.dot < 0) {
    return localize(
      {
        ko: String.raw`판정: 내적이 음수 — 두 벡터는 둔각을 이룹니다. 반대쪽을 향합니다.`,
        en: String.raw`Verdict: negative inner product — the vectors form an obtuse angle. They lean away from each other.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`판정: 한쪽이 0인 벡터라 각도가 없습니다.`,
      en: String.raw`Verdict: one vector is zero, so there is no angle.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: InnerProductData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const extent = 3.4;
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
    .text(localize({ ko: '내적: 얼마나 겹치는가', en: 'Inner product: how much overlap' }, lang));

  const arrow = (a: Vec2, b: Vec2, stroke: string, widthPx: number): void => {
    g.append('line')
      .attr('x1', px(a))
      .attr('x2', px(b))
      .attr('y1', py(a))
      .attr('y2', py(b))
      .attr('stroke', stroke)
      .attr('stroke-width', widthPx);
  };
  arrow(origin, data.x, 'currentColor', 2.5);
  arrow(origin, data.y, 'var(--bound)', 2.5);
  // Projection: the shadow of x on the y line, and the perpendicular drop.
  arrow(origin, data.proj, 'var(--accent)', 3.5);
  g.append('line')
    .attr('x1', px(data.proj))
    .attr('x2', px(data.x))
    .attr('y1', py(data.proj))
    .attr('y2', py(data.x))
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4 3');

  const labelled: { v: Vec2; label: string; dx: number; dy: number }[] = [
    { v: origin, label: '0', dx: -14, dy: 14 },
    { v: data.x, label: 'x', dx: 6, dy: 16 },
    { v: data.y, label: 'y', dx: -18, dy: -6 },
    { v: data.proj, label: 'proj', dx: 8, dy: 14 },
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

export default defineSimpleScene<InnerProductData>({
  model: innerProductModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
