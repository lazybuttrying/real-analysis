import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, type ControlState, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { zeta4Model, LIMIT, type Zeta4Data } from '../models/zeta4';

// Tiny bars for 1/n^4, a staircase of partial sums rising to pi^4/90,
// and a pattern strip: even zetas are pi powers over striking
// denominators, while odd zeta(3) refuses the pattern entirely.

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 84, left: 56 };
const SUPERSCRIPT: Record<number, string> = { 2: '²', 3: '³', 4: '⁴', 6: '⁶' };

function createZeta4Scene(): Scene<Zeta4Data> {
  let chart: Chart | undefined;
  let last: { data: Zeta4Data; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const n = data.n;

    const x = scaleLinear().domain([0.4, n + 0.6]).range([0, width]);
    const y = scaleLinear().domain([0, 1.15]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(n));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -42)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`N = ${n}    S_N = ${fmt(data.sum)}    limit π⁴/90 = ${fmt(LIMIT)}    |error| = ${fmt(data.error)}`);
    g.append('text')
      .attr('x', 0)
      .attr('y', -22)
      .attr('font-size', 12)
      .style('fill', 'var(--muted)')
      .text('fourth powers collapse so fast that the first term already does most of the work');

    // Bars for the terms 1/i^4.
    const bw = Math.min(30, (width / n) * 0.5);
    data.heights.forEach((h, i) => {
      g.append('rect')
        .attr('x', x(i + 1) - bw / 2)
        .attr('y', y(h))
        .attr('width', bw)
        .attr('height', y(0) - y(h))
        .attr('opacity', 0.9)
        .style('fill', 'var(--accent)');
    });

    // Limit line and the partial-sum staircase.
    g.append('line')
      .attr('x1', x(0.4))
      .attr('x2', x(n + 0.6))
      .attr('y1', y(LIMIT))
      .attr('y2', y(LIMIT))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .attr('stroke', GOLD);
    g.append('text')
      .attr('x', x(n + 0.6) - 2)
      .attr('y', y(LIMIT) - 10)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text('π⁴/90');

    const path = line<{ k: number; v: number }>()
      .x((p) => x(p.k))
      .y((p) => y(p.v));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .attr('stroke', GOLD)
      .attr('d', path(data.sums.map((s, i) => ({ k: i + 1, v: s }))) ?? '');
    data.sums.forEach((s, i) => {
      g.append('circle').attr('cx', x(i + 1)).attr('cy', y(s)).attr('r', 4).attr('fill', GOLD);
    });
    g.append('text')
      .attr('x', x(2) + bw)
      .attr('y', y(0.9))
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text('first term: 1');

    // Pattern strip under the axis: even zetas are pi powers; zeta(3) is not.
    const evens = data.pattern.filter((p) => !p.odd);
    const odd = data.pattern.find((p) => p.odd);
    g.append('text')
      .attr('x', 0)
      .attr('y', height + 38)
      .attr('font-size', 12.5)
      .attr('fill', GOLD)
      .text(evens.map((p) => `ζ(${p.p}) = π${SUPERSCRIPT[p.p] ?? `^${p.p}`}/${p.denom} = ${fmt(p.value)}`).join('      '));
    if (odd) {
      g.append('text')
        .attr('x', 0)
        .attr('y', height + 60)
        .attr('font-size', 12.5)
        .style('fill', 'var(--accent)')
        .text(`ζ(3) = ${fmt(odd.value)} — no π-power pattern (Apéry's constant; estimated here by direct summation)`);
    }
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

export default defineScene<Zeta4Data>({ model: zeta4Model, createScene: createZeta4Scene });
