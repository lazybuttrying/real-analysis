import katex from 'katex';
import 'katex/dist/katex.min.css';

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
