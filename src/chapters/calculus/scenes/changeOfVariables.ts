import { axisBottom, axisLeft, line, scaleLinear, type ScaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import {
  changeOfVariablesModel,
  phiTicks,
  xMax,
  type ChangeOfVariablesData,
  type CovSample,
} from '../models/changeOfVariables';

/**
 * Change of variables, live. Top: the substitution map phi(x) = u as a curve,
 * with evenly spaced x-ticks and their phi images on the u-axis (dashed
 * guides show the stretching). Bottom: the stretching made concrete — the
 * x-interval with evenly spaced ticks above, the u-interval with the
 * phi-mapped (stretched/compressed) ticks below, thin connectors between
 * corresponding ticks. The readout shows the two integrals agreeing and both
 * equal to e - 1.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function phiTeX(sub: string): string {
  return sub === 'u=sin x' ? '\\sin x' : 'x^2';
}

function readoutText(data: ChangeOfVariablesData, lang: Lang): string {
  const phi = phiTeX(data.sub);
  return localize(
    {
      ko: String.raw`\(u = ${phi}\): 원래 적분 \(\approx ${fmt(data.original, 9)}\), 치환 후 \(\approx ${fmt(data.substituted, 9)}\) — 같은 넓이입니다 (\(|\text{차이}| \approx ${fmt(data.diff, 2)}\)). 둘 다 \(e - 1 \approx ${fmt(data.closed, 9)}\)로 갑니다. Simpson 패널 \(N = ${data.N}\).`,
      en: String.raw`\(u = ${phi}\): original integral \(\approx ${fmt(data.original, 9)}\), substituted \(\approx ${fmt(data.substituted, 9)}\) — the same area (\(|\text{diff}| \approx ${fmt(data.diff, 2)}\)). Both head to \(e - 1 \approx ${fmt(data.closed, 9)}\). Simpson panels \(N = ${data.N}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`치환 법칙: \(\varphi\)가 \([a,b]\)에서 \(C^1\) 단조이고 \(f\)가 연속이면 \(\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(a)}^{\varphi(b)} f(u)\,du\)입니다. 아래 두 수직선의 눈금이 \(\varphi\)에 의해 어떻게 늘어나고 줄어드는지 보세요 — 적분은 그 늘어난 눈금 위의 넓이를 다시 세는 것뿐입니다.`,
      en: String.raw`Change of variables: if \(\varphi\) is \(C^1\) and monotone on \([a,b]\) and \(f\) is continuous, then \(\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(a)}^{\varphi(b)} f(u)\,du\). Watch how the tick marks on the two number lines below stretch and compress under \(\varphi\) — the integral just re-measures area on the stretched ruler.`,
    },
    lang,
  );
}

function createChangeOfVariablesScene(): Scene<ChangeOfVariablesData> {
  let hostEl: HTMLElement | undefined;
  let chartTop: Chart | undefined;
  let chartBottom: Chart | undefined;
  let wrapTop: HTMLElement | undefined;
  let wrapBottom: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ChangeOfVariablesData; state: ControlState } | undefined;

  const drawPhi = (data: ChangeOfVariablesData): void => {
    if (!chartTop) return;
    const { g, width, height } = chartTop;
    g.selectAll('*').remove();

    const upper = xMax(data.sub);
    const x = scaleLinear().domain([0, upper]).range([0, width]);
    const y = scaleLinear().domain([0, 1]).range([height, 0]);
    const px = line<CovSample>().x((d) => x(d.x)).y((d) => y(d.y));

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: `치환 사상 φ(x) = u (u = ${phiTeX(data.sub)})`, en: `Substitution map φ(x) = u (u = ${phiTeX(data.sub)})` },
          lang,
        ),
      );

    // Dashed guides: evenly spaced x ticks down to the axis, and their
    // phi images across to the u axis -- the stretching, pointwise.
    for (const t of phiTicks(data.sub)) {
      g.append('line')
        .attr('x1', x(t.x))
        .attr('x2', x(t.x))
        .attr('y1', y(t.u))
        .attr('y2', height)
        .attr('stroke-dasharray', '3 3')
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.35);
      g.append('line')
        .attr('x1', 0)
        .attr('x2', x(t.x))
        .attr('y1', y(t.u))
        .attr('y2', y(t.u))
        .attr('stroke-dasharray', '3 3')
        .style('stroke', 'var(--bound)')
        .attr('opacity', 0.6);
    }

    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.phiCurve) ?? '');
  };

  const drawStrips = (data: ChangeOfVariablesData): void => {
    if (!chartBottom) return;
    const { g, width, height } = chartBottom;
    g.selectAll('*').remove();

    const upper = xMax(data.sub);
    const xLine = scaleLinear().domain([0, upper]).range([40, width - 20]);
    const uLine = scaleLinear().domain([0, 1]).range([40, width - 20]);
    const yX = height * 0.3;
    const yU = height * 0.72;

    const drawNumberLine = (yPos: number, scale: ScaleLinear<number, number>): void => {
      g.append('line')
        .attr('x1', scale(0))
        .attr('x2', scale(scale.domain()[1] as number))
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke-width', 2)
        .attr('stroke', 'currentColor');
    };
    drawNumberLine(yX, xLine);
    drawNumberLine(yU, uLine);

    for (const t of phiTicks(data.sub)) {
      // x tick (accent): evenly spaced.
      g.append('line')
        .attr('x1', xLine(t.x))
        .attr('x2', xLine(t.x))
        .attr('y1', yX - 8)
        .attr('y2', yX + 8)
        .attr('stroke-width', 2.5)
        .style('stroke', 'var(--accent)');
      // u tick (bound): phi-mapped, stretched/compressed.
      g.append('line')
        .attr('x1', uLine(t.u))
        .attr('x2', uLine(t.u))
        .attr('y1', yU - 8)
        .attr('y2', yU + 8)
        .attr('stroke-width', 2.5)
        .style('stroke', 'var(--bound)');
      // Connector between corresponding ticks.
      g.append('line')
        .attr('x1', xLine(t.x))
        .attr('x2', uLine(t.u))
        .attr('y1', yX + 8)
        .attr('y2', yU - 8)
        .attr('stroke-width', 1)
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.4);
    }

    g.append('text')
      .attr('x', 8)
      .attr('y', yX - 14)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `x (균등 눈금)`, en: `x (even ticks)` }, lang));
    g.append('text')
      .attr('x', 8)
      .attr('y', yU - 14)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: `u = φ(x) (늘어난 눈금)`, en: `u = φ(x) (stretched ticks)` }, lang));
    g.append('text')
      .attr('x', xLine(upper) + 6)
      .attr('y', yX + 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(upper > 1.5 ? 'π/2' : '1');
    g.append('text')
      .attr('x', uLine(1) + 6)
      .attr('y', yU + 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text('1');
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !verdictSlot) return;
    drawPhi(last.data);
    drawStrips(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      const topWrap = document.createElement('div');
      topWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const bottomWrap = document.createElement('div');
      bottomWrap.style.cssText = 'flex: 0 0 150px; min-height: 0; position: relative;';
      const strips = document.createElement('div');
      strips.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; flex: none;';
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      verdict.style.marginTop = '4px';

      strips.append(readout, verdict);
      host.append(topWrap, bottomWrap, strips);

      wrapTop = topWrap;
      wrapBottom = bottomWrap;
      chartTop = createChart(topWrap, MARGIN);
      chartBottom = createChart(bottomWrap, { top: 8, right: 20, bottom: 8, left: 20 });
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (chartTop && wrapTop) chartTop.setSize(wrapTop.clientWidth || 640, wrapTop.clientHeight || 240);
      if (chartBottom && wrapBottom) chartBottom.setSize(wrapBottom.clientWidth || 640, 150);
      draw();
    },
    dispose() {
      chartTop?.destroy();
      chartBottom?.destroy();
      chartTop = undefined;
      chartBottom = undefined;
      wrapTop = undefined;
      wrapBottom = undefined;
      readoutSlot = undefined;
      verdictSlot = undefined;
      if (hostEl) {
        hostEl.replaceChildren();
        hostEl.style.display = '';
        hostEl.style.flexDirection = '';
        hostEl = undefined;
      }
      last = undefined;
    },
  };
}

export default defineScene<ChangeOfVariablesData>({
  model: changeOfVariablesModel,
  createScene: createChangeOfVariablesScene,
});
