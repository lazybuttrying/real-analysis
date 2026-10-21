import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the cauchy-schwarz scene.
 * Imports nothing except types. Imported by the chapter's meta.ts.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'p1-discriminant',
    statement: {
      ko: String.raw`\(\mathbb{R}^n\)에서 코시-슈바르츠 부등식 \(|\langle x,y\rangle| \le \|x\|\,\|y\|\)을 판별식 논법으로 증명하세요.`,
      en: String.raw`Prove the Cauchy–Schwarz inequality \(|\langle x,y\rangle| \le \|x\|\,\|y\|\) in \(\mathbb{R}^n\) by the discriminant argument.`,
    },
    display: [
      String.raw`0 \le \|x-ty\|^2 = \|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2 \qquad (t \in \mathbb{R})`,
      String.raw`\Delta = 4\langle x,y\rangle^2 - 4\|x\|^2\|y\|^2 \le 0`,
    ],
    preset: { angle: 0, showProjection: true },
    presetCaption: {
      ko: String.raw`\(\theta = 0\): \(y = (1,0) \parallel x\)이므로 \(|\langle x,y\rangle| = 3 = \|x\|\,\|y\|\) — 판별식이 \(0\)인 등호 경우가 보인다.`,
      en: String.raw`\(\theta = 0\): \(y = (1,0) \parallel x\), so \(|\langle x,y\rangle| = 3 = \|x\|\,\|y\|\) — the equality case (discriminant \(0\)) is visible.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(y = 0\)이면 양변 모두 \(0\)이므로 자명합니다. \(y \ne 0\)이라 가정합니다.`,
          en: String.raw`If \(y = 0\), both sides are \(0\) and the claim is trivial. Assume \(y \ne 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`모든 실수 \(t\)에 대해 \(0 \le \|x - ty\|^2\)입니다. 내적을 전개하면 \(\|x - ty\|^2 = \langle x - ty, x - ty\rangle = \|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2\)이므로, \(t\)에 대한 이차식 \(\|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2\)은 항상 \(0\) 이상입니다.`,
          en: String.raw`For every real \(t\), \(0 \le \|x - ty\|^2\). Expanding the inner product, \(\|x - ty\|^2 = \langle x - ty, x - ty\rangle = \|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2\), so the quadratic \(\|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2\) in \(t\) is always nonnegative.`,
        },
      },
      {
        text: {
          ko: String.raw`항상 \(0\) 이상인 이차식의 판별식은 \(0\) 이하입니다: \(\Delta = 4\langle x,y\rangle^2 - 4\|y\|^2\|x\|^2 \le 0\). 정리하면 \(\langle x,y\rangle^2 \le \|x\|^2\|y\|^2\), 즉 \(|\langle x,y\rangle| \le \|x\|\,\|y\|\)입니다.`,
          en: String.raw`A quadratic that is always nonnegative has nonpositive discriminant: \(\Delta = 4\langle x,y\rangle^2 - 4\|y\|^2\|x\|^2 \le 0\). Rearranging gives \(\langle x,y\rangle^2 \le \|x\|^2\|y\|^2\), i.e. \(|\langle x,y\rangle| \le \|x\|\,\|y\|\).`,
        },
      },
      {
        text: {
          ko: String.raw`이 판별식 논증은 실수 내적공간에서는 그대로 성립합니다 (위에서는 \(\mathbb{R}^n\)). 복소 경우에는 \(\langle x,y\rangle\) 자체가 아니라 \(\mathrm{Re}\,\langle x,y\rangle\)만 통제되므로 위상 회전이 필요합니다: \(|\alpha| = 1\)이고 \(\langle \alpha x, y\rangle = |\langle x,y\rangle|\) (음이 아닌 실수)인 \(\alpha\)를 고르면 (\(|\langle x,y\rangle| = 0\)이면 자명), \(\alpha x\)에 실수 논증을 적용해 \(|\langle x,y\rangle| = \mathrm{Re}\,\langle \alpha x, y\rangle \le \|\alpha x\|\,\|y\| = \|x\|\,\|y\|\)를 얻습니다. \(\ell^2\)에서는 유한 코시-슈바르츠를 절댓값 수열 \((|x_n|)\), \((|y_n|)\)에 적용합니다: \(\sum_{n\le N} |x_n y_n| \le \left(\sum_{n\le N} |x_n|^2\right)^{1/2}\left(\sum_{n\le N} |y_n|^2\right)^{1/2} \le \|x\|\,\|y\|\)입니다. 음이 아닌 항들의 부분합이 유계이므로 \(\sum_n |x_n y_n|\)이 수렴합니다 — 즉 \(\sum x_n y_n\)이 절대수렴하므로 내적 \(\langle x,y\rangle = \sum_{n=1}^{\infty} x_n y_n\)이 잘 정의됩니다.`,
          en: String.raw`The discriminant argument works verbatim in real inner product spaces (above, \(\mathbb{R}^n\)). In the complex case it controls only \(\mathrm{Re}\,\langle x,y\rangle\), not \(\langle x,y\rangle\) itself, so a phase rotation is needed: choose \(\alpha\) with \(|\alpha| = 1\) and \(\langle \alpha x, y\rangle = |\langle x,y\rangle|\) (a nonnegative real; trivial if \(|\langle x,y\rangle| = 0\)) and apply the real argument to \(\alpha x\), giving \(|\langle x,y\rangle| = \mathrm{Re}\,\langle \alpha x, y\rangle \le \|\alpha x\|\,\|y\| = \|x\|\,\|y\|\). In \(\ell^2\), apply the finite Cauchy–Schwarz to the absolute-value sequences \((|x_n|)\), \((|y_n|)\): \(\sum_{n\le N} |x_n y_n| \le \left(\sum_{n\le N} |x_n|^2\right)^{1/2}\left(\sum_{n\le N} |y_n|^2\right)^{1/2} \le \|x\|\,\|y\|\). The partial sums of nonnegative terms are bounded, so \(\sum_n |x_n y_n|\) converges — i.e. \(\sum x_n y_n\) converges absolutely, and the inner product \(\langle x,y\rangle = \sum_{n=1}^{\infty} x_n y_n\) is well defined.`,
        },
      },
    ],
  },
  {
    id: 'p2-equality',
    statement: {
      ko: String.raw`코시-슈바르츠 부등식에서 등호 \(|\langle x,y\rangle| = \|x\|\,\|y\|\)가 성립할 필요충분조건이 \(x, y\)가 일차종속(linearly dependent)임임을 증명하세요.`,
      en: String.raw`Prove that equality \(|\langle x,y\rangle| = \|x\|\,\|y\|\) in Cauchy–Schwarz holds if and only if \(x\) and \(y\) are linearly dependent.`,
    },
    display: [String.raw`|\langle x,y\rangle| = \|x\|\,\|y\| \iff x,\ y \text{ are linearly dependent}`],
    preset: { angle: Math.PI / 2, showProjection: true },
    presetCaption: {
      ko: String.raw`\(\theta = \pi/2\): \(x \perp y\)이므로 \(\langle x,y\rangle = 0 < 3 = \|x\|\,\|y\|\) — \(x, y\)는 일차독립이고 등호가 성립하지 않는다.`,
      en: String.raw`\(\theta = \pi/2\): \(x \perp y\), so \(\langle x,y\rangle = 0 < 3 = \|x\|\,\|y\|\) — \(x\) and \(y\) are linearly independent and equality fails.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(y = 0\)인 경우는 양변이 \(0\)이어서 등호가 성립하고, \(\{x, 0\}\)은 일차종속이므로 양방향 모두 자명합니다. 이제 \(y \ne 0\)이라 가정합니다.`,
          en: String.raw`If \(y = 0\), both sides are \(0\) so equality holds, and \(\{x, 0\}\) is linearly dependent, making both directions trivial. Assume henceforth \(y \ne 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Leftarrow\)) \(x, y\)가 일차종속이면 \(x = cy\)인 스칼라 \(c\)가 존재합니다. 그러면 \(|\langle x,y\rangle| = |\langle cy,y\rangle| = |c|\,\|y\|^2 = \|cy\|\,\|y\| = \|x\|\,\|y\|\)입니다.`,
          en: String.raw`(\(\Leftarrow\)) If \(x\) and \(y\) are linearly dependent, \(x = cy\) for some scalar \(c\). Then \(|\langle x,y\rangle| = |\langle cy,y\rangle| = |c|\,\|y\|^2 = \|cy\|\,\|y\| = \|x\|\,\|y\|\).`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Rightarrow\)) 등호가 성립하면 판별식 논법의 이차식 \(\|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2\)의 판별식이 \(0\)이므로 실근 \(t_0\)이 존재합니다. 그 근에서 \(0 = \|y\|^2 t_0^2 - 2\langle x,y\rangle t_0 + \|x\|^2 = \|x - t_0 y\|^2\)이므로 \(x = t_0 y\) — 즉 \(x, y\)는 일차종속입니다.`,
          en: String.raw`(\(\Rightarrow\)) If equality holds, the discriminant of the quadratic \(\|y\|^2 t^2 - 2\langle x,y\rangle t + \|x\|^2\) from the discriminant argument is \(0\), so it has a real root \(t_0\). At that root \(0 = \|y\|^2 t_0^2 - 2\langle x,y\rangle t_0 + \|x\|^2 = \|x - t_0 y\|^2\), hence \(x = t_0 y\) — i.e. \(x\) and \(y\) are linearly dependent.`,
        },
      },
    ],
  },
  {
    id: 'p3-triangle',
    statement: {
      ko: String.raw`코시-슈바르츠 부등식의 따름정리로 삼각부등식 \(\|x+y\| \le \|x\| + \|y\|\)을 증명하세요.`,
      en: String.raw`Deduce the triangle inequality \(\|x+y\| \le \|x\| + \|y\|\) as a corollary of Cauchy–Schwarz.`,
    },
    display: [String.raw`\|x+y\|^2 = \|x\|^2 + 2\langle x,y\rangle + \|y\|^2 \le \|x\|^2 + 2\|x\|\,\|y\| + \|y\|^2 = (\|x\| + \|y\|)^2`],
    preset: { angle: Math.PI / 4, showProjection: true },
    presetCaption: {
      ko: String.raw`\(\theta = \pi/4\): \(\|x+y\| \approx 3.7739 < 4 = \|x\| + \|y\|\) — 삼각부등식이 실제로 성립한다.`,
      en: String.raw`\(\theta = \pi/4\): \(\|x+y\| \approx 3.7739 < 4 = \|x\| + \|y\|\) — the triangle inequality in action.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`노름의 제곱을 내적으로 펼치면 \(\|x+y\|^2 = \langle x+y, x+y\rangle = \|x\|^2 + 2\langle x,y\rangle + \|y\|^2\)입니다.`,
          en: String.raw`Expanding the squared norm via the inner product gives \(\|x+y\|^2 = \langle x+y, x+y\rangle = \|x\|^2 + 2\langle x,y\rangle + \|y\|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\langle x,y\rangle \le |\langle x,y\rangle|\)이고, 코시-슈바르츠 부등식으로 \(|\langle x,y\rangle| \le \|x\|\,\|y\|\)이므로 \(\|x+y\|^2 \le \|x\|^2 + 2\|x\|\,\|y\| + \|y\|^2 = (\|x\| + \|y\|)^2\)를 얻습니다.`,
          en: String.raw`Since \(\langle x,y\rangle \le |\langle x,y\rangle|\) and \(|\langle x,y\rangle| \le \|x\|\,\|y\|\) by Cauchy–Schwarz, we get \(\|x+y\|^2 \le \|x\|^2 + 2\|x\|\,\|y\| + \|y\|^2 = (\|x\| + \|y\|)^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`양변에 제곱근을 취하면 \(\|x+y\| \le \|x\| + \|y\|\)입니다.`,
          en: String.raw`Taking square roots of both sides yields \(\|x+y\| \le \|x\| + \|y\|\).`,
        },
      },
    ],
  },
];
