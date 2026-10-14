import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'square-xi',
          statement: {
            ko: String.raw`\(f(x) = x^2\)를 \([0, 2]\)에서 평균값 정리에 적용하여 \(\xi\)를 직접 구하세요.`,
            en: String.raw`Apply the Mean Value Theorem to \(f(x) = x^2\) on \([0, 2]\) and find \(\xi\) explicitly.`,
          },
          display: [String.raw`\frac{f(2)-f(0)}{2-0} = 2, \quad f'(\xi) = 2\xi = 2 \;\Rightarrow\; \xi = 1`],
          preset: { fn: 'x^2', xi: 50 },
          presetCaption: {
            ko: String.raw`\(f(x) = x^2\), \(\xi = 1\) — 접선의 기울기가 2로 할선과 일치합니다.`,
            en: String.raw`\(f(x) = x^2\), \(\xi = 1\) — the tangent slope is 2, matching the secant.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`할선의 기울기는 \(\frac{f(2) - f(0)}{2 - 0} = \frac{4 - 0}{2} = 2\)입니다.`,
                en: String.raw`The secant slope is \(\frac{f(2) - f(0)}{2 - 0} = \frac{4 - 0}{2} = 2\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f'(x) = 2x\)이므로 \(f'(\xi) = 2\)는 \(2\xi = 2\), 즉 \(\xi = 1\)을 줍니다. \(1 \in (0, 2)\)이므로 평균값 정리의 결론과 일치합니다.`,
                en: String.raw`Since \(f'(x) = 2x\), \(f'(\xi) = 2\) gives \(2\xi = 2\), i.e. \(\xi = 1\). As \(1 \in (0, 2)\), this matches the theorem's conclusion.`,
              },
            },
          ],
        },
        {
          id: 'rolle',
          statement: {
            ko: String.raw`\(f(a) = f(b)\)이면 평균값 정리는 롤의 정리가 됩니다. \(f(x) = x^3 - 3x\), \([-1, 2]\)에서 확인하세요.`,
            en: String.raw`When \(f(a) = f(b)\), the Mean Value Theorem becomes Rolle's theorem. Check it for \(f(x) = x^3 - 3x\) on \([-1, 2]\).`,
          },
          display: [String.raw`f(-1) = f(2) = 2 \;\Rightarrow\; \exists\,\xi \in (-1,2): f'(\xi) = 0`],
          preset: { fn: 'x^3-3x', xi: 67 },
          presetCaption: {
            ko: String.raw`\(\xi \approx 1\)에서 접선이 수평 — 할선(기울기 0)과 평행합니다.`,
            en: String.raw`At \(\xi \approx 1\) the tangent is horizontal — parallel to the secant (slope 0).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(-1) = -1 + 3 = 2\), \(f(2) = 8 - 6 = 2\)이므로 할선의 기울기는 \(\frac{2-2}{3} = 0\)입니다.`,
                en: String.raw`\(f(-1) = -1 + 3 = 2\) and \(f(2) = 8 - 6 = 2\), so the secant slope is \(\frac{2-2}{3} = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f'(x) = 3x^2 - 3 = 0\)은 \(x = \pm 1\)을 주고, 열린 구간 \((-1, 2)\) 안에는 \(\xi = 1\)이 있습니다. 이것이 롤의 정리입니다 — 평균값 정리의 기울기가 0인 특수 경우입니다.`,
                en: String.raw`\(f'(x) = 3x^2 - 3 = 0\) gives \(x = \pm 1\), and the open interval \((-1, 2)\) contains \(\xi = 1\). That is Rolle's theorem — the Mean Value Theorem with zero slope.`,
              },
            },
          ],
        },
        {
          id: 'constant',
          statement: {
            ko: String.raw`\(f' \equiv 0\)이면 \(f\)는 상수함수임을 평균값 정리로 증명하세요.`,
            en: String.raw`Prove via the Mean Value Theorem that \(f' \equiv 0\) forces \(f\) to be constant.`,
          },
          display: [String.raw`f(b) - f(a) = f'(\xi)(b-a) = 0`],
          preset: { fn: 'const', xi: 50 },
          presetCaption: {
            ko: String.raw`상수함수: 할선도 접선도 기울기가 0입니다.`,
            en: String.raw`A constant function: both secant and tangent have slope 0.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f\)가 \([a, b]\)에서 연속이고 \((a, b)\)에서 미분가능하며 \(f' \equiv 0\)이라 가정합니다.`,
                en: String.raw`Assume \(f\) is continuous on \([a, b]\), differentiable on \((a, b)\), with \(f' \equiv 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`평균값 정리에 의해 어떤 \(\xi \in (a, b)\)에 대해 \(f(b) - f(a) = f'(\xi)(b-a) = 0\cdot(b-a) = 0\)입니다.`,
                en: String.raw`By the Mean Value Theorem, some \(\xi \in (a, b)\) gives \(f(b) - f(a) = f'(\xi)(b-a) = 0\cdot(b-a) = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(f(b) = f(a)\)이고, \(a, b\)가 임의였으므로 \(f\)는 상수함수입니다.`,
                en: String.raw`Hence \(f(b) = f(a)\), and since \(a, b\) were arbitrary, \(f\) is constant.`,
              },
            },
          ],
        },
      ];
