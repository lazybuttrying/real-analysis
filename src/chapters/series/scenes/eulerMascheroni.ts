import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import { GAMMA_TRUE, eulerMascheroniModel, type EulerMascheroniData } from '../models/eulerMascheroni';

/**
 * The Euler-Mascheroni constant, live. Top panel: the harmonic numbers H_n
 * as a staircase of bars against the smooth curve ln n — the two diverge,
 * but their gap settles. Bottom panel: gamma_n = H_n - ln n homing in on
 * the dashed asymptote gamma ~ 0.5772. The slider moves n from 1 to 200.
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 64 };

function readoutText(data: EulerMascheroniData, lang: Lang): string {
  const { n, hN, lnN, gammaN } = data;
  return localize(
    {
      ko: String.raw`\(n = ${n}\)에서 \(H_{${n}} \approx ${hN.toFixed(6)}\), \(\ln ${n} \approx ${lnN.toFixed(6)}\), 차이 \(\gamma_{${n}} = H_{${n}} - \ln ${n} \approx ${gammaN.toFixed(6)}\) — 두 곡선 모두 발산하지만 그 간격은 \(\gamma \approx 0.5772\)에 안착합니다.`,
      en: String.raw`At \(n = ${n}\): \(H_{${n}} \approx ${hN.toFixed(6)}\), \(\ln ${n} \approx ${lnN.toFixed(6)}\), gap \(\gamma_{${n}} = H_{${n}} - \ln ${n} \approx ${gammaN.toFixed(6)}\) — both curves diverge, yet their gap settles toward \(\gamma \approx 0.5772\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`수렴의 이유: \(\sum_{k=1}^{n}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right) = H_n - \ln(n+1) = \gamma_n - \ln\left(1+\frac{1}{n}\right) \to \gamma\) — 중간 항이 망원경처럼 상쇄되고 남는 것은 오일러-마스케로니 상수 \(\gamma\)뿐입니다.`,
      en: String.raw`Why it converges: \(\sum_{k=1}^{n}\left(\frac{1}{k} - \ln\left(1+\frac{1}{k}\right)\right) = H_n - \ln(n+1) = \gamma_n - \ln\left(1+\frac{1}{n}\right) \to \gamma\) — everything telescopes away except the Euler–Mascheroni constant \(\gamma\).`,
    },
    lang,
  );
}

function createEulerMascheroniScene(): Scene<EulerMascheroniData> {
  let hostEl: HTMLElement | undefined;
  let chartTop: Chart | undefined;
  let chartBottom: Chart | undefined;
  let wrapTop: HTMLElement | undefined;
  let wrapBottom: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: EulerMascheroniData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chartTop || !chartBottom || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { n, terms, hN, lnN, gammaN } = data;

    // --- Top panel: H_n staircase vs ln n ---
    {
      const { g, width, height } = chartTop;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([0.5, Math.max(1.5, n + 0.5)]).range([0, width]);
      const yMax = Math.max(hN, lnN, 1) * 1.08;
      const y = scaleLinear().domain([0, yMax]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          { ko: `H_n 계단 vs ln n 곡선 — 둘 다 발산합니다`, en: `H_n staircase vs ln n curve — both diverge` },
          lang,
        ),
      );

      // Staircase bars of H_n.
      for (const t of terms) {
        const prevH = t.k === 1 ? 0 : (terms[t.k - 2]?.h ?? 0);
        g.append('rect')
          .attr('x', x(t.k) + 0.5)
          .attr('width', Math.max(0.5, x(t.k + 1) - x(t.k) - 1))
          .attr('y', y(t.h))
          .attr('height', Math.max(0, height - y(t.h)))
          .style('fill', 'var(--accent)')
          .attr('opacity', 0.55);
        // Riser from the previous step.
        g.append('line')
          .attr('x1', x(t.k))
          .attr('x2', x(t.k))
          .attr('y1', y(prevH))
          .attr('y2', y(t.h))
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 1.5);
      }

      // Smooth ln curve.
      const lnLine = line<{ k: number; v: number }>()
        .x((d) => x(d.k))
        .y((d) => y(d.v));
      const pts = terms.map((t) => ({ k: t.k, v: t.ln }));
      if (pts.length > 1) {
        g.append('path').datum(pts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('d', lnLine);
      }

      g.append('text')
        .attr('x', 8)
        .attr('y', height + 32)
        .attr('font-size', 12)
        .style('fill', 'var(--accent)')
        .text(localize({ ko: '■ H_n 계단', en: '■ H_n staircase' }, lang));
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 32)
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(localize({ ko: '— ln n 곡선', en: '— ln n curve' }, lang));
    }

    // --- Bottom panel: gamma_n settling toward the asymptote ---
    {
      const { g, width, height } = chartBottom;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([1, Math.max(2, n)]).range([0, width]);
      let lo = GAMMA_TRUE;
      let hi = GAMMA_TRUE;
      for (const t of terms) {
        lo = Math.min(lo, t.gamma);
        hi = Math.max(hi, t.gamma);
      }
      const pad = Math.max(0.02, (hi - lo) * 0.2);
      const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          { ko: `γ_n = H_n − ln n — 점선 점근선 γ ≈ 0.5772에 안착합니다`, en: `γ_n = H_n − ln n — settling onto the dashed asymptote γ ≈ 0.5772` },
          lang,
        ),
      );

      // Dashed asymptote at the true gamma.
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(GAMMA_TRUE))
        .attr('y2', y(GAMMA_TRUE))
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4');
      g.append('text')
        .attr('x', width - 4)
        .attr('y', y(GAMMA_TRUE) - 6)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .style('fill', 'var(--accent)')
        .text('γ ≈ 0.5772');

      // gamma_n curve.
      const gammaLine = line<{ k: number; v: number }>()
        .x((d) => x(d.k))
        .y((d) => y(d.v));
      const pts = terms.map((t) => ({ k: t.k, v: t.gamma }));
      if (pts.length > 1) {
        g.append('path').datum(pts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('d', gammaLine);
      }
      if (n >= 1) {
        g.append('circle').attr('cx', x(n)).attr('cy', y(gammaN)).attr('r', 4).style('fill', 'var(--accent)');
      }
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

      // Cross-link to the harmonic series scene (relative: ../harmonic/).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const link = document.createElement('a');
      link.href = '../harmonic/';
      link.textContent = localize(
        { ko: '조화급수 씬 — 부분합이 ln n을 따라 발산하는 모습', en: 'Harmonic series scene — partial sums diverging along ln n' },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), link);

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

export default defineScene<EulerMascheroniData>({ model: eulerMascheroniModel, createScene: createEulerMascheroniScene });
