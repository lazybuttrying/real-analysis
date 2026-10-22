import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang, type LocalizedText } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  connectedModel,
  RATIONAL_CUT,
  type ConnectedData,
  type Interval,
} from '../models/connected';

/**
 * Connected sets, live. A number line shows the space X (accent bar),
 * the candidate open sets U (accent, upper row) and V (red, middle row),
 * and a dashed marker at the cut point. A separation needs four things
 * at once: U and V cover X, they are disjoint on X, and both meet X.
 * The badges track the first three verdicts; the [0, 1] case fails at
 * every cut, the two-piece space separates exactly for cuts strictly
 * between the pieces, and Q ∩ [0, 1] separates at the irrational cut
 * sqrt(2) / 2 because no rational sits on the cut.
 */

const MARGIN = { top: 72, right: 24, bottom: 52, left: 40 };

const CASE_TEXT: Record<string, { title: LocalizedText; explain: LocalizedText }> = {
  interval: {
    title: {
      ko: 'X = [0, 1], U = (-0.2, t), V = (t, 1.2) — 하나의 구간은 갈라지지 않습니다',
      en: 'X = [0, 1], U = (-0.2, t), V = (t, 1.2) — one interval never splits',
    },
    explain: {
      ko: String.raw`\(t\)를 어디에 두어도 이 시도는 실패합니다. \(0 \le t \le 1\)이면 절단점 \(t\) 자체가 \(X\)의 점인데 \(U\)에도 \(V\)에도 속하지 않아 덮지 못합니다. \(t < 0\)이면 \(U \cap X = \emptyset\)이고, \(t > 1\)이면 \(V \cap X = \emptyset\)입니다. 사실 \([0,1]\)은 어떤 열린 쌍으로도 분리할 수 없습니다 — 그것이 연결집합이라는 뜻이며, 문제 1이 supremum 논법으로 증명합니다.`,
      en: String.raw`Wherever \(t\) sits, this attempt fails. If \(0 \le t \le 1\), the cut point \(t\) itself lies in \(X\) but in neither \(U\) nor \(V\), so the pair does not cover. If \(t < 0\) then \(U \cap X = \emptyset\); if \(t > 1\) then \(V \cap X = \emptyset\). In fact no open pair separates \([0,1]\) at all — that is what connected means, and Problem 1 proves it with the supremum argument.`,
    },
  },
  'two-pieces': {
    title: {
      ko: 'X = [0, 1] ∪ [2, 3], U = (-0.2, t), V = (t, 3.2) — 틈 사이에서는 갈라집니다',
      en: 'X = [0, 1] ∪ [2, 3], U = (-0.2, t), V = (t, 3.2) — the gap separates',
    },
    explain: {
      ko: String.raw`절단이 틈 \(1 < t < 2\) 안에 떨어지면 \(U \cap X = [0,1]\), \(V \cap X = [2,3]\)이 되어 네 조건이 모두 성립합니다 — 분리 성공, \(X\)는 연결집합이 아닙니다. 절단이 한 조각 안 (\(0 \le t \le 1\) 또는 \(2 \le t \le 3\))에 떨어지면 그 절단점이 덮이지 않고, 절단이 바깥에 있으면 한쪽이 비어 버립니다. 끝점 \(t = 1\)과 \(t = 2\)에서도 점 \(1\) (또는 \(2\))이 어느 열린 쪽에도 속하지 않아 실패합니다.`,
      en: String.raw`When the cut falls in the gap, \(1 < t < 2\), we get \(U \cap X = [0,1]\) and \(V \cap X = [2,3]\): all four conditions hold — a separation, so \(X\) is disconnected. When the cut falls inside a piece (\(0 \le t \le 1\) or \(2 \le t \le 3\)), that cut point is left uncovered; outside the pieces, one side comes up empty. The endpoints \(t = 1\) and \(t = 2\) fail too: the point \(1\) (or \(2\)) belongs to neither open side.`,
    },
  },
  rationals: {
    title: {
      ko: 'X = ℚ ∩ [0, 1], 절단 c = √2/2 — 무리수 절단이 유리수를 가릅니다',
      en: 'X = ℚ ∩ [0, 1], cut c = √2/2 — an irrational cut splits the rationals',
    },
    explain: {
      ko: String.raw`절단 \(c = \sqrt{2}/2 \approx 0.7071\)은 무리수라서 \(X\)의 어떤 점과도 겹치지 않습니다. 그래서 \(U = \{q \in X : q < c\}\)와 \(V = \{q \in X : q > c\}\)는 \(X\)에서 열려 있고, 서로소이며, 합치면 \(X\) 전체를 덮습니다 — \(\mathbb{Q} \cap [0,1]\)은 연결집합이 아닙니다. 유리수 절단이었다면 그 절단점이 덮이지 않아 실패했을 것입니다. 사실 두 점 이상을 가진 \(\mathbb{Q}\)의 모든 부분집합이 이렇게 갈라집니다 (완전 비연결, 문제 3). \(t\) 슬라이더는 이 경우에 쓰이지 않습니다.`,
      en: String.raw`The cut \(c = \sqrt{2}/2 \approx 0.7071\) is irrational, so it coincides with no point of \(X\). Hence \(U = \{q \in X : q < c\}\) and \(V = \{q \in X : q > c\}\) are open in \(X\), disjoint, and together cover \(X\) — \(\mathbb{Q} \cap [0,1]\) is disconnected. A rational cut would have failed, its own point left uncovered. In fact every subset of \(\mathbb{Q}\) with at least two points splits this way (totally disconnected, Problem 3). The \(t\) slider is unused in this case.`,
    },
  },
};

function yesNo(v: boolean, lang: Lang): string {
  return v ? localize({ ko: '예', en: 'YES' }, lang) : localize({ ko: '아니오', en: 'NO' }, lang);
}

function fmtInterval(iv: Interval): string {
  const lo = Number.isFinite(iv.lo) ? fmt(iv.lo, 2) : String.raw`-\infty`;
  const hi = Number.isFinite(iv.hi) ? fmt(iv.hi, 2) : String.raw`\infty`;
  if (iv.lo === iv.hi && !iv.loOpen && !iv.hiOpen) return `{${lo}}`;
  return `${iv.loOpen ? '(' : '['}${lo}, ${hi}${iv.hiOpen ? ')' : ']'}`;
}

function fmtPieces(pieces: readonly Interval[]): string {
  return pieces.length === 0 ? String.raw`\emptyset` : pieces.map(fmtInterval).join(', ');
}

function reasonText(data: ConnectedData, lang: Lang): string {
  if (data.caseId === 'rationals') {
    return localize(
      {
        ko: String.raw`절단점이 \(X\)에 없어서 네 조건이 모두 성립합니다.`,
        en: String.raw`The cut point is missing from \(X\), so all four conditions hold.`,
      },
      lang,
    );
  }
  switch (data.failure) {
    case 'u-empty':
      return localize(
        {
          ko: String.raw`\(U \cap X = \emptyset\)입니다 — \(U\)가 \(X\)와 만나지 않습니다.`,
          en: String.raw`\(U \cap X = \emptyset\) — \(U\) does not meet \(X\) at all.`,
        },
        lang,
      );
    case 'v-empty':
      return localize(
        {
          ko: String.raw`\(V \cap X = \emptyset\)입니다 — \(V\)가 \(X\)와 만나지 않습니다.`,
          en: String.raw`\(V \cap X = \emptyset\) — \(V\) does not meet \(X\) at all.`,
        },
        lang,
      );
    case 'not-covered':
      return localize(
        {
          ko: String.raw`점 \(x = ${data.uncovered === null ? '' : fmt(data.uncovered, 2)}\)가 \(X\)에 있지만 \(U \cup V\)에 없습니다 — 덮지 못합니다.`,
          en: String.raw`The point \(x = ${data.uncovered === null ? '' : fmt(data.uncovered, 2)}\) lies in \(X\) but outside \(U \cup V\) — the pair does not cover.`,
        },
        lang,
      );
    case 'overlap':
      return localize(
        {
          ko: String.raw`\(U\)와 \(V\)가 \(X\) 위에서 겹칩니다.`,
          en: String.raw`\(U\) and \(V\) overlap on \(X\).`,
        },
        lang,
      );
    default:
      return localize(
        {
          ko: String.raw`네 조건이 모두 성립합니다.`,
          en: String.raw`All four conditions hold.`,
        },
        lang,
      );
  }
}

function readoutText(data: ConnectedData, lang: Lang): string {
  if (data.caseId === 'rationals') {
    return localize(
      {
        ko: String.raw`\(c = \sqrt{2}/2 \approx ${fmt(RATIONAL_CUT, 4)} \notin \mathbb{Q}\): \(U \cap X = [0, c) \cap \mathbb{Q}\), \(V \cap X = (c, 1] \cap \mathbb{Q}\). 덮음 ${yesNo(data.covered, lang)}, 서로소 ${yesNo(data.disjointOnX, lang)}, 양쪽 모두 만남 ${yesNo(data.uMeetsX && data.vMeetsX, lang)}.`,
        en: String.raw`\(c = \sqrt{2}/2 \approx ${fmt(RATIONAL_CUT, 4)} \notin \mathbb{Q}\): \(U \cap X = [0, c) \cap \mathbb{Q}\), \(V \cap X = (c, 1] \cap \mathbb{Q}\). Covered ${yesNo(data.covered, lang)}, disjoint ${yesNo(data.disjointOnX, lang)}, both sides meet \(X\) ${yesNo(data.uMeetsX && data.vMeetsX, lang)}.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(t = ${fmt(data.t, 2)}\): \(U \cap X = ${fmtPieces(data.uOnX)}\), \(V \cap X = ${fmtPieces(data.vOnX)}\). 덮음 ${yesNo(data.covered, lang)}, 서로소 ${yesNo(data.disjointOnX, lang)}, \(U\) 만남 ${yesNo(data.uMeetsX, lang)}, \(V\) 만남 ${yesNo(data.vMeetsX, lang)}.`,
      en: String.raw`\(t = ${fmt(data.t, 2)}\): \(U \cap X = ${fmtPieces(data.uOnX)}\), \(V \cap X = ${fmtPieces(data.vOnX)}\). Covered ${yesNo(data.covered, lang)}, disjoint ${yesNo(data.disjointOnX, lang)}, \(U\) meets \(X\) ${yesNo(data.uMeetsX, lang)}, \(V\) meets \(X\) ${yesNo(data.vMeetsX, lang)}.`,
    },
    lang,
  );
}

function explainText(data: ConnectedData, lang: Lang): string {
  const t = CASE_TEXT[data.caseId];
  return t ? localize(t.explain, lang) : '';
}

function verdictText(data: ConnectedData, lang: Lang): string {
  const reason = reasonText(data, lang);
  return data.separated
    ? localize(
        {
          ko: String.raw`판정: 분리 성공 — \(U, V\)가 \(X\)의 분리이므로 \(X\)는 연결집합이 아닙니다. ${reason}`,
          en: String.raw`Verdict: separated — \(U, V\) form a separation of \(X\), so \(X\) is disconnected. ${reason}`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`판정: 분리 실패 — 이 쌍은 \(X\)의 분리가 아닙니다. ${reason}`,
          en: String.raw`Verdict: not a separation — this pair does not separate \(X\). ${reason}`,
        },
        lang,
      );
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

function drawMain(chart: Chart, data: ConnectedData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([data.domLo, data.domHi]).range([0, width]);
  const mid = height / 2 + 24;
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
  badge(-52, localize({ ko: '덮음', en: 'covered' }, lang), data.covered, false);
  badge(
    -34,
    localize({ ko: '서로소', en: 'disjoint' }, lang),
    data.disjointOnX,
    false,
  );
  badge(
    -16,
    localize({ ko: '분리됨', en: 'separated' }, lang),
    data.separated,
    true,
  );

  // Baseline.
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', mid)
    .attr('y2', mid)
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.3);

  // U (accent, upper row) and V (red, middle row), as ambient extents.
  const [ux0, ux1] = barSpan(x, width, data.uInterval);
  drawBar(g, ux0, ux1, mid - 66, 13, 'var(--accent)', 0.8);
  const [vx0, vx1] = barSpan(x, width, data.vInterval);
  drawBar(g, vx0, vx1, mid - 40, 13, '#d64545', 0.8);

  // The space X (accent bar on the baseline row).
  for (const iv of data.xPieces) {
    const [x0, x1] = barSpan(x, width, iv);
    drawBar(g, x0, x1, mid - 7, 14, 'var(--accent)', 0.45);
  }

  // Endpoint markers on X: hollow ring = open end, filled dot = closed end.
  for (const iv of data.xPieces) {
    const ends = [
      { v: iv.lo, open: iv.loOpen },
      { v: iv.hi, open: iv.hiOpen },
    ];
    for (const e of ends) {
      if (!Number.isFinite(e.v)) continue;
      g.append('circle')
        .attr('cx', x(e.v))
        .attr('cy', mid)
        .attr('r', 5)
        .attr('fill', e.open ? 'none' : 'currentColor')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2);
    }
  }

  // Rationals: dots along X suggest the dense rational points.
  if (data.caseId === 'rationals') {
    for (let q = 1; q <= 12; q++) {
      for (let p = 0; p <= q; p++) {
        g.append('circle')
          .attr('cx', x(p / q))
          .attr('cy', mid)
          .attr('r', 2)
          .attr('fill', 'currentColor')
          .attr('opacity', 0.85);
      }
    }
  }

  // Row labels.
  const rowLabel = (y: number, text: string): void => {
    g.append('text')
      .attr('x', 0)
      .attr('y', y)
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(text);
  };
  rowLabel(mid - 70, 'U');
  rowLabel(mid - 44, 'V');
  rowLabel(mid - 11, 'X');

  // The cut marker.
  const cx = x(data.cut);
  g.append('line')
    .attr('x1', cx)
    .attr('x2', cx)
    .attr('y1', mid - 72)
    .attr('y2', mid + 16)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4 3');
  g.append('text')
    .attr('x', cx)
    .attr('y', mid + 32)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(
      data.caseId === 'rationals' ? `c = ${fmt(data.cut, 4)}` : `t = ${fmt(data.t, 2)}`,
    );

  // The uncovered witness, when the pair fails to cover.
  if (data.uncovered !== null) {
    g.append('circle')
      .attr('cx', x(data.uncovered))
      .attr('cy', mid)
      .attr('r', 7)
      .attr('fill', 'none')
      .attr('stroke', '#d64545')
      .attr('stroke-width', 2);
  }

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
          ko: '위 행 = U, 가운데 행 = V, 아래 행 = X, 점선 = 절단점, 빨간 원 = 덮이지 않은 점',
          en: 'top row = U, middle row = V, bottom row = X, dashed line = cut point, red ring = uncovered point',
        },
        lang,
      ),
    );
}

export default defineSimpleScene<ConnectedData>({
  model: connectedModel,
  margin: MARGIN,
  fallbackHeight: 320,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
