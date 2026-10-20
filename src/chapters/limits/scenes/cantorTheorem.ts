import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  cantorTheoremModel,
  diffColumn,
  type CantorTheoremData,
} from '../models/cantorTheorem';

/**
 * Cantor's theorem, live (Tao, Thm 8.3.1). The n x n table lists n "subsets"
 * of {0, ..., n-1} as 0/1 rows (row i is table[i][j] = (i+j) % 2). The
 * diagonal cells are highlighted in accent; flipping the diagonal gives a
 * new row that differs from row i at column i -- arrows run from each
 * diagonal cell down to the flipped row below the table. The strips record
 * the witnesses row by row and the punchline: the flipped set is none of
 * the listed sets, so no enumeration of "all subsets" can be complete.
 */

const MARGIN = { top: 56, right: 20, bottom: 20, left: 64 };
const CELL = 46;
const GAP = 5;

function witnessText(data: CantorTheoremData, lang: Lang): string {
  const parts: string[] = [];
  for (let i = 0; i < data.n; i++) {
    const j = diffColumn(data.table, data.flipped, i);
    parts.push(
      localize(
        {
          ko: String.raw`row ${fmt(i, 0)}은 column ${fmt(j, 0)}에서 다름`,
          en: String.raw`row ${fmt(i, 0)} differs at column ${fmt(j, 0)}`,
        },
        lang,
      ),
    );
  }
  return parts.join(localize({ ko: ' · ', en: ' · ' }, lang));
}

function readoutText(data: CantorTheoremData, lang: Lang): string {
  const flippedBits = data.flipped.map((b) => fmt(b, 0)).join('');
  const negs: string[] = [];
  for (let i = 0; i < data.n; i++) {
    negs.push(
      localize(
        { ko: String.raw`row ${fmt(i, 0)}이 아님`, en: String.raw`not row ${fmt(i, 0)}` },
        lang,
      ),
    );
  }
  return localize(
    {
      ko: String.raw`뒤집힌 집합 \((${flippedBits})\)은 ${negs.join(', ')} — 목록에 있는 어떤 집합도 아닙니다.`,
      en: String.raw`The flipped set \((${flippedBits})\) is ${negs.join(', ')} — it is none of the listed sets.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`칸토어 정리: 어떤 집합 \(X\)에 대해서도 \(\lvert X \rvert < \lvert\mathcal{P}(X) \rvert\)입니다. \(n\)개의 행으로는 \(2^n\)개의 부분집합을 절대 다 나열할 수 없습니다 — 대각선을 뒤집으면 목록 밖의 집합이 항상 생깁니다.`,
      en: String.raw`Cantor's theorem: for every set \(X\), \(\lvert X \rvert < \lvert\mathcal{P}(X) \rvert\). No list of \(n\) rows can ever cover all \(2^n\) subsets — flipping the diagonal always produces a set off the list.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: CantorTheoremData, lang: Lang): void {
  const { g } = chart;
  g.selectAll('*').remove();

  const n = data.n;
  const left = MARGIN.left;
  const top = 8;
  const step = CELL + GAP;
  const cx = (j: number) => left + j * step + CELL / 2;
  const cy = (i: number) => top + i * step + CELL / 2;

  g.append('text')
    .attr('x', 0)
    .attr('y', -36)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `${fmt(n, 0)}개의 "부분집합"을 0/1 행으로 나열 — 대각선(accent)을 뒤집으면 목록 밖의 행이 생깁니다`,
          en: `${fmt(n, 0)} "subsets" listed as 0/1 rows — flipping the diagonal (accent) yields a row off the list`,
        },
        lang,
      ),
    );

  // Column headers: element j.
  for (let j = 0; j < n; j++) {
    g.append('text')
      .attr('x', cx(j))
      .attr('y', top - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.65)
      .text(fmt(j, 0));
  }

  // The n x n table.
  for (let i = 0; i < n; i++) {
    const row = data.table[i] as number[];
    g.append('text')
      .attr('x', left - 10)
      .attr('y', cy(i) + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize({ ko: `row ${fmt(i, 0)}`, en: `row ${fmt(i, 0)}` }, lang),
      );
    for (let j = 0; j < n; j++) {
      const isDiag = i === j;
      const value = row[j] as number;
      g.append('rect')
        .attr('x', left + j * step)
        .attr('y', top + i * step)
        .attr('width', CELL)
        .attr('height', CELL)
        .attr('rx', 6)
        .attr('fill', value === 1 ? 'var(--accent)' : 'none')
        .attr('fill-opacity', value === 1 ? 0.22 : 0)
        .attr('stroke', isDiag ? 'var(--accent)' : 'currentColor')
        .attr('stroke-opacity', isDiag ? 1 : 0.35)
        .attr('stroke-width', isDiag ? 3 : 1);
      g.append('text')
        .attr('x', cx(j))
        .attr('y', cy(i) + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 15)
        .attr('font-weight', isDiag ? 700 : 400)
        .attr('fill', 'currentColor')
        .text(fmt(value, 0));
    }
  }

  // The flipped row, below the table.
  const flipY = top + n * step + 34;
  const fcy = flipY + CELL / 2;
  g.append('text')
    .attr('x', left - 10)
    .attr('y', fcy + 4)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '뒤집기', en: 'flipped' }, lang));
  for (let j = 0; j < n; j++) {
    g.append('rect')
      .attr('x', left + j * step)
      .attr('y', flipY)
      .attr('width', CELL)
      .attr('height', CELL)
      .attr('rx', 6)
      .attr('fill', 'var(--accent)')
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2);
    g.append('text')
      .attr('x', cx(j))
      .attr('y', fcy + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 15)
      .attr('font-weight', 700)
      .attr('fill', 'currentColor')
      .text(fmt(data.flipped[j] as number, 0));
  }

  // Arrows: from each diagonal cell down to the flipped row.
  // Row i differs from the flipped set at column i.
  const tableBottom = top + n * step;
  for (let i = 0; i < n; i++) {
    const x = cx(i);
    const y1 = tableBottom + 4;
    const y2 = flipY - 4;
    g.append('line')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', y1)
      .attr('y2', y2 - 7)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8);
    g.append('polygon')
      .attr('points', `${x},${y2} ${x - 4},${y2 - 7} ${x + 4},${y2 - 7}`)
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.8);
  }
}

export default defineSimpleScene<CantorTheoremData>({
  model: cantorTheoremModel,
  margin: MARGIN,
  drawMain,
  slots: [
    { text: witnessText },
    { text: readoutText, bold: true, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
  sizeFromData: (data) => ({
    height: 8 + data.n * (CELL + GAP) + 34 + (CELL + GAP) + 44,
  }),
});
