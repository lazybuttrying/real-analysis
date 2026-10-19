import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang, type LocalizedText } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { clopenModel, type ClopenData, type Interval } from '../models/clopen';

/**
 * Clopen sets, live. A number line shows the ambient space X (gray) and the
 * set A (accent); hollow/filled dots mark open/closed endpoints. A test
 * point x with an eps-ball probes openness relative to X: the ball is green
 * when (x - eps, x + eps) ∩ X ⊆ A and red when it escapes. Verdict badges
 * report open/closed in X, and CLOPEN lights up when both hold.
 */

const MARGIN = { top: 72, right: 24, bottom: 52, left: 40 };

const CASE_TEXT: Record<string, { title: LocalizedText; explain: LocalizedText }> = {
  'open-interval': {
    title: { ko: 'X = ℝ, A = (0, 1) — 열린 구간', en: 'X = ℝ, A = (0, 1) — open interval' },
    explain: {
      ko: String.raw`\(A = (0,1)\)의 모든 점 \(x\)는 \((x-\varepsilon, x+\varepsilon) \subseteq A\)인 \(\varepsilon > 0\)을 가집니다 — \(X = \mathbb{R}\)에서 열려 있습니다. 그러나 \(0\)과 \(1\)은 \(A\)의 극한점이면서 \(A\)에 속하지 않으므로, \(A\)는 닫혀 있지 않습니다.`,
      en: String.raw`Every \(x \in A = (0,1)\) admits \(\varepsilon > 0\) with \((x-\varepsilon, x+\varepsilon) \subseteq A\) — open in \(X = \mathbb{R}\). But \(0\) and \(1\) are limit points of \(A\) missing from \(A\), so it is not closed.`,
    },
  },
  'closed-interval': {
    title: { ko: 'X = ℝ, A = [0, 1] — 닫힌 구간', en: 'X = ℝ, A = [0, 1] — closed interval' },
    explain: {
      ko: String.raw`\(A = [0,1]\)은 자신의 극한점을 모두 포함하므로 \(X = \mathbb{R}\)에서 닫혀 있습니다. 그러나 경계점 \(0\) (또는 \(1\))에서는 어떤 \(\varepsilon\)-공도 \(A\)를 벗어나므로 열려 있지 않습니다 — 아래 \(x\)를 \(0\) 근처로 옮겨 확인해 보세요.`,
      en: String.raw`\(A = [0,1]\) contains all its limit points, so it is closed in \(X = \mathbb{R}\). But at the boundary point \(0\) (or \(1\)) every \(\varepsilon\)-ball escapes \(A\), so it is not open — slide \(x\) near \(0\) below to see it.`,
    },
  },
  'clopen-pieces': {
    title: {
      ko: 'X = [0, 1] ∪ [2, 3], A = [0, 1] — 부분공간에서는 clopen!',
      en: 'X = [0, 1] ∪ [2, 3], A = [0, 1] — clopen in the subspace!',
    },
    explain: {
      ko: String.raw`\(A = X \cap (-1/2,\, 3/2)\)이므로 \(X\)에서 열려 있고, \(A = X \cap [-1/2,\, 3/2]\)이므로 \(X\)에서 닫혀 있습니다 — \(X\)의 clopen 집합입니다. 그런데 \(\mathbb{R}\)에서는 점 \(1\)의 어떤 공도 \((1, 1+\varepsilon)\)을 포함하므로 열려 있지 않습니다. clopen은 ambient에 상대적인 개념입니다.`,
      en: String.raw`\(A = X \cap (-1/2,\, 3/2)\), so it is open in \(X\); and \(A = X \cap [-1/2,\, 3/2]\), so it is closed in \(X\) — clopen in \(X\). Yet in \(\mathbb{R}\) every ball around \(1\) contains \((1, 1+\varepsilon)\), so it is not open there. Clopenness is relative to the ambient space.`,
    },
  },
  'clopen-gap': {
    title: {
      ko: 'X = (0, 1) ∪ (1, 2), A = (0, 1) — 틈새가 갈라놓은 clopen',
      en: 'X = (0, 1) ∪ (1, 2), A = (0, 1) — clopen across the gap',
    },
    explain: {
      ko: String.raw`\(A = X \cap (0,\, 3/2)\)이므로 \(X\)에서 열려 있고, \(A = X \cap [0,\, 3/2]\)이므로 (\(1 \notin X\)) \(X\)에서 닫혀 있습니다 — \(X\)의 clopen 집합입니다. \(\mathbb{R}\)에서는 열린 구간이므로 열려 있지만, 극한점 \(1\)이 빠져 닫혀 있지는 않습니다.`,
      en: String.raw`\(A = X \cap (0,\, 3/2)\), so it is open in \(X\); and \(A = X \cap [0,\, 3/2]\) (since \(1 \notin X\)), so it is closed in \(X\) — clopen in \(X\). In \(\mathbb{R}\) it is an open interval, hence open, but the missing limit point \(1\) keeps it from being closed.`,
    },
  },
};

function yesNo(v: boolean, lang: Lang): string {
  return v ? localize({ ko: '예', en: 'YES' }, lang) : localize({ ko: '아니오', en: 'NO' }, lang);
}

function readoutText(data: ClopenData, lang: Lang): string {
  if (!data.inA) {
    return localize(
      {
        ko: String.raw`\(x = ${fmt(data.x, 2)}\)가 \(A\)에 속하지 않습니다 — 탐침이 \(A\) 안에 있을 때만 \(\varepsilon\)-공 검사가 의미가 있습니다.`,
        en: String.raw`\(x = ${fmt(data.x, 2)}\) is not in \(A\) — the \(\varepsilon\)-ball test is meaningful only with the probe inside \(A\).`,
      },
      lang,
    );
  }
  return data.ballStaysInA
    ? localize(
        {
          ko: String.raw`\(\checkmark\) \((x-\varepsilon, x+\varepsilon) \cap X \subseteq A\): 반지름 \(\varepsilon = ${fmt(data.eps, 2)}\)인 공이 \(X\) 기준으로 \(A\) 안에 머뭅니다 (\(x = ${fmt(data.x, 2)}\)).`,
          en: String.raw`\(\checkmark\) \((x-\varepsilon, x+\varepsilon) \cap X \subseteq A\): the ball of radius \(\varepsilon = ${fmt(data.eps, 2)}\) stays inside \(A\) relative to \(X\) (\(x = ${fmt(data.x, 2)}\)).`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`\(\times\) \((x-\varepsilon, x+\varepsilon) \cap X \not\subseteq A\): 반지름 \(\varepsilon = ${fmt(data.eps, 2)}\)인 공이 \(X\) 안에서 \(A\)를 벗어납니다 (\(x = ${fmt(data.x, 2)}\)). \(\varepsilon\)을 줄여 보세요.`,
          en: String.raw`\(\times\) \((x-\varepsilon, x+\varepsilon) \cap X \not\subseteq A\): the ball of radius \(\varepsilon = ${fmt(data.eps, 2)}\) escapes \(A\) inside \(X\) (\(x = ${fmt(data.x, 2)}\)). Try shrinking \(\varepsilon\).`,
        },
        lang,
      );
}

function explainText(data: ClopenData, lang: Lang): string {
  const t = CASE_TEXT[data.caseId];
  return t ? localize(t.explain, lang) : '';
}

function verdictText(data: ClopenData, lang: Lang): string {
  const verdict = data.clopenInX
    ? localize(
        {
          ko: String.raw`판정: \(A\)는 \(X\)에서 열려 있고 닫혀 있습니다 — \(X\)의 clopen 집합입니다. \(\mathbb{R}\)에서는 열림 ${yesNo(data.openInR, lang)}, 닫힘 ${yesNo(data.closedInR, lang)}.`,
          en: String.raw`Verdict: \(A\) is open and closed in \(X\) — a clopen set of \(X\). In \(\mathbb{R}\): open ${yesNo(data.openInR, lang)}, closed ${yesNo(data.closedInR, lang)}.`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`판정: \(A\)는 \(X\)에서 clopen이 아닙니다 (열림 ${yesNo(data.openInX, lang)}, 닫힘 ${yesNo(data.closedInX, lang)}). \(\mathbb{R}\)에서는 열림 ${yesNo(data.openInR, lang)}, 닫힘 ${yesNo(data.closedInR, lang)}.`,
          en: String.raw`Verdict: \(A\) is not clopen in \(X\) (open ${yesNo(data.openInX, lang)}, closed ${yesNo(data.closedInX, lang)}). In \(\mathbb{R}\): open ${yesNo(data.openInR, lang)}, closed ${yesNo(data.closedInR, lang)}.`,
        },
        lang,
      );
  return verdict;
}

const drawBar = (
  g: Chart['g'],
  x0: number,
  x1: number,
  y: number,
  h: number,
  fill: string,
  opacity: number,
): void => {
  g.append('rect')
    .attr('x', x0)
    .attr('width', Math.max(0, x1 - x0))
    .attr('y', y)
    .attr('height', h)
    .attr('fill', fill)
    .attr('opacity', opacity);
};

const barSpan = (
  x: (v: number) => number,
  width: number,
  iv: Interval,
): [number, number] => [
  Number.isFinite(iv.lo) ? x(iv.lo) : 0,
  Number.isFinite(iv.hi) ? x(iv.hi) : width,
];

function drawMain(chart: Chart, data: ClopenData, lang: Lang): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const x = scaleLinear().domain([data.domLo, data.domHi]).range([0, width]);
    const mid = height / 2 + 12;
    const caseText = CASE_TEXT[data.caseId];

    g.append('text')
      .attr('x', 0)
      .attr('y', -52)
      .attr('font-size', 14)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(caseText ? localize(caseText.title, lang) : data.caseId);

    // Verdict badges, top right.
    const badge = (dy: number, label: string, v: boolean, accent: boolean): void => {
      g.append('text')
        .attr('x', width)
        .attr('y', dy)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', accent ? 700 : 600)
        .attr('fill', accent ? 'var(--accent)' : 'currentColor')
        .text(`${label}: ${yesNo(v, lang)}`);
    };
    badge(
      -52,
      localize({ ko: 'X에서 열림', en: 'open in X' }, lang),
      data.openInX,
      false,
    );
    badge(
      -34,
      localize({ ko: 'X에서 닫힘', en: 'closed in X' }, lang),
      data.closedInX,
      false,
    );
    if (data.clopenInX) {
      g.append('text')
        .attr('x', width)
        .attr('y', -12)
        .attr('text-anchor', 'end')
        .attr('font-size', 15)
        .attr('font-weight', 800)
        .attr('fill', 'var(--accent)')
        .text(localize({ ko: 'X에서 CLOPEN!', en: 'CLOPEN in X!' }, lang));
    }

    // Baseline.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', mid)
      .attr('y2', mid)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.3);

    // Ambient X (gray) and A (accent).
    for (const iv of data.ambient) {
      const [x0, x1] = barSpan(x, width, iv);
      drawBar(g, x0, x1, mid - 7, 14, 'currentColor', 0.22);
    }
    for (const iv of data.setA) {
      const [x0, x1] = barSpan(x, width, iv);
      drawBar(g, x0, x1, mid - 36, 14, 'var(--accent)', 0.85);
    }

    // Endpoint markers on A: hollow ring = open end, filled dot = closed end.
    for (const iv of data.setA) {
      const ends = [
        { v: iv.lo, open: iv.loOpen },
        { v: iv.hi, open: iv.hiOpen },
      ];
      for (const e of ends) {
        if (!Number.isFinite(e.v)) continue;
        g.append('circle')
          .attr('cx', x(e.v))
          .attr('cy', mid - 29)
          .attr('r', 5)
          .attr('fill', e.open ? 'none' : 'currentColor')
          .attr('stroke', 'currentColor')
          .attr('stroke-width', 2);
      }
    }

    // The eps-ball around the test point.
    const bx0 = x(data.x - data.eps);
    const bx1 = x(data.x + data.eps);
    g.append('rect')
      .attr('x', bx0)
      .attr('width', Math.max(0, bx1 - bx0))
      .attr('y', mid - 50)
      .attr('height', 78)
      .attr('fill', !data.inA ? 'currentColor' : data.ballStaysInA ? 'var(--accent)' : '#d64545')
      .attr('opacity', 0.16);

    // Test point probe.
    const px = x(data.x);
    g.append('line')
      .attr('x1', px)
      .attr('x2', px)
      .attr('y1', mid - 50)
      .attr('y2', mid + 18)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', data.inA ? 'none' : '4 3');
    g.append('circle')
      .attr('cx', px)
      .attr('cy', mid - 29)
      .attr('r', 4)
      .attr('fill', 'currentColor');

    g.append('text')
      .attr('x', px)
      .attr('y', mid + 34)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`x = ${fmt(data.x, 2)}`);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));

    g.append('text')
      .attr('x', 0)
      .attr('y', height + 36)
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(
        localize(
          {
            ko: '회색 = ambient X, 색 막대 = A, 빈 동그라미 = 열린 끝점, 찬 동그라미 = 닫힌 끝점',
            en: 'gray = ambient X, colored bar = A, hollow ring = open endpoint, filled dot = closed endpoint',
          },
          lang,
        ),
      );
}

export default defineSimpleScene<ClopenData>({
  model: clopenModel,
  margin: MARGIN,
  fallbackHeight: 320,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true }
  ],
});
