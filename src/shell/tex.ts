import katex from 'katex';
import 'katex/dist/katex.min.css';
import { splitInlineMath } from '../contracts';

/** This module is dynamically imported only by scenes with formulas. (So katex and the font CSS stay out of the first load) */
export function renderTex(target: HTMLElement, formulas: readonly string[]): void {
  target.replaceChildren();
  for (const formula of formulas) {
    const block = document.createElement('div');
    block.className = 'tex-block';
    katex.render(formula, block, { displayMode: true, throwOnError: false });
    target.append(block);
  }
}

/**
 * Renders a summary string into the target: plain segments become text nodes,
 * and each \(...\) span becomes an inline KaTeX rendering.
 */
export function renderRichText(target: HTMLElement, text: string): void {
  target.replaceChildren();
  for (const segment of splitInlineMath(text)) {
    if (segment.kind === 'math') {
      const span = document.createElement('span');
      katex.render(segment.tex, span, { displayMode: false, throwOnError: false });
      target.append(span);
    } else {
      target.append(document.createTextNode(segment.text));
    }
  }
}
