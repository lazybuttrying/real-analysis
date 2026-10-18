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
import { muntzSzaszModel, type MuntzData, type MuntzSample } from '../models/muntzSzasz';

/**
 * The Muntz-Szasz theorem, live. f(x) = sqrt(x) is drawn in gray dashed;
 * the least-squares fit in the dense basis {1, x, ..., x^N} (accent)
 * visibly closes in on it while the fit in the sparse basis
 * {1, x, x^4, ..., x^{N^2}} (bound color) stays stuck. The readout quotes
 * both grid sup errors honestly: the dense error shrinks with N
 * (0.1003 -> 0.0708 -> 0.0544 for N = 4 -> 6 -> 8) while the sparse error
 * barely moves (0.1792 -> 0.1676 -> 0.1616) — exactly the two halves of
 * the theorem: sum 1/n = infty says "dense", sum 1/n^2 = pi^2/6 < infty
 * says "not dense".
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: MuntzData, lang: Lang): string {
  const { n, supErrDense, supErrSparse } = data;
  return localize(
    {
      ko: String.raw`\(N = ${n}\): 조밀 기저 \(\lVert p_{\mathrm{dense}} - f \rVert_\infty \approx ${fmt(supErrDense, 4)}\), 희소 기저 \(\lVert p_{\mathrm{sparse}} - f \rVert_\infty \approx ${fmt(supErrSparse, 4)}\). 조밀 쪽은 \(N\)을 키울수록 줄고, 희소 쪽은 \(\approx 0.16\) 부근에 묶여 있습니다 — 아래가 그 이유입니다.`,
      en: String.raw`\(N = ${n}\): dense basis \(\lVert p_{\mathrm{dense}} - f \rVert_\infty \approx ${fmt(supErrDense, 4)}\), sparse basis \(\lVert p_{\mathrm{sparse}} - f \rVert_\infty \approx ${fmt(supErrSparse, 4)}\). The dense error shrinks with \(N\); the sparse error stays stuck near \(0.16\) — the reason is below.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`Müntz–Szász 정리: \(0 < \lambda_1 < \lambda_2 < \cdots\)에 대해 \(\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\}\)가 \(C[0,1]\)에서 조밀 \(\iff \sum \frac{1}{\lambda_n} = \infty\). \(\lambda_n = n\)이면 \(\sum \frac{1}{n} = \infty\)라서 조밀하고, \(\lambda_n = n^2\)이면 \(\sum \frac{1}{n^2} = \frac{\pi^2}{6} < \infty\)이라서 조밀할 수 없습니다.`,
      en: String.raw`Müntz–Szász theorem: for \(0 < \lambda_1 < \lambda_2 < \cdots\), \(\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\}\) is dense in \(C[0,1]\) \(\iff \sum \frac{1}{\lambda_n} = \infty\). With \(\lambda_n = n\), \(\sum \frac{1}{n} = \infty\) gives density; with \(\lambda_n = n^2\), \(\sum \frac{1}{n^2} = \frac{\pi^2}{6} < \infty\) forbids it.`,
    },
    lang,
  );
}

function stallNoteText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`솔직한 숫자: 조밀 기저는 \(N = 4, 6, 8\)에서 오차가 \(0.1003 \to 0.0708 \to 0.0544\)로 줄지만, 희소 기저는 \(0.1792 \to 0.1676 \to 0.1616\)으로 거의 움직이지 않습니다. \(x^{n^2}\) 같은 고차항은 \(0\) 근처에서 평평해서 \(\sqrt{x}\)의 뾰족함을 잡지 못합니다 — 기저 함수를 늘려도 빠진 지수 \(\frac{1}{n^2}\)의 합이 수렴하면 조밀해질 수 없습니다.`,
      en: String.raw`The honest numbers: the dense basis error shrinks \(0.1003 \to 0.0708 \to 0.0544\) for \(N = 4, 6, 8\), while the sparse basis error barely moves \(0.1792 \to 0.1676 \to 0.1616\). High powers like \(x^{n^2}\) are flat near \(0\) and cannot catch the cusp of \(\sqrt{x}\) — no matter how many basis functions you add, a convergent \(\sum \frac{1}{\lambda_n}\) forbids density.`,
    },
    lang,
  );
}

function createMuntzSzaszScene(): Scene<MuntzData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let stallSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MuntzData; state: ControlState } | undefined;

  const path = line<MuntzSample>()
    .x((d) => d.x)
    .y((d) => d.y);

  const drawMain = (data: MuntzData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();
    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const y = scaleLinear().domain([-0.15, 1.15]).range([height, 0]);
    const px = path.x((d) => x(d.x)).y((d) => y(d.y));

    g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(10));
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
            ko: `f(x) = √x 근사 (N = ${data.n}): 조밀 기저 {1, x, …, x^N} vs 희소 기저 {1, x, x⁴, …, x^(N²)}`,
            en: `Approximating f(x) = √x (N = ${data.n}): dense basis {1, x, …, x^N} vs sparse basis {1, x, x⁴, …, x^(N²)}`,
          },
          lang,
        ),
      );

    // f, dashed gray.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.55)
      .attr('stroke', 'currentColor')
      .attr('d', px(data.f) ?? '');
    // sparse fit, bound color: stuck.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)')
      .attr('d', px(data.sparse) ?? '');
    // dense fit, accent: closing in.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.dense) ?? '');

    // Legend.
    const legendY = height + 34;
    g.append('text')
      .attr('x', 8)
      .attr('y', legendY)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(localize({ ko: '┄ f(x) = √x', en: '┄ f(x) = √x' }, lang));
    g.append('text')
      .attr('x', width * 0.3)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: `— 희소 기저 (묵음)`, en: `— sparse basis (stuck)` }, lang));
    g.append('text')
      .attr('x', width * 0.58)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `— 조밀 기저 (다가감)`, en: `— dense basis (closing in)` }, lang));
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !verdictSlot || !stallSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(verdictSlot, verdictText(lang));
    setRichText(stallSlot, stallNoteText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainChart = createChart(mainWrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      const stallNote = document.createElement('div');
      stallNote.style.marginTop = '4px';

      // Cross-link: the Weierstrass scene this one deepens (full
      // polynomials are the lambda_n = n case of the theorem).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const approxLink = document.createElement('a');
      approxLink.href = '../weierstrass-approx/';
      approxLink.textContent = localize(
        {
          ko: '바이어슈트라스 근사정리 씬 — 다항식 전체는 조밀한 경우',
          en: 'Weierstrass approximation scene — the dense case (all polynomials)',
        },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), approxLink);

      shell.strips.append(readout, verdict, stallNote, seeAlso);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      stallSlot = createRichSlot(stallNote);
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
      verdictSlot = undefined;
      stallSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<MuntzData>({ model: muntzSzaszModel, createScene: createMuntzSzaszScene });
