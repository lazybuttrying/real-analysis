import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the L'Hopital's rule scene.
 * Imports nothing except types. Every number below was verified:
 *   sin pair at pos 60: x = 1.5 * 0.001^0.6 ~= 0.0238,
 *     sin x / x ~= 0.9999, cos x ~= 0.9997;
 *   log pair at pos 60: x = 10^2.2 ~= 158.5,
 *     (ln x)/x ~= 0.0320, 1/x ~= 0.00631;
 *   log pair at pos 100: x = 1000, (ln x)/x ~= 0.00691, 1/x = 0.001;
 *   x = 0.01: x ln x ~= -0.0461, -x = -0.01.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'lhopital-sin-x-over-x',
    statement: {
      ko: String.raw`로피탈 정리로 \(\lim_{x \to 0}\frac{\sin x}{x} = 1\)을 증명하세요. (\(0/0\) 가정을 명시하세요.)`,
      en: String.raw`Prove \(\lim_{x \to 0}\frac{\sin x}{x} = 1\) by L'Hôpital's rule. (State the \(0/0\) hypotheses.)`,
    },
    display: [
      String.raw`\lim_{x \to 0}\frac{\sin x}{x} = \lim_{x \to 0}\frac{(\sin x)'}{(x)'} = \lim_{x \to 0}\cos x = \cos 0 = 1`,
    ],
    preset: { pair: 'sin x / x', pos: 60 },
    presetCaption: {
      ko: String.raw`\(x \approx 0.0238\) (\(0/0\) 꼴): \(\frac{\sin x}{x} \approx 0.9999\), \(\frac{\cos x}{1} \approx 0.9997\) — 오른쪽으로 밀수록 둘 다 1에 붙습니다.`,
      en: String.raw`\(x \approx 0.0238\) (a \(0/0\) form): \(\frac{\sin x}{x} \approx 0.9999\), \(\frac{\cos x}{1} \approx 0.9997\) — dragging right, both stick to 1.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f(x) = \sin x\), \(g(x) = x\)라 두면 \(f(0) = g(0) = 0\)이고 \(g'(x) = 1 \neq 0\)입니다 — \(0/0\) 꼴입니다. \(x > 0\)일 때 \([0, x]\)에서 코시 평균값 정리를 적용하면 어떤 \(\xi_x \in (0, x)\)에 대해 \(\frac{\sin x - \sin 0}{x - 0} = \frac{\cos \xi_x}{1}\)입니다.`,
          en: String.raw`Put \(f(x) = \sin x\) and \(g(x) = x\): then \(f(0) = g(0) = 0\) and \(g'(x) = 1 \neq 0\) — a \(0/0\) form. For \(x > 0\), Cauchy's theorem on \([0, x]\) gives \(\frac{\sin x - \sin 0}{x - 0} = \frac{\cos \xi_x}{1}\) for some \(\xi_x \in (0, x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(0 < \xi_x < x\)이므로 \(x \to 0^+\)일 때 조임으로 \(\xi_x \to 0\)입니다. \(\cos\)는 연속이므로 (미분가능 ⇒ 연속) \(\cos \xi_x \to \cos 0 = 1\)입니다. 이것이 \(0/0\) 경우의 로피탈 정리입니다: 분자·분모를 각각 미분한 비율의 극한이 원래 비율의 극한과 같습니다.`,
          en: String.raw`Since \(0 < \xi_x < x\), squeezing gives \(\xi_x \to 0\) as \(x \to 0^+\). Cosine is continuous (differentiable implies continuous), so \(\cos \xi_x \to \cos 0 = 1\). That is L'Hôpital's rule for the \(0/0\) case: the limit of the differentiated ratio equals the limit of the original ratio.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x < 0\)일 때는 \([x, 0]\)에서 같은 논리로 \(\xi_x \in (x, 0)\)을 얻고 마찬가지로 \(\cos \xi_x \to 1\)입니다. 따라서 \(\lim_{x \to 0}\frac{\sin x}{x} = 1\)입니다.`,
          en: String.raw`For \(x < 0\), the same argument on \([x, 0]\) yields \(\xi_x \in (x, 0)\) and likewise \(\cos \xi_x \to 1\). Hence \(\lim_{x \to 0}\frac{\sin x}{x} = 1\).`,
        },
      },
    ],
  },
  {
    id: 'lhopital-log-x-over-x',
    statement: {
      ko: String.raw`\(\lim_{x \to \infty}\frac{\ln x}{x} = 0\)을 증명하세요. (\(\infty/\infty\) 꼴: \(g \to \infty\), \(g' \neq 0\) 가정을 확인하세요.)`,
      en: String.raw`Prove \(\lim_{x \to \infty}\frac{\ln x}{x} = 0\). (An \(\infty/\infty\) form: check the \(g \to \infty\) and \(g' \neq 0\) hypotheses.)`,
    },
    display: [
      String.raw`\frac{f(x)}{g(x)} = \frac{f'(\xi_x)}{g'(\xi_x)}\left(1 - \frac{g(A)}{g(x)}\right) + \frac{f(A)}{g(x)} \xrightarrow[x\to\infty]{} L`,
      String.raw`\frac{(\ln x)'}{(x)'} = \frac{1/x}{1} = \frac{1}{x} \to 0 \quad\Rightarrow\quad \lim_{x\to\infty}\frac{\ln x}{x} = 0`,
    ],
    preset: { pair: 'ln x / x', pos: 60 },
    presetCaption: {
      ko: String.raw`\(x \approx 158.5\) (\(\infty/\infty\) 꼴): \(\frac{\ln x}{x} \approx 0.0320\), \(\frac{1}{x} \approx 0.00631\) — 오른쪽으로 밀수록 둘 다 0에 붙습니다.`,
      en: String.raw`\(x \approx 158.5\) (an \(\infty/\infty\) form): \(\frac{\ln x}{x} \approx 0.0320\), \(\frac{1}{x} \approx 0.00631\) — dragging right, both stick to 0.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(\infty/\infty\) 보조정리: \((A, \infty)\)에서 미분가능하고 \(g' \neq 0\), \(g(x) \to \infty\), \(\frac{f'(x)}{g'(x)} \to L\) (유한)이라 하자. \(x > A\)일 때 \([A, x]\)에 코시 평균값 정리를 적용하면 어떤 \(\xi_x \in (A, x)\)에 대해 \(\frac{f(x) - f(A)}{g(x) - g(A)} = \frac{f'(\xi_x)}{g'(\xi_x)}\)이다.`,
          en: String.raw`First the \(\infty/\infty\) lemma: suppose \(f, g\) are differentiable on \((A, \infty)\) with \(g' \neq 0\), \(g(x) \to \infty\), and \(\frac{f'(x)}{g'(x)} \to L\) (finite). For \(x > A\), Cauchy's theorem on \([A, x]\) gives \(\frac{f(x) - f(A)}{g(x) - g(A)} = \frac{f'(\xi_x)}{g'(\xi_x)}\) for some \(\xi_x \in (A, x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`정리하면 \(\frac{f(x)}{g(x)} = \frac{f'(\xi_x)}{g'(\xi_x)}\left(1 - \frac{g(A)}{g(x)}\right) + \frac{f(A)}{g(x)}\)이다. \(\varepsilon > 0\)에 대해 \(t > A\)일 때 \(\left|\frac{f'(t)}{g'(t)} - L\right| < \frac{\varepsilon}{2}\)가 되도록 \(A\)를 잡으면 \(\xi_x > A\)이므로 \(\left|\frac{f'(\xi_x)}{g'(\xi_x)} - L\right| < \frac{\varepsilon}{2}\)이다. \(g(x) \to \infty\)이므로 \(x\)가 충분히 크면 \(\left|\frac{g(A)}{g(x)}\right| < 1\)이고 \(\frac{|f(A) - L g(A)|}{|g(x)|}\)도 작아져서, \(\left|\frac{f(x)}{g(x)} - L\right| < \varepsilon\)을 얻는다. \(\varepsilon\)이 임의이므로 \(\frac{f(x)}{g(x)} \to L\)이다 — 이것이 \(\infty/\infty\) 경우의 로피탈 정리이다.`,
          en: String.raw`Rearranging, \(\frac{f(x)}{g(x)} = \frac{f'(\xi_x)}{g'(\xi_x)}\left(1 - \frac{g(A)}{g(x)}\right) + \frac{f(A)}{g(x)}\). Given \(\varepsilon > 0\), choose \(A\) so that \(\left|\frac{f'(t)}{g'(t)} - L\right| < \frac{\varepsilon}{2}\) for \(t > A\); then \(\xi_x > A\) gives \(\left|\frac{f'(\xi_x)}{g'(\xi_x)} - L\right| < \frac{\varepsilon}{2}\). Since \(g(x) \to \infty\), for large \(x\) we have \(\left|\frac{g(A)}{g(x)}\right| < 1\) and \(\frac{|f(A) - L g(A)|}{|g(x)|}\) small, so \(\left|\frac{f(x)}{g(x)} - L\right| < \varepsilon\). With \(\varepsilon\) arbitrary, \(\frac{f(x)}{g(x)} \to L\) — L'Hôpital's rule for the \(\infty/\infty\) case.`,
        },
      },
      {
        text: {
          ko: String.raw`\(f(x) = \ln x\), \(g(x) = x\)에 적용하면 \(g'(x) = 1 \neq 0\), \(g(x) \to \infty\)이고 \(\frac{f'(x)}{g'(x)} = \frac{1/x}{1} = \frac{1}{x} \to 0\)이다. 따라서 \(\lim_{x \to \infty}\frac{\ln x}{x} = 0\)이다.`,
          en: String.raw`Apply this to \(f(x) = \ln x\) and \(g(x) = x\): \(g'(x) = 1 \neq 0\), \(g(x) \to \infty\), and \(\frac{f'(x)}{g'(x)} = \frac{1/x}{1} = \frac{1}{x} \to 0\). Hence \(\lim_{x \to \infty}\frac{\ln x}{x} = 0\).`,
        },
      },
    ],
  },
  {
    id: 'lhopital-x-log-x',
    statement: {
      ko: String.raw`\(\lim_{x \to 0^+} x \ln x = 0\)을 증명하세요. (힌트: \(\frac{\ln x}{1/x}\) 꼴로 고쳐 쓰세요.)`,
      en: String.raw`Prove \(\lim_{x \to 0^+} x \ln x = 0\). (Hint: rewrite it as \(\frac{\ln x}{1/x}\).)`,
    },
    display: [
      String.raw`x \ln x = \frac{\ln x}{1/x}, \qquad \frac{(\ln x)'}{(1/x)'} = \frac{1/x}{-1/x^2} = -x \xrightarrow[x\to 0^+]{} 0`,
    ],
    preset: { pair: 'ln x / x', pos: 100 },
    presetCaption: {
      ko: String.raw`같은 \(\infty/\infty\) 장치 — \(x = 1000\)에서 \(\frac{\ln x}{x} \approx 0.00691\), \(\frac{1}{x} = 0.001\). \(x\ln x = \frac{\ln x}{1/x}\)로 고치면 \(\frac{f'}{g'} = -x \to 0\) (예: \(x = 0.01\)에서 \(x\ln x \approx -0.0461\), \(-x = -0.01\)).`,
      en: String.raw`The same \(\infty/\infty\) machinery — at \(x = 1000\), \(\frac{\ln x}{x} \approx 0.00691\), \(\frac{1}{x} = 0.001\). Rewriting \(x\ln x = \frac{\ln x}{1/x}\) gives \(\frac{f'}{g'} = -x \to 0\) (e.g. at \(x = 0.01\), \(x\ln x \approx -0.0461\), \(-x = -0.01\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x > 0\)일 때 \(x \ln x = \frac{\ln x}{1/x}\)이다. \(f(x) = \ln x\), \(g(x) = 1/x\)라 두면 \(f(x) \to -\infty\), \(g(x) \to +\infty\)이므로 \(\infty/\infty\) 꼴이고, \(g'(x) = -\frac{1}{x^2} \neq 0\)이다.`,
          en: String.raw`For \(x > 0\), \(x \ln x = \frac{\ln x}{1/x}\). Put \(f(x) = \ln x\) and \(g(x) = 1/x\): then \(f(x) \to -\infty\) and \(g(x) \to +\infty\), an \(\infty/\infty\) form, and \(g'(x) = -\frac{1}{x^2} \neq 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{f'(x)}{g'(x)} = \frac{1/x}{-1/x^2} = -x \xrightarrow[x \to 0^+]{} 0\)이다. 문제 2의 보조정리를 \(x \to 0^+\)에 맞게 (구간 \([x, A]\) (\(0 < x < A\))에 같은 논증을 적용) 쓰면 \(\lim_{x \to 0^+}\frac{\ln x}{1/x} = 0\)을 얻는다.`,
          en: String.raw`\(\frac{f'(x)}{g'(x)} = \frac{1/x}{-1/x^2} = -x \xrightarrow[x \to 0^+]{} 0\). Applying problem 2's lemma adapted to \(x \to 0^+\) (the same argument on \([x, A]\) with \(0 < x < A\)) gives \(\lim_{x \to 0^+}\frac{\ln x}{1/x} = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\lim_{x \to 0^+} x \ln x = 0\)이다. 수치로도 확인된다: \(x = 0.01\)에서 \(x\ln x = 0.01 \cdot \ln 0.01 \approx -0.0461\)이고, 도함수 비율은 \(-x = -0.01\)이며, 둘 다 \(x \to 0^+\)일 때 0으로 간다.`,
          en: String.raw`Hence \(\lim_{x \to 0^+} x \ln x = 0\). The numbers agree: at \(x = 0.01\), \(x\ln x = 0.01 \cdot \ln 0.01 \approx -0.0461\) and the derivative ratio is \(-x = -0.01\), both tending to 0 as \(x \to 0^+\).`,
        },
      },
    ],
  },
];
