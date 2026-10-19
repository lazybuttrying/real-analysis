import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { riemannLebesgueModel, RL_TWO_PI, type RiemannLebesgueData } from '../models/riemannLebesgue';

/**
 * Riemann-Lebesgue lemma, live. Top panel: the probe integrand
 * f(x) sin(nx) (or f(x) cos(nx)) — the positive and negative lobes are large
 * but cancel almost exactly. Bottom panel: stems of |a_n| or |b_n| decaying
 * to 0; smoother f decays faster (step 1/n, tent 1/n^2, smooth exact).
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

const MODE_NAME: Record<string, { ko: string; en: string }> = {
  step: { ko: '계단 f = 1_[0, π]', en: 'step f = 1_[0, π]' },
  tent: { ko: '텐트 f = max(0, 1 − |x−π|/π)', en: 'tent f = max(0, 1 − |x−π|/π)' },
  smooth: { ko: '매끈 f = sin²x', en: 'smooth f = sin²x' },
};

function modeName(mode: string, lang: Lang): string {
  return localize(
    (MODE_NAME[mode] ?? MODE_NAME['step']) as { ko: string; en: string },
    lang,
  );
}

function kindLabel(kind: string): string {
  return kind === 'a' ? 'a' : 'b';
}

function trigLabel(kind: string, n: number): string {
  return kind === 'a' ? `cos(${n}x)` : `sin(${n}x)`;
}

function readoutText(data: RiemannLebesgueData, lang: Lang): string {
  const k = kindLabel(data.kind);
  return localize(
    {
      ko: String.raw`${modeName(data.mode, 'ko')}, \(|${k}_1|, \dots, |${k}_{${data.nMax}}|\) 중 최댓값 \(= ${fmt(data.maxShown, 6)}\). 탐침 \(f(x)\,${trigLabel(data.kind, data.probeN)}\): 적분 \(\approx ${fmt(data.probeIntegral, 8)}\), 양의 넓이 \({fmt(data.positiveArea, 4)}\), 음의 넓이 \({fmt(data.negativeArea, 4)}\) — 넓이는 크지만 상쇄됩니다.`,
      en: String.raw`${modeName(data.mode, 'en')}, max of \(|${k}_1|, \dots, |${k}_{${data.nMax}}|\) \(= ${fmt(data.maxShown, 6)}\). Probe \(f(x)\,${trigLabel(data.kind, data.probeN)}\): integral \(\approx ${fmt(data.probeIntegral, 8)}\), positive area \({fmt(data.positiveArea, 4)}\), negative area \({fmt(data.negativeArea, 4)}\) — the areas are large but cancel.`,
    },
    lang,
  );
}

function explainText(data: RiemannLebesgueData, lang: Lang): string {
  const k = kindLabel(data.kind);
  const body = localize(
    {
      ko: String.raw`위쪽 패널은 \(n\)이 커질수록 진동이 빨라지는 \(f(x)\,${trigLabel(data.kind, data.probeN)}\)입니다 — 양·음의 잎(lobe)이 거의 똑같은 크기로 번갈아 나타나 적분이 0으로 상쇄됩니다. 아래쪽 줄기 그림은 \(|${k}_n|\)이 0으로 가라앉는 모습 그 자체입니다.`,
      en: String.raw`The top panel shows \(f(x)\,${trigLabel(data.kind, data.probeN)}\), oscillating faster as \(n\) grows — the positive and negative lobes alternate at nearly equal size, so the integral cancels to 0. The stem plot below is \(|${k}_n|\) sinking to 0.`,
    },
    lang,
  );
  const decayNote =
    data.mode === 'step'
      ? localize(
          {
            ko: String.raw` 계단 함수는 불연속이라 \(|b_n| \sim 1/n\)으로 느리게 갑니다 (홀수 \(n\)에서 \(|b_n| = 2/(n\pi)\), 짝수 \(n\)에서 0 — 아래 문제 1).`,
            en: String.raw` The step function is discontinuous, so \(|b_n| \sim 1/n\) decays slowly (\(|b_n| = 2/(n\pi)\) for odd \(n\), 0 for even \(n\) — problem 1 below).`,
          },
          lang,
        )
      : data.mode === 'tent'
        ? localize(
            {
              ko: String.raw` 텐트는 연속이라 \(|a_n| \sim 1/n^2\)으로 더 빨리 갑니다 (홀수 \(n\)에서 \(|a_n| = 4/(\pi^2 n^2)\)) — 매끄러울수록 계수가 빨리 죽습니다.`,
              en: String.raw` The tent is continuous, so \(|a_n| \sim 1/n^2\) decays faster (\(|a_n| = 4/(\pi^2 n^2)\) for odd \(n\)) — smoother means faster coefficient decay.`,
            },
            lang,
          )
        : localize(
            {
              ko: String.raw` \(\sin^2 x = \frac{1 - \cos 2x}{2}\)이므로 \(a_2 = -1/2\) 하나만 남고 나머지는 정확히 0입니다 — 유한 푸리에 급수라 감쇠가 아니라 소멸입니다.`,
              en: String.raw` Since \(\sin^2 x = \frac{1 - \cos 2x}{2}\), only \(a_2 = -1/2\) survives and the rest are exactly 0 — a finite Fourier series, so the coefficients vanish rather than decay.`,
            },
            lang,
          );
  return body + decayNote;
}

function verdictText(data: RiemannLebesgueData, lang: Lang): string {
  const k = kindLabel(data.kind);
  return localize(
    {
      ko: String.raw`\(n \to \infty\)에서 \(|${k}_n| \to 0\) — 적분 가능한 함수라면 푸리에 계수는 반드시 0으로 갑니다. 이것이 리만-르베그 보조정리입니다.`,
      en: String.raw`As \(n \to \infty\), \(|${k}_n| \to 0\) — for any integrable function the Fourier coefficients must go to 0. That is the Riemann–Lebesgue lemma.`,
    },
    lang,
  );
}

function createRiemannLebesgueScene(): Scene<RiemannLebesgueData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: RiemannLebesgueData; state: ControlState } | undefined;

  const drawMain = (data: RiemannLebesgueData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const gap = 14;
    const topH = Math.max(0, (height - gap) * 0.55);
    const botH = Math.max(0, height - gap - topH);
    const botY = topH + gap;

    const k = kindLabel(data.kind);

    // --- Top panel: the probe integrand with signed-area fills. ---
    const x = scaleLinear().domain([0, RL_TWO_PI]).range([0, width]);
    const yMax = Math.max(1e-9, ...data.probeYs.map((v) => Math.abs(v))) * 1.1;
    const y = scaleLinear().domain([-yMax, yMax]).range([topH, 0]);
    const pos = data.probeYs.map((v) => Math.max(v, 0));
    const neg = data.probeYs.map((v) => Math.min(v, 0));
    const areaPos = area<number>()
      .x((_, i) => x(data.probeXs[i]!))
      .y0(y(0))
      .y1((v) => y(v));
    const areaNeg = area<number>()
      .x((_, i) => x(data.probeXs[i]!))
      .y0(y(0))
      .y1((v) => y(v));

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `${modeName(data.mode, 'ko')}: 탐침 f(x)${trigLabel(data.kind, data.probeN)} — 부호 있는 넓이의 상쇄`,
            en: `${modeName(data.mode, 'en')}: probe f(x)${trigLabel(data.kind, data.probeN)} — signed areas canceling`,
          },
          lang,
        ),
      );

    g.append('path').attr('d', areaPos(pos) ?? '').attr('fill', 'var(--accent)').attr('opacity', 0.45);
    g.append('path').attr('d', areaNeg(neg) ?? '').attr('fill', 'var(--bound)').attr('opacity', 0.45);
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'currentColor')
      .attr(
        'd',
        line<number>()
          .x((_, i) => x(data.probeXs[i]!))
          .y((v) => y(v))(data.probeYs) ?? '',
      );
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke-width', 1)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.6);
    g.append('g').attr('transform', `translate(0,${topH})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(4));

    // --- Bottom panel: stem plot of |coeff| decaying to 0. ---
    const gb = g.append('g').attr('transform', `translate(0,${botY})`);
    const xs = scaleLinear().domain([0, data.nMax + 1]).range([0, width]);
    const yTop2 = Math.max(data.maxShown * 1.15, data.maxShown > 0 ? 0 : 1);
    const ys = scaleLinear().domain([0, yTop2]).range([botH, 0]);

    for (let n = 1; n <= data.nMax; n++) {
      const v = data.shown[n - 1]!;
      gb.append('line')
        .attr('x1', xs(n))
        .attr('x2', xs(n))
        .attr('y1', ys(0))
        .attr('y2', ys(v))
        .attr('stroke-width', 2)
        .attr('stroke', 'var(--accent)')
        .attr('opacity', 0.8);
      gb.append('circle')
        .attr('cx', xs(n))
        .attr('cy', ys(v))
        .attr('r', 2.5)
        .attr('fill', 'var(--accent)');
    }
    gb.append('g').attr('transform', `translate(0,${botH})`).call(axisBottom(xs).ticks(Math.min(data.nMax, 10)));
    gb.append('g').call(axisLeft(ys).ticks(4));
    gb.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`|${k}_n|, n = 1..${data.nMax}`);

    // Readout numbers on the chart.
    g.append('text')
      .attr('x', width)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        `n = ${data.probeN} · ∫ ≈ ${fmt(data.probeIntegral, 6)} · max|${k}_n| = ${fmt(data.maxShown, 6)}`,
      );
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

export default defineScene<RiemannLebesgueData>({ model: riemannLebesgueModel, createScene: createRiemannLebesgueScene });
