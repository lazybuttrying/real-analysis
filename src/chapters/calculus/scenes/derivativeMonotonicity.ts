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
  monotonicityModel,
  signOf,
  type MonotonicityData,
  type MonotonicitySample,
} from '../models/derivativeMonotonicity';

/**
 * Tao, Analysis I, Proposition 10.3.3, live. The background is shaded by the
 * sign of f' (green where f' > 0, red where f' < 0); the tangent segment at
 * the dragged point takes the same color. The dashed secant over
 * [x0 - h, x0 + h] echoes the Mean Value Theorem: every secant slope is some
 * tangent slope, so the secant and the derivative always rise or fall
 * together.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };
const POS_COLOR = '#16a34a';
const NEG_COLOR = '#dc2626';
const FLAT_COLOR = '#6b7280';

function signColor(sign: -1 | 0 | 1): string {
  return sign > 0 ? POS_COLOR : sign < 0 ? NEG_COLOR : FLAT_COLOR;
}

function signWord(lang: Lang, sign: -1 | 0 | 1): string {
  return localize(
    {
      ko: sign > 0 ? '증가 구간' : sign < 0 ? '감소 구간' : '수평',
      en: sign > 0 ? 'increasing here' : sign < 0 ? 'decreasing here' : 'flat here',
    },
    lang,
  );
}

function readoutText(data: MonotonicityData, lang: Lang): string {
  const secantOk = data.secantAgrees
    ? localize(
        {
          ko: String.raw`할선 기울기 \(\approx ${fmt(data.secantSlope, 4)}\)의 부호가 도함수 부호와 일치합니다 — 평균값 정리의 그림자입니다.`,
          en: String.raw`The secant slope \(\approx ${fmt(data.secantSlope, 4)}\) has the same sign — the Mean Value Theorem's shadow.`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`할선 구간 \([x_0 - h, x_0 + h]\)이 극값점이나 경계를 가로질러 부호가 어긋날 수 있습니다.`,
          en: String.raw`The secant window \([x_0 - h, x_0 + h]\) may straddle a critical point or the boundary, so the signs can differ.`,
        },
        lang,
      );
  return localize(
    {
      ko: String.raw`\(f'(${fmt(data.x0, 2)}) \approx ${fmt(data.fp0, 4)}\): ${signWord(lang, data.fpSign)}. ${secantOk}`,
      en: String.raw`\(f'(${fmt(data.x0, 2)}) \approx ${fmt(data.fp0, 4)}\): ${signWord(lang, data.fpSign)}. ${secantOk}`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`배경이 초록인 곳에서는 곡선이 올라가고(\(f' > 0\)), 빨간 곳에서는 내려갑니다(\(f' < 0\)). 점 \(x_0\)을 드래그해 보세요: 접선 조각의 색이 도함수 부호를 그대로 따라갑니다. 세제곱 함수 \(x^3 - 3x\)는 \(x = \pm 1\)에서 도함수가 0이 되는데(검은 점), 그 점들을 지나도 증가·감소가 바뀌지 않는 구간에서는 전체가 단조를 유지합니다.`,
      en: String.raw`The curve rises on the green background (\(f' > 0\)) and falls on the red one (\(f' < 0\)). Drag \(x_0\): the tangent segment's color tracks the derivative sign exactly. For the cubic \(x^3 - 3x\) the derivative vanishes at \(x = \pm 1\) (black dots), yet the function stays monotone on each stretch where the sign never flips.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(f' \ge 0\)이면 \(f\)는 증가하고, \(f' > 0\)이면 엄격히 증가합니다 — 아래 문제 1·2가 평균값 정리로 증명합니다. 역은 성립하지 않습니다: \(f(x) = x^3\)은 엄격히 증가하지만 \(f'(0) = 0\)입니다.`,
      en: String.raw`\(f' \ge 0\) makes \(f\) increasing, and \(f' > 0\) makes it strictly increasing — problems 1 and 2 below prove this from the Mean Value Theorem. The converse fails: \(f(x) = x^3\) is strictly increasing yet \(f'(0) = 0\).`,
    },
    lang,
  );
}

function fnLabel(key: string, lang: Lang): string {
  if (key === 'sine') return localize({ ko: 'sin x', en: 'sin x' }, lang);
  if (key === 'exp') return localize({ ko: 'e^x', en: 'e^x' }, lang);
  return localize({ ko: 'x³ − 3x', en: 'x³ − 3x' }, lang);
}

function createMonotonicityScene(): Scene<MonotonicityData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MonotonicityData; state: ControlState } | undefined;

  const curvePath = line<MonotonicitySample>()
    .x((d) => d.x)
    .y((d) => d.y);

  const drawMain = (data: MonotonicityData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const ys = data.fSamples.map((s) => s.y);
    let yMin = Math.min(...ys);
    let yMax = Math.max(...ys);
    const pad = Math.max(0.5, (yMax - yMin) * 0.12);
    yMin -= pad;
    yMax += pad;

    const x = scaleLinear().domain([data.a, data.b]).range([0, width]);
    const y = scaleLinear().domain([yMin, yMax]).range([height, 0]);
    const px = curvePath.x((d) => x(d.x)).y((d) => y(d.y));

    // Linear interpolation on the sampled f curve, for markers and chords.
    const fAt = (t: number): number => {
      const s = data.fSamples;
      const idx = ((t - data.a) / (data.b - data.a)) * (s.length - 1);
      const i0 = Math.max(0, Math.min(s.length - 2, Math.floor(idx)));
      const frac = Math.max(0, Math.min(1, idx - i0));
      const y0v = s[i0]?.y ?? 0;
      const y1v = s[i0 + 1]?.y ?? 0;
      return y0v + (y1v - y0v) * frac;
    };

    // Background sign bands.
    for (const band of data.bands) {
      if (band.x1 <= band.x0) continue;
      g.append('rect')
        .attr('x', x(band.x0))
        .attr('width', Math.max(0, x(band.x1) - x(band.x0)))
        .attr('y', 0)
        .attr('height', height)
        .attr('fill', signColor(band.sign))
        .attr('opacity', 0.07);
    }

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `y = ${fnLabel(data.key, lang)}: 배경은 f′ 부호 (초록 +, 빨강 −)`,
            en: `y = ${fnLabel(data.key, lang)}: background is the sign of f′ (green +, red −)`,
          },
          lang,
        ),
      );

    // The curve of f.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.fSamples) ?? '');

    // Critical points where f' = 0.
    for (const c of data.criticalPoints) {
      g.append('circle')
        .attr('cx', x(c))
        .attr('cy', y(fAt(c)))
        .attr('r', 5)
        .style('fill', 'var(--bound)');
    }

    // Secant chord over [x0 - h, x0 + h] (dashed, secant sign color).
    const xl = Math.max(data.a, data.x0 - data.secantH);
    const xr = Math.min(data.b, data.x0 + data.secantH);
    if (xr > xl) {
      g.append('line')
        .attr('x1', x(xl))
        .attr('x2', x(xr))
        .attr('y1', y(fAt(xl)))
        .attr('y2', y(fAt(xr)))
        .attr('stroke-dasharray', '5 4')
        .attr('stroke-width', 2)
        .style('stroke', signColor(signOf(data.secantSlope)));
    }

    // Tangent segment at the dragged point, colored by the derivative sign.
    const tHalf = (data.b - data.a) * 0.08;
    const slope = data.fp0;
    const tx0 = Math.max(data.a, data.x0 - tHalf);
    const tx1 = Math.min(data.b, data.x0 + tHalf);
    g.append('line')
      .attr('x1', x(tx0))
      .attr('x2', x(tx1))
      .attr('y1', y(fAt(data.x0) + slope * (tx0 - data.x0)))
      .attr('y2', y(fAt(data.x0) + slope * (tx1 - data.x0)))
      .attr('stroke-width', 3.5)
      .style('stroke', signColor(data.fpSign));
    g.append('circle')
      .attr('cx', x(data.x0))
      .attr('cy', y(fAt(data.x0)))
      .attr('r', 5)
      .style('fill', signColor(data.fpSign))
      .style('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // Legend.
    const legend = g.append('g').attr('transform', `translate(${width - 8}, 12)`);
    const items: Array<[string, string]> = [
      [localize({ ko: "f′ > 0 (증가)", en: "f′ > 0 (increasing)" }, lang), POS_COLOR],
      [localize({ ko: "f′ < 0 (감소)", en: "f′ < 0 (decreasing)" }, lang), NEG_COLOR],
    ];
    items.forEach(([labelText, color], i) => {
      legend
        .append('rect')
        .attr('x', -150)
        .attr('y', i * 20 - 11)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', color)
        .attr('opacity', 0.5);
      legend
        .append('text')
        .attr('x', -132)
        .attr('y', i * 20)
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .text(labelText);
    });
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

export default defineScene<MonotonicityData>({ model: monotonicityModel, createScene: createMonotonicityScene });
