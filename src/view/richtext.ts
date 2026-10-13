import katex from 'katex';
import 'katex/dist/katex.min.css';
import { splitInlineMath } from '../contracts';

/**
 * Chapter-safe rich-text helper: renders a summary string into the target,
 * turning each \(...\) span into inline KaTeX. Scenes import this module
 * (dynamically, so KaTeX stays out of the first load) instead of reaching
 * into the shell — see scripts/check-deps.ts rule 4.
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
