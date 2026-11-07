/**
 * Post-draw fitting for svg text that overflows its chart horizontally.
 *
 * Scenes draw their titles and annotations at a fixed font size, sized
 * for the desktop chart width. At a phone width the same title can run
 * hundreds of px past the svg box, where it is clipped by the page —
 * the biggest single class in the overflow audit (42 of 61 scenes at
 * 390px). Fixing each scene's title separately does not scale, and the
 * labels do not all pass through one helper: most are plain .text(...)
 * calls, the math ones are svgText labels that become <foreignObject>.
 * So the engine fits them after the draw, in one place, whatever made
 * them:
 *
 *   1. shrink the font, down to MIN_FONT_PX;
 *   2. if it still overflows and the label has spaces, wrap it onto
 *      two or, when two are not enough, three lines (a <text> gains
 *      <tspan> lines; a <foreignObject> label's div wraps in place
 *      and the box grows downward).
 *
 * Axis tick labels (inside .tick groups) are never touched: shrinking
 * or wrapping axis numbers would corrupt the axis layout, and their
 * overflow is a scale problem, not a label problem.
 *
 * The pass is idempotent per element instance and a no-op wherever
 * layout is unavailable (jsdom tests measure 0 and skip). Scenes
 * recreate their elements on every redraw, so the host re-runs the
 * pass after every render; svgText runs it on a label it upgrades to
 * KaTeX after the draw. Nothing here changes a label that already
 * fits — the tolerance matches the audit's spirit (it flags >10px;
 * the pass starts acting at >4px so borderline labels settle inside).
 */

const MIN_FONT_PX = 10;
const TOLERANCE_PX = 4;
const SVG_NS = 'http://www.w3.org/2000/svg';

interface HBox {
  left: number;
  right: number;
  top: number;
  width: number;
}

function hOverflow(el: Element, svgBox: HBox): number {
  const b = el.getBoundingClientRect();
  if (!b.width) return 0;
  return Math.max(svgBox.left - b.left, b.right - svgBox.right);
}

/** SVG user units per CSS pixel for this svg (viewBox vs rendered size). */
function unitsPerPixel(svg: SVGSVGElement): number {
  const vb = svg.viewBox?.baseVal;
  const w = svg.getBoundingClientRect().width;
  if (vb && vb.width > 0 && w > 0) return vb.width / w;
  return 1;
}

function fontSizeOf(el: Element): number {
  return Number.parseFloat(getComputedStyle(el).fontSize) || 13;
}

function shrinkText(el: SVGTextElement, svgBox: HBox): void {
  let fs = fontSizeOf(el);
  while (hOverflow(el, svgBox) > TOLERANCE_PX && fs > MIN_FONT_PX) {
    fs -= 1;
    el.style.fontSize = `${fs}px`;
  }
}

/**
 * Wrap a plain <text> label onto two or three lines at the word
 * boundaries that best balance the lines, keeping the label's anchor
 * x. The line stack stays centered on the original baseline; if that
 * clips the svg top, the whole label shifts down by the clipped
 * amount (into the top margin, never above the box).
 */
function wrapText(el: SVGTextElement, svg: SVGSVGElement, svgBox: HBox): void {
  if (el.hasAttribute('transform')) return;
  // A label fitted before the webfont arrived can overflow again
  // once the real font swaps in: the host re-runs the fit pass on
  // document.fonts.ready, and an already-wrapped label re-splits
  // from its full text (bounded, so a pathological label settles).
  const wraps = Number.parseInt(el.dataset['fitWraps'] ?? '0', 10) || 0;
  if (wraps >= 3) return;
  const words = (el.textContent ?? '').trim().split(/\s+/);
  if (words.length < 2) return;
  const x = el.getAttribute('x') ?? '0';
  const fs = fontSizeOf(el);
  const lineHeight = fs * 1.25;
  const availPx = svgBox.width - 8;

  const build = (splits: number[]): SVGTSpanElement[] => {
    el.replaceChildren();
    const lines: SVGTSpanElement[] = [];
    let from = 0;
    splits.concat(words.length).forEach((to, i) => {
      const t = document.createElementNS(SVG_NS, 'tspan');
      t.setAttribute('x', x);
      // The line stack stays centered on the original baseline: the
      // first line rises by half the stack, the rest step down evenly.
      t.setAttribute('dy', i === 0 ? `${(-lineHeight * splits.length) / 2}` : `${lineHeight}`);
      t.textContent = words.slice(from, to).join(' ');
      from = to;
      el.append(t);
      lines.push(t);
    });
    return lines;
  };

  // Try two lines first; a long title in a narrow mini preview can
  // still overflow at the minimum font, so fall back to three lines
  // before giving up. The split search rebuilds per candidate, which
  // is quadratic for three lines — acceptable here because it runs
  // only for labels that already failed to fit at the minimum font.
  let best: { splits: number[]; worst: number } | undefined;
  for (const lineCount of [2, 3]) {
    if (words.length < lineCount) break;
    const candidates: number[][] = [];
    if (lineCount === 2) {
      for (let s = 1; s < words.length; s++) candidates.push([s]);
    } else {
      for (let s1 = 1; s1 < words.length - 1; s1++) {
        for (let s2 = s1 + 1; s2 < words.length; s2++) candidates.push([s1, s2]);
      }
    }
    for (const splits of candidates) {
      const lines = build(splits);
      const worst = Math.max(...lines.map((t) => t.getComputedTextLength()));
      if (!best || worst < best.worst) best = { splits, worst };
      if (worst <= availPx) break;
    }
    if (best && best.worst <= availPx) break;
  }
  if (!best) return;
  build(best.splits);
  el.dataset['fitWraps'] = String(wraps + 1);

  const b = el.getBoundingClientRect();
  if (b.top < svgBox.top + 1) {
    const y = Number.parseFloat(el.getAttribute('y') ?? '0') || 0;
    const shift = (svgBox.top + 1 - b.top) * unitsPerPixel(svg);
    el.setAttribute('y', String(y + shift));
  }
}

function fitTextElement(el: SVGTextElement, svg: SVGSVGElement, svgBox: HBox): void {
  shrinkText(el, svgBox);
  if (hOverflow(el, svgBox) > TOLERANCE_PX) wrapText(el, svg, svgBox);
}

/**
 * Re-anchor a shrunk <foreignObject> label: svgText stamps the label's
 * original anchor and anchor x on the element, so after a width change
 * the box can be put back where text-anchor would have put it.
 */
function reanchor(fo: SVGForeignObjectElement, width: number): void {
  const anchor = fo.dataset['svgLabelAnchor'];
  const anchorX = Number.parseFloat(fo.dataset['svgLabelAnchorX'] ?? '');
  if (!anchor || !Number.isFinite(anchorX)) return;
  const shifted = anchor === 'middle' ? anchorX - width / 2 : anchor === 'end' ? anchorX - width : anchorX;
  fo.setAttribute('x', String(shifted));
}

function fitForeignObject(fo: SVGForeignObjectElement, svg: SVGSVGElement, svgBox: HBox): void {
  const div = fo.firstElementChild as HTMLElement | null;
  if (!div) return;
  let fs = fontSizeOf(div);
  while (hOverflow(fo, svgBox) > TOLERANCE_PX && fs > MIN_FONT_PX) {
    fs -= 1;
    div.style.fontSize = `${fs}px`;
    const w = div.offsetWidth;
    fo.setAttribute('width', String(w));
    reanchor(fo, w);
  }
  if (hOverflow(fo, svgBox) <= TOLERANCE_PX) return;
  // Wrap in place: cap the div at the space left inside the svg and
  // let the box grow downward (a top-margin title grows toward the
  // plot edge, which reads better than clipped text).
  const upp = unitsPerPixel(svg);
  const foBox = fo.getBoundingClientRect();
  const avail = Math.max(40, (svgBox.right - foBox.left - 4) * upp);
  div.style.whiteSpace = 'normal';
  div.style.width = `${avail}px`;
  fo.setAttribute('width', String(avail));
  fo.setAttribute('height', String(div.offsetHeight));
  reanchor(fo, avail);
}

/** Fit one label element (a <text> or <foreignObject>) inside its svg. */
export function fitLabelElement(el: Element): void {
  const svg = el.closest('svg') as SVGSVGElement | null;
  if (!svg) return;
  const box = svg.getBoundingClientRect();
  if (!box.width) return;
  const svgBox: HBox = { left: box.left, right: box.right, top: box.top, width: box.width };
  if (hOverflow(el, svgBox) <= TOLERANCE_PX) return;
  if (el instanceof SVGTextElement) fitTextElement(el, svg, svgBox);
  else if (el instanceof SVGForeignObjectElement) fitForeignObject(el, svg, svgBox);
}

function fitSvg(svg: SVGSVGElement): void {
  const box = svg.getBoundingClientRect();
  if (!box.width) return;
  const svgBox: HBox = { left: box.left, right: box.right, top: box.top, width: box.width };
  svg.querySelectorAll('text, foreignObject').forEach((el) => {
    if (el.closest('defs') || el.closest('.tick')) return;
    if (el instanceof SVGTextElement && el.closest('foreignObject')) return;
    if (hOverflow(el, svgBox) <= TOLERANCE_PX) return;
    if (el instanceof SVGTextElement) fitTextElement(el, svg, svgBox);
    else if (el instanceof SVGForeignObjectElement) fitForeignObject(el, svg, svgBox);
  });
}

/**
 * Run the fitting pass over every chart svg under root (or root itself
 * when it is an svg). Called by the scene host after each render.
 */
export function fitSvgText(root: HTMLElement | SVGSVGElement): void {
  if (root instanceof SVGSVGElement) {
    fitSvg(root);
    return;
  }
  root.querySelectorAll('svg[role="img"]').forEach((svg) => fitSvg(svg as SVGSVGElement));
}
