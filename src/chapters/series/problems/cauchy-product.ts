import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Cauchy product scene.
 * Imports nothing except types. Every number below was verified against the model:
 *   preset { n: 12, pair: 'exp' }: c_12 = 2^12/12! ~= 8.551120e-6,
 *     C_12 ~= 7.3890546, A_12*B_12 ~= 7.3890561;
 *   preset { n: 10, pair: 'exp' }: c_10 = 2^10/10! ~= 2.821869e-4,
 *     C_10 ~= 7.3889947, A_10*B_10 ~= 7.3890560;
 *   preset { n: 20, pair: 'alternating' }: |c_20| ~= 2.516872
 *     (>= 2*21/22 ~= 1.909091 >= 1), C_20 ~= 1.627909, A_20*B_20 ~= 0.507955.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'cauchy-product-mertens',
    statement: {
      ko: String.raw`메르텐스 정리(Mertens' theorem)를 증명하세요: \(\sum a_n\)이 \(A\)로 절대수렴하고 \(\sum b_n\)이 \(B\)로 수렴하면, 코시 곱 \(c_n = \sum_{k=0}^{n} a_k b_{n-k}\)의 급수 \(\sum c_n\)은 \(AB\)로 수렴합니다.`,
      en: String.raw`Prove Mertens' theorem: if \(\sum a_n\) converges absolutely to \(A\) and \(\sum b_n\) converges to \(B\), then the Cauchy product \(c_n = \sum_{k=0}^{n} a_k b_{n-k}\) satisfies \(\sum c_n = AB\).`,
    },
    display: [
      String.raw`C_N = \sum_{n=0}^{N} c_n = \sum_{k=0}^{N} a_k B_{N-k},\qquad B_M = \sum_{m=0}^{M} b_m`,
      String.raw`C_N - AB = (A_N - A)B - \sum_{k=0}^{N} a_k R_{N-k},\qquad R_M = B - B_M \to 0`,
      String.raw`\left|\sum_{k=0}^{N-M-1} a_k R_{N-k}\right| \leq \varepsilon \sum_{k=0}^{\infty} |a_k|`,
    ],
    preset: { n: 12, pair: 'exp' },
    presetCaption: {
      ko: String.raw`\(n = 12\), \(a_k = b_k = 1/k!\): \(C_{12} \approx 7.3890546\)이고 \(A_{12}B_{12} \approx 7.3890561\) — 두 수열이 함께 \(e^2\)로 올라가며, \(c_{12} = 2^{12}/12! \approx 8.55 \times 10^{-6}\)이다.`,
      en: String.raw`\(n = 12\), \(a_k = b_k = 1/k!\): \(C_{12} \approx 7.3890546\) and \(A_{12}B_{12} \approx 7.3890561\) — the two sequences climb to \(e^2\) together, with \(c_{12} = 2^{12}/12! \approx 8.55 \times 10^{-6}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`부분합 \(A_N, B_N, C_N\)을 쓰자. \(C_N = \sum_{n=0}^{N}\sum_{k=0}^{n} a_k b_{n-k}\)에서 \(m = n-k\)로 치환하면 각 항이 \(a_k b_m\) (\(k + m \leq N\))인 유한합이 되므로, 합산 순서를 바꿔 \(C_N = \sum_{k=0}^{N} a_k \left(\sum_{m=0}^{N-k} b_m\right) = \sum_{k=0}^{N} a_k B_{N-k}\)를 얻는다. 유한합이므로 이 재배열은 합법적이다.`,
          en: String.raw`Write \(A_N, B_N, C_N\) for the partial sums. In \(C_N = \sum_{n=0}^{N}\sum_{k=0}^{n} a_k b_{n-k}\), substituting \(m = n-k\) turns each term into \(a_k b_m\) with \(k + m \leq N\), so reordering the finite sum gives \(C_N = \sum_{k=0}^{N} a_k \left(\sum_{m=0}^{N-k} b_m\right) = \sum_{k=0}^{N} a_k B_{N-k}\). This rearrangement is legal because the sum is finite.`,
        },
      },
      {
        text: {
          ko: String.raw`나머지 \(R_M = B - B_M \to 0\)을 두면 \(B_{N-k} = B - R_{N-k}\)이므로 \(C_N = A_N B - \sum_{k=0}^{N} a_k R_{N-k}\)이고, 따라서 \(C_N - AB = (A_N - A)B - \sum_{k=0}^{N} a_k R_{N-k}\)이다. \(A_N \to A\)이므로 첫 항은 \(0\)으로 간다.`,
          en: String.raw`With the remainder \(R_M = B - B_M \to 0\), \(B_{N-k} = B - R_{N-k}\), so \(C_N = A_N B - \sum_{k=0}^{N} a_k R_{N-k}\), hence \(C_N - AB = (A_N - A)B - \sum_{k=0}^{N} a_k R_{N-k}\). The first term tends to \(0\) because \(A_N \to A\).`,
        },
      },
      {
        text: {
          ko: String.raw`둘째 항을 제어한다. 절대수렴이므로 \(\alpha = \sum_{k=0}^{\infty} |a_k| < \infty\)이다. \(\varepsilon > 0\)가 주어지면 \(m > M\)일 때 \(|R_m| < \varepsilon\)인 \(M\)을 잡는다. 합을 \(k \leq N-M-1\)과 \(k \geq N-M\)으로 나누면, 앞부분은 \(|R_{N-k}| < \varepsilon\)이므로 \(\left|\sum_{k=0}^{N-M-1} a_k R_{N-k}\right| \leq \varepsilon \alpha\)이다.`,
          en: String.raw`Control the second term. Absolute convergence gives \(\alpha = \sum_{k=0}^{\infty} |a_k| < \infty\). Given \(\varepsilon > 0\), pick \(M\) with \(|R_m| < \varepsilon\) for \(m > M\). Split the sum at \(k = N-M\): on the head, \(|R_{N-k}| < \varepsilon\), so \(\left|\sum_{k=0}^{N-M-1} a_k R_{N-k}\right| \leq \varepsilon \alpha\).`,
        },
      },
      {
        text: {
          ko: String.raw`뒷부분은 항이 \(M+1\)개뿐이다: \(\left|\sum_{k=N-M}^{N} a_k R_{N-k}\right| \leq \left(\max_{0 \leq m \leq M} |R_m|\right) \cdot \max_{N-M \leq k \leq N} |a_k|\)인데, 절대수렴하는 급수의 항은 \(0\)으로 가므로 \(a_k \to 0\)이고, 이 최댓값은 \(N \to \infty\)일 때 \(0\)으로 간다. 따라서 \(\limsup_{N \to \infty} \left|\sum_{k=0}^{N} a_k R_{N-k}\right| \leq \varepsilon \alpha\)이고, \(\varepsilon\)이 임의이므로 이 합은 \(0\)으로 간다.`,
          en: String.raw`The tail has only \(M+1\) terms: \(\left|\sum_{k=N-M}^{N} a_k R_{N-k}\right| \leq \left(\max_{0 \leq m \leq M} |R_m|\right) \cdot \max_{N-M \leq k \leq N} |a_k|\), and since an absolutely convergent series has \(a_k \to 0\), this maximum tends to \(0\) as \(N \to \infty\). Hence \(\limsup_{N \to \infty} \left|\sum_{k=0}^{N} a_k R_{N-k}\right| \leq \varepsilon \alpha\), and \(\varepsilon\) was arbitrary, so the sum tends to \(0\).`,
        },
      },
      {
        text: {
          ko: String.raw`두 항 모두 \(0\)으로 가므로 \(C_N - AB \to 0\), 즉 \(\sum c_n = AB\)이다. 핵심은 \(\varepsilon \alpha\) 단계였다: 꼬리 \(\sum a_k R_{N-k}\)를 절대수렴 급수 \(\sum |a_k|\)로 눌렀기 때문에 \(R_{N-k}\)가 균일하게 작아진다 — 조건수렴인 \(b\) 쪽만으로는 이 제어가 안 된다 (문제 3의 반례).`,
          en: String.raw`Both terms tend to \(0\), so \(C_N - AB \to 0\), i.e. \(\sum c_n = AB\). The crux was the \(\varepsilon \alpha\) step: the absolutely convergent \(\sum |a_k|\) crushes the tail \(\sum a_k R_{N-k}\) so that \(R_{N-k}\) is uniformly small — the conditionally convergent \(b\) side alone cannot do this (see the counterexample in problem 3).`,
        },
      },
    ],
  },
  {
    id: 'cauchy-product-exp',
    statement: {
      ko: String.raw`지수급수 \(\sum_{k=0}^{\infty} 1/k! = e\)를 자기 자신과 코시 곱하면 \(e^2\)이 됨을 보이세요: \(c_n = \sum_{k=0}^{n} \frac{1}{k!(n-k)!} = \frac{2^n}{n!}\)임을 이항정리로 증명하고, \(\sum c_n = e^2\)임을 메르텐스 정리로 정당화하세요.`,
      en: String.raw`Show that the Cauchy product of the exponential series \(\sum_{k=0}^{\infty} 1/k! = e\) with itself is \(e^2\): prove \(c_n = \sum_{k=0}^{n} \frac{1}{k!(n-k)!} = \frac{2^n}{n!}\) by the binomial theorem, and justify \(\sum c_n = e^2\) via Mertens' theorem.`,
    },
    display: [
      String.raw`c_n = \sum_{k=0}^{n} \frac{1}{k!(n-k)!} = \frac{1}{n!} \sum_{k=0}^{n} \binom{n}{k} = \frac{2^n}{n!}`,
      String.raw`\sum_{n=0}^{\infty} c_n = \sum_{n=0}^{\infty} \frac{2^n}{n!} = e^2`,
    ],
    preset: { n: 10, pair: 'exp' },
    presetCaption: {
      ko: String.raw`\(n = 10\): \(c_{10} = 2^{10}/10! \approx 2.82 \times 10^{-4}\), \(C_{10} \approx 7.3889947\), \(A_{10}B_{10} \approx 7.3890560\) — 코시 곱 부분합과 부분합의 곱이 함께 \(e^2\)에 접근한다.`,
      en: String.raw`\(n = 10\): \(c_{10} = 2^{10}/10! \approx 2.82 \times 10^{-4}\), \(C_{10} \approx 7.3889947\), \(A_{10}B_{10} \approx 7.3890560\) — the Cauchy-product partial sums and the product of partial sums approach \(e^2\) together.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a_k = b_k = 1/k!\)로 두면 코시 곱의 항은 \(c_n = \sum_{k=0}^{n} \frac{1}{k!} \cdot \frac{1}{(n-k)!}\)이다. 분모에 \(n!\)을 곱하고 나누면 \(\frac{1}{k!(n-k)!} = \frac{1}{n!} \binom{n}{k}\)이므로, \(c_n = \frac{1}{n!} \sum_{k=0}^{n} \binom{n}{k}\)이다.`,
          en: String.raw`With \(a_k = b_k = 1/k!\), the Cauchy-product term is \(c_n = \sum_{k=0}^{n} \frac{1}{k!} \cdot \frac{1}{(n-k)!}\). Multiplying and dividing by \(n!\) gives \(\frac{1}{k!(n-k)!} = \frac{1}{n!} \binom{n}{k}\), so \(c_n = \frac{1}{n!} \sum_{k=0}^{n} \binom{n}{k}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이항정리 \((1+1)^n = \sum_{k=0}^{n} \binom{n}{k}\)에 의해 안쪽 합은 \(2^n\)이므로 \(c_n = \frac{2^n}{n!}\)이다. 따라서 코시 곱 급수는 \(\sum_{n=0}^{\infty} c_n = \sum_{n=0}^{\infty} \frac{2^n}{n!}\)인데, 이는 지수급수에 \(x = 2\)를 대입한 것으로 합이 \(e^2\)이다.`,
          en: String.raw`By the binomial theorem \((1+1)^n = \sum_{k=0}^{n} \binom{n}{k}\), the inner sum is \(2^n\), so \(c_n = \frac{2^n}{n!}\). The Cauchy-product series is therefore \(\sum_{n=0}^{\infty} c_n = \sum_{n=0}^{\infty} \frac{2^n}{n!}\), which is the exponential series at \(x = 2\), summing to \(e^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`이 계산이 정당한 이유는 지수급수가 절대수렴하기 때문이다: 비율 판정법으로 \(\frac{1/(k+1)!}{1/k!} = \frac{1}{k+1} \to 0\)이므로 메르텐스 정리(문제 1)를 적용할 수 있고, \(\sum c_n = e \cdot e = e^2\)를 얻는다 — \(e^1 \cdot e^1 = e^2\)이라는 지수법칙의 급수 버전이다.`,
          en: String.raw`This computation is legitimate because the exponential series converges absolutely: the ratio test gives \(\frac{1/(k+1)!}{1/k!} = \frac{1}{k+1} \to 0\), so Mertens' theorem (problem 1) applies and yields \(\sum c_n = e \cdot e = e^2\) — the series version of the exponent law \(e^1 \cdot e^1 = e^2\).`,
        },
      },
    ],
  },
  {
    id: 'cauchy-product-diverges',
    statement: {
      ko: String.raw`\(a_k = b_k = \frac{(-1)^k}{\sqrt{k+1}}\)로 두세요. 두 급수 \(\sum a_k\), \(\sum b_k\)는 모두 수렴하지만, \(|c_n| \geq \frac{2(n+1)}{n+2} \geq 1\)임을 보여 코시 곱 \(\sum c_n\)이 발산함을 증명하세요. (힌트: 산술-기하 평균 부등식.)`,
      en: String.raw`Put \(a_k = b_k = \frac{(-1)^k}{\sqrt{k+1}}\). Both series \(\sum a_k\), \(\sum b_k\) converge, but show \(|c_n| \geq \frac{2(n+1)}{n+2} \geq 1\) to prove the Cauchy product \(\sum c_n\) diverges. (Hint: AM-GM.)`,
    },
    display: [
      String.raw`|c_n| = \sum_{k=0}^{n} \frac{1}{\sqrt{(k+1)(n-k+1)}} \geq (n+1)\cdot\frac{2}{n+2} \geq 1`,
      String.raw`(k+1)(n-k+1) \leq \left(\frac{(k+1)+(n-k+1)}{2}\right)^2 = \left(\frac{n+2}{2}\right)^2`,
      String.raw`c_n \not\to 0 \quad\Longrightarrow\quad \sum c_n \text{ diverges}`,
    ],
    preset: { n: 20, pair: 'alternating' },
    presetCaption: {
      ko: String.raw`\(n = 20\): \(|c_{20}| \approx 2.516872 \geq 1.909091 \geq 1\)이므로 \(c_n \not\to 0\)이다. \(C_{20} \approx 1.627909\)는 표류하고 \(A_{20}B_{20} \approx 0.507955\)도 수렴하지 않는다.`,
      en: String.raw`\(n = 20\): \(|c_{20}| \approx 2.516872 \geq 1.909091 \geq 1\), so \(c_n \not\to 0\). \(C_{20} \approx 1.627909\) drifts and \(A_{20}B_{20} \approx 0.507955\) does not settle either.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 두 인자 급수는 수렴한다: \(a_k = \frac{(-1)^k}{\sqrt{k+1}}\)는 부호가 교대하고 \(\frac{1}{\sqrt{k+1}}\)이 \(0\)으로 단조 감소하므로 라이프니츠 판정법이 적용된다. 그러나 \(\sum |a_k| = \sum \frac{1}{\sqrt{k+1}}\)는 \(p = \frac12\)인 \(p\)-급수라 발산하므로, 수렴은 조건수렴이다.`,
          en: String.raw`First, both factor series converge: \(a_k = \frac{(-1)^k}{\sqrt{k+1}}\) alternates in sign and \(\frac{1}{\sqrt{k+1}}\) decreases monotonically to \(0\), so Leibniz's test applies. But \(\sum |a_k| = \sum \frac{1}{\sqrt{k+1}}\) is a \(p\)-series with \(p = \frac12\), hence diverges — the convergence is conditional.`,
        },
      },
      {
        text: {
          ko: String.raw`코시 곱의 항을 계산하면 \(c_n = \sum_{k=0}^{n} \frac{(-1)^k}{\sqrt{k+1}} \cdot \frac{(-1)^{n-k}}{\sqrt{n-k+1}} = (-1)^n \sum_{k=0}^{n} \frac{1}{\sqrt{(k+1)(n-k+1)}}\)이므로, \(|c_n| = \sum_{k=0}^{n} \frac{1}{\sqrt{(k+1)(n-k+1)}}\)이다.`,
          en: String.raw`The Cauchy-product term is \(c_n = \sum_{k=0}^{n} \frac{(-1)^k}{\sqrt{k+1}} \cdot \frac{(-1)^{n-k}}{\sqrt{n-k+1}} = (-1)^n \sum_{k=0}^{n} \frac{1}{\sqrt{(k+1)(n-k+1)}}\), so \(|c_n| = \sum_{k=0}^{n} \frac{1}{\sqrt{(k+1)(n-k+1)}}\).`,
        },
      },
      {
        text: {
          ko: String.raw`산술-기하 평균 부등식으로 \((k+1)(n-k+1) \leq \left(\frac{(k+1)+(n-k+1)}{2}\right)^2 = \left(\frac{n+2}{2}\right)^2\)이다. 따라서 각 피가수 \(\frac{1}{\sqrt{(k+1)(n-k+1)}} \geq \frac{2}{n+2}\)이고, 항이 \(n+1\)개이므로 \(|c_n| \geq (n+1)\cdot\frac{2}{n+2} = \frac{2(n+1)}{n+2}\)이다. \(n \geq 0\)에서 \(\frac{2(n+1)}{n+2} \geq 1\)이므로 \(|c_n| \geq 1\)이다 (실제로 \(|c_n| \to 2\)).`,
          en: String.raw`By AM-GM, \((k+1)(n-k+1) \leq \left(\frac{(k+1)+(n-k+1)}{2}\right)^2 = \left(\frac{n+2}{2}\right)^2\). Hence each summand \(\frac{1}{\sqrt{(k+1)(n-k+1)}} \geq \frac{2}{n+2}\), and with \(n+1\) summands, \(|c_n| \geq (n+1)\cdot\frac{2}{n+2} = \frac{2(n+1)}{n+2}\). Since \(\frac{2(n+1)}{n+2} \geq 1\) for \(n \geq 0\), \(|c_n| \geq 1\) (in fact \(|c_n| \to 2\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|c_n| \geq 1\)이므로 \(c_n \not\to 0\)이고, \(n\)번째 항 판정법으로 \(\sum c_n\)은 발산한다. 두 급수가 각각 수렴해도 코시 곱은 발산할 수 있다 — 메르텐스 정리(문제 1)에서 한쪽의 절대수렴은 빼도 되는 가정이 아니라 본질적인 조건이다.`,
          en: String.raw`Since \(|c_n| \geq 1\), \(c_n \not\to 0\), and the \(n\)-th term test gives that \(\sum c_n\) diverges. Two convergent series can have a divergent Cauchy product — absolute convergence of one factor in Mertens' theorem (problem 1) is not a removable hypothesis but an essential one.`,
        },
      },
    ],
  },
];
