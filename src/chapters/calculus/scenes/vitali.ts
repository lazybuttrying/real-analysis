import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  vitaliModel,
  VITALI_DRAW_MIN,
  VITALI_DRAW_MAX,
  type VitaliData,
} from '../models/vitali';

/**
 * The Vitali non-measurable set, illustrated honestly. V itself has no
 * formula (AC chooses representatives without describing them), so V
 * cannot be drawn. The panel draws a finite mock instead: a mock
 * representative set (accent dots in [0,1]) and its translates by the
 * rationals with denominator at most d (bound dots), all inside [-1,2].
 * Sliding d grows the rational family; the readout runs the counting
 * argument: m(V) > 0 forces an infinite total inside the length-3
 * container, m(V) = 0 forces total 0 below the length-1 lower bound —
 * so no measure is possible.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

function readoutText(data: VitaliData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`분모 \(\le ${data.d}\)인 유리수 \({data.rationalCount}\)개: \(V\)가 가측이고 \(m(V) = m > 0\)이면, 서로 겹치지 않는 평행이동들의 측도 합은 \(\sum m = \infty\) — 길이 \(3\)인 \([-1, 2]\) 안에 들어갈 수 없습니다. \(m = 0\)이면 합이 \(0\) — 길이 \(1\)인 \([0, 1]\)을 덮을 수 없습니다. 어떤 \(m\)도 불가능합니다.`,
      en: String.raw`${data.rationalCount} rationals with denominator \(\le ${data.d}\): if \(V\) were measurable with \(m(V) = m > 0\), the disjoint translates would have total measure \(\sum m = \infty\) — impossible inside the length-\(3\) container \([-1, 2]\). If \(m = 0\) the total is \(0\) — impossible against the length-\(1\) lower bound \([0, 1]\). No \(m\) works.`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`진짜 \(V\)는 그릴 수 없습니다 — 선택공리는 각 유리수-차이 동치류에서 대표원 하나를 '고른다'고만 할 뿐, 그 공식을 주지 않습니다. 위 그림은 유한 모형입니다: \([0,1]\) 안의 점들(모형 대표원 집합)과, 그것을 유리수만큼 평행이동한 점들입니다. \(d\)를 키우면 유리수 가족이 늘어나고, 셈 논증의 모순이 선명해집니다 (아래 문제 1–3).`,
      en: String.raw`The real \(V\) cannot be drawn — the axiom of choice only says to 'choose' one representative per rational-difference class, giving no formula. The picture is a finite mock: dots in \([0,1]\) (a mock representative set) and their rational translates. Raising \(d\) grows the rational family and sharpens the counting contradiction (problems 1–3 below).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`선택공리는 대표원을 고르는 데 정확히 한 번 쓰였고, 그 결과 르베그 가측이 아닌 집합 \(V\)가 존재합니다 — 가측성은 '모든 부분집합'에 성립하지 않습니다.`,
      en: String.raw`The axiom of choice is used exactly once — to choose the representatives — and out comes a set \(V\) that is not Lebesgue measurable: measurability does not extend to 'every subset'.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: VitaliData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: `비탈리 집합: 평행이동 구조 (유한 모형)`, en: `Vitali set: translate structure (finite mock)` },
        lang,
      ),
    );

  const x = scaleLinear().domain([VITALI_DRAW_MIN, VITALI_DRAW_MAX]).range([0, width]);
  const midY = height / 2;

  // The container [-1, 2] as a bracket.
  g.append('rect')
    .attr('x', x(VITALI_DRAW_MIN))
    .attr('y', midY - 46)
    .attr('width', x(VITALI_DRAW_MAX) - x(VITALI_DRAW_MIN))
    .attr('height', 92)
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.55);

  // The [0, 1] band that the union must cover.
  g.append('rect')
    .attr('x', x(0))
    .attr('y', midY - 30)
    .attr('width', x(1) - x(0))
    .attr('height', 60)
    .attr('fill', 'var(--accent)')
    .attr('opacity', 0.18);
  g.append('text')
    .attr('x', x(0.5))
    .attr('y', midY + 44)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '[0, 1] — 길이 1 (합집합이 덮어야 하는 구간)', en: '[0, 1] — length 1 (interval the union must cover)' }, lang));

  // Mock translate dots, one row per rational, stacked vertically.
  const n = data.translates.length;
  const rowStep = n > 1 ? Math.min(64 / (n - 1), 12) : 0;
  data.translates.forEach((tr, i) => {
    const yy = midY - ((n - 1) / 2) * rowStep + i * rowStep;
    const isZero = Math.abs(tr.q) < 1e-12;
    for (const pt of tr.points) {
      g.append('circle')
        .attr('cx', x(pt))
        .attr('cy', yy)
        .attr('r', isZero ? 3.4 : 2.2)
        .attr('fill', isZero ? 'var(--accent)' : 'var(--bound)')
        .attr('opacity', isZero ? 0.95 : 0.55);
    }
  });

  // Label the q = 0 row as the mock representative set (below the dots).
  g.append('text')
    .attr('x', width)
    .attr('y', midY + 58)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'var(--accent)')
    .text(localize({ ko: '진한 점 = 모형 대표원 집합 (q = 0 행)', en: 'dark dots = mock representative set (q = 0 row)' }, lang));

  g.append('g').attr('transform', `translate(0,${height - 6})`).call(axisBottom(x).ticks(7));
}

export default defineSimpleScene<VitaliData>({
  model: vitaliModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => explainText(lang), spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
});
