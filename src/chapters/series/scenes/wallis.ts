import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { wallisModel, LIMIT, type WallisData } from '../models/wallis';

// The running product, plotted as distance from pi/2, swings above
// and below the target with tightening amplitude as factor pairs
// multiply in - an oscillation that squeezes pi out of whole-number ratios.

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 40, left: 56 };

function createWallisScene(): Scene<WallisData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: WallisData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const maxStep = Math.max(2, data.factors);

    const x = scaleLinear().domain([0, maxStep]).range([0, width]);
    const y = scaleLinear().domain([-0.62, 0.62]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -42)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `인수 쌍 = ${data.pairs}    곱 = ${fmt(data.product, 7)}    π/2 = ${fmt(LIMIT, 7)}    |오차| = ${fmt(data.error)}`,
            en: `factor pairs = ${data.pairs}    product = ${fmt(data.product, 7)}    π/2 = ${fmt(LIMIT, 7)}    |error| = ${fmt(data.error)}`,
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
            ko: '인수를 하나 곱할 때마다 곱이 π/2를 넘어 흔들리고, 그 흔들림은 점점 0으로 줄어듭니다',
            en: 'every factor swings the product past π/2; the swings shrink toward zero',
          },
          lang,
        ),
      );

    // Target line at pi/2 (deviation 0).
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(maxStep))
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .attr('stroke', GOLD);
    g.append('text')
      .attr('x', x(maxStep) - 2)
      .attr('y', y(0) - 10)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text('π/2');

    const path = line<{ step: number; dev: number }>()
      .x((p) => x(p.step))
      .y((p) => y(p.dev));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', path(data.points.map((p) => ({ step: p.step, dev: p.value - LIMIT }))) ?? '');

    data.points.forEach((p) => {
      if (p.step === 0) return;
      g.append('circle')
        .attr('cx', x(p.step))
        .attr('cy', y(p.value - LIMIT))
        .attr('r', 4)
        .style('fill', p.value - LIMIT >= 0 ? 'var(--accent)' : GOLD);
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

export default defineScene<WallisData>({ model: wallisModel, createScene: createWallisScene });
