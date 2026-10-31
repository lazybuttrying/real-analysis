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
import {
  arzelaAscoliModel,
  FAMILY_B,
  LIP_UNIFORM,
  type ArzelaData,
} from '../models/arzelaAscoli';

/**
 * The Arzela-Ascoli theorem, live. The equicontinuous family
 * f_a(x) = a sin(2x) with |a| <= 3/4 is uniformly bounded and uniformly
 * 3/2-Lipschitz, hence relatively compact in C([0, 1]). The demo
 * subsequence a_k = 1/2 + (-1)^k/(k + 2) is drawn member by member,
 * fading in strength with k, against the bold uniform limit
 * f* = (1/2) sin(2x); the readout tracks the sup-norm errors
 * 1/(k + 2) shrinking to zero. A second small chart shows the contrast
 * family x^n: not equicontinuous at 1, with a jumping pointwise limit,
 * so no subsequence converges uniformly.
 */

const MARGIN = { top: 48, right: 20, bottom: 44, left: 64 };
const ACCENT = 'var(--accent)';
const BOUND = 'var(--bound)';
const Y_PAD = FAMILY_B + 0.15;

function readoutText(data: ArzelaData, lang: Lang): string {
  const { members, supErrors } = data;
  const last = supErrors[supErrors.length - 1] ?? NaN;
  const chain = supErrors.map((e) => fmt(e, 4)).join(' \\to ');
  return localize(
    {
      ko: String.raw`등연속 수열 \(f_{a_k}(x) = a_k \sin 2x\), \(a_k = \frac{1}{2} + \frac{(-1)^k}{k+2}\): 상한 노름 오차 \(\lVert f_{a_k} - f^* \rVert_\infty = \frac{1}{k+2}\)가 \(${chain} \to \cdots\) 로 0으로 갑니다 (\(k = ${members}\)에서 \(\approx ${fmt(last, 4)}\)). 모든 \(|a_k| \le \frac{3}{4}\)는 \(\frac{3}{2}\)-Lipschitz이므로 극한 \(f^* = \frac{1}{2}\sin 2x\)로의 수렴은 균등수렴입니다.`,
      en: String.raw`Equicontinuous sequence \(f_{a_k}(x) = a_k \sin 2x\) with \(a_k = \frac{1}{2} + \frac{(-1)^k}{k+2}\): the sup-norm errors \(\lVert f_{a_k} - f^* \rVert_\infty = \frac{1}{k+2}\) shrink \(${chain} \to \cdots\) toward 0 (\(\approx ${fmt(last, 4)}\) at \(k = ${members}\)). Every \(|a_k| \le \frac{3}{4}\) is \(\frac{3}{2}\)-Lipschitz, so the convergence to the limit \(f^* = \frac{1}{2}\sin 2x\) is uniform.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`균등 유계 + 등연속 = 상대 컴팩트: 이 수열은 \(C([0,1])\)에서 균등수렴하는 부분수열을 가집니다 — Arzelà–Ascoli 정리.`,
      en: String.raw`Uniformly bounded + equicontinuous = relatively compact: this sequence has a uniformly convergent subsequence in \(C([0, 1])\) — the Arzelà–Ascoli theorem.`,
    },
    lang,
  );
}

function contrastNote(lang: Lang): string {
  return localize(
    {
      ko: String.raw`대조군 \(x^n\): \(x = 1\)에서 등연속이 깨지고, 점별 극한이 \([0,1)\)에서는 0, \(x = 1\)에서는 1로 점프합니다. 연속함수들의 균등 극한은 연속이므로, 균등수렴하는 부분수열은 없습니다 (표시된 서로 다른 두 항 사이의 상한 거리는 모두 0.47 이상).`,
      en: String.raw`Contrast \(x^n\): equicontinuity breaks at \(x = 1\), and the pointwise limit jumps — 0 on \([0, 1)\), 1 at \(x = 1\). A uniform limit of continuous functions is continuous, so no subsequence converges uniformly (pairwise sup distances between the shown members are all at least 0.47).`,
    },
    lang,
  );
}

function drawMembers(
  chart: Chart,
  data: ArzelaData,
  lang: Lang,
  title: string,
): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, 1]).range([0, width]);
  const y = scaleLinear().domain([-Y_PAD, Y_PAD]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
  g.append('g').call(axisLeft(y).ticks(6));

  g.append('text')
    .attr('x', 0)
    .attr('y', -28)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(title);

  const seg = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  const { xs, curves, members } = data;

  // Subsequence members, fading in with k (later members hug the limit).
  for (const c of curves) {
    const pts = xs.map((xx, j) => ({ x: xx, y: c.samples[j] ?? 0 }));
    const opacity = members <= 1 ? 0.9 : 0.25 + (0.65 * (c.k - 1)) / (members - 1);
    g.append('path')
      .datum(pts)
      .attr('fill', 'none')
      .attr('stroke-width', 1.6)
      .attr('opacity', opacity)
      .style('stroke', ACCENT)
      .attr('d', seg);
  }

  // Bold uniform limit f*.
  const limitPts = xs.map((xx, j) => ({ x: xx, y: data.limit[j] ?? 0 }));
  g.append('path')
    .datum(limitPts)
    .attr('fill', 'none')
    .attr('stroke-width', 3)
    .style('stroke', 'currentColor')
    .attr('d', seg);
  g.append('text')
    .attr('x', width - 4)
    .attr('y', y(data.limit[data.limit.length - 1] ?? 0) - 10)
    .attr('font-size', 12)
    .attr('text-anchor', 'end')
    .attr('fill', 'currentColor')
    .text(String.raw`f* = (1/2) sin 2x`);

  // Amplitude labels for the first and last drawn members.
  const first = curves[0];
  const lastC = curves[curves.length - 1];
  if (first && lastC) {
    g.append('text')
      .attr('x', 8)
      .attr('y', 16)
      .attr('font-size', 12)
      .attr('fill', ACCENT)
      .text(
        localize(
          { ko: `a_1 = ${fmt(first.a, 4)} … a_${members} = ${fmt(lastC.a, 4)} → 1/2`, en: `a_1 = ${fmt(first.a, 4)} … a_${members} = ${fmt(lastC.a, 4)} → 1/2` },
          lang,
        ),
      );
  }
}

function drawContrast(chart: Chart, data: ArzelaData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, 1]).range([0, width]);
  const y = scaleLinear().domain([-0.06, 1.06]).range([height, 0]);

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
  g.append('g').call(axisLeft(y).ticks(4));

  g.append('text')
    .attr('x', 0)
    .attr('y', -24)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '대조군: x^n — 등연속이 아닌 수열', en: 'Contrast: x^n — a non-equicontinuous sequence' }, lang));

  const seg = line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));
  const { xs, contrast, contrastNs } = data;
  for (let i = 0; i < contrast.length; i++) {
    const samples = contrast[i] ?? [];
    const pts = xs.map((xx, j) => ({ x: xx, y: samples[j] ?? 0 }));
    g.append('path')
      .datum(pts)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('opacity', 0.55 + 0.45 * (i / Math.max(1, contrast.length - 1)))
      .style('stroke', BOUND)
      .attr('d', seg);
    const n = contrastNs[i] ?? 0;
    g.append('text')
      .attr('x', x(0.04))
      .attr('y', y((samples[Math.floor(samples.length * 0.55)] ?? 0) + 0.05))
      .attr('font-size', 12)
      .attr('fill', BOUND)
      .text(`x^${n}`);
  }

  // The jump of the pointwise limit at x = 1.
  g.append('circle').attr('cx', x(1)).attr('cy', y(1)).attr('r', 4).style('fill', BOUND);
  g.append('text')
    .attr('x', x(1) - 8)
    .attr('y', y(1) - 10)
    .attr('font-size', 12)
    .attr('text-anchor', 'end')
    .attr('fill', 'currentColor')
    .text(localize({ ko: '점별 극한이 여기서 점프', en: 'pointwise limit jumps here' }, lang));
}

function createArzelaAscoliScene(): Scene<ArzelaData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let contrastChart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let contrastWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let contrastSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ArzelaData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !contrastChart || !last || !readoutSlot || !verdictSlot || !contrastSlot) return;
    const { data } = last;
    drawMembers(
      chart,
      data,
      lang,
      localize(
        {
          ko: `등연속 수열 fₐₖ → f*: 균등 유계(≤ 3/4) + ${LIP_UNIFORM}-Lipschitz`,
          en: `Equicontinuous sequence fₐₖ → f*: uniformly bounded (≤ 3/4) + ${LIP_UNIFORM}-Lipschitz`,
        },
        lang,
      ),
    );
    drawContrast(contrastChart, data, lang);
    setRichText(readoutSlot, readoutText(data, lang));
    setRichText(verdictSlot, verdictText(lang));
    setRichText(contrastSlot, contrastNote(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      const contrastNoteEl = document.createElement('div');
      contrastNoteEl.style.marginTop = '6px';

      // Second small chart: the x^n contrast, living in the strips area.
      contrastWrap = document.createElement('div');
      contrastWrap.style.cssText = 'height: 250px; margin-top: 10px; position: relative;';
      contrastChart = createChart(contrastWrap, MARGIN);

      // Cross-link: the uniform convergence scene this result leans on.
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const uniformLink = document.createElement('a');
      uniformLink.href = '../uniform/';
      uniformLink.textContent = localize(
        { ko: '균등수렴 씬 — 균등 극한은 연속이다', en: 'Uniform convergence scene — uniform limits are continuous' },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), uniformLink);

      shell.strips.append(readout, verdict, contrastWrap, contrastNoteEl, seeAlso);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      contrastSlot = createRichSlot(contrastNoteEl);
      wrap = shell.chartWrap;
      chart = createChart(shell.chartWrap, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (chart && wrap) {
        chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || 360);
      }
      if (contrastChart && contrastWrap) {
        contrastChart.setSize(contrastWrap.clientWidth || 640, 250);
      }
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      contrastChart?.destroy();
      contrastChart = undefined;
      readoutSlot = undefined;
      verdictSlot = undefined;
      contrastSlot = undefined;
      wrap = undefined;
      contrastWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<ArzelaData>({ model: arzelaAscoliModel, createScene: createArzelaAscoliScene });
