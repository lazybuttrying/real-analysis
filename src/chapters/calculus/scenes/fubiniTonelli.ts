import { axisBottom, axisLeft, interpolateBlues, line, scaleLinear, scaleSequential } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { fubiniTonelliModel, type FubiniTonelliData } from '../models/fubiniTonelli';

/**
 * Tonelli/Fubini on [0,1]^2, live. Left: heatmap of f (both modes peak at
 * 1, so one shared color scale). Right: the two marginal curves —
 * R(y) = int f(x,y) dx on top, C(x) = int f(x,y) dy below — each integrated
 * once more in the readout. The two totals are the same double sum added in
 * opposite orders, which is why they always agree here.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

const MODE_NAME: Record<string, { ko: string; en: string }> = {
  separable: { ko: '분리형 f(x, y) = x·y', en: 'separable f(x, y) = x·y' },
  tent: { ko: '텐트 f(x, y) = max(0, 1−3|x−y|)', en: 'tent f(x, y) = max(0, 1−3|x−y|)' },
};

function modeName(mode: string, lang: Lang): string {
  return localize(
    (MODE_NAME[mode] ?? MODE_NAME['separable']) as { ko: string; en: string },
    lang,
  );
}

function readoutText(data: FubiniTonelliData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`격자 \(N = ${data.n}\): \(\int_0^1 R(y)\,dy = ${fmt(data.totalRows, 6)}\), \(\int_0^1 C(x)\,dx = ${fmt(data.totalCols, 6)}\), 엄밀값 \(= ${fmt(data.exact, 6)}\). 두 순서가 일치합니다.`,
      en: String.raw`Grid \(N = ${data.n}\): \(\int_0^1 R(y)\,dy = ${fmt(data.totalRows, 6)}\), \(\int_0^1 C(x)\,dx = ${fmt(data.totalCols, 6)}\), exact \(= ${fmt(data.exact, 6)}\). Both orders agree.`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`왼쪽은 \(f\)의 히트맵입니다. 오른쪽 위 곡선은 각 행을 적분한 \(R(y) = \int_0^1 f(x, y)\,dx\), 아래 곡선은 각 열을 적분한 \(C(x) = \int_0^1 f(x, y)\,dy\)입니다 — 두 곡선 아래 넓이가 같은 이유가 토넬리 정리입니다.`,
      en: String.raw`Left is the heatmap of \(f\). The upper-right curve is \(R(y) = \int_0^1 f(x, y)\,dx\) (each row integrated), the lower-right is \(C(x) = \int_0^1 f(x, y)\,dy\) (each column integrated) — Tonelli's theorem is why the two areas match.`,
    },
    lang,
  );
}

function createFubiniTonelliScene(): Scene<FubiniTonelliData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: FubiniTonelliData; state: ControlState } | undefined;

  const drawMain = (data: FubiniTonelliData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const n = data.n;
    const hm = Math.max(80, Math.min(width * 0.5, height * 0.8));
    const rx = hm + 40;
    const rw = Math.max(60, width - rx);
    const gapY = 28;
    const ph = Math.max(40, (height - gapY) / 2);

    const color = scaleSequential(interpolateBlues).domain([0, 1]);

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: `${modeName(data.mode, 'ko')}: 히트맵 + 주변분포 R(y), C(x)`, en: `${modeName(data.mode, 'en')}: heatmap + marginals R(y), C(x)` },
          lang,
        ),
      );

    // --- Heatmap of f on [0,1]^2. ---
    const xHeat = scaleLinear().domain([0, 1]).range([0, hm]);
    const yHeat = scaleLinear().domain([0, 1]).range([hm, 0]);
    const gh = g.append('g');
    gh.append('g').attr('transform', `translate(0,${hm})`).call(axisBottom(xHeat).ticks(5));
    gh.append('g').call(axisLeft(yHeat).ticks(5));

    const cell = hm / n;
    gh.selectAll('rect.cell')
      .data(data.cells)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (_d, k) => xHeat((k % n) / n))
      .attr('y', (_d, k) => yHeat((Math.floor(k / n) + 1) / n))
      .attr('width', Math.max(0, cell + 0.2))
      .attr('height', Math.max(0, cell + 0.2))
      .attr('fill', (d) => color(d));

    // --- Right panels: R(y) on top, C(x) below. ---
    const drawMarginal = (
      yOff: number,
      values: number[],
      abscissae: number[],
      title: string,
      xLabel: string,
    ): void => {
      const gp = g.append('g').attr('transform', `translate(${rx},${yOff})`);
      const xp = scaleLinear().domain([0, 1]).range([0, rw]);
      const vmax = Math.max(1e-9, ...values);
      const yp = scaleLinear().domain([0, vmax * 1.15]).range([ph, 0]);
      const pts = abscissae.map((a, k) => ({ a, v: values[k] ?? 0 }));
      const area = line<{ a: number; v: number }>()
        .x((p) => xp(p.a))
        .y((p) => yp(p.v));
      gp.append('path')
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.25)
        .attr('d', `${area(pts) ?? ''}L${xp(1)},${yp(0)}L${xp(0)},${yp(0)}Z`);
      gp.append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', 'var(--accent)')
        .attr('d', area(pts) ?? '');
      gp.append('g').attr('transform', `translate(0,${ph})`).call(axisBottom(xp).ticks(5));
      gp.append('g').call(axisLeft(yp).ticks(4));
      gp.append('text')
        .attr('x', 0)
        .attr('y', -8)
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', 'currentColor')
        .text(title);
      gp.append('text')
        .attr('x', rw)
        .attr('y', ph + 30)
        .attr('text-anchor', 'end')
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .text(xLabel);
    };

    drawMarginal(
      0,
      data.rowSums,
      data.ys,
      'R(y) = ∫ f(x,y) dx',
      localize({ ko: 'y →', en: 'y →' }, lang),
    );
    drawMarginal(
      ph + gapY,
      data.colSums,
      data.xs,
      'C(x) = ∫ f(x,y) dy',
      localize({ ko: 'x →', en: 'x →' }, lang),
    );

    // Readout numbers on the chart.
    g.append('text')
      .attr('x', width)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`N = ${n} · ∫R = ${fmt(data.totalRows, 4)} · ∫C = ${fmt(data.totalCols, 4)} · exact = ${fmt(data.exact, 4)}`);
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(lang));
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

      shell.strips.append(readout, explain);
      readoutSlot = createRichSlot(readout);
      explainSlot = createRichSlot(explain);
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
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<FubiniTonelliData>({ model: fubiniTonelliModel, createScene: createFubiniTonelliScene });
