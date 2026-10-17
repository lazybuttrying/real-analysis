import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  stripInlineMath,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createChart, type Chart } from '../../../view/d3kit';
import { kummerModel, type KummerData } from '../models/kummerTest';

/**
 * Kummer's test, live. The panel plots the Kummer quotient
 * K_k = p_k (a_k/a_{k+1}) - p_{k+1} for the Gauss example
 * a_k = k!/((a+1)(a+2)...(a+k)) against the 0-line; for p_k = k a dashed
 * asymptote at a - 1 is added. The slider moves n from 10 to 500, the
 * selects switch the probe p_k and the parameter a (2 vs 1/2).
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 64 };

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

function pLabel(pKind: KummerData['pKind']): string {
  if (pKind === 'p1') return '1';
  if (pKind === 'pn') return 'k';
  return 'k\\,\\ln(k+1)';
}

function aLabel(aSel: KummerData['aSel']): string {
  return aSel === 'ahalf' ? '\\tfrac12' : '2';
}

function readoutText(data: KummerData, lang: Lang): string {
  const { pKind, aSel, n, kummer, limit } = data;
  const kN = kummer[kummer.length - 1] ?? NaN;
  const limitStr = Number.isFinite(limit) ? limit.toFixed(4) : limit > 0 ? '+\\infty' : '-\\infty';
  return localize(
    {
      ko: String.raw`\(p_k = ${pLabel(pKind)}\), \(a = ${aLabel(aSel)}\), \(n = ${n}\)에서 \(K_{${n}} \approx ${kN.toFixed(4)}\) — 이론적 극한(추세)은 \(K_n \to ${limitStr}\)입니다.`,
      en: String.raw`At \(p_k = ${pLabel(pKind)}\), \(a = ${aLabel(aSel)}\), \(n = ${n}\): \(K_{${n}} \approx ${kN.toFixed(4)}\) — theoretical limit (trend) is \(K_n \to ${limitStr}\).`,
    },
    lang,
  );
}

function verdictText(data: KummerData, lang: Lang): string {
  const { pKind, aSel } = data;
  if (pKind === 'p1') {
    return localize(
      {
        ko: String.raw`판정 불가: \(K_n = \frac{a}{n+1} \to 0\) — 부호가 안정되지 않아 Kummer 판정을 적용할 수 없습니다 (비율판정법도 마찬가지, \(\frac{a_n}{a_{n+1}} \to 1\)).`,
        en: String.raw`Inconclusive: \(K_n = \frac{a}{n+1} \to 0\) — the sign never settles, so Kummer's test cannot be applied (the ratio test is likewise stuck, \(\frac{a_n}{a_{n+1}} \to 1\)).`,
      },
      lang,
    );
  }
  if (pKind === 'pn') {
    if (aSel === 'a2') {
      return localize(
        {
          ko: String.raw`수렴: \(K_n = \frac{n-1}{n+1} \to 1 > 0\) — \(n \ge 3\)에서 \(K_n \ge \frac12 > 0\)이므로 Kummer 판정법의 수렴 조건을 만족합니다.`,
          en: String.raw`Converges: \(K_n = \frac{n-1}{n+1} \to 1 > 0\) — \(K_n \ge \frac12 > 0\) for \(n \ge 3\), satisfying Kummer's convergence half.`,
        },
        lang,
      );
    }
    return localize(
      {
        ko: String.raw`발산: \(K_n = \frac{-0.5n-1}{n+1} \to -\frac12 < 0\) — 결국 \(K_n \le 0\)이고 \(\sum \frac1n\)이 발산하므로 Kummer 판정법의 발산 조건을 만족합니다.`,
        en: String.raw`Diverges: \(K_n = \frac{-0.5n-1}{n+1} \to -\frac12 < 0\) — eventually \(K_n \le 0\) and \(\sum \frac1n\) diverges, satisfying Kummer's divergence half.`,
      },
      lang,
    );
  }
  if (aSel === 'a2') {
    return localize(
      {
        ko: String.raw`수렴: \(p_k = k\ln(k+1)\)에 대해 \(K_n\)은 양수로 커지며, 발산하는 \(\sum \frac{1}{k\ln(k+1)}\)과 함께 Kummer 판정법의 수렴 조건을 만족합니다.`,
        en: String.raw`Converges: with \(p_k = k\ln(k+1)\), \(K_n\) grows positive, satisfying Kummer's convergence half (against the diverging \(\sum \frac{1}{k\ln(k+1)}\)).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`발산: \(p_k = k\ln(k+1)\)에 대해 \(K_n\)은 음수로 유지되며, \(\sum \frac{1}{k\ln(k+1)}\)이 발산하므로 Kummer 판정법의 발산 조건을 만족합니다.`,
      en: String.raw`Diverges: with \(p_k = k\ln(k+1)\), \(K_n\) stays negative, and \(\sum \frac{1}{k\ln(k+1)}\) diverges, satisfying Kummer's divergence half.`,
    },
    lang,
  );
}

function createKummerTestScene(): Scene<KummerData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: KummerData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { pKind, aSel, n, ks, kummer, limit } = data;

    const { g, width, height } = chart;
    g.selectAll('*').remove();
    const x = scaleLinear().domain([1, Math.max(2, n)]).range([0, width]);
    let lo = 0;
    let hi = 0;
    for (const v of kummer) {
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    if (pKind === 'pn') {
      lo = Math.min(lo, limit);
      hi = Math.max(hi, limit);
    }
    const pad = Math.max(0.05, (hi - lo) * 0.15);
    const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(y).ticks(6));

    const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
    header.text(
      localize(
        {
          ko: `Kummer 몫 K_k = p_k·(a_k/a_{k+1}) − p_{k+1} — a = ${aSel === 'ahalf' ? '1/2' : '2'} (Gauss h = ${aSel === 'ahalf' ? '1/2' : '2'})`,
          en: `Kummer quotient K_k = p_k·(a_k/a_{k+1}) − p_{k+1} — a = ${aSel === 'ahalf' ? '1/2' : '2'} (Gauss h = ${aSel === 'ahalf' ? '1/2' : '2'})`,
        },
        lang,
      ),
    );

    // The 0-line: staying strictly above means convergence, strictly below
    // (with sum 1/p_n divergent) means divergence.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.5);

    // Dashed asymptote at the theoretical limit for p_k = k.
    if (pKind === 'pn') {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(limit))
        .attr('y2', y(limit))
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4');
      g.append('text')
        .attr('x', width - 4)
        .attr('y', y(limit) - 6)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .style('fill', 'var(--accent)')
        .text(`a − 1 = ${limit}`);
    }

    // The K_k curve.
    const kummerLine = line<{ k: number; v: number }>()
      .x((d) => x(d.k))
      .y((d) => y(d.v));
    const pts = ks.map((k, i) => ({ k, v: kummer[i] ?? 0 }));
    if (pts.length > 1) {
      g.append('path').datum(pts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('d', kummerLine);
    }
    const kN = kummer[kummer.length - 1] ?? 0;
    g.append('circle').attr('cx', x(n)).attr('cy', y(kN)).attr('r', 4).style('fill', 'var(--accent)');

    g.append('text')
      .attr('x', 8)
      .attr('y', height + 32)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        localize(
          { ko: `■ K_k 곡선 (p_k = ${pKind === 'p1' ? '1' : pKind === 'pn' ? 'k' : 'k ln(k+1)'})`, en: `■ K_k curve (p_k = ${pKind === 'p1' ? '1' : pKind === 'pn' ? 'k' : 'k ln(k+1)'})` },
          lang,
        ),
      );

    setRich(readoutSlot, readoutText(data, lang));
    setRich(verdictSlot, verdictText(data, lang));
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
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';

      // Cross-links: Raabe's test (Kummer with p_n = n) and the test survey.
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const raabeLink = document.createElement('a');
      raabeLink.href = '../raabe-test/';
      raabeLink.textContent = localize(
        { ko: 'Raabe 판정법 씬 — Kummer의 p_n = n 특수경우', en: "Raabe's test scene — Kummer with p_n = n" },
        lang,
      );
      const testsLink = document.createElement('a');
      testsLink.href = '../tests/';
      testsLink.textContent = localize(
        { ko: '수렴 판정법 모음', en: 'Convergence tests survey' },
        lang,
      );
      seeAlso.append(
        document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)),
        raabeLink,
        document.createTextNode(' · '),
        testsLink,
      );

      strips.append(readout, verdict, seeAlso);
      host.append(chartWrap, strips);

      readoutSlot = makeSlot(readout);
      verdictSlot = makeSlot(verdict);
      wrap = chartWrap;
      chart = createChart(chartWrap, MARGIN);
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
      readoutSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
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

export default defineScene<KummerData>({ model: kummerModel, createScene: createKummerTestScene });
