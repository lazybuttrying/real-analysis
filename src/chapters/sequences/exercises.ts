import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 수열 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'squeeze-sine',
    difficulty: 1,
    topics: ['epsilon-n'],
    statement: {
      ko: String.raw`\(a_n = \frac{n + \sin n}{n^2 + 1}\)이라 하자.

\(\varepsilon\)-\(N\) 논법으로 직접 증명하여 \(\lim_{n \to \infty} a_n = 0\)임을 보이고, 주어진 \(\varepsilon > 0\)에 대해 사용할 수 있는 \(N(\varepsilon)\)을 명시적인 공식으로 구하라.`,
      en: String.raw`Let \(a_n = \frac{n + \sin n}{n^2 + 1}\). Prove directly from the \(\varepsilon\)-\(N\) definition that \(\lim_{n \to \infty} a_n = 0\), and give an explicit formula for a usable \(N(\varepsilon)\) in terms of \(\varepsilon > 0\).`,
    },
    display: [
      String.raw`\left|\frac{n + \sin n}{n^2 + 1}\right| \le \frac{2}{n}`,
      String.raw`N(\varepsilon) = \left\lceil \frac{2}{\varepsilon} \right\rceil`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`분자의 진동 항을 먼저 가둔다. 모든 실수 \(t\)에 대해 \(|\sin t| \le 1\)이므로 \(|n + \sin n| \le n + 1\)이다.

\(n \ge 1\)일 때 \(n + 1 \le 2n\)이고 분모는 \(n^2 + 1 \ge n^2\)이므로`,
          en: String.raw`First trap the oscillating term in the numerator. Since \(|\sin t| \le 1\) for every real \(t\), \(|n + \sin n| \le n + 1\).

For \(n \ge 1\) we have \(n + 1 \le 2n\) and the denominator satisfies \(n^2 + 1 \ge n^2\), so`,
        },
        display: [String.raw`|a_n - 0| = \frac{|n + \sin n|}{n^2 + 1} \le \frac{2n}{n^2} = \frac{2}{n}.`],
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(N(\varepsilon) = \lceil 2/\varepsilon \rceil\)이라 두자. \(n > N\)이면 \(n > 2/\varepsilon\), 즉 \(2/n < \varepsilon\)이다.

위 부등식과 결합하면 \(|a_n - 0| < \varepsilon\)을 얻으므로 \(\varepsilon\)-\(N\) 정의에 의해 \(a_n \to 0\)이다.`,
          en: String.raw`Given \(\varepsilon > 0\), put \(N(\varepsilon) = \lceil 2/\varepsilon \rceil\). If \(n > N\) then \(n > 2/\varepsilon\), i.e. \(2/n < \varepsilon\).

Combined with the estimate above, \(|a_n - 0| < \varepsilon\), so \(a_n \to 0\) by the \(\varepsilon\)-\(N\) definition.`,
        },
      },
    ],
    viz: {
      sceneId: 'epsilon-n',
      preset: { seq: '1/n', epsilon: 0.1 },
      presetCaption: {
        ko: String.raw`\(\varepsilon = 0.1\): 꼬리가 \(\varepsilon\) 띠 안에 완전히 들어가는 순간이 바로 우리가 찾은 \(N\)이다.`,
        en: String.raw`\(\varepsilon = 0.1\): the moment the tail fits entirely inside the \(\varepsilon\)-band is exactly the \(N\) we found.`,
      },
    },
  },
  {
    id: 'rational-approx-sqrt2',
    difficulty: 1,
    topics: ['epsilon-n'],
    statement: {
      ko: String.raw`\(n \ge 1\)에 대해 \(a_n = \frac{\lfloor n\sqrt{2} \rfloor}{n}\)이라 하자. 여기서 \(\lfloor x \rfloor\)는 \(x\) 이하의 가장 큰 정수이다.

(a) 각 \(a_n\)이 유리수임을 보여라. (b) \(\varepsilon\)-\(N\) 논법으로 \(a_n \to \sqrt{2}\)임을 증명하라. (c) \(\sqrt{2}\)가 무리수임을 증명하라. 유리수 수열이 무리수 극한으로 수렴할 수 있음을 결론지어라.`,
      en: String.raw`For \(n \ge 1\) let \(a_n = \frac{\lfloor n\sqrt{2} \rfloor}{n}\), where \(\lfloor x \rfloor\) is the greatest integer \(\le x\).

(a) Show each \(a_n\) is rational. (b) Prove \(a_n \to \sqrt{2}\) from the \(\varepsilon\)-\(N\) definition. (c) Prove \(\sqrt{2}\) is irrational. Conclude that a sequence of rationals can converge to an irrational limit.`,
    },
    display: [
      String.raw`0 \le n\sqrt{2} - \lfloor n\sqrt{2} \rfloor < 1`,
      String.raw`\left|a_n - \sqrt{2}\right| < \frac{1}{n}`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(\lfloor n\sqrt{2} \rfloor\)는 정수이므로 \(a_n\)은 정수 나누기 \(n\) 꼴, 즉 유리수이다.

(b) 내림 함수의 정의에서 \(0 \le n\sqrt{2} - \lfloor n\sqrt{2} \rfloor < 1\)이다. \(n\)으로 나누면 \(|a_n - \sqrt{2}| < 1/n\)을 얻는다. \(\varepsilon > 0\)에 대해 \(N = \lceil 1/\varepsilon \rceil\)이라 두면, \(n > N\)일 때 \(|a_n - \sqrt{2}| < 1/n < \varepsilon\)이므로 \(a_n \to \sqrt{2}\)이다.`,
          en: String.raw`(a) \(\lfloor n\sqrt{2} \rfloor\) is an integer, so \(a_n\) is an integer divided by \(n\): rational.

(b) From the definition of the floor function, \(0 \le n\sqrt{2} - \lfloor n\sqrt{2} \rfloor < 1\). Dividing by \(n\) gives \(|a_n - \sqrt{2}| < 1/n\). For \(\varepsilon > 0\) put \(N = \lceil 1/\varepsilon \rceil\); if \(n > N\) then \(|a_n - \sqrt{2}| < 1/n < \varepsilon\), so \(a_n \to \sqrt{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`(c) \(\sqrt{2} = p/q\) (서로소인 양의 정수 \(p, q\))라 가정하면 \(p^2 = 2q^2\)이다. 따라서 \(p^2\)은 짝수이고, 짝수의 제곱이 짝수이므로 \(p\)도 짝수이다: \(p = 2r\).

대입하면 \(4r^2 = 2q^2\), 즉 \(q^2 = 2r^2\)이므로 같은 논리로 \(q\)도 짝수이다. 이는 \(p, q\)가 서로소라는 가정에 모순이다. 따라서 \(\sqrt{2}\)는 무리수이다.`,
          en: String.raw`(c) Suppose \(\sqrt{2} = p/q\) with coprime positive integers \(p, q\). Then \(p^2 = 2q^2\), so \(p^2\) is even, hence \(p\) is even (an even square has an even root): \(p = 2r\).

Substituting gives \(4r^2 = 2q^2\), i.e. \(q^2 = 2r^2\), so by the same argument \(q\) is even. This contradicts coprimality. Hence \(\sqrt{2}\) is irrational.`,
        },
      },
      {
        text: {
          ko: String.raw`유리수 수열 \((a_n)\)이 무리수 \(\sqrt{2}\)로 수렴하므로, 유리수들의 극한이 유리수이리라는 기대는 거짓이다. 수열의 극한은 원래 집합을 "빠져나갈" 수 있다.`,
          en: String.raw`The rational sequence \((a_n)\) converges to the irrational \(\sqrt{2}\), so the expectation that a limit of rationals stays rational is false. A sequence limit can "escape" the set its terms live in.`,
        },
      },
    ],
  },
  {
    id: 'limsup-two-subseq',
    kind: 'compute',
    difficulty: 1,
    topics: ['limsup-liminf'],
    statement: {
      ko: String.raw`\(a_n = (2 + (-1)^n)\left(1 - \frac{1}{n+1}\right)\)이라 하자.

\(\limsup_{n \to \infty} a_n\)과 \(\liminf_{n \to \infty} a_n\)을 구하고, 부분수열 논증을 이용해 엄밀히 증명하라.`,
      en: String.raw`Let \(a_n = (2 + (-1)^n)\left(1 - \frac{1}{n+1}\right)\). Find \(\limsup_{n \to \infty} a_n\) and \(\liminf_{n \to \infty} a_n\), with a rigorous proof using subsequence arguments.`,
    },
    display: [String.raw`a_{2k} = 3\left(1 - \frac{1}{2k+1}\right), \qquad a_{2k+1} = 1 - \frac{1}{2k+2}`],
    solution: [
      {
        text: {
          ko: String.raw`짝수 항과 홀수 항을 분리한다. \(n = 2k\)일 때 \((-1)^n = 1\)이므로 \(a_{2k} = 3(1 - 1/(2k+1)) \to 3\)이다. \(n = 2k+1\)일 때 \((-1)^n = -1\)이므로 \(a_{2k+1} = 1 - 1/(2k+2) \to 1\)이다.

따라서 \(\limsup a_n \ge 3\)이고 \(\liminf a_n \le 1\)이다.`,
          en: String.raw`Separate even and odd terms. For \(n = 2k\), \((-1)^n = 1\), so \(a_{2k} = 3(1 - 1/(2k+1)) \to 3\). For \(n = 2k+1\), \((-1)^n = -1\), so \(a_{2k+1} = 1 - 1/(2k+2) \to 1\).

Hence \(\limsup a_n \ge 3\) and \(\liminf a_n \le 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`반대 방향 부등식을 위해 모든 항을 가둔다. \(1 \le 2 + (-1)^n \le 3\)이고 \(0 < 1 - 1/(n+1) < 1\)이므로 모든 \(n\)에 대해 \(a_n < 3\)이다. 따라서 \(\limsup a_n \le 3\)이고, 짝수 부분수열과 합쳐 \(\limsup a_n = 3\)을 얻는다.

마찬가지로 \(a_n \ge 1 \cdot (1 - 1/(n+1))\)이고 \(1 - 1/(n+1) \to 1\)이므로 \(\liminf a_n \ge 1\)이다. 홀수 부분수열과 합쳐 \(\liminf a_n = 1\)을 얻는다.`,
          en: String.raw`For the reverse inequalities, trap every term. Since \(1 \le 2 + (-1)^n \le 3\) and \(0 < 1 - 1/(n+1) < 1\), we have \(a_n < 3\) for all \(n\). Hence \(\limsup a_n \le 3\), and with the even subsequence, \(\limsup a_n = 3\).

Likewise \(a_n \ge 1 \cdot (1 - 1/(n+1))\) and \(1 - 1/(n+1) \to 1\), so \(\liminf a_n \ge 1\). With the odd subsequence, \(\liminf a_n = 1\).`,
        },
      },
    ],
    answer: { ko: String.raw`\(\limsup a_n = 3\), \(\liminf a_n = 1\)`, en: String.raw`\(\limsup a_n = 3\), \(\liminf a_n = 1\)` },
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'geometric-mean-cesaro',
    difficulty: 2,
    topics: ['stolz-cesaro', 'limsup-liminf'],
    statement: {
      ko: String.raw`\(a_n > 0\)이고 \(a_n \to L > 0\)이라 하자.

기하평균 \(G_n = (a_1 a_2 \cdots a_n)^{1/n}\)이 \(L\)로 수렴함을 증명하라. (힌트: 로그를 취하면 체사로 평균이 된다.)`,
      en: String.raw`Let \(a_n > 0\) with \(a_n \to L > 0\).

Prove the geometric mean \(G_n = (a_1 a_2 \cdots a_n)^{1/n}\) converges to \(L\). (Hint: taking logarithms turns this into a Cesaro mean.)`,
    },
    display: [
      String.raw`\log G_n = \frac{\log a_1 + \cdots + \log a_n}{n}`,
      String.raw`G_n = \exp\left(\frac{1}{n}\sum_{k=1}^{n} \log a_k\right) \to \exp(\log L) = L`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`\(b_n = \log a_n\)이라 두자. \(L > 0\)에서 로그함수가 연속이므로 \(b_n \to \log L\)이다.

체사로 정리(수열이 수렴하면 산술평균도 같은 극한으로 수렴한다)에 의해`,
          en: String.raw`Put \(b_n = \log a_n\). Since \(\log\) is continuous at \(L > 0\), \(b_n \to \log L\).

By Cesaro's theorem (if a sequence converges, so do its arithmetic means, to the same limit),`,
        },
        display: [String.raw`\frac{b_1 + \cdots + b_n}{n} \longrightarrow \log L \qquad (n \to \infty).`],
      },
      {
        text: {
          ko: String.raw`한편 \(\log G_n = \frac{1}{n}\sum_{k=1}^n \log a_k\)이므로, 지수함수의 연속성에 의해 \(G_n = \exp(\log G_n) \to \exp(\log L) = L\)이다. 조건 \(L > 0\)은 로그를 취하기 위해 필수적이다.`,
          en: String.raw`But \(\log G_n = \frac{1}{n}\sum_{k=1}^n \log a_k\), so by continuity of the exponential, \(G_n = \exp(\log G_n) \to \exp(\log L) = L\). The hypothesis \(L > 0\) is essential for taking logarithms.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'ratio-root-sandwich',
    difficulty: 3,
    topics: ['limsup-liminf', 'stolz-cesaro'],
    statement: {
      ko: String.raw`\(a_n > 0\)인 수열에 대해 다음 부등식을 증명하라: \(\liminf_{n \to \infty} \frac{a_{n+1}}{a_n} \le \liminf_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} \frac{a_{n+1}}{a_n}\).

추가로, \(\frac{a_{n+1}}{a_n} \to L > 0\)이면 로그를 취해 스톨츠-체사로 정리로 \(a_n^{1/n} \to L\)임을 보여라.`,
      en: String.raw`For a sequence with \(a_n > 0\), prove \(\liminf_{n \to \infty} \frac{a_{n+1}}{a_n} \le \liminf_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} a_n^{1/n} \le \limsup_{n \to \infty} \frac{a_{n+1}}{a_n}\).

Additionally, if \(\frac{a_{n+1}}{a_n} \to L > 0\), take logarithms and use the Stolz-Cesaro theorem to show \(a_n^{1/n} \to L\).`,
    },
    display: [
      String.raw`\liminf \frac{a_{n+1}}{a_n} \le \liminf a_n^{1/n} \le \limsup a_n^{1/n} \le \limsup \frac{a_{n+1}}{a_n}`,
      String.raw`\frac{a_{n+1}}{a_n} \to L > 0 \quad \Longrightarrow \quad a_n^{1/n} \to L`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`가운데 부등식 \(\liminf \le \limsup\)은 자명하다. 마지막 부등식을 증명한다. \(R = \limsup a_{n+1}/a_n\)이라 하자. \(R = \infty\)이면 자명하므로 \(R < \infty\)이라 하자.

\(R < \beta < \infty\)인 \(\beta\)를 잡으면, 정의에 의해 \(n \ge N\)일 때 \(a_{n+1}/a_n < \beta\)이다. 따라서 \(k \ge 1\)에 대해 \(a_{N+k} < a_N \beta^k\)이고, \(N+k\) 제곱근을 취하면`,
          en: String.raw`The middle inequality \(\liminf \le \limsup\) is trivial. We prove the last one. Let \(R = \limsup a_{n+1}/a_n\); if \(R = \infty\) there is nothing to prove, so assume \(R < \infty\).

Take \(\beta\) with \(R < \beta < \infty\). By definition, \(a_{n+1}/a_n < \beta\) for \(n \ge N\). Hence \(a_{N+k} < a_N \beta^k\) for \(k \ge 1\), and taking \((N+k)\)-th roots,`,
        },
        display: [String.raw`a_{N+k}^{1/(N+k)} < a_N^{1/(N+k)} \cdot \beta^{k/(N+k)} \longrightarrow 1 \cdot \beta = \beta.`],
      },
      {
        text: {
          ko: String.raw`(\(a_N\)은 고정되어 있고 지수가 \(0\)으로 가므로 \(a_N^{1/(N+k)} \to 1\)이다.) 따라서 \(\limsup a_n^{1/n} \le \beta\)이고, \(\beta \downarrow R\)로 보내면 \(\limsup a_n^{1/n} \le R\)을 얻는다.

첫 번째 부등식은 대칭적이다: \(r = \liminf a_{n+1}/a_n\)이라 하자. \(r = 0\)이면 자명하므로 \(r > 0\)이라 하자. \(0 < \alpha < r\)을 잡으면 \(n \ge N\)일 때 \(a_{n+1}/a_n > \alpha\)이고, \(a_{N+k} > a_N \alpha^k\)에서 \(a_{N+k}^{1/(N+k)} > a_N^{1/(N+k)} \alpha^{k/(N+k)} \to \alpha\)를 얻는다. 따라서 \(\liminf a_n^{1/n} \ge \alpha\)이고, \(\alpha \uparrow r\)로 보내면 \(\liminf a_n^{1/n} \ge r\)이다.`,
          en: String.raw`(\(a_N\) is fixed and the exponent tends to \(0\), so \(a_N^{1/(N+k)} \to 1\).) Hence \(\limsup a_n^{1/n} \le \beta\); letting \(\beta \downarrow R\) gives \(\limsup a_n^{1/n} \le R\).

The first inequality is symmetric: let \(r = \liminf a_{n+1}/a_n\). If \(r = 0\) there is nothing to prove; assume \(r > 0\). Take \(0 < \alpha < r\); then \(a_{n+1}/a_n > \alpha\) for \(n \ge N\), and from \(a_{N+k} > a_N \alpha^k\) we get \(a_{N+k}^{1/(N+k)} > a_N^{1/(N+k)} \alpha^{k/(N+k)} \to \alpha\). So \(\liminf a_n^{1/n} \ge \alpha\), and \(\alpha \uparrow r\) gives \(\liminf a_n^{1/n} \ge r\).`,
        },
      },
      {
        text: {
          ko: String.raw`마지막으로 극한 형태: \(\frac{a_{n+1}}{a_n} \to L > 0\)이면 \(\log a_{n+1} - \log a_n = \log\frac{a_{n+1}}{a_n} \to \log L\)이다. 분자 \(\log a_n\), 분모 \(n\)에 스톨츠-체사로 정리를 적용하면 \(\frac{\log a_n}{n} \to \log L\)이고, 지수화하면 \(a_n^{1/n} = \exp(\frac{\log a_n}{n}) \to \exp(\log L) = L\)이다.

비율 판정법이 근 판정법을 함의하는 이유가 바로 이것이다.`,
          en: String.raw`Finally the limit form: if \(\frac{a_{n+1}}{a_n} \to L > 0\) then \(\log a_{n+1} - \log a_n = \log\frac{a_{n+1}}{a_n} \to \log L\). Applying Stolz-Cesaro to numerator \(\log a_n\) and denominator \(n\) gives \(\frac{\log a_n}{n} \to \log L\), and exponentiating, \(a_n^{1/n} = \exp(\frac{\log a_n}{n}) \to \exp(\log L) = L\).

This is why the ratio test implies the root test.`,
        },
      },
    ],
  },
];
