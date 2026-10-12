import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { eseriesModel, LIMIT, type ESeriesData, type StepPoint } from '../models/eseries';

// Both racers plotted as distance below e: compound growth crawls in
// from far below, the factorial series dives almost at once.

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 40, left: 56 };

function createESeriesScene(): Scene<ESeriesData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: ESeriesData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const n = data.n;
    const xMax = Math.max(2, n);

    const x = scaleLinear().domain([0, xMax]).range([0, width]);
    const y = scaleLinear().domain([-1.85, 0.15]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
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
            ko: `n = ${n}    급수 Σ 1/k! = ${fmt(data.seriesValue, 8)}    복리 (1+1/n)^n = ${fmt(data.compoundValue, 8)}    e = ${fmt(LIMIT, 8)}`,
            en: `n = ${n}    series Σ 1/k! = ${fmt(data.seriesValue, 8)}    compound (1+1/n)^n = ${fmt(data.compoundValue, 8)}    e = ${fmt(LIMIT, 8)}`,
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
            ko: `|오차|  급수 = ${fmt(data.seriesError)}      |오차|  복리 = ${fmt(data.compoundError)}`,
            en: `|error|  series = ${fmt(data.seriesError)}      |error|  compound = ${fmt(data.compoundError)}`,
          },
          lang,
        ),
      );

    // Target line at e (deviation 0).
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(xMax))
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--muted)');
    g.append('text').attr('x', 4).attr('y', y(0) - 8).attr('font-size', 12).style('fill', 'var(--muted)').text('e');

    const path = line<StepPoint>()
      .x((p) => x(p.k))
      .y((p) => y(p.value - LIMIT));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', path(data.compound) ?? '');
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .attr('stroke', GOLD)
      .attr('d', path(data.series) ?? '');

    data.compound.forEach((p) => {
      g.append('circle').attr('cx', x(p.k)).attr('cy', y(p.value - LIMIT)).attr('r', 4).style('fill', 'var(--accent)');
    });
    data.series.forEach((p) => {
      g.append('circle').attr('cx', x(p.k)).attr('cy', y(p.value - LIMIT)).attr('r', 4).attr('fill', GOLD);
    });

    g.append('text')
      .attr('x', x(xMax) - 6)
      .attr('y', y(data.seriesValue - LIMIT) - 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text(localize({ ko: '급수 Σ 1/k!', en: 'series Σ 1/k!' }, lang));
    g.append('text')
      .attr('x', x(xMax) - 6)
      .attr('y', y(data.compoundValue - LIMIT) + 24)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '복리 (1 + 1/n)^n', en: 'compound (1 + 1/n)^n' }, lang));
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

export default defineScene<ESeriesData>({ model: eseriesModel, createScene: createESeriesScene });
