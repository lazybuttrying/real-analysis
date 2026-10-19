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
import { gabrielHornModel, type GabrielHornData } from '../models/gabrielHorn';

/**
 * Gabriel's horn, live. Top panel: the profile y = 1/x on [1, R] with the
 * region between the upper and lower profiles shaded (the solid of
 * revolution suggested) and cross-section ellipses at several x-stations for
 * a fake-3D read of the horn. Bottom panel: the truncated volume
 * V(s) = pi (1 - 1/s) converging to pi (dashed) against the surface-area
 * lower bound 2 pi ln s diverging, with the quadrature area marked as a
 * dot. Sliding R shows volume settling while area keeps growing.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

function readoutText(data: GabrielHornData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(R = ${fmt(data.r, 1)}\): 부피 \(V(R) = \pi\left(1 - \frac{1}{R}\right) = ${fmt(data.volume, 6)}\) → \(\pi \approx ${fmt(data.volumeLimit, 6)}\) (유한). 겉넓이 \(A(R) \ge 2\pi\ln R = ${fmt(data.areaLower, 6)}\), 수치적분값 \(\approx ${fmt(data.areaNumeric, 6)}\) → \(\infty\) (발산).`,
      en: String.raw`\(R = ${fmt(data.r, 1)}\): volume \(V(R) = \pi\left(1 - \frac{1}{R}\right) = ${fmt(data.volume, 6)}\) → \(\pi \approx ${fmt(data.volumeLimit, 6)}\) (finite). Surface area \(A(R) \ge 2\pi\ln R = ${fmt(data.areaLower, 6)}\), quadrature \(\approx ${fmt(data.areaNumeric, 6)}\) → \(\infty\) (divergent).`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`위 패널은 \(y = \pm 1/x\) 사이 음영 — 뿔을 \(x\)축 둘레로 회전시킨 단면의 흔적입니다. 여러 \(x\) 지점의 타원은 단면 원의 찌그러진 모습(가짜 3D)입니다. 아래 패널에서 파란 부피 곡선은 \(\pi\) 점선에 달라붙지만, 붉은 겉넓이 하한 곡선은 \(\log\)처럼 끝없이 올라갑니다 (아래 문제 1, 2).`,
      en: String.raw`The top panel shades the region between \(y = \pm 1/x\) — the trace of rotating the profile about the \(x\)-axis. The ellipses at several \(x\)-stations are squashed cross-section circles (fake 3D). Below, the blue volume curve clings to the dashed \(\pi\) line while the red area lower bound climbs like \(\log\), without end (problems 1 and 2 below).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`부피 \(\pi\)는 유한하지만 겉넓이는 무한대 — \(\pi\)만큼의 페인트로 뿔을 채울 수는 있어도, 그 표면을 칠할 수는 없습니다 (아래 문제 3).`,
      en: String.raw`Volume \(\pi\) is finite but the surface area is infinite — you can fill the horn with \(\pi\) of paint, but you cannot paint its surface (problem 3 below).`,
    },
    lang,
  );
}

function createGabrielHornScene(): Scene<GabrielHornData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: GabrielHornData; state: ControlState } | undefined;

  const drawMain = (data: GabrielHornData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const gap = 14;
    const topH = Math.max(0, (height - gap) * 0.58);
    const botH = Math.max(0, height - gap - topH);
    const botY = topH + gap;

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: `가브리엘의 뿔: y = 1/x (x ≥ 1)를 x축 둘레로 회전 — 부피 유한, 겉넓이 무한`, en: `Gabriel's horn: y = 1/x (x ≥ 1) rotated about the x-axis — finite volume, infinite area` },
          lang,
        ),
      );

    // --- Top panel: the horn profile with fake-3D cross sections. ---
    const gt = g.append('g');
    const xTop = scaleLinear().domain([1, data.r]).range([0, width]);
    const yTop = scaleLinear().domain([-1.15, 1.15]).range([topH, 0]);

    // Shaded region between the upper and lower profiles.
    const upper = data.profile.map((p) => ({ x: p.x, y: p.y }));
    const lower = data.profile.map((p) => ({ x: p.x, y: -p.y })).reverse();
    gt.append('path')
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.22)
      .attr(
        'd',
        line<{ x: number; y: number }>()
          .x((p) => xTop(p.x))
          .y((p) => yTop(p.y))(upper.concat(lower)) ?? '',
      );

    const profileLine = line<{ x: number; y: number }>()
      .x((p) => xTop(p.x))
      .y((p) => yTop(p.y));
    gt.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'currentColor')
      .attr('d', profileLine(upper) ?? '');
    gt.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'currentColor')
      .attr('d', profileLine(lower) ?? '');

    // Cross-section ellipses (fake 3D): squashed circles of radius 1/x.
    for (const sx of data.stations) {
      const cx = xTop(sx);
      const cy = yTop(0);
      const ry = Math.abs(yTop(1 / sx) - yTop(0));
      if (ry < 1) continue;
      gt.append('ellipse')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('rx', Math.max(1.5, ry * 0.28))
        .attr('ry', ry)
        .attr('fill', 'none')
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.75);
    }

    gt.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yTop(0))
      .attr('y2', yTop(0))
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);
    gt.append('g').attr('transform', `translate(0,${yTop(0)})`).call(axisBottom(xTop).ticks(8));
    gt.append('g').call(axisLeft(yTop).ticks(3));
    gt.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(localize({ ko: `단면 (타원 = 단면원의 찌그러진 모습)`, en: `cross section (ellipses = squashed circles)` }, lang));

    // --- Bottom panel: volume converges, area diverges. ---
    const gb = g.append('g').attr('transform', `translate(0,${botY})`);
    const xBot = scaleLinear().domain([1, data.r]).range([0, width]);
    const yMax = Math.max(data.volumeLimit * 1.25, data.areaLower * 1.15, 1);
    const yBot = scaleLinear().domain([0, yMax]).range([botH, 0]);

    const curvePts: Array<{ x: number; v: number; a: number }> = [];
    const N_CURVE = 120;
    for (let i = 0; i <= N_CURVE; i++) {
      const s = 1 + ((data.r - 1) * i) / N_CURVE;
      curvePts.push({ x: s, v: Math.PI * (1 - 1 / s), a: 2 * Math.PI * Math.log(s) });
    }
    const vLine = line<{ x: number; v: number; a: number }>()
      .x((p) => xBot(p.x))
      .y((p) => yBot(p.v));
    const aLine = line<{ x: number; v: number; a: number }>()
      .x((p) => xBot(p.x))
      .y((p) => yBot(p.a));
    gb.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'var(--accent)')
      .attr('d', vLine(curvePts) ?? '');
    gb.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'var(--bound)')
      .attr('d', aLine(curvePts) ?? '');

    // Dashed pi line: the volume's limit.
    gb.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yBot(data.volumeLimit))
      .attr('y2', yBot(data.volumeLimit))
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 3')
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.7);
    gb.append('text')
      .attr('x', width)
      .attr('y', yBot(data.volumeLimit) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text('π');

    // The quadrature area value as a dot at R.
    gb.append('circle')
      .attr('cx', xBot(data.r))
      .attr('cy', yBot(Math.min(data.areaNumeric, yMax)))
      .attr('r', 4)
      .attr('fill', 'var(--bound)');

    gb.append('g').attr('transform', `translate(0,${botH})`).call(axisBottom(xBot).ticks(8));
    gb.append('g').call(axisLeft(yBot).ticks(4));

    gb.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'var(--accent)')
      .text(localize({ ko: `V(s) = π(1 − 1/s) → π`, en: `V(s) = π(1 − 1/s) → π` }, lang));
    gb.append('text')
      .attr('x', 8)
      .attr('y', 30)
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(localize({ ko: `A(s) ≥ 2π ln s → ∞ (점은 수치적분값)`, en: `A(s) ≥ 2π ln s → ∞ (dot = quadrature)` }, lang));

    // Readout numbers on the chart.
    g.append('text')
      .attr('x', width)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`R = ${fmt(data.r, 1)} · V = ${fmt(data.volume, 4)} · A ≥ ${fmt(data.areaLower, 4)}`);
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot || !verdictSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(lang));
    setRichText(verdictSlot, verdictText(lang));
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

export default defineScene<GabrielHornData>({ model: gabrielHornModel, createScene: createGabrielHornScene });
