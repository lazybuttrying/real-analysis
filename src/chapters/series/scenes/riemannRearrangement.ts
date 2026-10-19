import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { riemannModel, type RiemannData } from '../models/riemannRearrangement';

/**
 * Riemann's rearrangement theorem, live. The alternating harmonic series —
 * which sums to ln 2 in its natural order — is rebuilt by the greedy block
 * rule: take positives while the running sum is at or below the target,
 * take negatives while it is above. The partial-sum walk is drawn
 * segment by segment, blue for positive takes and red for negative takes,
 * homing in on the dashed target line. The readout reports the final
 * partial sum against the target, the error, and how many terms of each
 * sign were used; the verdict states the theorem's punchline.
 */

const MARGIN = { top: 48, right: 20, bottom: 44, left: 64 };
const POS_COLOR = 'var(--accent)';
const NEG_COLOR = 'var(--bound)';

function readoutText(data: RiemannData, lang: Lang): string {
  const { target, terms, finalSum, error, posUsed, negUsed } = data;
  return localize(
    {
      ko: String.raw`목표 \(s = ${fmt(target, 1)}\), \(N = ${terms}\)개 항: 최종 부분합 \(S_{${terms}} \approx ${fmt(finalSum, 6)}\), 오차 \(\lvert S_N - s \rvert \approx ${fmt(error, 6)}\) — 양항 ${posUsed}개 · 음항 ${negUsed}개 사용.`,
      en: String.raw`Target \(s = ${fmt(target, 1)}\), \(N = ${terms}\) terms: final partial sum \(S_{${terms}} \approx ${fmt(finalSum, 6)}\), error \(\lvert S_N - s \rvert \approx ${fmt(error, 6)}\) — ${posUsed} positive takes, ${negUsed} negative takes.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`이 걸음은 교대조화급수의 진짜 재배열입니다 — 모든 항을 정확히 한 번씩, 다른 순서로 씁니다. 그런데도 원래 합 \(\ln 2\)가 아니라 당신이 고른 목표로 수렴합니다. 리만 정리: 조건수렴 실수 급수는 임의의 실수(또는 \(\pm\infty\))로 재배열할 수 있습니다.`,
      en: String.raw`This walk is a genuine rearrangement of the alternating harmonic series — every term used exactly once, in a different order — yet it homes in on your chosen target instead of \(\ln 2\). Riemann's theorem: any conditionally convergent real series can be rearranged to sum to any real number (or \(\pm\infty\)).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: RiemannData, lang: Lang): void {
  const { g, width, height } = chart;
  const { target, terms, steps, finalSum, error } = data;

  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, Math.max(1, terms)]).range([0, width]);
  const pad = Math.max(0.05, (data.hi - data.lo) * 0.15);
  const y = scaleLinear().domain([data.lo - pad, data.hi + pad]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(6));

  const header = g.append('text').attr('x', 0).attr('y', -28).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
  header.text(
    localize(
      {
        ko: `탐욕 재배열 걸음: 목표 s = ${fmt(target, 1)}를 향해 부분합이 다가갑니다`,
        en: `Greedy rearrangement walk: partial sums homing in on target s = ${fmt(target, 1)}`,
      },
      lang,
    ),
  );

  // Dashed target line.
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(target))
    .attr('y2', y(target))
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6,4')
    .attr('opacity', 0.7);
  g.append('text')
    .attr('x', width - 4)
    .attr('y', y(target) - 8)
    .attr('font-size', 12)
    .attr('text-anchor', 'end')
    .attr('fill', 'currentColor')
    .text(`s = ${fmt(target, 1)}`);

  // The walk, segment by segment: blue where a positive term was taken,
  // red where a negative term was taken. Starts at (0, 0).
  const seg = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  let px = 0;
  let py = 0;
  for (const st of steps) {
    const pts = [
      { x: px, y: py },
      { x: st.step, y: st.sum },
    ];
    g.append('path')
      .datum(pts)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', st.dir === 1 ? POS_COLOR : NEG_COLOR)
      .attr('d', seg);
    px = st.step;
    py = st.sum;
  }

  // Endpoint dot on the final partial sum.
  g.append('circle')
    .attr('cx', x(terms))
    .attr('cy', y(finalSum))
    .attr('r', 4.5)
    .style('fill', error <= 0.01 ? POS_COLOR : NEG_COLOR);

  // Legend.
  g.append('text')
    .attr('x', 8)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', POS_COLOR)
    .text(localize({ ko: '— 양항 취하기', en: '— positive take' }, lang));
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', NEG_COLOR)
    .text(localize({ ko: '— 음항 취하기', en: '— negative take' }, lang));
}

function mountExtra(strips: HTMLElement, lang: Lang): void {
  // Cross-link: the (+,+,-) rearrangement this scene deepens.
  const seeAlso = document.createElement('div');
  seeAlso.style.marginTop = '4px';
  const rearrLink = document.createElement('a');
  rearrLink.href = '../rearrangement/';
  rearrLink.textContent = localize(
    { ko: '재배열 정리 씬 — (+,+,-) 트릭으로 ln 2를 (3/2) ln 2로', en: 'Rearrangement scene — the (+,+,-) trick turning ln 2 into (3/2) ln 2' },
    lang,
  );
  seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), rearrLink);
  strips.append(seeAlso);
}

export default defineSimpleScene<RiemannData>({
  model: riemannModel,
  margin: MARGIN,
  drawMain,
  slots: [{ text: readoutText, bold: true }, { text: (_data, lang) => verdictText(lang), bold: true }],
  mountExtra,
});
