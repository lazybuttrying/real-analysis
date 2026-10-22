import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the contradiction scene
 * (proof by contradiction; Euclid's theorem that the primes are infinite).
 *
 * Every number below was verified against the model
 * (tests/contradiction.test.ts): k = 4 gives P = 210, N = 211 (prime);
 * k = 6 gives P = 30030, N = 30031 = 59 * 509 — composite, yet both prime
 * factors are new primes off the list.
 */
export const contradictionProblems: readonly ProblemMeta[] = [
  {
    id: 'contradiction-euclid',
    statement: {
      ko: String.raw`유클리드의 정리를 완전히 증명하세요: 소수는 무한히 많다.

귀류법으로 — 소수가 \(p_1, \ldots, p_k\)뿐이라 가정하고, \(N = p_1 \cdots p_k + 1\)이 (i) \(N \ge 2\)이므로 소인수를 가지고, (ii) 그 소인수가 어떤 \(p_i\)와도 같을 수 없음을 보여 모순을 이끌어내세요.

특히 "\(N\) 자체는 소수일 필요가 없다"는 미묘한 점(\(k = 6\)에서는 \(N = 30031 = 59 \times 509\))을 다루세요.`,
      en: String.raw`Prove Euclid's theorem completely: there are infinitely many primes.

Use proof by contradiction — assume \(p_1, \ldots, p_k\) are all the primes, and show that \(N = p_1 \cdots p_k + 1\) (i) has a prime factor, since \(N \ge 2\), and (ii) that this factor cannot equal any \(p_i\), deriving a contradiction.

In particular, address the subtlety that \(N\) itself need not be prime (for \(k = 6\), \(N = 30031 = 59 \times 509\)).`,
    },
    display: [
      String.raw`N = p_1 p_2 \cdots p_k + 1, \qquad N \equiv 1 \pmod{p_i} \ \text{for all } i`,
      String.raw`k = 6:\quad N = 30031 = 59 \times 509`,
    ],
    preset: { k: 6 },
    presetCaption: {
      ko: String.raw`\(k = 6\): \(P = 30030\), \(N = 30031 = 59 \times 509\) — \(N\)은 합성수지만 소인수 \(59\)와 \(509\)는 모두 목록 \(\{2, 3, 5, 7, 11, 13\}\) 밖에 있는 새 소수.`,
      en: String.raw`\(k = 6\): \(P = 30030\), \(N = 30031 = 59 \times 509\) — \(N\) is composite, but its prime factors \(59\) and \(509\) are new primes off the list \(\{2, 3, 5, 7, 11, 13\}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`귀류법으로 증명합니다.

소수가 유한하다 — 즉 소수의 전체 목록이 \(p_1, \ldots, p_k\)뿐이라 가정하세요 (\(k \ge 1\)).

\(P = p_1 \cdots p_k\)라 두고 \(N = P + 1\)로 두면 \(N \ge 2 \cdot 1 + 1 = 3 \ge 2\)입니다.`,
          en: String.raw`We argue by contradiction.

Suppose there are only finitely many primes — a complete list \(p_1, \ldots, p_k\) (\(k \ge 1\)).

Put \(P = p_1 \cdots p_k\) and \(N = P + 1\); then \(N \ge 3 \ge 2\).`,
        },
      },
      {
        text: {
          ko: String.raw`보조 결과: 2 이상의 모든 정수는 소인수를 가집니다.

증명 (강한 귀납법): \(n = 2\)이면 \(n\) 자체가 소수입니다.

\(n > 2\)이면 \(n\)이 소수이거나 \(n = ab\), \(1 < a, b < n\)입니다; 합성수인 경우 귀납 가정에 의해 \(a\)가 소인수 \(q\)를 가지고, \(q \mid a \mid n\)이므로 \(q\)가 \(n\)의 소인수입니다.

이를 \(N\)에 적용하면 \(N\)의 소인수 \(q\)가 존재합니다.`,
          en: String.raw`Lemma: every integer \(\ge 2\) has a prime factor.

Proof (strong induction): for \(n = 2\), \(n\) itself is prime.

For \(n > 2\), either \(n\) is prime or \(n = ab\) with \(1 < a, b < n\); in the composite case the induction hypothesis gives \(a\) a prime factor \(q\), and \(q \mid a \mid n\), so \(q\) is a prime factor of \(n\).

Applying this to \(N\) yields a prime factor \(q\) of \(N\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(q\)는 어떤 \(p_i\)와도 다릅니다.

실제로 각 \(i\)에 대해 \(p_i \mid P\)이므로 \(N = P + 1 \equiv 1 \pmod{p_i}\), 즉 \(p_i\)는 \(N\)을 나누지 못합니다.

그런데 \(q \mid N\)이므로 \(q \ne p_i\) — 모든 \(i\)에 대해 성립합니다.

즉 \(q\)는 목록에 없는 소수이고, "목록이 완전하다"는 가정과 모순입니다.

따라서 소수는 무한히 많습니다. ∎`,
          en: String.raw`\(q\) differs from every \(p_i\).

Indeed, \(p_i \mid P\) for each \(i\), so \(N = P + 1 \equiv 1 \pmod{p_i}\): no \(p_i\) divides \(N\).

But \(q \mid N\), hence \(q \ne p_i\) for every \(i\).

So \(q\) is a prime missing from the supposedly complete list — a contradiction.

Hence there are infinitely many primes. ∎`,
        },
      },
      {
        text: {
          ko: String.raw`미묘한 점: \(N\) 자체가 소수일 필요는 없습니다.

\(k = 6\)이면 \(P = 2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 \cdot 13 = 30030\)이고 \(N = 30031 = 59 \times 509\)는 합성수입니다.

그래도 증명은 온전합니다 — 핵심은 "\(N\)의 소인수는 모두 새 소수"이지 "\(N\)이 새 소수"가 아니기 때문입니다.

한편 이 증명은 새 소수가 \(N\)의 소인수 중 하나라는 것까지는 말해 주지만, 어떤 것인지는 소인수분해를 해야 알 수 있습니다.`,
          en: String.raw`The subtlety: \(N\) itself need not be prime.

For \(k = 6\), \(P = 2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 \cdot 13 = 30030\) and \(N = 30031 = 59 \times 509\) is composite.

The proof is unaffected — its claim is "\emph{every} prime factor of \(N\) is new", not "\(N\) is a new prime".

The proof does pin down that a new prime is among the factors of \(N\), but identifying it requires factoring \(N\).`,
        },
      },
    ],
  },
  {
    id: 'contradiction-log2-5',
    statement: {
      ko: String.raw`귀류법으로 \(\log_2 5\)가 무리수임을 증명하세요.

힌트: \(\log_2 5 = \frac{p}{q}\) (\(p, q\)는 양의 정수)라 가정하면 \(2^p = 5^q\)를 얻습니다 — 왼쪽은 짝수이고 오른쪽은 홀수입니다.`,
      en: String.raw`Prove by contradiction that \(\log_2 5\) is irrational.

Hint: if \(\log_2 5 = \frac{p}{q}\) with \(p, q\) positive integers, then \(2^p = 5^q\) — the left side is even and the right side is odd.`,
    },
    display: [
      String.raw`\log_2 5 = \frac{p}{q} \;\Rightarrow\; 5 = 2^{p/q} \;\Rightarrow\; 5^q = 2^p`,
      String.raw`2^p \text{ is even } (p \ge 1), \qquad 5^q \text{ is odd}`,
    ],
    preset: { k: 4 },
    presetCaption: {
      ko: String.raw`씬 프리셋은 기본값 \(k = 4\) (\(P = 210\), \(N = 211\))입니다 — 이 문제는 씬의 수치가 아니라 귀류법의 구조 자체에 대한 문제입니다.`,
      en: String.raw`The scene preset is the default \(k = 4\) (\(P = 210\), \(N = 211\)) — this problem is about the shape of proof by contradiction itself, not the scene's numbers.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`귀류법으로 증명합니다.

\(\log_2 5\)가 유리수라 가정하세요.

\(\log_2 5 > \log_2 4 = 2 > 0\)이므로 \(\log_2 5 = \frac{p}{q}\) (\(p, q\)는 양의 정수)로 쓸 수 있습니다 — 특히 \(p \ge 1\)입니다.`,
          en: String.raw`We argue by contradiction.

Suppose \(\log_2 5\) is rational.

Since \(\log_2 5 > \log_2 4 = 2 > 0\), we can write \(\log_2 5 = \frac{p}{q}\) with \(p, q\) positive integers — in particular \(p \ge 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`로그의 정의에서 \(5 = 2^{p/q}\)이고, 양변을 \(q\)제곱하면 \(5^q = 2^p\)입니다.

그런데 \(p \ge 1\)이므로 왼쪽 \(2^p = 2 \cdot 2^{p-1}\)은 짝수이고, 오른쪽 \(5^q\)는 홀수들의 곱이라 홀수입니다.

짝수와 홀수가 같을 수는 없으므로 모순입니다.

따라서 \(\log_2 5\)는 무리수입니다. ∎`,
          en: String.raw`By the definition of the logarithm, \(5 = 2^{p/q}\), and raising both sides to the power \(q\) gives \(5^q = 2^p\).

But \(p \ge 1\) makes \(2^p = 2 \cdot 2^{p-1}\) even, while \(5^q\), a product of odd numbers, is odd.

An even number cannot equal an odd number — a contradiction.

Hence \(\log_2 5\) is irrational. ∎`,
        },
      },
      {
        text: {
          ko: String.raw`참고: \(\frac{p}{q}\)를 기약분수로 둘 필요는 없습니다 — 짝·홀수 논증만으로 충분합니다. 더 깊은 이유: 산술의 기본정리(소인수분해의 유일성)에 의해 \(2^p\)의 소인수는 2뿐이고 \(5^q\)의 소인수는 5뿐이라, 양의 지수를 가진 두 거듭제곱은 결코 같아질 수 없습니다.`,
          en: String.raw`Note: there is no need to put \(\frac{p}{q}\) in lowest terms — the parity argument alone suffices. The deeper reason is the fundamental theorem of arithmetic (unique prime factorization): \(2^p\) has only the prime factor 2 and \(5^q\) only the prime factor 5, so the two powers with positive exponents can never agree.`,
        },
      },
    ],
  },
  {
    id: 'contradiction-rational-plus-irrational',
    statement: {
      ko: String.raw`귀류법으로 증명하세요: \(r\)이 유리수이고 \(x\)가 무리수이면 \(r + x\)도 무리수입니다.`,
      en: String.raw`Prove by contradiction: if \(r\) is rational and \(x\) is irrational, then \(r + x\) is irrational.`,
    },
    display: [
      String.raw`r + x = s \in \mathbb{Q} \;\Rightarrow\; x = s - r \in \mathbb{Q}`,
    ],
    preset: { k: 4 },
    presetCaption: {
      ko: String.raw`씬 프리셋은 기본값 \(k = 4\) (\(P = 210\), \(N = 211\))입니다 — 이 문제는 씬의 수치가 아니라 귀류법의 구조 자체에 대한 문제입니다.`,
      en: String.raw`The scene preset is the default \(k = 4\) (\(P = 210\), \(N = 211\)) — this problem is about the shape of proof by contradiction itself, not the scene's numbers.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`귀류법으로 증명합니다.

\(r + x\)가 유리수라 가정하고 \(s = r + x \in \mathbb{Q}\)라 두세요.

그러면 \(x = s - r\)입니다.`,
          en: String.raw`We argue by contradiction.

Suppose \(r + x\) is rational, and put \(s = r + x \in \mathbb{Q}\).

Then \(x = s - r\).`,
        },
      },
      {
        text: {
          ko: String.raw`유리수들의 차는 유리수입니다: \(r = \frac{a}{b}\), \(s = \frac{c}{d}\) (\(a, c \in \mathbb{Z}\), \(b, d \in \mathbb{Z}\), \(b, d \ne 0\))이면 \(x = s - r = \frac{cb - ad}{bd}\)이고, \(cb - ad \in \mathbb{Z}\), \(bd \ne 0\)이므로 \(x \in \mathbb{Q}\)입니다.`,
          en: String.raw`A difference of rationals is rational: if \(r = \frac{a}{b}\) and \(s = \frac{c}{d}\) (with \(a, c \in \mathbb{Z}\), \(b, d \in \mathbb{Z}\), \(b, d \ne 0\)), then \(x = s - r = \frac{cb - ad}{bd}\), and \(cb - ad \in \mathbb{Z}\) with \(bd \ne 0\), so \(x \in \mathbb{Q}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이는 \(x\)가 무리수라는 가정과 모순입니다.

따라서 \(r + x\)는 유리수일 수 없고, 즉 무리수입니다.

∎ (같은 논증으로 \(r \ne 0\)인 유리수 \(r\)과 무리수 \(x\)에 대해 \(rx\)도 무리수임을 보일 수 있습니다: \(rx = s\)이면 \(x = s/r\)은 유리수들의 몫이기 때문입니다.)`,
          en: String.raw`This contradicts the assumption that \(x\) is irrational.

Hence \(r + x\) cannot be rational — it is irrational.

∎ (The same argument shows \(rx\) is irrational for rational \(r \ne 0\) and irrational \(x\): if \(rx = s\) then \(x = s/r\) is a quotient of rationals.)`,
        },
      },
    ],
  },
];
