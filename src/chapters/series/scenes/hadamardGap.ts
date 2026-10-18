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
import { hadamardGapModel, type HadamardData, type HadamardPoint } from '../models/hadamardGap';

/**
 * Hadamard gap theorem, live. Three curves trace |S_N(r e^{i theta})| with
 * S_N(z) = sum_{k=0}^{N} z^{2^k} (gap ratio exactly 2) for r = 0.90, 0.95,
 * 0.99, against the angle theta. As N grows, spikes erupt at more and more
 * angles -- near dyadic rationals 2 pi m / 2^K, a dense set -- suggesting
 * the blow-up becomes dense on the unit circle. The dashed gray contrast
 * curve is T_N(z) = sum z^k/(k+1)^2 (no gaps): M-test uniform convergence
 * on the closed disc keeps it calm and bounded. The readout quotes both
 * maxima honestly: max|S_N| grows with N then levels off (the tail terms
 * r^{2^k} die), while max|T_N| never exceeds pi^2/6.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: HadamardData, lang: Lang): string {
  const { n, maxS, maxT, spikeCount } = data;
  return localize(
    {
      ko: String.raw`\(N = ${n}\): \(\max_\theta \lvert S_N(0.99\,e^{i\theta}) \rvert \approx ${fmt(maxS, 4)}\) 대 \(\max_\theta \lvert T_N(0.99\,e^{i\theta}) \rvert \approx ${fmt(maxT, 4)}\) (\(\le \pi^2/6 \approx 1.6449\)). 봉우리 ${spikeCount}개 — \(N\)이 커지면 봉우리가 늘어나다가, 윗항 \(0.99^{2^k} \to 0\)이 죽으면서 곡선이 자리잡습니다.`,
      en: String.raw`\(N = ${n}\): \(\max_\theta \lvert S_N(0.99\,e^{i\theta}) \rvert \approx ${fmt(maxS, 4)}\) vs \(\max_\theta \lvert T_N(0.99\,e^{i\theta}) \rvert \approx ${fmt(maxT, 4)}\) (\(\le \pi^2/6 \approx 1.6449\)). ${spikeCount} spikes — they multiply as \(N\) grows, then the curve settles as the upper terms \(0.99^{2^k} \to 0\) die out.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`Hadamard 간극 정리: 간극 조건 \(n_{k+1}/n_k \ge q > 1\)을 만족하고 수렴반경이 정확히 1인 \(\sum a_k z^{n_k}\)는 단위원 \(\lvert z \rvert = 1\) 위의 모든 점에서 특이점 — 단위원은 자연경계(natural boundary)입니다. 위 그림은 증명이 아니라 암시입니다: 봉우리가 경계 위에 점점 빽빽해집니다.`,
      en: String.raw`Hadamard's gap theorem: if \(\sum a_k z^{n_k}\) has Hadamard gaps (\(n_{k+1}/n_k \ge q > 1\)) and radius of convergence exactly 1, then every point of \(\lvert z \rvert = 1\) is singular — the unit circle is a natural boundary. The picture above suggests, not proves: the spikes grow denser on the boundary.`,
    },
    lang,
  );
}

function mechanismText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`계산은 거듭제곱으로: \(z^{2^{k+1}} = (z^{2^k})^2\). 봉우리는 인자들 \((e^{i\theta})^{2^k}\)이 같은 위상을 가리키는 각도 — 이진 유리수 \(2\pi m/2^K\) 근처에서 솟아오르고, 그 집합은 \([0, 2\pi)\)에서 조밀합니다. 반면 간극 없는 \(T_N\)은 Weierstrass M-판정법으로 닫힌 원판 위에서 균등수렴하므로 얌전합니다.`,
      en: String.raw`Computed by repeated squaring: \(z^{2^{k+1}} = (z^{2^k})^2\). Spikes erupt where the phasors \((e^{i\theta})^{2^k}\) point the same way — near dyadic rationals \(2\pi m/2^K\), a dense set in \([0, 2\pi)\). The gap-free \(T_N\) stays calm by the Weierstrass M-test, converging uniformly on the closed disc.`,
    },
    lang,
  );
}

function createHadamardGapScene(): Scene<HadamardData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let mechanismSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: HadamardData; state: ControlState } | undefined;

  const path = line<HadamardPoint>()
    .x((d) => d.theta)
    .y((d) => d.y);

  const drawMain = (data: HadamardData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();
    const x = scaleLinear().domain([0, 2 * Math.PI]).range([0, width]);
    let yMax = 0;
    for (const curve of data.curves) for (const p of curve.points) if (p.y > yMax) yMax = p.y;
    for (const p of data.contrast) if (p.y > yMax) yMax = p.y;
    const y = scaleLinear()
      .domain([0, yMax > 0 ? yMax * 1.08 : 1])
      .range([height, 0]);
    const px = path.x((d) => x(d.theta)).y((d) => y(d.y));

    const tickVals = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
    const tickLabels = ['0', 'π/2', 'π', '3π/2', '2π'];
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        axisBottom(x)
          .tickValues(tickVals)
          .tickFormat((_, i) => tickLabels[i] ?? ''),
      );
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `|S_${data.n}(r·e^{iθ})| 대 각도 θ — 간극 급수 (실선) vs 간극 없는 대조군 (점선)`,
            en: `|S_${data.n}(r·e^{iθ})| vs angle θ — gappy series (solid) vs gap-free contrast (dashed)`,
          },
          lang,
        ),
      );

    // Contrast first (behind): dashed gray.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.55)
      .attr('stroke', 'currentColor')
      .attr('d', px(data.contrast) ?? '');

    // The three radii: r = 0.99 strongest, inner radii faded.
    const opacities = [0.32, 0.58, 1];
    const widths = [1.5, 1.75, 2.25];
    data.curves.forEach((curve, ci) => {
      g.append('path')
        .attr('fill', 'none')
        .attr('stroke-width', widths[ci] ?? 2)
        .attr('opacity', opacities[ci] ?? 1)
        .style('stroke', 'var(--bound)')
        .attr('d', px(curve.points) ?? '');
    });

    // Legend.
    const legendY = height + 34;
    const labels =
      lang === 'ko'
        ? ['— r = 0.90', '— r = 0.95', '— r = 0.99', '┄ T_N (간극 없음)']
        : ['— r = 0.90', '— r = 0.95', '— r = 0.99', '┄ T_N (gap-free)'];
    const xs = [8, width * 0.24, width * 0.4, width * 0.58];
    labels.forEach((label, i) => {
      const t = g
        .append('text')
        .attr('x', xs[i] ?? 8)
        .attr('y', legendY)
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .text(label);
      if (i < 3) {
        t.style('stroke', 'var(--bound)').attr('opacity', opacities[i] ?? 1);
      } else {
        t.attr('opacity', 0.55);
      }
    });
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !verdictSlot || !mechanismSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(verdictSlot, verdictText(lang));
    setRichText(mechanismSlot, mechanismText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainChart = createChart(mainWrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      const mechanism = document.createElement('div');
      mechanism.style.marginTop = '4px';

      // Cross-link: the power-series scene this one deepens (why the
      // radius of sum z^{2^k} is exactly 1).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const powerLink = document.createElement('a');
      powerLink.href = '../power-series/';
      powerLink.textContent = localize(
        {
          ko: '멱급수와 수렴반경 씬 — 수렴반경이 정확히 1인 이유',
          en: 'Power series scene — why the radius is exactly 1',
        },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), powerLink);

      shell.strips.append(readout, verdict, mechanism, seeAlso);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      mechanismSlot = createRichSlot(mechanism);
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
      verdictSlot = undefined;
      mechanismSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<HadamardData>({ model: hadamardGapModel, createScene: createHadamardGapScene });
