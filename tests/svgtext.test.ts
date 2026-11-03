import { describe, expect, it } from 'vitest';
import {
  SVG_LABEL_BASELINE_RISE,
  svgLabelBox,
  svgLabelNeedsMath,
  svgLabelPlain,
} from '../src/view/svgtext';

describe('svgLabelNeedsMath', () => {
  it('detects inline math delimiters', () => {
    expect(svgLabelNeedsMath(String.raw`tent \(C_c\) and more`)).toBe(true);
    expect(svgLabelNeedsMath(String.raw`\(x^n\)`)).toBe(true);
  });

  it('is false for plain labels', () => {
    expect(svgLabelNeedsMath('partial sums')).toBe(false);
    expect(svgLabelNeedsMath('')).toBe(false);
    expect(svgLabelNeedsMath('a (b) c')).toBe(false);
  });
});

describe('svgLabelPlain', () => {
  it('strips delimiters and keeps the TeX source', () => {
    expect(svgLabelPlain(String.raw`tent \(C_c\), \(e^{-|x|}\) (\(C_0\))`)).toBe(
      'tent C_c, e^{-|x|} (C_0)',
    );
  });

  it('leaves plain text untouched', () => {
    expect(svgLabelPlain('bad set (0, 1/n] — red')).toBe('bad set (0, 1/n] — red');
  });

  it('handles the wrapped scene titles', () => {
    expect(svgLabelPlain(String.raw`함수공간: \(C_c\), \(C_0\), \(C_b\)`)).toBe(
      '함수공간: C_c, C_0, C_b',
    );
    expect(svgLabelPlain(String.raw`Standard Limits: \(x^n\) and \(x^{1/n}\)`)).toBe(
      'Standard Limits: x^n and x^{1/n}',
    );
  });
});

describe('svgLabelBox', () => {
  it('start anchor: x unchanged, y raised by the baseline rise', () => {
    const box = svgLabelBox('start', 10, 100, 13, 200);
    expect(box.x).toBe(10);
    expect(box.y).toBeCloseTo(100 - SVG_LABEL_BASELINE_RISE * 13);
  });

  it('middle anchor: x shifted left by half the measured width', () => {
    const box = svgLabelBox('middle', 100, 50, 12, 80);
    expect(box.x).toBe(60);
    expect(box.y).toBeCloseTo(50 - SVG_LABEL_BASELINE_RISE * 12);
  });

  it('end anchor: x shifted left by the full measured width', () => {
    const box = svgLabelBox('end', 300, 40, 12, 120);
    expect(box.x).toBe(180);
  });

  it('missing or unknown anchors behave like start', () => {
    expect(svgLabelBox(null, 5, 5, 10, 30).x).toBe(5);
    expect(svgLabelBox(undefined, 5, 5, 10, 30).x).toBe(5);
    expect(svgLabelBox('inherit', 5, 5, 10, 30).x).toBe(5);
  });
});
