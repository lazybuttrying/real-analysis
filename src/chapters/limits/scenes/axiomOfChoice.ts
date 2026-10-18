import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, type Chart, type SceneShell } from '../../../view/d3kit';
import { axiomOfChoiceModel, type AxiomOfChoiceData } from '../models/axiomOfChoice';

/**
 * Tao, Analysis I, Axiom 8.1, live. Each row is one set X_i of the family,
 * drawn as a row of balls; the choice function c picks one ball per row,
 * highlighted in accent with a check mark. The readout prints the chosen
 * tuple (c_1, ..., c_m), 0-based like the model. The sliders change the
 * family (m) and the deterministic seed.
 */

const MARGIN = { top: 24, right: 20, bottom: 24, left: 20 };
const CHART_HEIGHT = 340;
const BALL_R = 13;
const BALL_DX = 52;
const BALL_X0 = 110;

function tupleText(data: AxiomOfChoiceData): string {
  return `(${data.choices.join(', ')})`;
}

function readoutText(data: AxiomOfChoiceData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`선택된 튜플 \(c = ${tupleText(data)}\) — 각 상자 \(X_i\)에서 공 하나씩, 총 \(m = ${data.m}\)개 (seed \(= ${data.seed}\)).`,
      en: String.raw`The chosen tuple \(c = ${tupleText(data)}\) — one ball from each bin \(X_i\), \(m = ${data.m}\) in all (seed \(= ${data.seed}\)).`,
    },
    lang,
  );
}

function captionText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`선택함수 \(c\)는 각 집합 \(X_i\)에서 원소 하나를 고릅니다. 집합이 유한하므로 이 선택은 손으로 직접 만들 수 있어 선택 공리가 필요 없습니다 (문제 1).`,
      en: String.raw`The choice function \(c\) picks one element from each set \(X_i\). With finitely many sets this choice can be made by hand, so no choice axiom is needed (problem 1).`,
    },
    lang,
  );
}

function createAxiomOfChoiceScene(): Scene<AxiomOfChoiceData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let captionSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: AxiomOfChoiceData; state: ControlState } | undefined;

  const drawMain = (data: AxiomOfChoiceData): void => {
    if (!mainChart) return;
    const { g, height } = mainChart;
    g.selectAll('*').remove();

    const rowH = (height - 40) / data.m;
    const rowY = (i: number): number => 20 + rowH * (i + 0.5);

    g.append('text')
      .attr('x', 0)
      .attr('y', -8)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `집합족: ${data.m}개의 상자, 선택함수 c가 각 상자에서 공 하나를 고릅니다`,
            en: `The family: ${data.m} bins, the choice function c picks one ball per bin`,
          },
          lang,
        ),
      );

    for (let i = 0; i < data.m; i++) {
      const y = rowY(i);
      const k = data.bins[i] ?? 0;
      const chosen = data.choices[i] ?? -1;

      // Row label X_i (1-based for display).
      g.append('text')
        .attr('x', BALL_X0 - BALL_DX * 0.7)
        .attr('y', y)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 14)
        .attr('font-style', 'italic')
        .attr('fill', 'currentColor')
        .text(`X${i + 1}`);

      for (let j = 0; j < k; j++) {
        const cx = BALL_X0 + j * BALL_DX;
        const isChosen = j === chosen;
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', y)
          .attr('r', BALL_R)
          .attr('fill', isChosen ? 'var(--accent)' : 'none')
          .attr('stroke', isChosen ? 'var(--accent)' : 'currentColor')
          .attr('stroke-width', isChosen ? 0 : 1.5)
          .attr('opacity', isChosen ? 1 : 0.55);
        if (isChosen) {
          g.append('text')
            .attr('x', cx)
            .attr('y', y + 1)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-size', 14)
            .attr('font-weight', 700)
            .attr('fill', '#fff')
            .text('✓');
        }
      }
    }
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !captionSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(captionSlot, captionText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainWrap.style.height = `${CHART_HEIGHT}px`;
      mainChart = createChart(mainWrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const caption = document.createElement('div');
      caption.style.marginTop = '4px';

      shell.strips.append(readout, caption);
      readoutSlot = createRichSlot(readout);
      captionSlot = createRichSlot(caption);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (mainChart && mainWrap)
        mainChart.setSize(mainWrap.clientWidth || 640, mainWrap.clientHeight || CHART_HEIGHT);
      draw();
    },
    dispose() {
      mainChart?.destroy();
      mainChart = undefined;
      readoutSlot = undefined;
      captionSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<AxiomOfChoiceData>({
  model: axiomOfChoiceModel,
  createScene: createAxiomOfChoiceScene,
});
