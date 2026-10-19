import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { rearrangementModel, type RearrangementData } from '../models/rearrangement';

// Two partial-sum walks side by side: the original order settles onto ln 2
// while the (+,+,-) rearrangement settles onto (3/2) ln 2. Dashed lines mark
// the two limits; the caption records the general p/q formula as a known result.

const MARGIN = { top: 72, right: 20, bottom: 44, left: 56 };

function drawMain(chart: Chart, data: RearrangementData, lang: Lang): void {
  const { g, width, height } = chart;
  const { n, original, rearranged, origLimit, rearrLimit } = data;
  const lastOriginal = original[n - 1] ?? origLimit;
  const lastRearranged = rearranged[n - 1] ?? rearrLimit;

  const all = [...original, ...rearranged, origLimit, rearrLimit];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo) * 0.12 || 0.05;

  const x = scaleLinear().domain([1, n]).range([0, width]);
  const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

  const curve = line<number>()
    .x((_, i) => x(i + 1))
    .y((v) => y(v));

  g.selectAll('*').remove();

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(6));

  g.append('text')
    .attr('x', 0)
    .attr('y', -48)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `원래 합 S_n = ${fmt(lastOriginal, 7)} → ln 2 ≈ 0.6931 · 재배열 합 T_n = ${fmt(lastRearranged, 7)} → (3/2) ln 2 ≈ 1.0397`,
          en: `original S_n = ${fmt(lastOriginal, 7)} → ln 2 ≈ 0.6931 · rearranged T_n = ${fmt(lastRearranged, 7)} → (3/2) ln 2 ≈ 1.0397`,
        },
        lang,
      ),
    );

  // Limit lines.
  g.append('line')
    .attr('x1', x(1))
    .attr('x2', x(n))
    .attr('y1', y(origLimit))
    .attr('y2', y(origLimit))
    .attr('stroke-dasharray', '6 4')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--accent)');
  g.append('text')
    .attr('x', x(n) - 4)
    .attr('y', y(origLimit) - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'var(--accent)')
    .text('ln 2');
  g.append('line')
    .attr('x1', x(1))
    .attr('x2', x(n))
    .attr('y1', y(rearrLimit))
    .attr('y2', y(rearrLimit))
    .attr('stroke-dasharray', '6 4')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)');
  g.append('text')
    .attr('x', x(n) - 4)
    .attr('y', y(rearrLimit) - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'var(--bound)')
    .text('(3/2) ln 2');

  // The two partial-sum curves.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', curve(original) ?? '');
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--bound)')
    .attr('d', curve(rearranged) ?? '');

  // Legend.
  g.append('text')
    .attr('x', 8)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', 'var(--accent)')
    .text(localize({ ko: '— 원래 순서 (ln 2로 수렴)', en: '— original order (→ ln 2)' }, lang));
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', 'var(--bound)')
    .text(localize({ ko: '— (+,+,-) 재배열 ((3/2) ln 2로 수렴)', en: '— (+,+,-) rearrangement (→ (3/2) ln 2)' }, lang));

  // General formula, stated as a known result.
  g.append('text')
    .attr('x', 0)
    .attr('y', -26)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.75)
    .text(
      localize(
        {
          ko: '일반 형태(알려진 결과): p개 양항과 q개 음항을 반복하면 ln 2 + (1/2)·ln(p/q) — 증명은 생략',
          en: 'general form (known result): repeating p positive and q negative terms gives ln 2 + (1/2)·ln(p/q) — proof omitted',
        },
        lang,
      ),
    );
}

export default defineSimpleScene<RearrangementData>({ model: rearrangementModel, margin: MARGIN, drawMain });
