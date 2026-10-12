import type { ControlSpec, ControlState, ControlValue } from './contracts.ts';

/**
 * ControlSpec 이 컨트롤 상태와 URL 쿼리의 단일 원천이다.
 * 알 수 없는 키는 무시하고, 범위를 벗어난 값은 clamp 한다.
 */

type SliderSpec = Extract<ControlSpec, { kind: 'slider' }>;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** step 격자에 맞추고 부동소수점 잡음을 걷어낸다. */
function snap(value: number, spec: SliderSpec): number {
  const steps = Math.round((value - spec.min) / spec.step);
  return Number((spec.min + steps * spec.step).toFixed(10));
}

export function defaultState(specs: readonly ControlSpec[]): ControlState {
  return Object.fromEntries(specs.map((spec) => [spec.key, spec.init]));
}

export function parseState(specs: readonly ControlSpec[], search: string): ControlState {
  const params = new URLSearchParams(search);
  const state: Record<string, ControlValue> = { ...defaultState(specs) };

  for (const spec of specs) {
    const raw = params.get(spec.key);
    if (raw === null) continue;

    switch (spec.kind) {
      case 'slider': {
        const value = Number(raw);
        if (raw.trim() !== '' && Number.isFinite(value)) {
          state[spec.key] = clamp(snap(value, spec), spec.min, spec.max);
        }
        break;
      }
      case 'toggle':
        state[spec.key] = raw === '1' || raw === 'true';
        break;
      case 'select':
        if (spec.options.includes(raw)) state[spec.key] = raw;
        break;
    }
  }
  return state;
}

/** 기본값과 같은 항목은 생략해서 URL을 짧게 유지한다. 결과는 '' 또는 '?a=1&b=0'. */
export function serializeState(specs: readonly ControlSpec[], state: ControlState): string {
  const params = new URLSearchParams();
  for (const spec of specs) {
    const value = state[spec.key];
    if (value === undefined || value === spec.init) continue;
    params.set(spec.key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  }
  const query = params.toString();
  return query === '' ? '' : `?${query}`;
}

export function shallowEqual(a: ControlState, b: ControlState): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
}
