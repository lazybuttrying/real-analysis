import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Cauchy condensation test scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/condensation.test.ts):
 *   series 1/n, block 2 [4,8):  B_2 = 0.7595, C_2 = 1,        C_3/2 = 0.5
 *   series 1/n^2, block 2 [4,8): B_2 = 0.1507, C_2 = 0.25,    C_3/2 = 0.0625
 *   series 1/(n ln n), block 2 [4,8): B_2 = 0.4710, C_2 = 1/(2 ln 2) = 0.7213, C_3/2 = 1/(6 ln 2) = 0.2404
 *   1/(ln 2)^2 = 2.0814, (1/(ln 2)^2)(pi^2/6) = 3.4237
 */
export const condensationProblems: readonly ProblemMeta[] = [
  {
    id: 'condensation-proof',
    statement: {
      ko: String.raw`\(a_n \ge 0\)이 감소수열일 때, \(\sum_{n=1}^{\infty} a_n\)이 수렴하면 \(\sum_{n=0}^{\infty} 2^n a_{2^n}\)도 수렴하고 그 역도 성립함을 증명하세요 (코시 응축 판정법).`,
      en: String.raw`Let \(a_n \ge 0\) be decreasing. Prove that \(\sum_{n=1}^{\infty} a_n\) converges if and only if \(\sum_{n=0}^{\infty} 2^n a_{2^n}\) converges (the Cauchy condensation test).`,
    },
    display: [
      String.raw`2^n a_{2^{n+1}} \le \sum_{k=2^n}^{2^{n+1}-1} a_k \le 2^n a_{2^n}, \qquad C_n := 2^n a_{2^n}`,
    ],
    preset: { series: 'inv-n', block: 2 },
    presetCaption: {
      ko: String.raw`\(n=2\) 블록 \([4, 8)\): \(0.5 = \frac{1}{2}C_3 \le B_2 \approx 0.7595 \le C_2 = 1\) — 블록 합이 두 응축 항 사이에 끼어 있습니다.`,
      en: String.raw`Block \(n=2\) \([4, 8)\): \(0.5 = \frac{1}{2}C_3 \le B_2 \approx 0.7595 \le C_2 = 1\) — the block sum sits between the condensed terms.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`블록 \(n\)은 \([2^n, 2^{n+1})\) 구간에 \(2^n\)개의 항을 갖습니다.

감소수열이므로 각 항은 \(a_{2^n}\) 이하, \(a_{2^{n+1}}\) 이상입니다.

따라서 블록 합 \(B_n = \sum_{k=2^n}^{2^{n+1}-1} a_k\)는
\(\frac{1}{2}C_{n+1} = 2^n a_{2^{n+1}} \le B_n \le 2^n a_{2^n} = C_n\)을 만족합니다 (\(C_n := 2^n a_{2^n}\)).`,
          en: String.raw`Block \(n\) holds \(2^n\) terms in \([2^n, 2^{n+1})\).

Since the sequence decreases, each term is at most \(a_{2^n}\) and at least \(a_{2^{n+1}}\).

Hence the block sum \(B_n = \sum_{k=2^n}^{2^{n+1}-1} a_k\) satisfies \(\frac{1}{2}C_{n+1} = 2^n a_{2^{n+1}} \le B_n \le 2^n a_{2^n} = C_n\) (with \(C_n := 2^n a_{2^n}\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) \(B_j \le C_j\)를 \(j = 0\)부터 \(N\)까지 더하면 \(S_{2^{N+1}-1} = \sum_{j=0}^{N} B_j \le \sum_{j=0}^{N} C_j = T_N\)입니다.

\(\sum C_j\)가 수렴하면 \(T_N \le T := \sum_{j=0}^{\infty} C_j < \infty\)입니다.

이진 부분합만이 아니라 모든 부분합으로 확장합니다: 임의의 \(m\)에 대해 \(m \le 2^{N+1} - 1\)인 \(N\)을 잡으면, \(a_k \ge 0\)이므로 \(S_m\)은 증가하고 \(S_m \le S_{2^{N+1}-1} \le T_N \le T\)입니다.

따라서 \(\sum a_n\)의 모든 부분합이 유계가 되어 수렴합니다.`,
          en: String.raw`\((\Leftarrow)\) Summing \(B_j \le C_j\) for \(j = 0\) to \(N\) gives \(S_{2^{N+1}-1} = \sum_{j=0}^{N} B_j \le \sum_{j=0}^{N} C_j = T_N\).

If \(\sum C_j\) converges, then \(T_N \le T := \sum_{j=0}^{\infty} C_j < \infty\).

Extend from binary partial sums to all partial sums: for arbitrary \(m\), choose \(N\) with \(m \le 2^{N+1} - 1\); since \(a_k \ge 0\), \(S_m\) is increasing, so \(S_m \le S_{2^{N+1}-1} \le T_N \le T\).

Hence all partial sums of \(\sum a_n\) are bounded and converge.`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Rightarrow)\) 반대로 \(C_{j+1} \le 2 B_j\)를 \(j = 0\)부터 \(N\)까지 더하면 \(T_{N+1} - C_0 = \sum_{j=1}^{N+1} C_j \le 2 \sum_{j=0}^{N} B_j = 2 S_{2^{N+1}-1}\)입니다. \(\sum a_n\)이 수렴하면 오른쪽이 유계이므로 \(\sum C_j\)의 부분합도 유계가 되어 수렴합니다.`,
          en: String.raw`\((\Rightarrow)\) Conversely, summing \(C_{j+1} \le 2 B_j\) for \(j = 0\) to \(N\) gives \(T_{N+1} - C_0 = \sum_{j=1}^{N+1} C_j \le 2 \sum_{j=0}^{N} B_j = 2 S_{2^{N+1}-1}\). If \(\sum a_n\) converges, the right side is bounded, so the partial sums of \(\sum C_j\) are bounded and converge.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (조화급수 \(a_n = 1/n\), 블록 \(n = 2\)): \(B_2 = \frac{1}{4} + \frac{1}{5} + \frac{1}{6} + \frac{1}{7} \approx 0.7595\), \(C_2 = 4 \cdot \frac{1}{4} = 1\), \(\frac{1}{2}C_3 = 8 \cdot \frac{1}{8} \cdot \frac{1}{2} = 0.5\) — 캡션의 부등식 \(0.5 \le 0.7595 \le 1\)과 일치합니다.`,
          en: String.raw`Numerical check (harmonic series \(a_n = 1/n\), block \(n = 2\)): \(B_2 = \frac{1}{4} + \frac{1}{5} + \frac{1}{6} + \frac{1}{7} \approx 0.7595\), \(C_2 = 4 \cdot \frac{1}{4} = 1\), \(\frac{1}{2}C_3 = \frac{1}{2} \cdot 8 \cdot \frac{1}{8} = 0.5\) — matching the caption's sandwich \(0.5 \le 0.7595 \le 1\).`,
        },
      },
    ],
  },
  {
    id: 'condensation-p-series',
    statement: {
      ko: String.raw`응축 판정법을 이용해 \(p\)-급수 \(\sum_{n=1}^{\infty} \frac{1}{n^p}\)가 \(p > 1\)일 때 수렴하고 \(p \le 1\)일 때 발산함을 보이세요.`,
      en: String.raw`Use the condensation test to show that the \(p\)-series \(\sum_{n=1}^{\infty} \frac{1}{n^p}\) converges for \(p > 1\) and diverges for \(p \le 1\).`,
    },
    display: [
      String.raw`2^n \cdot \frac{1}{(2^n)^p} = 2^{n(1-p)} = (2^{1-p})^n \quad \text{(geometric series)}`,
    ],
    preset: { series: 'inv-n2', block: 2 },
    presetCaption: {
      ko: String.raw`\(p = 2\), 블록 \([4, 8)\): \(0.0625 = \frac{1}{2}C_3 \le B_2 \approx 0.1507 \le C_2 = 0.25\) — 응축 항은 공비 \(1/2\)인 등비급수입니다.`,
      en: String.raw`\(p = 2\), block \([4, 8)\): \(0.0625 = \frac{1}{2}C_3 \le B_2 \approx 0.1507 \le C_2 = 0.25\) — the condensed terms are geometric with ratio \(1/2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(p > 0\)일 때 \(a_n = \frac{1}{n^p}\)는 감소하는 양수열입니다. 응축 항은 \(C_n = 2^n \cdot \frac{1}{(2^n)^p} = 2^n \cdot 2^{-np} = 2^{n(1-p)} = (2^{1-p})^n\)으로 공비가 \(r = 2^{1-p}\)인 등비급수입니다.`,
          en: String.raw`For \(p > 0\), \(a_n = \frac{1}{n^p}\) is a decreasing sequence of positive numbers. The condensed terms are \(C_n = 2^n \cdot \frac{1}{(2^n)^p} = 2^n \cdot 2^{-np} = 2^{n(1-p)} = (2^{1-p})^n\), a geometric series with ratio \(r = 2^{1-p}\).`,
        },
      },
      {
        text: {
          ko: String.raw`등비급수는 \(r < 1\)일 때 수렴하고 \(r \ge 1\)일 때 발산합니다. \(r = 2^{1-p} < 1\)은 \(1 - p < 0\), 즉 \(p > 1\)과 동치입니다 (\(p = 1\)이면 \(r = 1\)로 조화급수가 됩니다).`,
          en: String.raw`A geometric series converges for \(r < 1\) and diverges for \(r \ge 1\). And \(r = 2^{1-p} < 1\) is equivalent to \(1 - p < 0\), i.e. \(p > 1\) (for \(p = 1\), \(r = 1\) gives the harmonic series).`,
        },
      },
      {
        text: {
          ko: String.raw`응축 판정법에 따라 \(\sum \frac{1}{n^p}\)는 응축된 급수와 운명을 같이하므로, \(p > 1\)에서 수렴하고 \(p \le 1\)에서 발산합니다 (\(p \le 0\)인 경우는 일반항이 \(0\)으로 가지 않으므로 따로 발산합니다).`,
          en: String.raw`By the condensation test, \(\sum \frac{1}{n^p}\) shares its fate with the condensed series, so it converges for \(p > 1\) and diverges for \(p \le 1\) (for \(p \le 0\) the terms do not even tend to \(0\)).`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(p = 2\), 블록 \(n = 2\)): \(B_2 = \frac{1}{16} + \frac{1}{25} + \frac{1}{36} + \frac{1}{49} \approx 0.1507\), \(C_2 = 4 \cdot \frac{1}{16} = 0.25\), \(\frac{1}{2}C_3 = \frac{1}{2} \cdot 8 \cdot \frac{1}{64} = 0.0625\) — 캡션의 \(0.0625 \le 0.1507 \le 0.25\)와 일치하고, 응축 항은 정확히 \(2^{-n}\)입니다.`,
          en: String.raw`Numerical check (\(p = 2\), block \(n = 2\)): \(B_2 = \frac{1}{16} + \frac{1}{25} + \frac{1}{36} + \frac{1}{49} \approx 0.1507\), \(C_2 = 4 \cdot \frac{1}{16} = 0.25\), \(\frac{1}{2}C_3 = \frac{1}{2} \cdot 8 \cdot \frac{1}{64} = 0.0625\) — matching the caption's \(0.0625 \le 0.1507 \le 0.25\), and the condensed terms are exactly \(2^{-n}\).`,
        },
      },
    ],
  },
  {
    id: 'condensation-log',
    statement: {
      ko: String.raw`\(\sum_{n=2}^{\infty} \frac{1}{n \ln n}\)은 발산하지만 \(\sum_{n=2}^{\infty} \frac{1}{n (\ln n)^2}\)는 수렴함을 응축 판정법으로 보이세요.`,
      en: String.raw`Show that \(\sum_{n=2}^{\infty} \frac{1}{n \ln n}\) diverges while \(\sum_{n=2}^{\infty} \frac{1}{n (\ln n)^2}\) converges, using the condensation test.`,
    },
    display: [
      String.raw`2^n \cdot \frac{1}{2^n \ln 2^n} = \frac{1}{n \ln 2} = \frac{1}{\ln 2}\cdot\frac{1}{n}`,
      String.raw`2^n \cdot \frac{1}{2^n (\ln 2^n)^2} = \frac{1}{(\ln 2)^2}\cdot\frac{1}{n^2}`,
    ],
    preset: { series: 'inv-n-logn', block: 2 },
    presetCaption: {
      ko: String.raw`블록 \([4, 8)\): \(0.2404 = \frac{1}{2}C_3 \le B_2 \approx 0.4710 \le C_2 = \frac{1}{2\ln 2} \approx 0.7213\) — 응축된 급수는 조화급수의 상수배라 발산합니다.`,
      en: String.raw`Block \([4, 8)\): \(0.2404 = \frac{1}{2}C_3 \le B_2 \approx 0.4710 \le C_2 = \frac{1}{2\ln 2} \approx 0.7213\) — the condensed series is a constant multiple of the harmonic series, hence divergent.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 감소성을 검증합니다: \(x \ge 2\)에서 \(x \ln x\)의 도함수는 \(\ln x + 1 > 0\)이므로 \(x \ln x\)는 증가하고, 그 역수 \(a_n = \frac{1}{n \ln n}\)는 \(n \ge 2\)에서 감소하는 양수열입니다.

재인덱싱도 필요합니다: 문제 1의 응축은 \(n = 1\)부터 시작해 \(C_0\) 항을 포함하지만, 이 급수는 \(n = 2\)부터 시작하고 \(C_0 = \frac{1}{0 \cdot \ln 2}\)는 특이합니다.

따라서 응축된 합을 \(n \ge 1\)부터 시작합니다(\(C_n = 2^n a_{2^n}\), \(2^n \ge 2\)라 잘 정의됨; 유한 개의 항은 수렴성에 영향을 주지 않습니다).

응축하면 \(\ln 2^n = n \ln 2\)를 이용해 \(C_n = 2^n \cdot \frac{1}{2^n \cdot n \ln 2} = \frac{1}{\ln 2}\cdot\frac{1}{n}\) (\(n \ge 1\))이 되므로, 응축된 급수 \(\sum_{n \ge 1} C_n\)은 조화급수의 \(\frac{1}{\ln 2}\)배 — 발산합니다.

따라서 \(\sum_{n=2}^{\infty} \frac{1}{n \ln n}\)도 발산합니다.`,
          en: String.raw`First verify the decreasing hypothesis: for \(x \ge 2\), \(x \ln x\) has derivative \(\ln x + 1 > 0\), so \(x \ln x\) is increasing and its reciprocal \(a_n = \frac{1}{n \ln n}\) is decreasing and positive for \(n \ge 2\).

Reindexing is also needed: the condensation in problem 1 starts at \(n = 1\) and includes a \(C_0\) term, but this series starts at \(n = 2\) and \(C_0 = \frac{1}{0 \cdot \ln 2}\) is singular.

So start the condensed sum at \(n \ge 1\) (\(C_n = 2^n a_{2^n}\) with \(2^n \ge 2\) is well defined; finitely many terms do not affect convergence).

Condensing with \(\ln 2^n = n \ln 2\) gives \(C_n = 2^n \cdot \frac{1}{2^n \cdot n \ln 2} = \frac{1}{\ln 2}\cdot\frac{1}{n}\) for \(n \ge 1\), so the condensed series \(\sum_{n \ge 1} C_n\) is \(\frac{1}{\ln 2}\) times the harmonic series — divergent.

Hence \(\sum_{n=2}^{\infty} \frac{1}{n \ln n}\) diverges too.`,
        },
      },
      {
        text: {
          ko: String.raw`반면 \(b_n = \frac{1}{n (\ln n)^2}\)도 감소성을 검증해야 합니다: \(x \ge 2\)에서 \(x (\ln x)^2\)의 도함수는 \((\ln x)^2 + 2\ln x = \ln x (\ln x + 2) > 0\)이므로 \(n (\ln n)^2\)는 증가하고 그 역수 \(b_n\)은 감소합니다.

같은 재인덱싱(\(n \ge 1\)부터 응축)으로 \(b_n\)은 \(C_n = 2^n \cdot \frac{1}{2^n (n \ln 2)^2} = \frac{1}{(\ln 2)^2}\cdot\frac{1}{n^2}\) (\(n \ge 1\))로 응축됩니다.

\(\frac{1}{(\ln 2)^2} \approx 2.0814\)는 상수이므로, 응축된 급수는 수렴하는 \(\sum_{n \ge 1} \frac{1}{n^2}\)의 상수배 — 실제로 \(\frac{1}{(\ln 2)^2}\cdot\frac{\pi^2}{6} \approx 2.0814 \cdot 1.6449 \approx 3.4237\)로 수렴합니다.

따라서 \(\sum_{n=2}^{\infty} \frac{1}{n (\ln n)^2}\)는 수렴합니다.`,
          en: String.raw`But \(b_n = \frac{1}{n (\ln n)^2}\) also needs the decreasing verification: for \(x \ge 2\), \(x (\ln x)^2\) has derivative \((\ln x)^2 + 2\ln x = \ln x (\ln x + 2) > 0\), so \(n (\ln n)^2\) is increasing and its reciprocal \(b_n\) is decreasing.

With the same reindexing (condense from \(n \ge 1\)), \(b_n\) condenses to \(C_n = 2^n \cdot \frac{1}{2^n (n \ln 2)^2} = \frac{1}{(\ln 2)^2}\cdot\frac{1}{n^2}\) for \(n \ge 1\).

Since \(\frac{1}{(\ln 2)^2} \approx 2.0814\) is a constant, the condensed series is a constant multiple of the convergent \(\sum_{n \ge 1} \frac{1}{n^2}\) — indeed summing to \(\frac{1}{(\ln 2)^2}\cdot\frac{\pi^2}{6} \approx 2.0814 \cdot 1.6449 \approx 3.4237\).

Hence \(\sum_{n=2}^{\infty} \frac{1}{n (\ln n)^2}\) converges.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (첫 번째 급수, 블록 \(n = 2\)): \(B_2 = \sum_{k=4}^{7} \frac{1}{k \ln k} \approx 0.4710\), \(C_2 = \frac{1}{2\ln 2} \approx 0.7213\), \(\frac{1}{2}C_3 = \frac{1}{6\ln 2} \approx 0.2404\) — 캡션의 \(0.2404 \le 0.4710 \le 0.7213\)과 일치합니다. \(\ln\)의 거듭제곱 한 칸이 수렴·발산을 가르는 경계입니다.`,
          en: String.raw`Numerical check (first series, block \(n = 2\)): \(B_2 = \sum_{k=4}^{7} \frac{1}{k \ln k} \approx 0.4710\), \(C_2 = \frac{1}{2\ln 2} \approx 0.7213\), \(\frac{1}{2}C_3 = \frac{1}{6\ln 2} \approx 0.2404\) — matching the caption's \(0.2404 \le 0.4710 \le 0.7213\). One extra power of \(\ln\) is exactly the borderline between divergence and convergence.`,
        },
      },
    ],
  },
];
