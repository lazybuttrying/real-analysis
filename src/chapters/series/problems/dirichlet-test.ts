import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Dirichlet's test scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'p1-sine-series',
          statement: {
            ko: String.raw`\(2\pi\)의 배수가 아닌 모든 \(x\)에 대해 \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\)이 수렴함을 보이세요.`,
            en: String.raw`Show that \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\) converges for every \(x\) that is not a multiple of \(2\pi\).`,
          },
          display: [
            String.raw`\sum_{k=1}^{N} \sin(kx) = \frac{\sin\frac{Nx}{2}\,\sin\frac{(N+1)x}{2}}{\sin\frac{x}{2}}`,
            String.raw`\left|\sum_{k=1}^{N} \sin(kx)\right| \le \frac{1}{|\sin(x/2)|}`,
          ],
          preset: { terms: 30, x: 1.0 },
          presetCaption: {
            ko: String.raw`\(x=1\): 부분합 \(\left\lvert\sum_{k \le N}\sin(kx)\right\rvert\)이 \(1/\sin(0.5) \approx 2.0858\) 아래에 갇혀 있습니다.`,
            en: String.raw`\(x=1\): the partial sums \(\left\lvert\sum_{k \le N}\sin(kx)\right\rvert\) stay below \(1/\sin(0.5) \approx 2.0858\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x\)가 \(2\pi\)의 배수가 아니면 \(\sin(x/2) \neq 0\)이다. 곱-합 공식 \(2\sin\frac{x}{2}\sin(kx) = \cos\left(k-\tfrac{1}{2}\right)x - \cos\left(k+\tfrac{1}{2}\right)x\)를 \(k = 1\)부터 \(N\)까지 더하면 망원급수가 되어 \(\sum_{k=1}^{N} \sin(kx) = \frac{\cos\frac{x}{2} - \cos\left(N+\tfrac{1}{2}\right)x}{2\sin\frac{x}{2}} = \frac{\sin\frac{Nx}{2}\sin\frac{(N+1)x}{2}}{\sin\frac{x}{2}}\)이다.`,
                en: String.raw`If \(x\) is not a multiple of \(2\pi\) then \(\sin(x/2) \neq 0\). The product-to-sum identity \(2\sin\frac{x}{2}\sin(kx) = \cos\left(k-\tfrac{1}{2}\right)x - \cos\left(k+\tfrac{1}{2}\right)x\), summed over \(k = 1, \dots, N\), telescopes to \(\sum_{k=1}^{N} \sin(kx) = \frac{\cos\frac{x}{2} - \cos\left(N+\tfrac{1}{2}\right)x}{2\sin\frac{x}{2}} = \frac{\sin\frac{Nx}{2}\sin\frac{(N+1)x}{2}}{\sin\frac{x}{2}}\).`,
              },
            },
            {
              text: {
                ko: String.raw`분자의 두 인자는 각각 절댓값이 \(1\) 이하이므로, 부분합은 \(N\)과 무관하게 \(\left\lvert\sum_{k=1}^{N} \sin(kx)\right\rvert \le \frac{1}{|\sin(x/2)|}\)로 유계이다. \(x = 1\)이면 \(1/\sin(0.5) \approx 2.0858\) — 캡션의 수치와 일치한다.`,
                en: String.raw`Each factor in the numerator has absolute value at most \(1\), so the partial sums are bounded uniformly in \(N\) by \(\left\lvert\sum_{k=1}^{N} \sin(kx)\right\rvert \le \frac{1}{|\sin(x/2)|}\). At \(x = 1\) this is \(1/\sin(0.5) \approx 2.0858\) — matching the caption's figure.`,
              },
            },
            {
              text: {
                ko: String.raw`\(b_n = 1/n\)은 단조 감소하며 \(0\)으로 간다.

\(a_n = \sin(nx)\)의 부분합이 유계이므로 디리클레 판정법(부분합에 의한 합산 변환)에 의해 \(\sum_{n=1}^{\infty} a_n b_n = \sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\)이 수렴한다.

(실제로 \(x \in (0, 2\pi)\)에서 이 급수는 \((\pi - x)/2\)이다.)`,
                en: String.raw`\(b_n = 1/n\) decreases to \(0\).

Since the partial sums of \(a_n = \sin(nx)\) are bounded, Dirichlet's test (summation by parts) gives convergence of \(\sum_{n=1}^{\infty} a_n b_n = \sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\).

(In fact this series equals \((\pi - x)/2\) for \(x \in (0, 2\pi)\).)`,
              },
            },
          ],
        },
        {
          id: 'p2-leibniz-corollary',
          statement: {
            ko: String.raw`라이프니츠 교대급수 판정법이 디리클레 판정법의 따름정리임을 보이세요.`,
            en: String.raw`Show that the Leibniz alternating series test is a corollary of Dirichlet's test.`,
          },
          display: [String.raw`\left|\sum_{n=1}^{N} (-1)^n\right| \le 1`],
          preset: { terms: 30, x: 1.0 },
          presetCaption: {
            ko: String.raw`교대 부호의 부분합 \(\left\lvert\sum_{n \le N}(-1)^n\right\rvert\)은 \(1\) 이하 — 라이프니츠 판정법이 디리클레 판정법의 따름정리입니다.`,
            en: String.raw`The alternating partial sums \(\left\lvert\sum_{n \le N}(-1)^n\right\rvert\) never exceed \(1\) — the Leibniz test is a corollary of Dirichlet's test.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_n = (-1)^n\)이라 두면 부분합은 \(N\)이 짝수일 때 \(0\), 홀수일 때 \(-1\)이다. 따라서 모든 \(N\)에 대해 \(\left\lvert\sum_{n=1}^{N} a_n\right\rvert \le 1\) — 디리클레 판정법의 유계 조건이 성립한다.`,
                en: String.raw`Set \(a_n = (-1)^n\). Its partial sums are \(0\) when \(N\) is even and \(-1\) when \(N\) is odd, so \(\left\lvert\sum_{n=1}^{N} a_n\right\rvert \le 1\) for every \(N\) — the boundedness condition of Dirichlet's test holds.`,
              },
            },
            {
              text: {
                ko: String.raw`라이프니츠 판정법의 가정은 \(b_n \downarrow 0\)이다. 디리클레 판정법을 \((a_n, b_n)\) 쌍에 적용하면 \(\sum_{n=1}^{\infty} (-1)^n b_n\)의 수렴이 바로 따라 나온다 — 교대급수 판정법은 디리클레 판정법에서 \(a_n = (-1)^n\)인 경우이다.`,
                en: String.raw`The Leibniz hypothesis is \(b_n \downarrow 0\). Applying Dirichlet's test to the pair \((a_n, b_n)\) yields convergence of \(\sum_{n=1}^{\infty} (-1)^n b_n\) at once — the alternating series test is Dirichlet's test in the case \(a_n = (-1)^n\).`,
              },
            },
          ],
        },
        {
          id: 'p3-rational-alternating',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty} (-1)^n \frac{n}{n^2+1}\)이 수렴함을 보이세요.`,
            en: String.raw`Show that \(\sum_{n=1}^{\infty} (-1)^n \frac{n}{n^2+1}\) converges.`,
          },
          display: [
            String.raw`b_n = \frac{n}{n^2+1}, \qquad b_n > b_{n+1} \iff n^2+n-1 > 0`,
          ],
          preset: { terms: 30, x: 1.0 },
          presetCaption: {
            ko: String.raw`\(b_1 = 0.5 > b_2 = 0.4 > \cdots\): \(b_n = \frac{n}{n^2+1}\)은 \(n \ge 1\)에서 단조 감소하며 \(0\)으로 갑니다.`,
            en: String.raw`\(b_1 = 0.5 > b_2 = 0.4 > \cdots\): \(b_n = \frac{n}{n^2+1}\) decreases monotonically for \(n \ge 1\) and tends to \(0\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_n = (-1)^n\)의 부분합은 모든 \(N\)에 대해 절댓값이 \(1\) 이하이다(앞 문제와 같음). \(b_n = \frac{n}{n^2+1}\)은 \(0 < b_n < \frac{1}{n}\)이므로 \(b_n \to 0\)이다.`,
                en: String.raw`The partial sums of \(a_n = (-1)^n\) have absolute value at most \(1\) for every \(N\) (as in the previous problem). For \(b_n = \frac{n}{n^2+1}\) we have \(0 < b_n < \frac{1}{n}\), so \(b_n \to 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(b_n\)의 단조성: \(b_n > b_{n+1}\)은 통분하면 \(n\left((n+1)^2+1\right) > (n+1)(n^2+1)\)과 동치이고, 이는 \(n^3+2n^2+2n > n^3+n^2+n+1\), 즉 \(n^2+n-1 > 0\)과 동치이다.

\(n = 1\)에서 \(1^2+1-1 = 1 > 0\)이므로 모든 \(n \ge 1\)에서 성립한다.

따라서 \(b_n \downarrow 0\).`,
                en: String.raw`Monotonicity of \(b_n\): \(b_n > b_{n+1}\) is, after cross-multiplication, \(n\left((n+1)^2+1\right) > (n+1)(n^2+1)\), i.e. \(n^3+2n^2+2n > n^3+n^2+n+1\), i.e. \(n^2+n-1 > 0\).

At \(n = 1\) we have \(1^2+1-1 = 1 > 0\), so this holds for all \(n \ge 1\).

Hence \(b_n \downarrow 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(b_1 = \frac{1}{2} = 0.5 > b_2 = \frac{2}{5} = 0.4\) — 캡션의 수치와 일치한다. 디리클레 판정법에 의해 \(\sum_{n=1}^{\infty} (-1)^n \frac{n}{n^2+1}\)은 수렴한다.`,
                en: String.raw`\(b_1 = \frac{1}{2} = 0.5 > b_2 = \frac{2}{5} = 0.4\) — matching the caption's figures. By Dirichlet's test, \(\sum_{n=1}^{\infty} (-1)^n \frac{n}{n^2+1}\) converges.`,
              },
            },
          ],
        },
      ];
