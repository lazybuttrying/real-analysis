import { exercisesUrl, glossaryUrl, sceneUrl } from '../paths.ts';
import type { Lang } from '../contracts.ts';
import type { SearchIndexData } from '../search-index.ts';
import { h } from './dom.ts';
import { tr } from './i18n.ts';

const BASE = import.meta.env.BASE_URL;
const MAX_RESULTS = 8;

export interface RankedHit {
  kind: 'scene' | 'term' | 'exercise';
  /** Scene title, the glossary term itself, or the localized "Exercise N" label. */
  label: string;
  /** Chapter title for scenes and exercises, scene title for terms. */
  context: string;
  url: string;
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
  for (const scene of index.scenes) {
    const inTitle = scene.title.toLowerCase().includes(q);
    const inSummary = !inTitle && scene.summary.toLowerCase().includes(q);
    if (inTitle || inSummary) {
      scored.push({
        hit: {
          kind: 'scene',
          label: scene.title,
          context: scene.chapterTitle,
          url: sceneUrl(base, lang, scene.chapterId, scene.sceneId),
        },
        score: inTitle ? 2 : 1,
      });
    }
  }
  for (const term of index.terms) {
    const inTerm = term.term.toLowerCase().includes(q);
    const inDefinition = !inTerm && term.definition.toLowerCase().includes(q);
    if (inTerm || inDefinition) {
      scored.push({
        hit: {
          kind: 'term',
          label: term.term,
          context: term.sceneTitle,
          url: `${glossaryUrl(base, lang)}#term-${term.id}`,
        },
        score: inTerm ? 2 : 1,
      });
    }
  }
  for (const exercise of index.exercises) {
    const label = `${tr(lang, 'searchExerciseKind')} ${exercise.number}`;
    const inLabel = label.toLowerCase().includes(q);
    const inStatement = !inLabel && exercise.statement.toLowerCase().includes(q);
    if (inLabel || inStatement) {
      scored.push({
        hit: {
          kind: 'exercise',
          label,
          context: exercise.chapterTitle,
          url: `${exercisesUrl(base, lang, exercise.chapterId)}#exercise-${exercise.exerciseId}`,
        },
        score: inLabel ? 2 : 1,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score || a.hit.label.localeCompare(b.hit.label));
  return scored.slice(0, MAX_RESULTS).map((entry) => entry.hit);
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

  const renderHits = (hits: RankedHit[]): void => {
    list.replaceChildren();
    activeIndex = -1;
    if (hits.length === 0) {
      list.append(h('li', { class: 'search-empty', role: 'option', 'aria-selected': 'false' }, tr(lang, 'searchNoResults')));
    } else {
      for (const hit of hits) {
        const kindLabel = tr(
          lang,
          hit.kind === 'scene' ? 'searchSceneKind' : hit.kind === 'term' ? 'searchTermKind' : 'searchExerciseKind',
        );
        const item = h(
          'li',
          { role: 'option', 'aria-selected': 'false' },
          h(
            'a',
            { href: hit.url },
            h('span', { class: 'search-kind' }, kindLabel),
            h('span', { class: 'search-label' }, hit.label),
            h('span', { class: 'search-context' }, hit.context),
          ),
        );
        list.append(item);
      }
    }
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
      renderHits(filterSearchIndex(loaded, query, BASE, lang));
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
