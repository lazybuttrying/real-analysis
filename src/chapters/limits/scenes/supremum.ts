import { axisBottom, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { supremumModel, type SupremumData } from '../models/supremum';

const SET_LABEL = {
  'one-minus': { ko: 'S = {1 − 1/n}', en: 'S = {1 − 1/n}' },
  sqrt2: { ko: '√2의 유리수 절단값', en: 'rational truncations of √2' },
} as const;

function createSupremumScene(): Scene<SupremumData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: SupremumData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { set, sup, bound, gap, isUpper, points } = data;
    const { g, width, height } = chart;
    if (width < 40 || height < 120) return;

    const axisY = height - 30;
    const midY = axisY * 0.45;
    const x = scaleLinear().domain([0, 2]).range([0, width]);

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${axisY})`).call(axisBottom(x).ticks(5));

    // The set's points.
    g.selectAll('circle.sup-pt')
      .data(points)
      .join('circle')
      .attr('class', 'sup-pt')
      .attr('cx', (p) => x(p))
      .attr('cy', midY)
      .attr('r', 3.2)
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.85);

    // The supremum: dashed vertical line.
    g.append('line')
      .attr('x1', x(sup))
      .attr('x2', x(sup))
      .attr('y1', 10)
      .attr('y2', axisY)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 4');
    g.append('text')
      .attr('x', x(sup))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text('sup');

    // The candidate upper bound.
    g.append('line')
      .attr('x1', x(bound))
      .attr('x2', x(bound))
      .attr('y1', 30)
      .attr('y2', axisY)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2 3');
    g.append('path')
      .attr('d', `M ${x(bound) - 6} 22 L ${x(bound) + 6} 22 L ${x(bound)} 30 Z`)
      .attr('fill', 'var(--bound)');
    g.append('text')
      .attr('x', x(bound) + 10)
      .attr('y', 26)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '후보', en: 'candidate' }, lang));

    // Readouts.
    g.append('text')
      .attr('x', 8)
      .attr('y', 16)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(localize(SET_LABEL[set as keyof typeof SET_LABEL] ?? SET_LABEL['one-minus'], lang));
    g.append('text')
      .attr('x', 8)
      .attr('y', 34)
      .attr('font-size', 12)
      .attr('fill', isUpper ? 'var(--bound)' : '#c0392b')
      .text(`gap = bound - sup ≈ ${fmt(gap, 3)}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', 52)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          isUpper
            ? { ko: '상한이 맞습니다 — 하지만 가장 작지는 않습니다', en: 'an upper bound — but not the least' }
            : { ko: '상한이 아닙니다', en: 'not an upper bound' },
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

export default defineScene<SupremumData>({ model: supremumModel, createScene: createSupremumScene });
