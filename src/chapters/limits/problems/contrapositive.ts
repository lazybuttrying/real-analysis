import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the contrapositive scene
 * (to prove P => Q, prove not-Q => not-P; worked example: n^2 even
 * implies n even, via the odd-square lemma).
 *
 * Every number below was verified against the model
 * (tests/contrapositive.test.ts): for all n in 1..200, n^2 even implies
 * n even, and for odd n = 2k + 1 the identity
 * n^2 = 2 * (2k^2 + 2k) + 1 holds exactly.
 */
export const contrapositiveProblems: readonly ProblemMeta[] = [
  {
    id: 'contrapositive-square-even',
    statement: {
      ko: String.raw`정수 \(n\)에 대해 "\(n^2\)이 짝수이면 \(n\)도 짝수이다"를 대우법으로 완전히 증명하세요. 대우인 "\(n\)이 홀수이면 \(n^2\)이 홀수이다"를 홀수 제곱 전개로 증명하는 것으로 귀결시키세요.`,
      en: String.raw`Prove completely, by contrapositive, that for an integer \(n\), "if \(n^2\) is even then \(n\) is even". Reduce the claim to its contrapositive, "if \(n\) is odd then \(n^2\) is odd", and prove that by the odd-square expansion.`,
    },
    display: [
      String.raw`n^2 \text{ even} \Rightarrow n \text{ even} \quad\Longleftrightarrow\quad n \text{ odd} \Rightarrow n^2 \text{ odd}`,
    ],
    preset: { n: 7, view: 'contrapositive' },
    presetCaption: {
      ko: String.raw`\(n = 7\) (홀수): \(n = 2 \cdot 3 + 1\), \(n^2 = 49 = 2 \cdot 24 + 1\) — 홀수. 대우의 계산이 직접 보인다.`,
      en: String.raw`\(n = 7\) (odd): \(n = 2 \cdot 3 + 1\), \(n^2 = 49 = 2 \cdot 24 + 1\) — odd. The contrapositive computation is on display.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`증명하려는 명제는 \(P \Rightarrow Q\) (\(P\): "\(n^2\)이 짝수", \(Q\): "\(n\)이 짝수")입니다. 함의와 그 대우는 논리적으로 동치이므로(둘 다 \(P\) 참·\(Q\) 거짓일 때만 거짓), 대우 \(\lnot Q \Rightarrow \lnot P\), 즉 "\(n\)이 홀수이면 \(n^2\)이 홀수이다"를 증명합니다.`,
          en: String.raw`The claim is \(P \Rightarrow Q\) with \(P\): "\(n^2\) is even" and \(Q\): "\(n\) is even". An implication is logically equivalent to its contrapositive (both fail exactly when \(P\) is true and \(Q\) false), so we prove \(\lnot Q \Rightarrow \lnot P\): "if \(n\) is odd then \(n^2\) is odd".`,
        },
      },
      {
        text: {
          ko: String.raw`대우는 직접증명으로 증명됩니다: \(n\)이 홀수이면 어떤 정수 \(k\)에 대해 \(n = 2k + 1\)이고, \(n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\). \(2k^2 + 2k\)는 정수이므로 \(n^2\)은 홀수입니다. 씬에서 확인: \(n = 7\)이면 \(k = 3\), \(n^2 = 49 = 2 \cdot (2 \cdot 9 + 6) + 1 = 2 \cdot 24 + 1\). 이로써 대우가 증명되었고, 동치성에 의해 원래 명제 "\(n^2\)이 짝수이면 \(n\)이 짝수"도 증명됩니다. (직접 시도가 막히는 이유: \(n^2 = 2m\)이라는 가정은 \(n\)에 대한 계산 손잡이를 주지 않습니다 — 대우는 가정을 \(n\) 자체의 형태 \(2k+1\)로 바꿔 줍니다.)`,
          en: String.raw`The contrapositive is proved directly: if \(n\) is odd, then \(n = 2k + 1\) for some integer \(k\), and \(n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\). Since \(2k^2 + 2k\) is an integer, \(n^2\) is odd. Check in the scene: \(n = 7\) gives \(k = 3\) and \(n^2 = 49 = 2 \cdot (2 \cdot 9 + 6) + 1 = 2 \cdot 24 + 1\). The contrapositive is proved, so by equivalence the original claim "if \(n^2\) is even then \(n\) is even" is proved. (Why the direct attempt stalls: the assumption \(n^2 = 2m\) gives no handle for computing with \(n\) — the contrapositive swaps it for the workable form \(n = 2k + 1\).)`,
        },
        display: [String.raw`(2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1`],
      },
    ],
  },
  {
    id: 'contrapositive-linear-odd',
    statement: {
      ko: String.raw`정수 \(n\)에 대해 "\(3n + 2\)가 홀수이면 \(n\)도 홀수이다"를 대우법으로 증명하세요. 먼저 직접 경로가 왜 어색한지 — \(3n + 2\)가 홀수이면 \(3n\)이 홀수라는 것만 얻어지고, \(n\) 자체에는 손이 닿지 않음을 — 설명하세요.`,
      en: String.raw`Prove by contrapositive that for an integer \(n\), "if \(3n + 2\) is odd then \(n\) is odd". First explain why the direct route is awkward: "\(3n + 2\) odd" only yields "\(3n\) odd", with no direct grip on \(n\) itself.`,
    },
    display: [String.raw`3n + 2 \text{ odd} \Rightarrow n \text{ odd} \quad\Longleftrightarrow\quad n \text{ even} \Rightarrow 3n + 2 \text{ even}`],
    preset: { n: 8, view: 'contrapositive' },
    presetCaption: {
      ko: String.raw`\(n = 8\) (짝수): \(n = 2 \cdot 4\), \(3n + 2 = 26 = 2(3 \cdot 4 + 1) = 2 \cdot 13\) — 짝수. 대우의 방향이 보인다.`,
      en: String.raw`\(n = 8\) (even): \(n = 2 \cdot 4\), \(3n + 2 = 26 = 2(3 \cdot 4 + 1) = 2 \cdot 13\) — even. The contrapositive direction is on display.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`직접 경로가 어색한 이유: \(3n + 2\)가 홀수라고 가정하면 \(3n = (3n + 2) - 2\)이므로 \(3n\)은 홀수입니다. 하지만 "3 곱하기 \(n\)이 홀수"에서 "\(n\)이 홀수"로 넘어가려면, \(n\)이 짝수일 수 없다는 별도의 논증이 필요합니다 — \(n\) 자체를 계산할 형태가 없습니다. 그래서 대우로 돕니다: "\(n\)이 짝수이면 \(3n + 2\)도 짝수이다".`,
          en: String.raw`Why the direct route is awkward: assuming \(3n + 2\) is odd gives \(3n = (3n + 2) - 2\), so \(3n\) is odd. But passing from "3 times \(n\) is odd" to "\(n\) is odd" needs a separate argument that \(n\) cannot be even — there is no computable form of \(n\) to work with. So we turn to the contrapositive: "if \(n\) is even then \(3n + 2\) is even".`,
        },
      },
      {
        text: {
          ko: String.raw`대우를 직접증명합니다: \(n\)이 짝수이면 \(n = 2k\) (정수 \(k\))이고, \(3n + 2 = 3(2k) + 2 = 6k + 2 = 2(3k + 1)\). \(3k + 1\)은 정수이므로 \(3n + 2\)는 짝수입니다. 대우가 증명되었으므로, 동치성에 의해 원래 명제 "\(3n + 2\)가 홀수이면 \(n\)이 홀수"가 증명됩니다. 씬에서 확인: \(n = 8 = 2 \cdot 4\)이면 \(3n + 2 = 26 = 2(3 \cdot 4 + 1) = 2 \cdot 13\), 짝수입니다.`,
          en: String.raw`Prove the contrapositive directly: if \(n\) is even, write \(n = 2k\) with \(k\) an integer; then \(3n + 2 = 3(2k) + 2 = 6k + 2 = 2(3k + 1)\). Since \(3k + 1\) is an integer, \(3n + 2\) is even. The contrapositive is proved, so by equivalence the original claim "if \(3n + 2\) is odd then \(n\) is odd" is proved. Check in the scene: \(n = 8 = 2 \cdot 4\) gives \(3n + 2 = 26 = 2(3 \cdot 4 + 1) = 2 \cdot 13\), even.`,
        },
      },
    ],
  },
  {
    id: 'contrapositive-divisible-by-three',
    statement: {
      ko: String.raw`정수 \(n\)에 대해 "\(n^2\)이 3으로 나누어떨어지면 \(n\)도 3으로 나누어떨어진다"를 증명하세요. 대우를 취한 뒤, 3으로 나누어떨어지지 않는 경우를 \(n = 3k + 1\)과 \(n = 3k + 2\)로 나누어 각각 \(n^2\)도 3으로 나누어떨어지지 않음을 보이세요.`,
      en: String.raw`Prove that for an integer \(n\), "if \(n^2\) is divisible by 3 then \(n\) is divisible by 3". Take the contrapositive, then split the case "3 does not divide \(n\)" into \(n = 3k + 1\) and \(n = 3k + 2\), showing in each case that 3 does not divide \(n^2\).`,
    },
    display: [
      String.raw`n = 3k+1 \Rightarrow n^2 = 3(3k^2 + 2k) + 1, \qquad n = 3k+2 \Rightarrow n^2 = 3(3k^2 + 4k + 1) + 1`,
    ],
    preset: { n: 9, view: 'statement' },
    presetCaption: {
      ko: String.raw`\(n = 9\): \(n^2 = 81 = 3 \cdot 27\) — 3으로 나누어떨어지고, \(n = 9 = 3 \cdot 3\)도 그렇다. 명제 형태 그대로의 확인.`,
      en: String.raw`\(n = 9\): \(n^2 = 81 = 3 \cdot 27\) — divisible by 3, and \(n = 9 = 3 \cdot 3\) is too. A check in the statement's own form.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`대우를 증명합니다: "3이 \(n\)을 나누지 않으면 3은 \(n^2\)도 나누지 않는다". 나눗셈 정리에 의해, 3이 \(n\)을 나누지 않으면 나머지가 1 또는 2이므로 어떤 정수 \(k\)에 대해 \(n = 3k + 1\) 또는 \(n = 3k + 2\)입니다. 두 경우를 각각 계산합니다.`,
          en: String.raw`We prove the contrapositive: "if 3 does not divide \(n\) then 3 does not divide \(n^2\)". By the division algorithm, if 3 does not divide \(n\) the remainder is 1 or 2, so \(n = 3k + 1\) or \(n = 3k + 2\) for some integer \(k\). Compute each case.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 1: \(n = 3k + 1\)이면 \(n^2 = 9k^2 + 6k + 1 = 3(3k^2 + 2k) + 1\) — 3으로 나눈 나머지가 1이므로 3은 \(n^2\)를 나누지 않습니다. 경우 2: \(n = 3k + 2\)이면 \(n^2 = 9k^2 + 12k + 4 = 3(3k^2 + 4k + 1) + 1\) — 역시 나머지가 1이므로 3은 \(n^2\)를 나누지 않습니다. 두 경우 모두 대우의 결론을 주므로 대우가 증명되고, 동치성에 의해 원래 명제가 증명됩니다. 씬에서 확인: \(n = 9 = 3 \cdot 3\)은 3으로 나누어떨어지고 \(n^2 = 81 = 3 \cdot 27\)도 그렇습니다.`,
          en: String.raw`Case 1: if \(n = 3k + 1\) then \(n^2 = 9k^2 + 6k + 1 = 3(3k^2 + 2k) + 1\) — remainder 1 on division by 3, so 3 does not divide \(n^2\). Case 2: if \(n = 3k + 2\) then \(n^2 = 9k^2 + 12k + 4 = 3(3k^2 + 4k + 1) + 1\) — again remainder 1, so 3 does not divide \(n^2\). Both cases give the contrapositive's conclusion, so the contrapositive is proved, and by equivalence so is the original claim. Check in the scene: \(n = 9 = 3 \cdot 3\) is divisible by 3 and \(n^2 = 81 = 3 \cdot 27\) is too.`,
        },
      },
    ],
  },
];
