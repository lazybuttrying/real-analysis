import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, type Chart, type SceneShell } from '../../../view/d3kit';
import { bohrMollerupModel, type BohrMollerupData } from '../models/bohrMollerup';

/**
 * Bohr-Mollerup, live. The panel plots ln Gamma (the reference, log-convex)
 * and ln f_a, the impostor f_a(x) = Gamma(x)(1 + a sin(2 pi x)). The impostor
 * satisfies f(1) = 1 and f(x+1) = x f(x), but the sine wobble breaks
 * log-convexity. A secant segment over [x0, x0+1] on the impostor is drawn;
 * wherever the chord dips below the graph (shaded), convexity fails.
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 64 };

function readoutText(data: BohrMollerupData, lang: Lang): string {
  const { amp, probe, violationF, violationG } = data;
  return localize(
    {
      ko: String.raw`\(a = ${amp.toFixed(2)}\), \(x_0 = ${probe.toFixed(1)}\): impostor \(\ln f_a\)의 secant 위반량 \(\approx ${violationF.toFixed(4)}\) — 현이 그래프 아래로 파여 볼록성이 깨집니다. \(\ln\Gamma\)의 위반량은 \(10^{-9}\) 미만(측정값 \(\approx ${violationG.toExponential(1)}\))으로 볼록성이 유지됩니다.`,
      en: String.raw`\(a = ${amp.toFixed(2)}\), \(x_0 = ${probe.toFixed(1)}\): secant violation of the impostor \(\ln f_a \approx ${violationF.toFixed(4)}\) — the chord dips below the graph, so convexity fails. For \(\ln\Gamma\) the violation is below \(10^{-9}\) (measured \(\approx ${violationG.toExponential(1)}\): convexity holds).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`impostor \(f_a(x) = \Gamma(x)(1 + a\sin 2\pi x)\)는 \(f(1) = 1\)과 점화식 \(f(x+1) = x\,f(x)\)를 만족하지만(정수점에서는 \(\Gamma\)와 완전히 일치) 로그볼록하지 않습니다 — 세 조건을 모두 가진 것은 \(\Gamma\)뿐입니다. 이것이 Bohr–Mollerup 정리입니다.`,
      en: String.raw`The impostor \(f_a(x) = \Gamma(x)(1 + a\sin 2\pi x)\) satisfies \(f(1) = 1\) and the recurrence \(f(x+1) = x\,f(x)\) (it matches \(\Gamma\) exactly at the integers) but is not log-convex — only \(\Gamma\) has all three. That is the Bohr–Mollerup theorem.`,
    },
    lang,
  );
}

function createBohrMollerupScene(): Scene<BohrMollerupData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: BohrMollerupData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { amp, probeLeft, probeRight, xs, logG, logF, chordXs, chordF, graphF } = data;

    const { g, width, height } = chart;
    g.selectAll('*').remove();
    const x = scaleLinear().domain([0.05, 3]).range([0, width]);
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i < xs.length; i++) {
      lo = Math.min(lo, logG[i] ?? 0, logF[i] ?? 0);
      hi = Math.max(hi, logG[i] ?? 0, logF[i] ?? 0);
    }
    for (let i = 0; i < chordXs.length; i++) {
      lo = Math.min(lo, chordF[i] ?? 0);
      hi = Math.max(hi, chordF[i] ?? 0);
    }
    const pad = Math.max(0.05, (hi - lo) * 0.12);
    const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(y).ticks(6));

    const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
    header.text(
      localize(
        {
          ko: `ln Γ (기준, 로그볼록) vs ln f_a — impostor f_a(x) = Γ(x)·(1 + ${amp.toFixed(2)}·sin 2πx)`,
          en: `ln Γ (reference, log-convex) vs ln f_a — impostor f_a(x) = Γ(x)·(1 + ${amp.toFixed(2)}·sin 2πx)`,
        },
        lang,
      ),
    );

    const curve = line<{ x: number; v: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.v));

    // The reference: ln Gamma, log-convex.
    const gPts = xs.map((px, i) => ({ x: px, v: logG[i] ?? 0 }));
    g.append('path').datum(gPts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('opacity', 0.55).attr('d', curve);

    // The impostor: ln f_a.
    const fPts = xs.map((px, i) => ({ x: px, v: logF[i] ?? 0 }));
    g.append('path').datum(fPts).attr('fill', 'none').attr('stroke', 'var(--accent)').attr('stroke-width', 2).attr('d', curve);

    // Shade the runs where the chord dips below the impostor's graph.
    const n = chordXs.length;
    let runStart = -1;
    const shadeRun = (a: number, b: number): void => {
      if (b <= a) return;
      const top: Array<[number, number]> = [];
      const bottom: Array<[number, number]> = [];
      for (let i = a; i <= b; i++) {
        top.push([x(chordXs[i] ?? 0), y(graphF[i] ?? 0)]);
        bottom.push([x(chordXs[i] ?? 0), y(chordF[i] ?? 0)]);
      }
      const pts = top.concat(bottom.reverse());
      g.append('polygon')
        .attr('points', pts.map((p) => p.join(',')).join(' '))
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.25);
    };
    for (let i = 0; i < n; i++) {
      const gap = (graphF[i] ?? 0) - (chordF[i] ?? 0);
      if (gap > 0) {
        if (runStart < 0) runStart = i;
      } else if (runStart >= 0) {
        shadeRun(runStart, i - 1);
        runStart = -1;
      }
    }
    if (runStart >= 0) shadeRun(runStart, n - 1);

    // The secant segment over [x0, x0+1] on the impostor.
    const segPts = chordXs.map((px, i) => ({ x: px, v: chordF[i] ?? 0 }));
    g.append('path')
      .datum(segPts)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '7,4')
      .attr('d', curve);
    for (const i of [0, n - 1]) {
      g.append('circle')
        .attr('cx', x(chordXs[i] ?? 0))
        .attr('cy', y(chordF[i] ?? 0))
        .attr('r', 4)
        .style('fill', 'var(--accent)');
    }

    const legend = g.append('text').attr('x', 8).attr('y', height + 32).attr('font-size', 12);
    const legendAccent = legend.append('tspan').style('fill', 'var(--accent)');
    legendAccent.text(
      localize(
        { ko: `■ ln f_a (impostor) — 점선: [${probeLeft.toFixed(1)}, ${probeRight.toFixed(1)}] 현`, en: `■ ln f_a (impostor) — dashed: secant over [${probeLeft.toFixed(1)}, ${probeRight.toFixed(1)}]` },
        lang,
      ),
    );
    const legendRef = legend.append('tspan').attr('dx', 16).attr('fill', 'currentColor').attr('opacity', 0.7);
    legendRef.text(localize({ ko: '─ ln Γ (기준)', en: '─ ln Γ (reference)' }, lang));

    setRichText(readoutSlot, readoutText(data, lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      const chartWrap = shell.chartWrap;
      const strips = shell.strips;
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';

      // Cross-link: the gamma function scene (prerequisite).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const gammaLink = document.createElement('a');
      gammaLink.href = '../gamma/';
      gammaLink.textContent = localize(
        { ko: '감마함수 씬 — 이 정리의 주인공', en: 'The Gamma Function scene — the star of this theorem' },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), gammaLink);

      strips.append(readout, verdict, seeAlso);

      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      wrap = chartWrap;
      chart = createChart(chartWrap, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (!chart || !wrap) return;
      chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || 360);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      readoutSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<BohrMollerupData>({ model: bohrMollerupModel, createScene: createBohrMollerupScene });
