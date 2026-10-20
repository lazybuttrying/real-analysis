import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { volterraModel, type VolterraData, type VolterraSample } from '../models/volterraFunction';

/**
 * Volterra's function, live. The Smith-Volterra-Cantor set is built by
 * deleting middle open intervals of absolute length 4^{-n} at stage n;
 * on each complementary interval (a, b) sits the bump
 * phi(x) = (x-a)^2 (b-x)^2 sin(1/(x-a)), weighted by 2^{-k}.
 * The main chart zooms onto the selected complementary interval: f is
 * the smooth-looking curve (accent), f' the wild one (bound color,
 * thinner) whose oscillation near the left endpoint never dies -- the
 * reason f' is discontinuous at every point of the Cantor set and hence
 * not Riemann integrable, even though f is differentiable everywhere
 * with bounded derivative. The slim overview strip shows f over [0, 1]
 * with the zoomed interval highlighted.
 */

const MARGIN = { top: 48, right: 20, bottom: 44, left: 64 };
const OVER_MARGIN = { top: 30, right: 20, bottom: 26, left: 64 };
const F_COLOR = 'var(--accent)';
const FP_COLOR = 'var(--bound)';

function readoutText(data: VolterraData, lang: Lang): string {
  const { stage, intervals, removedLength, remainingLength, supFp, interval } = data;
  const num = Math.pow(2, stage) - 1;
  const den = Math.pow(2, stage + 1);
  const iv = intervals[interval];
  const ivText = iv ? `(${fmt(iv.a, 4)}, ${fmt(iv.b, 4)})` : '';
  return localize(
    {
      ko: String.raw`단계 \(N = ${stage}\): 여집합 구간 ${intervals.length}개, 제거된 길이 \(\frac{${num}}{${den}} \approx ${fmt(removedLength, 6)}\), 남은 길이 \(\approx ${fmt(remainingLength, 6)}\). 확대 구간 ${ivText} (제거 단계 ${iv?.stage ?? 0}), \(\sup\lvert f' \rvert \approx ${fmt(supFp, 4)}\).`,
      en: String.raw`Stage \(N = ${stage}\): ${intervals.length} complementary intervals, removed length \(\frac{${num}}{${den}} \approx ${fmt(removedLength, 6)}\), remaining length \(\approx ${fmt(remainingLength, 6)}\). Zoomed interval ${ivText} (removed at stage ${iv?.stage ?? 0}), \(\sup\lvert f' \rvert \approx ${fmt(supFp, 4)}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`모든 점에서 미분가능하고 \(f'\)은 유계이지만, \(f'\)은 리만 적분가능하지 않습니다. 미분가능성은 적분가능성을 보장하지 않습니다 — 이것이 볼테라 함수의 펀치라인입니다.`,
      en: String.raw`differentiable everywhere, f' bounded, yet f' not Riemann integrable. Differentiability does not imply integrability — that is Volterra's punchline.`,
    },
    lang,
  );
}

function drawPath(
  g: Chart['g'],
  pts: VolterraSample[],
  x: (v: number) => number,
  y: (v: number) => number,
  getY: (s: VolterraSample) => number,
  color: string,
  width: number,
): void {
  const ln = line<VolterraSample>()
    .x((d) => x(d.x))
    .y((d) => y(getY(d)));
  g.append('path')
    .datum(pts)
    .attr('fill', 'none')
    .attr('stroke-width', width)
    .style('stroke', color)
    .attr('d', ln);
}

// Main chart: zoomed onto the selected complementary interval.
function drawMain(chart: Chart, data: VolterraData, lang: Lang): void {
  const iv = data.intervals[data.interval];
  if (!iv) return;

  const { g, width, height } = chart;
  g.selectAll('*').remove();
  const padX = (iv.b - iv.a) * 0.03;
  const x = scaleLinear()
    .domain([iv.a - padX, iv.b + padX])
    .range([0, width]);
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of data.zoomSamples) {
    if (s.f < lo) lo = s.f;
    if (s.f > hi) hi = s.f;
    if (s.fp < lo) lo = s.fp;
    if (s.fp > hi) hi = s.fp;
  }
  if (!Number.isFinite(lo)) {
    lo = -1;
    hi = 1;
  }
  lo = Math.min(lo, 0);
  hi = Math.max(hi, 0);
  const padY = Math.max(1e-9, (hi - lo) * 0.12);
  const y = scaleLinear().domain([lo - padY, hi + padY]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
  g.append('g').call(axisLeft(y).ticks(6));

  const header = g.append('text').attr('x', 0).attr('y', -28).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
  header.text(
    localize(
      {
        ko: `여집합 구간 (${fmt(iv.a, 4)}, ${fmt(iv.b, 4)}) 확대 — f와 그 도함수 f'`,
        en: `Zoom on complementary interval (${fmt(iv.a, 4)}, ${fmt(iv.b, 4)}): f and its derivative f'`,
      },
      lang,
    ),
  );

  // Zero line for reference: f' oscillates around it without dying.
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1)
    .attr('opacity', 0.35);

  drawPath(g, data.zoomSamples, x, y, (s) => s.f, F_COLOR, 2.5);
  drawPath(g, data.zoomSamples, x, y, (s) => s.fp, FP_COLOR, 1.25);

  g.append('text')
    .attr('x', 8)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', F_COLOR)
    .text(localize({ ko: '— f (범프)', en: '— f (the bump)' }, lang));
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 34)
    .attr('font-size', 12)
    .attr('fill', FP_COLOR)
    .text(localize({ ko: "— f' (죽지 않는 진동)", en: "— f' (the undying oscillation)" }, lang));
}

// Overview strip: f over [0, 1], zoomed interval highlighted.
function drawSecond(chart: Chart, data: VolterraData, lang: Lang): void {
  const iv = data.intervals[data.interval];
  if (!iv) return;

  const { g, width, height } = chart;
  g.selectAll('*').remove();
  const x = scaleLinear().domain([0, 1]).range([0, width]);
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of data.samples) {
    if (s.f < lo) lo = s.f;
    if (s.f > hi) hi = s.f;
  }
  if (!Number.isFinite(lo)) {
    lo = -1;
    hi = 1;
  }
  const padY = Math.max(1e-9, (hi - lo) * 0.15);
  const y = scaleLinear().domain([lo - padY, hi + padY]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(3));

  const label = g.append('text').attr('x', 0).attr('y', -12).attr('font-size', 12).attr('font-weight', 600).attr('fill', 'currentColor');
  label.text(
    localize(
      { ko: '전체 보기 — f (칸토어 집합의 여집합 위의 작은 범프들)', en: 'Full view — f (tiny bumps on the complement of the Cantor set)' },
      lang,
    ),
  );

  g.append('rect')
    .attr('x', x(iv.a))
    .attr('width', Math.max(2, x(iv.b) - x(iv.a)))
    .attr('y', 0)
    .attr('height', height)
    .attr('fill', F_COLOR)
    .attr('opacity', 0.22);
  drawPath(g, data.samples, x, y, (s) => s.f, F_COLOR, 1.5);
}

export default defineSimpleScene<VolterraData>({
  model: volterraModel,
  margin: MARGIN,
  marginSecond: OVER_MARGIN,
  fallbackHeightSecond: 128,
  secondWrapCss: 'flex: none; height: 128px; position: relative;',
  drawMain,
  drawSecond,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true },
  ],
  mountExtra: (strips, lang) => {
    // Cross-link: the Riemann integral scene this one pushes against.
    const seeAlso = document.createElement('div');
    seeAlso.style.marginTop = '4px';
    const riemannLink = document.createElement('a');
    riemannLink.href = '../riemann/';
    riemannLink.textContent = localize(
      { ko: '리만 적분 씬 — 적분가능성의 경계', en: 'Riemann integral scene — the boundary of integrability' },
      lang,
    );
    seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), riemannLink);
    strips.append(seeAlso);
  },
});
