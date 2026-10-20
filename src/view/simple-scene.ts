import {
  defineScene,
  type ControlState,
  type Lang,
  type Scene,
  type SceneModel,
} from '../contracts';
import { createRichSlot, setRichText, type RichSlot } from './richslot';
import {
  createChart,
  createSceneShell,
  type Chart,
  type Margin,
  type SceneShell,
} from './d3kit';

/**
 * Shared scene boilerplate, extracted from the 123 scenes that repeat the
 * same mount/render/resize/dispose skeleton (2026-10-19).
 *
 * Two mount modes:
 * - Shell mode (slots non-empty): createSceneShell + one Chart + a RichSlot
 *   per slot descriptor, appended to shell.strips in order. Matches the
 *   post-2026-10-17 scene pattern byte-for-byte (div styles, child order).
 * - Direct mode (slots empty/omitted): a single Chart mounted directly on
 *   the host, no text slots. Matches the pre-shell scene pattern; resize()
 *   re-sizes the chart like the majority of the original scenes did.
 *
 * Scenes with genuinely custom layouts (canvas overlays, charts living
 * outside the chart wrap, interactive controls inside the scene body)
 * keep their own mount code and do not use this helper. Dual-chart scenes
 * whose second chart stacks (or sits beside) the main one inside the
 * shell's chart wrap use the drawSecond options below.
 */

/** One text strip below the chart. */
export interface SimpleSlot<D> {
  /** Dynamic text (TeX via \(...\)) re-rendered into a RichSlot on every render. */
  text: (data: D, lang: Lang) => string;
  /** fontWeight 600 (the readout/verdict look). */
  bold?: boolean;
  /** marginTop 4px (separation from the previous strip). */
  spaced?: boolean;
  /** Full cssText override; when set, bold/spaced are ignored. */
  cssText?: string;
}

export interface SimpleSceneConfig<D> {
  model: SceneModel<D>;
  /** Chart margins. Defaults to d3kit's DEFAULT_MARGIN via createChart. */
  margin?: Margin;
  /**
   * Fallback chart height used when the wrap's clientHeight is 0.
   * Defaults to 360 (createChart's own fallback). Scenes that used a
   * different fallback (300, 320, 420, ...) pass their value here so the
   * migration is behavior-preserving.
   */
  fallbackHeight?: number;
  /**
   * The D3 drawing code. Receives the chart (use chart.g/width/height),
   * the computed data, and the page language. Must clear the chart
   * (g.selectAll('*').remove()) before drawing, as before.
   */
  drawMain: (chart: Chart, data: D, lang: Lang) => void;
  /**
   * Text strips below the chart, in order. Empty/omitted selects direct
   * mode (no shell, no slots).
   */
  slots?: ReadonlyArray<SimpleSlot<D>>;
  /**
   * Optional extra static content appended to shell.strips at mount time
   * (e.g. cross-links). Receives the strips element and the page language.
   * Shell mode only.
   */
  mountExtra?: (strips: HTMLElement, lang: Lang) => void;
  /**
   * Optional second chart inside the shell's chart wrap (shell mode only;
   * its presence also selects shell mode when slots are empty). When set,
   * the chart wrap becomes a flex container holding two sub-wraps — the
   * main chart's and the second chart's — instead of hosting the main
   * chart directly. Extracted from the dual-chart scenes, which all
   * compose their two charts this way inside (or exactly like) the shell.
   */
  drawSecond?: (chart: Chart, data: D, lang: Lang) => void;
  /** Margins for the second chart. Defaults to `margin`. */
  marginSecond?: Margin;
  /**
   * Fallback height for the second chart's resize (used when its wrap's
   * clientHeight is 0). Defaults to `fallbackHeight`. Fixed-height second
   * charts pass their height here: their wrap's clientHeight always equals
   * it, so the helper's clientHeight-based resize reproduces the original
   * constant-height setSize.
   */
  fallbackHeightSecond?: number;
  /**
   * Fallback width for the main chart's resize in dual mode (used when its
   * wrap's clientWidth is 0). Defaults to 640, the width fallback the
   * single-chart paths use. Side-by-side scenes whose panels fall back to
   * a narrower width pass it explicitly.
   */
  fallbackWidth?: number;
  /** Fallback width for the second chart's resize in dual mode. Defaults to `fallbackWidth`. */
  fallbackWidthSecond?: number;
  /**
   * cssText of the main chart's sub-wrap in dual mode. Defaults to
   * 'flex: 1 1 auto; min-height: 0; position: relative;' — the stacked
   * scenes' wrap style. Scenes pass their original wrap cssText verbatim.
   */
  mainWrapCss?: string;
  /** cssText of the second chart's sub-wrap in dual mode. Defaults to the mainWrapCss default. */
  secondWrapCss?: string;
  /**
   * Flex direction of the chart wrap in dual mode: 'column' (stacked,
   * default) or 'row' (side by side, with the side-by-side scenes' 8px gap).
   */
  secondLayout?: 'column' | 'row';
}

/** Default cssText for a dual-mode chart sub-wrap: an equal share of the chart wrap. */
const DUAL_WRAP_CSS = 'flex: 1 1 auto; min-height: 0; position: relative;';

export function defineSimpleScene<D>(config: SimpleSceneConfig<D>) {
  const { model, margin, fallbackHeight = 360 } = config;
  const slotConfigs: ReadonlyArray<SimpleSlot<D>> = config.slots ?? [];
  const dual = config.drawSecond !== undefined;
  const useShell = slotConfigs.length > 0 || dual;
  const fallbackHeightSecond = config.fallbackHeightSecond ?? fallbackHeight;
  const fallbackWidth = config.fallbackWidth ?? 640;
  const fallbackWidthSecond = config.fallbackWidthSecond ?? fallbackWidth;

  function createSimpleScene(): Scene<D> {
    let shell: SceneShell | undefined;
    let chart: Chart | undefined;
    let chartSecond: Chart | undefined;
    let wrap: HTMLElement | undefined;
    let wrapMain: HTMLElement | undefined;
    let wrapSecond: HTMLElement | undefined;
    let richSlots: RichSlot[] = [];
    let lang: Lang = 'ko';
    let last: { data: D; state: ControlState } | undefined;

    const draw = (): void => {
      if (!last || !chart) return;
      config.drawMain(chart, last.data, lang);
      if (dual && chartSecond) config.drawSecond?.(chartSecond, last.data, lang);
      for (let i = 0; i < slotConfigs.length && i < richSlots.length; i++) {
        setRichText(richSlots[i] as RichSlot, (slotConfigs[i] as SimpleSlot<D>).text(last.data, lang));
      }
    };

    return {
      mount(host, pageLang) {
        lang = pageLang;
        if (!useShell) {
          chart = createChart(host, margin);
          wrap = host;
          return;
        }
        shell = createSceneShell(host);
        wrap = shell.chartWrap;
        if (dual) {
          const chartWrap = shell.chartWrap;
          const layout = config.secondLayout ?? 'column';
          chartWrap.style.display = 'flex';
          chartWrap.style.flexDirection = layout;
          if (layout === 'row') chartWrap.style.gap = '8px';
          wrapMain = document.createElement('div');
          wrapMain.style.cssText = config.mainWrapCss ?? DUAL_WRAP_CSS;
          wrapSecond = document.createElement('div');
          wrapSecond.style.cssText = config.secondWrapCss ?? DUAL_WRAP_CSS;
          chartWrap.append(wrapMain, wrapSecond);
          chart = createChart(wrapMain, margin);
          chartSecond = createChart(wrapSecond, config.marginSecond ?? margin);
        } else {
          chart = createChart(wrap, margin);
        }
        const divs: HTMLElement[] = [];
        for (const slot of slotConfigs) {
          const div = document.createElement('div');
          if (slot.cssText !== undefined) {
            div.style.cssText = slot.cssText;
          } else {
            if (slot.bold === true) div.style.fontWeight = '600';
            if (slot.spaced === true) div.style.marginTop = '4px';
          }
          divs.push(div);
          richSlots.push(createRichSlot(div));
        }
        shell.strips.append(...divs);
        config.mountExtra?.(shell.strips, lang);
      },
      render(data, state) {
        last = { data, state };
        draw();
      },
      resize() {
        if (dual) {
          if (chart && wrapMain) {
            chart.setSize(wrapMain.clientWidth || fallbackWidth, wrapMain.clientHeight || fallbackHeight);
          }
          if (chartSecond && wrapSecond) {
            chartSecond.setSize(
              wrapSecond.clientWidth || fallbackWidthSecond,
              wrapSecond.clientHeight || fallbackHeightSecond,
            );
          }
        } else if (chart && wrap) {
          chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || fallbackHeight);
        }
        draw();
      },
      dispose() {
        chart?.destroy();
        chart = undefined;
        chartSecond?.destroy();
        chartSecond = undefined;
        wrapMain = undefined;
        wrapSecond = undefined;
        richSlots = [];
        wrap = undefined;
        shell?.dispose();
        shell = undefined;
        last = undefined;
      },
    };
  }

  return defineScene<D>({ model, createScene: createSimpleScene });
}
