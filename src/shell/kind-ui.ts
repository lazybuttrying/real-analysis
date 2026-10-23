import {
  localize,
  stripInlineMath,
  type Lang,
  type LocalizedText,
  type ProblemKind,
  type ProblemKindFields,
  type ProofStep,
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
  /** Display formulas the upgrade appends inside the element (statement and step tails). */
  display?: readonly string[];
}

export type KindRichSink = (target: KindRichTarget) => void;

/** The effective template of a problem/exercise: absent kind is 'proof'. */
export function problemKind(meta: ProblemKindFields): ProblemKind {
  return meta.kind ?? 'proof';
}

/** Splits a prose field into paragraphs on blank lines (single newlines stay). */
export function paragraphs(text: string): string[] {
  const parts = text
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length > 0 ? parts : [text];
}

/** One <p> per paragraph, each registered for the KaTeX upgrade. */
function richParaEls(paras: readonly string[], rich: KindRichSink): HTMLElement[] {
  return paras.map((para) => {
    const el = h('p', {}, stripInlineMath(para));
    rich({ el, text: para });
    return el;
  });
}

/** One <p> per paragraph of a localized prose field, each registered for the KaTeX upgrade. */
function richParas(text: LocalizedText, lang: Lang, rich: KindRichSink): HTMLElement[] {
  return richParaEls(paragraphs(localize(text, lang)), rich);
}

/** The type chip shown on non-proof cards; null for the default 'proof' kind. */
export function kindBadgeEl(kind: ProblemKind, lang: Lang): HTMLElement | null {
  if (kind === 'proof') return null;
  const key = kind === 'compute' ? 'kindCompute' : kind === 'counterexample' ? 'kindCounterexample' : 'kindConcept';
  return h('span', { class: `kind-badge kind-${kind}` }, tr(lang, key));
}

/** The labeled prose box shared by the verdict and answer blocks. */
function boxEl(variant: 'verdict' | 'answer', paras: readonly string[], lang: Lang, rich: KindRichSink): HTMLElement {
  const box = h('div', { class: `problem-${variant}` });
  box.append(h('span', { class: `problem-${variant}-label` }, tr(lang, variant === 'verdict' ? 'verdictLabel' : 'answerLabel')));
  box.append(...richParaEls(paras, rich));
  return box;
}

/** counterexample: the prominent verdict box under the statement. */
export function verdictEl(verdict: LocalizedText, lang: Lang, rich: KindRichSink): HTMLElement {
  return boxEl('verdict', paragraphs(localize(verdict, lang)), lang, rich);
}

/** compute: the highlighted final-answer box after the folded solution. */
export function answerEl(answer: LocalizedText, lang: Lang, rich: KindRichSink): HTMLElement {
  return boxEl('answer', paragraphs(localize(answer, lang)), lang, rich);
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

/**
 * The shared problem-card assembly. Both the runtime renderers (app.ts,
 * exercises-page.ts) and the static prerender (scripts/prerender-factory.ts)
 * build a problem/exercise card through problemCardBlocks; only the fragment
 * backend differs (DOM elements vs HTML strings). The assembly owns the block
 * order and the kind conditionals: badge, statement, verdict (counterexample),
 * the caller's middle blocks (visualization figure, exercise topics), then
 * either the concept check (replacing the folded proof/solution — the proof
 * stays in the data as the rigorous backing) or the folded proof/solution
 * with the answer box (compute) after it.
 */

/** A proof/solution step with its text already split into paragraphs. */
export interface ProblemStepPlan {
  paras: readonly string[];
  display?: readonly string[];
}

/** The backend-specific block builders the shared assembly composes. */
export interface KindFragments<Node> {
  /** The type chip for non-proof kinds; no blocks for 'proof'. */
  badge(kind: ProblemKind, lang: Lang): Node[];
  /** Statement paragraphs; display formulas travel with the block (the backend decides how they attach). */
  statement(paras: readonly string[], display: readonly string[] | undefined, cls: string): Node[];
  /** The verdict (counterexample) or answer (compute) box over pre-split paragraphs. */
  box(variant: 'verdict' | 'answer', paras: readonly string[], lang: Lang): Node[];
  /** The concept check: interactive on the client, a static list plus details in the prerender. */
  concept(meta: ProblemKindFields, lang: Lang): Node[];
  /** The folded proof/solution: summary label, optional construction heading, and the step list. */
  proofDetails(summaryLabel: string, construction: boolean, steps: readonly ProblemStepPlan[], lang: Lang): Node[];
}

export interface ProblemCardOptions<Node> {
  /**
   * Whether the assembly emits the kind badge block. Exercises pages pass
   * false: their badge lives inside the caller's badges row instead.
   */
  includeBadge?: boolean;
  /** Class of the statement paragraphs ('problem-statement' on scene pages, 'exercise-statement' on exercises pages). */
  statementClass: string;
  /** Already-localized summary label of the folded proof/solution. */
  summaryLabel: string;
  /** Caller-built blocks between the verdict and the kind blocks (visualization figure, exercise topics). */
  middle: readonly Node[];
  fragments: KindFragments<Node>;
}

/** Builds the ordered blocks of one problem/exercise card from its kind template. */
export function problemCardBlocks<Node>(
  meta: ProblemKindFields & { statement: LocalizedText; display?: readonly string[] },
  steps: readonly ProofStep[],
  lang: Lang,
  options: ProblemCardOptions<Node>,
): Node[] {
  const kind = problemKind(meta);
  const fragments = options.fragments;
  const blocks: Node[] = [];
  if (options.includeBadge !== false) blocks.push(...fragments.badge(kind, lang));
  blocks.push(...fragments.statement(paragraphs(localize(meta.statement, lang)), meta.display, options.statementClass));
  if (kind === 'counterexample' && meta.verdict) {
    blocks.push(...fragments.box('verdict', paragraphs(localize(meta.verdict, lang)), lang));
  }
  blocks.push(...options.middle);
  if (kind === 'concept') {
    blocks.push(...fragments.concept(meta, lang));
  } else {
    const stepPlans = steps.map((step) => ({ paras: paragraphs(localize(step.text, lang)), display: step.display }));
    blocks.push(...fragments.proofDetails(options.summaryLabel, kind === 'counterexample', stepPlans, lang));
    if (kind === 'compute' && meta.answer) {
      blocks.push(...fragments.box('answer', paragraphs(localize(meta.answer, lang)), lang));
    }
  }
  return blocks;
}

/** DOM fragments for problemCardBlocks, registering rich text with the caller's sink. */
export function domKindFragments(rich: KindRichSink): KindFragments<HTMLElement> {
  return {
    badge: (kind, lang) => {
      const el = kindBadgeEl(kind, lang);
      return el ? [el] : [];
    },
    statement: (paras, display, cls) =>
      paras.map((para, i) => {
        const el = h('p', { class: cls }, stripInlineMath(para));
        rich({ el, text: para, display: i === paras.length - 1 ? display : undefined });
        return el;
      }),
    box: (variant, paras, lang) => [boxEl(variant, paras, lang, rich)],
    concept: (meta, lang) => [conceptEl(meta, lang, rich)],
    proofDetails: (summaryLabel, construction, steps, lang) => {
      const details = h('details', { class: 'problem-proof' });
      details.append(h('summary', {}, summaryLabel));
      if (construction) {
        details.classList.add('counterexample-construction');
        details.append(constructionLabelEl(lang));
      }
      const list = h('ol', {});
      for (const step of steps) {
        const item = h('li', {});
        step.paras.forEach((para, i) => {
          const el = h('p', {}, stripInlineMath(para));
          item.append(el);
          rich({ el, text: para, display: i === step.paras.length - 1 ? step.display : undefined });
        });
        list.append(item);
      }
      details.append(list);
      return [details];
    },
  };
}

/** Hooks the static (prerender) backend uses to render prose and formulas. */
export interface KindHtmlHooks {
  /** Renders one paragraph of prose to HTML (inline math rendered). */
  renderRich: (text: string) => string;
  /** Renders one display formula to HTML. */
  renderDisplay: (formula: string) => string;
  /** Escapes a plain-text label for HTML. */
  escapeText: (text: string) => string;
}

/** HTML-string fragments for problemCardBlocks, used by the prerender. */
export function htmlKindFragments(hooks: KindHtmlHooks): KindFragments<string> {
  const parasHtml = (paras: readonly string[]): string => paras.map((p) => `<p>${hooks.renderRich(p)}</p>`).join('\n');
  return {
    badge: (kind, lang) => {
      if (kind === 'proof') return [];
      const key = kind === 'compute' ? 'kindCompute' : kind === 'counterexample' ? 'kindCounterexample' : 'kindConcept';
      return [`<span class="kind-badge kind-${kind}">${hooks.escapeText(tr(lang, key))}</span>`];
    },
    statement: (paras, display, cls) => [
      paras.map((p) => `<p class="${cls}">${hooks.renderRich(p)}</p>`).join('\n'),
      (display ?? []).map(hooks.renderDisplay).join('\n'),
    ],
    box: (variant, paras, lang) =>
      variant === 'verdict'
        ? [
            `<div class="problem-verdict"><span class="problem-verdict-label">${hooks.escapeText(tr(lang, 'verdictLabel'))}</span>\n${parasHtml(paras)}</div>`,
          ]
        : [
            `<div class="problem-answer"><span class="problem-answer-label">${hooks.escapeText(tr(lang, 'answerLabel'))}</span>\n${parasHtml(paras)}</div>`,
          ],
    concept: (meta, lang) => {
      const items = (meta.choices ?? []).map((choice) => `<li>${hooks.renderRich(localize(choice, lang))}</li>`).join('\n');
      const correct = meta.correctIndex !== undefined ? meta.choices?.[meta.correctIndex] : undefined;
      const answerLine = correct
        ? `<p class="concept-answer">${hooks.escapeText(tr(lang, 'answerLabel'))}: ${hooks.renderRich(localize(correct, lang))}</p>`
        : '';
      const explanation = meta.explanation ? parasHtml(paragraphs(localize(meta.explanation, lang))) : '';
      return [
        `<div class="concept-check"><ol class="concept-choices-static">\n${items}\n</ol>\n<details class="concept-explanation"><summary>${hooks.escapeText(tr(lang, 'showExplanation'))}</summary>\n${answerLine}\n${explanation}</details></div>`,
      ];
    },
    proofDetails: (summaryLabel, construction, steps, lang) => {
      const stepItems = steps
        .map(
          (step) =>
            `<li>${step.paras.map((p) => `<p>${hooks.renderRich(p)}</p>`).join('')}${(step.display ?? []).map(hooks.renderDisplay).join('\n')}</li>`,
        )
        .join('\n');
      const lines = [
        `<details class="problem-proof${construction ? ' counterexample-construction' : ''}"><summary>${hooks.escapeText(summaryLabel)}</summary>`,
      ];
      if (construction) {
        lines.push(`<p class="construction-label">${hooks.escapeText(tr(lang, 'constructionLabel'))}</p>`);
      }
      lines.push(`<ol>${stepItems}</ol>`, '</details>');
      return lines;
    },
  };
}
