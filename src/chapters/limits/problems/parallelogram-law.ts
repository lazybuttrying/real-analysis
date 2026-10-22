import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the parallelogram-law scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/parallelogram-law.test.ts): at p = 2 the two sides are
 * both 4, and at p = 3 the left side is 2^(5/3), approximately 3.1748,
 * against the right side 4.
 */
export const parallelogramLawProblems: readonly ProblemMeta[] = [
  {
    id: 'inner-product-implies-parallelogram',
    statement: {
      ko: String.raw`실수 내적공간에서 임의의 \(x, y\)에 대해 평행사변형 법칙 \(\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2\)가 성립함을 완전히 증명하세요.`,
      en: String.raw`Prove completely that in a real inner product space, every \(x, y\) satisfies the parallelogram law \(\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2\).`,
    },
    display: [
      String.raw`\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2`,
    ],
    preset: { p: 2, showCircle: true },
    presetCaption: {
      ko: String.raw`\(p = 2\): 유클리드 노름은 내적에서 오며, 좌변 \(= 4 =\) 우변 — 평행사변형 법칙이 성립하는 경우입니다.`,
      en: String.raw`\(p = 2\): the Euclidean norm comes from an inner product, and the left side \(= 4 =\) the right side — the case where the parallelogram law holds.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`합의 노름을 내적으로 전개합니다. 실수 내적공간에서는 \(\|x+y\|^2 = \langle x+y, x+y \rangle\)이고, 쌍선형성과 대칭성으로 \(\langle x+y, x+y \rangle = \langle x, x \rangle + \langle x, y \rangle + \langle y, x \rangle + \langle y, y \rangle = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\)입니다. 즉 \(\|x+y\|^2 = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\)입니다.`,
          en: String.raw`Expand the norm of the sum through the inner product. In a real inner product space \(\|x+y\|^2 = \langle x+y, x+y \rangle\), and bilinearity with symmetry gives \(\langle x+y, x+y \rangle = \langle x, x \rangle + \langle x, y \rangle + \langle y, x \rangle + \langle y, y \rangle = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\). That is, \(\|x+y\|^2 = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`차의 노름도 같은 방법으로 전개합니다. \(\|x-y\|^2 = \langle x-y, x-y \rangle = \langle x, x \rangle - \langle x, y \rangle - \langle y, x \rangle + \langle y, y \rangle = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\)입니다. 즉 \(\|x-y\|^2 = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\)입니다.`,
          en: String.raw`Expand the norm of the difference the same way. \(\|x-y\|^2 = \langle x-y, x-y \rangle = \langle x, x \rangle - \langle x, y \rangle - \langle y, x \rangle + \langle y, y \rangle = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\). That is, \(\|x-y\|^2 = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 식을 더합니다. 교차항은 상쇄됩니다: \(\|x+y\|^2 + \|x-y\|^2 = \left(\|x\|^2 + 2\langle x, y \rangle + \|y\|^2\right) + \left(\|x\|^2 - 2\langle x, y \rangle + \|y\|^2\right) = 2\|x\|^2 + 2\|y\|^2\). 이것이 평행사변형 법칙이며, 증명이 완료됩니다.`,
          en: String.raw`Add the two identities. The cross terms cancel: \(\|x+y\|^2 + \|x-y\|^2 = \left(\|x\|^2 + 2\langle x, y \rangle + \|y\|^2\right) + \left(\|x\|^2 - 2\langle x, y \rangle + \|y\|^2\right) = 2\|x\|^2 + 2\|y\|^2\). This is the parallelogram law, and the proof is complete.`,
        },
      },
      {
        text: {
          ko: String.raw`참고: 이것은 실수 경우입니다. 복소 내적공간에서도 같은 전개로 법칙 자체는 성립하지만, 아래 문제 3의 극화 항등식은 \(\mathrm{Re}\)를 쓰는 형태로 바뀝니다 — 여기서는 필요하지 않습니다.`,
          en: String.raw`Remark: this is the real case. The law itself also holds in complex inner product spaces by the same expansion, but the polarization identity in problem 3 below changes to a form using \(\mathrm{Re}\) there — not needed here.`,
        },
      },
    ],
  },
  {
    id: 'lp-counterexample',
    statement: {
      ko: String.raw`\(\ell^p(\mathbb{R}^2)\)의 \(e_1 = (1,0)\), \(e_2 = (0,1)\)에 대해 평행사변형 법칙의 양변을 계산하고, 등식이 성립하는 경우가 \(p = 2\)뿐임을 완전히 증명하세요. 따라서 \(p \ne 2\)이면 \(\ell^p\) 노름은 어떤 내적에서도 나오지 않습니다.`,
      en: String.raw`For \(e_1 = (1,0)\) and \(e_2 = (0,1)\) in \(\ell^p(\mathbb{R}^2)\), compute both sides of the parallelogram law and prove completely that equality holds only when \(p = 2\). Conclude that for \(p \ne 2\) the \(\ell^p\) norm is not induced by any inner product.`,
    },
    display: [
      String.raw`\|e_1+e_2\|_p^2 + \|e_1-e_2\|_p^2 = 2^{1 + 2/p}, \qquad 2\|e_1\|_p^2 + 2\|e_2\|_p^2 = 4 = 2^2`,
    ],
    preset: { p: 3, showCircle: true },
    presetCaption: {
      ko: String.raw`\(p = 3\): 좌변 \(= 2^{5/3} \approx 3.1748\), 우변 \(= 4\) — 평행사변형 법칙이 눈에 보이게 깨집니다.`,
      en: String.raw`\(p = 3\): the left side \(= 2^{5/3} \approx 3.1748\), the right side \(= 4\) — the parallelogram law visibly fails.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 각 노름을 계산합니다. \(e_1 + e_2 = (1,1)\)이므로 \(\|e_1+e_2\|_p = \left(|1|^p + |1|^p\right)^{1/p} = 2^{1/p}\)이고, 제곱하면 \(\|e_1+e_2\|_p^2 = \left(2^{1/p}\right)^2 = 2^{2/p}\)입니다. 마찬가지로 \(e_1 - e_2 = (1,-1)\)이므로 \(\|e_1-e_2\|_p = \left(|1|^p + |-1|^p\right)^{1/p} = 2^{1/p}\)이고 \(\|e_1-e_2\|_p^2 = 2^{2/p}\)입니다.`,
          en: String.raw`Compute each norm first. Since \(e_1 + e_2 = (1,1)\), \(\|e_1+e_2\|_p = \left(|1|^p + |1|^p\right)^{1/p} = 2^{1/p}\), and squaring gives \(\|e_1+e_2\|_p^2 = \left(2^{1/p}\right)^2 = 2^{2/p}\). Likewise \(e_1 - e_2 = (1,-1)\), so \(\|e_1-e_2\|_p = \left(|1|^p + |-1|^p\right)^{1/p} = 2^{1/p}\) and \(\|e_1-e_2\|_p^2 = 2^{2/p}\).`,
        },
      },
      {
        text: {
          ko: String.raw`양변을 모읍니다. 좌변은 \(\|e_1+e_2\|_p^2 + \|e_1-e_2\|_p^2 = 2^{2/p} + 2^{2/p} = 2 \cdot 2^{2/p} = 2^{1 + 2/p}\)입니다. 한편 \(\|e_1\|_p = \|e_2\|_p = 1\)이므로 우변은 \(2\|e_1\|_p^2 + 2\|e_2\|_p^2 = 2 \cdot 1 + 2 \cdot 1 = 4 = 2^2\)입니다. 따라서 등식은 \(2^{1 + 2/p} = 2^2\)와 동치입니다.`,
          en: String.raw`Collect both sides. The left side is \(\|e_1+e_2\|_p^2 + \|e_1-e_2\|_p^2 = 2^{2/p} + 2^{2/p} = 2 \cdot 2^{2/p} = 2^{1 + 2/p}\). Meanwhile \(\|e_1\|_p = \|e_2\|_p = 1\), so the right side is \(2\|e_1\|_p^2 + 2\|e_2\|_p^2 = 2 \cdot 1 + 2 \cdot 1 = 4 = 2^2\). Hence equality is equivalent to \(2^{1 + 2/p} = 2^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Rightarrow)\) 등식 \(2^{1 + 2/p} = 2^2\)가 성립한다고 가정합니다. 함수 \(t \mapsto 2^t\)는 단사이므로 지수가 같아야 합니다: \(1 + 2/p = 2\). 따라서 \(2/p = 1\), 즉 \(p = 2\)입니다.`,
          en: String.raw`\((\Rightarrow)\) Suppose equality \(2^{1 + 2/p} = 2^2\) holds. The map \(t \mapsto 2^t\) is injective, so the exponents must agree: \(1 + 2/p = 2\). Hence \(2/p = 1\), i.e. \(p = 2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) 반대로 \(p = 2\)라고 가정합니다. 그러면 \(1 + 2/p = 1 + 1 = 2\)이므로 좌변은 \(2^{1 + 2/p} = 2^2 = 4\)이고, 이는 우변 \(4\)와 직접 같습니다. 즉 등식이 성립합니다.`,
          en: String.raw`\((\Leftarrow)\) Conversely, suppose \(p = 2\). Then \(1 + 2/p = 1 + 1 = 2\), so the left side is \(2^{1 + 2/p} = 2^2 = 4\), directly equal to the right side \(4\). Hence equality holds.`,
        },
      },
      {
        text: {
          ko: String.raw`결론: \(p \ne 2\)이면 \(\ell^p\) 노름은 평행사변형 법칙을 어깁니다. 문제 1에서 내적에서 온 노름은 항상 이 법칙을 만족하므로, 요르단-폰 노이만 정리에 의해 \(p \ne 2\)인 \(\ell^p\) 노름은 어떤 내적에서도 유도될 수 없습니다.`,
          en: String.raw`Conclusion: for \(p \ne 2\) the \(\ell^p\) norm violates the parallelogram law. Since problem 1 shows that every inner-product norm satisfies the law, by the Jordan-von Neumann theorem the \(\ell^p\) norm for \(p \ne 2\) is not induced by any inner product.`,
        },
      },
    ],
  },
  {
    id: 'polarization-identity',
    statement: {
      ko: String.raw`실수 내적공간에서 극화 항등식 \(\langle x, y \rangle = \frac{\|x+y\|^2 - \|x-y\|^2}{4}\)가 성립함을 완전히 검증하세요.`,
      en: String.raw`Verify completely that in a real inner product space the polarization identity \(\langle x, y \rangle = \frac{\|x+y\|^2 - \|x-y\|^2}{4}\) holds.`,
    },
    display: [
      String.raw`\langle x, y \rangle = \frac{\|x+y\|^2 - \|x-y\|^2}{4}`,
    ],
    preset: { p: 2, showCircle: true },
    presetCaption: {
      ko: String.raw`\(p = 2\): 평행사변형 법칙이 성립하는 유클리드 경우 — 극화 항등식으로 노름에서 내적을 되읽을 수 있습니다.`,
      en: String.raw`\(p = 2\): the Euclidean case, where the parallelogram law holds — the polarization identity reads the inner product back off the norm.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`문제 1의 전개를 다시 씁니다: \(\|x+y\|^2 = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\)이고 \(\|x-y\|^2 = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\)입니다.`,
          en: String.raw`Reuse the expansions from problem 1: \(\|x+y\|^2 = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2\) and \(\|x-y\|^2 = \|x\|^2 - 2\langle x, y \rangle + \|y\|^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 식을 뺍니다. \(\|x\|^2\) 항과 \(\|y\|^2\) 항은 사라지고 교차항만 남습니다: \(\|x+y\|^2 - \|x-y\|^2 = \left(\|x\|^2 + 2\langle x, y \rangle + \|y\|^2\right) - \left(\|x\|^2 - 2\langle x, y \rangle + \|y\|^2\right) = 4\langle x, y \rangle\)입니다.`,
          en: String.raw`Subtract the two identities. The \(\|x\|^2\) and \(\|y\|^2\) terms disappear and only the cross terms survive: \(\|x+y\|^2 - \|x-y\|^2 = \left(\|x\|^2 + 2\langle x, y \rangle + \|y\|^2\right) - \left(\|x\|^2 - 2\langle x, y \rangle + \|y\|^2\right) = 4\langle x, y \rangle\).`,
        },
      },
      {
        text: {
          ko: String.raw`양변을 \(4\)로 나누면 \(\frac{\|x+y\|^2 - \|x-y\|^2}{4} = \langle x, y \rangle\) — 극화 항등식이 검증됩니다. 즉 내적은 노름만으로 완전히 결정됩니다.`,
          en: String.raw`Divide both sides by \(4\): \(\frac{\|x+y\|^2 - \|x-y\|^2}{4} = \langle x, y \rangle\) — the polarization identity is verified. The inner product is completely determined by the norm alone.`,
        },
      },
      {
        text: {
          ko: String.raw`요르단-폰 노이만 정리에 따르면, 노름이 평행사변형 법칙을 만족할 때마다 바로 이 식이 내적을 정의합니다 (진술만 둡니다).`,
          en: String.raw`By the Jordan-von Neumann theorem, whenever a norm satisfies the parallelogram law, this very formula defines an inner product for it (statement only).`,
        },
      },
    ],
  },
];
