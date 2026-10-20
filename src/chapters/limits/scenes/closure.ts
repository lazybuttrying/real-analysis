import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { mountNote } from '../../../view/richslot';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { closureModel, type ClosureData, type ClosureKind } from '../models/closure';

/**
 * Closure and boundedness: the set A in blue, the limit points the closure
 * adds in red, and the bounding interval [-m, m] as a gray band.
 * The round-song: closed <=> contains its limit points <=> equals its closure.
 */

function closureText(kind: ClosureKind, lang: Lang): string {
  switch (kind) {
    case 'open':
      return localize(
        {
          ko: String.raw`\(\overline{(0,1)} = [0,1]\) — 빨간 점 \(0\)과 \(1\)이 추가됩니다.`,
          en: String.raw`\(\overline{(0,1)} = [0,1]\) — the red dots \(0\) and \(1\) are added.`,
        },
        lang,
      );
    case 'halfclosed':
      return localize(
        {
          ko: String.raw`\(\overline{(0,1]} = [0,1]\) — 빨간 점 \(0\)이 추가됩니다.`,
          en: String.raw`\(\overline{(0,1]} = [0,1]\) — the red dot \(0\) is added.`,
        },
        lang,
      );
    case 'reciprocal':
      return localize(
        {
          ko: String.raw`\(\overline{\{1/n\}} = \{1/n\} \cup \{0\}\) — 빨간 점 \(0\)이 추가됩니다.`,
          en: String.raw`\(\overline{\{1/n\}} = \{1/n\} \cup \{0\}\) — the red dot \(0\) is added.`,
        },
        lang,
      );
  }
}

function verdictText(data: ClosureData, lang: Lang): string {
  const { m, boundedByM } = data;
  const closedMark = localize({ ko: '닫힘 X', en: 'not closed' }, lang);
  if (boundedByM) {
    return localize(
      {
        ko: String.raw`${closedMark} · \(A \subseteq [${fmt(-m)}, ${fmt(m)}]\) 이므로 유계 O`,
        en: String.raw`${closedMark} · \(A \subseteq [${fmt(-m)}, ${fmt(m)}]\), so bounded: yes`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`${closedMark} · \([${fmt(-m)}, ${fmt(m)}]\)이 \(A\)를 담지 못합니다 — \(m\)을 키우세요.`,
      en: String.raw`${closedMark} · \([${fmt(-m)}, ${fmt(m)}]\) does not contain \(A\) — increase \(m\).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: ClosureData): void {
    const { g, width, height } = chart;
    const { kind, m, closureExtras, terms } = data;

    const xScale = scaleLinear().domain([-2.6, 2.6]).range([0, width]);
    const yMid = height / 2;

    g.selectAll('*').remove();

    // Bounding interval [-m, m] as a gray band.
    g.append('rect')
      .attr('x', xScale(-m))
      .attr('width', Math.max(0, xScale(m) - xScale(-m)))
      .attr('y', yMid - 34)
      .attr('height', 68)
      .attr('fill', 'var(--muted)')
      .attr('opacity', 0.14);

    // Baseline.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yMid)
      .attr('y2', yMid)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.35);

    // The set A in blue.
    if (kind === 'reciprocal') {
      for (const t of terms) {
        g.append('circle').attr('cx', xScale(t)).attr('cy', yMid).attr('r', 3.5).attr('fill', 'var(--accent)');
      }
    } else {
      g.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(1))
        .attr('y1', yMid)
        .attr('y2', yMid)
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 8)
        .attr('stroke-linecap', 'round');
      const endpoint = (cx: number, included: boolean): void => {
        g.append('circle')
          .attr('cx', xScale(cx))
          .attr('cy', yMid)
          .attr('r', 6)
          .attr('fill', included ? 'var(--accent)' : 'var(--bg)')
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2.5);
      };
      endpoint(0, false);
      endpoint(1, kind === 'halfclosed');
    }

    // Limit points added by the closure, in red.
    for (const c of closureExtras) {
      g.append('circle')
        .attr('cx', xScale(c))
        .attr('cy', yMid)
        .attr('r', 6)
        .attr('fill', 'var(--bound)')
        .attr('stroke', 'var(--bound)');
    }

    // Bracket ticks for [-m, m].
    for (const edge of [-m, m]) {
      g.append('line')
        .attr('x1', xScale(edge))
        .attr('x2', xScale(edge))
        .attr('y1', yMid - 40)
        .attr('y2', yMid + 40)
        .attr('stroke', 'var(--muted)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 3');
    }

    g.append('g').attr('transform', `translate(0,${height - 8})`).call(axisBottom(xScale).ticks(10));
}

export default defineSimpleScene<ClosureData>({
  model: closureModel,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: (data, lang) => closureText(data.kind, lang), bold: true },
    { text: verdictText, bold: true }
  ],
  mountExtra: (strips, lang) => {
    mountNote(
      strips,
      localize(
        {
          ko: String.raw`파란색 = 집합 \(A\), 빨간 점 = 폐포가 추가한 극한점, 회색 띠 = \([-M, M]\)`,
          en: String.raw`blue = the set \(A\), red dots = limit points added by the closure, gray band = \([-M, M]\)`,
        },
        lang,
      ),
    );
  },
});
