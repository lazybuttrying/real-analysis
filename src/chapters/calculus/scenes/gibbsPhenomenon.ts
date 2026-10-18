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
import { gibbsModel, OVERSHOOT_FRACTION, type GibbsData, type GibbsPoint } from '../models/gibbsPhenomenon';

/**
 * The Wilbraham–Gibbs constant, derived analytically. On the rescaled axis
 * t = 2Nx the partial sums S_N(t/(2N)) collapse onto the N-independent limit
 * curve (2/pi)*Si(t) as N grows; the first peak freezes at (2/pi)*Si(pi) while
 * the bump in x narrows like 1/N. The readout reports the measured peak
 * against the theoretical one and the overshoot as a fraction of the jump;
 * the verdict states the phenomenon in one sentence.
 */

const MARGIN = { top: 48, right: 20, bottom: 44, left: 64 };
const SUM_COLOR = 'var(--accent)';
const LIMIT_COLOR = 'var(--bound)';

function readoutText(data: GibbsData, lang: Lang): string {
  const { n, measuredPeak, theoreticalPeak, overshootPct } = data;
  return localize(
    {
      ko: String.raw`\(N = ${n}\): 측정된 첫 피크 \(\approx ${fmt(measuredPeak, 5)}\) → \((2/\pi)\,\mathrm{Si}(\pi) = ${fmt(theoreticalPeak, 5)}\), 울림은 점프의 \( ${overshootPct.toFixed(3)}\%\) — 이론값 \( ${(OVERSHOOT_FRACTION * 100).toFixed(3)}\%\).`,
      en: String.raw`\(N = ${n}\): measured first peak \(\approx ${fmt(measuredPeak, 5)}\) → \((2/\pi)\,\mathrm{Si}(\pi) = ${fmt(theoreticalPeak, 5)}\); overshoot \( ${overshootPct.toFixed(3)}\%\) of the jump — theory \( ${(OVERSHOOT_FRACTION * 100).toFixed(3)}\%\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`혹(bump)은 \(1/N\)처럼 좁아지지만 절대 낮아지지 않는다 — 이것이 Gibbs 현상이다.`,
      en: String.raw`The bump narrows like \(1/N\) but never shrinks — that is the Gibbs phenomenon.`,
    },
    lang,
  );
}

function createGibbsPhenomenonScene(): Scene<GibbsData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: GibbsData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { n, points, measuredPeak, measuredPeakT, theoreticalPeak } = data;

    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const x = scaleLinear()
      .domain([0, 4 * Math.PI])
      .range([0, width]);
    const y = scaleLinear().domain([-0.15, 1.35]).range([height, 0]);

    const ticks = [0, Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI];
    const tickLabels = ['0', 'π', '2π', '3π', '4π'];
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).tickValues(ticks).tickFormat((_, i) => tickLabels[i] ?? ''));
    g.append('g').call(axisLeft(y).ticks(6));
    g.append('text')
      .attr('x', width)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .text('t = 2Nx');

    const header = g
      .append('text')
      .attr('x', 0)
      .attr('y', -28)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor');
    header.text(
      localize(
        {
          ko: `재조정된 축 위의 붕괴: N = ${n}일 때 S_N(t/2N)이 (2/π)Si(t) 위에 겹쳐집니다`,
          en: `Collapse on the rescaled axis: S_N(t/2N) lands on (2/π)Si(t) for N = ${n}`,
        },
        lang,
      ),
    );

    // The N-independent limit curve (dashed).
    const limitLine = line<GibbsPoint>()
      .x((p) => x(p.t))
      .y((p) => y(p.siLimit));
    g.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4')
      .style('stroke', LIMIT_COLOR)
      .attr('d', limitLine);

    // The partial sum on the rescaled axis.
    const sumLine = line<GibbsPoint>()
      .x((p) => x(p.t))
      .y((p) => y(p.sN));
    g.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', SUM_COLOR)
      .attr('d', sumLine);

    // Dashed line at the theoretical peak.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(theoreticalPeak))
      .attr('y2', y(theoreticalPeak))
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('opacity', 0.7);
    g.append('text')
      .attr('x', width - 4)
      .attr('y', y(theoreticalPeak) - 8)
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .text(`(2/π)Si(π) ≈ ${fmt(theoreticalPeak, 5)}`);

    // Peak markers: measured on the sum, theoretical on the limit curve.
    g.append('circle')
      .attr('cx', x(measuredPeakT))
      .attr('cy', y(measuredPeak))
      .attr('r', 4.5)
      .style('fill', SUM_COLOR);
    g.append('circle')
      .attr('cx', x(Math.PI))
      .attr('cy', y(theoreticalPeak))
      .attr('r', 4.5)
      .style('fill', LIMIT_COLOR);

    // Legend.
    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', SUM_COLOR)
      .text(localize({ ko: '— S_N(t/2N)', en: '— S_N(t/2N)' }, lang));
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', LIMIT_COLOR)
      .text(localize({ ko: '- - (2/π)Si(t) 한계곡선', en: '- - (2/π)Si(t) limit curve' }, lang));

    setRichText(readoutSlot, readoutText(data, lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';

      // Cross-link: the Fourier scene whose numerical observation this derives.
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const fourierLink = document.createElement('a');
      fourierLink.href = '../fourier/';
      fourierLink.textContent = localize(
        {
          ko: '푸리에 정사각파 씬 — 울림의 수치적 관찰',
          en: 'Fourier square-wave scene — the numerical observation',
        },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), fourierLink);

      shell.strips.append(readout, verdict, seeAlso);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      wrap = shell.chartWrap;
      chart = createChart(shell.chartWrap, MARGIN);
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

export default defineScene<GibbsData>({ model: gibbsModel, createScene: createGibbsPhenomenonScene });
