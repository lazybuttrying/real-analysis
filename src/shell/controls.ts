import { localize, type ControlSpec, type ControlState, type ControlValue, type Lang } from '../contracts';
import { h } from './dom';

/** Builds the shared control UI from ControlSpec. Scenes never build control DOM themselves. */
export function buildControls(
  container: HTMLElement,
  specs: readonly ControlSpec[],
  initial: ControlState,
  lang: Lang,
  onChange: (next: ControlState) => void,
): void {
  let current = initial;
  const update = (key: string, value: ControlValue): void => {
    current = { ...current, [key]: value };
    onChange(current);
  };

  container.replaceChildren();

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
}
