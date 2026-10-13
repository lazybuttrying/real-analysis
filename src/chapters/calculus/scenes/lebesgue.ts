import { axisBottom, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { lebesgueModel, type LebesgueData } from '../models/lebesgue';

function createLebesgueScene(): Scene<LebesgueData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: LebesgueData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { epsilon, K, covers, totalLength, riemannUpper, riemannLower } = data;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    // Rows stack the covers so overlaps stay visible.
    const rows = 8;
    const rowH = (height - 70) / rows;

    g.selectAll('*').remove();

    // The unit interval.
    g.append('line').attr('x1', 0).attr('x2', width).attr('y1', height - 40).attr('y2', height - 40).attr('stroke', 'currentColor').attr('stroke-width', 2);
    g.append('g').attr('transform', `translate(0,${height - 40})`).call(axisBottom(x).ticks(5));

    for (const cover of covers) {
      const row = (cover.k - 1) % rows;
      const yTop = height - 48 - row * rowH - 3;
      g.append('rect')
        .attr('x', x(Math.max(0, cover.x0)))
        .attr('width', Math.max(1, x(Math.min(1, cover.x1)) - x(Math.max(0, cover.x0))))
        .attr('y', Math.max(0, yTop - rowH + 4))
        .attr('height', Math.max(1, rowH - 6))
        .style('fill', 'var(--accent)')
        .attr('opacity', 0.55);
    }

    // Riemann's verdict on the Dirichlet function: upper sums stuck at 1, lower at 0.
    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        `${localize({ ko: '리만:', en: 'Riemann:' }, lang)} U = ${riemannUpper}, L = ${riemannLower} ${localize({ ko: '(고정 — 적분 불가)', en: '(stuck — not integrable)' }, lang)}`,
      );
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        `${localize({ ko: '르벡 덮개 총길이', en: 'Lebesgue cover total' }, lang)} ≈ ${fmt(totalLength, 5)} < ε = ${fmt(epsilon, 3)} (K = ${K})`,
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

export default defineScene<LebesgueData>({ model: lebesgueModel, createScene: createLebesgueScene });
