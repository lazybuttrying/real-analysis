import { line } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  EPICYCLE_COLORS,
  fourierEpicyclesModel,
  type FourierEpicyclesData,
  type Point,
} from '../models/fourierEpicycles';

/**
 * The epicycle ladder. The traced curve is drawn faint, the chain at the
 * current phase is drawn bold: one circle per arm, the arm line and its
 * label in the arm's fixed color, so the formula, the arms and the curve
 * can be matched by color alone. Static frame of a rotating chain: the
 * phase slider moves the snapshot along the curve.
 */

function drawMain(chart: Chart, data: FourierEpicyclesData, lang: Lang): void {
  const { g, width, height } = chart;
  const r = data.radiusSum * 1.12;
  const cx = width / 2;
  const cy = height / 2;
  const unit = Math.min(width, height) / 2 / r;
  const X = (p: Point): number => cx + p.x * unit;
  const Y = (p: Point): number => cy - p.y * unit;

  const traceLine = line<Point>()
    .x((p) => X(p))
    .y((p) => Y(p));

  g.selectAll('*').remove();

  // The bounding disk: the endpoint can never leave it (triangle inequality).
  g.append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', data.radiusSum * unit)
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-dasharray', '3 5')
    .attr('opacity', 0.35);

  // The full traced curve, faint.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.2)
    .attr('opacity', 0.45)
    .attr('d', traceLine(data.trace) ?? '');

  // One guide circle per arm, centered on the previous joint.
  data.terms.forEach((term, i) => {
    const center = data.joints[i] as Point;
    g.append('circle')
      .attr('cx', X(center))
      .attr('cy', Y(center))
      .attr('r', term.amp * unit)
      .attr('fill', 'none')
      .attr('stroke', EPICYCLE_COLORS[i % EPICYCLE_COLORS.length] as string)
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);
  });

  // The arms themselves, bold, in their fixed colors.
  data.terms.forEach((term, i) => {
    const a = data.joints[i] as Point;
    const b = data.joints[i + 1] as Point;
    const color = EPICYCLE_COLORS[i % EPICYCLE_COLORS.length] as string;
    g.append('line')
      .attr('x1', X(a))
      .attr('y1', Y(a))
      .attr('x2', X(b))
      .attr('y2', Y(b))
      .attr('stroke', color)
      .attr('stroke-width', 2.5);
    g.append('text')
      .attr('x', (X(a) + X(b)) / 2 + 6)
      .attr('y', (Y(a) + Y(b)) / 2 - 6)
      .attr('font-size', 11)
      .attr('fill', color)
      .text(`f=${term.freq} L=${fmt(term.amp, 2)}`);
  });

  // Joints and the endpoint.
  data.joints.forEach((p, i) => {
    g.append('circle')
      .attr('cx', X(p))
      .attr('cy', Y(p))
      .attr('r', i === data.joints.length - 1 ? 5 : 3)
      .attr('fill', i === data.joints.length - 1 ? 'var(--accent)' : 'currentColor');
  });

  g.append('text')
    .attr('x', 8)
    .attr('y', 16)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(
      `${localize({ ko: '팔', en: 'arms' }, lang)} = ${data.terms.length}, ` +
        `${localize({ ko: '끝점', en: 'endpoint' }, lang)} = (${fmt(data.endpoint.x, 3)}, ${fmt(data.endpoint.y, 3)}), ` +
        `|P| = ${fmt(Math.hypot(data.endpoint.x, data.endpoint.y), 3)} <= ${fmt(data.radiusSum, 2)}`,
    );
}

function readoutText(data: FourierEpicyclesData, lang: Lang): string {
  const sum = data.terms.map((term) => `${fmt(term.amp, 2)} e^{i (${term.freq}) t}`).join(' + ');
  return localize(
    {
      ko: String.raw`끝점이 그리는 곡선은 \(P(t) = ${sum}\) 입니다. 팔 하나가 복소지수 하나이고, 팔의 색이 식의 항 색과 같습니다.`,
      en: String.raw`The endpoint traces \(P(t) = ${sum}\). Each arm is one complex exponential, and the arm's color is its term's color in the formula.`,
    },
    lang,
  );
}

export default defineSimpleScene<FourierEpicyclesData>({
  model: fourierEpicyclesModel,
  drawMain,
  slots: [{ text: readoutText, bold: true }],
});
