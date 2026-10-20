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
 * shell's chart wrap use the drawSecond options below. Title-bar scenes
 * put their above-chart strip in slotsAbove; grid scenes whose chart
 * size derives from the data use sizeFromData; panel-switching scenes
 * toggle individual slots with SimpleSlot.visible; labelled dual panels
 * put a static caption above each chart with mainLabel/secondLabel.
 */

/** One text strip below (or above) the chart. */
export interface SimpleSlot<D> {
  /** Dynamic text (TeX via \(...\)) re-rendered into a RichSlot on every render. */
  text: (data: D, lang: Lang) => string;
  /** fontWeight 600 (the readout/verdict look). */
  bold?: boolean;
  /** marginTop 4px (separation from the previous strip). */
  spaced?: boolean;
  /** Full cssText override; when set, bold/spaced are ignored. */
  cssText?: string;
  /**
   * Per-render visibility: when set, the slot's div gets display 'none'
   * on renders where this returns false for the current data, and ''
   * otherwise. Omitted = always visible (the div's display is never
   * touched). Extracted from the panel-switching scenes, which show
   * exactly one of two strips per render.
   */
  visible?: (data: D) => boolean;
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
   * Text strips above the chart wrap, in order (shell mode only; their
   * presence also selects shell mode when slots are empty). Same
   * SimpleSlot shape as `slots`; each div is inserted into the host
   * directly before the chart wrap, as a flex sibling of it — matching
   * the title-bar scenes' hand-built layouts, whose above-chart divs
   * carry their own padding/font-size in the slot's cssText (they do not
   * inherit the strips container's).
   */
  slotsAbove?: ReadonlyArray<SimpleSlot<D>>;
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
  /**
   * Optional data-driven sizing for the main chart, applied in resize()
   * in place of (per dimension) the container-based size. Receives the
   * last rendered data and the chart wrap's RAW clientWidth/clientHeight
   * (either may be 0 before layout), and returns the dimensions it wants
   * to override; an omitted dimension keeps the standard container-based
   * value (clientWidth || fallback, clientHeight || fallbackHeight).
   * Extracted from the grid scenes, whose resize() derives the chart size
   * from the data (e.g. height = rows * cell + constants, width =
   * max(clientWidth, grid width)). Only called once data exists — before
   * the first render, resize() uses the standard sizing, exactly like the
   * original scenes' createChart initial size.
   */
  sizeFromData?: (
    data: D,
    container: { width: number; height: number },
  ) => { width?: number; height?: number };
  /**
   * Optional static label above the main chart in dual mode, rendered
   * inside its sub-wrap: the sub-wrap gains a label div followed by an
   * inner chart div (styled like a default sub-wrap) that hosts the
   * chart, and resize() measures the inner div, so the label never eats
   * into the chart's size. The text is plain (no TeX), set once at mount
   * from the page language — labels do not re-render. Scenes pass a
   * sub-wrap cssText that makes the wrap a flex column (see mainWrapCss).
   * Extracted from the labelled-panel scenes. Omitted = the chart hosts
   * directly in the sub-wrap, exactly as before.
   */
  mainLabel?: (lang: Lang) => string;
  /** Optional static label above the second chart in dual mode. See mainLabel. */
  secondLabel?: (lang: Lang) => string;
  /**
   * cssText of the main chart's label div in dual mode. Defaults to the
   * labelled-panel scenes' label style
   * ('flex: none; font-size: 12px; color: var(--muted); padding: 4px 8px 0;').
   */
  mainLabelCss?: string;
  /** cssText of the second chart's label div in dual mode. Defaults to the mainLabelCss default. */
  secondLabelCss?: string;
}

/** Default cssText for a dual-mode chart sub-wrap: an equal share of the chart wrap. */
const DUAL_WRAP_CSS = 'flex: 1 1 auto; min-height: 0; position: relative;';

/** Default cssText for a dual-mode panel label div (the labelled-panel scenes' style). */
const DUAL_LABEL_CSS = 'flex: none; font-size: 12px; color: var(--muted); padding: 4px 8px 0;';

export function defineSimpleScene<D>(config: SimpleSceneConfig<D>) {
  const { model, margin, fallbackHeight = 360 } = config;
  const slotConfigs: ReadonlyArray<SimpleSlot<D>> = config.slots ?? [];
  const aboveConfigs: ReadonlyArray<SimpleSlot<D>> = config.slotsAbove ?? [];
  const dual = config.drawSecond !== undefined;
  const useShell = slotConfigs.length > 0 || aboveConfigs.length > 0 || dual;
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
    let sizeWrapMain: HTMLElement | undefined;
    let sizeWrapSecond: HTMLElement | undefined;
    let richSlots: RichSlot[] = [];
    let richSlotsAbove: RichSlot[] = [];
    let lang: Lang = 'ko';
    let last: { data: D; state: ControlState } | undefined;

    const applySlot = (
      slotConfig: SimpleSlot<D>,
      richSlot: RichSlot,
      data: D,
    ): void => {
      if (slotConfig.visible) {
        richSlot.el.style.display = slotConfig.visible(data) ? '' : 'none';
      }
      setRichText(richSlot, slotConfig.text(data, lang));
    };

    const draw = (): void => {
      if (!last || !chart) return;
      config.drawMain(chart, last.data, lang);
      if (dual && chartSecond) config.drawSecond?.(chartSecond, last.data, lang);
      for (let i = 0; i < aboveConfigs.length && i < richSlotsAbove.length; i++) {
        applySlot(aboveConfigs[i] as SimpleSlot<D>, richSlotsAbove[i] as RichSlot, last.data);
      }
      for (let i = 0; i < slotConfigs.length && i < richSlots.length; i++) {
        applySlot(slotConfigs[i] as SimpleSlot<D>, richSlots[i] as RichSlot, last.data);
      }
    };

    /**
     * The element a dual-mode chart is created in and measured from:
     * the sub-wrap itself, or — when a panel label is set — an inner
     * chart div below a label div inside the sub-wrap.
     */
    const buildChartHost = (
      panel: HTMLElement,
      label: ((lang: Lang) => string) | undefined,
      labelCss: string | undefined,
    ): HTMLElement => {
      if (!label) return panel;
      const labelDiv = document.createElement('div');
      labelDiv.style.cssText = labelCss ?? DUAL_LABEL_CSS;
      labelDiv.textContent = label(lang);
      const chartDiv = document.createElement('div');
      chartDiv.style.cssText = DUAL_WRAP_CSS;
      panel.append(labelDiv, chartDiv);
      return chartDiv;
    };

    /** Main-chart size for one resize: container-based, with sizeFromData overrides. */
    const mainSize = (
      wrapEl: HTMLElement,
      fallbackW: number,
    ): { w: number; h: number } => {
      let w = wrapEl.clientWidth || fallbackW;
      let h = wrapEl.clientHeight || fallbackHeight;
      if (config.sizeFromData && last) {
        const override = config.sizeFromData(last.data, {
          width: wrapEl.clientWidth,
          height: wrapEl.clientHeight,
        });
        if (override.width !== undefined) w = override.width;
        if (override.height !== undefined) h = override.height;
      }
      return { w, h };
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
          sizeWrapMain = buildChartHost(wrapMain, config.mainLabel, config.mainLabelCss);
          sizeWrapSecond = buildChartHost(wrapSecond, config.secondLabel, config.secondLabelCss);
          chart = createChart(sizeWrapMain, margin);
          chartSecond = createChart(sizeWrapSecond, config.marginSecond ?? margin);
        } else {
          chart = createChart(wrap, margin);
        }
        const buildDivs = (
          configs: ReadonlyArray<SimpleSlot<D>>,
          target: RichSlot[],
        ): HTMLElement[] => {
          const divs: HTMLElement[] = [];
          for (const slot of configs) {
            const div = document.createElement('div');
            if (slot.cssText !== undefined) {
              div.style.cssText = slot.cssText;
            } else {
              if (slot.bold === true) div.style.fontWeight = '600';
              if (slot.spaced === true) div.style.marginTop = '4px';
            }
            divs.push(div);
            target.push(createRichSlot(div));
          }
          return divs;
        };
        if (aboveConfigs.length > 0) {
          for (const div of buildDivs(aboveConfigs, richSlotsAbove)) {
            host.insertBefore(div, shell.chartWrap);
          }
        }
        shell.strips.append(...buildDivs(slotConfigs, richSlots));
        config.mountExtra?.(shell.strips, lang);
      },
      render(data, state) {
        last = { data, state };
        draw();
      },
      resize() {
        if (dual) {
          if (chart && sizeWrapMain) {
            const { w, h } = mainSize(sizeWrapMain, fallbackWidth);
            chart.setSize(w, h);
          }
          if (chartSecond && sizeWrapSecond) {
            chartSecond.setSize(
              sizeWrapSecond.clientWidth || fallbackWidthSecond,
              sizeWrapSecond.clientHeight || fallbackHeightSecond,
            );
          }
        } else if (chart && wrap) {
          const { w, h } = mainSize(wrap, 640);
          chart.setSize(w, h);
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
        sizeWrapMain = undefined;
        sizeWrapSecond = undefined;
        richSlots = [];
        richSlotsAbove = [];
        wrap = undefined;
        shell?.dispose();
        shell = undefined;
        last = undefined;
      },
    };
  }

  return defineScene<D>({ model, createScene: createSimpleScene });
}
