import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { uniformModel, type UniformData, type UniformSample } from '../models/uniform';

function createUniformScene(): Scene<UniformData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: UniformData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, epsilon, samples, supNorm, escapeX } = data;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const y = scaleLinear().domain([-0.12, 1.18]).range([height, 0]);

    const curve = line<UniformSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(5));

    // The ε-tube around the pointwise limit (y = 0 on [0,1), y = 1 at x = 1).
    g.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', y(epsilon))
      .attr('height', Math.max(0, y(-epsilon) - y(epsilon)))
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.12);
    g.append('rect')
      .attr('x', x(0.985))
      .attr('width', x(1) - x(0.985))
      .attr('y', y(1 + epsilon))
      .attr('height', Math.max(0, y(1 - epsilon) - y(1 + epsilon)))
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.12);

    // The discontinuous pointwise limit.
    g.append('line').attr('x1', x(0)).attr('x2', x(0.995)).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'currentColor').attr('opacity', 0.6);
    g.append('circle').attr('cx', x(1)).attr('cy', y(1)).attr('r', 4).attr('fill', 'currentColor').attr('opacity', 0.8);

    // The approximating curve, escaping the tube near x = 1.
    g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', curve(samples) ?? '');

    if (escapeX < 1) {
      g.append('line')
        .attr('x1', x(escapeX))
        .attr('x2', x(escapeX))
        .attr('y1', y(epsilon))
        .attr('y2', y(0))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '4 3');
      g.append('circle').attr('cx', x(escapeX)).attr('cy', y(epsilon)).attr('r', 4).attr('fill', 'var(--bound)');
      g.append('text')
        .attr('x', x(escapeX) - 6)
        .attr('y', y(epsilon) - 8)
        .attr('text-anchor', 'end')
        .attr('font-size', 11)
        .style('fill', 'var(--bound)')
        .text(`x ≈ ${fmt(escapeX, 3)}`);
    }

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`n = ${n}   ε = ${fmt(epsilon)}   sup|f_n − f| ≈ ${fmt(supNorm, 3)}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '상한은 1에서 멈춤 — 0으로 가지 않는다', en: 'the sup stays at 1 — it never goes to 0' }, lang));
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

export default defineScene<UniformData>({ model: uniformModel, createScene: createUniformScene });
