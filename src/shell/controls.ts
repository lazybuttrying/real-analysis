import type { ControlSpec, ControlState, ControlValue } from '../contracts';
import { h } from './dom';

/** Builds the shared control UI from ControlSpec. Scenes never build control DOM themselves. */
export function buildControls(
  container: HTMLElement,
  specs: readonly ControlSpec[],
  initial: ControlState,
  onChange: (next: ControlState) => void,
): void {
  let current = initial;
  const update = (key: string, value: ControlValue): void => {
    current = { ...current, [key]: value };
    onChange(current);
  };

  container.replaceChildren();

  for (const spec of specs) {
    const row = h('label', { class: 'control' });
    const name = h('span', {}, spec.label);

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
        const select = h('select', {}, ...spec.options.map((option) => h('option', { value: option }, option)));
        select.value = String(current[spec.key] ?? spec.init);
        select.addEventListener('change', () => update(spec.key, select.value));
        row.append(name, select);
        break;
      }
    }
    container.append(row);
  }
}
