import { axisBottom, axisLeft, line, scaleLinear, scaleLog } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import {
  exampleValue,
  monotoneDiscontinuitiesModel,
  type MonotoneDiscontinuitiesData,
} from '../models/monotoneDiscontinuities';

/**
 * Monotone functions can only jump. Top panel: the staircase of
 * f(x) = x + sum_{k: q_k < x} 2^{-k} on [0, 1] — strictly increasing, yet
 * discontinuous at every rational q_k (jump dots mark the lift 2^{-k}).
 * Bottom panel: the jump sizes on a log scale against the 1/n threshold
 * line; jumps above it are highlighted. The readout compares the number of
 * big jumps with the finite-set bound n * (f(1) - f(0)).
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 64 };

function readoutText(data: MonotoneDiscontinuitiesData, lang: Lang): string {
  const { n, terms, bigCount, bound, range } = data;
  const thresholdTex = `\\(\\frac{1}{${n}}\\)`;
  // The exact range is always < 2; floats round to exactly 2 at terms >= 53.
  const rangeCmp = range < 2 ? '< 2' : '\\le 2';
  return localize(
    {
      ko: String.raw`\(n = ${n}\), 항 \(terms = ${terms}\)개: 점프가 ${thresholdTex}을 초과하는 유리수는 ${bigCount}개 — 상한 \(n(f(1) - f(0)) \approx ${bound.toFixed(4)}\) (여기서 \(f(1) - f(0) \approx ${range.toFixed(4)} ${rangeCmp}\)) 이하입니다.`,
      en: String.raw`\(n = ${n}\), \(terms = ${terms}\): ${bigCount} rationals have a jump larger than ${thresholdTex} — within the bound \(n(f(1) - f(0)) \approx ${bound.toFixed(4)}\) (with \(f(1) - f(0) \approx ${range.toFixed(4)} ${rangeCmp}\)).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`단조함수의 불연속점은 점프뿐입니다: 왼쪽 극한은 \(f(x-) = \sup_{t<x} f(t)\), 오른쪽 극한은 \(f(x+) = \inf_{t>x} f(t)\)로 항상 존재하고, \(j(x) = f(x+) - f(x-) \ge 0\)의 총합은 \(f(b) - f(a)\)를 넘지 않으므로 \(\left\{x : j(x) > \frac{1}{n}\right\}\)은 유한집합 — 불연속점 전체는 그 가산합집합이니 최대 가산개입니다.`,
      en: String.raw`Monotone functions can only jump: the one-sided limits always exist as \(f(x-) = \sup_{t<x} f(t)\) and \(f(x+) = \inf_{t>x} f(t)\), the jumps \(j(x) = f(x+) - f(x-) \ge 0\) sum to at most \(f(b) - f(a)\), so each \(\left\{x : j(x) > \frac{1}{n}\right\}\) is finite — and the discontinuities are the countable union of those sets.`,
    },
    lang,
  );
}

function createMonotoneDiscontinuitiesScene(): Scene<MonotoneDiscontinuitiesData> {
  let hostEl: HTMLElement | undefined;
  let chartTop: Chart | undefined;
  let chartBottom: Chart | undefined;
  let wrapTop: HTMLElement | undefined;
  let wrapBottom: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MonotoneDiscontinuitiesData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chartTop || !chartBottom || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { n, terms, rationals, fSamples, bigJumps, bigCount } = data;
    const bigKeys = new Set(bigJumps.map((r) => r.k));
    const qs = rationals.map((r) => r.x);

    // --- Top panel: the staircase of f with its jumps ---
    {
      const { g, width, height } = chartTop;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([0, 1]).range([0, width]);
      let fMax = 0;
      for (const s of fSamples) fMax = Math.max(fMax, s.f);
      const y = scaleLinear().domain([0, fMax * 1.05]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(10));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          { ko: `f(x) = x + Σ 2^{-k} 계단 — 유리수마다 2^{-k}만큼 뛰어오릅니다`, en: `f(x) = x + Σ 2^{-k} staircase — it jumps by 2^{-k} at every rational` },
          lang,
        ),
      );

      // The graph itself: a polyline through the fine samples.
      const fLine = line<{ x: number; f: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.f));
      g.append('path')
        .datum(fSamples)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.5)
        .attr('d', fLine);

      // Mark each jump: a dot at the bottom (value = left limit) and a
      // filled dot at the top (right limit) of the rise.
      for (const r of rationals) {
        const bottom = exampleValue(r.x, qs);
        const top = bottom + r.size;
        const cx = x(r.x);
        g.append('line')
          .attr('x1', cx)
          .attr('x2', cx)
          .attr('y1', y(bottom))
          .attr('y2', y(top))
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', bigKeys.has(r.k) ? 3 : 1.5)
          .attr('opacity', bigKeys.has(r.k) ? 1 : 0.55);
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', y(top))
          .attr('r', bigKeys.has(r.k) ? 4 : 2.5)
          .style('fill', 'var(--accent)')
          .attr('opacity', bigKeys.has(r.k) ? 1 : 0.7);
      }
    }

    // --- Bottom panel: jump sizes against the 1/n threshold (log scale) ---
    {
      const { g, width, height } = chartBottom;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([0.5, Math.max(1.5, terms + 0.5)]).range([0, width]);
      const yMax = 1;
      const yMin = Math.min(1 / n / 2, 2 ** -(terms + 1));
      const y = scaleLog().domain([yMin, yMax]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(Math.min(terms, 12)));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          { ko: `점프 크기 2^{-k} vs 임계값 1/${n} — 위의 ${bigCount}개가 큰 점프입니다`, en: `Jump sizes 2^{-k} vs threshold 1/${n} — the ${bigCount} above are the big jumps` },
          lang,
        ),
      );

      const barWidth = Math.max(1, (x(2) - x(1)) * 0.7);
      for (const r of rationals) {
        const isBig = bigKeys.has(r.k);
        g.append('rect')
          .attr('x', x(r.k) - barWidth / 2)
          .attr('width', barWidth)
          .attr('y', y(r.size))
          .attr('height', Math.max(1, height - y(r.size)))
          .style('fill', 'var(--accent)')
          .attr('opacity', isBig ? 0.95 : 0.3);
      }

      // Dashed threshold line at 1/n.
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(1 / n))
        .attr('y2', y(1 / n))
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4')
        .attr('opacity', 0.8);
      g.append('text')
        .attr('x', width - 4)
        .attr('y', y(1 / n) - 6)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.8)
        .text(`1/${n}`);

      g.append('text')
        .attr('x', 8)
        .attr('y', height + 32)
        .attr('font-size', 12)
        .style('fill', 'var(--accent)')
        .text(localize({ ko: `■ ${bigCount}개의 큰 점프 (1/${n} 초과)`, en: `■ ${bigCount} big jumps (above 1/${n})` }, lang));
    }

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

      // The continuity scene lives in this chapter; prose-only reference,
      // no cross-chapter link needed (prerequisites are the coordinator's job).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      seeAlso.textContent = localize(
        { ko: '연속성 씬의 그림과 함께 보세요: 연속이면 점프가 하나도 없는 경우입니다.', en: 'Read alongside the continuity scene: continuity is the case with no jumps at all.' },
        lang,
      );

      strips.append(readout, verdict, seeAlso);
      host.append(topWrap, bottomWrap, strips);

      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      wrapTop = topWrap;
      wrapBottom = bottomWrap;
      chartTop = createChart(topWrap, MARGIN);
      chartBottom = createChart(bottomWrap, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (!chartTop || !wrapTop) return;
      chartTop.setSize(wrapTop.clientWidth || 640, wrapTop.clientHeight || 280);
      if (chartBottom && wrapBottom) {
        chartBottom.setSize(wrapBottom.clientWidth || 640, wrapBottom.clientHeight || 280);
      }
      draw();
    },
    dispose() {
      chartTop?.destroy();
      chartBottom?.destroy();
      chartTop = undefined;
      chartBottom = undefined;
      readoutSlot = undefined;
      verdictSlot = undefined;
      wrapTop = undefined;
      wrapBottom = undefined;
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

export default defineScene<MonotoneDiscontinuitiesData>({ model: monotoneDiscontinuitiesModel, createScene: createMonotoneDiscontinuitiesScene });
