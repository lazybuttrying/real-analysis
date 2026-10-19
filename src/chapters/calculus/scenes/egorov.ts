import { axisBottom, axisLeft, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { egorovModel, type EgorovData } from '../models/egorov';

/**
 * Egorov's theorem, live on the sliding bump f_n = 1_{[1/(n+1), 1/n]}.
 * The blue bump slides toward 0 as n grows; the red band is the bad set
 * (0, 1/n] — every point that some late bump still hits — shrinking to a
 * point, while on the good set [1/n, 1] (blue underline) the bumps never
 * return, so f_k -> 0 uniformly there. The readout shows m(bad) = 1/n and
 * the Egorov verdict: pick n > 1/eps to push the bad set below eps.
 */

const MARGIN = { top: 40, right: 20, bottom: 48, left: 56 };

function readoutText(data: EgorovData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(\delta = ${fmt(data.delta, 2)}\), \(n = ${data.n}\): 나쁜 집합 \(E_{n,\delta} = (0, \frac{1}{n}]\)의 측도는 \(m(E_{n,\delta}) = \frac{1}{n} = ${fmt(data.badMeasure, 4)}\)입니다. 좋은 집합 \([\frac{1}{n}, 1]\) 위에서는 \(k \ge ${data.tailStart}\)일 때 \(f_k \equiv 0\)이므로 \(f_k \to 0\)이 균등합니다.`,
      en: String.raw`\(\delta = ${fmt(data.delta, 2)}\), \(n = ${data.n}\): the bad set \(E_{n,\delta} = (0, \frac{1}{n}]\) has measure \(m(E_{n,\delta}) = \frac{1}{n} = ${fmt(data.badMeasure, 4)}\). On the good set \([\frac{1}{n}, 1]\), \(f_k \equiv 0\) for \(k \ge ${data.tailStart}\), so \(f_k \to 0\) uniformly there.`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`높이 1인 파란 혹 \(f_n\)이 \([\frac{1}{n+1}, \frac{1}{n}]\) 구간에서 0 쪽으로 미끄러집니다. 빨간 영역 \((0, \frac{1}{n}]\)은 "\(k \ge n\)인 혹에 한 번이라도 걸리는 점"들의 모임으로, \(n\)이 커질수록 0으로 쪼그라듭니다. 파란 밑줄의 좋은 집합 \([\frac{1}{n}, 1]\) 위에서는 혹이 다시는 올라오지 않습니다.`,
      en: String.raw`The blue bump \(f_n\) of height 1 slides toward 0 on \([\frac{1}{n+1}, \frac{1}{n}]\). The red region \((0, \frac{1}{n}]\) is the set of points hit by some bump with \(k \ge n\); it shrinks to 0 as \(n\) grows. On the good set \([\frac{1}{n}, 1]\) (blue underline) the bumps never return.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(n > \frac{1}{\varepsilon}\)로 잡으세요 — 그러면 \(m(E_{n,\delta}) = \frac{1}{n} < \varepsilon\)이고 \(f_k \to 0\)이 \([\frac{1}{n}, 1]\)에서 균등합니다. 이것이 바로 이 수열에 대한 에고로프 정리입니다: 측도가 유한하면 점별수렴은 작은 집합 하나를 도려내고 나면 균등수렴이 됩니다.`,
      en: String.raw`Given \(\varepsilon > 0\), pick \(n > \frac{1}{\varepsilon}\) — then \(m(E_{n,\delta}) = \frac{1}{n} < \varepsilon\) and \(f_k \to 0\) uniformly on \([\frac{1}{n}, 1]\). That is Egorov's theorem for this sequence: on a finite-measure space, pointwise convergence becomes uniform after deleting one small set.`,
    },
    lang,
  );
}

function createEgorovScene(): Scene<EgorovData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: EgorovData; state: ControlState } | undefined;

  const drawMain = (data: EgorovData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const y = scaleLinear().domain([0, 1.4]).range([height, 0]);

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `f_n(x) = 1_[1/(n+1), 1/n](x): 미끄러지는 혹과 줄어드는 나쁜 집합`,
            en: `f_n(x) = 1_[1/(n+1), 1/n](x): the sliding bump and the shrinking bad set`,
          },
          lang,
        ),
      );

    // Bad-set band (0, 1/n] in red.
    g.append('rect')
      .attr('x', x(0))
      .attr('width', Math.max(0, x(data.badRight) - x(0)))
      .attr('y', 0)
      .attr('height', height)
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.14);

    // Boundary of the bad set at x = 1/n.
    const bx = x(data.badRight);
    g.append('line')
      .attr('x1', bx)
      .attr('x2', bx)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,4');

    // Good-set underline on [1/n, 1].
    g.append('line')
      .attr('x1', x(data.goodLeft))
      .attr('x2', x(1))
      .attr('y1', y(0) + 7)
      .attr('y2', y(0) + 7)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 4)
      .attr('opacity', 0.65);

    // Zero line.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.5);

    // The bump f_n (minimum pixel width so it stays visible for large n).
    const bumpX0 = x(data.bumpA);
    const bumpX1 = x(data.bumpB);
    const bumpW = Math.max(3, bumpX1 - bumpX0);
    const bumpC = (bumpX0 + bumpX1) / 2;
    g.append('rect')
      .attr('x', bumpC - bumpW / 2)
      .attr('width', bumpW)
      .attr('y', y(1))
      .attr('height', Math.max(0, y(0) - y(1)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.75);
    g.append('text')
      .attr('x', bumpC)
      .attr('y', y(1) - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text('f_n');

    // '1/n' marker at the top of the boundary line.
    const nearRight = bx > width - 48;
    g.append('text')
      .attr('x', bx + (nearRight ? -5 : 5))
      .attr('y', 32)
      .attr('text-anchor', nearRight ? 'end' : 'start')
      .attr('font-size', 11)
      .attr('fill', 'var(--bound)')
      .text('1/n');

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(3));

    g.append('text')
      .attr('x', 8)
      .attr('y', 16)
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(localize({ ko: '나쁜 집합 (0, 1/n] — 빨강', en: 'bad set (0, 1/n] — red' }, lang));
    g.append('text')
      .attr('x', width - 8)
      .attr('y', 16)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--accent)')
      .text(
        localize(
          { ko: '좋은 집합 [1/n, 1]: 여기서 균등수렴', en: 'good set [1/n, 1]: uniform here' },
          lang,
        ),
      );
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot || !verdictSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(lang));
    setRichText(verdictSlot, verdictText(lang));
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

export default defineScene<EgorovData>({ model: egorovModel, createScene: createEgorovScene });
