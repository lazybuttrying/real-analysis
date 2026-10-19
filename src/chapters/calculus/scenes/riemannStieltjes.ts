import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { riemannStieltjesModel, type RiemannStieltjesData } from '../models/riemannStieltjes';

/**
 * Tao, Analysis I, Section 11.8, live. Top panel: ordinary upper/lower bars
 * for f(x) = x on the uniform partition P_n. Bottom panel: the same sums on
 * the alpha-stretched axis — each strip's width is Delta alpha_i =
 * alpha(x_i) - alpha(x_{i-1}), so the integrator visibly stretches (square),
 * collapses almost everything (step), or does nothing (identity, where the
 * RS sums are exactly the Riemann sums).
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

const ALPHA_NAME: Record<string, { ko: string; en: string }> = {
  identity: { ko: '항등원 α(x) = x', en: 'identity α(x) = x' },
  square: { ko: '제곱 α(x) = x²', en: 'square α(x) = x²' },
  step: { ko: '계단 α (x < 1/2에서 0, x ≥ 1/2에서 1)', en: 'step α (0 for x < 1/2, 1 for x ≥ 1/2)' },
};

function alphaName(alpha: string, lang: Lang): string {
  return localize(
    (ALPHA_NAME[alpha] ?? ALPHA_NAME['identity']) as { ko: string; en: string },
    lang,
  );
}

function readoutText(data: RiemannStieltjesData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`${alphaName(data.alpha, 'ko')}, \(n = ${data.n}\): \(U(f, P_n, \alpha) = ${fmt(data.upper, 6)}\), \(L(f, P_n, \alpha) = ${fmt(data.lower, 6)}\), 엄밀값 \(\int_0^1 f\,d\alpha = ${fmt(data.exact, 6)}\).`,
      en: String.raw`${alphaName(data.alpha, 'en')}, \(n = ${data.n}\): \(U(f, P_n, \alpha) = ${fmt(data.upper, 6)}\), \(L(f, P_n, \alpha) = ${fmt(data.lower, 6)}\), exact \(\int_0^1 f\,d\alpha = ${fmt(data.exact, 6)}\).`,
    },
    lang,
  );
}

function explainText(data: RiemannStieltjesData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`위쪽 패널은 평범한 리만합 막대이고, 아래쪽 패널은 각 막대 너비를 \(\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1})\)로 늘이고 줄인 그림입니다 — \(\alpha\)가 \(x\)축을 늘이고 줄이는 모습 그대로입니다.`,
      en: String.raw`The top panel shows the ordinary Riemann-sum bars; the bottom panel stretches each bar's width to \(\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1})\) — exactly how \(\alpha\) stretches and squeezes the \(x\)-axis.`,
    },
    lang,
  );
  const identityNote =
    data.alpha === 'identity'
      ? localize(
          {
            ko: String.raw` 지금은 \(\alpha(x) = x\)이므로 \(\Delta\alpha_i = \Delta x_i\) — 아래쪽 패널은 위쪽과 같고, RS 합은 리만합 그 자체입니다 (아래 문제 1).`,
            en: String.raw` Right now \(\alpha(x) = x\), so \(\Delta\alpha_i = \Delta x_i\) — the bottom panel matches the top, and the RS sums are the Riemann sums themselves (problem 1 below).`,
          },
          lang,
        )
      : data.alpha === 'step'
        ? localize(
            {
              ko: String.raw` 계단 \(\alpha\)는 점프 지점을 품은 구간 하나를 제외하고 모든 \(\Delta\alpha_i = 0\)으로 만들어 버립니다 — 0 너비 막대가 전부 사라지고 점프 하나만 남습니다 (아래 문제 2).`,
              en: String.raw` The step \(\alpha\) forces every \(\Delta\alpha_i = 0\) except on the one interval containing the jump — all zero-width bars vanish, leaving a single jump strip (problem 2 below).`,
            },
            lang,
          )
        : '';
  return body + identityNote;
}

function verdictText(data: RiemannStieltjesData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(n \to \infty\)에서 \(U\)와 \(L\)이 \(\int_0^1 f\,d\alpha = ${fmt(data.exact, 6)}\)으로 모입니다 — 적분자는 \(f\) 그대로인데, 무게를 재는 자가 \(\alpha\)로 바뀐 것입니다.`,
      en: String.raw`As \(n \to \infty\), \(U\) and \(L\) converge to \(\int_0^1 f\,d\alpha = ${fmt(data.exact, 6)}\) — the integrand is still \(f\); only the measuring stick has changed to \(\alpha\).`,
    },
    lang,
  );
}

function createRiemannStieltjesScene(): Scene<RiemannStieltjesData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: RiemannStieltjesData; state: ControlState } | undefined;

  const drawMain = (data: RiemannStieltjesData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const gap = 14;
    const topH = Math.max(0, (height - gap) * 0.55);
    const botH = Math.max(0, height - gap - topH);
    const botY = topH + gap;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const yTop = scaleLinear().domain([0, 1.08]).range([topH, 0]);

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: `f(x) = x, ${alphaName(data.alpha, 'ko')}: 리만합 막대 vs α-늘이기 막대`, en: `f(x) = x, ${alphaName(data.alpha, 'en')}: Riemann bars vs α-stretched bars` },
          lang,
        ),
      );

    // --- Top panel: ordinary bars on [0,1]. ---
    g.append('g').attr('transform', `translate(0,${topH})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(yTop).ticks(4));

    for (const seg of data.intervals) {
      g.append('rect')
        .attr('x', x(seg.x0))
        .attr('width', Math.max(0, x(seg.x1) - x(seg.x0) - 0.5))
        .attr('y', yTop(seg.hi))
        .attr('height', Math.max(0, yTop(0) - yTop(seg.hi)))
        .attr('fill', 'var(--bound)')
        .attr('opacity', 0.22);
    }
    for (const seg of data.intervals) {
      g.append('rect')
        .attr('x', x(seg.x0))
        .attr('width', Math.max(0, x(seg.x1) - x(seg.x0) - 0.5))
        .attr('y', yTop(seg.lo))
        .attr('height', Math.max(0, yTop(0) - yTop(seg.lo)))
        .style('fill', 'var(--accent)')
        .attr('opacity', 0.55);
    }
    const curvePts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= 100; i++) {
      const px = i / 100;
      curvePts.push({ x: px, y: px });
    }
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'currentColor')
      .attr('d', line<{ x: number; y: number }>().x((p) => x(p.x)).y((p) => yTop(p.y))(curvePts) ?? '');
    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(localize({ ko: 'x축 (균등 분할)', en: 'x-axis (uniform partition)' }, lang));

    // --- Bottom panel: the alpha-stretched axis. ---
    const aX = scaleLinear().domain([0, 1]).range([0, width]);
    const yBot = scaleLinear().domain([0, 1.08]).range([botH, 0]);
    const gb = g.append('g').attr('transform', `translate(0,${botY})`);

    for (const seg of data.intervals) {
      gb.append('rect')
        .attr('x', aX(seg.a0))
        .attr('width', Math.max(0, aX(seg.a1) - aX(seg.a0) - 0.5))
        .attr('y', yBot(seg.hi))
        .attr('height', Math.max(0, yBot(0) - yBot(seg.hi)))
        .attr('fill', 'var(--bound)')
        .attr('opacity', 0.22);
    }
    for (const seg of data.intervals) {
      gb.append('rect')
        .attr('x', aX(seg.a0))
        .attr('width', Math.max(0, aX(seg.a1) - aX(seg.a0) - 0.5))
        .attr('y', yBot(seg.lo))
        .attr('height', Math.max(0, yBot(0) - yBot(seg.lo)))
        .style('fill', 'var(--accent)')
        .attr('opacity', 0.55);
    }
    // Markers where partition points land on the stretched axis.
    for (const seg of data.intervals) {
      gb.append('line')
        .attr('x1', aX(seg.a1))
        .attr('x2', aX(seg.a1))
        .attr('y1', 0)
        .attr('y2', botH)
        .attr('stroke-width', 1)
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.4);
    }
    gb.append('g').attr('transform', `translate(0,${botH})`).call(axisBottom(aX).ticks(6));
    gb.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(localize({ ko: 'α(x)축 (너비 = Δαᵢ)', en: 'α(x)-axis (width = Δαᵢ)' }, lang));

    // Readout numbers on the chart.
    g.append('text')
      .attr('x', width)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`n = ${data.n} · U = ${fmt(data.upper, 4)} · L = ${fmt(data.lower, 4)} · exact = ${fmt(data.exact, 4)}`);
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot || !verdictSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(last.data, lang));
    setRichText(verdictSlot, verdictText(last.data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainChart = createChart(mainWrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const explain = document.createElement('div');
      explain.style.marginTop = '4px';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      verdict.style.marginTop = '4px';

      shell.strips.append(readout, explain, verdict);
      readoutSlot = createRichSlot(readout);
      explainSlot = createRichSlot(explain);
      verdictSlot = createRichSlot(verdict);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (mainChart && mainWrap) mainChart.setSize(mainWrap.clientWidth || 640, mainWrap.clientHeight || 300);
      draw();
    },
    dispose() {
      mainChart?.destroy();
      mainChart = undefined;
      readoutSlot = undefined;
      explainSlot = undefined;
      verdictSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<RiemannStieltjesData>({ model: riemannStieltjesModel, createScene: createRiemannStieltjesScene });
