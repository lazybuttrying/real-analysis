import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, stripInlineMath, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { raabeModel, type RaabeData } from '../models/raabeTest';

// Top panel: the Raabe quotient R_k = k (a_k/a_{k+1} - 1) settling toward
// its limit, with the decision boundary y = 1 (dashed) and, for the
// central example, the limit line y = 3/2 (dashed). The log example adds
// a second, muted curve (p = 1, divergent) to show both fates sharing
// the boundary L = 1. Bottom panel: the ordinary ratio r_k = a_{k+1}/a_k
// hovering near 1, dramatizing the ratio test's surrender. The verdict
// strip below states which side of the boundary R_k landed on.

const TOP_MARGIN = { top: 60, right: 20, bottom: 36, left: 56 };
const BOTTOM_MARGIN = { top: 52, right: 20, bottom: 36, left: 56 };

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

function exampleLabel(example: string, lang: Lang): string {
  if (example === 'log') return localize({ ko: 'a_k = 1/(k(ln k)²)', en: 'a_k = 1/(k(ln k)²)' }, lang);
  return localize({ ko: 'a_k = C(2k,k)/(4^k(2k+1))', en: 'a_k = C(2k,k)/(4^k(2k+1))' }, lang);
}

function verdictText(data: RaabeData, lang: Lang): string {
  if (data.example === 'log') {
    return localize(
      {
        ko: String.raw`경계 \(L = 1\): 라베 판정법은 판단을 유보합니다 — \(p = 2\)는 적분 판정법으로 수렴하고, \(p = 1\)은 적분 판정법으로 발산합니다.`,
        en: String.raw`boundary \(L = 1\): Raabe's test stays silent — \(p = 2\) converges (integral test) while \(p = 1\) diverges (integral test).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`라베 판정법: \(R_k \to \frac{3}{2} > 1\)이므로 수렴합니다 — 비율 \(r_k \to 1\)은 이 급수에 대해 아무것도 말해주지 않습니다.`,
      en: String.raw`Raabe's test: \(R_k \to \frac{3}{2} > 1\) — converges. The ratio \(r_k \to 1\) says nothing about this series.`,
    },
    lang,
  );
}

function createRaabeScene(): Scene<RaabeData> {
  let hostEl: HTMLElement | undefined;
  let topChart: Chart | undefined;
  let bottomChart: Chart | undefined;
  let topWrap: HTMLElement | undefined;
  let bottomWrap: HTMLElement | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: RaabeData; state: ControlState } | undefined;

  const drawTop = (data: RaabeData): void => {
    if (!topChart) return;
    const { g, width, height } = topChart;
    g.selectAll('*').remove();
    const { kStart, n, raabe, raabeP1, limit } = data;
    const ks = raabe.map((_, i) => kStart + i);

    const allVals = [...raabe, ...(raabeP1 ?? []), limit, 1];
    const lo = Math.min(...allVals);
    const hi = Math.max(...allVals);
    const pad = Math.max(0.02, (hi - lo) * 0.08);
    const x = scaleLinear()
      .domain([kStart, kStart + n - 1])
      .range([0, width]);
    const y = scaleLinear()
      .domain([lo - pad, hi + pad])
      .range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    g.append('text')
      .attr('x', 0)
      .attr('y', -40)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(localize({ ko: `R_k = k(a_k/a_{k+1} − 1) — ${exampleLabel(data.example, lang)}`, en: `R_k = k(a_k/a_{k+1} − 1) — ${exampleLabel(data.example, lang)}` }, lang));
    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(
        localize(
          {
            ko: data.example === 'log' ? `R_k → 1 — 진하게 p = 2, 옅게 p = 1` : `R_k → 3/2 — 경계 1 위에 안착하면 수렴`,
            en: data.example === 'log' ? `R_k → 1 — solid: p = 2, faint: p = 1` : `R_k → 3/2 — settling above the boundary 1 means convergence`,
          },
          lang,
        ),
      );

    // Decision boundary y = 1.
    g.append('line')
      .attr('x1', x(kStart))
      .attr('x2', x(kStart + n - 1))
      .attr('y1', y(1))
      .attr('y2', y(1))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)');
    g.append('text')
      .attr('x', x(kStart + n - 1) - 4)
      .attr('y', y(1) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(localize({ ko: '판정 경계 1', en: 'boundary 1' }, lang));

    // Limit line y = 3/2 for the central example.
    if (data.example === 'central') {
      g.append('line')
        .attr('x1', x(kStart))
        .attr('x2', x(kStart + n - 1))
        .attr('y1', y(1.5))
        .attr('y2', y(1.5))
        .attr('stroke-dasharray', '6 4')
        .attr('stroke-width', 2)
        .style('stroke', 'var(--accent)');
      g.append('text')
        .attr('x', x(kStart + n - 1) - 4)
        .attr('y', y(1.5) - 8)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', 'var(--accent)')
        .text('L = 3/2');
    }

    const path = line<number>()
      .x((_, i) => x(ks[i] ?? kStart))
      .y((v) => y(v));

    // p = 1 curve (log example only): faint dashed, showing the same boundary.
    if (raabeP1 !== null) {
      g.append('path')
        .datum(raabeP1)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke-dasharray', '5 4')
        .attr('stroke-width', 2)
        .style('stroke', 'var(--muted)');
      g.append('text')
        .attr('x', x(kStart + n - 1) - 4)
        .attr('y', y(raabeP1[raabeP1.length - 1] ?? 1) + 16)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', 'var(--muted)')
        .text(localize({ ko: 'p = 1 (발산)', en: 'p = 1 (diverges)' }, lang));
    }

    // Main R_k curve.
    g.append('path').datum(raabe).attr('d', path).attr('fill', 'none').attr('stroke-width', 2).style('stroke', 'var(--accent)');
    const step = Math.max(1, Math.floor(raabe.length / 60));
    raabe.forEach((v, i) => {
      if (i % step !== 0 && i !== raabe.length - 1) return;
      g.append('circle').attr('cx', x(ks[i] ?? kStart)).attr('cy', y(v)).attr('r', 3).style('fill', 'var(--accent)');
    });
    g.append('text')
      .attr('x', x(kStart + n - 1) - 4)
      .attr('y', y(raabe[raabe.length - 1] ?? limit) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--accent)')
      .text(localize({ ko: `R_${kStart + n - 1} ≈ ${fmt(raabe[raabe.length - 1] ?? 0)}`, en: `R_${kStart + n - 1} ≈ ${fmt(raabe[raabe.length - 1] ?? 0)}` }, lang));
  };

  const drawBottom = (data: RaabeData): void => {
    if (!bottomChart) return;
    const { g, width, height } = bottomChart;
    g.selectAll('*').remove();
    const { kStart, n, ratios } = data;
    const ks = ratios.map((_, i) => kStart + i);
    const hi = Math.max(1, ...ratios) * 1.1;

    const x = scaleLinear()
      .domain([kStart, kStart + n - 1])
      .range([0, width]);
    const y = scaleLinear().domain([0, hi]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(4));

    g.append('text')
      .attr('x', 0)
      .attr('y', -32)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(localize({ ko: 'r_k = a_{k+1}/a_k — 비율 판정법은 판단을 유보합니다', en: 'r_k = a_{k+1}/a_k — the ratio test abstains' }, lang));
    g.append('text')
      .attr('x', 0)
      .attr('y', -12)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(
        localize(
          { ko: `r_${kStart + n - 1} ≈ ${fmt(ratios[ratios.length - 1] ?? 0)} — 1에 달라붙어 극한이 1이라 판정 불가`, en: `r_${kStart + n - 1} ≈ ${fmt(ratios[ratios.length - 1] ?? 0)} — clinging to 1, so the limit is 1 and no verdict` },
          lang,
        ),
      );

    // y = 1 dashed: the ratio's ceiling.
    g.append('line')
      .attr('x1', x(kStart))
      .attr('x2', x(kStart + n - 1))
      .attr('y1', y(1))
      .attr('y2', y(1))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)');
    g.append('text')
      .attr('x', x(kStart + n - 1) - 4)
      .attr('y', y(1) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text('L = 1');

    const path = line<number>()
      .x((_, i) => x(ks[i] ?? kStart))
      .y((v) => y(v));
    g.append('path').datum(ratios).attr('d', path).attr('fill', 'none').attr('stroke-width', 2).style('stroke', 'var(--muted)');
    const step = Math.max(1, Math.floor(ratios.length / 60));
    ratios.forEach((v, i) => {
      if (i % step !== 0 && i !== ratios.length - 1) return;
      g.append('circle').attr('cx', x(ks[i] ?? kStart)).attr('cy', y(v)).attr('r', 3).style('fill', 'var(--muted)');
    });
  };

  const draw = (): void => {
    if (!last || !verdictSlot) return;
    drawTop(last.data);
    drawBottom(last.data);
    setRich(verdictSlot, verdictText(last.data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      topWrap = document.createElement('div');
      topWrap.style.cssText = 'flex: 3 1 auto; min-height: 0; position: relative;';
      bottomWrap = document.createElement('div');
      bottomWrap.style.cssText = 'flex: 2 1 auto; min-height: 0; position: relative;';
      const strips = document.createElement('div');
      strips.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; flex: none;';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(verdict);
      host.append(topWrap, bottomWrap, strips);

      verdictSlot = makeSlot(verdict);
      topChart = createChart(topWrap, TOP_MARGIN);
      bottomChart = createChart(bottomWrap, BOTTOM_MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (!topChart || !topWrap || !bottomChart || !bottomWrap) return;
      topChart.setSize(topWrap.clientWidth || 640, topWrap.clientHeight || 320);
      bottomChart.setSize(bottomWrap.clientWidth || 640, bottomWrap.clientHeight || 220);
      draw();
    },
    dispose() {
      topChart?.destroy();
      bottomChart?.destroy();
      topChart = undefined;
      bottomChart = undefined;
      verdictSlot = undefined;
      topWrap = undefined;
      bottomWrap = undefined;
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

export default defineScene<RaabeData>({ model: raabeModel, createScene: createRaabeScene });
