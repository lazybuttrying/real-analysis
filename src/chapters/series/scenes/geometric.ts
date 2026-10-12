import { scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { geometricModel, type GeometricData } from '../models/geometric';

// The unit square fills by halves; the leftover gap (dashed outline)
// halves every step and spirals into the corner, never quite
// vanishing - and that is exactly why the total is 1.

const PIECE_COLORS: string[] = ['#4da3ff', '#ffd166', '#7be0a3', '#c792ff', '#ff6b6b', '#4dd0e1'];
const DARK_TEXT = new Set<string>(['#ffd166', '#7be0a3', '#4dd0e1']);
const MARGIN = { top: 64, right: 24, bottom: 24, left: 24 };

function createGeometricScene(): Scene<GeometricData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: GeometricData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const steps = data.steps;

    g.selectAll('*').remove();

    g.append('text')
      .attr('x', 0)
      .attr('y', -42)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `단계 = ${steps}    채운 합 S = ${fmt(data.sum)}    빈틈 (1/2)^단계 = ${fmt(data.gapValue)}    극한 = 1`,
            en: `steps = ${steps}    filled S = ${fmt(data.sum)}    gap (1/2)^steps = ${fmt(data.gapValue)}    limit = 1`,
          },
          lang,
        ),
      );
    g.append('text')
      .attr('x', 0)
      .attr('y', -22)
      .attr('font-size', 12)
      .style('fill', 'var(--muted)')
      .text(
        localize(
          {
            ko: '매 단계 남은 부분의 절반을 채웁니다. 점선 빈틈은 단계마다 절반으로 줄지만 완전히 사라지지는 않습니다',
            en: 'each step fills half of what is left; the dashed gap halves every step and never quite vanishes',
          },
          lang,
        ),
      );

    const S = Math.min(width, height) - 8;
    const ox = (width - S) / 2;
    const oy = (height - S) / 2;
    const xs = scaleLinear().domain([0, 1]).range([ox, ox + S]);
    const ys = scaleLinear().domain([0, 1]).range([oy + S, oy]);

    // Filled pieces.
    data.pieces.forEach((p) => {
      const color = PIECE_COLORS[(p.step - 1) % PIECE_COLORS.length] ?? '#4da3ff';
      g.append('rect')
        .attr('x', xs(p.x0))
        .attr('y', ys(p.y1))
        .attr('width', (p.x1 - p.x0) * S)
        .attr('height', (p.y1 - p.y0) * S)
        .attr('fill', color)
        .attr('opacity', 0.92);
    });

    // Unit square outline and the remaining gap outline.
    g.append('rect')
      .attr('x', xs(0))
      .attr('y', ys(1))
      .attr('width', S)
      .attr('height', S)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--muted)');
    const gp = data.gap;
    g.append('rect')
      .attr('x', xs(gp.x0))
      .attr('y', ys(gp.y1))
      .attr('width', (gp.x1 - gp.x0) * S)
      .attr('height', (gp.y1 - gp.y0) * S)
      .attr('fill', 'none')
      .attr('stroke-dasharray', '7 5')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--bound)');

    // Gap label: centered inside the gap when it is big enough, else just left of it.
    const gapW = (gp.x1 - gp.x0) * S;
    const gapH = (gp.y1 - gp.y0) * S;
    const gapLabel = g
      .append('text')
      .attr('font-size', 14)
      .attr('font-weight', 600)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '빈틈', en: 'gap' }, lang));
    if (gapW > 46 && gapH > 22) {
      gapLabel.attr('x', xs((gp.x0 + gp.x1) / 2)).attr('y', ys((gp.y0 + gp.y1) / 2) + 5).attr('text-anchor', 'middle');
    } else {
      gapLabel.attr('x', xs(gp.x0) - 8).attr('y', ys((gp.y0 + gp.y1) / 2) + 5).attr('text-anchor', 'end');
    }

    // Fraction labels on pieces big enough to hold them.
    data.pieces.forEach((p) => {
      const pw = (p.x1 - p.x0) * S;
      const ph = (p.y1 - p.y0) * S;
      if (pw <= 58 || ph <= 34) return;
      const color = PIECE_COLORS[(p.step - 1) % PIECE_COLORS.length] ?? '#4da3ff';
      g.append('text')
        .attr('x', xs((p.x0 + p.x1) / 2))
        .attr('y', ys((p.y0 + p.y1) / 2) + 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', 17)
        .attr('font-weight', 600)
        .attr('fill', DARK_TEXT.has(color) ? '#0d1526' : '#ffffff')
        .text(p.label);
    });
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      chart = createChart(host, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize(width, height) {
      chart?.setSize(width, height);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      last = undefined;
    },
  };
}

export default defineScene<GeometricData>({ model: geometricModel, createScene: createGeometricScene });
