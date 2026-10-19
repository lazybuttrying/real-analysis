import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { mvtModel, type MVTData, type MVTSample } from '../models/mvt';

/** y-value of the sample nearest to x (samples are never empty). */
function nearestY(samples: readonly MVTSample[], x: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (const s of samples) {
    const d = Math.abs(s.x - x);
    if (d < bestDist) {
      bestDist = d;
      best = s.y;
    }
  }
  return best;
}

function drawMain(chart: Chart, data: MVTData, lang: Lang): void {
  const { g, width, height } = chart;
  const { a, b, secantSlope, xi, tangentSlope, mvtPoints, samples } = data;
  const first = samples[0];
  const lastSample = samples[samples.length - 1];
  if (!first || !lastSample) return;
  const fa = first.y;
  const fb = lastSample.y;

  const x = scaleLinear().domain([a, b]).range([0, width]);
  const allY = samples.map((p) => p.y);
  const yMin = Math.min(...allY, fa, fb);
  const yMax = Math.max(...allY, fa, fb);
  const pad = 0.12 * (yMax - yMin || 1);
  const y = scaleLinear()
    .domain([yMin - pad, yMax + pad])
    .range([height, 0]);

  const curve = line<MVTSample>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));

  g.selectAll('*').remove();
  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
  g.append('g').call(axisLeft(y).ticks(5));

  // The secant through the endpoints.
  g.append('line')
    .attr('x1', x(a))
    .attr('x2', x(b))
    .attr('y1', y(fa))
    .attr('y2', y(fb))
    .attr('stroke', 'var(--bound)')
    .attr('stroke-dasharray', '6 4')
    .attr('stroke-width', 1.5);

  g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', curve(samples) ?? '');

  // The MVT points the theorem guarantees (found numerically).
  for (const p of mvtPoints) {
    g.append('circle').attr('cx', x(p)).attr('cy', y(nearestY(samples, p))).attr('r', 5).attr('fill', 'none').attr('stroke', 'var(--bound)').attr('stroke-width', 2);
  }

  // The tangent at the slider position.
  const yXi = nearestY(samples, xi);
  const dx = (b - a) * 0.18;
  g.append('line')
    .attr('x1', x(xi - dx))
    .attr('x2', x(xi + dx))
    .attr('y1', y(yXi - tangentSlope * dx))
    .attr('y2', y(yXi + tangentSlope * dx))
    .style('stroke', 'var(--accent)')
    .attr('stroke-width', 2.5);
  g.append('circle').attr('cx', x(xi)).attr('cy', y(yXi)).attr('r', 5).attr('fill', 'var(--accent)');
  g.append('text')
    .attr('x', x(xi))
    .attr('y', y(yXi) - 12)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text('ξ');

  const parallel = Math.abs(tangentSlope - secantSlope) < 0.02 * (Math.abs(secantSlope) + 1);
  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(`secant ${fmt(secantSlope, 4)} · f′(ξ) ${fmt(tangentSlope, 4)}`);
  g.append('text')
    .attr('x', 8)
    .attr('y', 32)
    .attr('font-size', 12)
    .style('fill', parallel ? 'var(--accent)' : 'var(--bound)')
    .text(
      parallel
        ? localize({ ko: '평행! — 여기가 평균값 점', en: 'parallel! — a mean-value point' }, lang)
        : localize({ ko: 'ξ를 움직여 평행해지는 지점을 찾으세요', en: 'drag ξ until the tangent is parallel' }, lang),
    );
}

export default defineSimpleScene<MVTData>({
  model: mvtModel,
  drawMain,
});
