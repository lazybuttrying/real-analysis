import { scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { cantorModel, type CantorData } from '../models/cantor';

function createCantorScene(): Scene<CantorData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: CantorData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { stages, stage, totalLength } = data;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const rows = stages.length;
    const rowH = Math.min(30, (height - 70) / Math.max(1, rows));

    g.selectAll('*').remove();

    stages.forEach((intervals, s) => {
      const y = 14 + s * rowH;
      const current = s === stage;
      for (const { l, r } of intervals) {
        g.append('rect')
          .attr('x', x(l))
          .attr('width', Math.max(1, x(r) - x(l)))
          .attr('y', y)
          .attr('height', rowH * 0.55)
          .attr('fill', current ? 'var(--accent)' : 'currentColor')
          .attr('opacity', current ? 1 : 0.3);
      }
      g.append('text')
        .attr('x', 2)
        .attr('y', y - 3)
        .attr('font-size', 10)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.6)
        .text(`C${s}`);
    });

    g.append('text')
      .attr('x', 8)
      .attr('y', height - 40)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`2^${stage} ${localize({ ko: '조각', en: 'pieces' }, lang)} × (1/3)^${stage}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 22)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`${localize({ ko: '전체 길이', en: 'total length' }, lang)} = (2/3)^${stage} ≈ ${fmt(totalLength, 4)}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 4)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(
        localize(
          { ko: '길이는 0으로 — 남는 점은 셀 수 없이 많음 (아이디어 수준)', en: 'length → 0 — yet uncountably many points remain (idea level)' },
          lang,
        ),
      );
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

export default defineScene<CantorData>({ model: cantorModel, createScene: createCantorScene });
