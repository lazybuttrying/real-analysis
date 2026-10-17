import { axisBottom, axisLeft, scaleLinear, type Selection } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { metricSpacesModel, type MetricSpacesData } from '../models/metric-spaces';

/**
 * Open balls B(c, r) under three metrics: the Euclidean disk, the max-norm
 * square, and the discrete metric on six points, where the ball is {p0} for
 * r <= 1 and jumps to all six points past r = 1. A legend strip names the
 * metric and describes its ball; a verdict strip states the takeaway.
 */

function factsText(data: MetricSpacesData, lang: Lang): string {
  const { metric, r } = data;
  switch (metric) {
    case 'euclid':
      return localize(
        {
          ko: String.raw`유클리드 거리 \(d_2\) — 열린 공 \(B(0, ${fmt(r)}) = \{(x, y) : x^2 + y^2 < r^2\}\)`,
          en: String.raw`Euclidean metric \(d_2\) — the open ball \(B(0, ${fmt(r)}) = \{(x, y) : x^2 + y^2 < r^2\}\)`,
        },
        lang,
      );
    case 'maxnorm':
      return localize(
        {
          ko: String.raw`최대 노름 \(d_\infty\) — 열린 공 \(B(0, ${fmt(r)}) = (-r, r)^2\)`,
          en: String.raw`Max norm \(d_\infty\) — the open ball \(B(0, ${fmt(r)}) = (-r, r)^2\)`,
        },
        lang,
      );
    case 'discrete':
      if (r <= 1) {
        return localize(
          {
            ko: String.raw`이산 거리 — \(r = ${fmt(r)} \leq 1\)이므로 \(B(p_0, r) = \{p_0\}\)`,
            en: String.raw`Discrete metric — \(r = ${fmt(r)} \leq 1\), so \(B(p_0, r) = \{p_0\}\)`,
          },
          lang,
        );
      }
      return localize(
        {
          ko: String.raw`이산 거리 — \(r = ${fmt(r)} > 1\)이므로 \(B(p_0, r)\) = 6점 전체`,
          en: String.raw`Discrete metric — \(r = ${fmt(r)} > 1\), so \(B(p_0, r)\) is all six points`,
        },
        lang,
      );
  }
}

function verdictText(data: MetricSpacesData, lang: Lang): string {
  const { metric, r } = data;
  if (metric === 'discrete') {
    if (r <= 1) {
      return localize(
        {
          ko: String.raw`한 점만으로 열린 공이 됩니다 — 이산 거리에서는 모든 점이 고립점이라 모든 부분집합이 열립니다.`,
          en: String.raw`A single point is already an open ball — every point is isolated in the discrete metric, so every subset is open.`,
        },
        lang,
      );
    }
    return localize(
      {
        ko: String.raw`\(r = 1\)이 임계값: 넘는 순간 공이 전체 공간으로 폭발합니다 — opensets 씬의 \(\varepsilon\)-공이 일반화된 것입니다.`,
        en: String.raw`\(r = 1\) is the threshold: past it the ball explodes to the whole space — the \(\varepsilon\)-ball from the opensets scene, generalized.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`같은 "열린 공"이라도 거리 정의에 따라 모양이 다릅니다 — \(d_2\)는 원판, \(d_\infty\)는 정사각형. \(B(c, r) = \{x : d(x, c) < r\}\)`,
      en: String.raw`The same "open ball" takes different shapes under different metrics — a disk for \(d_2\), a square for \(d_\infty\). \(B(c, r) = \{x : d(x, c) < r\}\)`,
    },
    lang,
  );
}

function centerMark(g: Selection<SVGGElement, unknown, null, undefined>, cx: number, cy: number): void {
  const s = 7;
  g.append('path')
    .attr('d', `M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`)
    .attr('fill', 'var(--accent)');
}

function createMetricSpacesScene(): Scene<MetricSpacesData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MetricSpacesData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { metric, r, points, inBall } = data;

    const SPAN = 2.3;
    const xScale = scaleLinear().domain([-SPAN, SPAN]).range([0, width]);
    const yScale = scaleLinear().domain([-SPAN, SPAN]).range([height, 0]);
    const cx = xScale(0);
    const cy = yScale(0);

    g.selectAll('*').remove();

    // Coordinate axes.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', cy)
      .attr('y2', cy)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.25);
    g.append('line')
      .attr('x1', cx)
      .attr('x2', cx)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.25);

    if (metric === 'euclid') {
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', Math.max(0, xScale(r) - xScale(0)))
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.18)
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2);
      centerMark(g, cx, cy);
    } else if (metric === 'maxnorm') {
      g.append('rect')
        .attr('x', xScale(-r))
        .attr('y', yScale(r))
        .attr('width', Math.max(0, xScale(r) - xScale(-r)))
        .attr('height', Math.max(0, yScale(-r) - yScale(r)))
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.18)
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2);
      centerMark(g, cx, cy);
    } else {
      // Discrete metric: labeled dots; ball members are highlighted.
      points.forEach((p, i) => {
        const inside = inBall[i] ?? false;
        g.append('circle')
          .attr('cx', xScale(p.x))
          .attr('cy', yScale(p.y))
          .attr('r', inside ? 9 : 5.5)
          .attr('fill', inside ? 'var(--accent)' : 'var(--bg)')
          .attr('stroke', inside ? 'var(--accent)' : 'var(--muted)')
          .attr('stroke-width', 2.5);
        g.append('text')
          .attr('x', xScale(p.x) + 13)
          .attr('y', yScale(p.y) + 4)
          .attr('font-size', 12)
          .attr('fill', 'currentColor')
          .text(p.label);
      });
      // Dashed ring marks the ball center p0.
      const first = points[0];
      if (first) {
        g.append('circle')
          .attr('cx', xScale(first.x))
          .attr('cy', yScale(first.y))
          .attr('r', 15)
          .attr('fill', 'none')
          .attr('stroke', 'var(--bound)')
          .attr('stroke-dasharray', '4 3')
          .attr('stroke-width', 1.5);
      }
    }

    g.append('g').attr('transform', `translate(0,${height - 8})`).call(axisBottom(xScale).ticks(8));
    g.append('g').call(axisLeft(yScale).ticks(8));

    setRichText(factsSlot, factsText(data, lang));
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
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(legend, facts, verdict);

      setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`음영·강조된 점 = 열린 공 \(B(c, r)\), 마름모 = 중심 \(c\)`,
            en: String.raw`shaded area and highlighted dots = the open ball \(B(c,r)\), diamond = the center \(c\)`,
          },
          lang,
        ),
      );
      factsSlot = createRichSlot(facts);
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
      factsSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<MetricSpacesData>({ model: metricSpacesModel, createScene: createMetricSpacesScene });
