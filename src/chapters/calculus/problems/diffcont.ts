import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'three-line-proof',
          statement: {
            ko: String.raw`\(f\)가 \(a\)에서 미분가능하면 \(a\)에서 연속임을 세 줄로 증명하세요.`,
            en: String.raw`Prove in three lines: if \(f\) is differentiable at \(a\), it is continuous at \(a\).`,
          },
          display: [
            String.raw`f(a+h) - f(a) = \frac{f(a+h)-f(a)}{h} \cdot h \to f'(a) \cdot 0 = 0`,
          ],
          preset: { zoom: 1 },
          presetCaption: {
            ko: String.raw`\(|x|\) 전체 모습 — 증명의 핵심은 차분 몫에 \(h\)를 곱하는 트릭입니다.`,
            en: String.raw`The full \(|x|\) — the proof's trick is multiplying the difference quotient by \(h\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(h \neq 0\)일 때 \(f(a+h) - f(a) = \frac{f(a+h)-f(a)}{h} \cdot h\)입니다 — 0이 아닌 수로 나누고 다시 곱하는 것은 아무것도 바꾸지 않습니다.`,
                en: String.raw`For \(h \neq 0\), \(f(a+h) - f(a) = \frac{f(a+h)-f(a)}{h} \cdot h\) — dividing by a nonzero number and multiplying back changes nothing.`,
              },
            },
            {
              text: {
                ko: String.raw`\(h \to 0\)으로 보내면 꺾쇠 안의 차분 몫은 \(f'(a)\)로, 뒤의 \(h\)는 \(0\)으로 수렴하므로, 곱은 \(f'(a) \cdot 0 = 0\)으로 수렴합니다.`,
                en: String.raw`As \(h \to 0\), the bracketed difference quotient tends to \(f'(a)\) and the trailing \(h\) tends to \(0\), so the product tends to \(f'(a) \cdot 0 = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\lim_{h \to 0} f(a+h) = f(a)\)입니다 — 이것이 \(a\)에서의 연속성의 정의이므로, \(f\)는 \(a\)에서 연속입니다.`,
                en: String.raw`Hence \(\lim_{h \to 0} f(a+h) = f(a)\) — the definition of continuity at \(a\), so \(f\) is continuous at \(a\).`,
              },
            },
          ],
        },
        {
          id: 'abs-not-differentiable',
          statement: {
            ko: String.raw`\(f(x) = \lvert x\rvert\)가 \(x = 0\)에서 미분가능하지 않음을 증명하세요.`,
            en: String.raw`Prove \(f(x) = \lvert x\rvert\) is not differentiable at \(x = 0\).`,
          },
          display: [
            String.raw`\frac{|h|}{h} = \begin{cases} 1 & h > 0 \\ -1 & h < 0 \end{cases}`,
          ],
          preset: { zoom: 4 },
          presetCaption: {
            ko: String.raw`4단계 확대 — 왼쪽 기울기 \(-1\), 오른쪽 \(+1\)이 그대로입니다.`,
            en: String.raw`Zoom level 4 — left slope \(-1\), right slope \(+1\), unchanged.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`차분 몫은 \(\frac{f(0+h)-f(0)}{h} = \frac{|h|}{h}\)이고, \(h > 0\)일 때 \(1\), \(h < 0\)일 때 \(-1\)입니다.`,
                en: String.raw`The difference quotient is \(\frac{f(0+h)-f(0)}{h} = \frac{|h|}{h}\), which equals \(1\) for \(h > 0\) and \(-1\) for \(h < 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 우극한은 \(1\), 좌극한은 \(-1\)로 서로 다르므로, 양쪽 극한 — 즉 도함수 — 은 존재하지 않습니다.`,
                en: String.raw`So the right-hand limit is \(1\) and the left-hand limit is \(-1\); they differ, hence the two-sided limit — the derivative — does not exist.`,
              },
            },
            {
              text: {
                ko: String.raw`확대해도 모서리가 펴지지 않는 것이 바로 이 때문입니다: 어느 배율에서든 왼쪽 기울기 \(-1\), 오른쪽 기울기 \(+1\)이 그대로 유지됩니다.`,
                en: String.raw`That is why the corner never flattens under zoom: at every magnification the left slope stays \(-1\) and the right slope stays \(+1\).`,
              },
            },
          ],
        },
        {
          id: 'weierstrass-exists',
          statement: {
            ko: String.raw`모든 점에서 연속이지만 어떤 점에서도 미분가능하지 않은 함수가 존재함을 (정리로) 서술하세요. 증명은 생략하고 아이디어 수준으로 둡니다.`,
            en: String.raw`State (as a theorem) that a function exists which is continuous everywhere but differentiable nowhere. Idea level; proof omitted.`,
          },
          preset: { zoom: 8 },
          presetCaption: {
            ko: String.raw`8단계 확대 — \(|x|\)의 모서리 하나가 아니라, 이런 모서리가 모든 점에 있습니다.`,
            en: String.raw`Zoom level 8 — not one corner of \(|x|\), but such a corner at every point.`,
          },
    isHint: true,
    proof: [
            {
              text: {
                ko: String.raw`바이어슈트라스 정리: 모든 점에서 연속이지만 어떤 점에서도 미분가능하지 않은 함수가 존재합니다. 고전적인 예는 \(0 < a < 1\), \(b\)가 홀수인 양의 정수, \(ab > 1 + \frac{3\pi}{2}\)인 \(\sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) 형태의 급수입니다.`,
                en: String.raw`Weierstrass's theorem: there exists a function continuous at every point yet differentiable at none. A classic example is a series of the form \(\sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) with \(0 < a < 1\), \(b\) an odd positive integer, and \(ab > 1 + \frac{3\pi}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`아이디어: 연속함수들의 균등수렴 극한은 연속이므로 전체 연속성이 확보되지만, 각 점마다 뾰족한 파형이 차분 몫을 무너뜨려 어느 점에서도 도함수가 존재하지 않습니다. 증명은 생략합니다 — 알려진 결과로 받아들입니다.`,
                en: String.raw`The idea: a uniform limit of continuous functions is continuous, which secures continuity everywhere, but at each point the jagged waves defeat every difference quotient, so no derivative exists anywhere. No proof is given — this is stated as a known result.`,
              },
            },
          ],
        },
      ];
