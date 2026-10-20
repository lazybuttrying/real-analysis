import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { vectorSpacesModel, type VectorSpacesData } from '../models/vector-spaces';

/**
 * Renders math-bearing HTML strips through the shared KaTeX helper, exactly
 * like the shell does for summaries (strip first, upgrade when the tex chunk
 * arrives). Each strip has its own sequence guard so late arrivals from an
 * older render never overwrite newer text.
 */
const LINE_Y_MIN = -4;
const LINE_Y_MAX = 4;
const PLANE_HALF = 2.5;

function fmt(n: number): string {
  return String(Math.round(n * 10) / 10);
}

function drawLinePanel(g: Chart['g'], width: number, height: number, data: VectorSpacesData): void {
  const pad = 26;
  const sx = (x: number): number => pad + ((x + 1) / 2) * (width - 2 * pad);
  const sy = (y: number): number =>
    pad + ((LINE_Y_MAX - y) / (LINE_Y_MAX - LINE_Y_MIN)) * (height - 2 * pad);

  g.append('line')
    .attr('x1', sx(-1))
    .attr('x2', sx(1))
    .attr('y1', sy(0))
    .attr('y2', sy(0))
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.35);
  g.append('line')
    .attr('x1', sx(0))
    .attr('x2', sx(0))
    .attr('y1', sy(LINE_Y_MIN))
    .attr('y2', sy(LINE_Y_MAX))
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.35);

  const d = data.line
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`)
    .join(' ');
  g.append('path').attr('d', d).attr('fill', 'none').attr('stroke', 'var(--bound)').attr('stroke-width', 2.5);

  for (const x of [-1, 0, 1]) {
    g.append('text')
      .attr('x', sx(x))
      .attr('y', height - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.55)
      .text(String(x));
  }
}

function drawPointPanel(g: Chart['g'], width: number, height: number, data: VectorSpacesData): void {
  const pad = 26;
  const size = Math.max(40, Math.min(width, height) - 2 * pad);
  const ox = (width - size) / 2;
  const oy = (height - size) / 2;
  const h = PLANE_HALF;
  const sx = (x: number): number => ox + ((x + h) / (2 * h)) * size;
  const sy = (y: number): number => oy + ((h - y) / (2 * h)) * size;

  for (let k = -2; k <= 2; k++) {
    const main = k === 0;
    g.append('line')
      .attr('x1', sx(k))
      .attr('x2', sx(k))
      .attr('y1', sy(-h))
      .attr('y2', sy(h))
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', main ? 0.5 : 0.15);
    g.append('line')
      .attr('x1', sx(-h))
      .attr('x2', sx(h))
      .attr('y1', sy(k))
      .attr('y2', sy(k))
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', main ? 0.5 : 0.15);
  }

  const [a, b] = data.point;
  g.append('circle').attr('cx', sx(a)).attr('cy', sy(b)).attr('r', 6).attr('fill', 'var(--bound)');
  g.append('text')
    .attr('x', sx(a) + 10)
    .attr('y', sy(b) - 8)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(`(${fmt(a)}, ${fmt(b)})`);
}

function equationText(data: VectorSpacesData, lang: Lang): string {
  const fa = fmt(data.a);
  const fbSigned = fmt(data.b);
  const fbAbs = fmt(Math.abs(data.b));
  const sign = data.b < 0 ? '-' : '+';
  return localize(
    {
      ko: String.raw`직선 \(y = ${fa} ${sign} ${fbAbs}x\)  ↔  점 \((${fa}, ${fbSigned})\)`,
      en: String.raw`line \(y = ${fa} ${sign} ${fbAbs}x\)  ↔  point \((${fa}, ${fbSigned})\)`,
    },
    lang,
  );
}

function captionText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`같은 대상, 두 포장: 벡터공간의 원소 하나가 두 가지 모습으로 그려집니다.`,
      en: String.raw`Same object, two packagings: one element of the vector space, drawn twice.`,
    },
    lang,
  );
}

function panelLabel(kind: 'left' | 'right', lang: Lang): string {
  if (kind === 'left') {
    return localize({ ko: '왼쪽: 다항식의 그래프', en: 'left: the polynomial as a graph' }, lang);
  }
  return localize({ ko: '오른쪽: 계수평면의 점', en: 'right: the point in coefficient space' }, lang);
}

function drawMain(chart: Chart, data: VectorSpacesData): void {
  chart.g.selectAll('*').remove();
  drawLinePanel(chart.g, chart.width, chart.height, data);
}

function drawSecond(chart: Chart, data: VectorSpacesData): void {
  chart.g.selectAll('*').remove();
  drawPointPanel(chart.g, chart.width, chart.height, data);
}

export default defineSimpleScene<VectorSpacesData>({
  model: vectorSpacesModel,
  secondLayout: 'row',
  mainLabel: (lang) => panelLabel('left', lang),
  secondLabel: (lang) => panelLabel('right', lang),
  mainWrapCss: 'flex: 1 1 0; min-width: 0; min-height: 0; display: flex; flex-direction: column;',
  secondWrapCss: 'flex: 1 1 0; min-width: 0; min-height: 0; display: flex; flex-direction: column;',
  fallbackWidth: 320,
  fallbackHeight: 300,
  drawMain,
  drawSecond,
  slots: [
    { text: (_data, lang) => captionText(lang), bold: true },
    {
      text: (data, lang) => equationText(data, lang),
      cssText: 'margin-top: 4px; font-size: 12px; color: var(--muted);',
    },
  ],
});
