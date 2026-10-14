import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'cubic-root',
          statement: {
            ko: String.raw`방정식 \(x^3 + x - 1 = 0\)이 구간 \((0,1)\) 안에 실근을 가짐을 중간값 정리로 보이세요.`,
            en: String.raw`Use the Intermediate Value Theorem to show that \(x^3 + x - 1 = 0\) has a real root in \((0,1)\).`,
          },
          display: [String.raw`f(0) = -1 < 0 < 1 = f(1) \ \Longrightarrow\ \exists\, \xi \in (0,1):\ f(\xi) = 0`],
          preset: { fn: 'cubic', t: 50 },
          presetCaption: {
            ko: String.raw`\(c = 0\) — 곡선이 높이 \(0\)을 밟는 점 \(\xi \approx 0.6823\).`,
            en: String.raw`\(c = 0\) — the point \(\xi \approx 0.6823\) where the curve steps on height \(0\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = x^3 + x - 1\)은 다항식이므로 \([0,1]\)에서 연속입니다.`,
                en: String.raw`\(f(x) = x^3 + x - 1\) is a polynomial, hence continuous on \([0,1]\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f(0) = -1 < 0\)이고 \(f(1) = 1 > 0\)입니다.`,
                en: String.raw`\(f(0) = -1 < 0\) and \(f(1) = 1 > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`중간값 정리에 의해 \(f(\xi) = 0\)인 \(\xi \in (0,1)\)이 존재합니다 (\(f(0), f(1) \neq 0\)이므로 \(\xi\)는 열린 구간 안에 있습니다). 수치적으로 \(\xi \approx 0.6823278038\)입니다.`,
                en: String.raw`By the Intermediate Value Theorem there is \(\xi \in (0,1)\) with \(f(\xi) = 0\) (strictly inside, since \(f(0), f(1) \neq 0\)). Numerically \(\xi \approx 0.6823278038\).`,
              },
            },
          ],
        },
        {
          id: 'sine-half',
          statement: {
            ko: String.raw`방정식 \(\sin x = \frac12\)이 구간 \((0, \frac{\pi}{2})\) 안에 해를 가짐을 보이세요.`,
            en: String.raw`Show that \(\sin x = \frac12\) has a solution in \((0, \frac{\pi}{2})\).`,
          },
          display: [String.raw`\sin 0 = 0 < \tfrac12 < 1 = \sin \tfrac{\pi}{2} \ \Longrightarrow\ \exists\, \xi:\ \sin \xi = \tfrac12`],
          preset: { fn: 'sine', t: 50 },
          presetCaption: {
            ko: String.raw`\(c = 0.5\) — 건너는 점은 \(\xi = \pi/6 \approx 0.5236\)입니다.`,
            en: String.raw`\(c = 0.5\) — the crossing is at \(\xi = \pi/6 \approx 0.5236\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin x\)는 \([0, \frac{\pi}{2}]\)에서 연속입니다.`,
                en: String.raw`\(\sin x\) is continuous on \([0, \frac{\pi}{2}]\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sin 0 = 0 < \frac12\)이고 \(\sin \frac{\pi}{2} = 1 > \frac12\)입니다.`,
                en: String.raw`\(\sin 0 = 0 < \frac12\) and \(\sin \frac{\pi}{2} = 1 > \frac12\).`,
              },
            },
            {
              text: {
                ko: String.raw`중간값 정리에 의해 \(\sin \xi = \frac12\)인 \(\xi \in (0, \frac{\pi}{2})\)가 존재합니다. 참고로 \(\sin \frac{\pi}{6} = \frac12\)이므로 실제로 \(\xi = \frac{\pi}{6}\)입니다 — 정리는 존재를 보장하고, 정확한 값은 별개의 계산입니다.`,
                en: String.raw`By the Intermediate Value Theorem there is \(\xi \in (0, \frac{\pi}{2})\) with \(\sin \xi = \frac12\). For reference, \(\sin \frac{\pi}{6} = \frac12\), so in fact \(\xi = \frac{\pi}{6}\) — the theorem guarantees existence; the exact value is a separate computation.`,
              },
            },
          ],
        },
        {
          id: 'jump-breaks-ivt',
          statement: {
            ko: String.raw`함수 \(f(x) = \begin{cases} 0 & x < \frac12 \\ 1 & x \geq \frac12 \end{cases}\) (\([0,1]\)에서 정의)이 값 \(c = \frac12\)를 취하지 않음을 직접 보이고, 중간값 정리의 어느 가설이 깨졌는지 말하세요.`,
            en: String.raw`Show directly that \(f(x) = \begin{cases} 0 & x < \frac12 \\ 1 & x \geq \frac12 \end{cases}\) on \([0,1]\) never takes the value \(c = \frac12\), and name the IVT hypothesis that fails.`,
          },
          display: [String.raw`f([0,1]) = \{0, 1\} \not\ni \tfrac12`],
          preset: { fn: 'cubic', t: 50 },
          presetCaption: {
            ko: String.raw`연속인 경우 (\(c = 0\)) — 이 가설이 빠지면 건너는 점이 없을 수 있습니다.`,
            en: String.raw`The continuous case (\(c = 0\)) — drop the hypothesis and the crossing may vanish.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x < \frac12\)이면 \(f(x) = 0 \neq \frac12\)이고, \(x \geq \frac12\)이면 \(f(x) = 1 \neq \frac12\)입니다. 따라서 어떤 \(x\)에 대해서도 \(f(x) = \frac12\)가 될 수 없습니다. 그런데도 \(f(0) = 0 < \frac12 < 1 = f(1)\)입니다.`,
                en: String.raw`For \(x < \frac12\), \(f(x) = 0 \neq \frac12\); for \(x \geq \frac12\), \(f(x) = 1 \neq \frac12\). So no \(x\) satisfies \(f(x) = \frac12\), even though \(f(0) = 0 < \frac12 < 1 = f(1)\).`,
              },
            },
            {
              text: {
                ko: String.raw`깨진 가설은 \(x = \frac12\)에서의 연속성입니다: 좌극한은 \(0\)이지만 \(f(\frac12) = 1\)이므로 불연속입니다. 중간값 정리의 결론이 가설 없이는 성립하지 않음을 보여주는 반례입니다.`,
                en: String.raw`The broken hypothesis is continuity at \(x = \frac12\): the left-hand limit is \(0\) while \(f(\frac12) = 1\). This counterexample shows the IVT conclusion need not hold without its hypothesis.`,
              },
            },
          ],
        },
      ];
