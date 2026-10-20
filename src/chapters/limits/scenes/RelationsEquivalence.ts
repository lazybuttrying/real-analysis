import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { relationsEquivalenceModel, type CongruenceData } from '../models/relationsEquivalence';

/**
 * Equivalence relations via congruence modulo n: the 3n numbers 0..3n-1 are
 * laid out in n rows, one row per equivalence class, so the partition is
 * what you see. Below the grid, the three axioms carry their brute-force
 * check counts: every element, every pair, every triple verified.
 */

const MARGIN = { top: 36, right: 20, bottom: 40, left: 64 };

function check(ok: boolean, lang: Lang): string {
  return ok
    ? localize({ ko: '통과', en: 'passed' }, lang)
    : localize({ ko: '실패', en: 'failed' }, lang);
}

function readoutText(data: CongruenceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`집합 \(U = \{0, 1, \dots, ${fmt(data.n * 3 - 1, 0)}\}\) 위의 합동식 \(\,a \sim b \iff n \mid (a - b)\,\), \(n = ${data.n}\).
세 공리:
• 반사적(reflexive): 모든 \(a\)에 대해 \(a \sim a\) — ${fmt(data.reflexiveCount, 0)}개 원소 모두 ${check(data.reflexive, lang)}\)
• 대칭적(symmetric): \(a \sim b \Rightarrow b \sim a\) — \({data.symmetricPairs}/${data.symmetricPairs} 쌍 ${check(data.symmetric, lang)}\)
• 추이적(transitive): \(a \sim b, b \sim c \Rightarrow a \sim c\) — ${data.transitiveTriples}/${data.transitiveTriples} 삼중항 ${check(data.transitive, lang)}`,
      en: String.raw`Congruence \(\,a \sim b \iff n \mid (a - b)\,\) on \(U = \{0, 1, \dots, ${fmt(data.n * 3 - 1, 0)}\}\), \(n = ${data.n}\).
The three axioms:
• reflexive: \(a \sim a\) for every \(a\) — ${data.reflexiveCount}/${data.reflexiveCount} elements ${check(data.reflexive, lang)}
• symmetric: \(a \sim b \Rightarrow b \sim a\) — ${data.symmetricPairs}/${data.symmetricPairs} pairs ${check(data.symmetric, lang)}
• transitive: \(a \sim b, b \sim c \Rightarrow a \sim c\) — ${data.transitiveTriples}/${data.transitiveTriples} triples ${check(data.transitive, lang)}`,
    },
    lang,
  );
}

function partitionText(data: CongruenceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`동치류 \([r] = \{r, r + n, r + 2n\}\) — 서로 겹치지 않고(${check(data.disjoint, lang)}), \(U\)를 빠짐없이 덮습니다(${check(data.coversAll, lang)}). 이게 분할 정리(partition theorem)입니다: 동치관계는 집합을 겹치지 않는 조각으로 나누고, 각 동치류는 그 조각입니다.`,
      en: String.raw`The equivalence classes \([r] = \{r, r + n, r + 2n\}\) are pairwise disjoint (${check(data.disjoint, lang)}) and cover \(U\) with no gaps (${check(data.coversAll, lang)}). That is the partition theorem: an equivalence relation slices the set into non-overlapping pieces, and each equivalence class is one piece.`,
    },
    lang,
  );
}

function noteText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`“나머지가 같다”는 모든 동치관계의 원형입니다 — 동치관계는 몰래 “같은 ____” 관계입니다: 같은 나머지, 같은 부호, 같은 유리수 차이(아래 문제 3). 동치류는 그 빈칸에 들어가는 말을 적어놓은 것에 불과합니다.`,
      en: String.raw`"Having the same remainder" is the prototype of every equivalence relation — each one is secretly a "same ____" relation: the same remainder, the same sign, the same rational difference (problem 3 below). An equivalence class is just the name written into that blank.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: CongruenceData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const n = data.n;
  const perRow = 3;

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `합동식 mod ${n}: 나머지가 같은 수끼리 한 행 — 동치류가 곧 분할`,
          en: `Congruence mod ${n}: one row per remainder — the classes are the partition`,
        },
        lang,
      ),
    );

  const rowH = Math.min(52, (height - 8) / n);
  const cellW = Math.min(64, (width - 150) / perRow);
  const rowLabelW = 120;
  const top = 8;

  for (let r = 0; r < n; r++) {
    const y0 = top + r * rowH;
    const hue = (r * 360) / n;
    // Color band behind the row: the class as one visible piece.
    g.append('rect')
      .attr('x', rowLabelW)
      .attr('y', y0)
      .attr('width', perRow * cellW + 12)
      .attr('height', rowH - 6)
      .attr('rx', 8)
      .attr('fill', `hsl(${hue}, 60%, 60%)`)
      .attr('opacity', 0.22);

    g.append('text')
      .attr('x', rowLabelW - 10)
      .attr('y', y0 + rowH / 2 - 3)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`[${r}] mod ${n}`);

    for (const [idx, member] of (data.classes[r] as number[]).entries()) {
      g.append('rect')
        .attr('x', rowLabelW + 6 + idx * cellW)
        .attr('y', y0 + 4)
        .attr('width', cellW - 8)
        .attr('height', rowH - 14)
        .attr('rx', 6)
        .attr('fill', `hsl(${hue}, 60%, 60%)`)
        .attr('opacity', 0.65);
      g.append('text')
        .attr('x', rowLabelW + 6 + idx * cellW + (cellW - 8) / 2)
        .attr('y', y0 + rowH / 2 - 1)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 14)
        .attr('font-weight', 700)
        .attr('fill', 'currentColor')
        .text(fmt(member, 0));
    }
  }

  // Footer: every number appears in exactly one row.
  g.append('text')
    .attr('x', 0)
    .attr('y', height + 30)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.8)
    .text(
      localize(
        {
          ko: `0부터 ${fmt(3 * n - 1, 0)}까지의 ${fmt(3 * n, 0)}개 수가 각각 정확히 한 행에 들어갑니다 — 겹침도 누락도 없습니다.`,
          en: `All ${fmt(3 * n, 0)} numbers from 0 to ${fmt(3 * n - 1, 0)} appear in exactly one row — no overlaps, no gaps.`,
        },
        lang,
      ),
    );
}

export default defineSimpleScene<CongruenceData>({
  model: relationsEquivalenceModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: partitionText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: (_data, lang) => noteText(lang), cssText: 'white-space: pre-line; margin-top: 4px;' },
  ],
});
