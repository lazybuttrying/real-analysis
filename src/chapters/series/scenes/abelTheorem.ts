import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { abelTheoremModel, type AbelData } from '../models/abelTheorem';

/**
 * Abel's theorem, live. Main chart: the partial sum S_N(x) (accent, bold)
 * against the closed-form power-series sum (muted, dashed) as a function of
 * x in [0, 0.99); a marker rides the x slider toward 1, and the closed-form
 * curve visibly homes in on the Abel sum (open circle at x = 1).
 *
 * Contrast panel: the same partial sums at x = 1. For Grandi they bounce
 * 1, 0, 1, 0, ... forever -- the series DIVERGES, so 1/2 is only the Abel
 * sum, never "the sum". For the alternating harmonic series they settle to
 * ln 2 -- where Abel's theorem agrees with the ordinary convergent sum.
 */

const MAIN_MARGIN = { top: 16, right: 20, bottom: 40, left: 60 };
const SIDE_MARGIN = { top: 40, right: 20, bottom: 30, left: 60 };
const GOLD = '#d9930d';

/**
 * The title and guide lines live in above-chart HTML slots, not in the SVG:
 * the formula needs real TeX rendering, which SVG text cannot do (the old
 * SVG header printed the pseudo-TeX string raw).
 */
function seriesTitle(series: AbelData['series'], lang: Lang): string {
  return localize(
    {
      ko:
        series === 'grandi'
          ? String.raw`\(S_N(x) = \sum_{n=0}^{N} (-1)^n x^n \to \frac{1}{1+x}\)`
          : String.raw`\(S_N(x) = \sum_{n=0}^{N} (-1)^n \frac{x^{n+1}}{n+1} \to \ln(1+x)\)`,
      en:
        series === 'grandi'
          ? String.raw`\(S_N(x) = \sum_{n=0}^{N} (-1)^n x^n \to \frac{1}{1+x}\)`
          : String.raw`\(S_N(x) = \sum_{n=0}^{N} (-1)^n \frac{x^{n+1}}{n+1} \to \ln(1+x)\)`,
    },
    lang,
  );
}

function guideText(data: AbelData, lang: Lang): string {
  const sum = data.series === 'grandi' ? String.raw`\(1/2\)` : String.raw`\(\ln 2 \approx 0.6931\)`;
  return localize(
    {
      ko: String.raw`x 슬라이더를 1 쪽으로 — 닫힌식 곡선이 Abel 합 ${sum}에 다가갑니다 (열린 원: \(x = 1\)에서의 한계점)`,
      en: String.raw`drag x toward 1 — the closed-form curve homes in on the Abel sum ${sum} (open circle: the limiting point at \(x = 1\))`,
    },
    lang,
  );
}

function factsText(data: AbelData, lang: Lang): string {
  const { x, n, partialAtX, atX, tailBound, abelLimit, series } = data;
  const abelLabel = series === 'grandi' ? '1/2' : '\\ln 2';
  return localize(
    {
      ko: String.raw`\(x=${fmt(x, 2)}\), \(N=${n}\): 부분합 \(S_{${n}}(${fmt(x, 2)}) = ${fmt(partialAtX)}\) vs 닫힌식 \(f(${fmt(x, 2)}) = ${fmt(atX)}\) — 간격 \(\le ${fmt(tailBound)}\). \(x \to 1^{-}\)에서 닫힌식은 Abel 합 \(=${abelLabel} \approx ${fmt(abelLimit)}\)으로.`,
      en: String.raw`\(x=${fmt(x, 2)}\), \(N=${n}\): partial sum \(S_{${n}}(${fmt(x, 2)}) = ${fmt(partialAtX)}\) vs closed form \(f(${fmt(x, 2)}) = ${fmt(atX)}\) — gap \(\le ${fmt(tailBound)}\). As \(x \to 1^{-}\) the closed form homes in on the Abel sum \(=${abelLabel} \approx ${fmt(abelLimit)}\).`,
    },
    lang,
  );
}

function verdictText(data: AbelData, lang: Lang): string {
  const { series } = data;
  return localize(
    series === 'grandi'
      ? {
          ko: String.raw`아벨 정리: \(\sum a_n\)이 \(S\)로 수렴하면 \(\lim_{x \to 1^{-}} \sum a_n x^n = S\). 그란디 급수 \(1-1+1-\cdots\) 자체는 발산합니다 — \(1/2\)는 급수의 "합"이 아니라 Abel 합(그리고 체사로 합)일 뿐입니다. 자세한 내용은 그란디 장면의 부분합을 보세요.`,
          en: String.raw`Abel's theorem: if \(\sum a_n\) converges to \(S\), then \(\lim_{x \to 1^{-}} \sum a_n x^n = S\). Grandi's series \(1-1+1-\cdots\) itself diverges — \(1/2\) is the Abel sum (and the Cesàro sum), never "the sum" of the series. Compare the oscillating partial sums in the Grandi scene.`,
        }
      : {
          ko: String.raw`아벨 정리: \(\sum a_n\)이 \(S\)로 수렴하면 \(\lim_{x \to 1^{-}} \sum a_n x^n = S\). 이 급수는 보통의 의미로도 \(\ln 2\)에 수렴하므로, Abel 합은 보통 합과 일치합니다 — Abel 합은 수렴과 모순되지 않고 확장만 합니다.`,
          en: String.raw`Abel's theorem: if \(\sum a_n\) converges to \(S\), then \(\lim_{x \to 1^{-}} \sum a_n x^n = S\). This series also converges to \(\ln 2\) in the ordinary sense, so the Abel sum agrees with the usual sum — Abel summation extends convergence, never contradicts it.`,
        },
    lang,
  );
}

function drawMain(chart: Chart, data: AbelData, lang: Lang): void {
  const { g, width, height } = chart;
  const { x, n, xs, partial, limit, abelLimit } = data;

  g.selectAll('*').remove();

  const xScale = scaleLinear().domain([0, 1]).range([0, width]);

  let yMin = Math.min(abelLimit, ...partial, ...limit);
  let yMax = Math.max(abelLimit, ...partial, ...limit);
  const span = yMax - yMin || 0.1;
  yMin -= span * 0.12;
  yMax += span * 0.12;
  const y = scaleLinear().domain([yMin, yMax]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(xScale).ticks(6));
  g.append('g').call(axisLeft(y).ticks(6));

  const curve = (values: number[]) =>
    line<number>()
      .x((_, i) => xScale(xs[i] ?? 0))
      .y((v) => y(v))(values);

  // Closed-form infinite sum, dashed and muted: the target.
  g.append('path')
    .attr('d', curve(limit) ?? '')
    .attr('fill', 'none')
    .attr('stroke-dasharray', '7 5')
    .attr('stroke-width', 2)
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.55);

  // The Abel-sum level: horizontal dashed line + open circle at x = 1.
  g.append('line')
    .attr('x1', xScale(0))
    .attr('x2', xScale(1))
    .attr('y1', y(abelLimit))
    .attr('y2', y(abelLimit))
    .attr('stroke-dasharray', '5 4')
    .attr('stroke-width', 1.5)
    .style('stroke', 'var(--muted)');
  g.append('circle')
    .attr('cx', xScale(1))
    .attr('cy', y(abelLimit))
    .attr('r', 6)
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--muted)');
  g.append('text')
    .attr('x', xScale(1) - 12)
    .attr('y', y(abelLimit) - 10)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .style('fill', 'var(--muted)')
    .text(
      localize(
        {
          ko: `Abel 합 = ${data.series === 'grandi' ? '1/2' : 'ln 2 ≈ 0.6931'}`,
          en: `Abel sum = ${data.series === 'grandi' ? '1/2' : 'ln 2 ≈ 0.6931'}`,
        },
        lang,
      ),
    );

  // Partial sum S_N, bold accent: the curve the slider's N tightens.
  g.append('path')
    .attr('d', curve(partial) ?? '')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)');

  // Vertical marker at the slider x, with dots on both curves.
  g.append('line')
    .attr('x1', xScale(x))
    .attr('x2', xScale(x))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke-dasharray', '3 3')
    .attr('stroke-width', 1.5)
    .style('stroke', 'var(--accent)')
    .attr('opacity', 0.6);
  g.append('circle')
    .attr('cx', xScale(x))
    .attr('cy', y(data.partialAtX))
    .attr('r', 5)
    .style('fill', 'var(--accent)');
  g.append('circle')
    .attr('cx', xScale(x))
    .attr('cy', y(data.atX))
    .attr('r', 4)
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke', 'currentColor');

  g.append('text')
    .attr('x', 8)
    .attr('y', height + 32)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: `■ S_${n}(x) 부분합`, en: `■ S_${n}(x) partial sum` }, lang));
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 32)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.6)
    .text(
      localize(
        {
          ko: `┄ 닫힌식 ${data.series === 'grandi' ? '1/(1+x)' : 'ln(1+x)'} · 점선 = Abel 합`,
          en: `┄ closed form ${data.series === 'grandi' ? '1/(1+x)' : 'ln(1+x)'} · dotted = Abel sum`,
        },
        lang,
      ),
    );
}

function drawSecond(chart: Chart, data: AbelData, lang: Lang): void {
  const { g, width, height } = chart;
  const { sideK, sideSums, abelLimit, series } = data;

  g.selectAll('*').remove();

  const xScale = scaleLinear().domain([0, sideK.length - 1]).range([0, width]);
  let yMin = Math.min(abelLimit, ...sideSums);
  let yMax = Math.max(abelLimit, ...sideSums);
  const span = yMax - yMin || 0.1;
  yMin -= span * 0.15;
  yMax += span * 0.15;
  const y = scaleLinear().domain([yMin, yMax]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(xScale).ticks(6));
  g.append('g').call(axisLeft(y).ticks(4));

  g.append('text')
    .attr('x', 0)
    .attr('y', -22)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        series === 'grandi'
          ? { ko: '대비: x = 1에서의 부분합 — 영원히 진동, 발산', en: 'contrast: partial sums at x = 1 — oscillating forever, divergent' }
          : { ko: '대비: x = 1에서의 부분합 — ln 2로 수렴 (Abel 합과 일치)', en: 'contrast: partial sums at x = 1 — converging to ln 2 (matches the Abel sum)' },
        lang,
      ),
    );

  // Abel-sum / ordinary-sum level for reference.
  g.append('line')
    .attr('x1', xScale(0))
    .attr('x2', xScale(sideK.length - 1))
    .attr('y1', y(abelLimit))
    .attr('y2', y(abelLimit))
    .attr('stroke-dasharray', '5 4')
    .attr('stroke-width', 1.5)
    .style('stroke', 'var(--muted)');

  const zig = line<{ k: number; v: number }>()
    .x((p) => xScale(p.k))
    .y((p) => y(p.v));
  g.append('path')
    .attr('d', zig(sideSums.map((v, k) => ({ k, v }))) ?? '')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke', GOLD);

  sideSums.forEach((v, k) => {
    g.append('circle').attr('cx', xScale(k)).attr('cy', y(v)).attr('r', 3.5).attr('fill', GOLD);
  });
}

export default defineSimpleScene<AbelData>({
  model: abelTheoremModel,
  margin: MAIN_MARGIN,
  marginSecond: SIDE_MARGIN,
  fallbackHeightSecond: 210,
  mainWrapCss: 'flex: 1 1 auto; min-height: 0; position: relative;',
  secondWrapCss: 'flex: none; height: 210px; position: relative;',
  drawMain,
  drawSecond,
  slotsAbove: [
    { text: (data, lang) => seriesTitle(data.series, lang), cssText: 'padding: 8px 12px 0; font-size: 15px; font-weight: 600; flex: none;' },
    { text: guideText, cssText: 'padding: 2px 12px 0; font-size: 12px; opacity: 0.75; flex: none;' },
  ],
  slots: [
    { text: factsText, bold: true },
    { text: verdictText, bold: true },
  ],
});
