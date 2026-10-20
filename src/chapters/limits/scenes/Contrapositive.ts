import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { contrapositiveModel, type ContrapositiveData, type Parity } from '../models/contrapositive';

/**
 * Proof by contrapositive, live: to prove P => Q, prove not-Q => not-P.
 * Worked example: if n^2 is even then n is even. The grid for n = 1..12
 * shows that n^2-even rows are exactly the n-even rows; flipping the view
 * runs the contrapositive chain n odd => n = 2k+1 => n^2 = 2(2k^2+2k)+1
 * with the current slider n substituted.
 */

const MARGIN = { top: 56, right: 24, bottom: 20, left: 24 };

function parityWord(p: Parity, lang: Lang): string {
  if (lang === 'ko') return p === 'even' ? '짝수' : '홀수';
  return p;
}

function readoutText(data: ContrapositiveData, lang: Lang): string {
  const form =
    data.parityN === 'even'
      ? String.raw`\(n = 2 \cdot ${data.k}\)`
      : String.raw`\(n = 2 \cdot ${data.k} + 1\)`;
  return localize(
    {
      ko: String.raw`현재 \(n = ${data.n}\): \(n^2 = ${data.n2}\), \(n\)은 ${parityWord(data.parityN, lang)}, \(n^2\)은 ${parityWord(data.parityN2, lang)}. ${form}.
"\(n^2\)이 짝수 \(\Rightarrow\) \(n\)이 짝수" — 이 \(n\)에서는 성립 (표에서 \(n^2\)이 짝수인 행이 정확히 \(n\)이 짝수인 행과 일치).`,
      en: String.raw`Now \(n = ${data.n}\): \(n^2 = ${data.n2}\), \(n\) is ${parityWord(data.parityN, lang)}, \(n^2\) is ${parityWord(data.parityN2, lang)}. ${form}.
"\(n^2\) even \(\Rightarrow\) \(n\) even" — holds for this \(n\) (in the grid, the \(n^2\)-even rows are exactly the \(n\)-even rows).`,
    },
    lang,
  );
}

function routeText(data: ContrapositiveData, lang: Lang): string {
  if (data.view === 'contrapositive') {
    // Substitute the current n when it is odd; otherwise work the nearest
    // odd example n - 1 and say so.
    if (data.parityN === 'odd') {
      return localize(
        {
          ko: String.raw`대우의 계산 (현재 \(n = ${data.n}\), 홀수 — 직접 대입):
\[n = 2 \cdot ${data.k} + 1 \;\Rightarrow\; n^2 = (2 \cdot ${data.k} + 1)^2 = ${data.oddExpansion} = 2 \cdot (${data.oddInner}) + 1\]
\(n^2 = ${data.n2}\), 홀수. "홀수 \(n\) \(\Rightarrow\) 홀수 \(n^2\)" — 이것이 대우 \(\lnot Q \Rightarrow \lnot P\)의 증명이다.`,
          en: String.raw`The contrapositive computation (\(n = ${data.n}\), odd — substituted directly):
\[n = 2 \cdot ${data.k} + 1 \;\Rightarrow\; n^2 = (2 \cdot ${data.k} + 1)^2 = ${data.oddExpansion} = 2 \cdot (${data.oddInner}) + 1\]
\(n^2 = ${data.n2}\), odd. "Odd \(n\) \(\Rightarrow\) odd \(n^2\)" — this is the proof of the contrapositive \(\lnot Q \Rightarrow \lnot P\).`,
        },
        lang,
      );
    }
    const m = data.n - 1;
    const k = (m - 1) / 2;
    const inner = 2 * k * k + 2 * k;
    const val = m * m;
    return localize(
      {
        ko: String.raw`대우의 계산: 현재 \(n = ${data.n}\)은 짝수라 대우의 가정(홀수)이 직접 적용되지 않는다. 대신 가장 가까운 홀수 \(n = ${m} = 2 \cdot ${k} + 1\)로 계산하면
\[n^2 = (2 \cdot ${k} + 1)^2 = ${val} = 2 \cdot (${inner}) + 1\]
홀수. 대우는 "모든 홀수 \(n\)"에 대해 성립해야 하므로, 증명은 이 예시가 아니라 항등식 \((2k+1)^2 = 2(2k^2+2k)+1\) 자체이다 (아래 문제 1).`,
        en: String.raw`The contrapositive computation: the current \(n = ${data.n}\) is even, so the contrapositive's assumption (odd) does not apply directly. Working the nearest odd example \(n = ${m} = 2 \cdot ${k} + 1\) instead,
\[n^2 = (2 \cdot ${k} + 1)^2 = ${val} = 2 \cdot (${inner}) + 1\]
odd. The contrapositive must hold for every odd \(n\), so the proof is the identity \((2k+1)^2 = 2(2k^2+2k)+1\) itself, not this example (problem 1 below).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`두 증명 경로를 나란히:
직접 시도 — "\(n^2\)이 짝수"를 가정하면 \(n^2 = 2m\). 그러나 이 가정은 \(n\) 자체에 대한 계산 손잡이를 주지 않는다: \(n = \sqrt{2m}\)은 정수가 아닐 수도 있어 막힌다.
대우 — "\(n\)이 홀수"를 가정하면 \(n = 2k+1\)이라는 계산 가능한 형태가 나온다: \(n^2 = (2k+1)^2 = 2(2k^2+2k)+1\), 홀수. 보기(view)를 'contrapositive'로 바꿔 현재 \(n\)을 대입해 보세요.`,
      en: String.raw`The two proof routes side by side:
Direct attempt — assume "\(n^2\) is even", so \(n^2 = 2m\). But this assumption gives no computational handle on \(n\) itself: \(n = \sqrt{2m}\) need not be an integer, and the attempt stalls.
Contrapositive — assume "\(n\) is odd", which yields the computable form \(n = 2k+1\): \(n^2 = (2k+1)^2 = 2(2k^2+2k)+1\), odd. Switch the view to 'contrapositive' to substitute the current \(n\).`,
    },
    lang,
  );
}

function verdictText(_data: ContrapositiveData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(P \Rightarrow Q\)와 \(\lnot Q \Rightarrow \lnot P\)는 동치 — 둘 다 \(P\) 참, \(Q\) 거짓일 때만 거짓이다 (진리표). 그래서 "\(n^2\) 짝수 \(\Rightarrow\) \(n\) 짝수"를 직접 건드리는 대신, 대우 "\(n\) 홀수 \(\Rightarrow\) \(n^2\) 홀수"를 계산으로 증명한다. 직접증명 씬의 보조정리(홀수의 제곱은 홀수)가 바로 이 대우의 본체이다.`,
      en: String.raw`\(P \Rightarrow Q\) and \(\lnot Q \Rightarrow \lnot P\) are equivalent — both are false exactly when \(P\) is true and \(Q\) is false (truth table). So instead of wrestling "\(n^2\) even \(\Rightarrow\) \(n\) even" directly, we prove the contrapositive "odd \(n\) \(\Rightarrow\) odd \(n^2\)" by computation. The direct-proof scene's lemma (the square of an odd number is odd) is exactly the body of this contrapositive.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: ContrapositiveData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -34)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: '대우법: n²이 짝수인 행 = n이 짝수인 행 (현재 n 테두리 표시)',
          en: 'Contrapositive: rows with n² even are exactly the rows with n even (current n outlined)',
        },
        lang,
      ),
    );

  const headers =
    lang === 'ko' ? ['n', 'n²', 'n의 홀짝', 'n²의 홀짝'] : ['n', 'n²', 'parity(n)', 'parity(n²)'];
  const headerH = 30;
  const rowH = Math.max(26, (height - headerH - 8) / 12);
  const colW = width / 4;

  headers.forEach((h, i) => {
    g.append('text')
      .attr('x', i * colW + colW / 2)
      .attr('y', headerH - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(h);
  });

  data.table.forEach((row, i) => {
    const y = headerH + i * rowH;
    const isCurrent = row.n === data.n;
    // Rows where n^2 is even are shaded: they coincide with the n-even rows.
    if (row.parityN2 === 'even') {
      g.append('rect')
        .attr('x', 0)
        .attr('y', y + 2)
        .attr('width', width)
        .attr('height', rowH - 4)
        .attr('fill', 'var(--bound)')
        .attr('opacity', 0.16);
    }
    if (isCurrent) {
      g.append('rect')
        .attr('x', 0)
        .attr('y', y + 2)
        .attr('width', width)
        .attr('height', rowH - 4)
        .attr('fill', 'none')
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2.5);
    }
    const cells = [String(row.n), String(row.n2), parityWord(row.parityN, lang), parityWord(row.parityN2, lang)];
    cells.forEach((c, j) => {
      g.append('text')
        .attr('x', j * colW + colW / 2)
        .attr('y', y + rowH / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', isCurrent ? 700 : 400)
        .attr('fill', 'currentColor')
        .text(c);
    });
  });
}

export default defineSimpleScene<ContrapositiveData>({
  model: contrapositiveModel,
  margin: MARGIN,
  fallbackHeight: 430,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: routeText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: verdictText, cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
  ],
});
