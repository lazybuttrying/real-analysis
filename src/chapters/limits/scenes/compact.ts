import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { compactModel, type CompactData, type CompactKind } from '../models/compact';

/**
 * Compact sets through finite subcovers of open covers.
 *
 * The scene draws the set as a bold line on a number line and the open
 * cover as stacked interval rows above it. The `step` slider picks the
 * first k intervals; selected rows light up and the covered part of the
 * set is overlaid in the accent color. The uncovered remainder (if any)
 * is drawn in the bound color:
 *   [0,1]   -> at step 6 the whole bar is covered (finite subcover works),
 *   (0,1]   -> a red gap (0, 1/k] shrinks toward the missing point 0,
 *   [0,inf) -> a red tail [k, inf) escapes to the right forever.
 */

const MARGIN = { top: 76, right: 20, bottom: 44, left: 44 };

function kindName(kind: CompactKind, lang: Lang): string {
  if (kind === 'closed') return lang === 'ko' ? '[0,1] (닫힘·유계)' : '[0,1] (closed, bounded)';
  if (kind === 'halfopen') return lang === 'ko' ? '(0,1] (닫히지 않음)' : '(0,1] (not closed)';
  return lang === 'ko' ? '[0,∞) (유계가 아님)' : '[0,∞) (not bounded)';
}

function headerText(kind: CompactKind, lang: Lang): string {
  return localize(
    {
      ko: `열린 커버의 처음 k개를 고르면 — ${kindName(kind, 'ko')}`,
      en: `take the first k intervals of the open cover — ${kindName(kind, 'en')}`,
    },
    lang,
  );
}

function subheaderText(data: CompactData, lang: Lang): string {
  const { intervals, shown } = data;
  return localize(
    {
      ko: `커버: ${intervals.length}개의 열린구간, 선택된 ${shown}개의 합집합이 집합을 덮는가?`,
      en: `cover: ${intervals.length} open intervals — does the union of the first ${shown} cover the set?`,
    },
    lang,
  );
}

function verdictText(data: CompactData, lang: Lang): string {
  const { kind, shown, union, coversAll, tailLo } = data;
  if (kind === 'closed') {
    if (shown === 0) {
      return localize(
        { ko: String.raw`구간을 하나도 고르지 않았습니다 — \(k\)를 키워 보세요.`, en: String.raw`no intervals selected yet — raise \(k\).` },
        lang,
      );
    }
    const hi = union ? union.hi.toFixed(2) : '?';
    if (coversAll) {
      return localize(
        {
          ko: String.raw`\(k = ${shown}\): 처음 ${shown}개 구간의 합집합 \([{-0.18}, ${hi}]\)가 \([0,1]\)을 덮습니다 — 유한 부분커버 존재 ✓ (닫힘 + 유계 = 컴팩트)`,
          en: String.raw`\(k = ${shown}\): the union \([{-0.18}, ${hi}]\) of the first ${shown} intervals covers \([0,1]\) — a finite subcover exists ✓ (closed + bounded = compact)`,
        },
        lang,
      );
    }
    return localize(
      {
        ko: String.raw`\(k = ${shown}\): 합집합 \([{-0.18}, ${hi}]\)는 \([0,1]\)을 아직 다 덮지 못합니다 — \(k = 6\)이면 성공합니다.`,
        en: String.raw`\(k = ${shown}\): the union \([{-0.18}, ${hi}]\) does not yet cover \([0,1]\) — it succeeds at \(k = 6\).`,
        },
        lang,
      );
  }
  if (kind === 'halfopen') {
    if (shown === 0) {
      return localize(
        { ko: String.raw`구간을 하나도 고르지 않았습니다 — \(k\)를 키워 보세요.`, en: String.raw`no intervals selected yet — raise \(k\).` },
        lang,
      );
    }
    return localize(
      {
        ko: String.raw`\(k = ${shown}\): 처음 ${shown}개 구간의 합집합은 \((1/${shown}, 2)\) — 남은 틈 \((0, 1/${shown}]\)은 절대 메워지지 않습니다. 틈이 닫히는 곳 \(0\)은 집합에 없습니다 ✗`,
        en: String.raw`\(k = ${shown}\): the union of the first ${shown} intervals is \((1/${shown}, 2)\) — the leftover gap \((0, 1/${shown}]\) never closes. The point \(0\) where it would close is missing from the set ✗`,
      },
      lang,
    );
  }
  // unbounded
  if (shown === 0) {
    return localize(
      { ko: String.raw`구간을 하나도 고르지 않았습니다 — \(k\)를 키워 보세요.`, en: String.raw`no intervals selected yet — raise \(k\).` },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(k = ${shown}\): 처음 ${shown}개 구간의 합집합은 \((-1, ${tailLo ?? shown})\) — 꼬리 \([${tailLo ?? shown}, \infty)\)는 절대 메워지지 않습니다. 무한대에서는 유한 커버가 소용없습니다 ✗`,
      en: String.raw`\(k = ${shown}\): the union of the first ${shown} intervals is \((-1, ${tailLo ?? shown})\) — the tail \([${tailLo ?? shown}, \infty)\) never closes. A finite cover is helpless against infinity ✗`,
    },
    lang,
  );
}

function legendText(kind: CompactKind, lang: Lang): string {
  if (kind === 'closed') {
    return localize(
      {
        ko: String.raw`컴팩트 ⟺ 닫힘 + 유계 (하이네–보렐). \([0,1]\)의 열린 커버에서 처음 6개만 골라도 전체를 덮습니다.`,
        en: String.raw`Compact ⟺ closed + bounded (Heine–Borel). From this open cover of \([0,1]\), the first 6 intervals already cover everything.`,
      },
      lang,
    );
  }
  if (kind === 'halfopen') {
    return localize(
      {
        ko: String.raw`열린 커버의 정의는 아이디어 수준에서: 모든 열린 커버가 유한 부분커버를 가져야 컴팩트. \((0,1]\)은 0 근처의 구멍 때문에 실패합니다.`,
        en: String.raw`The open-cover definition, at the idea level: compact needs every open cover to have a finite subcover. \((0,1]\) fails at the hole near 0.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\([0,\infty)\)는 닫혀 있지만 유계가 아닙니다 — 커버가 아무리 커져도 무한대의 꼬리는 남습니다.`,
      en: String.raw`\([0,\infty)\) is closed but not bounded — however far the cover reaches, the infinite tail remains.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: CompactData, lang: Lang): void {
    const { g, width, height } = chart;
    const { kind, intervals, shown, union, coversAll, gapHi, tailLo, xLo, xHi, setLo, setHi } = data;

    g.selectAll('*').remove();

    const x = scaleLinear().domain([xLo, xHi]).range([0, width]);

    const header1 = g.append('text').attr('x', 0).attr('y', -58).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
    const header2 = g.append('text').attr('x', 0).attr('y', -36).attr('font-size', 12).attr('fill', 'currentColor').attr('opacity', 0.75);
    header1.text(headerText(kind, lang));
    header2.text(subheaderText(data, lang));

    const nRows = intervals.length;
    const axisY = height - 8;
    const setY = axisY - 52;
    const rowsTop = 4;
    const rowsBottom = setY - 34;
    const rowH = nRows > 0 ? (rowsBottom - rowsTop) / nRows : 0;

    // The open cover: one row per interval. Selected rows glow.
    for (let i = 0; i < nRows; i++) {
      const iv = intervals[i];
      if (!iv) continue;
      const y = rowsTop + (i + 0.5) * rowH;
      const selected = i < shown;
      const x1 = Math.max(x(iv.lo), 0);
      const x2 = Math.min(x(iv.hi), width);
      if (x2 > x1) {
        g.append('line')
          .attr('x1', x1)
          .attr('x2', x2)
          .attr('y1', y)
          .attr('y2', y)
          .attr('stroke-width', selected ? 12 : 8)
          .attr('stroke-linecap', 'round')
          .style('stroke', selected ? 'var(--accent)' : 'currentColor')
          .attr('opacity', selected ? 1 : 0.22);
      }
      g.append('text')
        .attr('x', -8)
        .attr('y', y + 4)
        .attr('text-anchor', 'end')
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .attr('opacity', selected ? 1 : 0.4)
        .text(`U${i + 1}`);
    }

    // The set itself: a bold line with endpoint markers.
    const drawSetX1 = x(setLo);
    const drawSetX2 = kind === 'unbounded' ? x(xHi) - 14 : x(setHi);
    g.append('line')
      .attr('x1', drawSetX1)
      .attr('x2', drawSetX2)
      .attr('y1', setY)
      .attr('y2', setY)
      .attr('stroke-width', 10)
      .attr('stroke-linecap', kind === 'unbounded' ? 'butt' : 'round')
      .attr('stroke', 'currentColor');

    // Covered part of the set, in the accent color; the uncovered remainder
    // (gap or tail) in the bound color.
    if (kind === 'closed' && shown > 0 && union) {
      const cx1 = Math.max(x(setLo), x(union.lo));
      const cx2 = Math.min(x(setHi), x(union.hi));
      if (cx2 > cx1) {
        g.append('line')
          .attr('x1', cx1)
          .attr('x2', cx2)
          .attr('y1', setY)
          .attr('y2', setY)
          .attr('stroke-width', 10)
          .attr('stroke-linecap', 'round')
          .style('stroke', 'var(--accent)');
      }
      if (coversAll) {
        g.append('text')
          .attr('x', x(0.5))
          .attr('y', setY - 18)
          .attr('text-anchor', 'middle')
          .attr('font-size', 15)
          .attr('font-weight', 700)
          .style('fill', 'var(--accent)')
          .text('✓');
      }
    } else if (kind === 'halfopen' && shown > 0 && gapHi !== null) {
      const gapX1 = x(0);
      const gapX2 = x(gapHi);
      // The gap (0, 1/k]: red, because it can never be covered.
      g.append('line')
        .attr('x1', gapX1)
        .attr('x2', gapX2)
        .attr('y1', setY)
        .attr('y2', setY)
        .attr('stroke-width', 10)
        .attr('stroke-linecap', 'butt')
        .style('stroke', 'var(--bound)');
      // The covered rest: accent.
      g.append('line')
        .attr('x1', gapX2)
        .attr('x2', x(1))
        .attr('y1', setY)
        .attr('y2', setY)
        .attr('stroke-width', 10)
        .attr('stroke-linecap', 'round')
        .style('stroke', 'var(--accent)');
      g.append('text')
        .attr('x', x(gapHi / 2))
        .attr('y', setY - 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .style('fill', 'var(--bound)')
        .text(`(0, 1/${shown}]`);
      g.append('text')
        .attr('x', x(0))
        .attr('y', setY + 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .style('fill', 'var(--bound)')
        .text(localize({ ko: '0 ∉ 집합', en: '0 ∉ set' }, lang));
    } else if (kind === 'unbounded' && shown > 0 && tailLo !== null) {
      const tailX = x(tailLo);
      // The covered initial segment: accent.
      g.append('line')
        .attr('x1', x(0))
        .attr('x2', Math.min(tailX, drawSetX2))
        .attr('y1', setY)
        .attr('y2', setY)
        .attr('stroke-width', 10)
        .attr('stroke-linecap', 'butt')
        .style('stroke', 'var(--accent)');
      // The uncovered tail [k, inf): red, with an arrowhead.
      g.append('line')
        .attr('x1', Math.min(tailX, drawSetX2))
        .attr('x2', drawSetX2)
        .attr('y1', setY)
        .attr('y2', setY)
        .attr('stroke-width', 10)
        .attr('stroke-linecap', 'butt')
        .style('stroke', 'var(--bound)');
      const ax = drawSetX2;
      g.append('polygon')
        .attr('points', `${ax},${setY - 8} ${ax},${setY + 8} ${ax + 14},${setY}`)
        .style('fill', 'var(--bound)');
      g.append('text')
        .attr('x', Math.min(tailX + (drawSetX2 - tailX) / 2, width - 30))
        .attr('y', setY - 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .style('fill', 'var(--bound)')
        .text(`[${tailLo}, ∞)`);
    }

    // Endpoint markers: filled = included, hollow = missing.
    const endpoints: { px: number; filled: boolean }[] =
      kind === 'unbounded'
        ? [{ px: x(0), filled: true }]
        : [
            { px: x(0), filled: kind === 'closed' },
            { px: x(1), filled: true },
          ];
    for (const ep of endpoints) {
      g.append('circle')
        .attr('cx', ep.px)
        .attr('cy', setY)
        .attr('r', 6)
        .attr('fill', ep.filled ? 'currentColor' : 'var(--bg)')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2.5);
    }

    g.append('g').attr('transform', `translate(0,${axisY})`).call(axisBottom(x).ticks(6));
}

export default defineSimpleScene<CompactData>({
  model: compactModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: (data, lang) => legendText(data.kind, lang), cssText: 'font-size: 12px; color: var(--muted);' },
    { text: verdictText, bold: true }
  ],
});
