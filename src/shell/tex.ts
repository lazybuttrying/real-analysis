import katex from 'katex';
import 'katex/dist/katex.min.css';

/** 이 모듈은 수식이 있는 씬에서만 동적 import 된다. (katex와 폰트 CSS가 첫 로드에 들어가지 않게) */
export function renderTex(target: HTMLElement, formulas: readonly string[]): void {
  target.replaceChildren();
  for (const formula of formulas) {
    const block = document.createElement('div');
    block.className = 'tex-block';
    katex.render(formula, block, { displayMode: true, throwOnError: false });
    target.append(block);
  }
}
