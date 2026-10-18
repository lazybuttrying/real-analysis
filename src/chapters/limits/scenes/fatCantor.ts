import { axisBottom, scaleLinear, type ScaleLinear, type Selection } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { fatCantorModel, type FatCantorData, type Interval } from '../models/fatCantor';

/**
 * The fat Cantor set, live against the standard middle-thirds Cantor set.
 * Two strip rows: the Smith-Volterra-Cantor construction (accent) on top —
 * middle open interval of absolute length 4^{-n} removed at stage n — and
 * the standard construction (muted) below. The stage slider shows the
 * divergence: the fat strip's total length settles toward 1/2 while the
 * standard strip thins to nothing. The readout reports both remaining
 * lengths; the verdict states the paradox.
 */

const MARGIN = { top: 64, right: 20, bottom: 40, left: 64 };
const FAT_COLOR = 'var(--accent)';
const STD_COLOR = 'var(--muted)';
const ROW_H = 26;
const ROW_GAP = 44;

function drawStrip(
  g: Selection<SVGGElement, unknown, null, undefined>,
  x: ScaleLinear<number, number>,
  intervals: Interval[],
  y: number,
  color: string,
  label: string,
): void {
  g.selectAll<SVGRectElement, Interval>(`.seg-${y}`)
    .data(intervals)
    .join('rect')
    .attr('class', `seg-${y}`)
    .attr('x', (d) => x(d[0]))
    .attr('y', y)
    .attr('width', (d) => Math.max(0, x(d[1]) - x(d[0])))
    .attr('height', ROW_H)
    .attr('rx', 2)
    .style('fill', color);
  g.append('text')
    .attr('x', 0)
    .attr('y', y - 8)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(label);
}

function readoutText(data: FatCantorData, lang: Lang): string {
  const { stage, fatLength, stdLength } = data;
  return localize(
    {
      ko: String.raw`\(n = ${stage}\)단계: fat 남은 길이 \(L_{${stage}} = ${fmt(fatLength, 6)} \to \tfrac12\), 표준 남은 길이 \(\left(\tfrac23\right)^{${stage}} \approx ${fmt(stdLength, 6)} \to 0\). 제거된 총길이는 \(\sum_{k=1}^{${stage}} 2^{k-1} 4^{-k} = \tfrac12(1 - 2^{-${stage}})\).`,
      en: String.raw`Stage \(n = ${stage}\): fat remaining length \(L_{${stage}} = ${fmt(fatLength, 6)} \to \tfrac12\), standard remaining length \(\left(\tfrac23\right)^{${stage}} \approx ${fmt(stdLength, 6)} \to 0\). Total removed: \(\sum_{k=1}^{${stage}} 2^{k-1} 4^{-k} = \tfrac12(1 - 2^{-${stage}})\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`이 집합은 compact하고, nowhere dense하고, perfect합니다 — 그런데도 구간 길이의 절반이 살아남습니다. 표준 칸토어 집합은 같은 세 가지 성질을 가지면서 길이가 0으로 갑니다. 위상적 크기(내부·조밀성)와 측도는 독립적인 개념입니다.`,
      en: String.raw`This set is compact, nowhere dense, and perfect — yet half of the interval's length survives. The standard Cantor set shares all three properties while its length goes to 0. Topological size (interior, density) and measure are independent notions.`,
    },
    lang,
  );
}

function createFatCantorScene(): Scene<FatCantorData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: FatCantorData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;

    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).ticks(10));

    const fatY = 8;
    const stdY = fatY + ROW_H + ROW_GAP;

    drawStrip(
      g,
      x,
      data.fat,
      fatY,
      FAT_COLOR,
      localize(
        { ko: `fat Cantor 집합 — ${data.stage}단계마다 가운데 구간 \(4^{-n}\) 길이 제거`, en: `Fat Cantor set — middle open piece of length \(4^{-n}\) removed at stage n` },
        lang,
      ),
    );
    drawStrip(
      g,
      x,
      data.std,
      stdY,
      STD_COLOR,
      localize(
        { ko: '표준 칸토어 집합 — 매 단계 가운데 1/3 제거', en: 'Standard Cantor set — middle third removed each stage' },
        lang,
      ),
    );

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

      // Cross-link: the standard Cantor set scene this scene contrasts with.
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const cantorLink = document.createElement('a');
      cantorLink.href = '../cantor/';
      cantorLink.textContent = localize(
        { ko: '칸토어 집합 씬 — 길이가 0으로 가는 경우', en: 'Cantor set scene — when the length goes to 0' },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), cantorLink);

      shell.strips.append(readout, verdict, seeAlso);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      wrap = shell.chartWrap;
      chart = createChart(shell.chartWrap, MARGIN);
      // Two rows of ROW_H plus the gap between them.
      chart.setSize(wrap.clientWidth || 640, ROW_H * 2 + ROW_GAP + MARGIN.top + MARGIN.bottom);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (!chart || !wrap) return;
      chart.setSize(wrap.clientWidth || 640, ROW_H * 2 + ROW_GAP + MARGIN.top + MARGIN.bottom);
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

export default defineScene<FatCantorData>({ model: fatCantorModel, createScene: createFatCantorScene });
