import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 거듭제곱급수 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'poly-radius',
    difficulty: 1,
    topics: ['power-series'],
    statement: {
      ko: String.raw`멱급수 \(\sum_{n=0}^{\infty}\frac{n^2+1}{3^n}\,x^n\)의 수렴반경을 구하세요.`,
      en: String.raw`Find the radius of convergence of the power series \(\sum_{n=0}^{\infty}\frac{n^2+1}{3^n}\,x^n\).`,
    },
    display: [String.raw`\left|\frac{c_{n+1}x^{n+1}}{c_n x^n}\right| = \frac{(n+1)^2+1}{n^2+1}\cdot\frac{|x|}{3} \to \frac{|x|}{3}`],
    solution: [
      {
        text: {
          ko: String.raw`\(c_n = \frac{n^2+1}{3^n} > 0\)이라 두면 일반항의 절댓값의 비는 \(\left|\frac{c_{n+1}x^{n+1}}{c_n x^n}\right| = \frac{(n+1)^2+1}{n^2+1}\cdot\frac{|x|}{3}\)입니다.`,
          en: String.raw`With \(c_n = \frac{n^2+1}{3^n} > 0\), the ratio of successive absolute terms is \(\left|\frac{c_{n+1}x^{n+1}}{c_n x^n}\right| = \frac{(n+1)^2+1}{n^2+1}\cdot\frac{|x|}{3}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{(n+1)^2+1}{n^2+1} = \frac{n^2+2n+2}{n^2+1} \to 1\)이므로, 이 비는 \(\frac{|x|}{3}\)로 수렴합니다.`,
          en: String.raw`Since \(\frac{(n+1)^2+1}{n^2+1} = \frac{n^2+2n+2}{n^2+1} \to 1\), the ratio tends to \(\frac{|x|}{3}\).`,
        },
      },
      {
        text: {
          ko: String.raw`비율 판정법에 따라 \(|x| < 3\)이면 급수는 (절대) 수렴하고, \(|x| > 3\)이면 일반항 \(\left|c_n x^n\right| = (n^2+1)\left(\frac{|x|}{3}\right)^n \to \infty\)이므로 발산합니다. 따라서 수렴반경은 \(R = 3\)입니다.`,
          en: String.raw`By the ratio test the series converges (absolutely) for \(|x| < 3\), and for \(|x| > 3\) the general term \(\left|c_n x^n\right| = (n^2+1)\left(\frac{|x|}{3}\right)^n \to \infty\), so it diverges. Hence the radius of convergence is \(R = 3\).`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'abel-divergent',
    difficulty: 2,
    topics: ['abel-theorem'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=1}^{\infty} n(-1)^n\)은 (보통 의미에서) 발산하지만 Abel 총합가능하며, 그 Abel 합이 \(-\frac{1}{4}\)임을 증명하세요.`,
      en: String.raw`Prove that \(\sum_{n=1}^{\infty} n(-1)^n\) diverges in the ordinary sense but is Abel summable, with Abel sum \(-\frac{1}{4}\).`,
    },
    display: [String.raw`\sum_{n\ge 1} n(-1)^n x^n = -\frac{x}{(1+x)^2} \xrightarrow[x\to 1^{-}]{} -\frac{1}{4}`],
    solution: [
      {
        text: {
          ko: String.raw`먼저 발산: 일반항 \(n(-1)^n\)은 \(0\)으로 수렴하지 않으므로(\(|n(-1)^n| = n \to \infty\)), 제\(n\)항 판정법으로 급수는 발산합니다.`,
          en: String.raw`Divergence first: the general term \(n(-1)^n\) does not tend to \(0\) (since \(|n(-1)^n| = n \to \infty\)), so the series diverges by the \(n\)-th term test.`,
        },
      },
      {
        text: {
          ko: String.raw`\(|z| < 1\)에서 \(\sum_{n=0}^{\infty} z^n = \frac{1}{1-z}\)를 항별 미분하면(멱급수는 수렴원 안에서 항별 미분 가능) \(\sum_{n=1}^{\infty} n z^{n-1} = \frac{1}{(1-z)^2}\)이고, \(z\)를 곱하면 아래 식을 얻습니다.`,
          en: String.raw`For \(|z| < 1\), differentiating \(\sum_{n=0}^{\infty} z^n = \frac{1}{1-z}\) termwise (a power series may be differentiated termwise inside its disc) gives \(\sum_{n=1}^{\infty} n z^{n-1} = \frac{1}{(1-z)^2}\); multiplying by \(z\) yields the formula below.`,
        },
        display: [String.raw`\sum_{n=1}^{\infty} n z^n = \frac{z}{(1-z)^2}`],
      },
      {
        text: {
          ko: String.raw`\(z = -x\) (\(0 \le x < 1\))를 대입하면 \(n(-x)^n = n(-1)^n x^n\)이므로 \(\sum_{n=1}^{\infty} n(-1)^n x^n = \frac{-x}{(1+x)^2}\)입니다. \(x \to 1^{-}\)일 때 이는 \(-\frac{1}{4}\)로 수렴하므로, Abel 합은 \(-\frac{1}{4}\)입니다.

발산하는 급수도 Abel 총합가능할 수 있습니다.`,
          en: String.raw`Substituting \(z = -x\) (\(0 \le x < 1\)) gives \(n(-x)^n = n(-1)^n x^n\), so \(\sum_{n=1}^{\infty} n(-1)^n x^n = \frac{-x}{(1+x)^2}\). As \(x \to 1^{-}\) this tends to \(-\frac{1}{4}\), the Abel sum.

A divergent series can still be Abel summable.`,
        },
      },
    ],
  },
  {
    id: 'ppn-proof',
    difficulty: 2,
    topics: ['rearrangement', 'riemann-rearrangement'],
    statement: {
      ko: String.raw`교대조화급수를 "양항 두 개, 음항 한 개"씩 순서대로 재배열한 급수 \(1+\frac{1}{3}-\frac{1}{2}+\frac{1}{5}+\frac{1}{7}-\frac{1}{4}+\cdots\)가 \(\frac{3}{2}\ln 2\)로 수렴함을 엄밀히 증명하세요.

(\(H_m = \ln m+\gamma+o(1)\)은 알려진 사실로 사용해도 됩니다.)`,
      en: String.raw`Prove rigorously that the rearrangement of the alternating harmonic series taking "two positive terms, then one negative term" in order, \(1+\frac{1}{3}-\frac{1}{2}+\frac{1}{5}+\frac{1}{7}-\frac{1}{4}+\cdots\), converges to \(\frac{3}{2}\ln 2\).

(You may use \(H_m = \ln m+\gamma+o(1)\) as known.)`,
    },
    display: [String.raw`T_{3N} = H_{4N}-\tfrac12 H_{2N}-\tfrac12 H_N \to \tfrac32\ln 2`],
    solution: [
      {
        text: {
          ko: String.raw`이것은 진짜 재배열입니다: 홀수 역수 \(\frac{1}{2k-1}\)와 짝수 역수 \(\frac{1}{2k}\)가 각각 정확히 한 번씩, 순서대로 등장합니다. 처음 \(3N\)개 항의 부분합을 \(T_{3N}\)이라 하면, 사용된 양항은 처음 \(2N\)개의 홀수 역수, 음항은 처음 \(N\)개의 짝수 역수이므로 \(T_{3N} = \sum_{k=1}^{2N}\frac{1}{2k-1}-\sum_{k=1}^{N}\frac{1}{2k}\)입니다.`,
          en: String.raw`This is a genuine rearrangement: the odd reciprocals \(\frac{1}{2k-1}\) and the even reciprocals \(\frac{1}{2k}\) each appear exactly once, in order. Let \(T_{3N}\) be the sum of the first \(3N\) terms; the positive terms used are the first \(2N\) odd reciprocals and the negative terms the first \(N\) even reciprocals, so \(T_{3N} = \sum_{k=1}^{2N}\frac{1}{2k-1}-\sum_{k=1}^{N}\frac{1}{2k}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\sum_{k=1}^{2N}\frac{1}{2k-1} = H_{4N}-\sum_{k=1}^{2N}\frac{1}{2k} = H_{4N}-\frac{1}{2}H_{2N}\)이므로, \(T_{3N} = H_{4N}-\frac{1}{2}H_{2N}-\frac{1}{2}H_N\)입니다.`,
          en: String.raw`Since \(\sum_{k=1}^{2N}\frac{1}{2k-1} = H_{4N}-\sum_{k=1}^{2N}\frac{1}{2k} = H_{4N}-\frac{1}{2}H_{2N}\), we get \(T_{3N} = H_{4N}-\frac{1}{2}H_{2N}-\frac{1}{2}H_N\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(H_m = \ln m+\gamma+\varepsilon_m\) (\(\varepsilon_m \to 0\))를 대입하면 \(T_{3N} = \ln(4N)-\frac{1}{2}\ln(2N)-\frac{1}{2}\ln N+\gamma\left(1-\frac{1}{2}-\frac{1}{2}\right)+o(1)\)입니다. \(\gamma\) 항은 소거되고, 로그 항은 \(\ln 4-\frac{1}{2}\ln 2 = \frac{3}{2}\ln 2\)가 되므로 \(T_{3N} \to \frac{3}{2}\ln 2\)입니다.`,
          en: String.raw`Substituting \(H_m = \ln m+\gamma+\varepsilon_m\) (\(\varepsilon_m \to 0\)) gives \(T_{3N} = \ln(4N)-\frac{1}{2}\ln(2N)-\frac{1}{2}\ln N+\gamma\left(1-\frac{1}{2}-\frac{1}{2}\right)+o(1)\). The \(\gamma\) terms cancel and the logarithms give \(\ln 4-\frac{1}{2}\ln 2 = \frac{3}{2}\ln 2\), so \(T_{3N} \to \frac{3}{2}\ln 2\).`,
        },
      },
      {
        text: {
          ko: String.raw`중간 부분합도 따라갑니다: \(T_{3N+1} = T_{3N}+\frac{1}{4N+1}\), \(T_{3N+2} = T_{3N+1}+\frac{1}{4N+3}\)이고 추가 항들은 \(0\)으로 가므로, 전체 수열 \(T_m\)이 \(\frac{3}{2}\ln 2\)로 수렴합니다. 조건수렴 급수는 재배열에 따라 합이 달라질 수 있습니다.`,
          en: String.raw`The intermediate partial sums follow: \(T_{3N+1} = T_{3N}+\frac{1}{4N+1}\) and \(T_{3N+2} = T_{3N+1}+\frac{1}{4N+3}\), and the added terms tend to \(0\), so the whole sequence \(T_m\) converges to \(\frac{3}{2}\ln 2\). A conditionally convergent series can change its sum under rearrangement.`,
        },
      },
    ],
  },
];
