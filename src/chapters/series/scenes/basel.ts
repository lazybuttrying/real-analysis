import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import {
  clearGroup,
  createBars,
  createGrid,
  createGroup,
  createLabel,
  createLine,
  createPlane,
  createPoints,
  createThreeStage,
  disposeObject,
  fmt,
  COLORS,
  type ThreeStage,
} from '../../../view/threekit';
import { baselModel, LIMIT, type BaselData } from '../models/basel';

// Bars of height 1/n^2 in front; the gold staircase of partial sums
// behind them climbs toward a translucent limit plane at pi^2/6.
// The DOM overlay carries the live readouts and the honesty note:
// the picture shows the sum converging, not why pi appears.

type RootGroup = ReturnType<typeof createGroup>;

const LABEL_BG = 'rgba(10, 15, 26, 0.66)';

function createBaselScene(): Scene<BaselData> {
  let stage: ThreeStage | undefined;
  let root: RootGroup | undefined;
  let wrap: HTMLDivElement | undefined;
  let readoutEl: HTMLDivElement | undefined;
  let lang: Lang = 'ko';
  let last: { data: BaselData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!stage || !root || !last || !readoutEl) return;
    const { data } = last;
    const n = data.n;
    clearGroup(root);

    // Uniform vertical scale: every height in the scene (bars,
    // staircase, limit plane) is multiplied by the same factor,
    // so all proportions stay exact - it is just axis scaling.
    const YS = 1.7;
    const step = 0.62;
    const x0 = -((n - 1) * step) / 2;
    const xAt = (i: number): number => x0 + i * step;

    // Term bars (front row).
    root.add(
      createBars(
        data.heights.map((h, i) => ({
          x: xAt(i),
          z: 2.2,
          height: h * YS,
          width: 0.4,
          depth: 0.5,
          color: i === n - 1 ? COLORS.yellow : COLORS.blue,
        })),
      ),
    );

    // Partial-sum staircase (back row).
    const sumPts: Array<[number, number, number]> = data.sums.map((s, i) => [xAt(i), s * YS, -2.4]);
    root.add(createLine(sumPts, COLORS.yellow, {}));
    root.add(createPoints(sumPts, COLORS.yellow, { size: 0.26 }));

    // Limit plane at pi^2/6 plus a dashed target line on the back row.
    const span = Math.max(12, n * step + 5);
    const plane = createPlane(span, 6.6, COLORS.yellow, 0.14);
    plane.position.set(0, LIMIT * YS, 0);
    root.add(plane);
    root.add(
      createLine(
        [
          [xAt(0) - 1.6, LIMIT * YS, -2.4],
          [xAt(n - 1) + 1.6, LIMIT * YS, -2.4],
        ],
        COLORS.yellow,
        { dashed: true },
      ),
    );

    // Labels.
    const l1 = createLabel(localize({ ko: '항 1/n²', en: 'terms 1/n²' }, lang), { worldHeight: 0.6, color: '#bcdcff', bg: LABEL_BG });
    l1.position.set(xAt(0), 2.9, 2.2);
    root.add(l1);
    const l2 = createLabel(localize({ ko: '부분합', en: 'partial sums' }, lang), { worldHeight: 0.6, color: '#ffe1a1', bg: LABEL_BG });
    l2.position.set(xAt(0), LIMIT * YS + 0.85, -2.4);
    root.add(l2);
    const l3 = createLabel(localize({ ko: '극한 π²/6', en: 'limit π²/6' }, lang), { worldHeight: 0.6, color: '#ffe1a1', bg: LABEL_BG });
    l3.position.set(xAt(n - 1) + 0.4, LIMIT * YS + 0.55, -0.6);
    root.add(l3);

    readoutEl.textContent = localize(
      {
        ko: `N = ${n}    S_N = ${fmt(data.sum)}    극한 π²/6 = ${fmt(data.limit)}    |오차| = ${fmt(data.error)}    마지막 항 1/N² = ${fmt(data.lastTerm)}`,
        en: `N = ${n}    S_N = ${fmt(data.sum)}    limit π²/6 = ${fmt(data.limit)}    |error| = ${fmt(data.error)}    last term 1/N² = ${fmt(data.lastTerm)}`,
      },
      lang,
    );
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      wrap = document.createElement('div');
      wrap.style.position = 'relative';
      wrap.style.width = '100%';
      wrap.style.height = '100%';
      host.append(wrap);

      stage = createThreeStage(wrap);
      stage.camera.position.set(0, 6, 11.5);
      stage.controls.target.set(0, 0.6, 0);
      stage.controls.update();
      stage.scene.add(createGrid(28, 14, 0.16));

      root = createGroup();
      stage.scene.add(root);

      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '10px';
      overlay.style.left = '12px';
      overlay.style.pointerEvents = 'none';
      overlay.style.fontSize = '13px';
      overlay.style.lineHeight = '1.5';
      overlay.style.padding = '6px 10px';
      overlay.style.borderRadius = '6px';
      overlay.style.background = 'color-mix(in srgb, var(--bg) 78%, transparent)';
      overlay.style.color = 'var(--fg)';
      readoutEl = document.createElement('div');
      readoutEl.style.fontWeight = '600';
      const caption = document.createElement('div');
      caption.style.fontSize = '12px';
      caption.style.color = 'var(--muted)';
      caption.textContent = localize(
        {
          ko: '아이디어 수준: 그림은 합이 수렴하는 모습을 보여줄 뿐, π가 왜 등장하는지는 증명하지 않습니다. (오일러의 도약: sin x를 무한곱으로 쓰기)',
          en: "Idea level: the picture shows the sum converging — it is not a proof of why π appears (Euler's leap: sin x as an infinite product).",
        },
        lang,
      );
      overlay.append(readoutEl, caption);
      wrap.append(overlay);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize(width, height) {
      stage?.resize(width, height);
    },
    dispose() {
      if (root) disposeObject(root);
      stage?.dispose();
      stage = undefined;
      root = undefined;
      readoutEl = undefined;
      wrap = undefined;
      last = undefined;
    },
  };
}

export default defineScene<BaselData>({ model: baselModel, createScene: createBaselScene });
