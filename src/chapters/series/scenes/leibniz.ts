import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, type ControlState, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { leibnizModel, LIMIT, type LeibnizData } from '../models/leibniz';

// Partial sums zigzag around pi/4, plotted as deviation from pi/4 so the
// tightening spiral stays visible. The bracket between S_N and S_{N+1}
// is exactly the next term - and therefore the error bound.

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 40, left: 56 };

function createLeibnizScene(): Scene<LeibnizData> {
  let chart: Chart | undefined;
  let last: { data: LeibnizData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const n = data.n;

    const x = scaleLinear().domain([0, n + 1]).range([0, width]);
    const y = scaleLinear().domain([-0.42, 0.42]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -42)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`N = ${n}    S_N = ${fmt(data.sum, 7)}    π/4 = ${fmt(LIMIT, 7)}    |error| = ${fmt(data.error)}`);
    g.append('text')
      .attr('x', 0)
      .attr('y', -22)
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text(`alternating estimate: |error| ≤ next term 1/(2N+1) = ${fmt(data.bound)} — π/4 always sits between S_N and S_{N+1}`);

    // Target line at deviation 0.
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(n + 1))
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', GOLD);
    g.append('text').attr('x', 4).attr('y', y(0) - 8).attr('font-size', 12).attr('fill', GOLD).text('π/4');

    // Zigzag of partial sums.
    const zig = line<{ k: number; dev: number }>()
      .x((p) => x(p.k))
      .y((p) => y(p.dev));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', zig(data.sums.map((s, i) => ({ k: i + 1, dev: s - LIMIT }))) ?? '');

    data.sums.forEach((s, i) => {
      g.append('circle')
        .attr('cx', x(i + 1))
        .attr('cy', y(s - LIMIT))
        .attr('r', 4.5)
        .style('fill', s - LIMIT >= 0 ? 'var(--accent)' : GOLD);
    });

    // Bracket between S_N and S_{N+1}: its height is the next term.
    const bx = x(n);
    const topY = Math.min(y(data.sum - LIMIT), y(data.next - LIMIT));
    g.append('line')
      .attr('x1', bx)
      .attr('x2', bx)
      .attr('y1', y(data.sum - LIMIT))
      .attr('y2', y(data.next - LIMIT))
      .attr('stroke-width', 4.5)
      .attr('stroke', GOLD);
    g.append('text')
      .attr('x', bx - 8)
      .attr('y', topY - 10)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text('bracket = next term');
  };

  return {
    mount(host) {
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

export default defineScene<LeibnizData>({ model: leibnizModel, createScene: createLeibnizScene });
