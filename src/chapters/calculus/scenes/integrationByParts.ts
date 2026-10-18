import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
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
  integrationByPartsModel,
  type IbpSample,
  type IntegrationByPartsData,
} from '../models/integrationByParts';

/**
 * Integration by parts, live. Top: the integrand u v' with its area shaded
 * (the LHS). Bottom: v u' with its area shaded, the piece that gets
 * subtracted from the boundary term [u v]_0^b (the RHS). The readout shows
 * both sides agreeing to 1e-9 and the closed form.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function pairTeX(pair: string): string {
  return pair === 'x·sin x' ? 'x\\sin x' : 'x e^x';
}

function readoutText(data: IntegrationByPartsData, lang: Lang): string {
  const p = pairTeX(data.pair);
  return localize(
    {
      ko: String.raw`\(\int_0^{${fmt(data.b, 1)}} ${p}\,dx\): LHS \(\approx ${fmt(data.lhs, 9)}\), RHS \(= [uv]_0^b - \int v\,du \approx ${fmt(data.boundary, 9)} - ${fmt(data.sub, 9)} \approx ${fmt(data.rhs, 9)}\). \(|\text{LHS} - \text{RHS}| \approx ${fmt(Math.abs(data.lhs - data.rhs), 2)}\), 닫힌 꼴 \(= ${fmt(data.closedForm, 9)}\).`,
      en: String.raw`\(\int_0^{${fmt(data.b, 1)}} ${p}\,dx\): LHS \(\approx ${fmt(data.lhs, 9)}\), RHS \(= [uv]_0^b - \int v\,du \approx ${fmt(data.boundary, 9)} - ${fmt(data.sub, 9)} \approx ${fmt(data.rhs, 9)}\). \(|\text{LHS} - \text{RHS}| \approx ${fmt(Math.abs(data.lhs - data.rhs), 2)}\), closed form \(= ${fmt(data.closedForm, 9)}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`부분적분: \(u, v\)가 \([a,b]\)에서 \(C^1\)이면 \(\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du\)입니다. 곱의 미분 \((uv)' = u'v + uv'\)를 적분하고 미적분학 기본정리를 적용한 것뿐입니다 — 윗그림의 넓이가 \([uv]_0^b\)에서 아랫그림의 넓이를 뺀 것과 같습니다.`,
      en: String.raw`Integration by parts: if \(u, v\) are \(C^1\) on \([a,b]\), then \(\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du\). It is just the product rule \((uv)' = u'v + uv'\) integrated, with the fundamental theorem applied — the top area equals \([uv]_0^b\) minus the bottom area.`,
    },
    lang,
  );
}

function createIntegrationByPartsScene(): Scene<IntegrationByPartsData> {
  let hostEl: HTMLElement | undefined;
  let chartTop: Chart | undefined;
  let chartBottom: Chart | undefined;
  let wrapTop: HTMLElement | undefined;
  let wrapBottom: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: IntegrationByPartsData; state: ControlState } | undefined;

  const drawPanel = (
    chart: Chart | undefined,
    curve: IbpSample[],
    color: string,
    title: string,
    yPad: number,
  ): void => {
    if (!chart) return;
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const b = curve.length > 0 ? (curve[curve.length - 1]?.x ?? 1) : 1;
    const ys = curve.map((p) => p.y);
    const yMin = Math.min(0, ...ys) - yPad;
    const yMax = Math.max(0, ...ys) + yPad;
    const x = scaleLinear().domain([0, b]).range([0, width]);
    const y = scaleLinear().domain([yMin, yMax]).range([height, 0]);

    const lineGen = line<IbpSample>().x((d) => x(d.x)).y((d) => y(d.y));
    const areaGen = area<IbpSample>()
      .x((d) => x(d.x))
      .y0(y(0))
      .y1((d) => y(d.y));

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(title);

    g.append('path')
      .attr('fill', color)
      .attr('opacity', 0.25)
      .attr('d', areaGen(curve) ?? '');
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', color)
      .attr('d', lineGen(curve) ?? '');
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !verdictSlot) return;
    const data = last.data;
    const p = pairTeX(data.pair);
    const subP = data.pair === 'x·sin x' ? '-\\cos x' : 'e^x';
    const topTitle = localize(
      { ko: `u v' = ${p}: 넓이가 LHS`, en: `u v' = ${p}: this area is the LHS` },
      lang,
    );
    const bottomTitle = localize(
      { ko: `v u' = ${subP}: [uv]에서 빼는 조각`, en: `v u' = ${subP}: the piece subtracted from [uv]` },
      lang,
    );
    drawPanel(chartTop, data.curve, 'var(--accent)', topTitle, 0.2);
    drawPanel(chartBottom, data.subCurve, 'var(--bound)', bottomTitle, 0.2);
    setRichText(readoutSlot, readoutText(data, lang));
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
      bottomWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
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
      chartBottom = createChart(bottomWrap, MARGIN);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (chartTop && wrapTop) chartTop.setSize(wrapTop.clientWidth || 640, wrapTop.clientHeight || 260);
      if (chartBottom && wrapBottom) chartBottom.setSize(wrapBottom.clientWidth || 640, wrapBottom.clientHeight || 260);
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

export default defineScene<IntegrationByPartsData>({
  model: integrationByPartsModel,
  createScene: createIntegrationByPartsScene,
});
