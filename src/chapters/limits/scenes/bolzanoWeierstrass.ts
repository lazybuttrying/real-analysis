import { scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { bolzanoWeierstrassModel, type BolzanoWeierstrassData } from '../models/bolzanoWeierstrass';


function drawMain(chart: Chart, data: BolzanoWeierstrassData, lang: Lang): void {
    const { g, width, height } = chart;
    const { points, intervals, subsequence } = data;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const stripTop = 24 + intervals.length * 15;
    const stripH = Math.max(60, height - stripTop - 64);

    g.selectAll('*').remove();

    // Nested interval brackets, one row per bisection step.
    intervals.forEach((interval, s) => {
      const y = 16 + s * 15;
      const accent = s === intervals.length - 1;
      g.append('line')
        .attr('x1', x(interval.a))
        .attr('x2', x(interval.b))
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', accent ? 'var(--accent)' : 'currentColor')
        .attr('stroke-width', accent ? 3 : 1.5)
        .attr('opacity', accent ? 1 : 0.5);
      for (const end of [interval.a, interval.b]) {
        g.append('line')
          .attr('x1', x(end))
          .attr('x2', x(end))
          .attr('y1', y - 4)
          .attr('y2', y + 4)
          .attr('stroke', accent ? 'var(--accent)' : 'currentColor')
          .attr('stroke-width', accent ? 3 : 1.5)
          .attr('opacity', accent ? 1 : 0.5);
      }
    });

    // The scattered sequence; survivors of the bisection glow.
    const survivors = new Set(subsequence);
    points.forEach((value, i) => {
      const kept = survivors.has(value);
      const jy = ((i * 2654435761) % 1000) / 1000;
      g.append('circle')
        .attr('cx', x(value))
        .attr('cy', stripTop + jy * stripH)
        .attr('r', kept ? 3 : 1.8)
        .attr('fill', kept ? 'var(--accent)' : 'currentColor')
        .attr('opacity', kept ? 1 : 0.35);
    });

    const final = intervals[intervals.length - 1];
    const length = final !== undefined ? final.b - final.a : 0;
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 40)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`${localize({ ko: '구간 길이', en: 'interval length' }, lang)} = 2^−${data.steps} = ${fmt(length, 4)}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 22)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`${localize({ ko: '살아남은 점 (부분수열)', en: 'surviving points (subsequence)' }, lang)}: ${subsequence.length}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 4)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '구간이 한 점으로 조여들며 부분수열이 그 점으로 수렴', en: 'the interval squeezes to a point; the subsequence converges to it' }, lang));
}

export default defineSimpleScene<BolzanoWeierstrassData>({
  model: bolzanoWeierstrassModel,
  drawMain,
});
