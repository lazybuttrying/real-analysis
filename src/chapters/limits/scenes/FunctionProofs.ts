import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { functionProofsModel, type FunctionExampleData } from '../models/functionProofs';

/**
 * Composition laws, drawn as three columns of dots A, B, C with arrows for
 * f (A->B) and g (B->C). The composition table g∘f and the injectivity /
 * surjectivity flags are read off below the diagram, so each law — and the
 * failure of its converse — is visible in the tables, not just stated.
 */

const MARGIN = { top: 36, right: 20, bottom: 40, left: 20 };

function mark(ok: boolean): string {
  return ok ? '✓' : '✗';
}

function claimText(data: FunctionExampleData, lang: Lang): string {
  switch (data.example) {
    case 'injective-chain':
      return localize(
        {
          ko: String.raw`합성 \(g \circ f\)가 단사(injective)이면 \(f\)도 단사입니다 — 역은 거짓입니다: \(g\)는 단사가 아닙니다(\(g(0) = g(2) = 0\)). 주장의 전제와 반례가 한 그림에 같이 있습니다.`,
          en: String.raw`If the composition \(g \circ f\) is injective then \(f\) is injective — but the converse fails: \(g\) itself need not be injective (here \(g(0) = g(2) = 0\)). The claim and its sharpness live in the same picture.`,
        },
        lang,
      );
    case 'surjective-chain':
      return localize(
        {
          ko: String.raw`합성 \(g \circ f\)가 전사(surjective)이면 \(g\)도 전사입니다 — 단, \(f\)는 전사일 필요가 없습니다: 여기서 \(f\)는 \(B\)의 원소 \(2\)를 놓치는데도 합성은 \(C\) 전체를 덮습니다.`,
          en: String.raw`If the composition \(g \circ f\) is surjective then \(g\) is surjective — but \(f\) need not be: here \(f\) misses the element \(2\) of \(B\), yet the composition still covers all of \(C\).`,
        },
        lang,
      );
    case 'bijective':
      return localize(
        {
          ko: String.raw`\(f\)와 \(g\)가 모두 전단사(bijective)이면 \(g \circ f\)도 전단사이고 \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\) — 역함수는 합성을 뒤집힌 순서로 풀어냅니다.`,
          en: String.raw`If \(f\) and \(g\) are both bijective then \(g \circ f\) is bijective and \((g \circ f)^{-1} = f^{-1} \circ g^{-1}\) — the inverse unwinds the composition in reverse order.`,
        },
        lang,
      );
  }
}

function flagsText(data: FunctionExampleData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(f\) 단사 ${mark(data.fInjective)}, \(f\) 전사 ${mark(data.fSurjective)} · \(g\) 단사 ${mark(data.gInjective)}, \(g\) 전사 ${mark(data.gSurjective)} · \(g \circ f\) 단사 ${mark(data.gfInjective)}, \(g \circ f\) 전사 ${mark(data.gfSurjective)}`,
      en: String.raw`\(f\) injective ${mark(data.fInjective)}, \(f\) surjective ${mark(data.fSurjective)} · \(g\) injective ${mark(data.gInjective)}, \(g\) surjective ${mark(data.gSurjective)} · \(g \circ f\) injective ${mark(data.gfInjective)}, \(g \circ f\) surjective ${mark(data.gfSurjective)}`,
    },
    lang,
  );
}

function proofIdeaText(data: FunctionExampleData, lang: Lang): string {
  switch (data.example) {
    case 'injective-chain':
      return localize(
        {
          ko: String.raw`증명 아이디어 한 줄: \(f(a_1) = f(a_2)\)이면 \(g(f(a_1)) = g(f(a_2))\)이고, \(g \circ f\)가 단사이므로 \(a_1 = a_2\) — 즉 \(f\)는 단사.`,
          en: String.raw`One-line proof idea: \(f(a_1) = f(a_2)\) forces \(g(f(a_1)) = g(f(a_2))\), and since \(g \circ f\) is injective, \(a_1 = a_2\) — so \(f\) is injective.`,
        },
        lang,
      );
    case 'surjective-chain':
      return localize(
        {
          ko: String.raw`증명 아이디어 한 줄: \(c \in C\)가 주어지면 전사성으로 \(g(f(a)) = c\)인 \(a\)가 존재하고, \(b = f(a)\)로 두면 \(g(b) = c\) — 즉 \(g\)는 전사.`,
          en: String.raw`One-line proof idea: given \(c \in C\), surjectivity of the composition gives \(a\) with \(g(f(a)) = c\); setting \(b = f(a)\) shows \(g(b) = c\) — so \(g\) is surjective.`,
        },
        lang,
      );
    case 'bijective':
      return localize(
        {
          ko: String.raw`증명 아이디어 한 줄: 결합법칙으로 \((f^{-1} \circ g^{-1}) \circ (g \circ f) = f^{-1} \circ (\mathrm{id}) \circ f = \mathrm{id}\) — 순서가 뒤집히는 이유가 계산에서 그대로 보입니다.`,
          en: String.raw`One-line proof idea: by associativity, \((f^{-1} \circ g^{-1}) \circ (g \circ f) = f^{-1} \circ (\mathrm{id}) \circ f = \mathrm{id}\) — the reversed order is right there in the computation.`,
        },
        lang,
      );
  }
}

function drawMain(chart: Chart, data: FunctionExampleData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const sizes = [data.sizes.A, data.sizes.B, data.sizes.C];
  const labels = ['A', 'B', 'C'];
  const tables = [data.f, data.g];
  const colX = [width * 0.18, width * 0.5, width * 0.82];
  const maxN = Math.max(...sizes);
  const rowGap = Math.min(56, (height - 70) / Math.max(maxN - 1, 1));
  const midY = (height - 40) / 2;

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `합성 함수: A에서 f를 거쳐 B로, g를 거쳐 C로 (예제: ${data.example})`,
          en: `Composition: A --f--> B --g--> C (example: ${data.example})`,
        },
        lang,
      ),
    );

  // Column headers and dots.
  const dotY = (col: number, i: number): number => midY + (i - ((sizes[col] as number) - 1) / 2) * rowGap;
  for (let c = 0; c < 3; c++) {
    g.append('text')
      .attr('x', colX[c] as number)
      .attr('y', dotY(c, 0) - 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 15)
      .attr('font-weight', 700)
      .attr('fill', 'currentColor')
      .text(labels[c] as string);
    for (let i = 0; i < (sizes[c] as number); i++) {
      g.append('circle')
        .attr('cx', colX[c] as number)
        .attr('cy', dotY(c, i))
        .attr('r', 15)
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.35);
      g.append('text')
        .attr('x', colX[c] as number)
        .attr('y', dotY(c, i))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', 700)
        .attr('fill', 'currentColor')
        .text(fmt(i, 0));
    }
  }

  // Arrows: f from A to B, g from B to C. Curved paths so collisions read.
  for (let step = 0; step < 2; step++) {
    const table = tables[step] as number[];
    const color = step === 0 ? 'var(--accent)' : 'var(--bound)';
    for (let i = 0; i < table.length; i++) {
      const y1 = dotY(step, i);
      const y2 = dotY(step + 1, table[i] as number);
      const x1 = (colX[step] as number) + 18;
      const x2 = (colX[step + 1] as number) - 18;
      g.append('line')
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y1)
        .attr('y2', y2)
        .attr('stroke-width', 2)
        .attr('stroke', color)
        .attr('opacity', 0.8);
      g.append('circle')
        .attr('cx', x2)
        .attr('cy', y2)
        .attr('r', 3)
        .attr('fill', color);
    }
    g.append('text')
      .attr('x', ((colX[step] as number) + (colX[step + 1] as number)) / 2)
      .attr('y', Math.min(...table.map((_, i) => dotY(step, i))) - 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(step === 0 ? 'f' : 'g');
  }

  // Composition table g∘f below the diagram.
  const gfLine = data.gf.map((y, i) => `${i}↦${y}`).join('  ');
  g.append('text')
    .attr('x', 0)
    .attr('y', height + 30)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `합성표 g ∘ f: ${gfLine}`,
          en: `composition table g ∘ f: ${gfLine}`,
        },
        lang,
      ),
    );
}

export default defineSimpleScene<FunctionExampleData>({
  model: functionProofsModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: claimText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: flagsText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: proofIdeaText, cssText: 'white-space: pre-line; margin-top: 4px;' },
  ],
});
