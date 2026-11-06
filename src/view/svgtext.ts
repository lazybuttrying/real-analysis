import type { Selection } from 'd3';
import { stripInlineMath } from '../contracts';
import { fitLabelElement } from './fittext';

/**
 * Rich text for SVG <text> labels (chart titles, axis labels, legends,
 * annotations). SVG text cannot host KaTeX, so a label whose source
 * contains \(...\) spans starts as delimiter-stripped plain text — the
 * label is visible immediately and never disappears — and is upgraded
 * in place to a <foreignObject> carrying the KaTeX rendering once the
 * rich-text module (and KaTeX with it) has loaded. Labels without math
 * keep the exact plain-<text> rendering they always had.
 *
 * Scenes use it exactly where they used .text(...):
 *
 *   g.append('text').attr('x', 0).attr('y', -20).call(svgText, title);
 *   join.call(svgText, (d) => d.label);
 *
 * The KaTeX payload stays dynamic (import of ./richtext), mirroring
 * view/richslot: this module itself is KaTeX-free, so importing it from
 * a scene costs no first-load weight. Under load shedding the charts
 * are shed wholesale (tier 2) or keep rendering with plain labels until
 * the upgrade lands; either way the stripped fallback text is what
 * shows, so the text-survival invariant holds.
 */

// d3 selections in scene code carry every datum/parent combination; the
// helper only ever touches the selected <text> elements themselves.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TextSelection = Selection<SVGTextElement, any, any, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SvgTextValue = string | ((datum: any, index: number) => string);

const SVG_NS = 'http://www.w3.org/2000/svg';
const XHTML_NS = 'http://www.w3.org/1999/xhtml';

/** True when the label source carries at least one \(...\) math span. */
export function svgLabelNeedsMath(text: string): boolean {
  return text.includes('\\(');
}

/** The never-missing fallback form of a label: delimiters removed, TeX source kept. */
export function svgLabelPlain(text: string): string {
  return stripInlineMath(text);
}

/**
 * Where the foreignObject goes for a measured label: same baseline as
 * the <text> it replaces. The inner div's first-line baseline sits
 * about 0.95em below its top (line-height 1.3 strut plus ascent), so
 * the box top is y - 0.95 * fontSize; the anchor shifts x by the
 * measured width exactly as text-anchor would.
 */
export const SVG_LABEL_BASELINE_RISE = 0.95;

export interface SvgLabelBox {
  x: number;
  y: number;
}

export function svgLabelBox(
  anchor: string | null | undefined,
  x: number,
  y: number,
  fontSize: number,
  width: number,
): SvgLabelBox {
  const shifted = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  return { x: shifted, y: y - SVG_LABEL_BASELINE_RISE * fontSize };
}

const tokenByNode = new WeakMap<SVGTextElement, number>();
let richTextModule: Promise<typeof import('./richtext')> | null = null;

function loadRichText(): Promise<typeof import('./richtext')> {
  richTextModule ??= import('./richtext');
  return richTextModule;
}

let measurer: HTMLDivElement | null = null;

/** Hidden in-flow host used to measure a rendered label before it enters the SVG. */
function measureHost(): HTMLDivElement {
  if (!measurer) {
    measurer = document.createElement('div');
    measurer.style.cssText =
      'position: absolute; left: -9999px; top: 0; visibility: hidden; white-space: nowrap;';
    document.body.append(measurer);
  }
  return measurer;
}

function replaceWithRichLabel(
  el: SVGTextElement,
  source: string,
  renderRichText: (target: HTMLElement, text: string) => void,
): void {
  const parent = el.parentNode;
  if (!parent) return;
  const computed = getComputedStyle(el);
  const fontSize = Number.parseFloat(computed.fontSize) || 13;
  const x = Number.parseFloat(el.getAttribute('x') ?? '0') || 0;
  const y = Number.parseFloat(el.getAttribute('y') ?? '0') || 0;
  const anchor = el.getAttribute('text-anchor') ?? computed.textAnchor ?? 'start';

  const div = document.createElementNS(XHTML_NS, 'div') as HTMLDivElement;
  const className = el.getAttribute('class');
  if (className) div.setAttribute('class', className);
  div.style.cssText = 'display: inline-block; white-space: nowrap; line-height: 1.3; margin: 0; padding: 0;';
  div.style.fontSize = `${fontSize}px`;
  div.style.fontFamily = computed.fontFamily;
  const weight = el.style.fontWeight || el.getAttribute('font-weight') || computed.fontWeight;
  if (weight) div.style.fontWeight = weight;
  // Prefer the scene's specified fill (an inline style or attribute,
  // often a CSS variable or currentColor) so theming keeps working;
  // the computed color is only the fallback for class-styled labels.
  const fill = el.style.fill || el.getAttribute('fill') || computed.fill;
  if (fill) div.style.color = fill;
  renderRichText(div, source);

  const host = measureHost();
  host.append(div);
  const width = div.offsetWidth;
  const height = div.offsetHeight;
  div.remove();
  if (width === 0 || height === 0) return;

  const box = svgLabelBox(anchor, x, y, fontSize, width);
  const fo = document.createElementNS(SVG_NS, 'foreignObject');
  fo.setAttribute('x', String(box.x));
  fo.setAttribute('y', String(box.y));
  fo.setAttribute('width', String(width));
  fo.setAttribute('height', String(height));
  fo.style.overflow = 'visible';
  const transform = el.getAttribute('transform');
  if (transform) fo.setAttribute('transform', transform);
  // The fit pass (view/fittext) re-anchors this label after shrinking
  // it, so it needs the anchor the scene asked for and its x.
  fo.dataset['svgLabelAnchor'] = anchor;
  fo.dataset['svgLabelAnchorX'] = String(x);
  fo.append(div);
  parent.insertBefore(fo, el);
  el.remove();
  // The upgrade lands after the host's post-render fit pass, so fit
  // this label now, in case the KaTeX rendering overflows its svg.
  fitLabelElement(fo);
}

/**
 * Sets an SVG label's text, upgrading it to KaTeX in place when the
 * source contains math. Use via .call(svgText, value) anywhere a scene
 * previously ended a chain with .text(value).
 */
export function svgText(selection: TextSelection, value: SvgTextValue): void {
  selection.each(function (datum: unknown, index: number) {
    const el = this as SVGTextElement;
    const source = typeof value === 'function' ? value(datum, index) : value;
    const token = (tokenByNode.get(el) ?? 0) + 1;
    tokenByNode.set(el, token);
    el.textContent = svgLabelPlain(source);
    if (!svgLabelNeedsMath(source)) return;
    loadRichText()
      .then((module) => {
        // A redraw may have replaced the text (new token) or removed
        // the node outright; in both cases the upgrade is stale.
        if (tokenByNode.get(el) !== token || !el.isConnected) return;
        replaceWithRichLabel(el, source, module.renderRichText);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  });
}
