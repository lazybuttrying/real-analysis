import { exercisesUrl, glossaryUrl, homeUrl, parsePath, sceneUrl, withLang } from '../paths.ts';
import { site } from '../site.config.ts';
import type { Lang } from '../contracts.ts';
import type { SearchIndexData } from '../search-index.ts';
import { rankSemantic } from '../search-vectors.ts';
import { SEARCH_EXAMPLES } from '../search-examples.ts';
import { h } from './dom.ts';
import { langSwitcher, tr } from './i18n.ts';
import { embedQuery, loadSearchVectors, warmSemantic } from './semantic.ts';

const BASE = import.meta.env.BASE_URL;
const MAX_RESULTS = 8;
/** Cosine floor for semantic hits: e5 scores on this corpus cluster high. */
const SEMANTIC_MIN_SCORE = 0.8;
/**
 * Off-topic judgement (measured 2026-10-31, after the alias round): with
 * no keyword hits, a top semantic score under this reads as unrelated to
 * real analysis. Food, weather, stock, and recipe queries top out at
 * 0.81-0.83, and even a nonsense nature question ("why do otters swim")
 * reaches 0.849, while genuine metaphor matches land at 0.85 and above.
 * The 0.84-0.86 band genuinely mixes both kinds, so the line errs toward
 * declaring off-topic: the suggestion chips cost one tap, while junk
 * hits dressed as answers cost trust.
 */
const OFFTOPIC_MAX_SCORE = 0.85;

interface RankedHit {
  kind: 'scene' | 'term' | 'exercise';
  /** Scene title, the glossary term itself, or the localized "Exercise N" label. */
  label: string;
  /** Chapter title for scenes and exercises, scene title for terms. */
  context: string;
  url: string;
  /** Cosine similarity for semantic hits; absent for keyword hits. */
  score?: number;
  /** Owning chapter, used by the ambiguity check. */
  chapterId?: string;
}

/**
 * Ambiguity check for semantic hits: the match is ambiguous when the
 * top few hits are bunched within a narrow score band AND span more
 * than one chapter — the query sits between topics. A bunched cluster
 * inside one chapter (the series convergence tests, say) is coherent,
 * not ambiguous.
 */
export function isAmbiguousSemantic(hits: readonly RankedHit[]): boolean {
  const top = hits.slice(0, 3);
  if (top.length < 2) return false;
  const first = top[0];
  const third = top[top.length - 1];
  if (!first || !third || first.score === undefined || third.score === undefined) return false;
  if (first.score - third.score > 0.03) return false;
  const chapters = new Set(top.map((hit) => hit.chapterId ?? hit.context));
  return chapters.size >= 2;
}

/**
 * Clarification candidates for an ambiguous match: the top semantic
 * hits, preferring one per chapter so the choices actually separate
 * the candidate topics, then filling by score.
 */
export function clarifyOptions(hits: readonly RankedHit[], max = 3): RankedHit[] {
  const picked: RankedHit[] = [];
  const usedChapters = new Set<string>();
  for (const hit of hits) {
    if (picked.length >= max) break;
    const key = hit.chapterId ?? hit.context;
    if (usedChapters.has(key)) continue;
    usedChapters.add(key);
    picked.push(hit);
  }
  for (const hit of hits) {
    if (picked.length >= max) break;
    if (!picked.includes(hit)) picked.push(hit);
  }
  return picked;
}

/**
 * Semantic ranking over the precomputed document vectors: scenes and
 * glossary terms whose embeddings sit closest to the query embedding,
 * best first. The vectors align by position with the search index:
 * scenes first (in index order), then terms.
 */
export function semanticSearchIndex(
  index: SearchIndexData,
  vectors: readonly Float32Array[],
  queryVector: ArrayLike<number>,
  base: string,
  lang: Lang,
): RankedHit[] {
  const ranked = rankSemantic(vectors, queryVector, SEMANTIC_MIN_SCORE, MAX_RESULTS);
  const hits: RankedHit[] = [];
  for (const { index: position, score } of ranked) {
    if (position < index.scenes.length) {
      const scene = index.scenes[position];
      if (!scene) continue;
      hits.push({
        kind: 'scene',
        label: scene.title,
        context: scene.chapterTitle,
        url: sceneUrl(base, lang, scene.chapterId, scene.sceneId),
        score,
        chapterId: scene.chapterId,
      });
    } else {
      const term = index.terms[position - index.scenes.length];
      if (!term) continue;
      hits.push({
        kind: 'term',
        label: term.term,
        context: term.sceneTitle,
        url: `${glossaryUrl(base, lang)}#term-${term.id}`,
        score,
        chapterId: term.chapterId,
      });
    }
  }
  return hits;
}

/**
 * Merges keyword and semantic hits: the first few exact keyword hits
 * stay pinned (a typed name is unambiguous), then semantic hits in
 * similarity order, then the remaining keyword hits. Deduped by URL.
 */
export function mergeSearchHits(keyword: RankedHit[], semantic: RankedHit[], max = MAX_RESULTS): RankedHit[] {
  const seen = new Set<string>();
  const out: RankedHit[] = [];
  const push = (hit: RankedHit): void => {
    if (out.length >= max || seen.has(hit.url)) return;
    seen.add(hit.url);
    out.push(hit);
  };
  keyword.slice(0, 3).forEach(push);
  semantic.forEach(push);
  keyword.slice(3).forEach(push);
  return out;
}

interface ScoredHit {
  hit: RankedHit;
  score: number;
}

/**
 * Substring matching, case-insensitive. A hit in a title/term outranks a hit
 * in a summary/definition. Pure: unit-tested without the DOM.
 */
export function filterSearchIndex(index: SearchIndexData, query: string, base: string, lang: Lang): RankedHit[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  const scored: ScoredHit[] = [];
  /**
   * Scores one candidate: a hit in the primary text (title, term, label)
   * outranks a hit in the secondary text (summary, definition, statement).
   * The hit is built lazily, only when the candidate matches.
   */
  const consider = (primary: string, secondary: string, makeHit: () => RankedHit): void => {
    const inPrimary = primary.toLowerCase().includes(q);
    if (inPrimary || secondary.toLowerCase().includes(q)) {
      scored.push({ hit: makeHit(), score: inPrimary ? 2 : 1 });
    }
  };
  for (const scene of index.scenes) {
    consider(scene.title, scene.summary, () => ({
      kind: 'scene',
      label: scene.title,
      context: scene.chapterTitle,
      url: sceneUrl(base, lang, scene.chapterId, scene.sceneId),
      chapterId: scene.chapterId,
    }));
  }
  for (const term of index.terms) {
    consider(term.term, term.definition, () => ({
      kind: 'term',
      label: term.term,
      context: term.sceneTitle,
      url: `${glossaryUrl(base, lang)}#term-${term.id}`,
      chapterId: term.chapterId,
    }));
  }
  for (const exercise of index.exercises) {
    const label = `${tr(lang, 'searchExerciseKind')} ${exercise.number}`;
    consider(label, exercise.statement, () => ({
      kind: 'exercise',
      label,
      context: exercise.chapterTitle,
      url: `${exercisesUrl(base, lang, exercise.chapterId)}#exercise-${exercise.exerciseId}`,
      chapterId: exercise.chapterId,
    }));
  }
  scored.sort((a, b) => b.score - a.score || a.hit.label.localeCompare(b.hit.label));
  return scored.slice(0, MAX_RESULTS).map((entry) => entry.hit);
}

/**
 * The standard home-style page header — site title, search box, language
 * switcher — shared by the glossary, learning-paths, and exercises pages.
 * The switcher routes through withLang, which preserves the current
 * chapter/scene segments (on the exercises page the 'exercises' scene id
 * maps to the exercises URL), so one header serves all three pages.
 */
export function pageHeader(lang: Lang): HTMLElement {
  const headerSearch = h('span', { class: 'header-search' });
  const header = h(
    'header',
    { class: 'home-header' },
    h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, site.name.en),
    headerSearch,
    langSwitcher(lang, (target) => withLang(BASE, parsePath(BASE, location.pathname), target)),
  );
  mountSearch(headerSearch, lang);
  return header;
}

/**
 * Mounts a header search box. The per-language index JSON (emitted by the
 * prerender step) is fetched lazily on first input, so pages pay nothing
 * until the user actually searches. Keyboard: ArrowUp/Down moves, Enter
 * opens the active (or first) result, Escape closes.
 */
export function mountSearch(host: HTMLElement, lang: Lang): void {
  let index: SearchIndexData | null = null;
  let indexFailed = false;
  let activeIndex = -1;

  const box = h('div', { class: 'site-search' });
  const input = h('input', {
    type: 'search',
    role: 'combobox',
    'aria-expanded': 'false',
    'aria-controls': 'site-search-results',
    'aria-autocomplete': 'list',
    autocomplete: 'off',
    placeholder: tr(lang, 'searchPlaceholder'),
    'aria-label': tr(lang, 'searchLabel'),
  });
  const list = h('ul', { id: 'site-search-results', class: 'search-results', role: 'listbox', hidden: '' });
  box.append(input, list);
  host.append(box);

  const ensureIndex = async (): Promise<SearchIndexData | null> => {
    if (index) return index;
    if (indexFailed) return null;
    try {
      const response = await fetch(`${BASE}search-index.${lang}.json`);
      if (!response.ok) throw new Error(`search index: ${response.status}`);
      index = (await response.json()) as SearchIndexData;
      return index;
    } catch (error) {
      console.error(error);
      indexFailed = true;
      return null;
    }
  };

  const close = (): void => {
    list.hidden = true;
    list.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  };

  const renderHits = (
    hits: RankedHit[],
    clarify?: readonly RankedHit[],
    onClarify?: (hit: RankedHit) => void,
  ): void => {
    list.replaceChildren();
    activeIndex = -1;
    if (hits.length === 0) {
      list.append(h('li', { class: 'search-empty', role: 'option', 'aria-selected': 'false' }, tr(lang, 'searchNoResults')));
    } else {
      // Clarification candidates sit at the TOP: when the match is
      // ambiguous, narrowing the topic matters more than the first hit.
      if (clarify && clarify.length > 0 && onClarify) {
        const header = h('li', { class: 'search-clarify' }, h('span', { class: 'search-clarify-label' }, tr(lang, 'searchClarifyLabel')));
        for (const option of clarify) {
          const chip = h('button', { type: 'button', class: 'search-chip' }, option.label);
          chip.addEventListener('click', () => onClarify(option));
          header.append(chip);
        }
        list.append(header);
      }
      for (const hit of hits) {
        const kindLabel = tr(
          lang,
          hit.kind === 'scene' ? 'searchSceneKind' : hit.kind === 'term' ? 'searchTermKind' : 'searchExerciseKind',
        );
        const context =
          hit.score !== undefined
            ? `${hit.context} · ${tr(lang, 'searchSimilarity')} ${Math.round(hit.score * 100)}%`
            : hit.context;
        const item = h(
          'li',
          { role: 'option', 'aria-selected': 'false' },
          h(
            'a',
            { href: hit.url },
            h('span', { class: 'search-kind' }, kindLabel),
            h('span', { class: 'search-label' }, hit.label),
            h('span', { class: 'search-context' }, context),
          ),
        );
        list.append(item);
      }
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  /**
   * Shown while the semantic pass is still loading (the first search
   * pays the model download): without it, an empty keyword result reads
   * as a final "no results" for the whole wait.
   */
  const renderSemanticPending = (): void => {
    list.replaceChildren();
    activeIndex = -1;
    list.append(h('li', { class: 'search-empty', role: 'option', 'aria-selected': 'false' }, tr(lang, 'searchSemanticPending')));
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  /**
   * The query looks unrelated to real analysis: say so plainly and offer
   * example questions that do find something, instead of dressing up
   * near-random low-score hits as answers.
   */
  const renderOffTopic = (): void => {
    list.replaceChildren();
    activeIndex = -1;
    const chips = h(
      'div',
      { class: 'search-offtopic' },
      h('span', { class: 'search-clarify-label' }, tr(lang, 'searchOffTopic')),
    );
    for (const question of SEARCH_EXAMPLES[lang]) {
      const chip = h('button', { type: 'button', class: 'search-example' }, question);
      // Keep the input focused so the dropdown stays open for the new query.
      chip.addEventListener('mousedown', (event) => event.preventDefault());
      chip.addEventListener('click', () => {
        input.value = question;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      });
      chips.append(chip);
    }
    list.append(chips);
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  const markActive = (next: number): void => {
    const items = [...list.querySelectorAll<HTMLElement>('li[role="option"]')];
    activeIndex = items.length === 0 ? -1 : (next + items.length) % items.length;
    items.forEach((item, i) => item.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false'));
  };

  const goTo = (position: number): void => {
    const anchor = list.querySelectorAll<HTMLAnchorElement>('li[role="option"] a')[position];
    if (anchor) {
      // Plain navigation: works from any page, including cross-chapter.
      location.assign(anchor.href);
    }
  };

  // First focus warms the semantic engine (vectors and model), so the
  // first real search pays only the inference, not the download.
  input.addEventListener('focus', () => warmSemantic(BASE, lang), { once: true });

  let pending = 0;
  input.addEventListener('input', () => {
    const query = input.value;
    const ticket = ++pending;
    if (query.trim().length === 0) {
      close();
      return;
    }
    void ensureIndex().then((loaded) => {
      if (ticket !== pending || !loaded) return;
      const keywordHits = filterSearchIndex(loaded, query, BASE, lang);
      renderHits(keywordHits);
      // Semantic pass: related topics by meaning, in similarity order.
      // Runs after the keyword render; on first use it also pays the
      // model download, so early keystrokes usually stay keyword-only.
      if (query.trim().length < 2) return;
      if (keywordHits.length === 0) renderSemanticPending();
      void (async () => {
        // Vectors first: if they are missing (a site without semantic
        // data), never pay the model download at all.
        const vectors = await loadSearchVectors(BASE, lang);
        if (ticket !== pending) return;
        if (!vectors) {
          renderHits(keywordHits);
          return;
        }
        const queryVector = await embedQuery(query.trim());
        if (ticket !== pending) return;
        if (!queryVector) {
          renderHits(keywordHits);
          return;
        }
        const semanticHits = semanticSearchIndex(loaded, vectors, queryVector, BASE, lang);
        if (semanticHits.length === 0) {
          // Nothing by meaning either: with no keyword hits the query is
          // off-topic; with keyword hits, settle back to those.
          if (keywordHits.length === 0) renderOffTopic();
          else renderHits(keywordHits);
          return;
        }
        if (keywordHits.length === 0 && (semanticHits[0]?.score ?? 0) < OFFTOPIC_MAX_SCORE) {
          renderOffTopic();
          return;
        }
        const merged = mergeSearchHits(keywordHits, semanticHits);
        // Ambiguous between topics, and no exact keyword match to
        // settle it: offer the candidate topics as one-tap refinements.
        const q = query.trim().toLowerCase();
        const hasPrimary =
          loaded.scenes.some((s) => s.title.toLowerCase().includes(q)) ||
          loaded.terms.some((t) => t.term.toLowerCase().includes(q));
        if (hasPrimary || !isAmbiguousSemantic(semanticHits)) {
          renderHits(merged);
          return;
        }
        renderHits(merged, clarifyOptions(semanticHits), (anchor) => {
          void (async () => {
            const refined = await embedQuery(`${query.trim()} ${anchor.label}`);
            if (ticket !== pending || !refined) return;
            const refinedHits = semanticSearchIndex(loaded, vectors, refined, BASE, lang);
            const rest = mergeSearchHits(keywordHits, refinedHits).filter((hit) => hit.url !== anchor.url);
            renderHits([anchor, ...rest].slice(0, MAX_RESULTS));
          })();
        });
      })();
    });
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close();
      input.blur();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      markActive(activeIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      markActive(activeIndex - 1);
    } else if (event.key === 'Enter') {
      const items = list.querySelectorAll('li[role="option"] a');
      if (!list.hidden && items.length > 0) {
        event.preventDefault();
        goTo(activeIndex >= 0 ? activeIndex : 0);
      }
    }
  });

  // Close when focus leaves the box (delayed so a result click still lands).
  input.addEventListener('blur', () => {
    window.setTimeout(() => {
      if (!box.contains(document.activeElement)) close();
    }, 150);
  });
  document.addEventListener('pointerdown', (event) => {
    if (!box.contains(event.target as Node)) close();
  });
}
