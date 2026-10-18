import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
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
  fPow,
  integralTestModel,
  type IntegralTestData,
} from '../models/integralTest';

/**
 * Integral test, live (Tao, Prop 11.6.4). The curve y = 1/x^p on [1, N+1]
 * is squeezed between two Riemann families: the left-endpoint rectangles
 * (accent) sit above the curve (circumscribed), the right-endpoint
 * rectangles (bound) sit below it (inscribed), and the shaded area is the
 * integral itself. The strips show the sandwich
 *   integral <= sum_{k=1}^{N} k^{-p} <= 1 + integral
 * and the verdict: p > 1 converges, p <= 1 diverges.
 *
 * Note: for decreasing positive f the left-endpoint rectangles always
 * overestimate (circumscribed) and the right-endpoint rectangles always
 * underestimate (inscribed) -- that is the geometry the sandwich needs.
 */

const MARGIN = { top: 48, right: 20, bottom: 44, left: 60 };
const CURVE_POINTS_PER_UNIT = 6;

function sandwichText(data: IntegralTestData, lang: Lang): string {
  const ok = (b: boolean) => (b ? '✓' : '✗');
  return localize(
    {
      ko: String.raw`\(\int_1^{${fmt(data.N + 1, 0)}} x^{-${fmt(data.p, 1)}}\,dx \approx ${fmt(data.integral, 4)} \le \sum_{k=1}^{${fmt(data.N, 0)}} k^{-${fmt(data.p, 1)}} \approx ${fmt(data.leftSum, 4)} \le 1 + ${fmt(data.integral, 4)}\) — 양쪽 부등식 ${ok(data.lowerOK)} ${ok(data.upperOK)}.`,
      en: String.raw`\(\int_1^{${fmt(data.N + 1, 0)}} x^{-${fmt(data.p, 1)}}\,dx \approx ${fmt(data.integral, 4)} \le \sum_{k=1}^{${fmt(data.N, 0)}} k^{-${fmt(data.p, 1)}} \approx ${fmt(data.leftSum, 4)} \le 1 + ${fmt(data.integral, 4)}\) — both inequalities ${ok(data.lowerOK)} ${ok(data.upperOK)}.`,
    },
    lang,
  );
}

function compareText(data: IntegralTestData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`왼쪽 끝점 합(위, accent) \(\approx ${fmt(data.leftSum, 4)}\), 오른쪽 끝점 합(아래, bound) \(\approx ${fmt(data.rightSum, 4)}\), 적분(음영) \(\approx ${fmt(data.integral, 4)}\). 곡선은 두 직사각형 가족 사이에 끼어 있습니다.`,
      en: String.raw`Left-endpoint sum (above, accent) \(\approx ${fmt(data.leftSum, 4)}\), right-endpoint sum (below, bound) \(\approx ${fmt(data.rightSum, 4)}\), integral (shaded) \(\approx ${fmt(data.integral, 4)}\). The curve is trapped between the two rectangle families.`,
    },
    lang,
  );
}

function verdictText(data: IntegralTestData, lang: Lang): string {
  const verdict =
    data.verdict === 'converges'
      ? localize(
          {
            ko: String.raw`\(p = ${fmt(data.p, 1)} > 1\)이므로 \(\sum k^{-p}\)는 수렴합니다.`,
            en: String.raw`\(p = ${fmt(data.p, 1)} > 1\), so \(\sum k^{-p}\) converges.`,
          },
          lang,
        )
      : localize(
          {
            ko: String.raw`\(p = ${fmt(data.p, 1)} \le 1\)이므로 \(\sum k^{-p}\)는 발산합니다.`,
            en: String.raw`\(p = ${fmt(data.p, 1)} \le 1\), so \(\sum k^{-p}\) diverges.`,
          },
          lang,
        );
  return localize(
    {
      ko: String.raw`적분 판정법: \({verdict}\) \(p > 1\)이면 수렴, \(p \le 1\)이면 발산 — 적분이 유한한 것과 급수가 수렴하는 것은 동치입니다.`,
      en: String.raw`Integral test: ${verdict} \(p > 1\) converges, \(p \le 1\) diverges — the integral being finite is equivalent to the series converging.`,
    },
    lang,
  );
}

function createIntegralTestScene(): Scene<IntegralTestData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let sandwichSlot: RichSlot | undefined;
  let compareSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: IntegralTestData; state: ControlState } | undefined;

  const drawMain = (data: IntegralTestData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const { p, N } = data;
    const xMax = N + 1;
    const x = scaleLinear().domain([1, xMax]).range([0, width]);
    const y = scaleLinear().domain([0, 1.06]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    g.append('text')
      .attr('x', 0)
      .attr('y', -28)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `y = 1/x^${fmt(p, 1)} — 왼쪽 끝점 직사각형(위) vs 오른쪽 끝점 직사각형(아래), 음영은 적분`,
            en: `y = 1/x^${fmt(p, 1)} — left-endpoint rectangles (above) vs right-endpoint (below); shaded is the integral`,
          },
          lang,
        ),
      );

    // The integral area, shaded first.
    const pts: { x: number; y: number }[] = [];
    const steps = Math.max(50, N * CURVE_POINTS_PER_UNIT);
    for (let i = 0; i <= steps; i++) {
      const xx = 1 + ((xMax - 1) * i) / steps;
      pts.push({ x: xx, y: fPow(xx, p) });
    }
    const areaGen = area<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y0(y(0))
      .y1((d) => y(d.y));
    g.append('path')
      .attr('d', areaGen(pts) ?? '')
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.18);

    // Rectangles on [k, k+1]: left-endpoint (height f(k), circumscribed,
    // accent) and right-endpoint (height f(k+1), inscribed, bound).
    for (let k = 1; k <= N; k++) {
      const xl = x(k);
      const xr = x(k + 1);
      // Left-endpoint: above the curve.
      g.append('rect')
        .attr('x', xl)
        .attr('y', y(fPow(k, p)))
        .attr('width', Math.max(0, xr - xl))
        .attr('height', y(0) - y(fPow(k, p)))
        .attr('fill', 'var(--accent)')
        .attr('fill-opacity', 0.12)
        .attr('stroke', 'var(--accent)')
        .attr('stroke-opacity', 0.55)
        .attr('stroke-width', 1);
      // Right-endpoint: below the curve.
      g.append('rect')
        .attr('x', xl)
        .attr('y', y(fPow(k + 1, p)))
        .attr('width', Math.max(0, xr - xl))
        .attr('height', y(0) - y(fPow(k + 1, p)))
        .attr('fill', 'var(--bound)')
        .attr('fill-opacity', 0.12)
        .attr('stroke', 'var(--bound)')
        .attr('stroke-opacity', 0.55)
        .attr('stroke-width', 1);
    }

    // The curve on top.
    const lineGen = line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));
    g.append('path')
      .attr('d', lineGen(pts) ?? '')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .attr('stroke', 'currentColor');

    // Legend.
    const legendY = height + 34;
    g.append('text')
      .attr('x', 8)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '— 왼쪽 끝점 합 (위)', en: '— left-endpoint sum (above)' }, lang));
    g.append('text')
      .attr('x', width * 0.36)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '— 오른쪽 끝점 합 (아래)', en: '— right-endpoint sum (below)' }, lang));
    g.append('text')
      .attr('x', width * 0.72)
      .attr('y', legendY)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(localize({ ko: '— 적분 (음영)', en: '— integral (shaded)' }, lang));
  };

  const draw = (): void => {
    if (!last || !sandwichSlot || !compareSlot || !verdictSlot) return;
    drawMain(last.data);
    setRichText(sandwichSlot, sandwichText(last.data, lang));
    setRichText(compareSlot, compareText(last.data, lang));
    setRichText(verdictSlot, verdictText(last.data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainChart = createChart(mainWrap, MARGIN);

      const sandwich = document.createElement('div');
      sandwich.style.fontWeight = '600';
      const compare = document.createElement('div');
      compare.style.marginTop = '4px';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      verdict.style.marginTop = '4px';

      shell.strips.append(sandwich, compare, verdict);
      sandwichSlot = createRichSlot(sandwich);
      compareSlot = createRichSlot(compare);
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
      sandwichSlot = undefined;
      compareSlot = undefined;
      verdictSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<IntegralTestData>({
  model: integralTestModel,
  createScene: createIntegralTestScene,
});
