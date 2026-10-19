import { axisBottom, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { borelCantelliModel, type BorelCantelliData } from '../models/borelCantelli';

/**
 * The Borel-Cantelli lemmas, live on two interval sequences in [0,1].
 * Stacked strips show E_1..E_n: in summable mode the nested intervals
 * [0, 1/n^2] shrink at the left while the cumulative length converges to
 * pi^2/6; in nonsummable mode the dyadic intervals cycle through full
 * levels, each contributing length 1. The heatmap bar shows per-point
 * coverage counts, and the red band marks the limsup approximation —
 * points covered by at least t of the n sets — shrinking to {0} in
 * summable mode and filling [0,1] in nonsummable mode.
 */

const MARGIN = { top: 40, right: 20, bottom: 30, left: 64 };

const MODE_NAME: Record<string, { ko: string; en: string }> = {
  summable: { ko: '합 수렴 모드 (E_n = [0, 1/n²])', en: 'summable (E_n = [0, 1/n²])' },
  nonsummable: { ko: '합 발산 모드 (dyadic 순환)', en: 'nonsummable (cycling dyadic)' },
};

function modeName(mode: string, lang: Lang): string {
  return localize(
    (MODE_NAME[mode] ?? MODE_NAME['summable']) as { ko: string; en: string },
    lang,
  );
}

function limitStr(mode: string): string {
  return mode === 'summable' ? String.raw`\(\frac{\pi^2}{6} \approx 1.6449\)` : String.raw`\(\infty\)`;
}

function readoutText(data: BorelCantelliData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`${modeName(data.mode, 'ko')}, \(n = ${data.n}\): 누적 길이 \(\sum_{k \le n} m(E_k) = ${fmt(data.partialSum, 4)}\) → ${limitStr(data.mode)}. limsup 근사 (\({data.threshold}\)개 이상 포함): 측도 \(\approx ${fmt(data.limsupMeasure, 4)}\).`,
      en: String.raw`${modeName(data.mode, 'en')}, \(n = ${data.n}\): cumulative length \(\sum_{k \le n} m(E_k) = ${fmt(data.partialSum, 4)}\) → ${limitStr(data.mode)}. Limsup approximation (in at least \({data.threshold}\) sets): measure \(\approx ${fmt(data.limsupMeasure, 4)}\).`,
    },
    lang,
  );
}

function explainText(data: BorelCantelliData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`각 행은 집합 \(E_1, \dots, E_n\)을 \([0, 1]\) 위에 쌓은 것입니다. 아래 히트맵은 점별 포함 횟수, 빨간 띠는 limsup 근사(\({data.threshold}\)개 이상 포함된 점)입니다.`,
      en: String.raw`Each row stacks the set \(E_1, \dots, E_n\) over \([0, 1]\). The heatmap below shows per-point coverage counts; the red band is the limsup approximation (points in at least \({data.threshold}\) sets).`,
    },
    lang,
  );
  const modeNote =
    data.mode === 'summable'
      ? localize(
          {
            ko: String.raw` 합 수렴 모드에서는 구간 \([0, \frac{1}{n^2}]\)이 중첩되며 쪼그라들고, 누적 길이가 \(\frac{\pi^2}{6} \approx 1.6449\)로 수렴합니다 — 히트맵의 포함 횟수도 0 근처에만 몰립니다.`,
            en: String.raw` In summable mode the nested intervals \([0, \frac{1}{n^2}]\) shrink away while the cumulative length converges to \(\frac{\pi^2}{6} \approx 1.6449\) — the heatmap's coverage counts pile up near 0 only.`,
          },
          lang,
        )
      : localize(
          {
            ko: String.raw` 합 발산 모드에서는 dyadic 구간이 레벨마다 \([0, 1]\)을 가득 채우며 순환합니다 — 레벨 하나당 길이가 1씩 쌓여 발산하고, 히트맵은 모든 점이 매 레벨마다 포함됨을 보여줍니다.`,
            en: String.raw` In nonsummable mode the dyadic intervals cycle through full levels covering \([0, 1]\) — each level adds length 1, diverging, and the heatmap shows every point covered at every level.`,
          },
          lang,
        );
  return body + modeNote;
}

function verdictText(data: BorelCantelliData, lang: Lang): string {
  return data.mode === 'summable'
    ? localize(
        {
          ko: String.raw`\(\sum m(E_n) = \frac{\pi^2}{6} < \infty\)이므로 Borel–Cantelli I에 의해 \(m(\limsup E_n) = 0\) — 실제로 \(\limsup E_n = \{0\}\)입니다. 빨간 limsup 근사가 0으로 쪼그라드는 모습이 보입니다 (아래 문제 1, 2).`,
          en: String.raw`Since \(\sum m(E_n) = \frac{\pi^2}{6} < \infty\), Borel–Cantelli I gives \(m(\limsup E_n) = 0\) — indeed \(\limsup E_n = \{0\}\). Watch the red limsup approximation shrink to 0 (problems 1–2 below).`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`각 점은 매 dyadic 레벨마다 포함되므로 \(\limsup F_n = [0, 1]\) — 길이가 발산하면 "무한히 자주" 일어나는 점이 \([0, 1]\) 전체가 됩니다. 독립성 하의 역방향은 아래 문제 3 (주사위).`,
          en: String.raw`Every point is covered at each dyadic level, so \(\limsup F_n = [0, 1]\) — when the lengths diverge, the points occurring "infinitely often" are all of \([0, 1]\). The converse under independence is problem 3 below (dice).`,
        },
        lang,
      );
}

function createBorelCantelliScene(): Scene<BorelCantelliData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: BorelCantelliData; state: ControlState } | undefined;

  const drawMain = (data: BorelCantelliData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const x = scaleLinear().domain([0, 1]).range([0, width]);

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `Borel–Cantelli: ${modeName(data.mode, 'ko')} — E_1부터 E_${data.n}까지`,
            en: `Borel–Cantelli: ${modeName(data.mode, 'en')} — E_1 through E_${data.n}`,
          },
          lang,
        ),
      );

    // Vertical layout: strips, heatmap, limsup band, axis.
    const heatH = 16;
    const limH = 10;
    const axisH = 26;
    const g1 = 10;
    const g2 = 6;
    const g3 = 8;
    const stripsH = Math.max(40, height - (g1 + heatH + g2 + limH + g3 + axisH));
    const heatY = stripsH + g1;
    const limY = heatY + heatH + g2;
    const axisY = limY + limH + g3;

    // Stacked interval strips.
    const n = data.intervals.length;
    const rowH = stripsH / Math.max(1, n);
    data.intervals.forEach((iv, i) => {
      g.append('rect')
        .attr('x', x(iv.l))
        .attr('width', Math.max(0.5, x(iv.r) - x(iv.l)))
        .attr('y', i * rowH + 0.5)
        .attr('height', Math.max(0.5, rowH - 1.5))
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.55);
    });
    if (n <= 14) {
      data.intervals.forEach((iv, i) => {
        void iv;
        g.append('text')
          .attr('x', -10)
          .attr('y', i * rowH + rowH / 2 + 4)
          .attr('text-anchor', 'end')
          .attr('font-size', 10)
          .attr('fill', 'currentColor')
          .attr('opacity', 0.7)
          .text(`E${i + 1}`);
      });
    }

    // Coverage-count heatmap.
    const m = data.sampleX.length;
    const cellW = width / m;
    const maxC = Math.max(1, ...data.coverage);
    data.sampleX.forEach((sx, i) => {
      const c = data.coverage[i] ?? 0;
      g.append('rect')
        .attr('x', x(sx) - cellW / 2)
        .attr('width', cellW + 0.4)
        .attr('y', heatY)
        .attr('height', heatH)
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.06 + (0.9 * c) / maxC);
    });
    g.append('text')
      .attr('x', 0)
      .attr('y', heatY - 4)
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .text(localize({ ko: '점별 포함 횟수', en: 'per-point coverage count' }, lang));

    // Limsup approximation band (red).
    data.sampleX.forEach((sx, i) => {
      if (!data.limsupHit[i]) return;
      g.append('rect')
        .attr('x', x(sx) - cellW / 2)
        .attr('width', cellW + 0.4)
        .attr('y', limY)
        .attr('height', limH)
        .attr('fill', 'var(--bound)')
        .attr('opacity', 0.9);
    });
    g.append('text')
      .attr('x', 0)
      .attr('y', limY - 4)
      .attr('font-size', 11)
      .attr('fill', 'var(--bound)')
      .text(
        localize(
          {
            ko: `limsup 근사 (${data.threshold}개 이상 포함)`,
            en: `limsup approximation (in ≥ ${data.threshold} sets)`,
          },
          lang,
        ),
      );

    g.append('g').attr('transform', `translate(0,${axisY})`).call(axisBottom(x).ticks(6));
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot || !verdictSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(last.data, lang));
    setRichText(verdictSlot, verdictText(last.data, lang));
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

export default defineScene<BorelCantelliData>({ model: borelCantelliModel, createScene: createBorelCantelliScene });
