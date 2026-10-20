import { scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  casesExistenceModel,
  SQRT2_POW,
  SQRT2_POW_IDENTITY,
  type CasesExistenceData,
  type SignCaseId,
} from '../models/casesExistence';

/**
 * Two proof techniques in one scene, switched by the 'part' select.
 * (A) Proof by cases: a live point (x, y) on the coordinate plane; the
 * quadrant containing it is shaded and labeled with its case of the
 * |xy| = |x||y| proof.
 * (B) Non-constructive existence: the fork diagram for c = sqrt(2)^sqrt(2) —
 * either branch yields irrational a, b with a^b rational, and the proof
 * never says which branch holds.
 */

const MARGIN = { top: 36, right: 20, bottom: 20, left: 20 };

/** The case derivation shown on the plane (plain Unicode; SVG is not KaTeX). */
function caseSvgLabel(caseId: SignCaseId, lang: Lang): string {
  switch (caseId) {
    case 'pos-pos':
      return localize(
        { ko: '경우 1: x ≥ 0, y ≥ 0 — xy ≥ 0이므로 |xy| = xy = |x|·|y|', en: 'case 1: x ≥ 0, y ≥ 0 — xy ≥ 0, so |xy| = xy = |x|·|y|' },
        lang,
      );
    case 'pos-neg':
      return localize(
        { ko: '경우 2: x > 0, y < 0 — xy < 0이므로 |xy| = -(xy) = x·(-y) = |x|·|y|', en: 'case 2: x > 0, y < 0 — xy < 0, so |xy| = -(xy) = x·(-y) = |x|·|y|' },
        lang,
      );
    case 'neg-pos':
      return localize(
        { ko: '경우 3: x < 0, y > 0 — xy < 0이므로 |xy| = -(xy) = (-x)·y = |x|·|y|', en: 'case 3: x < 0, y > 0 — xy < 0, so |xy| = -(xy) = (-x)·y = |x|·|y|' },
        lang,
      );
    case 'neg-neg':
      return localize(
        { ko: '경우 4: x < 0, y < 0 — xy > 0이므로 |xy| = xy = (-x)·(-y) = |x|·|y|', en: 'case 4: x < 0, y < 0 — xy > 0, so |xy| = xy = (-x)·(-y) = |x|·|y|' },
        lang,
      );
    case 'zero':
      return localize(
        { ko: '경우 0: x = 0 또는 y = 0 — xy = 0이므로 |xy| = 0 = |x|·|y|', en: 'case 0: x = 0 or y = 0 — xy = 0, so |xy| = 0 = |x|·|y|' },
        lang,
      );
  }
}

function casesReadout(data: CasesExistenceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\((x, y) = (${fmt(data.x, 1)},\, ${fmt(data.y, 1)})\): \(|xy| = |${fmt(data.xy, 2)}| = ${fmt(data.absXY, 2)}\), \(|x| \cdot |y| = ${fmt(data.absX, 1)} \cdot ${fmt(data.absY, 1)} = ${fmt(data.absXabsY, 2)}\) — 일치한다.`,
      en: String.raw`\((x, y) = (${fmt(data.x, 1)},\, ${fmt(data.y, 1)})\): \(|xy| = |${fmt(data.xy, 2)}| = ${fmt(data.absXY, 2)}\), \(|x| \cdot |y| = ${fmt(data.absX, 1)} \cdot ${fmt(data.absY, 1)} = ${fmt(data.absXabsY, 2)}\) — they agree.`,
    },
    lang,
  );
}

function casesExplain(_data: CasesExistenceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`점을 움직여 보세요 — 어느 사분면에 있든 같은 결론 \(|xy| = |x| \cdot |y|\)가 나옵니다. 네 경우는 \((x, y)\) 평면을 빠짐없이 덮습니다:
경우 1 \(x \ge 0,\, y \ge 0\): \(xy \ge 0\)이므로 \(|xy| = xy = |x| \cdot |y|\)
경우 2 \(x > 0,\, y < 0\): \(xy < 0\)이므로 \(|xy| = -(xy) = x \cdot (-y) = |x| \cdot |y|\)
경우 3 \(x < 0,\, y > 0\): \(xy < 0\)이므로 \(|xy| = -(xy) = (-x) \cdot y = |x| \cdot |y|\)
경우 4 \(x < 0,\, y < 0\): \(xy > 0\)이므로 \(|xy| = xy = (-x) \cdot (-y) = |x| \cdot |y|\)
(\(x = 0\) 또는 \(y = 0\)이면 \(xy = 0\)이라 경우 1에 포함됩니다.)`,
      en: String.raw`Move the point — whichever quadrant it lands in, the same conclusion \(|xy| = |x| \cdot |y|\) comes out. The four cases cover the whole \((x, y)\) plane with nothing left out:
case 1 \(x \ge 0,\, y \ge 0\): \(xy \ge 0\), so \(|xy| = xy = |x| \cdot |y|\)
case 2 \(x > 0,\, y < 0\): \(xy < 0\), so \(|xy| = -(xy) = x \cdot (-y) = |x| \cdot |y|\)
case 3 \(x < 0,\, y > 0\): \(xy < 0\), so \(|xy| = -(xy) = (-x) \cdot y = |x| \cdot |y|\)
case 4 \(x < 0,\, y < 0\): \(xy > 0\), so \(|xy| = xy = (-x) \cdot (-y) = |x| \cdot |y|\)
(If \(x = 0\) or \(y = 0\) then \(xy = 0\), folding into case 1.)`,
    },
    lang,
  );
}

function casesVerdict(lang: Lang): string {
  return localize(
    {
      ko: String.raw`경우 나누기의 모양: 정의역을 빠짐없이 덮는 경우들로 쪼개고, 각 경우에서 주장을 증명한다. 핵심은 "빠짐없이" — 네 사분면(과 축)이 평면 전체를 덮으므로 모든 경우에서 성립하면 전체에서 성립한다. 경우를 하나라도 빠뜨리면 증명이 무너진다.`,
      en: String.raw`The shape of proof by cases: split the domain into cases that cover everything, and prove the claim in each. The key word is "everything" — the four quadrants (and the axes) cover the whole plane, so the claim in every case is the claim everywhere. Miss one case and the proof collapses.`,
    },
    lang,
  );
}

function existenceReadout(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(c = \sqrt{2}^{\sqrt{2}} \approx ${fmt(SQRT2_POW, 10)}\), \(c^{\sqrt{2}} \approx ${fmt(SQRT2_POW_IDENTITY, 10)}\).
어느 갈래든: 무리수 \(a, b\)와 유리수 \(a^b\)가 존재한다 — 어느 갈래가 참인지는 모른 채로.`,
      en: String.raw`\(c = \sqrt{2}^{\sqrt{2}} \approx ${fmt(SQRT2_POW, 10)}\), \(c^{\sqrt{2}} \approx ${fmt(SQRT2_POW_IDENTITY, 10)}\).
Either branch: irrational \(a, b\) exist with \(a^b\) rational — without knowing which branch is true.`,
    },
    lang,
  );
}

function existenceExplain(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(c = \sqrt{2}^{\sqrt{2}}\)를 보자. \(\sqrt{2}\)는 무리수이므로, \(c\)는 무리수의 무리수 제곱이다.
갈래 1: \(c\)가 유리수이면 — \(a = b = \sqrt{2}\)로 끝. \(a^b = c\)가 유리수다.
갈래 2: \(c\)가 무리수이면 — \(a = c\), \(b = \sqrt{2}\)로 두면 \(a^b = \big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{\sqrt{2} \cdot \sqrt{2}} = \sqrt{2}^{2} = 2\)가 유리수다 (지수법칙 \((u^v)^w = u^{vw}\), \(u > 0\)).
\(c\)가 유리수인지 무리수인지는 전혀 판단하지 않았다 — 그래도 "그런 \(a, b\)가 존재한다"는 결론은 완전하다. 이것이 비구성적 존재 증명이다.`,
      en: String.raw`Consider \(c = \sqrt{2}^{\sqrt{2}}\). Since \(\sqrt{2}\) is irrational, \(c\) is an irrational power of an irrational.
Branch 1: if \(c\) is rational — done, with \(a = b = \sqrt{2}\): \(a^b = c\) is rational.
Branch 2: if \(c\) is irrational — put \(a = c\), \(b = \sqrt{2}\): then \(a^b = \big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{\sqrt{2} \cdot \sqrt{2}} = \sqrt{2}^{2} = 2\), rational (by the power law \((u^v)^w = u^{vw}\) for \(u > 0\)).
Whether \(c\) is rational or irrational is never decided — yet the conclusion "such \(a, b\) exist" is complete. That is a non-constructive existence proof.`,
    },
    lang,
  );
}

function existenceVerdict(lang: Lang): string {
  return localize(
    {
      ko: String.raw`비구성적 존재 증명의 모양: "존재한다"는 결론을, 그 대상이 무엇인지는 밝히지 않고 증명한다. 위 증명은 두 갈래 중 어느 것이 참인지 끝내 말하지 않는다.
대조: 구성적 존재 증명은 대상을 직접 내놓는다 (예: \(x^2 = 2\)의 해가 존재함은 \(x = \sqrt{2}\)를 보여 증명한다).`,
      en: String.raw`The shape of a non-constructive existence proof: prove "it exists" without saying what it is. The proof above never tells which of the two branches is true.
Contrast: a constructive existence proof exhibits the object (e.g. \(x^2 = 2\) has a solution, namely \(x = \sqrt{2}\)).`,
    },
    lang,
  );
}

function drawCases(chart: Chart, data: CasesExistenceData, lang: Lang): void {
  const { g, width, height } = chart;
  const plot = g.append('g').attr('transform', 'translate(0, 30)');
  const plotH = height - 30;

  g.append('text')
    .attr('x', 0)
    .attr('y', 4)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(caseSvgLabel(data.caseId, lang));

  const x = scaleLinear().domain([-5, 5]).range([0, width]);
  const y = scaleLinear().domain([-5, 5]).range([plotH, 0]);

  // Light grid.
  for (let t = -5; t <= 5; t++) {
    plot.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', 0).attr('y2', plotH)
      .attr('stroke', 'currentColor').attr('opacity', 0.08);
    plot.append('line').attr('x1', 0).attr('x2', width).attr('y1', y(t)).attr('y2', y(t))
      .attr('stroke', 'currentColor').attr('opacity', 0.08);
  }
  // Axes.
  plot.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', plotH)
    .attr('stroke', 'currentColor').attr('stroke-width', 1.5).attr('opacity', 0.6);
  plot.append('line').attr('x1', 0).attr('x2', width).attr('y1', y(0)).attr('y2', y(0))
    .attr('stroke', 'currentColor').attr('stroke-width', 1.5).attr('opacity', 0.6);

  // Shade the quadrant containing the point.
  const shade = (x0: number, x1: number, y0: number, y1: number) => {
    plot.append('rect')
      .attr('x', x(x0)).attr('width', Math.max(0, x(x1) - x(x0)))
      .attr('y', y(y1)).attr('height', Math.max(0, y(y0) - y(y1)))
      .attr('fill', 'var(--accent)').attr('opacity', 0.16);
  };
  switch (data.caseId) {
    case 'pos-pos': shade(0, 5, 0, 5); break;
    case 'pos-neg': shade(0, 5, -5, 0); break;
    case 'neg-pos': shade(-5, 0, 0, 5); break;
    case 'neg-neg': shade(-5, 0, -5, 0); break;
    case 'zero': break;
  }

  // The point.
  const px = x(data.x);
  const py = y(data.y);
  plot.append('circle')
    .attr('cx', px).attr('cy', py).attr('r', 7)
    .attr('fill', 'var(--accent)').attr('stroke', 'currentColor').attr('stroke-width', 1.5);
  plot.append('text')
    .attr('x', Math.min(px + 12, width - 52)).attr('y', Math.max(py - 12, 12))
    .attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor')
    .text(`(${fmt(data.x, 1)}, ${fmt(data.y, 1)})`);

  // Tick labels.
  const tick = (tx: number, ty: number, label: string, anchor: 'start' | 'end' | 'middle') => {
    plot.append('text').attr('x', tx).attr('y', ty).attr('text-anchor', anchor)
      .attr('font-size', 11).attr('fill', 'currentColor').attr('opacity', 0.7).text(label);
  };
  tick(x(-5) + 3, y(0) - 5, '-5', 'start');
  tick(x(5) - 3, y(0) - 5, '5', 'end');
  tick(x(0) + 5, y(5) + 12, '5', 'start');
  tick(x(0) + 5, y(-5) - 5, '-5', 'start');
}

function drawExistence(chart: Chart, lang: Lang): void {
  const { g, width } = chart;

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: '비구성적 존재 증명: 무리수 a, b와 유리수 a^b', en: 'non-constructive existence: irrational a, b with rational a^b' },
        lang,
      ),
    );

  const drawBox = (
    cx: number, top: number, w: number, h: number,
    lines: readonly string[], fill: string, opacity: number, strong: boolean,
  ) => {
    g.append('rect')
      .attr('x', cx - w / 2).attr('y', top).attr('width', w).attr('height', h)
      .attr('rx', 8).attr('fill', fill).attr('opacity', opacity)
      .attr('stroke', fill).attr('stroke-width', strong ? 2.5 : 1.5);
    lines.forEach((line, i) => {
      g.append('text')
        .attr('x', cx).attr('y', top + 24 + i * 22)
        .attr('text-anchor', 'middle').attr('font-size', 13)
        .attr('font-weight', i === 0 ? 600 : 400).attr('fill', 'currentColor')
        .text(line);
    });
    return { top, bottom: top + h, cx };
  };

  const root = drawBox(
    width / 2, 6, 250, 62,
    ['c = √2^√2 ≈ 1.6325', localize({ ko: 'c는 유리수인가?', en: 'is c rational?' }, lang)],
    'var(--bound)', 0.25, false,
  );
  const leftCx = width * 0.27;
  const rightCx = width * 0.73;
  const left = drawBox(
    leftCx, 116, 270, 76,
    [
      localize({ ko: '예 → a = b = √2', en: 'yes → a = b = √2' }, lang),
      localize({ ko: 'a^b = c (유리수) ✓', en: 'a^b = c (rational) ✓' }, lang),
    ],
    'var(--accent)', 0.28, false,
  );
  const right = drawBox(
    rightCx, 116, 270, 76,
    [
      localize({ ko: '아니오 → a = c, b = √2', en: 'no → a = c, b = √2' }, lang),
      localize({ ko: 'a^b = (√2^√2)^√2 = 2 ✓', en: 'a^b = (√2^√2)^√2 = 2 ✓' }, lang),
    ],
    'var(--accent)', 0.28, false,
  );
  const join = drawBox(
    width / 2, 244, 300, 68,
    [
      localize({ ko: '어느 경우든 존재한다 ✓', en: 'existence either way ✓' }, lang),
      localize({ ko: '무리수 a, b와 유리수 a^b', en: 'irrational a, b with rational a^b' }, lang),
    ],
    'var(--accent)', 0.5, true,
  );

  // Connectors: root → branches → join.
  const link = (x1: number, y1: number, x2: number, y2: number) => {
    g.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
      .attr('stroke', 'currentColor').attr('stroke-width', 1.5).attr('opacity', 0.6);
  };
  link(root.cx, root.bottom, left.cx, left.top);
  link(root.cx, root.bottom, right.cx, right.top);
  link(left.cx, left.bottom, join.cx, join.top);
  link(right.cx, right.bottom, join.cx, join.top);

  g.append('text')
    .attr('x', width / 2).attr('y', join.bottom + 24)
    .attr('text-anchor', 'middle').attr('font-size', 12)
    .attr('fill', 'currentColor').attr('opacity', 0.8)
    .text(
      localize(
        { ko: '어느 갈래가 참인지는 끝내 밝히지 않는다 — 그래도 증명은 완전하다.', en: 'which branch is true is never revealed — yet the proof is complete.' },
        lang,
      ),
    );
}

function drawMain(chart: Chart, data: CasesExistenceData, lang: Lang): void {
  const { g } = chart;
  g.selectAll('*').remove();
  if (data.part === 'cases') {
    drawCases(chart, data, lang);
  } else {
    drawExistence(chart, lang);
  }
}

export default defineSimpleScene<CasesExistenceData>({
  model: casesExistenceModel,
  margin: MARGIN,
  fallbackHeight: 380,
  drawMain,
  slots: [
    {
      text: (data, lang) => (data.part === 'cases' ? casesReadout(data, lang) : existenceReadout(lang)),
      cssText: 'font-weight: 600; white-space: pre-line;',
    },
    {
      text: (data, lang) => (data.part === 'cases' ? casesExplain(data, lang) : existenceExplain(lang)),
      cssText: 'white-space: pre-line; margin-top: 4px;',
    },
    {
      text: (data, lang) => (data.part === 'cases' ? casesVerdict(lang) : existenceVerdict(lang)),
      cssText: 'font-weight: 600; white-space: pre-line; margin-top: 4px;',
    },
  ],
});
