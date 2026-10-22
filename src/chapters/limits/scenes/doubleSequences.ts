import { localize, type Lang, type LocalizedText } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  doubleSequencesModel,
  type DoubleExampleId,
  type DoubleSequencesData,
} from '../models/doubleSequences';

/**
 * Double sequences, live. The K x K heatmap shows a_{m,n}: rows are
 * fixed m (the limit as n -> infinity is read off at the right), columns
 * are fixed n (the limit as m -> infinity is read off at the bottom).
 * Negative values take the bound hue. The diagonal m = n is outlined:
 * its limit is a third, independent witness -- if the values along the
 * diagonal refuse to approach a candidate L, no double limit exists.
 * The strips compare the two iterated limits with the Pringsheim
 * double limit, which exists in only one of the four examples.
 */

const MARGIN = { top: 64, right: 118, bottom: 64, left: 56 };
const GAP = 3;

const EXAMPLE_TEXT: Record<
  DoubleExampleId,
  { title: LocalizedText; formula: string; explain: LocalizedText }
> = {
  ratio: {
    title: {
      ko: 'a(m,n) = m/(m+n) — 반복극한이 서로 다릅니다',
      en: 'a(m,n) = m/(m+n) — the iterated limits disagree',
    },
    formula: 'm/(m+n)',
    explain: {
      ko: String.raw`행을 고정하면 \(n\)이 커질수록 분모만 자라서 값이 \(0\)으로 갑니다. 열을 고정하면 \(m\)이 자라면서 값이 \(1\)에 붙습니다. 대각선에서는 늘 \(\frac{1}{2}\)입니다. 세 방향이 세 답을 내므로 이중극한은 없습니다.`,
      en: String.raw`Fix a row and the values sink to \(0\) as \(n\) grows: only the denominator grows. Fix a column and the values climb to \(1\) as \(m\) grows. Along the diagonal the value is constantly \(\frac{1}{2}\). Three directions, three answers — no double limit.`,
    },
  },
  difference: {
    title: {
      ko: 'a(m,n) = (m−n)/(m+n) — 부호까지 갈립니다',
      en: 'a(m,n) = (m−n)/(m+n) — even the sign splits',
    },
    formula: '(m−n)/(m+n)',
    explain: {
      ko: String.raw`행 방향 극한은 \(-1\), 열 방향 극한은 \(1\)입니다. 대각선에서는 정확히 \(0\)입니다. 반복극한이 부호까지 다르면 이중극한은 있을 수 없습니다.`,
      en: String.raw`The row limits are \(-1\) and the column limits are \(1\). On the diagonal the value is exactly \(0\). When the iterated limits differ even in sign, a double limit is impossible.`,
    },
  },
  product: {
    title: {
      ko: 'a(m,n) = mn/(m²+n²) — 반복극한이 같아도 속지 마세요',
      en: 'a(m,n) = mn/(m²+n²) — equal iterated limits can still deceive',
    },
    formula: 'mn/(m²+n²)',
    explain: {
      ko: String.raw`이번에는 행 극한도 열 극한도 모두 \(0\)이라 반복극한이 양쪽 다 \(0\)으로 일치합니다. 그런데 대각선 값은 늘 \(\frac{1}{2}\)입니다. 이중극한이 있었다면 대각선 극한도 같아야 하므로, 이중극한은 없습니다.`,
      en: String.raw`This time every row limit and every column limit is \(0\), so both iterated limits agree at \(0\). But the diagonal value is constantly \(\frac{1}{2}\). A double limit would force the diagonal to the same value — so there is none.`,
    },
  },
  vanishing: {
    title: {
      ko: 'a(m,n) = (−1)ⁿ/m — 이중극한은 있는데 반복극한이 없습니다',
      en: 'a(m,n) = (−1)ⁿ/m — a double limit with a missing iterated limit',
    },
    formula: '(−1)ⁿ/m',
    explain: {
      ko: String.raw`값의 절댓값은 \(\frac{1}{m}\)이라, 행 번호만 크면 \(n\)과 무관하게 \(0\)에 붙습니다: 이중극한은 \(0\)입니다. 그런데 한 행 안에서는 \(n\)이 커져도 \(\pm\frac{1}{m}\) 진동이 영원히 멈추지 않아, 그 방향의 안쪽 극한 자체가 없습니다.`,
      en: String.raw`The absolute value is \(\frac{1}{m}\), so once the row index is large the values cling to \(0\) whatever \(n\) does: the double limit is \(0\). But inside one row the oscillation \(\pm\frac{1}{m}\) never settles as \(n\) grows, so the inner limit in that direction does not exist at all.`,
    },
  },
};

function fmtLimit(v: number | null, lang: Lang): string {
  return v === null ? localize({ ko: '없음', en: 'none' }, lang) : fmt(v, 2);
}

function readoutText(data: DoubleSequencesData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`반복극한: \(\lim_m \lim_n a_{m,n} = ${fmtLimit(data.iteratedNFirst, lang)}\), \(\lim_n \lim_m a_{m,n} = ${fmtLimit(data.iteratedMFirst, lang)}\). 이중극한: ${data.doubleLimit === null ? '없음' : fmt(data.doubleLimit, 2)}. 대각선 \(a_{K,K} = ${fmt(data.diagonal, 4)}\), 대각선 극한 \(= ${fmt(data.diagonalLimit, 2)}\).`,
      en: String.raw`Iterated limits: \(\lim_m \lim_n a_{m,n} = ${fmtLimit(data.iteratedNFirst, lang)}\), \(\lim_n \lim_m a_{m,n} = ${fmtLimit(data.iteratedMFirst, lang)}.\) Double limit: ${data.doubleLimit === null ? 'none' : fmt(data.doubleLimit, 2)}. Diagonal \(a_{K,K} = ${fmt(data.diagonal, 4)}\), diagonal limit \(= ${fmt(data.diagonalLimit, 2)}\).`,
    },
    lang,
  );
}

function explainText(data: DoubleSequencesData, lang: Lang): string {
  const t = EXAMPLE_TEXT[data.example];
  return t ? localize(t.explain, lang) : '';
}

function verdictText(data: DoubleSequencesData, lang: Lang): string {
  if (data.doubleLimit !== null) {
    return localize(
      {
        ko: String.raw`판정: 이중극한 \(0\)이 존재합니다. 안쪽 극한이 존재하는 순서의 반복극한은 그와 같고, 존재하지 않는 순서에서는 정리가 침묵합니다 (문제 2·3).`,
        en: String.raw`Verdict: the double limit \(0\) exists. The iterated limit in the order where the inner limits exist agrees with it; in the other order the theorem stays silent (Problems 2 and 3).`,
      },
      lang,
    );
  }
  if (data.iteratedNFirst !== null && data.iteratedNFirst === data.iteratedMFirst) {
    return localize(
      {
        ko: String.raw`판정: 반복극한은 둘 다 \(0\)으로 일치하지만 대각선이 \(\frac{1}{2}\)에 머물러 이중극한은 없습니다. 반복극한의 일치는 이중극한을 만들지 못합니다.`,
        en: String.raw`Verdict: both iterated limits agree at \(0\), yet the diagonal stays at \(\frac{1}{2}\), so there is no double limit. Agreement of the iterated limits cannot create a double limit.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`판정: 두 반복극한이 달라서 이중극한은 존재할 수 없습니다 (문제 1·2).`,
      en: String.raw`Verdict: the two iterated limits differ, so no double limit can exist (Problems 1 and 2).`,
    },
    lang,
  );
}

function cellOf(data: DoubleSequencesData): number {
  return data.k <= 12 ? 40 : 25;
}

function drawMain(chart: Chart, data: DoubleSequencesData, lang: Lang): void {
  const { g } = chart;
  g.selectAll('*').remove();

  const k = data.k;
  const cell = cellOf(data);
  const step = cell + GAP;
  const left = MARGIN.left;
  const top = 8;
  const cx = (j: number) => left + j * step + cell / 2;
  const cy = (i: number) => top + i * step + cell / 2;
  const maxAbs = Math.max(Math.abs(data.colorLo), Math.abs(data.colorHi), 1e-9);
  const showNumbers = k <= 12;
  const text = EXAMPLE_TEXT[data.example];

  g.append('text')
    .attr('x', 0)
    .attr('y', -40)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(text ? localize(text.title, lang) : data.example);

  // Column headers (n values).
  for (let j = 0; j < k; j++) {
    g.append('text')
      .attr('x', cx(j))
      .attr('y', top - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.65)
      .text(fmt(j + 1, 0));
  }
  g.append('text')
    .attr('x', left - 12)
    .attr('y', top - 8)
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text('m \\ n');

  for (let i = 0; i < k; i++) {
    g.append('text')
      .attr('x', left - 10)
      .attr('y', cy(i) + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(fmt(i + 1, 0));
    for (let j = 0; j < k; j++) {
      const v = (data.grid[i] as number[])[j] as number;
      const intensity = Math.min(1, Math.abs(v) / maxAbs);
      const color = v < 0 ? 'var(--bound)' : 'var(--accent)';
      g.append('rect')
        .attr('x', left + j * step)
        .attr('y', top + i * step)
        .attr('width', cell)
        .attr('height', cell)
        .attr('rx', 5)
        .attr('fill', color)
        .attr('fill-opacity', 0.1 + 0.8 * intensity)
        .attr('stroke', i === j ? 'currentColor' : 'currentColor')
        .attr('stroke-opacity', i === j ? 0.9 : 0.22)
        .attr('stroke-width', i === j ? 2 : 1);
      if (showNumbers) {
        g.append('text')
          .attr('x', cx(j))
          .attr('y', cy(i) + 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', 11)
          .attr('font-weight', 600)
          .attr('fill', intensity > 0.55 ? '#fff' : 'currentColor')
          .text(fmt(v, 2));
      }
    }
    // Row limit at the right: lim_n a_{m,n} for this row.
    g.append('text')
      .attr('x', left + k * step + 8)
      .attr('y', cy(i) + 4)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`→ ${fmtLimit(data.rowLimits[i] ?? null, lang)}`);
  }

  // Column limits below: lim_m a_{m,n} for each column.
  const limY = top + k * step + 22;
  for (let j = 0; j < k; j++) {
    g.append('text')
      .attr('x', cx(j))
      .attr('y', limY)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(fmtLimit(data.colLimits[j] ?? null, lang));
  }
  g.append('text')
    .attr('x', left - 10)
    .attr('y', limY)
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('font-weight', 700)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '열극한', en: 'col lim' }, lang));
  g.append('text')
    .attr('x', left + k * step + 8)
    .attr('y', cy(0) - cell / 2 - 8)
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.65)
    .text(localize({ ko: '행극한 (n → ∞)', en: 'row limits (n → ∞)' }, lang));
  g.append('text')
    .attr('x', left + k * step + 8)
    .attr('y', limY)
    .attr('font-size', 11)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.65)
    .text(localize({ ko: '굵은 테두리 = 대각선', en: 'bold outline = diagonal' }, lang));
}

export default defineSimpleScene<DoubleSequencesData>({
  model: doubleSequencesModel,
  margin: MARGIN,
  fallbackHeight: 560,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
  sizeFromData: (data, container) => {
    const step = cellOf(data) + GAP;
    return {
      width: Math.max(container.width || 640, MARGIN.left + data.k * step + MARGIN.right),
      height: 8 + data.k * step + 44,
    };
  },
});
