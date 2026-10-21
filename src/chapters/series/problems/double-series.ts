import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the double series scene
 * (Tao, Thm 8.2.2: Fubini for infinite sums). Imports nothing except types.
 * Verified numbers (tests/double-series.test.ts, N = 5):
 *   product series total = 2.1421574845679006 -> pi^4/36 = 2.705808084277845;
 *   alternating total = 0.7032685956790126 -> pi^4/144 = 0.6764520210694612;
 *   sum of row sums = sum of column sums = total (both series).
 */
export const doubleSeriesProblems: readonly ProblemMeta[] = [
  {
    id: 'double-series-proof',
    statement: {
      ko: String.raw`푸비니 정리(무한합, 음이 아닌 항)를 완전히 증명하세요: \(a_{m,n} \ge 0\)이면 \(\sum_m \sum_n a_{m,n} = \sum_n \sum_m a_{m,n}\)입니다.

유한 직사각형 위의 합의 상한 \(S\)를 매개로 양쪽을 모두 \(S\)와 같게 보이세요.`,
      en: String.raw`Prove Fubini for infinite sums (nonnegative terms) completely: if \(a_{m,n} \ge 0\) then \(\sum_m \sum_n a_{m,n} = \sum_n \sum_m a_{m,n}\).

Show both sides equal the supremum \(S\) of sums over finite rectangles.`,
    },
    display: [
      String.raw`S = \sup_{M,N} \sum_{m \le M} \sum_{n \le N} a_{m,n} \in [0, \infty]`,
      String.raw`\sum_{m=1}^{\infty}\sum_{n=1}^{\infty} a_{m,n} = S = \sum_{n=1}^{\infty}\sum_{m=1}^{\infty} a_{m,n}`,
    ],
    preset: { N: 5, series: '1/(m^2 n^2)' },
    presetCaption: {
      ko: String.raw`\(N = 5\): 행별 합 \(\approx 2.1422\), 열별 합 \(\approx 2.1422\) — 둘 다 \((\pi^2/6)^2 = \pi^4/36 \approx 2.7058\)로 갑니다.`,
      en: String.raw`\(N = 5\): sum by rows \(\approx 2.1422\), sum by columns \(\approx 2.1422\) — both head to \((\pi^2/6)^2 = \pi^4/36 \approx 2.7058\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(T(M,N) = \sum_{m \le M}\sum_{n \le N} a_{m,n}\) (유한합, \(\ge 0\))과 \(S = \sup_{M,N} T(M,N) \in [0,\infty]\)를 둡니다.

\(T\)는 \(M\)과 \(N\) 각각에 대해 단조증가합니다.

각 고정된 \(m\)에 대해 안쪽 급수 \(\sum_{n=1}^{\infty} a_{m,n} \in [0,\infty]\)는 항이 음이 아니므로 (유한 또는 \(+\infty\)로) 수렴합니다.`,
          en: String.raw`Put \(T(M,N) = \sum_{m \le M}\sum_{n \le N} a_{m,n}\) (a finite sum, \(\ge 0\)) and \(S = \sup_{M,N} T(M,N) \in [0,\infty]\).

\(T\) is monotone in each of \(M, N\).

For each fixed \(m\), the inner series \(\sum_{n=1}^{\infty} a_{m,n} \in [0,\infty]\) converges (finitely or to \(+\infty\)) since the terms are nonnegative.`,
        },
      },
      {
        text: {
          ko: String.raw`\(R = \sum_{m=1}^{\infty}\sum_{n=1}^{\infty} a_{m,n}\)이라 둡니다.

각 \(M, N\)에 대해 \(T(M,N) = \sum_{m \le M}\sum_{n \le N} a_{m,n} \le \sum_{m \le M}\sum_{n=1}^{\infty} a_{m,n} \le R\)입니다 (안쪽 유한합 \(\le\) 안쪽 무한합, 바깥 유한합 \(\le\) 바깥 무한합 — 모두 음이 아닌 항).

\(M, N\)에 대해 상한을 취하면 \(S \le R\)입니다.`,
          en: String.raw`Put \(R = \sum_{m=1}^{\infty}\sum_{n=1}^{\infty} a_{m,n}\).

For each \(M, N\): \(T(M,N) = \sum_{m \le M}\sum_{n \le N} a_{m,n} \le \sum_{m \le M}\sum_{n=1}^{\infty} a_{m,n} \le R\) (inner finite sum \(\le\) inner infinite sum, outer finite \(\le\) outer infinite — all terms nonnegative).

Taking the supremum over \(M, N\) gives \(S \le R\).`,
        },
      },
      {
        text: {
          ko: String.raw`반대 방향: 각 \(M\)에 대해 \(\sum_{m \le M}\sum_{n=1}^{\infty} a_{m,n} = \sup_N T(M,N) \le S\)입니다 (안쪽 무한합이 안쪽 유한합들의 상한).

이 등식에는 정당화가 필요합니다: 고정된 \(M\)에 대해 각 안쪽 합 \(\sum_{n \le N} a_{m,n}\)은 \(a_{m,n} \ge 0\)이므로 \(N\)에 대해 증가하고 \(\sum_{n=1}^{\infty} a_{m,n}\)으로 수렴합니다.

유한합(\(M\)개 항)에서는 상한과 합을 교환할 수 있습니다 — 유한한 개수의 증가 수열들의 합은 증가하고, 그 상한은 상한들의 합과 같습니다(항별로 검증 가능).

따라서 \(\sum_{m \le M} \sup_N \sum_{n \le N} a_{m,n} = \sup_N \sum_{m \le M} \sum_{n \le N} a_{m,n} = \sup_N T(M,N)\)입니다.

\(M\)에 대해 상한을 취하면 \(R = \sup_M \sum_{m \le M}\sum_{n=1}^{\infty} a_{m,n} \le S\)입니다.

따라서 \(R = S\)입니다.`,
          en: String.raw`The other direction: for each \(M\), \(\sum_{m \le M}\sum_{n=1}^{\infty} a_{m,n} = \sup_N T(M,N) \le S\) (the inner infinite sum is the supremum of the inner finite sums).

This equality needs justification: for fixed \(M\), each inner sum \(\sum_{n \le N} a_{m,n}\) is increasing in \(N\) (since \(a_{m,n} \ge 0\)) and converges to \(\sum_{n=1}^{\infty} a_{m,n}\).

For a finite sum (\(M\) terms), supremum and summation interchange — a finite sum of increasing sequences is increasing, and its supremum equals the sum of the suprema (checked termwise).

Hence \(\sum_{m \le M} \sup_N \sum_{n \le N} a_{m,n} = \sup_N \sum_{m \le M} \sum_{n \le N} a_{m,n} = \sup_N T(M,N)\).

Taking the supremum over \(M\) gives \(R = \sup_M \sum_{m \le M}\sum_{n=1}^{\infty} a_{m,n} \le S\).

Hence \(R = S\).`,
        },
      },
      {
        text: {
          ko: String.raw`행과 열의 역할을 바꾸면 똑같은 논증으로 \(C = \sum_{n=1}^{\infty}\sum_{m=1}^{\infty} a_{m,n} = S\)를 얻습니다 (같은 \(T(M,N)\)의 상한).

따라서 \(R = C = S\) — 두 반복합이 같습니다.

\(S < \infty\)이면 공통값은 유한하고, \(S = \infty\)이면 양쪽 모두 \(+\infty\)로 발산합니다.

증명 끝.`,
          en: String.raw`Swapping the roles of rows and columns, the identical argument gives \(C = \sum_{n=1}^{\infty}\sum_{m=1}^{\infty} a_{m,n} = S\) (the same supremum of the same \(T(M,N)\)).

Hence \(R = C = S\) — the two iterated sums agree.

If \(S < \infty\) the common value is finite; if \(S = \infty\) both sides diverge to \(+\infty\).

QED.`,
        },
      },
    ],
  },
  {
    id: 'double-series-absolute',
    statement: {
      ko: String.raw`절대수렴하는 경우로 확장하세요 (짧은 완전 증명): \(\sum_{m,n} \lvert a_{m,n}\rvert < \infty\)이면 \(a = a^+ - a^-\) 분해를 이용해 첫 번째 문제의 결과를 각 부분에 적용하고, \(\sum_m\sum_n a_{m,n} = \sum_n\sum_m a_{m,n}\)을 결론지으세요.`,
      en: String.raw`Extend to the absolutely convergent case (short complete proof): if \(\sum_{m,n} \lvert a_{m,n}\rvert < \infty\), use the decomposition \(a = a^+ - a^-\) to apply the first problem to each part and conclude \(\sum_m\sum_n a_{m,n} = \sum_n\sum_m a_{m,n}\).`,
    },
    display: [
      String.raw`a^+ = \max(a, 0), \quad a^- = \max(-a, 0), \quad \lvert a\rvert = a^+ + a^-, \quad a = a^+ - a^-`,
      String.raw`\sum_m\sum_n a = \sum_m\sum_n a^+ - \sum_m\sum_n a^- = \sum_n\sum_m a^+ - \sum_n\sum_m a^- = \sum_n\sum_m a`,
    ],
    preset: { N: 5, series: '(-1)^(m+n)/(m^2 n^2)' },
    presetCaption: {
      ko: String.raw`\(N = 5\): 부호가 있지만 \(\sum \lvert a\rvert\)가 수렴하므로 행별 합 \(\approx 0.7033\)과 열별 합 \(\approx 0.7033\)이 일치하고, 둘 다 \(\pi^4/144 \approx 0.6765\)로 갑니다.`,
      en: String.raw`\(N = 5\): signs are present but \(\sum \lvert a\rvert\) converges, so sum by rows \(\approx 0.7033\) and sum by columns \(\approx 0.7033\) agree, both heading to \(\pi^4/144 \approx 0.6765\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a^+_{m,n} = \max(a_{m,n}, 0)\), \(a^-_{m,n} = \max(-a_{m,n}, 0)\)라 둡니다.

그러면 \(0 \le a^{\pm}_{m,n} \le \lvert a_{m,n}\rvert\)이고 \(\lvert a\rvert = a^+ + a^-\), \(a = a^+ - a^-\)입니다.

비교판정법에 의해 \(\sum a^+_{m,n}\)와 \(\sum a^-_{m,n}\)는 모두 \(\sum \lvert a_{m,n}\rvert < \infty\) 이하로 수렴합니다.`,
          en: String.raw`Put \(a^+_{m,n} = \max(a_{m,n}, 0)\) and \(a^-_{m,n} = \max(-a_{m,n}, 0)\).

Then \(0 \le a^{\pm}_{m,n} \le \lvert a_{m,n}\rvert\), with \(\lvert a\rvert = a^+ + a^-\) and \(a = a^+ - a^-\).

By comparison, both \(\sum a^+_{m,n}\) and \(\sum a^-_{m,n}\) converge, bounded by \(\sum \lvert a_{m,n}\rvert < \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(a^+\)와 \(a^-\)는 음이 아니므로 첫 번째 문제(푸비니, 음이 아닌 항)를 각각에 적용합니다: \(\sum_m\sum_n a^+ = \sum_n\sum_m a^+ < \infty\)이고 \(a^-\)도 마찬가지입니다.

모든 반복합이 유한하므로 뺄셈이 정당하고, \(\sum_m\sum_n a = \sum_m\sum_n a^+ - \sum_m\sum_n a^- = \sum_n\sum_m a^+ - \sum_n\sum_m a^- = \sum_n\sum_m a\)를 얻습니다.

증명 끝.`,
          en: String.raw`Since \(a^+\) and \(a^-\) are nonnegative, apply the first problem (Fubini, nonnegative terms) to each: \(\sum_m\sum_n a^+ = \sum_n\sum_m a^+ < \infty\), and likewise for \(a^-\).

All iterated sums are finite, so subtraction is legitimate, and \(\sum_m\sum_n a = \sum_m\sum_n a^+ - \sum_m\sum_n a^- = \sum_n\sum_m a^+ - \sum_n\sum_m a^- = \sum_n\sum_m a\).

QED.`,
        },
      },
    ],
  },
  {
    id: 'fubini-fails',
    statement: {
      ko: String.raw`가설이 날카로움을 보이세요: \(a_{n,n} = 1\), \(a_{n,n+1} = -1\) (\(n \ge 1\)), 나머지는 \(0\)이라 둘 때, 모든 행 합이 \(0\)이므로 \(\sum_m\sum_n a_{m,n} = 0\)이지만, 열 \(1\)의 합은 \(1\)이고 \(n \ge 2\)인 열의 합은 \(0\)이므로 \(\sum_n\sum_m a_{m,n} = 1\)임을 완전히 계산으로 확인하고, \(\sum \lvert a\rvert = \infty\)임을 지적하세요.`,
      en: String.raw`Show the hypothesis is sharp: with \(a_{n,n} = 1\), \(a_{n,n+1} = -1\) (\(n \ge 1\)) and \(0\) elsewhere, verify completely that every row sum is \(0\) (so \(\sum_m\sum_n a_{m,n} = 0\)) but column \(1\) sums to \(1\) and columns \(n \ge 2\) sum to \(0\) (so \(\sum_n\sum_m a_{m,n} = 1\)), and note \(\sum \lvert a\rvert = \infty\).`,
    },
    display: [
      String.raw`a_{n,n} = 1, \quad a_{n,n+1} = -1 \ (n \ge 1), \quad \text{else } 0`,
      String.raw`\sum_m \sum_n a_{m,n} = \sum_m 0 = 0 \quad\ne\quad 1 = 1 + \sum_{n \ge 2} 0 = \sum_n \sum_m a_{m,n}`,
    ],
    preset: { N: 5, series: '(-1)^(m+n)/(m^2 n^2)' },
    presetCaption: {
      ko: String.raw`위 그림의 교대급수는 절대수렴하므로 순서가 바뀌어도 안전합니다 — 하지만 아래 반례처럼 \(\sum\lvert a\rvert = \infty\)이면 순서가 결과를 바꿀 수 있습니다.`,
      en: String.raw`The alternating series in the picture above is absolutely convergent, so reordering is safe — but as the counterexample below shows, with \(\sum\lvert a\rvert = \infty\) the order can change the answer.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`행을 고정합니다 (\(m\) 고정).

\(0\)이 아닌 항은 \(n = m\)에서의 \(a_{m,m} = 1\)과 \(n = m+1\)에서의 \(a_{m,m+1} = -1\)뿐입니다.

따라서 행 합은 \(\sum_{n=1}^{\infty} a_{m,n} = 1 + (-1) = 0\)입니다 (유한합이므로 수렴 문제 없음).

모든 \(m\)에 대해 성립하므로 \(\sum_{m=1}^{\infty}\sum_{n=1}^{\infty} a_{m,n} = \sum_{m=1}^{\infty} 0 = 0\)입니다.`,
          en: String.raw`Fix a row (\(m\) fixed).

The only nonzero entries are \(a_{m,m} = 1\) at \(n = m\) and \(a_{m,m+1} = -1\) at \(n = m+1\).

Hence the row sum is \(\sum_{n=1}^{\infty} a_{m,n} = 1 + (-1) = 0\) (a finite sum, so no convergence issue).

This holds for every \(m\), so \(\sum_{m=1}^{\infty}\sum_{n=1}^{\infty} a_{m,n} = \sum_{m=1}^{\infty} 0 = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`열을 고정합니다 (\(n\) 고정).

\(0\)이 아닌 항: \(a_{n,n} = 1\) (행 \(m = n\))과, \(n \ge 2\)일 때 \(a_{n-1,n} = -1\) (행 \(m = n-1\), \(a_{m,m+1} = -1\)에 \(m = n-1\) 대입).

열 \(1\): \(a_{1,1} = 1\)만 있으므로 합은 \(1\).

열 \(n \ge 2\): \(1 + (-1) = 0\).

따라서 \(\sum_{n=1}^{\infty}\sum_{m=1}^{\infty} a_{m,n} = 1 + \sum_{n=2}^{\infty} 0 = 1\)입니다.`,
          en: String.raw`Fix a column (\(n\) fixed).

The nonzero entries: \(a_{n,n} = 1\) (row \(m = n\)) and, for \(n \ge 2\), \(a_{n-1,n} = -1\) (row \(m = n-1\), from \(a_{m,m+1} = -1\) with \(m = n-1\)).

Column \(1\): only \(a_{1,1} = 1\), so the sum is \(1\).

Column \(n \ge 2\): \(1 + (-1) = 0\).

Hence \(\sum_{n=1}^{\infty}\sum_{m=1}^{\infty} a_{m,n} = 1 + \sum_{n=2}^{\infty} 0 = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 반복합은 \(0 \ne 1\)로 다릅니다 — 순서가 결과를 바꿉니다.

깨진 가설은 절대수렴입니다: \(\sum_{m,n} \lvert a_{m,n}\rvert = \sum_{n=1}^{\infty} (1 + 1) = \infty\)이므로 두 번째 문제의 가설이 성립하지 않습니다.

음이 아닌 항(또는 절대수렴) 가설 없이는 푸비니가 성립하지 않으며, 이 예는 그 가설이 날카롭(sharp)음을 보여줍니다.

증명 끝.`,
          en: String.raw`The two iterated sums differ, \(0 \ne 1\) — the order changes the answer.

The broken hypothesis is absolute convergence: \(\sum_{m,n} \lvert a_{m,n}\rvert = \sum_{n=1}^{\infty} (1 + 1) = \infty\), so the second problem's hypothesis fails.

Without the nonnegative (or absolutely convergent) hypothesis Fubini fails, and this example shows the hypothesis is sharp.

QED.`,
        },
      },
    ],
  },
];
