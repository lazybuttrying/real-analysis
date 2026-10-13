import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { taylorModel, type TaylorData, type TaylorSample } from '../models/taylor';

function createTaylorScene(): Scene<TaylorData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: TaylorData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, maxErr, samples } = data;

    const x = scaleLinear().domain([-Math.PI, Math.PI]).range([0, width]);
    const allY = samples.flatMap((p) => [p.y, p.p]);
    const yMax = Math.max(2, ...allY.map(Math.abs));
    const y = scaleLinear().domain([-yMax, yMax]).range([height, 0]);

    const fLine = line<TaylorSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));
    const pLine = line<TaylorSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.p));

    g.selectAll('*').remove();
    g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(7));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('path').attr('fill', 'none').attr('stroke-width', 2).attr('stroke-dasharray', '5 4').attr('opacity', 0.65).attr('d', fLine(samples) ?? '');
    g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', pLine(samples) ?? '');

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`T_${n}(x)`);
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(`${localize({ ko: '[−π, π] 최대 오차', en: 'max error on [−π, π]' }, lang)} ≈ ${fmt(maxErr, 4)}`);
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      chart = createChart(host);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      last = undefined;
    },
  };
}

export default defineScene<TaylorData>({ model: taylorModel, createScene: createTaylorScene });
