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
import { evtModel, type EvtData, type EvtSample } from '../models/evt';

/**
 * The Extreme Value Theorem: continuous on a closed interval attains its max
 * and min. The two counterexamples show why closedness and continuity are
 * both necessary.
 */

function verdictText(data: EvtData, lang: Lang): string {
  if (data.mode === 'open-interval') {
    return localize(
      {
        ko: String.raw`위로 비유계: 최댓값 없음 — 닫힌 구간 가설이 깨졌습니다 (\(f(x) = 1/x\) on \((0,1]\))`,
        en: String.raw`unbounded above: no maximum — the closed-domain hypothesis is broken (\(f(x) = 1/x\) on \((0,1]\))`,
      },
      lang,
    );
  }
  if (data.mode === 'discontinuous') {
    return localize(
      {
        ko: String.raw`\(\sup = 1\)이지만 도달되지 않음: \(x < 1\)에서는 \(f(x) = x < 1\), \(f(1) = 0\) — 연속성 가설이 깨졌습니다`,
        en: String.raw`\(\sup = 1\) but never attained: \(f(x) = x < 1\) for \(x < 1\) and \(f(1) = 0\) — the continuity hypothesis is broken`,
      },
      lang,
    );
  }
  const maxAt = data.max.at.map((v) => fmt(v)).join(', ');
  const minAt = data.min.at.map((v) => fmt(v)).join(', ');
  return localize(
    {
      ko: String.raw`둘 다 도달됨: \(\max = ${fmt(data.max.value)}\) at \(x = ${maxAt}\), \(\min = ${fmt(data.min.value)}\) at \(x = ${minAt}\)`,
      en: String.raw`both attained: \(\max = ${fmt(data.max.value)}\) at \(x = ${maxAt}\), \(\min = ${fmt(data.min.value)}\) at \(x = ${minAt}\)`,
    },
    lang,
  );
}

function createEvtScene(): Scene<EvtData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: EvtData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { mode, samples, xLo, xHi, max, min } = data;

    const yDomain: [number, number] = mode === 'open-interval' ? [-0.5, 6] : mode === 'discontinuous' ? [-0.5, 1.6] : [-2.8, 2.8];
    const x = scaleLinear().domain([xLo, xHi]).range([0, width]);
    const y = scaleLinear().domain(yDomain).range([height, 0]);

    g.selectAll('*').remove();

    const path = line<EvtSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));

    if (mode === 'open-interval') {
      // Clip the exploding branch; the annotation says where it is going.
      const visible = samples.filter((s) => s.y <= 6.5);
      g.append('path').attr('d', path(visible)).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2);
      g.append('text')
        .attr('x', x(0.06))
        .attr('y', 18)
        .attr('font-size', 13)
        .attr('fill', 'var(--bound)')
        .text('→ ∞');
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(min.value))
        .attr('y2', y(min.value))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '5 4');
      g.append('circle').attr('cx', x(1)).attr('cy', y(1)).attr('r', 5).attr('fill', 'var(--accent)');
    } else if (mode === 'discontinuous') {
      // Draw y = x on [0, 1) only; the jump at x = 1 is drawn as dots.
      const branch = samples.filter((s) => s.x < 1);
      g.append('path').attr('d', path(branch)).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2);
      // The supremum line y = 1: approached, never touched.
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(1))
        .attr('y2', y(1))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '5 4');
      // Open circle at (1, 1): the unattained sup.
      g.append('circle')
        .attr('cx', x(1))
        .attr('cy', y(1))
        .attr('r', 6)
        .attr('fill', 'var(--bg)')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2);
      // The actual value f(1) = 0.
      g.append('circle').attr('cx', x(1)).attr('cy', y(0)).attr('r', 5).attr('fill', 'var(--bound)');
      g.append('text')
        .attr('x', width - 8)
        .attr('y', y(1) - 8)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', 'var(--bound)')
        .text(localize({ ko: '상한 1 (도달 안 됨)', en: 'sup 1 (unattained)' }, lang));
    } else {
      g.append('path').attr('d', path(samples)).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2);
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(max.value))
        .attr('y2', y(max.value))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '5 4');
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(min.value))
        .attr('y2', y(min.value))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '5 4');
      for (const px of max.at) {
        g.append('circle').attr('cx', x(px)).attr('cy', y(max.value)).attr('r', 5).attr('fill', 'var(--accent)');
      }
      for (const px of min.at) {
        g.append('circle').attr('cx', x(px)).attr('cy', y(min.value)).attr('r', 5).attr('fill', 'var(--accent)');
      }
    }

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(5));

    setRichText(verdictSlot, verdictText(data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      const chartWrap = shell.chartWrap;
      const strips = shell.strips;
      const legend = document.createElement('div');
      legend.style.cssText = 'font-size: 12px; color: var(--muted);';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(legend, verdict);

      setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`최댓값 정리: 닫힌 구간 위의 연속함수는 최댓값·최솟값을 모두 취합니다 — 두 가설 중 하나라도 빠지면 거짓이 됩니다`,
            en: String.raw`Extreme Value Theorem: a continuous function on a closed interval attains its max and min — drop either hypothesis and it fails`,
          },
          lang,
        ),
      );
      verdictSlot = createRichSlot(verdict);
      wrap = chartWrap;
      chart = createChart(chartWrap);
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
      verdictSlot = undefined;
      wrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<EvtData>({ model: evtModel, createScene: createEvtScene });
