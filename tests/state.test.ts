import { describe, expect, it } from 'vitest';
import type { ControlSpec, ControlState } from '../src/contracts';
import { defaultState, parseState, serializeState } from '../src/state';

const SPECS: readonly ControlSpec[] = [
  { kind: 'slider', key: 'n', label: { ko: '항의 수', en: 'Terms' }, min: 1, max: 100, step: 1, init: 10 },
  { kind: 'toggle', key: 'logX', label: { ko: '로그', en: 'Log' }, init: true },
  { kind: 'select', key: 'mode', label: { ko: '모드', en: 'Mode' }, options: ['a', 'b'], init: 'a' },
];

describe('defaultState', () => {
  it('takes every value from the spec init', () => {
    expect(defaultState(SPECS)).toEqual({ n: 10, logX: true, mode: 'a' });
  });
});

describe('serializeState', () => {
  it('omits values equal to their default', () => {
    expect(serializeState(SPECS, defaultState(SPECS))).toBe('');
    expect(serializeState(SPECS, { n: 10, logX: true, mode: 'a' })).toBe('');
  });

  it('encodes non-default values, booleans as 1/0', () => {
    expect(serializeState(SPECS, { n: 25, logX: false, mode: 'b' })).toBe('?n=25&logX=0&mode=b');
    expect(serializeState(SPECS, { n: 10, logX: false, mode: 'a' })).toBe('?logX=0');
  });
});

describe('parseState', () => {
  it('falls back to defaults for missing, malformed, and unknown keys', () => {
    expect(parseState(SPECS, '')).toEqual({ n: 10, logX: true, mode: 'a' });
    expect(parseState(SPECS, '?n=abc&mode=z&extra=1')).toEqual({ n: 10, logX: true, mode: 'a' });
  });

  it('clamps sliders to the spec range and snaps to the step grid', () => {
    expect(parseState(SPECS, '?n=9999').n).toBe(100);
    expect(parseState(SPECS, '?n=-5').n).toBe(1);
    expect(parseState(SPECS, '?n=25').n).toBe(25);
  });

  it('parses toggles and selects', () => {
    expect(parseState(SPECS, '?logX=0&mode=b')).toEqual({ n: 10, logX: false, mode: 'b' });
    expect(parseState(SPECS, '?logX=true')).toEqual({ n: 10, logX: true, mode: 'a' });
  });
});

describe('ControlState <-> query round-trips', () => {
  const states: ControlState[] = [
    { n: 10, logX: true, mode: 'a' },
    { n: 1, logX: false, mode: 'b' },
    { n: 100, logX: true, mode: 'b' },
    { n: 42, logX: false, mode: 'a' },
  ];

  it('parse(serialize(state)) returns the same state', () => {
    for (const state of states) {
      expect(parseState(SPECS, serializeState(SPECS, state))).toEqual(state);
    }
  });

  it('serialize(parse(query)) is stable for canonical queries', () => {
    for (const query of ['', '?n=25', '?logX=0&mode=b', '?n=100&logX=0']) {
      const once = serializeState(SPECS, parseState(SPECS, query));
      const twice = serializeState(SPECS, parseState(SPECS, once));
      expect(twice).toBe(once);
    }
  });
});
