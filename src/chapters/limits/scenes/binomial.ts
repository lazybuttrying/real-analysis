import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { binomialModel, type BinomialData } from '../models/binomial';

/**
 * Pascal's triangle, rows 0..n, with the selected row highlighted.
 * The facts strip shows the selected row's entries and their sum 2^n;
 * the verdict states the binomial theorem, proved by induction with
 * Pascal's identity as the inductive step.
 */

function factsText(data: BinomialData, lang: Lang): string {
  const { n, rows, rowSum } = data;
  const row = rows[n] ?? [];
  const entries = row.map(String).join(' ');
  return localize(
    {
      ko: String.raw`선택된 행 \(n = ${n}\): \(\binom{${n}}{k}\) \(= ${entries}\) — 합 \(\sum_{k=0}^{${n}}\binom{${n}}{k} = ${rowSum} = 2^{${n}}\).`,
      en: String.raw`Selected row \(n = ${n}\): \(\binom{${n}}{k}\) \(= ${entries}\) — sum \(\sum_{k=0}^{${n}}\binom{${n}}{k} = ${rowSum} = 2^{${n}}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`이항정리: \((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\) — 귀납법으로 증명되며, 파스칼의 항등식 \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\)이 귀납 단계를 만든다.`,
      en: String.raw`The binomial theorem: \((x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k\) — proved by induction, where Pascal's identity \(\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}\) is the inductive step.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: BinomialData, lang: Lang): void {
    const { g, width, height } = chart;
    const { n, rows, highlight, rowSum } = data;
    g.selectAll('*').remove();

    const rowCount = rows.length;
    const spacingX = Math.min(64, width / (n + 2));
    const rowH = Math.min(38, (height - 130) / Math.max(1, rowCount));
    const top = 14;
    const cx = width / 2;

    rows.forEach((row, r) => {
      const y = top + r * rowH + rowH / 2;
      const isSel = r === highlight;
      if (isSel) {
        const halfW = ((row.length - 1) / 2) * spacingX + spacingX * 0.55;
        g.append('rect')
          .attr('x', cx - halfW)
          .attr('y', y - rowH * 0.42)
          .attr('width', halfW * 2)
          .attr('height', rowH * 0.84)
          .attr('rx', 9)
          .attr('fill', 'var(--accent)')
          .attr('opacity', 0.14);
      }
      g.append('text')
        .attr('x', 6)
        .attr('y', y + 4)
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .attr('opacity', isSel ? 0.9 : 0.45)
        .attr('font-weight', isSel ? 700 : 400)
        .text(`n=${r}`);
      row.forEach((value, k) => {
        g.append('text')
          .attr('x', cx + (k - (row.length - 1) / 2) * spacingX)
          .attr('y', y + 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', isSel ? 15 : 12)
          .attr('font-weight', isSel ? 700 : 400)
          .attr('fill', isSel ? 'var(--accent)' : 'currentColor')
          .attr('opacity', isSel ? 1 : 0.8)
          .text(String(value));
      });
    });

    const row = rows[n] ?? [];
    const rowLabel = localize({ ko: '행', en: 'row' }, lang);
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 58)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(`${rowLabel} ${n}: ${row.join('  ')}`);
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 38)
      .attr('fill', 'currentColor')
      .attr('font-size', 12)
      .text(
        localize(
          { ko: `합 C(${n}, k) = ${rowSum} = 2^${n}`, en: `sum C(${n}, k) = ${rowSum} = 2^${n}` },
          lang,
        ),
      );
    g.append('text')
      .attr('x', 8)
      .attr('y', height - 16)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        localize(
          { ko: '파스칼 항등식이 귀납 단계를 만든다', en: "Pascal's identity is the induction step" },
          lang,
        ),
      );
}

export default defineSimpleScene<BinomialData>({
  model: binomialModel,
  drawMain,
  slots: [
    { text: factsText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true }
  ],
});
