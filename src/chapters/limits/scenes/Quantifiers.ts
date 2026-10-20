import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { quantifiersModel, type QuantifierData } from '../models/quantifiers';

/**
 * Universal and existential quantifiers on the real line. The number line
 * shows the game each statement encodes: for forall-exists the challenger's
 * x is answered by the witness y = x + 1; for exists-forall the candidate y
 * is defeated by x' = y + 1; for eps-delta the two stacked lines show the
 * t-band (-delta, delta) mapping into the value band (-eps, eps).
 */

const MARGIN = { top: 36, right: 24, bottom: 48, left: 40 };

function drawPoint(
  chart: Chart,
  xScale: (v: number) => number,
  y: number,
  value: number,
  fill: string,
  label: string,
  labelAbove: boolean,
  r = 7,
): void {
  const { g } = chart;
  g.append('circle')
    .attr('cx', xScale(value))
    .attr('cy', y)
    .attr('r', r)
    .attr('fill', fill)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5);
  g.append('text')
    .attr('x', xScale(value))
    .attr('y', y + (labelAbove ? -14 : 20))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(label);
}

function drawGameLine(chart: Chart, data: QuantifierData, lang: Lang): void {
  const { g, width, height } = chart;
  const y = height / 2;

  let lo: number;
  let hi: number;
  let points: Array<{ value: number; fill: string; label: string; above: boolean }> = [];
  let arrow: { from: number; to: number } | undefined;
  let caption: string;

  if (data.statement === 'forall-exists') {
    lo = Math.min(data.challengerX, data.witness) - 2;
    hi = Math.max(data.challengerX, data.witness) + 2;
    points = [
      {
        value: data.challengerX,
        fill: 'var(--accent)',
        label: `x = ${fmt(data.challengerX, 1)}`,
        above: true,
      },
      {
        value: data.witness,
        fill: 'var(--bound)',
        label: `y = x+1 = ${fmt(data.witness, 1)}`,
        above: false,
      },
    ];
    arrow = { from: data.challengerX, to: data.witness };
    caption = localize(
      {
        ko: '도전자 x에 답 y = x+1 — 항상 y > x이므로 명제는 참',
        en: 'Answer the challenger x with y = x+1 — always y > x, so the statement is true',
      },
      lang,
    );
  } else {
    lo = Math.min(data.candidateY, data.refutingX) - 2;
    hi = Math.max(data.candidateY, data.refutingX) + 2;
    points = [
      {
        value: data.candidateY,
        fill: 'var(--accent)',
        label: `candidate y = ${fmt(data.candidateY, 1)}`,
        above: true,
      },
      {
        value: data.refutingX,
        fill: '#c62828',
        label: `x' = y+1 = ${fmt(data.refutingX, 1)} ✗`,
        above: false,
      },
    ];
    arrow = { from: data.candidateY, to: data.refutingX };
    caption = localize(
      {
        ko: `후보 y = ${fmt(data.candidateY, 1)}는 x' = ${fmt(data.refutingX, 1)}에서 무너짐 — y > x'가 거짓이므로 명제는 거짓`,
        en: `Candidate y = ${fmt(data.candidateY, 1)} falls at x' = ${fmt(data.refutingX, 1)} — y > x' is false, so the statement is false`,
      },
      lang,
    );
  }

  const x = scaleLinear().domain([lo, hi]).range([0, width]);
  g.append('g')
    .attr('transform', `translate(0,${y + 34})`)
    .call(axisBottom(x).ticks(9));
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y)
    .attr('y2', y)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2)
    .attr('opacity', 0.4);

  // Arrow showing who answers whom.
  const arrowHeadSize = 9;
  g.append('defs')
    .append('marker')
    .attr('id', 'quant-arrow')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 9)
    .attr('refY', 5)
    .attr('markerWidth', arrowHeadSize)
    .attr('markerHeight', arrowHeadSize)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('fill', 'currentColor');
  g.append('line')
    .attr('x1', x(arrow.from))
    .attr('x2', x(arrow.to))
    .attr('y1', y - 26)
    .attr('y2', y - 26)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.8)
    .attr('opacity', 0.7)
    .attr('marker-end', 'url(#quant-arrow)');

  for (const p of points) drawPoint(chart, x, y, p.value, p.fill, p.label, p.above);

  g.append('text')
    .attr('x', 0)
    .attr('y', height - 6)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.8)
    .text(caption);
}

function drawEpsDelta(chart: Chart, data: QuantifierData, lang: Lang): void {
  const { g, width, height } = chart;
  const tY = height * 0.3;
  const vY = height * 0.72;

  const t = scaleLinear()
    .domain([-data.delta * 1.7, data.delta * 1.7])
    .range([0, width]);
  const v = scaleLinear()
    .domain([-data.eps * 1.25, data.eps * 1.25])
    .range([0, width]);

  const band = (
    xScale: (n: number) => number,
    yy: number,
    a: number,
    b: number,
    label: string,
  ): void => {
    g.append('rect')
      .attr('x', xScale(a))
      .attr('y', yy - 16)
      .attr('width', Math.max(0, xScale(b) - xScale(a)))
      .attr('height', 32)
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.18);
    g.append('text')
      .attr('x', xScale(b) + 6)
      .attr('y', yy + 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(label);
  };

  band(t, tY, -data.delta, data.delta, `δ = ${fmt(data.delta, 2)}`);
  band(v, vY, -data.eps, data.eps, `ε = ${fmt(data.eps, 2)}`);

  g.append('g').attr('transform', `translate(0,${tY + 22})`).call(axisBottom(t).ticks(7));
  g.append('g').attr('transform', `translate(0,${vY + 22})`).call(axisBottom(v).ticks(7));

  g.append('text')
    .attr('x', 0)
    .attr('y', tY - 26)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: 't-축: |t| < δ 구간', en: 't-axis: the band |t| < δ' }, lang));
  g.append('text')
    .attr('x', 0)
    .attr('y', vY - 26)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: '값-축: f(t) = 2t, |2t| < ε 구간', en: 'value axis: f(t) = 2t, the band |2t| < ε' },
        lang,
      ),
    );

  // The probe point on each line.
  drawPoint(
    chart,
    t,
    tY,
    data.probeT,
    'var(--accent)',
    `t = 0.9δ = ${fmt(data.probeT, 2)}`,
    true,
  );
  drawPoint(
    chart,
    v,
    vY,
    data.probeValue,
    'var(--accent)',
    `|2t| = 0.9ε = ${fmt(data.probeValue, 2)} < ε`,
    true,
  );

  // Dashed connector: the probe maps into the value band.
  g.append('line')
    .attr('x1', t(data.probeT))
    .attr('x2', v(data.probeValue))
    .attr('y1', tY + 8)
    .attr('y2', vY - 8)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 3')
    .attr('opacity', 0.6);
}

function drawMain(chart: Chart, data: QuantifierData, lang: Lang): void {
  const { g } = chart;
  g.selectAll('*').remove();

  const titles: Record<QuantifierData['statement'], string> = {
    'forall-exists': localize(
      { ko: '∀x ∃y (y > x) — 참', en: '∀x ∃y (y > x) — true' },
      lang,
    ),
    'exists-forall': localize(
      { ko: '∃y ∀x (y > x) — 거짓', en: '∃y ∀x (y > x) — false' },
      lang,
    ),
    'eps-delta': localize(
      {
        ko: `∀ε>0 ∃δ>0 ∀t (|t| < δ → |2t| < ε) — 참 (δ = ε/2)`,
        en: `∀ε>0 ∃δ>0 ∀t (|t| < δ → |2t| < ε) — true (δ = ε/2)`,
      },
      lang,
    ),
  };

  g.append('text')
    .attr('x', 0)
    .attr('y', -16)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(titles[data.statement]);

  if (data.statement === 'eps-delta') drawEpsDelta(chart, data, lang);
  else drawGameLine(chart, data, lang);
}

function statementWords(data: QuantifierData, lang: Lang): string {
  switch (data.statement) {
    case 'forall-exists':
      return localize(
        {
          ko: String.raw`명제 \(\forall x \,\exists y \,(y > x)\): "모든 실수 \(x\)에 대해 \(x\)보다 큰 실수 \(y\)가 존재한다". 판정: 참.
도전값 \(x = ${fmt(data.challengerX, 1)}\)에 대한 답은 \(y = x + 1 = ${fmt(data.witness, 1)}\): \({fmt(data.witness, 1)} > ${fmt(data.challengerX, 1)}\)이 성립합니다.`,
          en: String.raw`Statement \(\forall x \,\exists y \,(y > x)\): "for every real \(x\) there is a real \(y\) with \(y > x\)". Verdict: true.
Given the challenge \(x = ${fmt(data.challengerX, 1)}\), answer \(y = x + 1 = ${fmt(data.witness, 1)}\): \({fmt(data.witness, 1)} > ${fmt(data.challengerX, 1)}\) holds.`,
        },
        lang,
      );
    case 'exists-forall':
      return localize(
        {
          ko: String.raw`명제 \(\exists y \,\forall x \,(y > x)\): "모든 실수 \(x\)보다 큰 실수 \(y\)가 존재한다". 판정: 거짓.
후보 \(y = ${fmt(data.candidateY, 1)}\)에 도전자는 \(x' = y + 1 = ${fmt(data.refutingX, 1)}\)로 반격합니다: \({fmt(data.candidateY, 1)} > ${fmt(data.refutingX, 1)}\)이 거짓이므로 이 \(y\)는 실패합니다 — 모든 후보가 이렇게 무너집니다.`,
          en: String.raw`Statement \(\exists y \,\forall x \,(y > x)\): "there is a real \(y\) larger than every real \(x\)". Verdict: false.
Against the candidate \(y = ${fmt(data.candidateY, 1)}\) the challenger plays \(x' = y + 1 = ${fmt(data.refutingX, 1)}\): since \({fmt(data.candidateY, 1)} > ${fmt(data.refutingX, 1)}\) is false, this \(y\) fails — and every candidate falls this way.`,
        },
        lang,
      );
    case 'eps-delta':
      return localize(
        {
          ko: String.raw`명제 \(\forall \varepsilon > 0 \,\exists \delta > 0 \,\forall t \,(|t| < \delta \to |2t| < \varepsilon)\): "\(f(t) = 2t\)는 0에서 연속". 판정: 참.
슬라이더 \(x = ${fmt(data.x, 1)}\)에서 \(\varepsilon = |x| + 0.5 = ${fmt(data.eps, 2)}\), 답은 \(\delta = \varepsilon/2 = ${fmt(data.delta, 2)}\).
탐침 \(t = 0.9\delta = ${fmt(data.probeT, 2)}\): \(|t| < \delta\)이고 \(|2t| = ${fmt(data.probeValue, 2)} < ${fmt(data.eps, 2)} = \varepsilon\) — \(|2t| < 2\delta = \varepsilon\)이므로 \(\delta = \varepsilon/2\)는 항상 통합니다.`,
          en: String.raw`Statement \(\forall \varepsilon > 0 \,\exists \delta > 0 \,\forall t \,(|t| < \delta \to |2t| < \varepsilon)\): "\(f(t) = 2t\) is continuous at 0". Verdict: true.
From the slider \(x = ${fmt(data.x, 1)}\): \(\varepsilon = |x| + 0.5 = ${fmt(data.eps, 2)}\); answer \(\delta = \varepsilon/2 = ${fmt(data.delta, 2)}\).
Probe \(t = 0.9\delta = ${fmt(data.probeT, 2)}\): \(|t| < \delta\) and \(|2t| = ${fmt(data.probeValue, 2)} < ${fmt(data.eps, 2)} = \varepsilon\) — since \(|2t| < 2\delta = \varepsilon\), the choice \(\delta = \varepsilon/2\) always works.`,
        },
        lang,
      );
  }
}

function negationText(data: QuantifierData, lang: Lang): string {
  if (!data.showNegation) {
    return localize(
      {
        ko: '부정 사슬을 보려면 "부정 보기" 토글을 켜세요 — 바깥의 ¬가 안으로 밀려들어가며 모든 양화사가 뒤집힙니다.',
        en: 'Turn on the "Show negation" toggle to see the negation chain — the outer ¬ pushes inward, flipping every quantifier.',
      },
      lang,
    );
  }
  const chain = data.negationSteps.join('\n');
  return localize(
    {
      ko: `부정 사슬 (¬가 안으로 밀려들며 ∀↔∃ 뒤집힘):\n${chain}`,
      en: `Negation chain (¬ pushes inward, flipping ∀↔∃):\n${chain}`,
    },
    lang,
  );
}

function engineText(_data: QuantifierData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`부정은 양화사를 뒤집습니다: \(\lnot\forall = \exists\lnot\), \(\lnot\exists = \forall\lnot\).
\(\varepsilon\)-\(\delta\) 정의가 바로 이 패턴입니다 — "모든 오차 한계 \(\varepsilon\)에 대해, 그것을 만족하는 허용 오차 \(\delta\)가 존재한다".
모든 극한 증명의 뼈대가 이 \(\forall\varepsilon\,\exists\delta\) 게임입니다.`,
      en: String.raw`Negation flips quantifiers: \(\lnot\forall = \exists\lnot\), \(\lnot\exists = \forall\lnot\).
The \(\varepsilon\)-\(\delta\) definition is exactly this pattern — "for every error budget \(\varepsilon\) there exists a tolerance \(\delta\) meeting it".
This \(\forall\varepsilon\,\exists\delta\) game is the backbone of every limit proof.`,
    },
    lang,
  );
}

export default defineSimpleScene<QuantifierData>({
  model: quantifiersModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: statementWords, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: negationText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: engineText, cssText: 'white-space: pre-line; margin-top: 4px;' },
  ],
});
