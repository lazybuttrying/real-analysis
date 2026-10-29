import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { subsequenceModel, type SubsequenceData } from '../models/subsequence';

/**
 * Subsequences, live. The sequence (-1)^n + 1/n is plotted; the
 * selected part (all, even, odd) is drawn in the accent color and the
 * rest fades. The even part gathers at 1, the odd part at -1.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: SubsequenceData, lang: Lang): string {
  if (data.part === 'even') {
    return localize(
      {
        ko: String.raw`짝수 부분수열 \(a_{2k} = 1 + \frac{1}{2k}\) — 1로 모입니다.`,
        en: String.raw`The even subsequence \(a_{2k} = 1 + \frac{1}{2k}\) — gathers at 1.`,
      },
      lang,
    );
  }
  if (data.part === 'odd') {
    return localize(
      {
        ko: String.raw`홀수 부분수열 \(a_{2k-1} = -1 + \frac{1}{2k-1}\) — -1로 모입니다.`,
        en: String.raw`The odd subsequence \(a_{2k-1} = -1 + \frac{1}{2k-1}\) — gathers at -1.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`전체를 보면 두 무리로 갈립니다. 짝수 항은 1 근처, 홀수 항은 -1 근처입니다.`,
      en: String.raw`The whole picture splits into two crowds: even terms near 1, odd terms near -1.`,
    },
    lang,
  );
}

function explainText(_data: SubsequenceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`부분수열은 원래 순서를 지키면서 항을 건너뛰며 뽑은 수열입니다. 번호 \(n_1 < n_2 < \cdots\)를 골라 \(a_{n_k}\)를 이으면 됩니다. 핵심 사실 둘: 원래 수열이 수렴하면 모든 부분수열도 같은 값으로 수렴합니다. 거꾸로, 두 부분수열이 서로 다른 값으로 가면 원래 수열은 수렴할 수 없습니다. 이 그림의 수열이 발산하는 이유가 정확히 그것입니다.`,
      en: String.raw`A subsequence picks terms while keeping their order: choose indices \(n_1 < n_2 < \cdots\) and line up \(a_{n_k}\). Two key facts: if the original sequence converges, every subsequence converges to the same value. And conversely, if two subsequences head to different values, the original cannot converge. That is exactly why the sequence in this picture diverges.`,
    },
    lang,
  );
}

function verdictText(data: SubsequenceData, lang: Lang): string {
  if (data.partLimit === null) {
    return localize(
      {
        ko: String.raw`판정: 부분수열 극한이 1과 -1로 갈리므로 전체 수열은 발산합니다.`,
        en: String.raw`Verdict: the subsequence limits split between 1 and -1, so the whole sequence diverges.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`판정: 이 부분수열은 ${fmt(data.partLimit, 4)}로 수렴합니다.`,
      en: String.raw`Verdict: this subsequence converges to ${fmt(data.partLimit, 4)}.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: SubsequenceData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, data.terms + 1]).range([0, width]);
  const y = scaleLinear().domain([-1.7, 1.7]).range([height, 0]);

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '부분수열: 순서를 지켜 뽑아낸 수열', en: 'Subsequence: terms picked in order' }, lang));

  for (const target of [1, -1]) {
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(data.terms + 1))
      .attr('y1', y(target))
      .attr('y2', y(target))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', 0.7);
  }

  for (const p of data.points) {
    g.append('circle')
      .attr('cx', x(p.n))
      .attr('cy', y(p.value))
      .attr('r', p.selected ? 4 : 3)
      .attr('fill', p.selected ? 'var(--accent)' : 'currentColor')
      .attr('opacity', p.selected ? 1 : 0.3);
  }

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(5));
}

export default defineSimpleScene<SubsequenceData>({
  model: subsequenceModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
