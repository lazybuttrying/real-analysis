import {
  localize,
  stripInlineMath,
  type Lang,
  type LocalizedText,
  type ProblemKind,
  type ProblemKindFields,
} from '../contracts';
import { h } from './dom';
import { tr } from './i18n';

/**
 * DOM builders for the problem-kind templates (see docs/problem-types.md),
 * shared by the scene-problem renderer (app.ts) and the chapter-exercises
 * renderer (exercises-page.ts). Text is delimiter-stripped immediately and
 * registered with the caller's rich-text sink for the KaTeX upgrade, exactly
 * like the statements and proof steps around it. All interaction state is
 * ephemeral DOM state — nothing is persisted (the site keeps no progress).
 */

/** A rich-text upgrade target, structurally the renderers' local RichTarget. */
export interface KindRichTarget {
  el: HTMLElement;
  text: string;
}

export type KindRichSink = (target: KindRichTarget) => void;

/** The effective template of a problem/exercise: absent kind is 'proof'. */
export function problemKind(meta: ProblemKindFields): ProblemKind {
  return meta.kind ?? 'proof';
}

/** Splits a prose field into paragraphs on blank lines (single newlines stay). */
function paragraphs(text: string): string[] {
  const parts = text
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length > 0 ? parts : [text];
}

/** One <p> per paragraph of a localized prose field, each registered for the KaTeX upgrade. */
function richParas(text: LocalizedText, lang: Lang, rich: KindRichSink): HTMLElement[] {
  return paragraphs(localize(text, lang)).map((para) => {
    const el = h('p', {}, stripInlineMath(para));
    rich({ el, text: para });
    return el;
  });
}

/** The type chip shown on non-proof cards; null for the default 'proof' kind. */
export function kindBadgeEl(kind: ProblemKind, lang: Lang): HTMLElement | null {
  if (kind === 'proof') return null;
  const key = kind === 'compute' ? 'kindCompute' : kind === 'counterexample' ? 'kindCounterexample' : 'kindConcept';
  return h('span', { class: `kind-badge kind-${kind}` }, tr(lang, key));
}

/** counterexample: the prominent verdict box under the statement. */
export function verdictEl(verdict: LocalizedText, lang: Lang, rich: KindRichSink): HTMLElement {
  const box = h('div', { class: 'problem-verdict' });
  box.append(h('span', { class: 'problem-verdict-label' }, tr(lang, 'verdictLabel')));
  box.append(...richParas(verdict, lang, rich));
  return box;
}

/** compute: the highlighted final-answer box after the folded solution. */
export function answerEl(answer: LocalizedText, lang: Lang, rich: KindRichSink): HTMLElement {
  const box = h('div', { class: 'problem-answer' });
  box.append(h('span', { class: 'problem-answer-label' }, tr(lang, 'answerLabel')));
  box.append(...richParas(answer, lang, rich));
  return box;
}

/** counterexample: the small heading that opens the framed construction block. */
export function constructionLabelEl(lang: Lang): HTMLElement {
  return h('p', { class: 'construction-label' }, tr(lang, 'constructionLabel'));
}

/**
 * concept: the interactive check. Options are pill buttons; the first click
 * marks the correct option (and the clicked one, when wrong), disables the
 * group, and reveals the feedback line and the explanation. Without JS this
 * block never appears — the prerendered page carries the static form (a
 * plain list plus the explanation in a <details>) instead.
 */
export function conceptEl(meta: ProblemKindFields, lang: Lang, rich: KindRichSink): HTMLElement {
  const choices = meta.choices ?? [];
  const correctIndex = meta.correctIndex ?? -1;
  const wrap = h('div', { class: 'concept-check' });
  const group = h('div', { class: 'concept-choices', role: 'group', 'aria-label': tr(lang, 'chooseOne') });
  const feedback = h('p', { class: 'concept-feedback', 'aria-live': 'polite', hidden: '' });
  const explanation = h('div', { class: 'concept-explanation', hidden: '' });
  if (meta.explanation) explanation.append(...richParas(meta.explanation, lang, rich));

  let answered = false;
  const buttons: HTMLButtonElement[] = [];
  choices.forEach((choice, index) => {
    const text = localize(choice, lang);
    const button = h('button', { type: 'button', class: 'concept-choice' }, stripInlineMath(text));
    rich({ el: button, text });
    button.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      buttons.forEach((candidate, candidateIndex) => {
        candidate.disabled = true;
        if (candidateIndex === correctIndex) candidate.classList.add('is-correct');
      });
      if (index === correctIndex) {
        feedback.textContent = tr(lang, 'correctFeedback');
        feedback.classList.add('is-correct');
      } else {
        button.classList.add('is-wrong');
        feedback.textContent = tr(lang, 'wrongFeedback');
        feedback.classList.add('is-wrong');
      }
      feedback.removeAttribute('hidden');
      explanation.removeAttribute('hidden');
    });
    buttons.push(button);
    group.append(button);
  });

  wrap.append(group, feedback, explanation);
  return wrap;
}
