import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guard against hand-written pseudo-TeX in scene and model strings.
 *
 * SVG <text> cannot render KaTeX, so a formula written as plain ASCII
 * ('sum 1/k', 'x -> y', 'sqrt(c)') shows up on the page as raw source.
 * Formulas belong in \(...\) spans, which the rich-text paths render and
 * svgText upgrades inside SVG labels. This test extracts the string
 * literals of every scene and model file with a small scanner (comments
 * and code never match) and rejects the unambiguous pseudo-TeX tokens.
 */

const PSEUDO_TEX: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  // A bare 'sum' starting a term, with a fraction or power later in the same
  // literal: a hand-written series formula. Plain-notation prose such as
  // 'left-endpoint sum (above)' or 'sum C(n, k)' carries neither and passes.
  { name: 'bare sum', pattern: /(^|\s)sum\s+(\d|\||\()[\s\S]*[/^]/ },
  { name: 'ascii arrow', pattern: /\s->\s/ },
  { name: 'sqrt(', pattern: /sqrt\(/ },
];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(path));
    else if (entry.name.endsWith('.ts')) out.push(path);
  }
  return out;
}

type ScannerFrame =
  | { kind: 'code'; braces: number }
  | { kind: 'template' }
  | { kind: 'string'; quote: string };

/** String literal segments of a TypeScript source file, with 1-based line numbers. */
function stringLiterals(source: string): Array<{ text: string; line: number }> {
  const found: Array<{ text: string; line: number }> = [];
  const stack: ScannerFrame[] = [{ kind: 'code', braces: 0 }];
  let i = 0;
  let line = 1;
  let segmentStart = -1;
  let segmentLine = 1;

  const top = (): ScannerFrame => stack[stack.length - 1] as ScannerFrame;
  const beginSegment = (at: number): void => {
    segmentStart = at;
    segmentLine = line;
  };
  const endSegment = (at: number): void => {
    if (segmentStart >= 0) found.push({ text: source.slice(segmentStart, at), line: segmentLine });
    segmentStart = -1;
  };

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1] ?? '';
    const frame = top();

    if (frame.kind === 'string') {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === '\n') line += 1;
      if (ch === frame.quote) {
        endSegment(i);
        stack.pop();
      }
      i += 1;
      continue;
    }

    if (frame.kind === 'template') {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === '\n') line += 1;
      if (ch === '`') {
        endSegment(i);
        stack.pop();
        i += 1;
        continue;
      }
      if (ch === '$' && next === '{') {
        endSegment(i);
        stack.push({ kind: 'code', braces: 0 });
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    // Code frame.
    if (ch === '\n') {
      line += 1;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line += 1;
        i += 1;
      }
      i += 2;
      continue;
    }
    if (ch === "'" || ch === '"') {
      stack.push({ kind: 'string', quote: ch });
      beginSegment(i + 1);
      i += 1;
      continue;
    }
    if (ch === '`') {
      stack.push({ kind: 'template' });
      beginSegment(i + 1);
      i += 1;
      continue;
    }
    if (ch === '{') {
      frame.braces += 1;
      i += 1;
      continue;
    }
    if (ch === '}') {
      if (frame.braces === 0 && stack.length > 1) {
        // Closing a template ${ } expression: resume the template literal.
        stack.pop();
        beginSegment(i + 1);
      } else {
        frame.braces -= 1;
      }
      i += 1;
      continue;
    }
    i += 1;
  }
  return found;
}

describe('svg math guard', () => {
  it('no scene or model string literal carries pseudo-TeX', () => {
    const files = sourceFiles(join(process.cwd(), 'src', 'chapters')).filter(
      (file) => file.includes('/scenes/') || file.includes('/models/'),
    );
    const violations: string[] = [];
    for (const file of files) {
      for (const literal of stringLiterals(readFileSync(file, 'utf-8'))) {
        if (literal.text.includes('\\(')) continue;
        for (const { name, pattern } of PSEUDO_TEX) {
          if (pattern.test(literal.text)) {
            violations.push(
              `${file.replace(`${process.cwd()}/`, '')}:${literal.line} [${name}] ${literal.text.slice(0, 60)}`,
            );
          }
        }
      }
    }
    expect(violations.join('\n')).toBe('');
  });
});
