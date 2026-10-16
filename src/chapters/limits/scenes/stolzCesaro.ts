import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  stripInlineMath,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { stolzCesaroModel, type StolzCesaroData } from '../models/stolzCesaro';

/**
 * Stolz-Cesaro theorem, the sequence version of l'Hopital.
 *
 * Two curves share one limit: the difference ratio
 * r_n = (a_{n+1}-a_n)/(b_{n+1}-b_n) (dashed) settles at L = 1/3 first, and
 * the plain ratio s_n = a_n/b_n (accent) follows it there, for
 * a_n = 1^2+...+n^2 and b_n = n^3. The facts strip reports the computed
 * end values; the verdict states the theorem with its hypotheses; a link
 * strip points at the function version, the calculus chapter's lhopital
 * scene (cross-chapter, so a plain navigation per the shell convention).
 */

interface RichSlot {
  el: HTMLElement;
  seq: number;
  text: string;
}

function makeSlot(el: HTMLElement): RichSlot {
  return { el, seq: 0, text: '' };
}

function setRich(slot: RichSlot, text: string): void {
  if (slot.text === text) return;
  slot.text = text;
  const id = ++slot.seq;
  slot.el.textContent = stripInlineMath(text);
  if (text.includes('\\(')) {
    import('../../../view/richtext')
      .then((module) => {
        if (slot.seq === id) module.renderRichText(slot.el, text);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }
}

function factsText(data: StolzCesaroData, lang: Lang): string {
  const { count, finalRatio, finalDiffRatio } = data;
  return localize(
    {
      ko: String.raw`\(n = ${count}\): 전체 비율 \(s_n \approx ${fmt(finalRatio, 4)}\), 차분 비율 \(r_n \approx ${fmt(finalDiffRatio, 4)}\) — 차분 비율이 먼저 \(\frac{1}{3}\)에 다가가고, 전체 비율이 뒤따라갑니다.`,
      en: String.raw`\(n = ${count}\): full ratio \(s_n \approx ${fmt(finalRatio, 4)}\), difference ratio \(r_n \approx ${fmt(finalDiffRatio, 4)}\) — the difference ratio reaches \(\frac{1}{3}\) first, and the full ratio follows it there.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`체자로 정리 (수열 버전 로피탈): \((b_n)\)이 엄격히 증가하고 \(\infty\)로 발산하며 \(\lim\frac{a_{n+1}-a_n}{b_{n+1}-b_n} = L\)이면 \(\lim\frac{a_n}{b_n} = L\).`,
      en: String.raw`Stolz–Cesàro (the sequence l'Hôpital): if \((b_n)\) is strictly increasing and unbounded and \(\lim\frac{a_{n+1}-a_n}{b_{n+1}-b_n} = L\), then \(\lim\frac{a_n}{b_n} = L\).`,
    },
    lang,
  );
}

function crossLinkText(lang: Lang): string {
  return localize(
    {
      ko: '함수 버전 → 미적분 장의 로피탈 정리',
      en: "The function version → L'Hôpital's rule in the calculus chapter",
    },
    lang,
  );
}

function createStolzCesaroScene(): Scene<StolzCesaroData> {
  let chart: Chart | undefined;
  let hostEl: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: StolzCesaroData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { count, points, limit } = data;
    g.selectAll('*').remove();

    const values: number[] = [limit];
    for (const point of points) {
      values.push(point.diffRatio, point.ratio);
    }
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const pad = Math.max(0.02, (hi - lo) * 0.08);
    const x = scaleLinear().domain([1, count]).range([0, width]);
    const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

    const axisLabel = localize({ ko: 'n', en: 'n' }, lang);
    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(Math.min(10, count)));
    g.append('g').call(axisLeft(y).ticks(6));
    g.append('text')
      .attr('x', width)
      .attr('y', height + 28)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.6)
      .text(axisLabel);

    // Dashed limit line L = 1/3 with label.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(limit))
      .attr('y2', y(limit))
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4');
    g.append('text')
      .attr('x', width - 4)
      .attr('y', y(limit) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .style('fill', 'var(--accent)')
      .text('L = 1/3');

    // Difference ratio (dashed muted): reaches L first.
    const rPath = line<StolzCesaroData['points'][number]>()
      .x((point) => x(point.n))
      .y((point) => y(point.diffRatio));
    g.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', 'var(--muted)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '7 4')
      .attr('d', rPath);

    // Full ratio (solid accent): follows the difference ratio to L.
    const sPath = line<StolzCesaroData['points'][number]>()
      .x((point) => x(point.n))
      .y((point) => y(point.ratio));
    g.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2.5)
      .attr('d', sPath);

    // Legend, top-left.
    const legendRatio = localize(
      { ko: 'sₙ = aₙ/bₙ — 전체 비율', en: 'sₙ = aₙ/bₙ — full ratio' },
      lang,
    );
    const legendDiff = localize(
      { ko: 'rₙ = (aₙ₊₁−aₙ)/(bₙ₊₁−bₙ) — 차분 비율', en: 'rₙ = (aₙ₊₁−aₙ)/(bₙ₊₁−bₙ) — difference ratio' },
      lang,
    );
    const legend = g.append('g').attr('transform', 'translate(8,8)').attr('font-size', 12);
    legend
      .append('line')
      .attr('x1', 0)
      .attr('x2', 26)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2.5);
    legend.append('text').attr('x', 32).attr('y', 4).attr('fill', 'currentColor').text(legendRatio);
    legend
      .append('line')
      .attr('x1', 0)
      .attr('x2', 26)
      .attr('y1', 20)
      .attr('y2', 20)
      .attr('stroke', 'var(--muted)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '7 4');
    legend.append('text').attr('x', 32).attr('y', 24).attr('fill', 'currentColor').text(legendDiff);

    if (factsSlot && verdictSlot) {
      setRich(factsSlot, factsText(data, lang));
      setRich(verdictSlot, verdictText(lang));
    }
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      const chartWrap = document.createElement('div');
      chartWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const strips = document.createElement('div');
      strips.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; flex: none;';
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      const cross = document.createElement('div');
      const link = document.createElement('a');
      link.href = '../calculus/lhopital/';
      link.textContent = crossLinkText(pageLang);
      cross.append(link);
      strips.append(facts, verdict, cross);
      host.append(chartWrap, strips);

      factsSlot = makeSlot(facts);
      verdictSlot = makeSlot(verdict);
      chart = createChart(chartWrap);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize(width, height) {
      chart?.setSize(width, height);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      factsSlot = undefined;
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

export default defineScene<StolzCesaroData>({ model: stolzCesaroModel, createScene: createStolzCesaroScene });
