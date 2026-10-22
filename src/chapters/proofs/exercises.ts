import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 증명의 기초 (Foundations of Proof) chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'quantifier-negation-game',
    difficulty: 1,
    topics: ['quantifiers'],
    statement: {
      ko: String.raw`명제 \(\forall x \in \mathbb{R}\ \exists y \in \mathbb{R}\ (y^2 > x)\)의 부정을 완전히 쓰세요 (양화사를 하나씩 뒤집어 가며).

그 다음 원래 명제와 그 부정 중 어느 것이 참인지 증명하세요.`,
      en: String.raw`Write the full negation of the statement \(\forall x \in \mathbb{R}\ \exists y \in \mathbb{R}\ (y^2 > x)\) (flip one quantifier at a time).

Then prove which of the statement and its negation is true.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`부정은 차례로 뒤집어 얻습니다: \(\lnot\big(\forall x\ \exists y\ (y^2 > x)\big)\)에서 전칭이 존재로, 존재가 전칭으로, 부등식이 반대로 뒤집혀 아래 식이 됩니다.`,
          en: String.raw`The negation comes from flipping in turn: \(\lnot\big(\forall x\ \exists y\ (y^2 > x)\big)\) turns the universal into an existential, the existential into a universal, and reverses the inequality, giving the formula below.`,
        },
        display: [String.raw`\exists x \in \mathbb{R}\ \forall y \in \mathbb{R}\ (y^2 \le x)`],
      },
      {
        text: {
          ko: String.raw`원래 명제가 참입니다.

\(x\)가 주어지면 \(y = x + 1\)이라 두면 \(y^2 = x^2 + 2x + 1\)이고, \(y^2 - x = x^2 + x + 1 = \left(x + \frac12\right)^2 + \frac34 > 0\)이므로 \(y^2 > x\)입니다. 따라서 부정은 거짓입니다.`,
          en: String.raw`The original statement is true.

Given \(x\), take \(y = x + 1\): then \(y^2 = x^2 + 2x + 1\), and \(y^2 - x = x^2 + x + 1 = \left(x + \frac12\right)^2 + \frac34 > 0\), so \(y^2 > x\). Hence the negation is false.`,
        },
      },
    ],
  },
  {
    id: 'odd-times-odd',
    difficulty: 1,
    topics: ['direct-proof'],
    statement: {
      ko: String.raw`두 홀수 정수의 곱이 홀수임을 직접증명으로 증명하세요.`,
      en: String.raw`Prove by direct proof that the product of two odd integers is odd.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`홀수 \(m, n\)을 가정합니다. 정의에 의해 \(m = 2a + 1\), \(n = 2b + 1\)인 정수 \(a, b\)가 존재합니다. 곱하면 아래 식을 얻습니다.

\(2ab + a + b\)는 정수이므로 \(mn\)은 \(2k + 1\) 꼴 — 즉 홀수입니다. 가정에서 바로 결론에 도달했으므로 직접증명입니다.`,
          en: String.raw`Assume \(m, n\) are odd. By definition there are integers \(a, b\) with \(m = 2a + 1\) and \(n = 2b + 1\). Multiplying gives the formula below.

Since \(2ab + a + b\) is an integer, \(mn\) has the form \(2k + 1\) — i.e. it is odd. We reached the conclusion directly from the hypothesis, so this is a direct proof.`,
        },
        display: [String.raw`mn = (2a+1)(2b+1) = 4ab + 2a + 2b + 1 = 2(2ab + a + b) + 1`],
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'contrapositive-five-n-plus-four',
    difficulty: 2,
    topics: ['contrapositive'],
    statement: {
      ko: String.raw`\(5n + 4\)가 짝수이면 \(n\)이 짝수임을 대우법으로 증명하세요.

왜 직접증명(가정 \(5n+4\) 짝수에서 시작)이 어색한지도 설명하세요.`,
      en: String.raw`Prove by contrapositive that if \(5n + 4\) is even then \(n\) is even.

Also explain why a direct proof (starting from the assumption that \(5n+4\) is even) is awkward.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`대우는 "\(n\)이 홀수이면 \(5n+4\)가 홀수이다"입니다. \(n\)이 홀수라 가정하면 \(n = 2k+1\)인 정수 \(k\)가 존재합니다.

대입하면 아래 식을 얻으므로 \(5n+4\)는 홀수입니다. 따라서 대우가 성립하고, 대우와 원래 명제는 동치이므로 "\(5n+4\) 짝수 \(\Rightarrow\) \(n\) 짝수"가 증명됩니다.`,
          en: String.raw`The contrapositive is "if \(n\) is odd then \(5n+4\) is odd". Assume \(n\) is odd, so \(n = 2k+1\) for an integer \(k\).

Substituting gives the formula below, so \(5n+4\) is odd. Thus the contrapositive holds, and since a statement is equivalent to its contrapositive, "\(5n+4\) even \(\Rightarrow\) \(n\) even" is proved.`,
        },
        display: [String.raw`5n + 4 = 5(2k+1) + 4 = 10k + 9 = 2(5k+4) + 1`],
      },
      {
        text: {
          ko: String.raw`직접증명이 어색한 이유: 가정 "\(5n+4\)가 짝수"는 \(5n + 4 = 2m\)이라는 식을 주지만, 여기서 \(n\) 자체의 홀짝을 읽어낼 직접적인 계산이 없습니다 — \(5n\)이 짝수인지 아닌지를 알려면 \(n\)의 홀짝을 알아야 하는데 그것이 바로 증명하려는 것입니다. 대우법은 홀수라는 구체적 형태 \(n = 2k+1\)을 손에 쥐여 주어 계산이 굴러갑니다.`,
          en: String.raw`Why the direct route is awkward: the hypothesis "\(5n+4\) is even" gives the equation \(5n + 4 = 2m\) but no direct computation that reads off the parity of \(n\) — deciding whether \(5n\) is even already needs the parity of \(n\), which is what we want to prove. The contrapositive hands us the concrete form \(n = 2k+1\), so the computation can run.`,
        },
      },
    ],
  },
  {
    id: 'no-smallest-positive-real',
    difficulty: 2,
    topics: ['contradiction'],
    statement: {
      ko: String.raw`양의 실수 중 가장 작은 것이 존재하지 않음을 귀류법으로 증명하세요.`,
      en: String.raw`Prove by contradiction that there is no smallest positive real number.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`부정을 가정합니다: 가장 작은 양의 실수 \(m\)이 존재한다고 하세요. 그러면 모든 양의 실수 \(x\)에 대해 \(x \ge m\)입니다.`,
          en: String.raw`Assume the negation: there is a smallest positive real number \(m\). Then \(x \ge m\) for every positive real \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(m/2\)는 양의 실수이고 \(m/2 < m\)입니다 (\(m > 0\)이므로). 이는 "\(m\)이 가장 작다"는 가정에 모순됩니다. 따라서 가정은 거짓 — 가장 작은 양의 실수는 존재하지 않습니다.`,
          en: String.raw`But \(m/2\) is a positive real number with \(m/2 < m\) (since \(m > 0\)). This contradicts the assumption that \(m\) is the smallest. Hence the assumption is false — no smallest positive real number exists.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'postage-stamps',
    difficulty: 3,
    topics: ['strong-induction'],
    statement: {
      ko: String.raw`3원짜리 우표와 5원짜리 우표만으로 \(n \ge 8\)인 모든 정수 금액을 만들 수 있음 — 즉 \(n = 3a + 5b\) (\(a, b \ge 0\)인 정수)를 만족하는 \(a, b\)가 존재함 — 을 강한 귀납법으로 증명하세요.

왜 밑바닥 경우가 세 개 필요한지 설명하세요.`,
      en: String.raw`Prove by strong induction that every integer amount \(n \ge 8\) can be formed with 3-unit and 5-unit stamps — i.e. there exist integers \(a, b \ge 0\) with \(n = 3a + 5b\).

Explain why three base cases are needed.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`밑바닥 경우 세 개를 직접 확인합니다: \(8 = 3 + 5\) (\(a = b = 1\)), \(9 = 3 \cdot 3\) (\(a = 3, b = 0\)), \(10 = 2 \cdot 5\) (\(a = 0, b = 2\)).`,
          en: String.raw`Check three base cases directly: \(8 = 3 + 5\) (\(a = b = 1\)), \(9 = 3 \cdot 3\) (\(a = 3, b = 0\)), \(10 = 2 \cdot 5\) (\(a = 0, b = 2\)).`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(n \ge 11\)이라 하고, \(8 \le k \le n-1\)인 모든 \(k\)에 대해 주장이 성립한다고 가정합니다 (강한 귀납법 가정). 그러면 \(n - 3 \ge 8\)이고 \(n - 3 \le n - 1\)이므로 가정에 의해 \(n - 3 = 3a + 5b\)인 \(a, b \ge 0\)이 존재합니다.

양변에 3을 더하면 \(n = 3(a+1) + 5b\) — 3원짜리 우표 하나를 추가하면 됩니다. 따라서 주장에 의해 모든 \(n \ge 8\)이 표현됩니다.`,
          en: String.raw`Inductive step: let \(n \ge 11\) and assume the claim holds for every \(k\) with \(8 \le k \le n-1\) (the strong induction hypothesis). Then \(n - 3 \ge 8\) and \(n - 3 \le n - 1\), so by the hypothesis there are \(a, b \ge 0\) with \(n - 3 = 3a + 5b\).

Adding 3 to both sides gives \(n = 3(a+1) + 5b\) — add one 3-unit stamp. Hence every \(n \ge 8\) is representable.`,
        },
      },
      {
        text: {
          ko: String.raw`밑바닥 경우가 세 개 필요한 이유: 귀납 단계가 \(n\)에서 \(n - 3\)으로 세 칸 뒤로 점프하므로, 단계가 처음 발을 디딜 수 있는 \(n = 11, 12, 13\)을 커버하려면 \(8, 9, 10\)이 모두 필요합니다. 약한 귀납법(\(P(n-1)\)만 가정)으로는 \(n-3\)에 닿을 수 없어 불가능합니다.`,
          en: String.raw`Why three base cases: the inductive step jumps three back, from \(n\) to \(n - 3\), so to cover \(n = 11, 12, 13\) where the step first applies, all of \(8, 9, 10\) are needed. Weak induction (assuming only \(P(n-1)\)) cannot reach \(n - 3\), so the strong form is essential.`,
        },
      },
    ],
  },
  {
    id: 'circles-equivalence',
    difficulty: 3,
    topics: ['relations-equivalence'],
    statement: {
      ko: String.raw`\(\mathbb{R}^2\) 위의 관계 \((a, b) \sim (c, d) \iff a^2 + b^2 = c^2 + d^2\)가 동치관계임을 증명하고, 각 동치류가 원점을 중심으로 하는 원 (원점의 동치류는 원점 하나) 임을 보이세요.`,
      en: String.raw`Prove that the relation \((a, b) \sim (c, d) \iff a^2 + b^2 = c^2 + d^2\) on \(\mathbb{R}^2\) is an equivalence relation, and show that each equivalence class is a circle centered at the origin (the class of the origin being the single point itself).`,
    },
    solution: [
      {
        text: {
          ko: String.raw`세 공리를 확인합니다. 반사성: \(a^2 + b^2 = a^2 + b^2\)이므로 \((a,b) \sim (a,b)\). 대칭성: \(a^2 + b^2 = c^2 + d^2\)이면 \(c^2 + d^2 = a^2 + b^2\)이므로 \((c,d) \sim (a,b)\).

추이성: \((a,b) \sim (c,d)\)이고 \((c,d) \sim (e,f)\)이면 \(a^2+b^2 = c^2+d^2 = e^2+f^2\)이므로 \((a,b) \sim (e,f)\). 따라서 \(\sim\)은 동치관계입니다.`,
          en: String.raw`Check the three axioms. Reflexivity: \(a^2 + b^2 = a^2 + b^2\), so \((a,b) \sim (a,b)\). Symmetry: \(a^2 + b^2 = c^2 + d^2\) implies \(c^2 + d^2 = a^2 + b^2\), so \((c,d) \sim (a,b)\).

Transitivity: \((a,b) \sim (c,d)\) and \((c,d) \sim (e,f)\) give \(a^2+b^2 = c^2+d^2 = e^2+f^2\), so \((a,b) \sim (e,f)\). Hence \(\sim\) is an equivalence relation.`,
        },
      },
      {
        text: {
          ko: String.raw`점 \((a, b)\)의 동치류는 \([(a,b)] = \{(c,d) : c^2 + d^2 = a^2 + b^2\}\)입니다.

\(r = \sqrt{a^2+b^2} \ge 0\)이라 두면 이는 원점을 중심으로 반지름이 \(r\)인 원 \(c^2 + d^2 = r^2\)입니다. \((a,b) = (0,0)\)이면 \(r = 0\)이라 동치류는 \(\{(0,0)\}\) 하나뿐입니다.`,
          en: String.raw`The class of \((a, b)\) is \([(a,b)] = \{(c,d) : c^2 + d^2 = a^2 + b^2\}\).

With \(r = \sqrt{a^2+b^2} \ge 0\) this is the circle \(c^2 + d^2 = r^2\) of radius \(r\) centered at the origin. For \((a,b) = (0,0)\) we get \(r = 0\), so the class is the single point \(\{(0,0)\}\).`,
        },
      },
      {
        text: {
          ko: String.raw`분할 정리에 의해 \(\mathbb{R}^2\)는 서로 겹치지 않는 동심원들의 모음으로 나뉩니다 — 반지름 \(r \ge 0\)마다 정확히 하나의 동치류가 있고, 서로 다른 반지름의 원은 만나지 않으며, 모든 점이 정확히 하나의 원 위에 있습니다.`,
          en: String.raw`By the partition theorem, \(\mathbb{R}^2\) splits into a family of pairwise disjoint concentric circles — one class for each radius \(r \ge 0\), circles of different radii never meet, and every point lies on exactly one of them.`,
        },
      },
    ],
  },
];
