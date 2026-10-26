import { localize, type ControlSpec, type ControlState, type ControlValue, type Lang } from '../contracts';
import { h } from './dom';
import { tr } from './i18n';

/** Default playback interval: slow, one step every two seconds. */
export const PLAYBACK_DEFAULT_INTERVAL_MS = 2000;

/** Intervals offered in the playback settings. */
export const PLAYBACK_INTERVAL_OPTIONS_MS = [500, 1000, 2000, 4000] as const;

interface SliderRef {
  spec: Extract<ControlSpec, { kind: 'slider' }>;
  input: HTMLInputElement;
  readout: HTMLOutputElement;
}

type PlaybackContainer = HTMLElement & { __playbackDispose?: () => void };

/** Next value for a slider step, rounded to the slider step to avoid float drift. */
export function playbackNextValue(
  spec: Extract<ControlSpec, { kind: 'slider' }>,
  currentValue: number,
  loop: boolean,
): { value: number; stopped: boolean } {
  const steps = Math.round((currentValue + spec.step) / spec.step);
  const next = steps * spec.step;
  if (next > spec.max + 1e-9) {
    if (loop) return { value: spec.min, stopped: false };
    return { value: spec.max, stopped: true };
  }
  return { value: next, stopped: false };
}

/**
 * Builds the shared control UI from ControlSpec. Scenes never build control DOM themselves.
 * Returns a dispose function that stops any playback timer; call it when the
 * scene is left, and buildControls itself also stops the previous timer when
 * it rebuilds the same container.
 *
 * Playback: scenes with at least one slider get an autoplay bar below the
 * controls. It advances the target slider by one step per interval, starting
 * automatically at the slow 2000ms default (paused only when the user
 * prefers reduced motion). Every setting in the bar actually works: play
 * and pause start and stop the timer, the interval select restarts it at
 * the chosen interval, the loop checkbox decides whether the slider wraps
 * to its minimum or stops at its maximum, and the target select (shown
 * when a scene has more than one slider) switches which slider advances.
 * Dragging any slider by hand pauses playback, so manual control always wins.
 */
export function buildControls(
  container: HTMLElement,
  specs: readonly ControlSpec[],
  initial: ControlState,
  lang: Lang,
  onChange: (next: ControlState) => void,
): () => void {
  const playbackContainer = container as PlaybackContainer;
  playbackContainer.__playbackDispose?.();

  let current = initial;
  const update = (key: string, value: ControlValue): void => {
    current = { ...current, [key]: value };
    onChange(current);
  };

  container.replaceChildren();
  const sliderRefs: SliderRef[] = [];

  for (const spec of specs) {
    // Select rows are a div, not a label: the option pills below carry their
    // own labels, and a wrapping label would forward stray clicks to them.
    const row = spec.kind === 'select' ? h('div', { class: 'control' }) : h('label', { class: 'control' });
    const name = h('span', {}, localize(spec.label, lang));

    switch (spec.kind) {
      case 'slider': {
        const input = h('input', {
          type: 'range',
          min: String(spec.min),
          max: String(spec.max),
          step: String(spec.step),
        });
        const value = Number(current[spec.key] ?? spec.init);
        input.value = String(value);
        const readout = h('output', {}, String(value));
        input.addEventListener('input', () => {
          const next = Number(input.value);
          readout.textContent = String(next);
          update(spec.key, next);
        });
        sliderRefs.push({ spec, input, readout });
        row.append(name, input, readout);
        break;
      }
      case 'toggle': {
        const input = h('input', { type: 'checkbox' });
        input.checked = current[spec.key] === true;
        input.addEventListener('change', () => update(spec.key, input.checked));
        row.append(input, name);
        break;
      }
      case 'select': {
        // All options stay visible as a single-select pill group (native
        // radios, so grouping, arrow keys, and change events come for free).
        // The value written to state is the option string, exactly as the
        // old <select> wrote it.
        name.id = `control-label-${spec.key}`;
        const group = h('div', { class: 'option-group', role: 'radiogroup', 'aria-labelledby': name.id });
        const selected = String(current[spec.key] ?? spec.init);
        for (const option of spec.options) {
          const input = h('input', { type: 'radio', name: spec.key, value: option });
          input.checked = option === selected;
          input.addEventListener('change', () => {
            if (input.checked) update(spec.key, input.value);
          });
          group.append(h('label', { class: 'option' }, input, h('span', {}, option)));
        }
        row.append(name, group);
        break;
      }
    }
    container.append(row);
  }

  if (sliderRefs.length === 0) {
    const dispose = (): void => undefined;
    playbackContainer.__playbackDispose = dispose;
    return dispose;
  }

  let targetKey = sliderRefs[0]?.spec.key ?? '';
  let intervalMs = PLAYBACK_DEFAULT_INTERVAL_MS;
  let loop = true;
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer: number | undefined;

  const stopTimer = (): void => {
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };

  const playButton = h('button', { type: 'button', class: 'playback-play' }, '');
  const syncPlayButton = (): void => {
    playButton.textContent = playing ? tr(lang, 'playbackPause') : tr(lang, 'playbackPlay');
  };

  const tick = (): void => {
    const ref = sliderRefs.find((candidate) => candidate.spec.key === targetKey);
    if (!ref) return;
    const currentValue = Number(current[ref.spec.key] ?? ref.spec.init);
    const { value, stopped } = playbackNextValue(ref.spec, currentValue, loop);
    ref.input.value = String(value);
    ref.readout.textContent = String(value);
    update(ref.spec.key, value);
    if (stopped) {
      playing = false;
      stopTimer();
      syncPlayButton();
    }
  };

  const startTimer = (): void => {
    stopTimer();
    if (!playing) return;
    timer = window.setInterval(tick, intervalMs);
  };

  const pause = (): void => {
    playing = false;
    stopTimer();
    syncPlayButton();
  };

  playButton.addEventListener('click', () => {
    playing = !playing;
    if (playing) startTimer();
    else stopTimer();
    syncPlayButton();
  });
  syncPlayButton();

  const intervalLabel = (ms: number): string =>
    lang === 'ko' ? (ms >= 1000 ? `${ms / 1000}초` : `${ms}ms`) : ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`;
  const intervalSelect = h(
    'select',
    {},
    ...PLAYBACK_INTERVAL_OPTIONS_MS.map((ms) => h('option', { value: String(ms) }, intervalLabel(ms))),
  );
  intervalSelect.value = String(intervalMs);
  intervalSelect.addEventListener('change', () => {
    intervalMs = Number(intervalSelect.value);
    startTimer();
  });

  const loopInput = h('input', { type: 'checkbox' });
  loopInput.checked = loop;
  loopInput.addEventListener('change', () => {
    loop = loopInput.checked;
  });

  const bar = h('div', { class: 'playback' });
  bar.append(
    h('span', { class: 'playback-title' }, tr(lang, 'playbackLabel')),
    playButton,
    h('label', { class: 'playback-setting' }, h('span', {}, tr(lang, 'playbackInterval')), intervalSelect),
    h('label', { class: 'playback-setting' }, loopInput, h('span', {}, tr(lang, 'playbackLoop'))),
  );

  if (sliderRefs.length > 1) {
    const targetSelect = h(
      'select',
      {},
      ...sliderRefs.map((ref) => h('option', { value: ref.spec.key }, localize(ref.spec.label, lang))),
    );
    targetSelect.value = targetKey;
    targetSelect.addEventListener('change', () => {
      targetKey = targetSelect.value;
    });
    bar.append(h('label', { class: 'playback-setting' }, h('span', {}, tr(lang, 'playbackTarget')), targetSelect));
  }

  container.append(bar);

  for (const ref of sliderRefs) {
    ref.input.addEventListener('input', () => {
      if (playing) pause();
    });
  }

  const onVisibilityChange = (): void => {
    if (document.hidden) stopTimer();
    else startTimer();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  startTimer();

  const dispose = (): void => {
    playing = false;
    stopTimer();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (playbackContainer.__playbackDispose === dispose) delete playbackContainer.__playbackDispose;
  };
  playbackContainer.__playbackDispose = dispose;
  return dispose;
}
