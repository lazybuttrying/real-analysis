import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, type ControlState, type Scene } from '../../../contracts';
import { createChart, fmtSci, type Chart } from '../../../view/d3kit';
import { stirlingModel, type StirlingData } from '../models/stirling';

// Top panel: ln(n!) points vs the Stirling curve on a log scale -
// nearly on top of each other. Bottom band: the relative error,
// shrinking like 1/(12n).

const GOLD = '#d9930d';
const MARGIN = { top: 64, right: 20, bottom: 40, left: 56 };

function createStirlingScene(): Scene<StirlingData> {
  let chart: Chart | undefined;
  let last: { data: StirlingData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const n = data.n;
    const lastPoint = data.points[data.points.length - 1];
    if (!lastPoint) return;

    g.selectAll('*').remove();

    g.append('text')
      .attr('x', 0)
      .attr('y', -42)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        `n = ${n}    n! = ${fmtSci(data.fact)}    Stirling = ${fmtSci(data.approx)}    relative error = ${(data.relErr * 100).toFixed(2)}%`,
      );
    g.append('text')
      .attr('x', 0)
      .attr('y', -22)
      .attr('font-size', 12)
      .style('fill', 'var(--muted)')
      .text('idea level: the π in the formula enters through the Wallis product in the full derivation');

    const mainH = Math.round((height - 64) * 0.6);
    const errTop = mainH + 56;
    const errH = Math.max(30, height - errTop - 28);

    const x = scaleLinear().domain([1, Math.max(2, n)]).range([0, width]);
    const maxLn = Math.max(1, lastPoint.lnFact);
    const y = scaleLinear().domain([0, maxLn * 1.08]).range([mainH, 0]);

    // Main panel: Stirling curve under the ln(n!) points.
    g.append('g').call(axisLeft(y).ticks(5));
    g.append('g').attr('transform', `translate(0,${mainH})`).call(axisBottom(x).ticks(8));

    const curve = line<{ k: number; v: number }>()
      .x((p) => x(p.k))
      .y((p) => y(p.v));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', curve(data.points.map((p) => ({ k: p.k, v: p.lnStir }))) ?? '');
    data.points.forEach((p) => {
      g.append('circle').attr('cx', x(p.k)).attr('cy', y(p.lnFact)).attr('r', 4).attr('fill', GOLD);
    });

    const nearRight = lastPoint.k >= Math.max(2, n) / 2;
    const labelX = nearRight ? x(lastPoint.k) - 8 : x(lastPoint.k) + 8;
    const anchor = nearRight ? 'end' : 'start';
    g.append('text')
      .attr('x', labelX)
      .attr('y', y(lastPoint.lnFact) - 12)
      .attr('text-anchor', anchor)
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text('ln(n!)');
    g.append('text')
      .attr('x', labelX)
      .attr('y', y(lastPoint.lnStir) + 24)
      .attr('text-anchor', anchor)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text('Stirling');

    // Error band.
    g.append('text')
      .attr('x', 0)
      .attr('y', mainH + 26)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text('relative error — shrinks like 1/(12n)');
    const errG = g.append('g').attr('transform', `translate(0,${errTop})`);
    const yErr = scaleLinear().domain([0, 0.09]).range([errH, 0]);
    errG.append('g').call(axisLeft(yErr).ticks(4));
    errG.append('g').attr('transform', `translate(0,${errH})`).call(axisBottom(x).ticks(8));

    const bw = Math.max(2, Math.min(14, (width / Math.max(2, n)) * 0.55));
    data.points.forEach((p) => {
      errG
        .append('rect')
        .attr('x', x(p.k) - bw / 2)
        .attr('y', yErr(p.relErr))
        .attr('width', bw)
        .attr('height', errH - yErr(p.relErr))
        .attr('opacity', 0.85)
        .style('fill', 'var(--bound)');
    });
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

export default defineScene<StirlingData>({ model: stirlingModel, createScene: createStirlingScene });
