import { describe, expect, it } from 'vitest';
import { decideTier, type LoadSignals } from '../src/shell/load-policy.ts';

const calm: LoadSignals = {
  saveData: false,
  effectiveType: '4g',
  deviceMemory: 8,
  hardwareConcurrency: 8,
  longTasksInWindow: 0,
};

describe('decideTier', () => {
  it('stays at tier 0 on a healthy device and network', () => {
    expect(decideTier(calm)).toBe(0);
  });

  it('unknown signals (0 or empty) never raise the tier', () => {
    expect(decideTier({ ...calm, effectiveType: '', deviceMemory: 0, hardwareConcurrency: 0 })).toBe(0);
  });

  it('tier 1 on save-data, 2g, small memory, few cores, or repeated long tasks', () => {
    expect(decideTier({ ...calm, saveData: true })).toBe(1);
    expect(decideTier({ ...calm, effectiveType: '2g' })).toBe(1);
    expect(decideTier({ ...calm, deviceMemory: 2 })).toBe(1);
    expect(decideTier({ ...calm, hardwareConcurrency: 2 })).toBe(1);
    expect(decideTier({ ...calm, longTasksInWindow: 3 })).toBe(1);
    expect(decideTier({ ...calm, longTasksInWindow: 5 })).toBe(1);
  });

  it('tier 2 on slow-2g or sustained long-task pressure', () => {
    expect(decideTier({ ...calm, effectiveType: 'slow-2g' })).toBe(2);
    expect(decideTier({ ...calm, longTasksInWindow: 6 })).toBe(2);
    expect(decideTier({ ...calm, longTasksInWindow: 12 })).toBe(2);
  });
});
