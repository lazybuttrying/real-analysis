import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  strongInductionModel,
  type FactorNode,
  type StrongInductionData,
} from '../models/strongInduction';

/**
 * Strong induction as factorization: every integer n >= 2 is a product of
 * primes. The tree splits n by its smallest prime factor, again and again;
 * the induction hypothesis is applied at the strictly smaller values a and
 * b — which are usually NOT n - 1, so weak induction has nothing to say.
 * Prime leaves glow in the accent color, and the slot text checks that the
 * leaves multiply back to n.
 */

const MARGIN = { top: 44, right: 20, bottom: 48, left: 64 };

interface PlacedNode {
  node: FactorNode;
  x: number;
  y: number;
  children: PlacedNode[];
}

function collectLeaves(node: FactorNode, out: FactorNode[]): void {
  if (node.children.length === 0) {
    out.push(node);
    return;
  }
  node.children.forEach((c) => collectLeaves(c, out));
}

function maxDepthOf(node: FactorNode): number {
  if (node.children.length === 0) return 0;
  return 1 + Math.max(...node.children.map(maxDepthOf));
}

function layoutTree(root: FactorNode, width: number, height: number): PlacedNode {
  const leafNodes: FactorNode[] = [];
  collectLeaves(root, leafNodes);
  const leafIndex = new Map<FactorNode, number>();
  leafNodes.forEach((leaf, i) => leafIndex.set(leaf, i));
  const slotW = width / Math.max(1, leafNodes.length);
  const rowH = Math.min(72, height / (maxDepthOf(root) + 1));

  function place(current: FactorNode, depth: number): PlacedNode {
    if (current.children.length === 0) {
      const idx = leafIndex.get(current) ?? 0;
      return { node: current, x: idx * slotW + slotW / 2, y: depth * rowH + 8, children: [] };
    }
    const kids = current.children.map((c) => place(c, depth + 1));
    const x = kids.reduce((s, k) => s + k.x, 0) / kids.length;
    return { node: current, x, y: depth * rowH + 8, children: kids };
  }

  return place(root, 0);
}

function walk(node: PlacedNode, fn: (n: PlacedNode) => void): void {
  fn(node);
  node.children.forEach((c) => walk(c, fn));
}

function readoutText(data: StrongInductionData, lang: Lang): string {
  const factorsStr = data.factors.join(' × ');
  const step =
    data.nIsPrime
      ? localize(
          {
            ko: String.raw`\(n = ${fmt(data.n, 0)}\)은 소수 — 밑에 해당하는 경우: 증명할 것이 없습니다 (자기 자신이 소인수분해).`,
            en: String.raw`\(n = ${fmt(data.n, 0)}\) is prime — the base-like case: nothing to prove (it is its own factorization).`,
          },
          lang,
        )
      : localize(
          {
            ko: String.raw`합성수 \(n = ${fmt(data.n, 0)} = ${fmt(data.split?.a ?? 0, 0)} \times ${fmt(data.split?.b ?? 0, 0)}\): 두 인자 모두 \(n\)보다 작으므로 강한 귀납 가정이 양쪽에 한 번에 적용됩니다 — 약한 귀납의 \(P(n-1)\)로는 도달할 수 없습니다.`,
            en: String.raw`composite \(n = ${fmt(data.n, 0)} = ${fmt(data.split?.a ?? 0, 0)} \times ${fmt(data.split?.b ?? 0, 0)}\): both factors are smaller than \(n\), so the strong hypothesis applies to both at once — the weak \(P(n-1)\) cannot reach them.`,
          },
          lang,
        );
  return localize(
    {
      ko: String.raw`\(n = ${fmt(data.n, 0)} = ${factorsStr}\): 소인수 ${data.factors.length}개, 곱 \(= ${fmt(data.leavesProduct, 0)}\) ✓
${step}`,
      en: String.raw`\(n = ${fmt(data.n, 0)} = ${factorsStr}\): ${data.factors.length} prime factors, product \(= ${fmt(data.leavesProduct, 0)}\) ✓
${step}`,
    },
    lang,
  );
}

function explainText(data: StrongInductionData, lang: Lang): string {
  const a = fmt(data.split?.a ?? 0, 0);
  const b = fmt(data.split?.b ?? 0, 0);
  const splitNote = data.nIsPrime
    ? localize(
        {
          ko: String.raw`지금은 소수라 트리의 분기가 바로 끝납니다.`,
          en: String.raw`It is prime, so the tree's branching ends immediately.`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`첫 분기는 \(a = ${a}\), \(b = ${b}\)입니다.`,
          en: String.raw`The first split is \(a = ${a}\), \(b = ${b}\).`,
        },
        lang,
      );
  return localize(
    {
      ko: String.raw`강한 귀납법은 \(P(n)\)을 증명할 때 \(P(2), P(3), \dots, P(n-1)\) 전체를 가정해도 됩니다. 위 트리는 그 가정을 그림으로 그린 것입니다: 합성수 노드 \(n = a \times b\)에서 화살표는 \(a\)와 \(b\) — \(n-1\) 바로 아래가 아니라 훨씬 작은 수들 — 를 가리킵니다. \(n = ${fmt(data.n, 0)}\)에서는 ${splitNote} 가정이 \(n\)보다 작은 모든 수에 걸리니, 어떤 인자 쌍이 나와도 증명이 막히지 않습니다.`,
      en: String.raw`Strong induction lets you assume all of \(P(2), P(3), \dots, P(n-1)\) when proving \(P(n)\). The tree above draws that assumption: at a composite node \(n = a \times b\) the arrows point to \(a\) and \(b\) — numbers usually far below \(n-1\), not just the one right beneath it. For \(n = ${fmt(data.n, 0)}\): ${splitNote} Because the hypothesis covers every number below \(n\), no factor pair can ever stall the proof.`,
    },
    lang,
  );
}

function contrastText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`약한 귀납 vs 강한 귀납: 약한 귀납은 \(P(n-1)\) 하나만 줍니다. \(n = 30\)을 소인수분해하려면 \(P(29)\)가 아니라 \(P(15)\)와 \(P(2)\)가 필요합니다 — 약한 가정이 줄 수 없는 정보입니다. 강한 귀납은 "\(n\)보다 작은 모든 수"를 주므로, 인자가 어디에 떨어지든 가정을 적용할 수 있습니다.`,
      en: String.raw`Weak vs strong induction: weak induction gives you only \(P(n-1)\). To factor \(n = 30\) you need \(P(15)\) and \(P(2)\), not \(P(29)\) — information the weak hypothesis cannot provide. Strong induction hands you every number below \(n\), so the hypothesis applies wherever the factors land.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: StrongInductionData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -22)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `소인수분해 트리 — n = ${fmt(data.n, 0)}`,
          en: `factorization tree — n = ${fmt(data.n, 0)}`,
        },
        lang,
      ),
    );

  g.append('text')
    .attr('x', width)
    .attr('y', -22)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `잎들의 곱 = ${fmt(data.leavesProduct, 0)} ${data.leavesProduct === data.n ? '✓' : '✗'}`,
          en: `leaf product = ${fmt(data.leavesProduct, 0)} ${data.leavesProduct === data.n ? '✓' : '✗'}`,
        },
        lang,
      ),
    );

  const root = layoutTree(data.tree, width, height - 30);
  const r = 17;

  // Edges first.
  walk(root, (p) => {
    p.children.forEach((c) => {
      g.append('line')
        .attr('x1', p.x)
        .attr('y1', p.y + r)
        .attr('x2', c.x)
        .attr('y2', c.y - r)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.5);
      const midX = (p.x + c.x) / 2;
      const midY = (p.y + r + c.y - r) / 2;
      const left = c.x < p.x;
      g.append('text')
        .attr('x', midX + (left ? -10 : 10))
        .attr('y', midY + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(`×${fmt(c.node.value, 0)}`);
    });
  });

  // Nodes.
  walk(root, (p) => {
    const isLeaf = p.children.length === 0;
    g.append('circle')
      .attr('cx', p.x)
      .attr('cy', p.y)
      .attr('r', r)
      .attr('fill', isLeaf ? 'var(--accent)' : 'var(--bg, #fff)')
      .attr('stroke', isLeaf ? 'var(--accent)' : 'currentColor')
      .attr('stroke-width', isLeaf ? 0 : 1.5);
    g.append('text')
      .attr('x', p.x)
      .attr('y', p.y + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', isLeaf ? '#fff' : 'currentColor')
      .text(fmt(p.node.value, 0));
    if (isLeaf) {
      g.append('text')
        .attr('x', p.x)
        .attr('y', p.y + r + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.75)
        .text(localize({ ko: '소수', en: 'prime' }, lang));
    }
  });

  // Split annotation for composite roots.
  if (data.split !== null) {
    const split = data.split;
    g.append('text')
      .attr('x', 0)
      .attr('y', height - 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `첫 분기: ${fmt(data.n, 0)} = ${fmt(split.a, 0)} × ${fmt(split.b, 0)} — 둘 다 ${fmt(data.n, 0)}보다 작음`,
            en: `first split: ${fmt(data.n, 0)} = ${fmt(split.a, 0)} × ${fmt(split.b, 0)} — both below ${fmt(data.n, 0)}`,
          },
          lang,
        ),
      );
  }
}

export default defineSimpleScene<StrongInductionData>({
  model: strongInductionModel,
  margin: MARGIN,
  fallbackHeight: 280,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: explainText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: (_data, lang) => contrastText(lang), cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;' },
  ],
});
