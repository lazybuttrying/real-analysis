import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { newtonFunction, newtonModel, type NewtonData } from '../models/newton';

function createNewtonScene(): Scene<NewtonData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: NewtonData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { key, steps, errors, samples } = data;
    const { xMin, xMax, root } = newtonFunction(key);

    const x = scaleLinear().domain([xMin, xMax]).range([0, width]);
    const allY = samples.map((p) => p.y);
    const yMin = Math.min(...allY, 0);
    const yMax = Math.max(...allY, 0.5);
    const pad = 0.1 * (yMax - yMin || 1);
    const y = scaleLinear()
      .domain([yMin - pad, yMax + pad])
      .range([height, 0]);

    const curve = line<{ x: number; y: number }>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));

    g.selectAll('*').remove();
    g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).attr('stroke', 'currentColor').attr('d', curve(samples) ?? '');

    if (root !== null) {
      g.append('circle').attr('cx', x(root)).attr('cy', y(0)).attr('r', 5).attr('fill', 'var(--accent)');
      g.append('text')
        .attr('x', x(root))
        .attr('y', y(0) + 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .style('fill', 'var(--accent)')
        .text(`√2`);
    }

    // Tangent cobweb: tangent at x_k hits the axis at x_{k+1}, then up to the curve.
    for (const step of steps) {
      g.append('line')
        .attr('x1', x(step.x))
        .attr('x2', x(step.next))
        .attr('y1', y(step.fx))
        .attr('y2', y(0))
        .style('stroke', 'var(--bound)')
        .attr('stroke-width', 1.5);
      g.append('circle').attr('cx', x(step.x)).attr('cy', y(step.fx)).attr('r', 4).style('fill', 'var(--bound)');
      g.append('line')
        .attr('x1', x(step.next))
        .attr('x2', x(step.next))
        .attr('y1', y(0))
        .attr('y2', y(step.fx))
        .style('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '3 3')
        .attr('opacity', 0.5);
    }

    const lastStep = steps[steps.length - 1];
    const lastX = lastStep ? lastStep.next : 0;
    const lastErr = errors[errors.length - 1];
    const errText =
      lastErr !== undefined
        ? `${localize({ ko: '오차', en: 'error' }, lang)} ≈ ${fmt(lastErr, 3)}`
        : localize({ ko: '0 ↔ 1 무한 순환 — 수렴하지 않음', en: '0 ↔ 1 forever — no convergence' }, lang);
    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`x_n ≈ ${fmt(lastX, 8)}`);
    g.append('text').attr('x', 8).attr('y', 32).attr('font-size', 12).style('fill', 'var(--accent)').text(errText);
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

export default defineScene<NewtonData>({ model: newtonModel, createScene: createNewtonScene });
