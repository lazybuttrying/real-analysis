import { scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { holesModel, type HolesData } from '../models/holes';

function createHolesScene(): Scene<HolesData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: HolesData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { steps } = data;
    const sqrt2 = Math.SQRT2;

    const x = scaleLinear().domain([0.98, 1.55]).range([0, width]);
    const rows = steps.length;
    const rowH = Math.min(34, (height - 90) / Math.max(1, rows));

    g.selectAll('*').remove();

    // The irrational target: a dashed line no rational iterate ever reaches.
    g.append('line')
      .attr('x1', x(sqrt2))
      .attr('x2', x(sqrt2))
      .attr('y1', 8)
      .attr('y2', 8 + rows * rowH)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');
    g.append('text')
      .attr('x', x(sqrt2) + 6)
      .attr('y', 20)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text('√2');

    steps.forEach((step, i) => {
      const cy = 24 + i * rowH + rowH / 2;
      g.append('circle').attr('cx', x(step.value)).attr('cy', cy).attr('r', 4).attr('fill', 'var(--accent)');
      g.append('text')
        .attr('x', 4)
        .attr('y', cy + 4)
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(`x${step.n}`);
    });

    const lastStep = steps[steps.length - 1];
    if (lastStep !== undefined) {
      const fraction = lastStep.n <= 5 ? `${lastStep.p}/${lastStep.q}` : '…';
      g.append('text')
        .attr('x', 8)
        .attr('y', height - 44)
        .attr('fill', 'currentColor')
        .attr('font-size', 12)
        .text(`x${lastStep.n} = ${fraction} ≈ ${fmt(lastStep.value, 10)}`);
      g.append('text')
        .attr('x', 8)
        .attr('y', height - 26)
        .attr('fill', 'currentColor')
        .attr('font-size', 12)
        .text(`|x${lastStep.n} − √2| ≈ ${fmt(lastStep.error, 2)}`);
      g.append('text')
        .attr('x', 8)
        .attr('y', height - 8)
        .attr('font-size', 12)
        .style('fill', 'var(--bound)')
        .text(
          localize(
            { ko: '모든 항은 분수 — 극한 √2는 분수가 아니다', en: 'every term is a fraction — the limit √2 is not' },
            lang,
          ),
        );
    }
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

export default defineScene<HolesData>({ model: holesModel, createScene: createHolesScene });
