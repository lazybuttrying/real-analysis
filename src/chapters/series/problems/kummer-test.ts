import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Kummer's test scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/kummer-test.test.ts):
 *   a = 2, p_n = n: K_n = (n-1)/(n+1); K_1 = 0, K_2 = 1/3, K_100 = 99/101 ~= 0.9802;
 *                   K_n >= 1/2 for n >= 3 (K_3 = 1/2 exactly)
 *   a = 1/2, p_n = n: K_n = (-0.5n-1)/(n+1); K_1 = -0.75, K_100 = -51/101 ~= -0.505
 *   a = 2 closed form: a_n = 2/((n+1)(n+2)), telescoping sum = 1
 *   Raabe limit for the Gauss example: n(a_n/a_{n+1}-1) = an/(n+1) -> a
 *   ratio test inconclusive: |a_n/a_{n+1} - 1| = a/(n+1) < 0.02 at n = 500
 */
export const kummerTestProblems: readonly ProblemMeta[] = [
  {
    id: 'kummer-proof',
    statement: {
      ko: String.raw`Kummer 판정법을 증명하세요: \(a_n > 0\), \(p_n > 0\)이고 \(K_n := p_n \frac{a_n}{a_{n+1}} - p_{n+1}\)이라 하자. (i) \(K_n \ge c > 0\)이 결국 성립하면 \(\sum a_n\)은 수렴한다. (ii) \(K_n \le 0\)이 결국 성립하고 \(\sum \frac{1}{p_n}\)이 발산하면 \(\sum a_n\)은 발산한다.`,
      en: String.raw`Prove Kummer's test: let \(a_n > 0\), \(p_n > 0\), and \(K_n := p_n \frac{a_n}{a_{n+1}} - p_{n+1}\). (i) If \(K_n \ge c > 0\) eventually, then \(\sum a_n\) converges. (ii) If \(K_n \le 0\) eventually and \(\sum \frac{1}{p_n}\) diverges, then \(\sum a_n\) diverges.`,
    },
    display: [
      String.raw`K_n \ge c > 0 \quad \Longrightarrow \quad c\, a_{n+1} \le p_n a_n - p_{n+1} a_{n+1}`,
      String.raw`K_n \le 0 \quad \Longrightarrow \quad p_n a_n \le p_{n+1} a_{n+1} \quad \Longrightarrow \quad a_n \ge \frac{d}{p_n}`,
    ],
    preset: { pKind: 'pn', aSel: 'a2', n: 100 },
    presetCaption: {
      ko: String.raw`\(p_n = n\), \(a = 2\), \(n = 100\): \(K_1 = 0\), \(K_2 = \frac13\), \(K_{100} = \frac{99}{101} \approx 0.9802\) — \(n \ge 3\)부터 \(K_n \ge \frac12 > 0\)이므로 급수는 수렴합니다.`,
      en: String.raw`\(p_n = n\), \(a = 2\), \(n = 100\): \(K_1 = 0\), \(K_2 = \frac13\), \(K_{100} = \frac{99}{101} \approx 0.9802\) — \(K_n \ge \frac12 > 0\) for \(n \ge 3\), so the series converges.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`수렴 절반: \(n \ge N\)에서 \(K_n \ge c > 0\)이라 하자. \(K_n = p_n \frac{a_n}{a_{n+1}} - p_{n+1} \ge c\)에 양수 \(a_{n+1}\)을 곱하면 \(p_n a_n - p_{n+1} a_{n+1} \ge c\, a_{n+1}\)이 됩니다.`,
          en: String.raw`Convergent half: suppose \(K_n \ge c > 0\) for \(n \ge N\). Multiplying \(K_n = p_n \frac{a_n}{a_{n+1}} - p_{n+1} \ge c\) by the positive \(a_{n+1}\) gives \(p_n a_n - p_{n+1} a_{n+1} \ge c\, a_{n+1}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n = N\)부터 \(M\)까지 합하면 우변 망원경처럼 상쇄되어 \(c \sum_{n=N}^{M} a_{n+1} \le p_N a_N - p_{M+1} a_{M+1} \le p_N a_N\)이 됩니다 (마지막 부등식은 \(p_{M+1} a_{M+1} > 0\)). 따라서 부분합이 위로 유계인 양항급수이므로 \(\sum a_n\)은 수렴합니다.`,
          en: String.raw`Summing from \(n = N\) to \(M\), the right side telescopes: \(c \sum_{n=N}^{M} a_{n+1} \le p_N a_N - p_{M+1} a_{M+1} \le p_N a_N\) (the last inequality uses \(p_{M+1} a_{M+1} > 0\)). So the partial sums of the positive-term series \(\sum a_n\) are bounded above: \(\sum a_n\) converges.`,
        },
      },
      {
        text: {
          ko: String.raw`발산 절반: \(n \ge N\)에서 \(K_n \le 0\)이라 하자. \(p_n \frac{a_n}{a_{n+1}} \le p_{n+1}\)에 양수 \(a_{n+1}\)을 곱하면 \(p_n a_n \le p_{n+1} a_{n+1}\) — 즉 수열 \(p_n a_n\)이 단조증가하므로, \(n \ge N\)에서 \(p_n a_n \ge p_N a_N =: d > 0\)입니다.`,
          en: String.raw`Divergent half: suppose \(K_n \le 0\) for \(n \ge N\). Multiplying \(p_n \frac{a_n}{a_{n+1}} \le p_{n+1}\) by the positive \(a_{n+1}\) gives \(p_n a_n \le p_{n+1} a_{n+1}\) — so \(p_n a_n\) is increasing, and \(p_n a_n \ge p_N a_N =: d > 0\) for \(n \ge N\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(a_n \ge \frac{d}{p_n}\) (\(n \ge N\))이고, \(\sum \frac{1}{p_n}\)이 발산하므로 비교판정법으로 \(\sum a_n\)도 발산합니다. 직관: \(p_n\)은 탐침(probe)이며, 비율판정법은 \(p_n = 1\), Raabe 판정법은 \(p_n = n\)인 특수경우입니다.`,
          en: String.raw`Hence \(a_n \ge \frac{d}{p_n}\) for \(n \ge N\), and since \(\sum \frac{1}{p_n}\) diverges, comparison gives that \(\sum a_n\) diverges. The intuition: \(p_n\) is a probe, and the ratio test (\(p_n = 1\)) and Raabe's test (\(p_n = n\)) are its special cases.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(p_n = n\), \(a = 2\)): \(K_n = \frac{n-1}{n+1}\)이므로 \(K_1 = 0\), \(K_2 = \frac13\), \(K_{100} = \frac{99}{101} \approx 0.9802\) — 캡션과 일치하며, \(n \ge 3\)에서 \(K_n \ge \frac12\)이므로 \(c = \frac12\)로 수렴 절반이 적용됩니다.`,
          en: String.raw`Numerical check (\(p_n = n\), \(a = 2\)): \(K_n = \frac{n-1}{n+1}\), so \(K_1 = 0\), \(K_2 = \frac13\), \(K_{100} = \frac{99}{101} \approx 0.9802\) — matching the caption, and \(K_n \ge \frac12\) for \(n \ge 3\) puts the convergent half to work with \(c = \frac12\).`,
        },
      },
    ],
  },
  {
    id: 'kummer-raabe',
    statement: {
      ko: String.raw`Raabe 판정법이 Kummer 판정법의 \(p_n = n\)인 경우임을 보이고, \(L := \lim_{n\to\infty} n\left(\frac{a_n}{a_{n+1}} - 1\right)\)에 대해 \(L > 1\)이면 수렴, \(L < 1\)이면 발산함을 증명하세요.`,
      en: String.raw`Show that Raabe's test is Kummer's test with \(p_n = n\), and prove that for \(L := \lim_{n\to\infty} n\left(\frac{a_n}{a_{n+1}} - 1\right)\): convergence if \(L > 1\), divergence if \(L < 1\).`,
    },
    display: [
      String.raw`p_n = n: \qquad K_n = n\left(\frac{a_n}{a_{n+1}} - 1\right) - 1 \;\xrightarrow[n\to\infty]{}\; L - 1`,
    ],
    preset: { pKind: 'pn', aSel: 'a2', n: 100 },
    presetCaption: {
      ko: String.raw`Gauss 예제 \(a = 2\): \(n\left(\frac{a_n}{a_{n+1}} - 1\right) = \frac{2n}{n+1} \to L = 2\), \(K_{100} = \frac{99}{101} \approx 0.9802 \to L - 1 = 1\) — \(L > 1\)이므로 수렴합니다.`,
      en: String.raw`Gauss example \(a = 2\): \(n\left(\frac{a_n}{a_{n+1}} - 1\right) = \frac{2n}{n+1} \to L = 2\), \(K_{100} = \frac{99}{101} \approx 0.9802 \to L - 1 = 1\) — convergent since \(L > 1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(p_n = n\)을 대입하면 \(K_n = n \frac{a_n}{a_{n+1}} - (n+1) = n\left(\frac{a_n}{a_{n+1}} - 1\right) - 1\)이 됩니다. 극한을 취하면 \(K_n \to L - 1\)입니다 — 이것이 바로 Raabe 몫에서 1을 뺀 형태입니다.`,
          en: String.raw`Plugging in \(p_n = n\) gives \(K_n = n \frac{a_n}{a_{n+1}} - (n+1) = n\left(\frac{a_n}{a_{n+1}} - 1\right) - 1\). Taking limits, \(K_n \to L - 1\) — the Raabe quotient shifted by 1.`,
        },
      },
      {
        text: {
          ko: String.raw`\(L > 1\)이면 \(K_n \to L - 1 > 0\)이므로, 결국 \(K_n \ge \frac{L-1}{2} > 0\)이 성립합니다. Kummer 판정법의 수렴 절반(\(c = \frac{L-1}{2}\))에 의해 \(\sum a_n\)은 수렴합니다.`,
          en: String.raw`If \(L > 1\), then \(K_n \to L - 1 > 0\), so eventually \(K_n \ge \frac{L-1}{2} > 0\). Kummer's convergent half (with \(c = \frac{L-1}{2}\)) gives convergence of \(\sum a_n\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(L < 1\)이면 \(K_n \to L - 1 < 0\)이므로, 결국 \(K_n \le \frac{L-1}{2} < 0\)이 성립합니다. 또한 \(\sum \frac{1}{p_n} = \sum \frac{1}{n}\)은 조화급수로 발산하므로, Kummer 판정법의 발산 절반에 의해 \(\sum a_n\)은 발산합니다.`,
          en: String.raw`If \(L < 1\), then \(K_n \to L - 1 < 0\), so eventually \(K_n \le \frac{L-1}{2} < 0\). And \(\sum \frac{1}{p_n} = \sum \frac{1}{n}\) diverges (harmonic series), so Kummer's divergent half gives divergence of \(\sum a_n\).`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (Gauss 예제 \(a = 2\)): \(\frac{a_n}{a_{n+1}} = 1 + \frac{2}{n+1}\)이므로 \(n\left(\frac{a_n}{a_{n+1}} - 1\right) = \frac{2n}{n+1} \to 2 = L\), \(K_n = \frac{2n}{n+1} - 1 = \frac{n-1}{n+1} \to 1 = L - 1\) — \(K_{100} = \frac{99}{101} \approx 0.9802\)는 캡션과 일치합니다.`,
          en: String.raw`Numerical check (Gauss example \(a = 2\)): \(\frac{a_n}{a_{n+1}} = 1 + \frac{2}{n+1}\), so \(n\left(\frac{a_n}{a_{n+1}} - 1\right) = \frac{2n}{n+1} \to 2 = L\) and \(K_n = \frac{2n}{n+1} - 1 = \frac{n-1}{n+1} \to 1 = L - 1\) — \(K_{100} = \frac{99}{101} \approx 0.9802\) matches the caption.`,
        },
      },
    ],
  },
  {
    id: 'kummer-gauss-example',
    statement: {
      ko: String.raw`Gauss 판정법의 따름정리로서: \(a > 0\)인 경우 \(a_n = \frac{n!}{(a+1)(a+2)\cdots(a+n)}\)에 대해 \(\frac{a_n}{a_{n+1}} = 1 + \frac{a}{n} + O\left(\frac{1}{n^2}\right)\) (즉 Gauss \(h = a\))임을 보이고, \(a = 2\)이면 \(\sum a_n\)이 수렴하고 \(a = \frac12\)이면 발산함을 Kummer 판정법으로 증명하세요. (\(a > 0\) 제한이 필요합니다: \(a = -1\)이면 \(n = 1\)에서 분모가 \(0\)이 되고, \(a \le -1\)이면 인자가 \(0\)이 되거나 음수가 되어 Kummer 판정법의 \(a_n > 0\) 가정이 깨집니다.)`,
      en: String.raw`As a corollary of Gauss's test: for \(a > 0\) and \(a_n = \frac{n!}{(a+1)(a+2)\cdots(a+n)}\), show \(\frac{a_n}{a_{n+1}} = 1 + \frac{a}{n} + O\left(\frac{1}{n^2}\right)\) (i.e. Gauss \(h = a\)), then prove via Kummer's test that \(\sum a_n\) converges for \(a = 2\) and diverges for \(a = \frac12\). (The restriction \(a > 0\) is needed: \(a = -1\) makes a denominator \(0\) at \(n = 1\), and \(a \le -1\) can make factors \(0\) or negative, violating Kummer's hypothesis \(a_n > 0\).)`,
    },
    display: [
      String.raw`\frac{a_n}{a_{n+1}} = \frac{n+a+1}{n+1} = 1 + \frac{a}{n+1} = 1 + \frac{a}{n} + O\left(\frac{1}{n^2}\right), \qquad h = a`,
      String.raw`a = 2: \quad K_n = \frac{n-1}{n+1} \to 1 > 0 \;\; (\text{converges}), \qquad a = \tfrac12: \quad K_n = \frac{-0.5n-1}{n+1} \to -\tfrac12 < 0 \;\; (\text{diverges})`,
    ],
    preset: { pKind: 'pn', aSel: 'ahalf', n: 100 },
    presetCaption: {
      ko: String.raw`\(p_n = n\), \(a = \frac12\), \(n = 100\): \(K_1 = -0.75\), \(K_{100} = \frac{-51}{101} \approx -0.505 < 0\) — \(\sum \frac1n\)이 발산하므로 급수도 발산합니다. (같은 \(n\)에서 \(a = 2\)는 \(K_{100} = \frac{99}{101} \approx 0.9802 > 0\)으로 수렴.)`,
      en: String.raw`\(p_n = n\), \(a = \frac12\), \(n = 100\): \(K_1 = -0.75\), \(K_{100} = \frac{-51}{101} \approx -0.505 < 0\) — the series diverges since \(\sum \frac1n\) diverges. (At the same \(n\), \(a = 2\) gives \(K_{100} = \frac{99}{101} \approx 0.9802 > 0\): convergent.)`,
    },
    proof: [
      {
        text: {
          ko: String.raw`비율을 직접 계산하면 \(\frac{a_n}{a_{n+1}} = \frac{n!}{(a+1)\cdots(a+n)} \cdot \frac{(a+1)\cdots(a+n+1)}{(n+1)!} = \frac{n+a+1}{n+1} = 1 + \frac{a}{n+1}\)입니다. 여기서 \(\frac{a}{n+1} = \frac{a}{n} \cdot \frac{n}{n+1} = \frac{a}{n} - \frac{a}{n(n+1)}\)이므로, 이는 Gauss 형태 \(1 + \frac{h}{n} + O\left(\frac{1}{n^2}\right)\)이며 \(h = a\)입니다. 또한 \(\frac{a}{n+1} \to 0\)이므로 비율이 \(1\)로 가서 비율판정법은 무력합니다.`,
          en: String.raw`Computing the ratio directly: \(\frac{a_n}{a_{n+1}} = \frac{n!}{(a+1)\cdots(a+n)} \cdot \frac{(a+1)\cdots(a+n+1)}{(n+1)!} = \frac{n+a+1}{n+1} = 1 + \frac{a}{n+1}\). Since \(\frac{a}{n+1} = \frac{a}{n} \cdot \frac{n}{n+1} = \frac{a}{n} - \frac{a}{n(n+1)}\), this is the Gauss form \(1 + \frac{h}{n} + O\left(\frac{1}{n^2}\right)\) with \(h = a\). And \(\frac{a}{n+1} \to 0\), so the ratio tends to \(1\): the ratio test is powerless.`,
        },
      },
      {
        text: {
          ko: String.raw`\(a = 2\)일 때 닫힌 형태를 확인합니다: \(a_n = \frac{n!}{3 \cdot 4 \cdots (n+2)} = \frac{n! \cdot 2}{(n+2)!} = \frac{2}{(n+1)(n+2)}\)입니다 (분모에 \(1 \cdot 2 = 2\)를 곱해 \((n+2)!\)를 만들었습니다). 실제로 \(a_1 = \frac{1}{3} = \frac{2}{2\cdot 3}\)입니다. 따라서 \(a_n = 2\left(\frac{1}{n+1} - \frac{1}{n+2}\right)\)로 망원경 합이 되어 \(\sum_{n=1}^{M} a_n = 2\left(\frac12 - \frac{1}{M+2}\right) \to 1\) — 급수는 \(1\)로 수렴합니다.`,
          en: String.raw`For \(a = 2\) we verify the closed form: \(a_n = \frac{n!}{3 \cdot 4 \cdots (n+2)} = \frac{n! \cdot 2}{(n+2)!} = \frac{2}{(n+1)(n+2)}\) (multiplying top and bottom by \(1 \cdot 2 = 2\) completes \((n+2)!\)). Indeed \(a_1 = \frac{1}{3} = \frac{2}{2\cdot 3}\). So \(a_n = 2\left(\frac{1}{n+1} - \frac{1}{n+2}\right)\) telescopes: \(\sum_{n=1}^{M} a_n = 2\left(\frac12 - \frac{1}{M+2}\right) \to 1\) — the series sums to \(1\).`,
        },
      },
      {
        text: {
          ko: String.raw`Kummer 몫 (\(p_n = n\))으로 다시 봅니다. \(K_n = n\frac{n+a+1}{n+1} - (n+1) = \frac{(a-1)n - 1}{n+1} \to a - 1\)입니다. \(a = 2\)이면 \(K_n = \frac{n-1}{n+1} \to 1 > 0\) (\(n \ge 3\)에서 \(K_n \ge \frac12\))이므로 Kummer 수렴 절반으로 수렴 — 닫힌 형태의 망원경 합과 일치합니다 (\(K_{100} = \frac{99}{101} \approx 0.9802\)).`,
          en: String.raw`Back to the Kummer quotient (\(p_n = n\)): \(K_n = n\frac{n+a+1}{n+1} - (n+1) = \frac{(a-1)n - 1}{n+1} \to a - 1\). For \(a = 2\), \(K_n = \frac{n-1}{n+1} \to 1 > 0\) (with \(K_n \ge \frac12\) for \(n \ge 3\)), so Kummer's convergent half gives convergence — agreeing with the telescoping closed form (\(K_{100} = \frac{99}{101} \approx 0.9802\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(a = \frac12\)이면 \(K_n = \frac{-0.5n-1}{n+1} \to -\frac12 < 0\)이므로 결국 \(K_n \le 0\)입니다. \(\sum \frac{1}{p_n} = \sum \frac{1}{n}\)이 발산하므로 Kummer 발산 절반에 의해 \(\sum a_n\)은 발산합니다 (\(K_1 = -0.75\), \(K_{100} = \frac{-51}{101} \approx -0.505\) — 캡션과 일치).`,
          en: String.raw`For \(a = \frac12\), \(K_n = \frac{-0.5n-1}{n+1} \to -\frac12 < 0\), so eventually \(K_n \le 0\). Since \(\sum \frac{1}{p_n} = \sum \frac{1}{n}\) diverges, Kummer's divergent half gives divergence of \(\sum a_n\) (\(K_1 = -0.75\), \(K_{100} = \frac{-51}{101} \approx -0.505\) — matching the caption).`,
        },
      },
    ],
  },
];
