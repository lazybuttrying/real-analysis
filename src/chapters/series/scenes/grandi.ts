import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { grandiModel, type GrandiData } from '../models/grandi';

// Grandi's series, with honest framing throughout: the series
// diverges; partial sums bounce 1, 0, 1, 0 forever. The dashed curve
// is the Cesaro mean - an average of partial sums settling at 1/2 -
// never labeled as "the sum".

const GOLD = '#d9930d';
const MARGIN = { top: 88, right: 20, bottom: 40, left: 56 };

function createGrandiScene(): Scene<GrandiData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: GrandiData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const n = data.n;
    const xMax = Math.max(2, n);

    const x = scaleLinear().domain([0, xMax]).range([0, width]);
    const y = scaleLinear().domain([-0.3, 1.3]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -66)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `N = ${n}    S_N = ${data.sum} (절대 안정되지 않음)    체사로 평균 = ${fmt(data.cesaroMean)}    급수의 합: 존재하지 않음 — 발산`,
            en: `N = ${n}    S_N = ${data.sum} (never settles)    Cesàro mean = ${fmt(data.cesaroMean)}    sum of the series: does not exist — divergent`,
          },
          lang,
        ),
      );
    g.append('text')
      .attr('x', 0)
      .attr('y', -44)
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text('(1 − 1) + (1 − 1) + ⋯ = 0          1 + (−1 + 1) + (−1 + 1) + ⋯ = 1');
    g.append('text')
      .attr('x', 0)
      .attr('y', -24)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(
        localize(
          {
            ko: '둘 다 맞을 수는 없습니다 — 항을 다시 묶는 것은 수렴급수에서만 허용됩니다',
            en: 'both cannot be right — regrouping terms is only legal for convergent series',
          },
          lang,
        ),
      );

    // The 1/2 line: where the Cesaro mean settles. It is not a sum.
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(xMax))
      .attr('y1', y(0.5))
      .attr('y2', y(0.5))
      .attr('stroke-dasharray', '5 4')
      .attr('stroke-width', 1.5)
      .style('stroke', 'var(--muted)');
    g.append('text')
      .attr('x', x(xMax) - 4)
      .attr('y', y(0.5) + 20)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .style('fill', 'var(--muted)')
      .text('1/2');

    const zig = line<{ k: number; v: number }>()
      .x((p) => x(p.k))
      .y((p) => y(p.v));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', zig(data.sums.map((s, i) => ({ k: i + 1, v: s }))) ?? '');
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-dasharray', '7 5')
      .attr('stroke-width', 2.5)
      .attr('stroke', GOLD)
      .attr('d', zig(data.cesaro.map((c, i) => ({ k: i + 1, v: c }))) ?? '');

    data.sums.forEach((s, i) => {
      g.append('circle')
        .attr('cx', x(i + 1))
        .attr('cy', y(s))
        .attr('r', 5)
        .style('fill', s === 1 ? 'var(--accent)' : GOLD);
    });

    g.append('text')
      .attr('x', 6)
      .attr('y', y(1) - 12)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '부분합: 1, 0, 1, 0, …', en: 'partial sums: 1, 0, 1, 0, …' }, lang));
    g.append('text')
      .attr('x', x(xMax) - 4)
      .attr('y', y(data.cesaroMean) - 12)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text(localize({ ko: '체사로 평균', en: 'Cesàro mean' }, lang));
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

export default defineScene<GrandiData>({ model: grandiModel, createScene: createGrandiScene });
