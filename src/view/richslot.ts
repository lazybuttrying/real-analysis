import { stripInlineMath } from '../contracts';

/**
 * Lazy rich-text slot: renders a summary string into the target element,
 * turning each \(...\) span into inline KaTeX. KaTeX stays out of the
 * scene's first load — the render module is imported dynamically on first
 * use, and the sequence guard drops a stale render if the text changed
 * while the import was in flight.
 *
 * Extracted from the scene files, where this block was byte-identical in
 * 49 scenes. Scenes import this module statically (like view/d3kit);
 * only the KaTeX payload itself stays dynamic.
 */
export interface RichSlot {
  el: HTMLElement;
  seq: number;
  text: string;
}

export function createRichSlot(el: HTMLElement): RichSlot {
  return { el, seq: 0, text: '' };
}

export function setRichText(slot: RichSlot, text: string): void {
  if (slot.text === text) return;
  slot.text = text;
  const id = ++slot.seq;
  slot.el.textContent = stripInlineMath(text);
  if (text.includes('\\(')) {
    import('./richtext')
      .then((module) => {
        if (slot.seq === id) module.renderRichText(slot.el, text);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }
}
