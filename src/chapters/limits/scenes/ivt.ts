import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { ivtModel, type IVTData, type IVTSample } from '../models/ivt';

function createIVTScene(): Scene<IVTData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: IVTData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { a, b, fa, fb, c, xi, samples } = data;

    const x = scaleLinear().domain([a, b]).range([0, width]);
    const y = scaleLinear()
      .domain([Math.min(fa, fb, c) - 0.15 * Math.abs(fb - fa) - 0.05, Math.max(fa, fb, c) + 0.15 * Math.abs(fb - fa) + 0.05])
      .range([height, 0]);

    const curve = line<IVTSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(5));

    // The target level: every height between f(a) and f(b) must be crossed.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(c))
      .attr('y2', y(c))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');
    g.append('text')
      .attr('x', width - 4)
      .attr('y', y(c) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(`c = ${fmt(c, 4)}`);

    g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', curve(samples) ?? '');

    // The crossing point.
    g.append('line')
      .attr('x1', x(xi))
      .attr('x2', x(xi))
      .attr('y1', y(c))
      .attr('y2', height)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', 0.6);
    g.append('circle').attr('cx', x(xi)).attr('cy', y(c)).attr('r', 5).attr('fill', 'var(--accent)');

    for (const [px, py] of [
      [a, fa],
      [b, fb],
    ] as const) {
      g.append('circle').attr('cx', x(px)).attr('cy', y(py)).attr('r', 3.5).attr('fill', 'currentColor').attr('opacity', 0.7);
    }

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`ξ ≈ ${fmt(xi, 6)}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '— 반드시 밟고 지나가는 점', en: '— the point the curve must step on' }, lang));
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

export default defineScene<IVTData>({ model: ivtModel, createScene: createIVTScene });
