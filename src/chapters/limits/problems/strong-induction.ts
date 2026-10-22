import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the strong-induction scene.
 *
 * Every number below was verified against the model
 * (tests/strong-induction.test.ts): factorize(30) = [2, 3, 5] with product
 * 30; factorize(36) = [2, 2, 3, 3] with product 36; the postage-stamp claims
 * 30 = 5·4 + 2·5 = 20 + 10, 12 = 3·4, 13 = 2·4 + 5, 14 = 4 + 2·5, 15 = 3·5.
 */
export const strongInductionProblems: readonly ProblemMeta[] = [
  {
    id: 'strong-induction-prime-factorization',
    statement: {
      ko: String.raw`강한 귀납법으로 증명하세요: 2 이상의 모든 정수는 소수들의 곱이다. \(n\)이 소수인 경우와 합성수인 경우(\(n = a \cdot b\), \(1 < a, b < n\))를 나누고, 약한 귀납 단계(“\(P(n-1)\)을 가정하고 \(P(n)\)을 증명”)가 정확히 어디에서 막히는지 짚으세요 (\(n\)의 인자 \(a, b\)는 보통 \(n-1\) 근처에 있지 않으므로 \(P(n-1)\)이 그들에 대해 아무 말도 하지 못합니다).`,
      en: String.raw`Prove by strong induction that every integer \(n \ge 2\) is a product of primes. Split into the cases where \(n\) is prime and where \(n = a \cdot b\) is composite (\(1 < a, b < n\)), and pinpoint exactly where the weak-induction step ("assume \(P(n-1)\), prove \(P(n)\)") breaks down: the factors \(a, b\) of \(n\) are typically nowhere near \(n - 1\), so \(P(n-1)\) says nothing about them.`,
    },
    display: [
      String.raw`P(n):\ n\ \text{is a product of primes},\qquad n \ge 2`,
      String.raw`\text{assume } P(2), \dots, P(n-1);\quad \text{prove } P(n)`,
    ],
    preset: { n: 30 },
    presetCaption: {
      ko: String.raw`\(n = 30 = 2 \times 3 \times 5\): 합성수, 첫 분기 \(a = 2\), \(b = 15\) — \(n-1 = 29\)와 무관한 위치.`,
      en: String.raw`\(n = 30 = 2 \times 3 \times 5\): composite, first split \(a = 2\), \(b = 15\) — nowhere near \(n-1 = 29\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`강한 귀납 가정을 세웁니다: 어떤 \(n \ge 2\)에 대해, \(2 \le k < n\)인 모든 \(k\)에 대해 \(P(k)\)가 참이라 가정합니다 — 즉 \(k\)는 소수들의 곱입니다. \(n\)에 대해 \(P(n)\)을 증명합니다.`,
          en: String.raw`Set up the strong-induction hypothesis: for some \(n \ge 2\), assume \(P(k)\) holds for every \(2 \le k < n\) — i.e. each such \(k\) is a product of primes. Prove \(P(n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`경우 1: \(n\)이 소수. 그러면 \(n\)은 그 자체로 “소수들의 곱”(인자가 하나인 곱)입니다.

이것이 밑에 해당하는 경우이며, 증명할 것이 없습니다.`,
          en: String.raw`Case 1: \(n\) is prime. Then \(n\) is itself a "product of primes" (a product with one factor).

This is the base-like case; there is nothing to prove.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 2: \(n\)이 합성수. 그러면 \(n = a \cdot b\)인 \(1 < a, b < n\)이 존재합니다. \(a < n\)이므로 강한 귀납 가정 \(P(a)\)가 적용되어 \(a = p_1 \cdots p_r\)은 소수들의 곱이고, 마찬가지로 \(b = q_1 \cdots q_s\)도 소수들의 곱입니다.

따라서 \(n = p_1 \cdots p_r \cdot q_1 \cdots q_s\) — 소수들의 곱입니다. \(P(n)\)이 증명되었습니다.`,
          en: String.raw`Case 2: \(n\) is composite. Then \(n = a \cdot b\) for some \(1 < a, b < n\). Since \(a < n\), the strong hypothesis \(P(a)\) applies and gives \(a = p_1 \cdots p_r\) as a product of primes; likewise \(b = q_1 \cdots q_s\).

Hence \(n = p_1 \cdots p_r \cdot q_1 \cdots q_s\) — a product of primes. This proves \(P(n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`약한 귀납이 막히는 지점: 약한 귀납은 \(P(n-1)\) 하나만 제공합니다. 그러나 \(n = 30\)의 경우 필요한 것은 \(P(29)\)가 아니라 \(P(2)\)와 \(P(15)\)입니다 — 인자 \(a = 2\), \(b = 15\)가 \(n-1 = 29\) 근처에 전혀 있지 않기 때문입니다.

\(P(n-1)\)은 \(a\)와 \(b\)에 대해 아무 것도 말해주지 못하므로, 약한 귀납 단계는 진행할 수 없습니다. 강한 가정이 “\(n\)보다 작은 모든 수”를 커버하기 때문에 이 증명이 돌아갑니다.`,
          en: String.raw`Where weak induction stalls: weak induction supplies only \(P(n-1)\). But for \(n = 30\) what is needed is not \(P(29)\) — it is \(P(2)\) and \(P(15)\), because the factors \(a = 2\), \(b = 15\) are nowhere near \(n - 1 = 29\).

The hypothesis \(P(n-1)\) says nothing about \(a\) and \(b\), so the weak step cannot proceed. The proof works precisely because the strong hypothesis covers every number below \(n\).`,
        },
        display: [
          String.raw`n = 30 = 2 \times 15:\quad P(2), P(15)\ \text{needed},\quad P(29)\ \text{useless}`,
        ],
      },
    ],
  },
  {
    id: 'strong-induction-postage-stamps',
    statement: {
      ko: String.raw`강한 귀납법으로 증명하세요: 12 이상의 모든 정수는 \(4a + 5b\) (\(a, b \ge 0\) 정수) 꼴로 쓸 수 있다. 밑 경우 네 개 \(12 = 3 \cdot 4\), \(13 = 2 \cdot 4 + 5\), \(14 = 4 + 2 \cdot 5\), \(15 = 3 \cdot 5\)를 확인하고, \(n \ge 16\)인 경우 가정을 \(n-4\)에 적용한 뒤 4짜리 우표 하나를 더하세요. 밑 경우가 왜 정확히 네 개 연속이어야 하는지 설명하세요 (귀납 단계가 4만큼 뒤로 점프하기 때문입니다).`,
      en: String.raw`Prove by strong induction that every integer \(n \ge 12\) can be written as \(4a + 5b\) with integers \(a, b \ge 0\). Check the four base cases \(12 = 3 \cdot 4\), \(13 = 2 \cdot 4 + 5\), \(14 = 4 + 2 \cdot 5\), \(15 = 3 \cdot 5\); for \(n \ge 16\) apply the hypothesis to \(n - 4\) and add one 4-stamp. Explain why exactly four consecutive base cases are needed (the induction step jumps back by 4).`,
    },
    display: [
      String.raw`P(n):\ \exists a, b \ge 0\ \text{with}\ n = 4a + 5b,\qquad n \ge 12`,
      String.raw`n \ge 16 \;\Rightarrow\; n - 4 \ge 12:\quad n = (n-4) + 4`,
    ],
    preset: { n: 30 },
    presetCaption: {
      ko: String.raw`\(n = 30 = 5 \cdot 4 + 2 \cdot 5 = 20 + 10\): \(a = 5\), \(b = 2\).`,
      en: String.raw`\(n = 30 = 5 \cdot 4 + 2 \cdot 5 = 20 + 10\): \(a = 5\), \(b = 2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`밑 경우: \(12 = 3 \cdot 4 + 0 \cdot 5\) (\(a = 3\), \(b = 0\)), \(13 = 2 \cdot 4 + 1 \cdot 5\) (\(a = 2\), \(b = 1\)), \(14 = 1 \cdot 4 + 2 \cdot 5\) (\(a = 1\), \(b = 2\)), \(15 = 0 \cdot 4 + 3 \cdot 5\) (\(a = 0\), \(b = 3\)) — 네 경우 모두 직접 확인됩니다.`,
          en: String.raw`Base cases: \(12 = 3 \cdot 4 + 0 \cdot 5\) (\(a = 3\), \(b = 0\)), \(13 = 2 \cdot 4 + 1 \cdot 5\) (\(a = 2\), \(b = 1\)), \(14 = 1 \cdot 4 + 2 \cdot 5\) (\(a = 1\), \(b = 2\)), \(15 = 0 \cdot 4 + 3 \cdot 5\) (\(a = 0\), \(b = 3\)) — each checked directly.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(n \ge 16\)이라 하고, \(12 \le k < n\)인 모든 \(k\)에 대해 \(P(k)\)를 가정합니다 (강한 귀납). \(n - 4 \ge 12\)이므로 가정이 \(n - 4\)에 적용되어 \(n - 4 = 4a + 5b\)인 \(a, b \ge 0\)이 존재합니다.

양변에 4를 더하면 \(n = 4(a+1) + 5b\) — \(P(n)\)이 증명되었습니다.`,
          en: String.raw`Induction step: let \(n \ge 16\) and assume \(P(k)\) for all \(12 \le k < n\) (strong induction). Since \(n - 4 \ge 12\), the hypothesis applies to \(n - 4\), giving \(n - 4 = 4a + 5b\) for some \(a, b \ge 0\).

Adding 4 to both sides, \(n = 4(a+1) + 5b\) — proving \(P(n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`밑 경우가 네 개 연속이어야 하는 이유: 귀납 단계는 \(n\)에서 \(n-4\)로 4만큼 뒤로 점프합니다. 따라서 \(n \ge 16\)에 대한 증명이 \(12, 13, 14, 15\) 중 하나에 “착지”하려면, 4로 나눈 나머지가 \(0, 1, 2, 3\)인 경우가 모두 밑에 있어야 합니다. 세 개만 있으면 한 나머지 류가 밑 없이 떠버립니다.

일반적으로 점프 폭이 \(m\)이면 연속된 밑 경우 \(m\)개가 필요합니다. 예: \(30 - 4 \cdot 4 = 14\)이므로, \(30 = (14\)의 표현\() + 4 \cdot 4 = (4 + 2 \cdot 5) + 16 = 5 \cdot 4 + 2 \cdot 5\).`,
          en: String.raw`Why four consecutive base cases: the induction step jumps back by 4, from \(n\) to \(n - 4\). So for the proof of \(n \ge 16\) to "land" on one of \(12, 13, 14, 15\), every remainder class \(0, 1, 2, 3\) modulo 4 must be present among the bases. With only three, one residue class would be left hanging.

In general a jump of \(m\) needs \(m\) consecutive base cases. Example: \(30 - 4 \cdot 4 = 14\), so \(30 = (\text{expression for } 14) + 4 \cdot 4 = (4 + 2 \cdot 5) + 16 = 5 \cdot 4 + 2 \cdot 5\).`,
        },
      },
    ],
  },
  {
    id: 'strong-induction-prime-divisor',
    statement: {
      ko: String.raw`강한 귀납법으로 증명하세요: 2 이상의 모든 정수 \(n\)은 소인수를 가진다. \(n\)이 소수이면 자기 자신이 소인수이고, 합성수이면 \(n = a \cdot b\) (\(1 < a < n\))로 쓰고 \(a\)에 가정을 적용하세요 — \(a\)의 소인수 \(p\)는 \(n\)도 나눕니다.`,
      en: String.raw`Prove by strong induction that every integer \(n \ge 2\) has a prime divisor. If \(n\) is prime it divides itself; if \(n = a \cdot b\) is composite (\(1 < a < n\)), apply the hypothesis at \(a\) — a prime divisor \(p\) of \(a\) also divides \(n\).`,
    },
    display: [
      String.raw`P(n):\ \exists\ \text{prime } p\ \text{with}\ p \mid n,\qquad n \ge 2`,
      String.raw`n = a \cdot b,\ 1 < a < n:\quad p \mid a \;\Rightarrow\; p \mid n`,
    ],
    preset: { n: 36 },
    presetCaption: {
      ko: String.raw`\(n = 36 = 2^2 \cdot 3^2\): 소인수 2와 3. 트리에서 \(36 = 2 \times 18\) → \(18 = 2 \times 9\) → \(9 = 3 \times 3\).`,
      en: String.raw`\(n = 36 = 2^2 \cdot 3^2\): prime divisors 2 and 3. In the tree, \(36 = 2 \times 18\) → \(18 = 2 \times 9\) → \(9 = 3 \times 3\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`강한 귀납 가정을 세웁니다: 어떤 \(n \ge 2\)에 대해, \(2 \le k < n\)인 모든 \(k\)가 소인수를 가진다고 가정합니다. \(P(n)\)을 증명합니다.`,
          en: String.raw`Set up the strong-induction hypothesis: for some \(n \ge 2\), assume every \(2 \le k < n\) has a prime divisor. Prove \(P(n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`경우 1: \(n\)이 소수. 그러면 \(n\) 자신이 \(n\)의 소인수입니다 (\(n \mid n\)).`,
          en: String.raw`Case 1: \(n\) is prime. Then \(n\) itself is a prime divisor of \(n\) (\(n \mid n\)).`,
        },
      },
      {
        text: {
          ko: String.raw`경우 2: \(n\)이 합성수. 그러면 \(n = a \cdot b\)인 \(1 < a, b < n\)이 존재합니다. \(a < n\)이므로 가정이 \(a\)에 적용되어, 소수 \(p\)와 \(p \mid a\)인 경우가 존재합니다.

\(a \mid n\)이므로 (\(n = a \cdot b\)) 약수 관계의 추이성에 의해 \(p \mid n\)입니다. 즉 \(p\)는 \(n\)의 소인수입니다.`,
          en: String.raw`Case 2: \(n\) is composite. Then \(n = a \cdot b\) for some \(1 < a, b < n\). Since \(a < n\), the hypothesis applies at \(a\), giving a prime \(p\) with \(p \mid a\).

Because \(a \mid n\) (as \(n = a \cdot b\)), transitivity of divisibility yields \(p \mid n\). So \(p\) is a prime divisor of \(n\).`,
        },
        display: [
          String.raw`p \mid a,\ a \mid n \;\Rightarrow\; p \mid n \quad (\text{transitivity})`,
        ],
      },
      {
        text: {
          ko: String.raw`주석: 이 정리는 문제 1(소인수분해)의 “한 걸음짜리” 버전입니다. \(n = 36\)에서 가정은 \(a = 2\)에 적용되어 \(p = 2\)를 내놓고, \(2 \mid 2\)이고 \(2 \mid 36\)이므로 끝입니다.

전체 소인수분해를 구하지 않아도, 소인수 하나의 존재는 같은 강한 귀납 구조로 따라옵니다.`,
          en: String.raw`Remark: this theorem is the "one-step" version of problem 1 (full factorization). For \(n = 36\) the hypothesis is applied at \(a = 2\), yielding \(p = 2\), and \(2 \mid 2\) with \(2 \mid 36\) finishes it.

The existence of a single prime divisor follows from the same strong-induction skeleton, without computing the whole factorization.`,
        },
      },
    ],
  },
];
