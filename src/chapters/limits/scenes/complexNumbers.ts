import { axisBottom, axisLeft, scaleLinear, type ScaleLinear } from 'd3';
import { localize, type Lang, type LocalizedText } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { complexNumbersModel, type ComplexNumbersData } from '../models/complexNumbers';

/**
 * Complex numbers, live. The complex plane shows z and w as arrows from
 * the origin, z + w as the diagonal of the parallelogram they span (the
 * dashed edges are the translates of z and w), and a fainter z - w. Two
 * circles centered at the origin compare |z + w| (solid) against
 * |z| + |w| (dashed): the gap between them is the triangle-inequality
 * slack. Vectors of modulus 0 get no arrow, so the zero case stays clean.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 44 };

function readoutText(data: ComplexNumbersData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(|z| = ${fmt(data.zMod, 3)}\), \(|w| = ${fmt(data.wMod, 3)}\), \(|z + w| = ${fmt(data.sumMod, 3)}\): 삼각부등식 \(|z + w| \le |z| + |w| = ${fmt(data.zMod + data.wMod, 3)}\)가 성립합니다.`,
      en: String.raw`\(|z| = ${fmt(data.zMod, 3)}\), \(|w| = ${fmt(data.wMod, 3)}\), \(|z + w| = ${fmt(data.sumMod, 3)}\): the triangle inequality \(|z + w| \le |z| + |w| = ${fmt(data.zMod + data.wMod, 3)}\) holds.`,
    },
    lang,
  );
}

function explainText(data: ComplexNumbersData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`절댓값 \(|z|\)는 원점에서 점 \(z\)까지의 거리 \(\sqrt{(\mathrm{Re}\, z)^2 + (\mathrm{Im}\, z)^2}\)이고, 켤레 \(\bar{z}\)는 실수축에 대해 뒤집은 점입니다. 그래서 \(z \bar{z} = |z|^2\)는 실수가 되고, \(\mathrm{Re}(z \bar{w}) = ${fmt(data.reZConjW, 3)}\)는 두 벡터가 얼마나 같은 방향을 향하는지를 재는 양입니다. \(z\)의 편각은 \(\arg z = ${fmt(data.argZDeg, 1)}^\circ\) (\(${fmt(data.argZRad, 3)}\) rad)입니다.`,
      en: String.raw`The modulus \(|z|\) is the distance from the origin to the point \(z\), \(\sqrt{(\mathrm{Re}\, z)^2 + (\mathrm{Im}\, z)^2}\), and the conjugate \(\bar{z}\) is the reflection of \(z\) across the real axis. Hence \(z \bar{z} = |z|^2\) is a real number, and \(\mathrm{Re}(z \bar{w}) = ${fmt(data.reZConjW, 3)}\) measures how far the two vectors point the same way. The argument of \(z\) is \(\arg z = ${fmt(data.argZDeg, 1)}^\circ\) (\(${fmt(data.argZRad, 3)}\) rad).`,
    },
    lang,
  );
}

function verdictText(data: ComplexNumbersData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`판정: 삼각부등식이 여유(slack) \(|z| + |w| - |z + w| = ${fmt(data.triangleSlack, 3)} \ge 0\)만큼 성립합니다. 평행사변형 항등식도 확인됩니다: \(|z + w|^2 + |z - w|^2 = ${fmt(data.parallelogramLhs, 3)}\)이고 \(2|z|^2 + 2|w|^2 = ${fmt(data.parallelogramRhs, 3)}\)입니다.`,
      en: String.raw`Verdict: the triangle inequality holds with slack \(|z| + |w| - |z + w| = ${fmt(data.triangleSlack, 3)} \ge 0\). The parallelogram identity checks out too: \(|z + w|^2 + |z - w|^2 = ${fmt(data.parallelogramLhs, 3)}\) and \(2|z|^2 + 2|w|^2 = ${fmt(data.parallelogramRhs, 3)}\).`,
    },
    lang,
  );
}

type Scale = ScaleLinear<number, number>;

function drawArrow(
  g: Chart['g'],
  x: Scale,
  y: Scale,
  fromRe: number,
  fromIm: number,
  toRe: number,
  toIm: number,
  color: string,
  widthPx: number,
  dashed: boolean,
  arrowhead = true,
): void {
  const dre = toRe - fromRe;
  const dim = toIm - fromIm;
  const len = Math.sqrt(dre * dre + dim * dim);
  if (len < 1e-9) return;
  const x0 = x(fromRe);
  const y0 = y(fromIm);
  const x1 = x(toRe);
  const y1 = y(toIm);
  const line = g
    .append('line')
    .attr('x1', x0)
    .attr('x2', x1)
    .attr('y1', y0)
    .attr('y2', y1)
    .attr('stroke', color)
    .attr('stroke-width', widthPx);
  if (dashed) line.attr('stroke-dasharray', '5 4');
  if (!arrowhead) return;
  // Arrowhead: a small triangle at the tip, oriented along the segment.
  const ux = (x1 - x0) / Math.max(1e-9, Math.hypot(x1 - x0, y1 - y0));
  const uy = (y1 - y0) / Math.max(1e-9, Math.hypot(x1 - x0, y1 - y0));
  const head = 9;
  const spread = 4;
  const bx = x1 - ux * head;
  const by = y1 - uy * head;
  const px = -uy;
  const py = ux;
  g.append('polygon')
    .attr(
      'points',
      `${x1},${y1} ${bx + px * spread},${by + py * spread} ${bx - px * spread},${by - py * spread}`,
    )
    .attr('fill', color);
}

function drawPointLabel(
  g: Chart['g'],
  x: Scale,
  y: Scale,
  re: number,
  im: number,
  label: string,
  color: string,
): void {
  g.append('circle')
    .attr('cx', x(re))
    .attr('cy', y(im))
    .attr('r', 4)
    .attr('fill', color);
  g.append('text')
    .attr('x', x(re) + 8)
    .attr('y', y(im) - 8)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(label);
}

function drawMain(chart: Chart, data: ComplexNumbersData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  // One shared extent and one shared pixels-per-unit scale factor, so the
  // modulus circles stay circles even when the chart is not square.
  const maxCoord = Math.max(
    Math.abs(data.zre),
    Math.abs(data.zim),
    Math.abs(data.wre),
    Math.abs(data.wim),
    Math.abs(data.sumRe),
    Math.abs(data.sumIm),
    Math.abs(data.diffRe),
    Math.abs(data.diffIm),
  );
  const extent = Math.max(2.5, maxCoord, data.zMod + data.wMod) * 1.08;
  const unit = Math.min(width, height) / (2 * extent);
  const cx = width / 2;
  const cy = height / 2;

  const x = scaleLinear()
    .domain([-extent, extent])
    .range([cx - extent * unit, cx + extent * unit]);
  const y = scaleLinear()
    .domain([-extent, extent])
    .range([cy + extent * unit, cy - extent * unit]);

  // Modulus circles: |z + w| solid, |z| + |w| dashed (the slack is the gap).
  const circle = (radius: number, dashed: boolean): void => {
    if (radius < 1e-9) return;
    const c = g
      .append('circle')
      .attr('cx', x(0))
      .attr('cy', y(0))
      .attr('r', radius * unit)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', dashed ? 1 : 1.5)
      .attr('opacity', dashed ? 0.45 : 0.8);
    if (dashed) c.attr('stroke-dasharray', '4 4');
  };
  circle(data.zMod + data.wMod, true);
  circle(data.sumMod, false);

  // Axes through the origin.
  g.append('g')
    .attr('transform', `translate(0,${y(0)})`)
    .call(axisBottom(x).ticks(7));
  g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(7));
  g.append('text')
    .attr('x', width - 4)
    .attr('y', y(0) - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '실수축', en: 'Re' } satisfies LocalizedText, lang));
  g.append('text')
    .attr('x', x(0) + 8)
    .attr('y', 12)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '허수축', en: 'Im' } satisfies LocalizedText, lang));

  // Parallelogram edges: z -> z + w is the translate of w, w -> z + w of z.
  drawArrow(g, x, y, data.zre, data.zim, data.sumRe, data.sumIm, 'currentColor', 1.2, true, false);
  drawArrow(g, x, y, data.wre, data.wim, data.sumRe, data.sumIm, 'currentColor', 1.2, true, false);

  // The two given vectors, then the sum (accent) and the difference (faint).
  drawArrow(g, x, y, 0, 0, data.zre, data.zim, 'var(--bound)', 2.2, false);
  drawArrow(g, x, y, 0, 0, data.wre, data.wim, '#d64545', 2.2, false);
  drawArrow(g, x, y, 0, 0, data.sumRe, data.sumIm, 'var(--accent)', 2.6, false);
  drawArrow(g, x, y, 0, 0, data.diffRe, data.diffIm, 'currentColor', 1.4, false);

  drawPointLabel(g, x, y, data.zre, data.zim, 'z', 'var(--bound)');
  drawPointLabel(g, x, y, data.wre, data.wim, 'w', '#d64545');
  drawPointLabel(g, x, y, data.sumRe, data.sumIm, 'z + w', 'var(--accent)');
  drawPointLabel(g, x, y, data.diffRe, data.diffIm, 'z - w', 'currentColor');

  // Origin.
  g.append('circle').attr('cx', x(0)).attr('cy', y(0)).attr('r', 3).attr('fill', 'currentColor');

  g.append('text')
    .attr('x', 0)
    .attr('y', height + 34)
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.75)
    .text(
      localize(
        {
          ko: '실선 원 = |z + w|, 점선 원 = |z| + |w| — 두 원 사이 간격이 삼각부등식의 여유입니다',
          en: 'solid circle = |z + w|, dashed circle = |z| + |w| — the gap between them is the triangle-inequality slack',
        },
        lang,
      ),
    );
}

export default defineSimpleScene<ComplexNumbersData>({
  model: complexNumbersModel,
  margin: MARGIN,
  fallbackHeight: 420,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
