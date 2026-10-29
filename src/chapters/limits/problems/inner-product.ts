import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the inner-product scene.
 * Imports nothing except types. Numbers verified against the model
 * (tests/inner-product.test.ts): <(1, 2), (3, -1)> = 1.
 */
export const innerProductProblems: readonly ProblemMeta[] = [
  {
    id: 'dot-compute-angle',
    statement: {
      ko: String.raw`\(x = (1, 2)\), \(y = (3, -1)\)에 대해 \(\langle x, y \rangle\), \(\|x\|\), \(\|y\|\), 그리고 두 벡터 사이 각도의 코사인을 계산하세요. 두 벡터는 수직입니까?`,
      en: String.raw`For \(x = (1, 2)\) and \(y = (3, -1)\), compute \(\langle x, y \rangle\), \(\|x\|\), \(\|y\|\), and the cosine of the angle between them. Are the vectors perpendicular?`,
    },
    display: [
      String.raw`\langle x, y \rangle = x_1 y_1 + x_2 y_2, \qquad \cos\theta = \frac{\langle x, y \rangle}{\|x\| \, \|y\|}`,
    ],
    preset: { x1: 1, x2: 2, y1: 3, y2: -1 },
    presetCaption: {
      ko: String.raw`문제의 두 벡터 그대로입니다.`,
      en: String.raw`Exactly the two vectors from the problem.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\langle x, y \rangle = 1 \cdot 3 + 2 \cdot (-1) = 3 - 2 = 1\)입니다.`,
          en: String.raw`\(\langle x, y \rangle = 1 \cdot 3 + 2 \cdot (-1) = 3 - 2 = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\|x\| = \sqrt{1^2 + 2^2} = \sqrt{5}\)이고, \(\|y\| = \sqrt{3^2 + (-1)^2} = \sqrt{10}\)입니다.`,
          en: String.raw`\(\|x\| = \sqrt{1^2 + 2^2} = \sqrt{5}\) and \(\|y\| = \sqrt{3^2 + (-1)^2} = \sqrt{10}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\cos\theta = \frac{1}{\sqrt{5} \cdot \sqrt{10}} = \frac{1}{\sqrt{50}} = \frac{1}{5\sqrt{2}} \approx 0.1414\)입니다. 내적이 0이 아니므로 두 벡터는 수직이 아닙니다. 양수라 예각입니다.`,
          en: String.raw`\(\cos\theta = \frac{1}{\sqrt{5} \cdot \sqrt{10}} = \frac{1}{\sqrt{50}} = \frac{1}{5\sqrt{2}} \approx 0.1414\). The inner product is not 0, so the vectors are not perpendicular. It is positive, so the angle is acute.`,
        },
      },
    ],
  },
  {
    id: 'dot-satisfies-axioms',
    statement: {
      ko: String.raw`\(\mathbb{R}^2\)의 표준 내적 \(\langle x, y \rangle = x_1 y_1 + x_2 y_2\)가 내적의 세 공리 (대칭성, 한쪽 슬롯에서의 선형성, 양의 정부호성)를 만족함을 완전히 증명하세요.`,
      en: String.raw`Prove completely that the standard inner product \(\langle x, y \rangle = x_1 y_1 + x_2 y_2\) on \(\mathbb{R}^2\) satisfies the three inner-product axioms: symmetry, linearity in one slot, and positive definiteness.`,
    },
    display: [String.raw`\langle x, y \rangle = x_1 y_1 + x_2 y_2`],
    preset: { x1: 1, x2: 0, y1: 0, y2: 1 },
    presetCaption: {
      ko: String.raw`\(e_1, e_2\) — 내적이 0인 수직 쌍입니다.`,
      en: String.raw`\(e_1, e_2\) — a perpendicular pair with inner product 0.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`대칭성: 실수의 곱은 교환적이므로 \(\langle y, x \rangle = y_1 x_1 + y_2 x_2 = x_1 y_1 + x_2 y_2 = \langle x, y \rangle\)입니다.`,
          en: String.raw`Symmetry: multiplication of reals commutes, so \(\langle y, x \rangle = y_1 x_1 + y_2 x_2 = x_1 y_1 + x_2 y_2 = \langle x, y \rangle\).`,
        },
      },
      {
        text: {
          ko: String.raw`선형성: \(x, x', y\)와 실수 \(a\)에 대해 \(\langle a x + x', y \rangle = (a x_1 + x_1') y_1 + (a x_2 + x_2') y_2 = a (x_1 y_1 + x_2 y_2) + (x_1' y_1 + x_2' y_2) = a \langle x, y \rangle + \langle x', y \rangle\)입니다. 분배법칙만으로 됩니다.`,
          en: String.raw`Linearity: for \(x, x', y\) and real \(a\), \(\langle a x + x', y \rangle = (a x_1 + x_1') y_1 + (a x_2 + x_2') y_2 = a (x_1 y_1 + x_2 y_2) + (x_1' y_1 + x_2' y_2) = a \langle x, y \rangle + \langle x', y \rangle\). Just the distributive law.`,
        },
      },
      {
        text: {
          ko: String.raw`양의 정부호성: \(\langle x, x \rangle = x_1^2 + x_2^2 \ge 0\)이고, 제곱합이 0인 경우는 \(x_1 = x_2 = 0\)일 때뿐입니다. 세 공리가 모두 성립하므로 표준 내적은 내적입니다.`,
          en: String.raw`Positive definiteness: \(\langle x, x \rangle = x_1^2 + x_2^2 \ge 0\), and the sum of squares is 0 only when \(x_1 = x_2 = 0\). All three axioms hold, so the standard inner product is an inner product.`,
        },
      },
    ],
  },
  {
    id: 'polarization-identity',
    statement: {
      ko: String.raw`실수 내적공간에서 극화 항등식 \(\langle x, y \rangle = \frac{\|x + y\|^2 - \|x - y\|^2}{4}\)가 성립함을 완전히 증명하세요.`,
      en: String.raw`Prove completely that in a real inner product space, the polarization identity \(\langle x, y \rangle = \frac{\|x + y\|^2 - \|x - y\|^2}{4}\) holds.`,
    },
    display: [
      String.raw`\langle x, y \rangle = \frac{\|x + y\|^2 - \|x - y\|^2}{4}`,
    ],
    preset: { x1: 1, x2: 1, y1: 1, y2: 0 },
    presetCaption: {
      ko: String.raw`\(x = (1, 1)\), \(y = (1, 0)\) — \(\|x + y\|^2 = 8\), \(\|x - y\|^2 = 4\)라 내적은 1입니다.`,
      en: String.raw`\(x = (1, 1)\), \(y = (1, 0)\) — \(\|x + y\|^2 = 8\) and \(\|x - y\|^2 = 4\), so the inner product is 1.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`노름을 내적으로 전개합니다: \(\|x + y\|^2 = \langle x + y, x + y \rangle = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\)이고, 마찬가지로 \(\|x - y\|^2 = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\)입니다.`,
          en: String.raw`Expand the norms through the inner product: \(\|x + y\|^2 = \langle x + y, x + y \rangle = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\), and likewise \(\|x - y\|^2 = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 식을 빼면 노름 항이 상쇄됩니다: \(\|x + y\|^2 - \|x - y\|^2 = 4\langle x, y \rangle\).`,
          en: String.raw`Subtracting, the norm terms cancel: \(\|x + y\|^2 - \|x - y\|^2 = 4\langle x, y \rangle\).`,
        },
      },
      {
        text: {
          ko: String.raw`4로 나누면 극화 항등식이 됩니다. 내적은 노름만으로 완전히 복원됩니다 — 노름이 내적을 결정한다는 뜻입니다.`,
          en: String.raw`Dividing by 4 gives the polarization identity. The inner product is fully recovered from the norm alone — the norm determines the inner product.`,
        },
      },
    ],
  },
];
