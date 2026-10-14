import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'linear-limit',
          statement: {
            ko: String.raw`\(\lim_{x \to 2} 3x = 6\)임을 \(\varepsilon\)-\(\delta\) 정의로 증명하고, 각 \(\varepsilon > 0\)에 대한 \(\delta\)를 구하세요.`,
            en: String.raw`Prove \(\lim_{x \to 2} 3x = 6\) from the \(\varepsilon\)-\(\delta\) definition; give \(\delta\) for each \(\varepsilon > 0\).`,
          },
          display: [String.raw`\delta(\varepsilon) = \frac{\varepsilon}{3},\qquad \lvert 3x - 6\rvert = 3\lvert x - 2\rvert`],
          preset: { epsilon: 0.3 },
          presetCaption: {
            ko: String.raw`\(\varepsilon = 0.3\) — 이 장면의 \(2x\)에서는 \(\delta = \varepsilon/2 = 0.15\); 문제의 \(3x\)에서는 기울기 \(3\)이 분모에 옵니다.`,
            en: String.raw`\(\varepsilon = 0.3\) — for this scene's \(2x\), \(\delta = \varepsilon/2 = 0.15\); for the problem's \(3x\) the slope \(3\) goes in the denominator.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\delta = \frac{\varepsilon}{3}\)이라 둡니다. \(0 < \lvert x - 2\rvert < \delta\)이면 \(\lvert 3x - 6\rvert = \lvert 3(x - 2)\rvert = 3\lvert x - 2\rvert < 3\delta = \varepsilon\)입니다. 따라서 정의에 의해 \(\lim_{x \to 2} 3x = 6\)입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), put \(\delta = \frac{\varepsilon}{3}\). If \(0 < \lvert x - 2\rvert < \delta\), then \(\lvert 3x - 6\rvert = \lvert 3(x-2)\rvert = 3\lvert x - 2\rvert < 3\delta = \varepsilon\). Hence \(\lim_{x \to 2} 3x = 6\) by the definition.`,
              },
            },
            {
              text: {
                ko: String.raw`핵심은 \(\lvert 3x - 6\rvert = 3\lvert x - 2\rvert\)로 인수분해되는 것입니다: 기울기 \(3\)이 입력 오차를 증폭시키므로, \(\delta = \varepsilon/3\)으로 정확히 상쇄합니다.`,
                en: String.raw`The point is the factorization \(\lvert 3x - 6\rvert = 3\lvert x - 2\rvert\): the slope \(3\) amplifies the input error, and \(\delta = \varepsilon/3\) exactly cancels that amplification.`,
              },
            },
            {
              text: {
                ko: String.raw`수치 확인: \(\varepsilon = 0.03\)이면 \(\delta = 0.01\)입니다. \(\lvert x - 2\rvert < 0.01\)인 모든 \(x\)에 대해 \(\lvert 3x - 6\rvert = 3\lvert x - 2\rvert < 0.03 = \varepsilon\)입니다.`,
                en: String.raw`Numerically: \(\varepsilon = 0.03\) gives \(\delta = 0.01\). For every \(x\) with \(\lvert x - 2\rvert < 0.01\) we have \(\lvert 3x - 6\rvert = 3\lvert x - 2\rvert < 0.03 = \varepsilon\).`,
              },
            },
          ],
        },
        {
          id: 'square-limit',
          statement: {
            ko: String.raw`\(\lim_{x \to 1} x^2 = 1\)임을 \(\delta = \min\left(1, \frac{\varepsilon}{3}\right)\)로 증명하세요.`,
            en: String.raw`Prove \(\lim_{x \to 1} x^2 = 1\) with \(\delta = \min\left(1, \frac{\varepsilon}{3}\right)\).`,
          },
          display: [String.raw`\lvert x^2 - 1\rvert = \lvert x - 1\rvert \cdot \lvert x + 1\rvert < 3\delta \leq \varepsilon`],
          preset: { epsilon: 0.6 },
          presetCaption: {
            ko: String.raw`\(\varepsilon = 0.6\), \(\delta = 0.3\) — 곡선 \(x^2\)에는 일정한 비율 \(\delta/\varepsilon\)이 없지만, 이 장면의 직선에는 있습니다.`,
            en: String.raw`\(\varepsilon = 0.6\), \(\delta = 0.3\) — the curve \(x^2\) admits no constant ratio \(\delta/\varepsilon\); this scene's line does.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\lvert x^2 - 1\rvert = \lvert (x-1)(x+1)\rvert = \lvert x - 1\rvert \cdot \lvert x + 1\rvert\)입니다. 문제는 \(\lvert x + 1\rvert\)인데, 이는 \(x\)에 따라 변하므로 먼저 \(x\)를 \(1\) 근처에 가둡니다.`,
                en: String.raw`\(\lvert x^2 - 1\rvert = \lvert (x-1)(x+1)\rvert = \lvert x - 1\rvert \cdot \lvert x + 1\rvert\). The factor \(\lvert x + 1\rvert\) varies with \(x\), so first trap \(x\) near \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\lvert x - 1\rvert < 1\)이면 \(0 < x < 2\)이므로 \(\lvert x + 1\rvert = x + 1 < 3\)입니다. 따라서 \(\lvert x^2 - 1\rvert < 3\lvert x - 1\rvert\)입니다.`,
                en: String.raw`If \(\lvert x - 1\rvert < 1\) then \(0 < x < 2\), so \(\lvert x + 1\rvert = x + 1 < 3\). Hence \(\lvert x^2 - 1\rvert < 3\lvert x - 1\rvert\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\delta = \min\left(1, \frac{\varepsilon}{3}\right)\)이라 둡니다. \(\lvert x - 1\rvert < \delta\)이면 두 조건 \(\lvert x - 1\rvert < 1\)과 \(\lvert x - 1\rvert < \frac{\varepsilon}{3}\)이 모두 성립하므로, \(\lvert x^2 - 1\rvert < 3 \cdot \frac{\varepsilon}{3} = \varepsilon\)입니다. 따라서 \(\lim_{x \to 1} x^2 = 1\)입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), put \(\delta = \min\left(1, \frac{\varepsilon}{3}\right)\). If \(\lvert x - 1\rvert < \delta\), both \(\lvert x - 1\rvert < 1\) and \(\lvert x - 1\rvert < \frac{\varepsilon}{3}\) hold, so \(\lvert x^2 - 1\rvert < 3 \cdot \frac{\varepsilon}{3} = \varepsilon\). Hence \(\lim_{x \to 1} x^2 = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`수치 확인: \(\varepsilon = 0.3\)이면 \(\delta = \min(1, 0.1) = 0.1\)이고, \(\lvert x - 1\rvert < 0.1\)일 때 \(\lvert x^2 - 1\rvert < 3 \cdot 0.1 = 0.3 = \varepsilon\)입니다.`,
                en: String.raw`Numerically: \(\varepsilon = 0.3\) gives \(\delta = \min(1, 0.1) = 0.1\), and for \(\lvert x - 1\rvert < 0.1\) we get \(\lvert x^2 - 1\rvert < 3 \cdot 0.1 = 0.3 = \varepsilon\).`,
              },
            },
          ],
        },
        {
          id: 'limit-unique',
          statement: {
            ko: String.raw`\(f\)가 \(a\)에서 \(L_1\)과 \(L_2\)로 수렴하면 \(L_1 = L_2\)임을 증명하세요 (극한의 유일성).`,
            en: String.raw`Prove that if \(f\) tends to both \(L_1\) and \(L_2\) at \(a\), then \(L_1 = L_2\) (uniqueness of limits).`,
          },
          display: [
            String.raw`\lvert L_1 - L_2\rvert \leq \lvert L_1 - f(x)\rvert + \lvert f(x) - L_2\rvert < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon`,
          ],
          preset: { epsilon: 0.1 },
          presetCaption: {
            ko: String.raw`\(\varepsilon = 0.1\) — 아무리 작은 \(\varepsilon\)을 잡아도 두 후보는 \(\varepsilon\) 안에 갇혀 결국 하나가 됩니다.`,
            en: String.raw`\(\varepsilon = 0.1\) — however small \(\varepsilon\) is, both candidates are trapped within \(\varepsilon\) and must coincide.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)을 잡습니다. 정의에 의해, \(0 < \lvert x - a\rvert < \delta_1\)이면 \(\lvert f(x) - L_1\rvert < \frac{\varepsilon}{2}\)인 \(\delta_1 > 0\)과, \(0 < \lvert x - a\rvert < \delta_2\)이면 \(\lvert f(x) - L_2\rvert < \frac{\varepsilon}{2}\)인 \(\delta_2 > 0\)이 존재합니다. \(\delta = \min(\delta_1, \delta_2) > 0\)이라 둡니다.`,
                en: String.raw`Let \(\varepsilon > 0\). By the definition there are \(\delta_1 > 0\) with \(\lvert f(x) - L_1\rvert < \frac{\varepsilon}{2}\) when \(0 < \lvert x - a\rvert < \delta_1\), and \(\delta_2 > 0\) with \(\lvert f(x) - L_2\rvert < \frac{\varepsilon}{2}\) when \(0 < \lvert x - a\rvert < \delta_2\). Put \(\delta = \min(\delta_1, \delta_2) > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(0 < \lvert x - a\rvert < \delta\)인 \(x\)에 대해 (실수에서는 그런 \(x\)가 항상 존재합니다) 삼각부등식으로 \(\lvert L_1 - L_2\rvert \leq \lvert L_1 - f(x)\rvert + \lvert f(x) - L_2\rvert < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\)입니다.`,
                en: String.raw`For any \(x\) with \(0 < \lvert x - a\rvert < \delta\) (in \(\mathbb{R}\) such an \(x\) always exists), the triangle inequality gives \(\lvert L_1 - L_2\rvert \leq \lvert L_1 - f(x)\rvert + \lvert f(x) - L_2\rvert < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`이는 모든 \(\varepsilon > 0\)에 대해 성립합니다. \(\lvert L_1 - L_2\rvert > 0\)이라면 \(\varepsilon = \frac{\lvert L_1 - L_2\rvert}{2}\)를 잡으면 모순이므로, \(\lvert L_1 - L_2\rvert = 0\), 즉 \(L_1 = L_2\)입니다.`,
                en: String.raw`This holds for every \(\varepsilon > 0\). If \(\lvert L_1 - L_2\rvert > 0\), choosing \(\varepsilon = \frac{\lvert L_1 - L_2\rvert}{2}\) gives a contradiction; hence \(\lvert L_1 - L_2\rvert = 0\), i.e. \(L_1 = L_2\).`,
              },
            },
          ],
        },
      ];
