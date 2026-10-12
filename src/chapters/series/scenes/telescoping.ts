import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { telescopingModel, type TelescopingData } from '../models/telescoping';

// Each term 1/(n(n+1)) is drawn as a split pair: +1/n above the axis,
// -1/(n+1) below it. Interior pairs fade to ghosts because they
// cancel; the first 1 and the last tail stay solid.

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 40, left: 56 };

function createTelescopingScene(): Scene<TelescopingData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: TelescopingData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const n = data.n;

    const x = scaleLinear().domain([0.4, n + 0.6]).range([0, width]);
    const y = scaleLinear().domain([-1.15, 1.15]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(n));
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
            ko: `N = ${n}    S_N = ${fmt(data.sum)}    극한 = 1    남은 꼬리 1/(N+1) = ${fmt(data.tail)}    |오차| = ${fmt(data.error)}`,
            en: `N = ${n}    S_N = ${fmt(data.sum)}    limit = 1    surviving tail 1/(N+1) = ${fmt(data.tail)}    |error| = ${fmt(data.error)}`,
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
            ko: '흐리게 표시된 이웃 항들은 서로 지워집니다 — 처음의 1과 줄어드는 꼬리만 남습니다',
            en: 'ghosted neighbors cancel each other — only the very first 1 and the shrinking tail survive',
          },
          lang,
        ),
      );

    // Zero axis.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke-width', 1.5)
      .style('stroke', 'var(--muted)');

    const bw = Math.min(24, (width / n) * 0.34);
    data.pairs.forEach((p) => {
      g.append('rect')
        .attr('x', x(p.i) - bw - 2)
        .attr('y', y(p.pos))
        .attr('width', bw)
        .attr('height', y(0) - y(p.pos))
        .attr('opacity', p.i === 1 ? 1 : 0.28)
        .style('fill', p.i === 1 ? GOLD : 'var(--accent)');
      g.append('rect')
        .attr('x', x(p.i) + 2)
        .attr('y', y(0))
        .attr('width', bw)
        .attr('height', y(-p.neg) - y(0))
        .attr('opacity', p.i === n ? 1 : 0.28)
        .style('fill', 'var(--bound)');
    });

    g.append('text')
      .attr('x', x(1) - bw / 2 - 2)
      .attr('y', y(1) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('fill', GOLD)
      .text('1/n');
    g.append('text')
      .attr('x', x(1) + bw / 2 + 2)
      .attr('y', y(-0.5) + 24)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .style('fill', 'var(--bound)')
      .text('-1/(n+1)');
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

export default defineScene<TelescopingData>({ model: telescopingModel, createScene: createTelescopingScene });
